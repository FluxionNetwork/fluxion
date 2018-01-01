#!/bin/bash

if [ -f "/etc/gentoo-release" ]; then
  PackageManagerCLT="emerge"
  PackageManagerCLTInstallOptions="-s"
  PackageManagerCLTRemoveOptions=""

  PackageManagerOutputDevice="/dev/stdout"

  PackageManagerLog="/tmp/lib_package_manager.log"

  function unprep_package_manager() {
    echo "Nothing to unprepare." >$PackageManagerOutputDevice
  }

  function prep_package_manager() {
    echo "Nothing to prepare." >$PackageManagerOutputDevice
  }
fi

# FLUXSCRIPT END
