#!/bin/bash

if [ -f "/etc/redhat-release" ]; then
  PackageManagerCLT="yum"
  PackageManagerCLTInstallOptions="-y install"
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
