#!/usr/bin/env bash

clear
declare -r HEADER_SIZE="####"

# Diagnostic script

if [ -d "lib" ];then
	source lib/InterfaceUtils.sh
    source lib/ChipsetUtils.sh
elif [ -d "../lib" ];then
	source ../lib/InterfaceUtils.sh
    source ../lib/ChipsetUtils.sh
else
  echo -e "\033[31mError lib folder not found\033[0m"
  exit 1
fi

if [ ! "$1" ]; then
  echo -e "\033[32mUsage ./scripts/diagnostics [wireless_interface]\033[0m"
  exit 1
fi

echo "$HEADER_SIZE FLUXION Info"
if [ -f "fluxion.sh" ];then
	declare -r FLUXIONInfo=($(grep -oE "FLUXION(Version|Revision)=[0-9]+" fluxion.sh))
else
	declare -r FLUXIONInfo=($(grep -oE "FLUXION(Version|Revision)=[0-9]+" ../fluxion.sh))
fi

echo "FLUXION V${FLUXIONInfo[0]/*=/}.${FLUXIONInfo[1]/*=/}"
echo -ne "\n\n"

echo "$HEADER_SIZE BASH Info "
bash --version
echo "**Path:** $(ls -L $(which bash))"
echo -ne "\n\n"

echo "$HEADER_SIZE Interface ($1) Info "
if interface_physical "$1";then
	echo "**Device**: $InterfacePhysical"
else
	echo "**Device:** Unknown"
fi

if interface_driver "$1";then
	echo "**Driver:** $InterfaceDriver"
else
	echo "**Driver:** Unsupported"
fi

if interface_chipset "$1";then
	echo "**Chipset:** $InterfaceChipset"
else
	echo "**Chipset:** Unknown"
fi

if iw list | grep monitor | head -n 1 | tail -n 1 &>/dev/null;then
	echo "**Master Modes** Yes"
else
	echo "**Master Modes** No"
fi

echo -n "**Injection Test:** "
aireplay-ng --test "$1" | grep -oE "Injection is working!|No Answer..." || echo -e "\033[31mFailed\033[0m"
echo -ne "\n\n"

echo "$HEADER_SIZE XTerm Infos"
echo "**Version:** $(xterm -version)"
echo "**Path:** $(ls -L $(which xterm))"
echo -n "Test: "
if xterm -hold -fg "#FFFFFF" -bg "#000000" -title "XServer/XTerm Test" -e "echo \"XServer/XTerm test: close window to continue...\"" &>/dev/null; then echo "XServer/XTerm success!"
else
	echo -e "\033[31m XServer/XTerm failure!\033[0m"
fi
echo -ne "\n\n"

echo "$HEADER_SIZE HostAPD Info"
hostapd -v
echo "Path: $(ls -L $(which hostapd))"
echo -ne "\n\n"

echo "$HEADER_SIZE Aircrack-ng Info"
aircrack-ng -H | head -n 4
echo -ne "\n"

echo "$HEADER_SIZE Pyrit Info"
scapyver=$(python2 -c "import scapy; print(scapy.VERSION)")
pyrit | head -n 3
echo "**Scapy Version:** ${scapyver}"

if [[ "$scapyver" != 2.3.? ]]; then
    echo -e "\033[31mWarning: Pyrit has been reported to be incompatible with scapy version 2.4.0 and above. Consult the wiki for further information. This should not affect you, if you don't choose to use pyrit in the script.\033[0m"
fi

echo -ne "\n"

# System info
echo "$HEADER_SIZE System Info"
if [ -r "/proc/version" ]; then
	echo "**Chipset:** $(cat /proc/version)"
else
	echo "**Chipset:** $(uname -r)"
fi

echo -ne "\n"
echo "$HEADER_SIZE Chipset"
chipset=$(airmon-ng | grep $1 | awk '{print $3}')

echo "Chipset: $chipset"
check_chipset $chipset
