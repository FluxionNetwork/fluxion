#!/usr/bin/env bash

if [ -f "/etc/gentoo-release" ]; then
  PackageManagerCLT="emerge"
  PackageManagerCLTInstallOptions="-s"
  PackageManagerCLTRemoveOptions=""

  PackageManagerOutputDevice="/dev/stdout"

  unprep_package_manager() {
    echo "Nothing to unprepare." >$PackageManagerOutputDevice
  }

  prep_package_manager() {
    echo "Nothing to prepare." >$PackageManagerOutputDevice
  }
fi

# FLUXSCRIPT END
