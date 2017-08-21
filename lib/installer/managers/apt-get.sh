#!/bin/bash

if [ -f "/etc/debian_version" ]
	PackageManagerCLT="apt-get"
	PackageManagerCLTInstallOptions="install -y"
	PackageManagerCLTRemoveOptions="remove -y"

	PackageManagerOutputDevice="/dev/stdout"

	function unprep_package_manager() {
		echo "$(cat /etc/apt/sources.list | grep -v 'deb http://http.kali.org/kali kali-rolling main contrib non-free # Installed By FLUXION')" > /etc/apt/sources.list
	}

	function prep_package_manager() {
		if [ ! "`(cat /etc/apt/sources.list | grep 'deb http://http.kali.org/kali kali-rolling main contrib non-free'`" ]; then
		    gpg --keyserver hkp://keys.gnupg.net --recv-key 7D8D0BF6
		    apt-key adv --keyserver pgp.mit.edu --recv-keys ED444FF07D8D0BF6
		    echo "deb http://http.kali.org/kali kali-rolling main contrib non-free # Installed By FLUXION" >> /etc/apt/sources.list
		fi

		# Cleanup package manager
		sudo apt-get install -f -y | tee -a $PackageManagerOutputDevice
		sudo apt-get autoremove -y | tee -a $PackageManagerOutputDevice
		sudo apt-get autoclean -y | tee -a $PackageManagerOutputDevice
		sudo apt-get clean -y | tee -a $PackageManagerOutputDevice
		sudo apt-get update | tee -a $PackageManagerOutputDevice
	}
fi

# FLUXSCRIPT END
