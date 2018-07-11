#!/usr/bin/env bash

if [ -f "/etc/redhat-release" ]; then
  PackageManagerCLT="yum"
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
