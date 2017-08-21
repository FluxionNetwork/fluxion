#!/bin/bash

if [ -f "/etc/gentoo-release" ]
	PackageManagerCLT="emerge"
	PackageManagerCLTInstallOptions="-s"
	PackageManagerCLTRemoveOptions=""

	PackageManagerOutputDevice="/dev/stdout"

	function unprep_package_manager() {
		echo "Nothing to unprepare." > $PackageManagerOutputDevice
	}

	function prep_package_manager() {
		echo "Nothing to prepare." > $PackageManagerOutputDevice
	}
fi

# FLUXSCRIPT END
