#!/bin/bash

if [ -f "/etc/SuSE-release" ]
	PackageManagerCLT="zypp"
	PackageManagerCLTInstallOptions="install"
	PackageManagerCLTRemoveOptions="remove"

	PackageManagerOutputDevice="/dev/stdout"

	function unprep_package_manager() {
		echo "Nothing to unprepare." > $PackageManagerOutputDevice
	}

	function prep_package_manager() {
		echo "Nothing to prepare." > $PackageManagerOutputDevice
	}
fi

# FLUXSCRIPT END
