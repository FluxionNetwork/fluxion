#!/bin/bash

#if [ "$InterfaceUtilsVersion" ]; then return 0; fi
#readonly InterfaceUtilsVersion="1.0"

# The methods used in this script are taken from airmon-ng.
# This is all thanks for the airmon-ng authors, thanks guys.
InterfaceUtilsOutputDevice="/dev/stdout"

if [ -d /sys/bus/usb ] # && hash lsusb;
  then InterfaceUSBBus=1
fi

if [ -d /sys/bus/pci ] || [ -d /sys/bus/pci_express ] || [ -d /proc/bus/pci ] # && hash lspci;
	then InterfacePCIBus=1
fi

# Checks if the interface belongs to a physical device.
function interface_is_real() {
  if [ -d /sys/class/net/$1/device ]; then return 0
  else return 1
  fi
}

# Checks if the interface belongs to a wireless device.
function interface_is_wireless() {
  if grep -qs "DEVTYPE=wlan" /sys/class/net/$1/uevent; then return 0
  else return 1
  fi
}

# Returns an array of absolutely all interfaces.
# Notice: That includes interfaces such as the loopback interface.
function interface_list_all() {
  InterfaceListAll=(/sys/class/net/*)
  InterfaceListAll=("${InterfaceListAll[@]//\/sys\/class\/net\//}")
}

# Returns an array of interfaces pertaining to a physical device.
function interface_list_real() {
  InterfaceListReal=()
  interface_list_all
  local __interface_list_real__candidate
  for __interface_list_real__candidate in "${InterfaceListAll[@]}"; do
    if interface_is_real $__interface_list_real__candidate; then InterfaceListReal+=("$__interface_list_real__candidate")
    fi
  done
}

# Returns an array of interfaces pertaining to a wireless device.
function interface_list_wireless() {
  InterfaceListWireless=()
  interface_list_all
  local __interface_list_wireless__candidate
  for __interface_list_wireless__candidate in "${InterfaceListAll[@]}"; do
    if interface_is_wireless $__interface_list_wireless__candidate; then InterfaceListWireless+=("$__interface_list_wireless__candidate")
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
    if [ -r "$interface_physical_path/name" ]; then InterfacePhysical="$(cat "$interface_physical_path/name")"
    fi
    if [ ! "${InterfacePhysical// /}" ]; then InterfacePhysical="$(ls -l "$interface_physical_path" | sed 's/^.*\/\([a-zA-Z0-9_-]*\)$/\1/')"
    fi
  fi

  if [ ! "$InterfacePhysical" ]; then return 2; fi
}

function interface_hardware() {
  if [ ! "$1" ]; then return 1; fi

  local __interface_hardware__device="/sys/class/net/$1/device"
  local __interface_hardware__hwinfo="$__interface_hardware__device/modalias"

  InterfaceHardwareBus="$(cut -d ":" -f 1 "$__interface_hardware__hwinfo" 2>$InterfaceUtilsOutputDevice)"

  case "$InterfaceHardwareBus" in
  "usb") # Wanted to replace the line below with awk, but i'll probably just add complexity & issues (mawk vs gawk).
    InterfaceHardwareID="$(cut -d ":" -f 2 $__interface_hardware__hwinfo | cut -b 1-10 | sed 's/^.//;s/p/:/')"
    ;;
  "pci" | "pcmcia" | "sdio")
    InterfaceHardwareID="$(cat "$__interface_hardware__device/vendor" 2>$InterfaceUtilsOutputDevice):$(cat "$__interface_hardware__device/device" 2>$InterfaceUtilsOutputDevice)"
    ;;
  default) # The following will only work for USB devices.
    InterfaceHardwareID="$(cat "$__interface_hardware__device/idVendor" 2>$InterfaceUtilsOutputDevice):$(cat "$__interface_hardware__device/idProduct" 2>$InterfaceUtilsOutputDevice)"
    InterfaceHardwareBus="usb"
    ;; # This will be reset below if InterfaceHardwareID is invalid.
  esac

  # Check for invalid InterfaceHardwareID (starts or ends with :) .. not a happy face, still won't quote it.
  if echo "$InterfaceHardwareID" | egrep -q "^:|:$"; then
    unset InterfaceHardwareID
    unset InterfaceHardwareBus
    return 2
  else
    # Remove any extraneous hex markers.
    InterfaceHardwareID=${InterfaceHardwareID//0x/}
  fi
}

function interface_chipset() {
  if [ ! "$1" ]; then return 1; fi

  if ! interface_hardware "$1"; then return 2; fi

  case "$InterfaceHardwareBus" in
  "usb")
    if [ ! "$InterfaceUSBBus" ]; then return 3; fi
    InterfaceChipset="$(lsusb -d "$InterfaceHardwareID" | head -n1 - | cut -f3- -d ":" | sed 's/^....//;s/ Network Connection//g;s/ Wireless Adapter//g;s/^ //')"
    ;;
  "pci" | "pcmcia")
    if [ ! "$InterfacePCIBus" ]; then return 4; fi
    InterfaceChipset="$(lspci -d $InterfaceHardwareID | cut -f3- -d ":" | sed 's/Wireless LAN Controller //g;s/ Network Connection//g;s/ Wireless Adapter//;s/^ //')"
    ;;
  "sdio")
    if [[ "${InterfaceHardwareID,,}" == "0x02d0"* ]]; then InterfaceChipset=$(printf "Broadcom %d" ${InterfaceHardwareID:7})
    else InterfaceChipset="Unknown chipset for SDIO device."
    fi
    ;;
  default)
    InterfaceChipset="Unknown device chipset & device bus."
    ;;
  esac
}

function interface_state() {
  if [ ! "$1" ]; then return 1; fi
  local __interface_state__stateFile="/sys/class/net/$1/operstate"

  if [ ! -f "$__interface_state__stateFile" ]; then return 2; fi
  InterfaceState=$(cat "$__interface_state__stateFile")
}

function interface_set_state() {
  if [ "${#@}" -ne 2 ]; then return 1; fi
  ip link set "$1" "$2"
}

function interface_set_mode() {
  if [ "${#@}" -ne 2 ]; then return 1; fi
  if ! interface_set_state "$1" "down"; then return 2; fi
  if ! iwconfig "$1" mode "$2" &>$InterfaceUtilsOutputDevice; then return 3; fi
  if ! interface_set_state "$1" "up"; then return 4; fi
}

function interface_prompt() {
  if [ -z "$1" -o -z "$2" ]; then return 1; fi

  local __interface_prompt__ifAvailable=("${!2}")
  local __interface_prompt__ifAvailableInfo=()
  local __interface_prompt__ifAvailableColor=()
  local __interface_prompt__ifAvailableState=()

  local __interface_prompt__ifCandidate
  for __interface_prompt__ifCandidate in "${__interface_prompt__ifAvailable[@]}"; do
    interface_chipset "$__interface_prompt__ifCandidate"
    __interface_prompt__ifAvailableInfo+=("$InterfaceChipset")

    interface_state "$__interface_prompt__ifCandidate"

    if [ "$InterfaceState" = "up" ]; then
      __interface_prompt__ifAvailableColor+=("$CPrp")
      __interface_prompt__ifAvailableState+=("[-]")
    else
      __interface_prompt__ifAvailableColor+=("$CClr")
      __interface_prompt__ifAvailableState+=("[+]")
    fi
  done

  # The following conditional is required since io_query_format_fields
  # only considers the the size of the first parameter, available color.
  if [ "$6" ]; then # Add alternative choices
    __interface_prompt__ifAvailable+=("${!3}")
    __interface_prompt__ifAvailableInfo+=("${!4}")
    __interface_prompt__ifAvailableState+=("${!5}")
    __interface_prompt__ifAvailableColor+=("${!6}")
  fi

  # If only one interface exists and it's available, choose it.
  if [ "${#__interface_prompt__ifAvailable[@]}" -eq 1 -a "${__interface_prompt__ifAvailableState[0]}" = "[+]" ]; then
    InterfacePromptWISelected="${__interface_prompt__ifAvailable[0]}"
    InterfacePromptWISelectedState="[+]" # It passed the condition, it must be +
    InterfacePromptWISelectedInfo="${__interface_prompt__ifAvailableInfo[0]}"
  else
    format_apply_autosize "$CRed[$CSYel%1d$CClr$CRed]%b %-8b %3s$CClr %-*.*s\n"
    io_query_format_fields "$1" "$FormatApplyAutosize" \
      __interface_prompt__ifAvailableColor[@] __interface_prompt__ifAvailable[@] \
      __interface_prompt__ifAvailableState[@] __interface_prompt__ifAvailableInfo[@]

    echo

    InterfacePromptIfSelected="${IOQueryFormatFields[1]}"
    InterfacePromptIfSelectedState="${IOQueryFormatFields[2]}"
    InterfacePromptWISelectedInfo="${IOQueryFormatFields[3]}"
  fi
}
