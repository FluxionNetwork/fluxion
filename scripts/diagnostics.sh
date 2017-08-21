#!/bin/bash

source lib/InterfaceUtils.sh

if [ ! "$1" ]
then echo "Usage ./scripts/diagnostics <wireless_interface>"; exit 1
fi

echo "[ FLUXION Info ]"
declare -r FLUXIONInfo=($(egrep "^FLUXION(Version|Revision)" fluxion.sh))
echo "FLUXION V${FLUXIONInfo[0]/*=/}.${FLUXIONInfo[1]/*=/}"
echo -ne "\n\n"

echo "[ BASH Info ]"
bash --version
echo "Path: `ls -L $(which bash)`"
echo -ne "\n\n"

echo "[ Interface ($1) Info ]"
if interface_physical "$1"
then echo "Device: $InterfacePhysical"
else echo "Device: Unknown"
fi

if interface_driver "$1"
then echo "Driver: $InterfaceDriver"
else echo "Driver: Unsupported"
fi

if interface_chipset "$1"
then echo "Chipset: $InterfaceChipset"
else echo "Chipset: Unknown"
fi

echo

aireplay-ng --test "$1"
echo -ne "\n\n"

echo "[ XTerm Info ]"
echo "Version: `xterm -version`"
echo "Path: `ls -L $(which xterm)`"
echo -ne "\n\n"

echo "[ HostAPD Info ]"
hostapd -v
echo "Path: `ls -L $(which hostapd)`"
echo -ne "\n\n"

echo "[ Aircrack-ng Info ]"
aircrack-ng -H | head -n 4
echo -ne "\n\n"

echo "[ System Info ]"
if [ -r "/proc/version" ]
then cat /proc/version
else uname -r
fi
