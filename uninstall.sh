#!/usr/bin/env bash
# Uninstall packages that Fluxion installed, without touching pre-existing ones.
set -euo pipefail

readonly FLUXIONPath=$(dirname "$(readlink -f "$0")")
readonly FLUXIONLibPath="$FLUXIONPath/lib"
readonly InstallerUtilsInstalledPackagesFile="$FLUXIONPath/preferences/installed_packages.list"

if [ $EUID -ne 0 ]; then
  echo "Please run as root to uninstall packages." >&2
  exit 1
fi

if [ ! -s "$InstallerUtilsInstalledPackagesFile" ]; then
  echo "No recorded Fluxion-installed packages to uninstall." >&2
  exit 0
fi

# Load installer utils and managers to detect package manager and helpers.
source "$FLUXIONLibPath/installer/InstallerUtils.sh"

# If no manager was set via sourcing, try to detect.
if [ -z "${PackageManagerCLT:-}" ]; then
  for manager in "$FLUXIONLibPath"/installer/managers/*; do
    source "$manager"
    [ -n "${PackageManagerCLT:-}" ] && break
  done
fi

if [ -z "${PackageManagerCLT:-}" ]; then
  echo "No supported package manager detected; cannot uninstall." >&2
  exit 2
fi

if ! type -t installer_utils_package_installed &>/dev/null; then
  echo "Package detection helper unavailable; aborting." >&2
  exit 3
fi

while IFS= read -r entry; do
  [ -z "$entry" ] && continue
  manager="${entry%%:*}"
  pkg="${entry#*:}"

  # Only attempt removal if the current manager matches the recorded one.
  if [ "$manager" != "$PackageManagerCLT" ]; then
    continue
  fi

  if installer_utils_package_installed "$pkg"; then
    echo "Removing $pkg (installed by Fluxion)" >&2
    $PackageManagerCLT $PackageManagerCLTRemoveOptions "$pkg" || true
  fi

done < "$InstallerUtilsInstalledPackagesFile"

# Cleanup record so repeated runs don't keep trying the same packages.
> "$InstallerUtilsInstalledPackagesFile"

echo "Fluxion uninstall process finished." >&2
