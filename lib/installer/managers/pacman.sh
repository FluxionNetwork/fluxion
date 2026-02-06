#!/usr/bin/env bash

if [ -f "/etc/arch-release" ]; then
  #Last entry is the default package manager to use (pacman)
  AurHelpers="pacaur yaourt pacman"
  for AurHelper in $AurHelpers; do
    if [ "$(pacman -Qs $AurHelper)" ]; then
      PackageManagerCLT=$AurHelper
      break
    fi
  done
  # Only default to pacman if no AUR helper was found
  if [ -z "$PackageManagerCLT" ]; then
    PackageManagerCLT='pacman'
  fi
  PackageManagerCLTInstallOptions="-S --noconfirm"
  PackageManagerCLTRemoveOptions="-Rs"

  PackageManagerOutputDevice="/dev/stdout"

  unprep_package_manager() {
    echo "Nothing to unprepare." >$PackageManagerOutputDevice
  }

  check_package_manager() {
    if [ -f "/var/lib/pacman/db.lck" ];then echo -e "[\033[31m!\033[0m] Pacman is locked, can't install dependencies."; return 4; fi
  }

  prep_package_manager() {
    echo "Nothing to prepare." >$PackageManagerOutputDevice
  }
fi

# FLUXSCRIPT END
