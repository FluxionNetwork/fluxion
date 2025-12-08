#!/usr/bin/env bash

if [ -f "/etc/redhat-release" ]; then
  # Detect dnf (Fedora 22+) or fall back to yum for older systems
  if command -v dnf &> /dev/null; then
    PackageManagerCLT="dnf"
  else
    PackageManagerCLT="yum"
  fi
  
  PackageManagerCLTInstallOptions="-y install"
  PackageManagerCLTRemoveOptions="remove"

  PackageManagerOutputDevice="/dev/stdout"

  unprep_package_manager() {
    echo "Nothing to unprepare." >$PackageManagerOutputDevice
  }

  check_package_manager () {
    echo "Nothing to check." >$PackageManagerOutputDevice
  }

  prep_package_manager() {
    echo "Nothing to prepare." >$PackageManagerOutputDevice
  }
fi

# FLUXSCRIPT END
