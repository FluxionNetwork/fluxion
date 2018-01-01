#!/bin/bash

if [ -f "/etc/debian_version" ]; then
  PackageManagerCLT="apt"
  PackageManagerCLTInstallOptions="install -y"
  PackageManagerCLTRemoveOptions="remove -y"

  PackageManagerOutputDevice="/dev/stdout"

  PackageManagerLog="/tmp/lib_package_manager.log"

  function unprep_package_manager() {
    echo "$(cat /etc/apt/sources.list | grep -v 'deb http://http.kali.org/kali kali-rolling main non-free contrib # Installed By FLUXION')" >/etc/apt/sources.list
  }

  function prep_package_manager() {
    if [ ! "$(cat /etc/apt/sources.list | egrep 'deb http://http.kali.org/kali ((kali-rolling|main|contrib|non-free) )*')" ]; then
      echo "Adding missing sources to package manager, please wait."

      echo "Adding keys.gnupg.net key, please wait."
      if ! gpg --keyserver hkp://keys.gnupg.net --recv-key 7D8D0BF6 &>/dev/null; then
        echo "ERROR: Failed to fetch or add the source key!"
        return 1
      fi

      echo "Adding pgp.mit.edu key, please wait."
      if ! apt-key adv --keyserver pgp.mit.edu --recv-keys ED444FF07D8D0BF60 &>/dev/null; then
        echo "ERROR: Failed to fetch or add the source key!"
        return 1
      fi

      echo "deb http://http.kali.org/kali kali-rolling main non-free contrib # Installed By FLUXION" >>/etc/apt/sources.list
    fi

    # Cleanup package manager
    sudo apt-get install -f -y | tee -a $PackageManagerLog
    sudo apt-get autoremove -y | tee -a $PackageManagerLog
    sudo apt-get autoclean -y | tee -a $PackageManagerLog
    sudo apt-get clean -y | tee -a $PackageManagerLog
    sudo apt-get update | tee -a $PackageManagerLog
  }
fi

# FLUXSCRIPT END
