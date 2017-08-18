#!/bin/bash

# The methods used in this script are taken from airmon-ng.
# This is all thanks for the airmon-ng authors, thanks guys.

InterfaceUtilsOutputDevice="/dev/stdout"

if [ -d /sys/bus/usb ] # && hash lsusb
then InterfaceUSBBus=1
fi

if [ -d /sys/bus/pci ] || [ -d /sys/bus/pci_express ] || [ -d /proc/bus/pci ] # && hash lspci
then InterfacePCIBus=1
fi

function interface_list_all() {
	InterfaceListAll=($(ls -1 /sys/class/net))
}

function interface_list_wireless() {
	InterfaceListWireless=()
	interface_list_all
	local __interface_list_wireless__candidate
	for __interface_list_wireless__candidate in "${InterfaceListAll[@]}"; do
		if grep -qs "DEVTYPE=wlan" /sys/class/net/$__interface_list_wireless__candidate/uevent
		then InterfaceListWireless+=("$__interface_list_wireless__candidate")
		fi
	done
}

function interface_driver() {
	InterfaceDriver=$(basename $(readlink /sys/class/net/$1/device/driver))
}

function interface_physical() {
	if [ ! "$1" ]; then return 1; fi

	unset InterfacePhysical

	local -r interface_physical_path="/sys/class/net/$1/phy80211"

	if [ -d "$interface_physical_path" ]; then
		if [ -r "$interface_physical_path/name" ]
		then InterfacePhysical="`cat "$interface_physical_path/name"`"
		else InterfacePhysical="`ls -l "$interface_physical_path" | sed 's/^.*\/\([a-zA-Z0-9_-]*\)$/\1/'`"
		fi
	fi

	if [ ! "$InterfacePhysical" ]; then return 2; fi
}

function interface_hardware() {
	if [ ! "$1" ]; then return 1; fi

	local __interface_hardware__device="/sys/class/net/$1/device"
	local __interface_hardware__hwinfo="$__interface_hardware__device/modalias"

	InterfaceHardwareBus="`cut -d ":" -f 1 "$__interface_chipset__hwinfo" 2> $InterfaceUtilsOutputDevice`"

	case "$InterfaceHardwareBus" in
		"usb") # Wanted to replace the line below with awk, but i'll probably just add complexity & issues (mawk vs gawk).
			InterfaceHardwareID="`cut -d ":" -f 2 $__interface_chipset__hwinfo | cut -b 1-10 | sed 's/^.//;s/p/:/'`";;
		"pci" | "pcmcia" | "sdio")
			InterfaceHardwareID="`cat "$__interface_hardware__device/vendor" 2> $InterfaceUtilsOutputDevice`:`cat "$__interface_hardware__device/device" 2> $InterfaceUtilsOutputDevice`";;
		default) # The following will only work for USB devices.
			InterfaceHardwareID="`cat "$__interface_hardware__device/idVendor" 2> $InterfaceUtilsOutputDevice`:`cat "$__interface_hardware__device/idProduct" 2> $InterfaceUtilsOutputDevice`";;
			InterfaceHardwareBus="usb" # This will be reset below if InterfaceHardwareID is invalid.
	esac

	# Check for invalid InterfaceHardwareID (starts or ends with :) .. not a happy face, still won't quote it.
	if echo "$InterfaceHardwareID" | egrep -q "^:|:$"; then
		unset InterfaceHardwareID
		unset InterfaceHardwareBus
		return 2
	fi
}

function interface_chipset() {
	if [ ! "$1" ]; then return 1; fi

	if ! interface_hardware	"$1"; then return 2; fi

	case "$InterfaceHardwareBus" in
		"usb")
			if [ ! "$InterfaceUSBBus" ]; then return 3; fi
			InterfaceChipset="`lsusb -d "$InterfaceHardwareID" | head -n1 - | cut -f3- -d ":" | sed 's/^....//;s/ Network Connection//g;s/ Wireless Adapter//g;s/^ //'`"
		"pci" | "pcmcia")
			if [ ! "$InterfacePCIBus" ]; then return 4; fi
			InterfaceChipset="$(lspci -d $InterfaceHardwareID | cut -f3- -d ":" | sed 's/Wireless LAN Controller //g;s/ Network Connection//g;s/ Wireless Adapter//;s/^ //')"
		"sdio")
			if [[ "${InterfaceHardwareID,,}" = "0x02d0"* ]]
			then InterfaceChipset=$(printf "Broadcom %d" ${InterfaceHardwareID:7})
			else InterfaceChipset="Unknown chipset for SDIO device."
			fi;;
		default)
			InterfaceChipset="Unknown device chipset & device bus."
	esac
}

