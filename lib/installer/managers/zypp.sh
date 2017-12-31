#!/bin/bash

if [ -f "/etc/SuSE-release" ]; then
  PackageManagerCLT="zypp"
  PackageManagerCLTInstallOptions="install"
  PackageManagerCLTRemoveOptions="remove"

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
