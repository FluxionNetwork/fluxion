#!/usr/bin/env bash

if [ -f "/etc/debian_version" ]; then
  PackageManagerCLT="apt"
  PackageManagerCLTInstallOptions="install -y"
  PackageManagerCLTRemoveOptions="remove -y"

  PackageManagerOutputDevice="/dev/stdout"

  unprep_package_manager() {
    echo "$(cat /etc/apt/sources.list | grep -v 'deb http://http.kali.org/kali kali-rolling main non-free contrib # Installed By FLUXION')" >/etc/apt/sources.list
  }

  check_package_manager() {
    echo "Nothing to check." >$PackageManagerOutputDevice
  }

  prep_package_manager() {
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
    apt-get install -f -y | tee -a $PackageManagerLog
    apt-get autoremove -y | tee -a $PackageManagerLog
    apt-get autoclean -y | tee -a $PackageManagerLog
    apt-get clean -y | tee -a $PackageManagerLog
    apt-get update | tee -a $PackageManagerLog
  }
fi

# FLUXSCRIPT END
