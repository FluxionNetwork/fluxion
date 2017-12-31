#!/bin/bash

if [ -f "/etc/arch-release" ]; then
  #Last entry is the default package manager to use (pacman)
  AurHelpers="pacaur yaourt pacman"
  for AurHelper in $AurHelpers; do
    if [ "$(pacman -Qs $AurHelper)" ]; then
      PackageManagerCLT=$AurHelper
      break
    fi
  done
  PackageManagerCLT='pacman'
  PackageManagerCLTInstallOptions="-S --noconfirm"
  PackageManagerCLTRemoveOptions="-Rs"

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
