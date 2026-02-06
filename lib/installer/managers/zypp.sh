#!/usr/bin/env bash

if [ -f "/etc/os-release" ] && grep -qi "suse\|opensuse" /etc/os-release 2>/dev/null; then
  PackageManagerCLT="zypper"
  PackageManagerCLTInstallOptions="install"
  PackageManagerCLTRemoveOptions="remove"

  PackageManagerOutputDevice="/dev/stdout"

  unprep_package_manager() {
    echo "Nothing to unprepare." >$PackageManagerOutputDevice
  }

  check_package_manager() {
    echo "Nothing to check." >$PackageManagerOutputDevice
  }

  prep_package_manager() {
    echo "Nothing to prepare." >$PackageManagerOutputDevice
  }
fi

# FLUXSCRIPT END
