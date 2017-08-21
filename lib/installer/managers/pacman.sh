#!/bin/bash

if [ -f "/etc/arch-release" ]
	PackageManagerCLT="pacman"
	PackageManagerCLTInstallOptions="-S -y"
	PackageManagerCLTRemoveOptions="-Rs"

	PackageManagerOutputDevice="/dev/stdout"

	function unprep_package_manager() {
		echo "Nothing to unprepare." > $PackageManagerOutputDevice
	}

	function prep_package_manager() {
		echo "Nothing to prepare." > $PackageManagerOutputDevice
	}
fi

# FLUXSCRIPT END
