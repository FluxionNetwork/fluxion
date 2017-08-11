#!/bin/bash

################################ < FLUXION Parameters  > ################################
# NOTE: The FLUXIONPath constant will not be populated correctly if the script is called
# directly via a symlink. Symlinks in the path to the script should work completely fine.
FLUXIONPath="$( cd "$(dirname "$0")" ; pwd -P )"

FLUXIONWorkspacePath="/tmp/fluxspace"
FLUXIONHashPath="$FLUXIONPath/attacks/Handshake Snooper/handshakes"
FLUXIONScanDB="dump"

FLUXIONNoiseFloor=-90
FLUXIONNoiseCeiling=-60

FLUXIONVersion=3
FLUXIONRevision=0

FLUXIONDebug=${FLUXIONDebug:+1}
FLUXIONDropNet=${FLUXIONDropNet:+1}
FLUXIONAuto=${FLUXION_AUTO:+1}

# FLUXIONDebug [Normal Mode "" / Developer Mode 1]
export FLUXIONOutputDevice=$([ $FLUXIONDebug ] && echo "/dev/stdout" || echo "/dev/null")

FLUXIONHoldXterm=$([ $FLUXIONDebug ] && echo "-hold" || echo "")

################################# < Shell Color Codes > ################################
CRed="\033[1;31m"
CGrn="\033[1;32m"
CYel="\033[1;33m"
CBlu="\033[1;34m"
CPrp="\033[5;35m"
CCyn="\033[5;36m"
CGry="\033[0;37m"
CWht="\033[1;37m"
CClr="\e[0m"

################################ < FLUXION Parameters  > ################################
FLUXIONPrompt="$CRed[${CBlu}fluxion$CYel@$CClr$HOSTNAME$CRed]-[$CYel~$CRed]$CClr "
FLUXIONVLine="$CRed[$CYel*$CRed]$CClr"

################################# < Library Includes  > #################################
source lib/SandboxUtils.sh
source lib/IOUtils.sh
source lib/HashUtils.sh

source language/English.lang

################################ < Library Parameters  > ################################
SandboxWorkspacePath="$FLUXIONWorkspacePath"
SandboxOutputDevice="$FLUXIONOutputDevice"

IOUtilsHeader="fluxion_header"
IOUtilsQueryMark="$FLUXIONVLine"
IOUtilsPrompt="$FLUXIONPrompt"

HashOutputDevice="$FLUXIONOutputDevice"

#########################################################################################
if [[ $EUID -ne 0 ]]; then
	echo -e "${CRed}You don't have admin privilegies, execute the script as root.$CClr"
	exit 1
fi

if [ -z "${DISPLAY:-}" ]; then
    echo -e "${CRed}The script should be exected inside a X (graphical) session.$CClr"
    exit 1
fi

function exitmode() {
	if [ ! $FLUXIONDebug ]; then
		fluxion_header

		echo -e "\n\n$CWht[$CRed-$CWht]$CRed $FLUXIONCleanupAndClosingNotice$CClr"

		local processes
		readarray processes < <(ps -A)
		
		# Currently, fluxion is only responsible for killing airodump-ng, 
		# since it uses it to scan for candidate target access points.
		# Everything else should be taken care of by the custom attack abort handler.
		local targets=("airodump-ng")

		local targetID
		for targetID in "${targets[@]}"; do
			local targetPID=$(echo "${processes[@]}" | awk '$4~/'"$targetID"'/{print $1}')
			if [ ! "$targetPID" ]; then continue; fi
			echo -e "$CWht[$CRed-$CWht] `io_dynamic_output $FLUXIONKillingProcessNotice`"
			killall $targetPID &> $FLUXIONOutputDevice
		done

		if [ "$WIAccessPoint" ]; then
			echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingExtraInterfacesNotice$CGrn $WIAccessPoint$CClr"
			iw dev $WIAccessPoint del &> $FLUXIONOutputDevice
		fi

		if [ "$WIMonitor" ]; then
			echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingMonitorNotice$CGrn $WIMonitor$CClr"
			airmon-ng stop $WIMonitor &> $FLUXIONOutputDevice
		fi

		if [ "`cat /proc/sys/net/ipv4/ip_forward`" != "0" ]; then
			echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingPacketForwardingNotice$CClr"
			sysctl -w net.ipv4.ip_forward=0 &> $FLUXIONOutputDevice
		fi

		echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingCleaningIPTablesNotice$CClr"
		if [ ! -f "$FLUXIONWorkspacePath/iptables-rules" ];then 
			iptables --flush 
			iptables --table nat --flush 
			iptables --delete-chain
			iptables --table nat --delete-chain 
		else 
			iptables-restore < "$FLUXIONWorkspacePath/iptables-rules"   
		fi

		echo -e "$CWht[$CRed-$CWht] $FLUXIONRestoringTputNotice$CClr"
		tput cnorm

		if [ ! $FLUXIONDebug ]; then
			echo -e "$CWht[$CRed-$CWht] $FLUXIONDeletingFilesNotice$CClr"
			sandbox_remove_workfile "$FLUXIONWorkspacePath/*"
		fi

		if [ $FLUXIONDropNet ]; then
			echo -e "$CWht[$CRed-$CWht] $FLUXIONRestartingNetworkManagerNotice$CClr"

			# systemctl check
			systemd=$(whereis systemctl)
			if [ "$systemd" = "" ];then
				service network-manager restart &> $FLUXIONOutputDevice &
				service networkmanager restart &> $FLUXIONOutputDevice &
				service networking restart &> $FLUXIONOutputDevice &
			else
				systemctl restart NetworkManager &> $FLUXIONOutputDevice & 	
			fi
		fi

		echo -e "$CWht[$CGrn+$CWht] $CGrn$FLUXIONCleanupSuccessNotice$CClr"
		echo -e "$CWht[$CGrn+$CWht] $CGry$FLUXIONThanksSupportersNotice$CClr"

		sleep 2

		clear
	fi

	exit
}

# Delete Log only in Normal Mode !
function conditional_clear() {
	# Clear iff we're not in debug mode
	if [ ! $FLUXIONDebug ]; then clear; fi
}

function conditional_bail() {
	echo $general_case_error; sleep 5
	if [ ! $FLUXIONDebug ]; then exitmode; return 0; fi
	echo "Press any key to continue execution..."
	read bullshit
}

# Check Updates
function check_updates() {
	# Retrieve online versioning information
	local FLUXIONOnlineInfo=("`timeout -s SIGTERM 20 curl "https://raw.githubusercontent.com/FluxionNetwork/fluxion/master/fluxion.sh" 2>/dev/null | egrep "^(FLUXIONVersion|FLUXIONRevision)"`")
	
	if [ -z "${FLUXIONOnlineInfo[@]}" ]; then
		FLUXIONOnlineInfo=("version=?\n" "revision=?\n")
	fi

	echo -e "${FLUXIONOnlineInfo[@]}" > "$FLUXIONWorkspacePath/latest_version"
}

# Animation
function spinner() {
	local pid=$1
	local delay=0.15
	local spinstr='|/-\'

	tput civis
	while [ "`ps a | awk '{print $1}' | grep $pid`" ]; do
		local temp=${spinstr#?}
		printf " [%c]  " "$spinstr"
		local spinstr=$temp${spinstr%"$temp"}
		sleep $delay
		printf "\b\b\b\b\b\b"
	done

	printf "    \b\b\b\b"
	tput cnorm
}

# ERROR Report only in Developer Mode
function error_report() {
    echo "Error on line $1"
}

if [ "$FLUXIONDebug" ]; then
    trap 'error_report $LINENUM' ERR
fi

function handle_abort_attack() {
	if [ $(type -t stop_attack) ]; then
		stop_attack &> $FLUXIONOutputDevice
	else
		echo "Attack undefined, can't stop anything..." > $FLUXIONOutputDevice
	fi
}

# In case an abort signal is received,
# abort any attacks currently running.
trap handle_abort_attack SIGABRT

function handle_exit() {
	handle_abort_attack
	exitmode
}

# In case of unexpected termination, run exitmode
# to execute cleanup and reset commands.
trap handle_exit SIGINT SIGHUP

# Design
function fluxion_header() {
	conditional_clear
	local headerWidth=$(($(tput cols) - 2))
	local headerMessage="${CRed}FLUXION $FLUXIONVersion    ${CRed}< F${CYel}luxion ${CRed}I${CYel}s ${CRed}T${CYel}he ${CRed}F${CYel}uture >"
	local headerMessageEscaped=$(echo "$headerMessage" | sed -r 's/\\(e|033)\[[0-9];?[0-9]*m//g')
	local headerMessageWidth=${#headerMessageEscaped}
	local headerMessagePadding=$(($(($headerWidth - $headerMessageWidth)) / 2))
	echo -e "`printf "$CRed[%${headerWidth}s]\n" "" | sed -r "s/ /~/g"`"
	echo -e "`printf "$CRed[%${headerWidth}s]\n" ""`"
	echo -e "`printf "$CRed[%${headerMessagePadding}s%b%${headerMessagePadding}s$CBlu]\n" "" "$headerMessage" ""`"
	echo -e "`printf "$CBlu[%${headerWidth}s]\n" ""`"
	echo -e "`printf "$CBlu[%${headerWidth}s]\n$CClr" "" | sed -r "s/ /~/g"`"
}

############################################## < START > ##############################################

# Check requirements
function check_dependencies() {
	local CLITools=("aircrack-ng" "aireplay-ng" "airmon-ng" "airodump-ng" "airbase-ng" "awk" "curl" "dhcpd" "hostapd" "iwconfig" "lighttpd" "macchanger" "mdk3" "nmap" "php-cgi" "pyrit" "unzip" "xterm" "openssl" "rfkill" "strings" "fuser" "seq" "sed")
	
	local CLIToolsMissing

	for CLITool in ${CLITools[*]}; do
		# Could use parameter replacement, but requires extra variable.
		echo -ne "$FLUXIONVLine `printf "%-64s" "$CLITool" | sed 's/ /./g'`"

		if ! hash $CLITool 2>/dev/null; then
			echo -e "$CRed Missing!$CClr"
			CLIToolsMissing=1
		else
			echo -e ".....$CGrn OK.$CClr"
		fi

		sleep 0.025
	done

	if [ $CLIToolsMissing ]; then
		exit 1
	fi

	sleep 1
}

# Create working directory
if [ ! -d "$FLUXIONWorkspacePath" ]; then
    mkdir -p "$FLUXIONWorkspacePath" &> $FLUXIONOutputDevice
fi

if [ ! $FLUXIONDebug ]; then
	clear; echo
	sleep 0.01 && echo -e "$CRed "
	sleep 0.01 && echo -e "         ⌠▓▒▓▒   ⌠▓╗     ⌠█┐ ┌█   ┌▓\  /▓┐   ⌠▓╖   ⌠◙▒▓▒◙   ⌠█\  ☒┐    "
	sleep 0.01 && echo -e "         ║▒_     │▒║     │▒║ ║▒    \▒\/▒/    │☢╫   │▒┌╤┐▒   ║▓▒\ ▓║    "
	sleep 0.01 && echo -e "         ≡◙◙     ║◙║     ║◙║ ║◙      ◙◙      ║¤▒   ║▓║☯║▓   ♜◙\✪\◙♜    "
	sleep 0.01 && echo -e "         ║▒      │▒║__   │▒└_┘▒    /▒/\▒\    │☢╫   │▒└╧┘▒   ║█ \▒█║    "
	sleep 0.01 && echo -e "         ⌡▓      ⌡◘▒▓▒   ⌡◘▒▓▒◘   └▓/  \▓┘   ⌡▓╝   ⌡◙▒▓▒◙   ⌡▓  \▓┘    "
	sleep 0.01 && echo -e "        ¯¯¯     ¯¯¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯    ¯¯¯ ¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯¯¯¯¯¯    "

	echo

	sleep 0.1
	echo -e "$CRed                        FLUXION $CWht$FLUXIONVersion (rev. $CGrn$FLUXIONRevision$CWht)$CYel by$CWht ghost"
	sleep 0.1
	echo -e "$CGrn             Site: ${CRed}https://github.com/FluxionNetwork/fluxion$CClr"
	sleep 0.1
	echo -n "                           Online Version"

	check_updates &
	spinner "$!"

	if [ -f "$FLUXIONWorkspacePath/latest_version" -a \
		 -s "$FLUXIONWorkspacePath/latest_version" ]; then
		mapfile FLUXIONOnlineInfo < "$FLUXIONWorkspacePath/latest_version"
		FLUXIONOnlineVersion=$(echo "${FLUXIONOnlineInfo[@]}" | awk -F= 'tolower($1)~/version/{print $2}')
		FLUXIONOnlineRevision=$(echo "${FLUXIONOnlineInfo[@]}" | awk -F= 'tolower($1)~/revision/{print $2}')
	else
		FLUXIONOnlineVersion="?"
		FLUXIONOnlineRevision="?"
	fi

	echo -e "$CClr [$CPrp$FLUXIONOnlineVersion.$FLUXIONOnlineRevision$CClr]"

    if [ ! -z "${FLUXIONOnlineVersion[@]}" -a \
			  "$FLUXIONOnlineVersion" != "?" -a \
			  "$FLUXIONOnlineRevision" != "?" ]; then
		if [ "$FLUXIONOnlineVersion" -gt "$FLUXIONVersion" -o \
			 "$FLUXIONOnlineVersion" -eq "$FLUXIONVersion" -a \
			 "$FLUXIONOnlineRevision" -gt "$FLUXIONRevision" ]; then
				echo
				echo
				echo -ne $CRed"            New revision found! "$CYel
				echo -ne "Update? [Y/n]: "$CClr
				read -N1 doupdate
				echo -ne "$CClr"
				doupdate=${doupdate:-"Y"}
			if [ "$doupdate" = "Y" ]; then
				cp $0 $HOME/flux_rev-$FLUXIONRevision.backup
				curl "https://raw.githubusercontent.com/FluxionNetwork/fluxion/master/fluxion" -s -o $0
				echo
				echo
				echo -e ""$CRed"Updated successfully! Restarting the script to apply the changes ..."$CClr""
				sleep 3
				chmod +x $0
				exec $0
				exit
			fi
		fi
    fi
	echo
	
	sleep 1
fi

############################################### < MENU > ###############################################

# Windows + Resolution
function set_resolution() {
	function resA() {
		TOPLEFT="-geometry 90x13+0+0"
		TOPRIGHT="-geometry 83x26-0+0"
		BOTTOMLEFT="-geometry 90x24+0-0"
		BOTTOMRIGHT="-geometry 75x12-0-0"
		TOPLEFTBIG="-geometry 91x42+0+0"
		TOPRIGHTBIG="-geometry 83x26-0+0"
	}

	function resB() {
		TOPLEFT="-geometry 92x14+0+0"
		TOPRIGHT="-geometry 68x25-0+0"
		BOTTOMLEFT="-geometry 92x36+0-0"
		BOTTOMRIGHT="-geometry 74x20-0-0"
		TOPLEFTBIG="-geometry 100x52+0+0"
		TOPRIGHTBIG="-geometry 74x30-0+0"
	}

	function resC() {
		TOPLEFT="-geometry 100x20+0+0"
		TOPRIGHT="-geometry 109x20-0+0"
		BOTTOMLEFT="-geometry 100x30+0-0"
		BOTTOMRIGHT="-geometry 109x20-0-0"
		TOPLEFTBIG="-geometry  100x52+0+0"
		TOPRIGHTBIG="-geometry 109x30-0+0"
	}

	function resD() {
		TOPLEFT="-geometry 110x35+0+0"
		TOPRIGHT="-geometry 99x40-0+0"
		BOTTOMLEFT="-geometry 110x35+0-0"
		BOTTOMRIGHT="-geometry 99x30-0-0"
		TOPLEFTBIG="-geometry 110x72+0+0"
		TOPRIGHTBIG="-geometry 99x40-0+0"
	}

	function resE() {
		TOPLEFT="-geometry 130x43+0+0"
		TOPRIGHT="-geometry 68x25-0+0"
		BOTTOMLEFT="-geometry 130x40+0-0"
		BOTTOMRIGHT="-geometry 132x35-0-0"
		TOPLEFTBIG="-geometry 130x85+0+0"
		TOPRIGHTBIG="-geometry 132x48-0+0"
	}

	function resF() {
		TOPLEFT="-geometry 100x17+0+0"
		TOPRIGHT="-geometry 90x27-0+0"
		BOTTOMLEFT="-geometry 100x30+0-0"
		BOTTOMRIGHT="-geometry 90x20-0-0"
		TOPLEFTBIG="-geometry  100x70+0+0"
		TOPRIGHTBIG="-geometry 90x27-0+0"
	}

	detectedresolution=$(xdpyinfo | grep -A 3 "screen #0" | grep dimensions | tr -s " " | cut -d" " -f 3)

	##  A) 1024x600
	##  B) 1024x768
	##  C) 1280x768
	##  D) 1280x1024
	##  E) 1600x1200
	case $detectedresolution in
		"1024x600" ) resA ;;
		"1024x768" ) resB ;;
		"1280x768" ) resC ;;
		"1366x768" ) resC ;;
		"1280x1024" ) resD ;;
		"1600x1200" ) resE ;;
		"1366x768"  ) resF ;;
				  * ) resA ;;
	esac
}

function set_language() {
	iptables-save > "$FLUXIONWorkspacePath/iptables-rules"

	local languages=(language/*.lang)
	languages=(${languages[@]/language\//})
	languages=(${languages[@]/.lang/})

	if [ ! $FLUXIONAuto ]; then
		io_query_choice "Select your language" languages[@]

		source "$FLUXIONPath/language/$IOQueryChoice.lang"
	fi

	echo
}


function unset_interface() {
	# Unblock interfaces to make the available.
	echo -e "$FLUXIONVLine $FLUXIONUnblockingWINotice"
	
	#unblock interfaces
	rfkill unblock all

	# Gather all monitors & all AP interfaces.
	echo -e "$FLUXIONVLine $FLUXIONFindingExtraWINotice"

	# Collect all interfaces in montitor mode & stop all
	WIMonitors=($(iwconfig 2>&1 | grep "Mode:Monitor" | awk '{print $1}'))

	# Remove all monitors & all AP interfaces.
	echo -e "$FLUXIONVLine $FLUXIONRemovingExtraWINotice"

	if [ ${#WIMonitors[@]} -gt 0 ]; then
		for monitor in ${WIMonitors[@]}; do
			iw dev ${monitor/mon/ap} del 2> $FLUXIONOutputDevice
			airmon-ng stop $monitor > $FLUXIONOutputDevice

			if [ $FLUXIONDebug ]; then		            
				echo -e "Stopped $monitor."
			fi
		done
	fi

	WIMonitor=""
	WIAccessPoint=""
}

# Choose Interface
function set_interface() {
	if [ "$WIMonitor" -a "$WIAccessPoint" ]; then return 0; fi

	unset_interface

	# Gather candidate interfaces.
	echo -e "$FLUXIONVLine $FLUXIONFindingWINotice"

	# Create an array with the list of physical network interfaces
	local WIAvailableData
	readarray -t WIAvailableData < <(airmon-ng | grep -P 'wl(an\d+|\w+)' | sed -r 's/[ ]{2,}|\t+/:_:/g')
	local WIAvailableDataCount=${#WIAvailableData[@]}
	local WIAvailable=()
	local WIAvailableInfo=()
	local WIAvailableColor=()

	for (( i = 0; i < WIAvailableDataCount; i++ )); do
		local data="${WIAvailableData[i]}"
		WIAvailable[i]=$(echo "$data" | awk -F':_:' '{print $2}')
		WIAvailableInfo[i]=$(echo "$data" | awk -F':_:' '{print $4}')
		if [ "`ifconfig ${WIAvailable[i]} | grep "RUNNING"`" ]; then
			WIAvailableColor[i]="$CPrp"
			WIAvailableState[i]="-"
		else
			WIAvailableColor[i]="$CClr"
			WIAvailableState[i]="+"
		fi
	done

	WIAvailable[${#WIAvailable[@]}]="$FLUXIONGeneralRepeatOption"
	WIAvailableColor[${#WIAvailableColor[@]}]="$CClr" # (Increases record count)
	WIAvailableState[${#WIAvailableState[@]}]="x"

	local WISelected
	local WISelectedState
    if [ $WIAvailableDataCount -eq 1 -a ${WIAvailableState[0]} = '+' ]; then
		WISelected="${WIAvailable[0]}"
    else
		io_query_format_fields "$FLUXIONVLine $FLUXIONInterfaceQuery" \
		"$CRed[$CYel%d$CRed]%b %-8b [%1s] %s\n" \
		WIAvailableColor[@] WIAvailable[@] WIAvailableState[@] WIAvailableInfo[@]
		WISelected="${IOQueryFormatFields[1]}"
		WISelectedState="${IOQueryFormatFields[2]}"
		echo
	fi

	if [ "$WISelected" = "$FLUXIONGeneralRepeatOption" ]; then unset_interface; return 1; fi

	if [ ! "$FLUXIONDropNet" -a "$WISelectedState" = "-" ]; then
		echo -e "$FLUXIONVLine $FLUXIONSelectedBusyWIError"
		echo -e "$FLUXIONVLine $FLUXIONSelectedBusyWITip"
		sleep 7; unset_interface; return 1;
	fi

	# Get interface driver details.
	echo -e "$FLUXIONVLine $FLUXIONGatheringWIInfoNotice"

    WIDriver=$(airmon-ng | grep $WISelected | awk '{print $3}')

    if [ $FLUXIONDropNet ]; then
		if [ ! "$(echo $WIDriver | egrep 'rt2800|rt73')" ]; then 
			rmmod -f $WIDriver &>$FLUXIONOutputDevice 2>&1
	    fi


		# Gather conflict programs.
		echo -e "$FLUXIONVLine $FLUXIONFindingConflictingProcessesNotice"

        ConflictPrograms=($(airmon-ng check | awk 'NR>6{print $2}'))

		# Kill conflict programs.
		echo -e "$FLUXIONVLine $FLUXIONKillingConflictingProcessesNotice"

		for program in "${ConflictPrograms[@]}"; do
                killall "$program" &>$FLUXIONOutputDevice
        done

        sleep 0.5

        if [ ! "$(echo $WIDriver | egrep 'rt2800|rt73')" ]; then
			modprobe "$WIDriver" &>$FLUXIONOutputDevice 2>&1
			sleep 0.5
    	fi
    fi
	
	run_interface
	if [ $? -ne 0 ]; then return 1; fi
}

function run_interface() {
	# Start monitor interface.
	echo -e "$FLUXIONVLine $FLUXIONStartingWIMonitorNotice"

	# Activate wireless interface monitor mode and save identifier.
	WIMonitor=$(airmon-ng start $WISelected | awk -F'\[phy[0-9]+\]|\)' '$0~/monitor .* enabled/{print $3}' 2> /dev/null)

	# Create an identifier for the access point, AP virtual interface.
	# The identifier will follow this structure: wlanXap, where X is
	# the integer assigned to the original interface, wlanXmon.
	WIAccessPoint=${WIMonitor/mon/ap}
	
	# Start access point interface.
	echo -e "$FLUXIONVLine $FLUXIONStartingWIAccessPointNotice"

	# Create the new virtual interface with the previously generated identifier.
	if [ `iw dev $WIMonitor interface add $WIAccessPoint type monitor` ]; then
		echo -e "$FLUXIONCannotStartWIAccessPointError"
		sleep 5
		return 1		
	fi
}

# Select channel
function set_scanner() {
	if [ "$APTargetSSID" -a "$APTargetChannel" -a "$APTargetEncryption" -a \
		 "$APTargetMAC" -a "$APTargetMakerID" -a "$APRogueMAC" ]; then
		return 0
	fi

	if [ $FLUXIONAuto ];then
	    run_scanner $WIMonitor
	else
		local choices=("$FLUXIONScannerChannelOptionAll" "$FLUXIONScannerChannelOptionSpecific" "$FLUXIONGeneralBackOption")
		io_query_choice "$FLUXIONScannerChannelQuery" choices[@]
		
		case "$IOQueryChoice" in
			"$FLUXIONScannerChannelOptionAll") run_scanner $WIMonitor;;
			"$FLUXIONScannerChannelOptionSpecific") set_scanner_channel;;
			"$FLUXIONGeneralBackOption") unset_interface; return 1;;
		esac
	fi

	if [ $? -ne 0 ]; then return 1; fi
}

# Choose your channel if you choose option 2 before
function set_scanner_channel() {
	fluxion_header

	echo -e  "$FLUXIONVLine $FLUXIONScannerChannelQuery"
	echo
	echo -e  "     $FLUXIONScannerChannelSingleTip ${CBlu}6$CClr               "
	echo -e  "     $FLUXIONScannerChannelMiltipleTip ${CBlu}1-5$CClr             "
	echo -e  "     $FLUXIONScannerChannelMiltipleTip ${CBlu}1,2,5-7,11$CClr      "
	echo
	echo -ne "$FLUXIONPrompt"	

	local channels
	read channels

	run_scanner $WIMonitor $channels
	if [ $? -ne 0 ]; then return 1; fi
}

# Scans the entire network
function run_scanner() {
	echo
	# Starting scan operation.
	echo -e "$FLUXIONVLine $FLUXIONStartingScannerNotice"

	sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

	if [ $FLUXIONAuto ]; then
		sleep 30 && killall xterm &
	fi

	local monitor=$1
	local channels=$2

	if [ "$channels" ]; then local channelsQuery="--channel $channels"; fi
	xterm $FLUXIONHoldXterm -title "$FLUXIONScannerHeader" $TOPLEFTBIG -bg "#000000" -fg "#FFFFFF" -e airodump-ng -at WPA $channelsQuery -w "$FLUXIONWorkspacePath/dump" $monitor

	# Syntheize scan operation results.
	echo -e "$FLUXIONVLine $FLUXIONPreparingScannerResultsNotice"
	# Unfortunately, mawk (alias awk) does not support the {n} times matching operator.
	# readarray TargetAPCandidates < <(gawk -F, 'NF==15 && $1~/([A-F0-9]{2}:){5}[A-F0-9]{2}/ {print $0}' $FLUXIONWorkspacePath/dump-01.csv)
	readarray TargetAPCandidates < <(awk -F, 'NF==15 && length($1)==17 && $1~/([A-F0-9][A-F0-9]:)+[A-F0-9][A-F0-9]/ {print $0}' "$FLUXIONWorkspacePath/dump-01.csv")
	# readarray TargetAPCandidatesClients < <(gawk -F, 'NF==7 && $1~/([A-F0-9]{2}:){5}[A-F0-9]{2}/ {print $0}' $FLUXIONWorkspacePath/dump-01.csv)
	readarray TargetAPCandidatesClients < <(awk -F, 'NF==7 && length($1)==17 && $1~/([A-F0-9][A-F0-9]:)+[A-F0-9][A-F0-9]/ {print $0}' "$FLUXIONWorkspacePath/dump-01.csv")

	if [ ${#TargetAPCandidates[@]} -eq 0 ]; then
		if [ ! -s "$FLUXIONWorkspacePath/dump-01.csv" ]; then
			sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*
"
			local choices=("$FLUXIONGeneralBackOption" "$FLUXIONGeneralExitOption")
			io_query_choice "$FLUXIONScannerFailedNotice" choices[@]
			
			case "$IOQueryChoice" in
				"$FLUXIONGeneralBackOption") return 1;;
				"$FLUXIONGeneralExitOption") exitmode; return 2;;
			esac
		else
			sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

			echo -e "$FLUXIONVLine $FLUXIONScannerDetectedNothingNotice"
			sleep 3
			return 1
		fi
	fi

	sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"
}

function unset_target_ap() {
	APTargetSSID=""
	APTargetChannel=""
	APTargetEncryption=""
	APTargetMAC=""
	APTargetMakerID=""
	APTargetMaker=""
	APRogueMAC=""
}

function set_target_ap() {
	if [ "$APTargetSSID" -a "$APTargetChannel" -a "$APTargetEncryption" -a \
		 "$APTargetMAC" -a "$APTargetMakerID" -a "$APRogueMAC" ]; then
		return 0
	fi

	unset_target_ap

	local TargetAPCandidatesMAC=()
	local TargetAPCandidatesClientsCount=()
	local TargetAPCandidatesChannel=()
	local TargetAPCandidatesSecurity=()
	local TargetAPCandidatesSignal=()
	local TargetAPCandidatesPower=()
	local TargetAPCandidatesESSID=()
	local TargetAPCandidatesColor=()

	for candidateAPInfo in "${TargetAPCandidates[@]}"; do
		candidateAPInfo=$(echo "$candidateAPInfo" | sed -r "s/,\s*/,/g")

		local i=${#TargetAPCandidatesMAC[@]}

		TargetAPCandidatesMAC[i]=$(echo $candidateAPInfo | cut -d , -f 1)
		TargetAPCandidatesClientsCount[i]=$(echo "${TargetAPCandidatesClients[@]}" | grep -c "${TargetAPCandidatesMAC[i]}")
		TargetAPCandidatesChannel[i]=$(echo $candidateAPInfo | cut -d , -f 4)
		TargetAPCandidatesSecurity[i]=$(echo $candidateAPInfo | cut -d , -f 6)
		TargetAPCandidatesPower[i]=$(echo $candidateAPInfo | cut -d , -f 9)
		TargetAPCandidatesESSID[i]=$(echo $candidateAPInfo | cut -d , -f 14)
		TargetAPCandidatesColor[i]=$([ ${TargetAPCandidatesClientsCount[i]} -gt 0 ] && echo $CGrn || echo $CClr)

		local power=${TargetAPCandidatesPower[i]}
		if [ $power -eq -1 ]; then
			# airodump-ng's man page says -1 means unsupported value.
			TargetAPCandidatesQuality[i]="??";
		elif [ $power -le $FLUXIONNoiseFloor ]; then
			TargetAPCandidatesQuality[i]=0;
		elif [ $power -gt $FLUXIONNoiseCeiling ]; then
			TargetAPCandidatesQuality[i]=100;
		else
			# Bash doesn't support floating point division, so I gotta work around it...
			# The function is Q = ((P - F) / (C - F)); Q - quality, P - power, F - floor, C - Ceiling.
			TargetAPCandidatesQuality[i]=$((( ${TargetAPCandidatesPower[i]} * 10 - $FLUXIONNoiseFloor * 10 ) / ( ( $FLUXIONNoiseCeiling - $FLUXIONNoiseFloor ) / 10 ) ))
		fi
	done

	local header=$(printf "%44s\n\n$CRed[$CYel * $CRed]$CClr %-30s %4s %3s %3s %4s %6s %18s\n" "WIFI LIST" "ESSID" "QLTY" "PWR" "CL" "CH" "SEC" "MAC ADDRESS")
	io_query_format_fields "$header" "$CRed[$CYel%03d$CRed]%b %-30s %3s%% %3s %3d %4s %6s %18s\n" \
						TargetAPCandidatesColor[@] \
						TargetAPCandidatesESSID[@] \
						TargetAPCandidatesQuality[@] \
						TargetAPCandidatesPower[@] \
						TargetAPCandidatesClientsCount[@] \
						TargetAPCandidatesChannel[@] \
						TargetAPCandidatesSecurity[@] \
						TargetAPCandidatesMAC[@]

	APTargetSSID=${IOQueryFormatFields[1]}
	APTargetChannel=${IOQueryFormatFields[5]}
	APTargetEncryption=${IOQueryFormatFields[6]}
	APTargetMAC=${IOQueryFormatFields[7]}
	APTargetMakerID=${APTargetSSID:0:8}
	APTargetMaker=$(macchanger -l | grep ${APTargetMakerID,,})
	#echo $APTargetSSID $APTargetChannel $APTargetEncryption $APTargetMAC

	# Remove any special characters allowed in WPA2 ESSIDs,
	# including ' ', '[', ']', '(', ')', '*', ':'.
	APTargetSSIDClean="`echo "$APTargetSSID" | sed -r 's/( |\[|\]|\(|\)|\*|:)*//g'`"

	# We'll change a single hex digit from the target AP 
	# MAC address, by increasing one of the digits by one.
	local APRogueMACChange=$(printf %02X $((0x${APTargetMAC:13:1} + 1)))
	APRogueMAC="${APTargetMAC::13}${APRogueMACChange:1:1}${APTargetMAC:14:4}"
}

# Show info for the target AP
function view_target_ap_info() {
    
    #echo "WIFI Info"
    #echo
    echo -e "               "$CBlu"   SSID"$CClr": $APTargetSSID / $APTargetEncryption"
    echo -e "               "$CBlu"Channel"$CClr": $APTargetChannel"
    #echo -e "               "$CBlu"  Speed"$CClr": ${speed:2} Mbps"
    echo -e "               "$CBlu"  BSSID"$CClr": $APTargetMAC ($CYel${APTargetMaker:-UNKNOWN}$CClr)"
    echo
}

function unset_ap_service() {
	APRogueService="";
}

# Determine the AP service to be used with the attack.
function set_ap_service() {
	if [ "$APRogueService" ]; then return 0; fi

	# Special cases should be treated with options, not exceptions.
	#if [ "$(echo $WIDriver | grep 8187)" ]; then
	#	APRogueService="airbase-ng"
	#	askauth
	#fi

	unset_ap_service

	if [ $FLUXIONAuto ]; then
		# airbase-ng isn't compatible with dhcpd, since airbase-ng sets
		# the wireless interface in monitor mode, which dhcpd rejects.
		# hostapd works, because it bring the interface into master mode,
		# which dhcpd works perfecly fine with.
		APRogueService="hostapd";
	else
		fluxion_header

		echo -e "$FLUXIONVLine $FLUXIONAPServiceQuery"
		echo

		view_target_ap_info

		local choices=("$FLUXIONAPServiceHostapdOption" "$FLUXIONAPServiceAirbaseOption" "$FLUXIONGeneralBackOption")
		io_query_choice "" choices[@]

		case "$IOQueryChoice" in
			"$FLUXIONAPServiceHostapdOption" ) APRogueService="hostapd";;
			"$FLUXIONAPServiceAirbaseOption" ) APRogueService="airbase-ng";;
			"$FLUXIONGeneralBackOption" ) unset_ap_service; return 1;;
			* ) conditional_bail; return 1;;
		esac
	fi

	# AP Service: Load the service's helper routines.
	source "lib/ap/$APRogueService.sh"
}


function check_hash() {
	if [ ! -f "$APTargetHashPath" -o ! -s "$APTargetHashPath" ]; then
		echo -e "$FLUXIONVLine $FLUXIONHashFileDoesNotExistError"
		sleep 3
		return 1;
	fi

	fluxion_header

	echo -e "$FLUXIONVLine $FLUXIONHashVerificationMethodQuery"
	echo

	view_target_ap_info

	local choices=("$FLUXIONHashVerificationMethodPyritOption" "$FLUXIONHashVerificationMethodAircrackOption" "$FLUXIONGeneralBackOption")
	io_query_choice "" choices[@]

	local verifier
	case "$IOQueryChoice" in
		"$FLUXIONHashVerificationMethodPyritOption") verifier="pyrit";;
		"$FLUXIONHashVerificationMethodAircrackOption") verifier="aircrack-ng";;
		"$FLUXIONGeneralBackOption") return 1;;
	esac

	hash_check_handshake "$verifier" "$APTargetHashPath" "$APTargetSSID" "$APTargetMAC" > $FLUXIONOutputDevice
	local hashResult=$?

	if [ $hashResult -ne 0 ]; then echo -e "$FLUXIONVLine $FLUXIONHashInvalidError";
	else echo -e "$FLUXIONVLine $FLUXIONHashValidNotice"; fi

	sleep 3

	if [ $hashResult -ne 0 ]; then return 1; fi
}

function set_hash_path() {
	fluxion_header
	echo
	echo -e  "$FLUXIONVLine $FLUXIONPathToHandshakeFileQuery"
	echo
	echo -ne "$FLUXIONAbsolutePathInfo: "
	read APTargetHashPath
}

function unset_hash() {
	APTargetHashPath=""	
}

function set_hash() {
	if [ "$APTargetHashPath" ]; then return 0; fi

	unset_hash

	# Scan for an existing hash for potential use, if one exists,
	# ask the user if we should use it, or to skip it.
	if [ -f "$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap" -a \
		 -s "$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap" ]; then

		fluxion_header

		echo -e "$FLUXIONVLine $FLUXIONFoundHashNotice"
		echo

		view_target_ap_info

		echo -e  "Path: ${CClr}$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap"
		echo -ne "${CRed}$FLUXIONUseFoundHashQuery$CClr [${CWht}Y$CClr/n] "

		if [ ! $FLUXIONAuto ];then
			read APTargetHashPathConsidered
		fi

		if [ "$APTargetHashPathConsidered" = "" -o "$APTargetHashPathConsidered" = "y" -o "$APTargetHashPathConsidered" = "Y" ]; then
			APTargetHashPath="$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap"
			check_hash
			# If the user decides to go back, we must unset.
			if [ $? -ne 0 ]; then unset_hash; return 1; fi
		fi
	fi

	# If the hash was not found, or if it was skipped,
	# ask for location or for gathering one.
	while [ ! -f "$APTargetHashPath" -o ! -s "$APTargetHashPath" ]; do
		fluxion_header

		echo -e "$FLUXIONVLine $FLUXIONHashSourceQuery"
		echo

		view_target_ap_info

		local choices=("$FLUXIONHashSourcePathOption" "$FLUXIONHashSourceRescanOption" "$FLUXIONGeneralBackOption")
		io_query_choice "" choices[@]

		case "$IOQueryChoice" in
			"$FLUXIONHashSourcePathOption") set_hash_path; check_hash;;
			"$FLUXIONHashSourceRescanOption") set_hash;; # Rescan checks hash automatically.
			"$FLUXIONGeneralBackOption" ) unset_hash; return 1;; 
		esac

		# This conditional is required for return values
		# of operation performed in the case statement.
		if [ $? -ne 0 ]; then unset_hash; return 1; fi
	done

	# Copy to workspace for operations.
	cp "$APTargetHashPath" "$FLUXIONWorkspacePath/$APTargetSSIDClean-$APTargetMAC.cap"
}

############################################# < ATAQUE > ############################################
function unset_attack() {
	if [ "$FLUXIONAttack" ]; then 
		unprep_attack
	fi
	FLUXIONAttack=""
}

# Select attack strategie that will be used
function set_attack() {
	if [ "$FLUXIONAttack" ]; then return 0; fi

	unset_attack
	
	fluxion_header

	echo -e "$FLUXIONVLine $FLUXIONAttackQuery"
	echo

	view_target_ap_info

	local attacks=(attacks/* "$FLUXIONGeneralBackOption")
	attacks=("${attacks[@]/attacks\//}")
	attacks=("${attacks[@]/.sh/}")

	io_query_choice "" attacks[@]

	if [ "$IOQueryChoice" = "$FLUXIONGeneralBackOption" ]; then
		unset_target_ap
		unset_attack
		return 1
	fi

	FLUXIONAttack=$IOQueryChoice

	source "attacks/$FLUXIONAttack/attack.sh"

	prep_attack

	if [ $? -ne 0 ]; then
		unset_attack
		return 1
	fi
}

# Attack
function run_attack() {
    start_attack

	local choices=("$FLUXIONSelectAnotherAttackOption" "$FLUXIONGeneralExitOption")
	io_query_choice "`io_dynamic_output $FLUXIONAttackInProgressNotice`" choices[@] 

	# IOQueryChoice is a global, meaning, its value is volatile.
	# We need to make sure to save the choice before it changes.
	local choice="$IOQueryChoice"

	stop_attack

	if [ "$choice" = "$FLUXIONGeneralExitOption" ]; then exitmode; fi

	unset_attack
}
############################################# < ATTACK > ############################################

check_dependencies
set_resolution
set_language

while true; do
	set_interface;	if [ $? -ne 0 ]; then continue; fi
	set_scanner;	if [ $? -ne 0 ]; then continue; fi
	set_target_ap;	if [ $? -ne 0 ]; then continue; fi
	set_attack;		if [ $? -ne 0 ]; then continue; fi
	run_attack;		if [ $? -ne 0 ]; then continue; fi
done

# FLUXSCRIPT END
