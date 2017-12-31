#!/bin/bash

################################ < FLUXION Parameters > ################################
# NOTE: The FLUXIONPath constant will not be populated correctly if the script is called
# directly via a symlink. Symlinks in the path to the script should work completely fine.
declare -r FLUXIONPath="$(cd "$(dirname "$0")" ;pwd -P
)"

declare -r FLUXIONWorkspacePath="/tmp/fluxspace"
declare -r FLUXIONHashPath="$FLUXIONPath/attacks/Handshake Snooper/handshakes"
declare -r FLUXIONScanDB="dump"

declare -r FLUXIONNoiseFloor=-90
declare -r FLUXIONNoiseCeiling=-60

declare -r FLUXIONVersion=3
declare -r FLUXIONRevision=11

declare -r FLUXIONDebug=${FLUXIONDebug:+1}
declare -r FLUXIONWIKillProcesses=${FLUXIONWIKillProcesses:+1}
declare -r FLUXIONWIReloadDriver=${FLUXIONWIReloadDriver:+1}
declare -r FLUXIONAuto=${FLUXIONAuto:+1}

# FLUXIONDebug [Normal Mode "" / Developer Mode 1]
declare -r FLUXIONOutputDevice=$([ $FLUXIONDebug ] && echo "/dev/stdout" || echo "/dev/null")

declare -r FLUXIONHoldXterm=$([ $FLUXIONDebug ] && echo "-hold" || echo "")

################################# < Library Includes > #################################
source lib/installer/InstallerUtils.sh
source lib/InterfaceUtils.sh
source lib/SandboxUtils.sh
source lib/FormatUtils.sh
source lib/ColorUtils.sh
source lib/IOUtils.sh
source lib/HashUtils.sh

################################ < FLUXION Parameters > ################################
FLUXIONPrompt="$CRed[${CSBlu}fluxion$CSYel@$CSWht$HOSTNAME$CClr$CRed]-[$CSYel~$CClr$CRed]$CClr "
FLUXIONVLine="$CRed[$CSYel*$CClr$CRed]$CClr"

################################ < Library Parameters > ################################
InterfaceUtilsOutputDevice="$FLUXIONOutputDevice"

SandboxWorkspacePath="$FLUXIONWorkspacePath"
SandboxOutputDevice="$FLUXIONOutputDevice"

InstallerUtilsWorkspacePath="$FLUXIONWorkspacePath"
InstallerUtilsOutputDevice="$FLUXIONOutputDevice"
InstallerUtilsNoticeMark="$FLUXIONVLine"

PackageManagerLog="$InstallerUtilsWorkspacePath/package_manager.log"

IOUtilsHeader="fluxion_header"
IOUtilsQueryMark="$FLUXIONVLine"
IOUtilsPrompt="$FLUXIONPrompt"

HashOutputDevice="$FLUXIONOutputDevice"

################################# < Super User Check > #################################
if [ $EUID -ne 0 ]; then
  echo -e "${CRed}You don't have admin privilegies, execute the script as root.$CClr"
  exit 1
fi

################################### < XTerm Checks > ###################################
if [ ! "${DISPLAY:-}" ]; then
  echo -e "${CRed}The script should be exected inside a X (graphical) session.$CClr"
  exit 2
fi

if ! hash xdpyinfo 2>/dev/null; then
  echo -e "${CRed}xdpyinfo not installed, please install the relevant package for your distribution.$CClr"
  exit 3
fi

if ! xdpyinfo &>/dev/null; then
  echo -e "${CRed}The script failed to initialize an xterm test session.$CClr"
  exit 3
fi

################################# < Default Language > #################################
source language/en.sh

################################# < User Preferences > #################################
if [ -x "$FLUXIONPath/preferences.sh" ]; then source "$FLUXIONPath/preferences.sh"; fi

########################################################################################
function fluxion_exitmode() {
  if [ $FLUXIONDebug ]; then return 1; fi

  fluxion_header

  echo -e "$CWht[$CRed-$CWht]$CRed $FLUXIONCleanupAndClosingNotice$CClr"

  # List currently running processes which we might have to kill before exiting.
  local processes
  readarray processes < <(ps -A)

  # Currently, fluxion is only responsible for killing airodump-ng, because
  # fluxion explicitly it uses it to scan for candidate target access points.
  # NOTICE: Processes started by subscripts, such as an attack script,
  # MUST BE TERMINATED BY THAT SAME SCRIPT in the subscript's abort handler.
  local targets=("airodump-ng")

  local targetID # Program identifier/title
  for targetID in "${targets[@]}"; do
    # Get PIDs of all programs matching targetPID
    local targetPID=$(echo "${processes[@]}" | awk '$4~/'"$targetID"'/{print $1}')
    if [ ! "$targetPID" ]; then continue; fi
    echo -e "$CWht[$CRed-$CWht] $(io_dynamic_output $FLUXIONKillingProcessNotice)"
    killall $targetPID &>$FLUXIONOutputDevice
  done

  # If the installer activated the package manager, make sure to undo any changes.
  if [ "$PackageManagerCLT" ]; then
    echo -e "$CWht[$CRed-$CWht] "$(io_dynamic_output "$FLUXIONRestoringPackageManagerNotice")"$CClr"
    unprep_package_manager
  fi

  if [ "$WIMonitor" ]; then
    echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingMonitorNotice$CGrn $WIMonitor$CClr"
    if [ "$FLUXIONAirmonNG" ]; then airmon-ng stop "$WIMonitor" &>$FLUXIONOutputDevice
    else interface_set_mode "$WIMonitor" "managed"
    fi
  fi

  echo -e "$CWht[$CRed-$CWht] $FLUXIONRestoringTputNotice$CClr"
  tput cnorm

  if [ ! $FLUXIONDebug ]; then
    echo -e "$CWht[$CRed-$CWht] $FLUXIONDeletingFilesNotice$CClr"
    sandbox_remove_workfile "$FLUXIONWorkspacePath/*"
  fi

  if [ $FLUXIONWIKillProcesses ]; then
    echo -e "$CWht[$CRed-$CWht] $FLUXIONRestartingNetworkManagerNotice$CClr"

    # systemctl check
    systemd=$(whereis systemctl)
    if [ "$systemd" = "" ]; then
      service network-manager restart &>$FLUXIONOutputDevice &
      service networkmanager restart &>$FLUXIONOutputDevice &
      service networking restart &>$FLUXIONOutputDevice &
    else
      systemctl restart NetworkManager &>$FLUXIONOutputDevice &
    fi
  fi

  echo -e "$CWht[$CGrn+$CWht] $CGrn$FLUXIONCleanupSuccessNotice$CClr"
  echo -e "$CWht[$CGrn+$CWht] $CGry$FLUXIONThanksSupportersNotice$CClr"

  sleep 3

  clear

  exit 0
}

# Delete log only in Normal Mode !
function fluxion_conditional_clear() {
  # Clear iff we're not in debug mode
  if [ ! $FLUXIONDebug ]; then clear; fi
}

function fluxion_conditional_bail() {
  echo ${1:-"Something went wrong, whoops! (report this)"}
  sleep 5
  if [ ! $FLUXIONDebug ]; then
    fluxion_handle_exit
    return 1
  fi
  echo "Press any key to continue execution..."
  read bullshit
}

# ERROR Report only in Developer Mode
function fluxion_error_report() {
  echo "Error on line $1"
}

if [ "$FLUXIONDebug" ]; then
  trap 'fluxion_error_report $LINENUM' ERR
fi

function fluxion_handle_abort_attack() {
  if [ $(type -t stop_attack) ]; then
    stop_attack &>$FLUXIONOutputDevice
    unprep_attack &>$FLUXIONOutputDevice
  else
    echo "Attack undefined, can't stop anything..." >$FLUXIONOutputDevice
  fi
}

# In case an abort signal is received,
# abort any attacks currently running.
trap fluxion_handle_abort_attack SIGABRT

function fluxion_handle_exit() {
  fluxion_handle_abort_attack
  fluxion_exitmode
  exit 1
}

# In case of unexpected termination, run fluxion_exitmode
# to execute cleanup and reset commands.
trap fluxion_handle_exit SIGINT SIGHUP

function fluxion_header() {
  format_apply_autosize "[%*s]\n"
  local verticalBorder=$FormatApplyAutosize

  format_apply_autosize "[%*s${CSRed}FLUXION $FLUXIONVersion${CSWht}.${CSBlu}$FLUXIONRevision$CSRed    <$CIRed F${CIYel}luxion$CIRed I${CIYel}s$CIRed T${CIYel}he$CIRed F${CIYel}uture$CClr$CSYel >%*s$CSBlu]\n"
  local headerTextFormat="$FormatApplyAutosize"

  fluxion_conditional_clear

  echo -e "$(printf "$CSRed$verticalBorder" "" | sed -r "s/ /~/g")"
  printf "$CSRed$verticalBorder" ""
  printf "$headerTextFormat" "" ""
  printf "$CSBlu$verticalBorder" ""
  echo -e "$(printf "$CSBlu$verticalBorder" "" | sed -r "s/ /~/g")$CClr"
  echo
  echo
}

# Create working directory
if [ ! -d "$FLUXIONWorkspacePath" ]; then
  mkdir -p "$FLUXIONWorkspacePath" &>$FLUXIONOutputDevice
fi

####################################### < Start > ######################################
if [ ! $FLUXIONDebug ]; then
  FLUXIONBanner=()

  format_center_literals " ⌠▓▒▓▒   ⌠▓╗     ⌠█┐ ┌█   ┌▓\  /▓┐   ⌠▓╖   ⌠◙▒▓▒◙   ⌠█\  ☒┐"
  FLUXIONBanner+=("$FormatCenterLiterals")
  format_center_literals " ║▒_     │▒║     │▒║ ║▒    \▒\/▒/    │☢╫   │▒┌╤┐▒   ║▓▒\ ▓║"
  FLUXIONBanner+=("$FormatCenterLiterals")
  format_center_literals " ≡◙◙     ║◙║     ║◙║ ║◙      ◙◙      ║¤▒   ║▓║☯║▓   ♜◙\✪\◙♜"
  FLUXIONBanner+=("$FormatCenterLiterals")
  format_center_literals " ║▒      │▒║__   │▒└_┘▒    /▒/\▒\    │☢╫   │▒└╧┘▒   ║█ \▒█║"
  FLUXIONBanner+=("$FormatCenterLiterals")
  format_center_literals " ⌡▓      ⌡◘▒▓▒   ⌡◘▒▓▒◘   └▓/  \▓┘   ⌡▓╝   ⌡◙▒▓▒◙   ⌡▓  \▓┘"
  FLUXIONBanner+=("$FormatCenterLiterals")
  format_center_literals "¯¯¯     ¯¯¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯    ¯¯¯ ¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯¯¯¯¯¯"
  FLUXIONBanner+=("$FormatCenterLiterals")

  clear

  if [ "$FLUXIONAuto" ]; then echo -e "$CBlu"
  else echo -e "$CRed"
  fi

  for line in "${FLUXIONBanner[@]}"; do
    echo "$line"
    sleep 0.05
  done
  #echo "${FLUXIONBanner[@]}"
  echo

  sleep 0.1
  format_center_literals "${CGrn}Site: ${CRed}https://github.com/FluxionNetwork/fluxion$CClr"
  echo -e "$FormatCenterLiterals"

  sleep 0.1
  format_center_literals "${CSRed}FLUXION $FLUXIONVersion$CClr (rev. $CSBlu$FLUXIONRevision$CClr)$CYel by$CWht ghost"
  echo -e "$FormatCenterLiterals"

  sleep 0.1
  if installer_utils_check_update "https://raw.githubusercontent.com/FluxionNetwork/fluxion/master/fluxion.sh" "FLUXIONVersion=" "FLUXIONRevision=" $FLUXIONVersion $FLUXIONRevision; then installer_utils_run_update "https://github.com/FluxionNetwork/fluxion/archive/master.zip" "FLUXION-V$FLUXIONVersion.$FLUXIONRevision" "$(dirname "$FLUXIONPath")"
  fi

  echo

  FLUXIONCLIToolsRequired=("aircrack-ng" "python2:python2.7|python2" "bc" "awk:awk|gawk|mawk" "curl" "dhcpd:isc-dhcp-server|dhcp" "7zr:p7zip" "hostapd" "lighttpd" "iwconfig:wireless-tools" "macchanger" "mdk3" "nmap" "openssl" "php-cgi" "pyrit" "xterm" "rfkill" "unzip" "route:net-tools" "fuser:psmisc" "killall:psmisc")
  FLUXIONCLIToolsMissing=()

  while ! installer_utils_check_dependencies FLUXIONCLIToolsRequired[@]; do installer_utils_run_dependencies InstallerUtilsCheckDependencies[@]
  done
fi

#################################### < Resolution > ####################################
function fluxion_set_resolution() { # Windows + Resolution
  # Calc options
  RATIO=4

  # Get demensions
  SCREEN_SIZE=$(xdpyinfo | grep dimension | awk '{print $4}' | tr -d "(")
  SCREEN_SIZE_X=$(printf '%.*f\n' 0 $(echo $SCREEN_SIZE | sed -e s'/x/ /'g | awk '{print $1}'))
  SCREEN_SIZE_Y=$(printf '%.*f\n' 0 $(echo $SCREEN_SIZE | sed -e s'/x/ /'g | awk '{print $2}'))

  PROPOTION=$(echo $(awk "BEGIN {print $SCREEN_SIZE_X/$SCREEN_SIZE_Y}")/1 | bc)
  NEW_SCREEN_SIZE_X=$(echo $(awk "BEGIN {print $SCREEN_SIZE_X/$RATIO}")/1 | bc)
  NEW_SCREEN_SIZE_Y=$(echo $(awk "BEGIN {print $SCREEN_SIZE_Y/$RATIO}")/1 | bc)

  NEW_SCREEN_SIZE_BIG_X=$(echo $(awk "BEGIN {print 1.5*$SCREEN_SIZE_X/$RATIO}")/1 | bc)
  NEW_SCREEN_SIZE_BIG_Y=$(echo $(awk "BEGIN {print 1.5*$SCREEN_SIZE_Y/$RATIO}")/1 | bc)

  SCREEN_SIZE_MID_X=$(echo $(($SCREEN_SIZE_X + ($SCREEN_SIZE_X - 2 * $NEW_SCREEN_SIZE_X) / 2)))
  SCREEN_SIZE_MID_Y=$(echo $(($SCREEN_SIZE_Y + ($SCREEN_SIZE_Y - 2 * $NEW_SCREEN_SIZE_Y) / 2)))

  # Upper
  TOPLEFT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+0+0"
  TOPRIGHT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y-0+0"
  TOP="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+$SCREEN_SIZE_MID_X+0"

  # Lower
  BOTTOMLEFT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+0-0"
  BOTTOMRIGHT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y-0-0"
  BOTTOM="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+$SCREEN_SIZE_MID_X-0"

  # Y mid
  LEFT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+0-$SCREEN_SIZE_MID_Y"
  RIGHT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y-0+$SCREEN_SIZE_MID_Y"

  # Big
  TOPLEFTBIG="-geometry $NEW_SCREEN_SIZE_BIG_Xx$NEW_SCREEN_SIZE_BIG_Y+0+0"
  TOPRIGHTBIG="-geometry $NEW_SCREEN_SIZE_BIG_Xx$NEW_SCREEN_SIZE_BIG_Y-0+0"
}

##################################### < Language > #####################################
function fluxion_set_language() {
  if [ "$FLUXIONAuto" ]; then
    FLUXIONLanguage="en"
  else
    # Get all languages available.
    local languageCodes
    readarray -t languageCodes < <(ls -1 language | sed -E 's/\.sh//')

    local languages
    readarray -t languages < <(head -n 3 language/*.sh | grep -E "^# native: " | sed -E 's/# \w+: //')

    io_query_format_fields "$FLUXIONVLine Select your language" "\t$CRed[$CSYel%d$CClr$CRed]$CClr %s / %s\n" languageCodes[@] languages[@]

    FLUXIONLanguage=${IOQueryFormatFields[0]}

    echo # Leave this spacer.

    # Check if all language files are present for the selected language.
    find -type d -name language | while read language_dir; do
      if [ ! -e "$language_dir/${FLUXIONLanguage}.sh" ]; then
        echo -e "$FLUXIONVLine ${CYel}Warning${CClr}, missing language file:"
        echo -e "\t$language_dir/${FLUXIONLanguage}.sh"
        return 1
      fi
    done

    # If a file is missing, fall back to english.
    if [ $? -eq 1 ]; then
      echo -e "\n\n$FLUXIONVLine Falling back to English..."
      sleep 5
      FLUXIONLanguage="en"
      return 1
    fi

    source "$FLUXIONPath/language/$FLUXIONLanguage.sh"
  fi
}

#################################### < Interfaces > ####################################
function fluxion_unset_interface() {
  # Unblock interfaces to make them available.
  echo -e "$FLUXIONVLine $FLUXIONUnblockingWINotice"
  rfkill unblock all &>$FLUXIONOutputDevice

  # Find all monitor-mode interfaces & all AP interfaces.
  echo -e "$FLUXIONVLine $FLUXIONFindingExtraWINotice"
  local wiMonitors=($(iwconfig 2>&1 | grep "Mode:Monitor" | awk '{print $1}'))

  # Remove all monitor-mode & all AP interfaces.
  echo -e "$FLUXIONVLine $FLUXIONRemovingExtraWINotice"
  if [ ${#wiMonitors[@]} -gt 0 ]; then
    local monitor
    for monitor in ${wiMonitors[@]}; do
      # Remove any previously created fluxion AP interfaces.
      #iw dev "FX${monitor:2}AP" del &> $FLUXIONOutputDevice

      # Remove monitoring interface after AP interface.
      if [[ "$monitor" == *"mon" ]]; then airmon-ng stop "$monitor" >$FLUXIONOutputDevice
      else interface_set_mode "$monitor" "managed"
      fi

      if [ $FLUXIONDebug ]; then
        echo -e "Stopped $monitor."
      fi
    done
  fi

  WIMonitor=""
}

# Choose Interface
function fluxion_set_interface() {
  if [ "$WIMonitor" ]; then return 0; fi

  fluxion_unset_interface

  # Gather candidate interfaces.
  echo -e "$FLUXIONVLine $FLUXIONFindingWINotice"

  # List of all available wireless network interfaces.
  # These will be stored in our array right below.
  interface_list_wireless

  local wiAlternate=("$FLUXIONGeneralRepeatOption")
  local wiAlternateInfo=("")
  local wiAlternateState=("")
  local wiAlternateColor=("$CClr")

  interface_prompt "$FLUXIONVLine $FLUXIONInterfaceQuery" InterfaceListWireless[@] \
    wiAlternate[@] wiAlternateInfo[@] wiAlternateState[@] wiAlternateColor[@]

  local wiSelected=$InterfacePromptIfSelected

  if [ "$wiSelected" = "$FLUXIONGeneralRepeatOption" ]; then
    fluxion_unset_interface
    return 1
  fi

  if [ ! "$FLUXIONWIKillProcesses" -a "$InterfacePromptIfSelectedState" = "[-]" ]; then
    echo -e "$FLUXIONVLine $FLUXIONSelectedBusyWIError"
    echo -e "$FLUXIONVLine $FLUXIONSelectedBusyWITip"
    sleep 7
    fluxion_unset_interface
    return 1
  fi

  if ! fluxion_run_interface "$wiSelected"; then return 1
  fi

  WIMonitor="$FluxionRunInterface"
}

function fluxion_run_interface() {
  if [ ! "$1" ]; then return 1; fi

  local ifSelected="$1"

  if [ "$FLUXIONWIReloadDriver" ]; then
    # Get selected interface's driver details/info-descriptor.
    echo -e "$FLUXIONVLine $FLUXIONGatheringWIInfoNotice"

    if ! interface_driver "$ifSelected"; then
      echo -e "$FLUXIONVLine$CRed $FLUXIONUnknownWIDriverError"
      sleep 3
      return 1
    fi

    local ifDriver="$InterfaceDriver"

    # I'm not really sure about this conditional here.
    # FLUXION 2 had the conditional so I kept it there.
    if [ ! "$(echo $ifDriver | egrep 'rt2800|rt73')" ]; then
      rmmod -f $ifDriver &>$FLUXIONOutputDevice 2>&1

      # Wait while interface becomes unavailable.
      echo -e "$FLUXIONVLine $(io_dynamic_output $FLUXIONUnloadingWIDriverNotice)"
      while interface_physical "$ifSelected"; do sleep 1
      done
    fi
  fi

  if [ "$FLUXIONWIKillProcesses" ]; then
    # Get list of potentially troublesome programs.
    echo -e "$FLUXIONVLine $FLUXIONFindingConflictingProcessesNotice"
    # This shit has to go reeeeeal soon (airmon-ng)...
    local conflictPrograms=($(airmon-ng check | awk 'NR>6{print $2}'))

    # Kill potentially troublesome programs.
    echo -e "$FLUXIONVLine $FLUXIONKillingConflictingProcessesNotice"
    for program in "${conflictPrograms[@]}"; do killall "$program" &>$FLUXIONOutputDevice
    done
  fi

  if [ "$FLUXIONWIReloadDriver" ]; then
    # I'm not really sure about this conditional here.
    # FLUXION 2 had the conditional so I kept it there.
    if [ ! "$(echo $ifDriver | egrep 'rt2800|rt73')" ]; then modprobe "$ifDriver" &>$FLUXIONOutputDevice 2>&1
    fi

    # Wait while interface becomes available.
    echo -e "$FLUXIONVLine $(io_dynamic_output $FLUXIONLoadingWIDriverNotice)"
    while ! interface_physical "$ifSelected"; do sleep 1
    done
  fi

  # Activate wireless interface monitor mode and save identifier.
  echo -e "$FLUXIONVLine $FLUXIONStartingWIMonitorNotice"
  if [ "$FLUXIONAirmonNG" ]; then
    # TODO: Need to check weather switching to monitor mode below failed.
    # Notice: Line below could cause issues with different airmon versions.
    FluxionRunInterface=$(airmon-ng start $ifSelected | awk -F'\[phy[0-9]+\]|\)' '$0~/monitor .* enabled/{print $3}' 2>/dev/null)
  else
    if interface_set_mode "$ifSelected" "monitor"; then FluxionRunInterface=$ifSelected
    else FluxionRunInterface=""
    fi
  fi

  if [ "$FluxionRunInterface" ]; then
    echo -e "$FLUXIONVLine $FLUXIONMonitorModeWIEnabledNotice"
    sleep 3
  else
    echo -e "$FLUXIONVLine $FLUXIONMonitorModeWIFailedError"
    sleep 3
    return 2
  fi
}

###################################### < Scanner > #####################################
function fluxion_set_scanner() {
  # If scanner's already been set and globals are ready, we'll skip setup.
  if [ "$APTargetSSID" -a "$APTargetChannel" -a "$APTargetEncryption" -a \
    "$APTargetMAC" -a "$APTargetMakerID" -a "$APRogueMAC" ]; then
    return 0
  fi

  if [ "$FLUXIONAuto" ]; then
    fluxion_run_scanner $WIMonitor
  else
    local choices=("$FLUXIONScannerChannelOptionAll (2.4GHz)" "$FLUXIONScannerChannelOptionAll (5GHz)" "$FLUXIONScannerChannelOptionAll (2.4GHz & 5Ghz)" "$FLUXIONScannerChannelOptionSpecific" "$FLUXIONGeneralBackOption")
    io_query_choice "$FLUXIONScannerChannelQuery" choices[@]

    echo

    case "$IOQueryChoice" in
    "$FLUXIONScannerChannelOptionAll (2.4GHz)") fluxion_run_scanner $WIMonitor "" "bg" ;;
    "$FLUXIONScannerChannelOptionAll (5GHz)") fluxion_run_scanner $WIMonitor "" "a" ;;
    "$FLUXIONScannerChannelOptionAll (2.4GHz & 5Ghz)") fluxion_run_scanner $WIMonitor "" "abg" ;;
    "$FLUXIONScannerChannelOptionSpecific") fluxion_set_scanner_channel ;;
    "$FLUXIONGeneralBackOption")
      fluxion_unset_interface
      return 1
      ;;
    esac
  fi

  if [ $? -ne 0 ]; then return 1; fi
}

function fluxion_set_scanner_channel() {
  fluxion_header

  echo -e "$FLUXIONVLine $FLUXIONScannerChannelQuery"
  echo
  echo -e "     $FLUXIONScannerChannelSingleTip ${CBlu}6$CClr               "
  echo -e "     $FLUXIONScannerChannelMiltipleTip ${CBlu}1-5$CClr             "
  echo -e "     $FLUXIONScannerChannelMiltipleTip ${CBlu}1,2,5-7,11$CClr      "
  echo
  echo -ne "$FLUXIONPrompt"

  local channels
  read channels

  echo

  fluxion_run_scanner $WIMonitor $channels
  if [ $? -ne 0 ]; then return 1; fi
}

# Parameters: monitor [ channel(s) [ band(s) ] ]
function fluxion_run_scanner() {
  if [ ${#@} -lt 1 ]; then return 1; fi

  echo -e "$FLUXIONVLine $FLUXIONStartingScannerNotice"
  echo -e "$FLUXIONVLine $FLUXIONStartingScannerTip"

  # Remove any pre-existing scanner results.
  sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

  if [ "$FLUXIONAuto" ]; then
    sleep 30 && killall xterm &
  fi

  # Begin scanner and output all results to "dump-01.csv."
  if ! xterm -title "$FLUXIONScannerHeader" $TOPLEFTBIG -bg "#000000" -fg "#FFFFFF" -e "airodump-ng -Mat WPA "${2:+"--channel $2"}" "${3:+"--band $3"}" -w \"$FLUXIONWorkspacePath/dump\" $1" 2>/dev/null; then
    echo -e "$FLUXIONVLine$CRed $FLUXIONGeneralXTermFailureError"
    sleep 5
    return 1
  fi

  # Fix this below, creating subshells for something like this is somewhat ridiculous.
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
    "$FLUXIONGeneralBackOption") return 1 ;;
    "$FLUXIONGeneralExitOption")
      fluxion_exitmode
      return 2
      ;;
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
    sleep 3
    return 1
  fi
}

###################################### < Target > ######################################
function fluxion_unset_target_ap() {
  APTargetSSID=""
  APTargetChannel=""
  APTargetEncryption=""
  APTargetMAC=""
  APTargetMakerID=""
  APTargetMaker=""
  APRogueMAC=""
}

function fluxion_set_target_ap() {
  if [ "$APTargetSSID" -a "$APTargetChannel" -a "$APTargetEncryption" -a \
    "$APTargetMAC" -a "$APTargetMakerID" -a "$APRogueMAC" ]; then
    return 0
  fi

  fluxion_unset_target_ap

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

    TargetAPCandidatesMAC[i]=$(echo "$candidateAPInfo" | cut -d , -f 1)
    TargetAPCandidatesClientsCount[i]=$(echo "${TargetAPCandidatesClients[@]}" | grep -c "${TargetAPCandidatesMAC[i]}")
    TargetAPCandidatesChannel[i]=$(echo "$candidateAPInfo" | cut -d , -f 4)
    TargetAPCandidatesSecurity[i]=$(echo "$candidateAPInfo" | cut -d , -f 6)
    TargetAPCandidatesPower[i]=$(echo "$candidateAPInfo" | cut -d , -f 9)
    TargetAPCandidatesColor[i]=$([ ${TargetAPCandidatesClientsCount[i]} -gt 0 ] && echo $CGrn || echo $CClr)

    # Parse any non-ascii characters by letting bash handle them.
    # Just escape all single quotes in ESSID and let bash's $'...' handle it.
    local sanitizedESSID=$(echo "${candidateAPInfo//\'/\\\'}" | cut -d , -f 14)
    TargetAPCandidatesESSID[i]=$(eval "echo \$'$sanitizedESSID'")

    local power=${TargetAPCandidatesPower[i]}
    if [ $power -eq -1 ]; then
      # airodump-ng's man page says -1 means unsupported value.
      TargetAPCandidatesQuality[i]="??"
    elif [ $power -le $FLUXIONNoiseFloor ]; then
      TargetAPCandidatesQuality[i]=0
    elif [ $power -gt $FLUXIONNoiseCeiling ]; then
      TargetAPCandidatesQuality[i]=100
    else
      # Bash doesn't support floating point division, so I gotta work around it...
      # The function is Q = ((P - F) / (C - F)); Q - quality, P - power, F - floor, C - Ceiling.
      TargetAPCandidatesQuality[i]=$(((${TargetAPCandidatesPower[i]} * 10 - $FLUXIONNoiseFloor * 10) / (($FLUXIONNoiseCeiling - $FLUXIONNoiseFloor) / 10)))
    fi
  done

  local headerTitle=$(
    format_center_literals "WIFI LIST"
    echo -n "$FormatCenterLiterals\n\n"
  )

  format_apply_autosize "$CRed[$CSYel ** $CClr$CRed]$CClr %-*.*s %4s %3s %3s %2s %-8.8s %18s\n"
  local headerFields=$(printf "$FormatApplyAutosize" "ESSID" "QLTY" "PWR" "STA" "CH" "SECURITY" "BSSID")

  format_apply_autosize "$CRed[$CSYel%03d$CClr$CRed]%b %-*.*s %3s%% %3s %3d %2s %-8.8s %18s\n"
  io_query_format_fields "$headerTitle$headerFields" "$FormatApplyAutosize" \
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
  APTargetMakerID=${APTargetMAC:0:8}
  APTargetMaker=$(macchanger -l | grep ${APTargetMakerID,,} | cut -d ' ' -f 5-)

  # Sanitize network ESSID to normalize it and make it safe for manipulation.
  # Notice: Why remove these? Because some smartass might decide to name their
  # network something like "; rm -rf / ;". If the string isn't sanitized accidentally
  # shit'll hit the fan and we'll have an extremely distressed person subit an issue.
  # Removing: ' ', '/', '.', '~', '\'
  APTargetSSIDClean=$(echo "$APTargetSSID" | sed -r 's/( |\/|\.|\~|\\)+/_/g')

  # We'll change a single hex digit from the target AP's MAC address.
  # This new MAC address will be used as the rogue AP's MAC address.
  local APRogueMACChange=$(printf %02X $((0x${APTargetMAC:13:1} + 1)))
  APRogueMAC="${APTargetMAC::13}${APRogueMACChange:1:1}${APTargetMAC:14:4}"
}

function fluxion_show_ap_info() {
  format_apply_autosize "%*s$CBlu%7s$CClr: %-32s%*s\n"

  local colorlessFormat="$FormatApplyAutosize"
  local colorfullFormat=$(echo "$colorlessFormat" | sed -r 's/%-32s/%-32b/g')

  printf "$colorlessFormat" "" "ESSID" "\"$APTargetSSID\" / $APTargetEncryption" ""
  printf "$colorlessFormat" "" "Channel" "$APTargetChannel" ""
  printf "$colorfullFormat" "" "BSSID" "$APTargetMAC ($CYel${APTargetMaker:-UNKNOWN}$CClr)" ""

  echo
}

#################################### < AP Service > ####################################
function fluxion_unset_ap_service() {
  APRogueService=""
}

function fluxion_set_ap_service() {
  if [ "$APRogueService" ]; then return 0; fi

  fluxion_unset_ap_service

  if [ "$FLUXIONAuto" ]; then
    APRogueService="hostapd"
  else
    fluxion_header

    echo -e "$FLUXIONVLine $FLUXIONAPServiceQuery"
    echo

    fluxion_show_ap_info "$APTargetSSID" "$APTargetEncryption" "$APTargetChannel" "$APTargetMAC" "$APTargetMaker"

    local choices=("$FLUXIONAPServiceHostapdOption" "$FLUXIONAPServiceAirbaseOption" "$FLUXIONGeneralBackOption")
    io_query_choice "" choices[@]

    echo

    case "$IOQueryChoice" in
    "$FLUXIONAPServiceHostapdOption") APRogueService="hostapd" ;;
    "$FLUXIONAPServiceAirbaseOption") APRogueService="airbase-ng" ;;
    "$FLUXIONGeneralBackOption")
      fluxion_unset_ap_service
      return 1
      ;;
    *)
      fluxion_conditional_bail
      return 1
      ;;
    esac
  fi

  # AP Service: Load the service's helper routines.
  source "lib/ap/$APRogueService.sh"
}

###################################### < Hashes > ######################################
function fluxion_check_hash() {
  if [ ! -f "$APTargetHashPath" -o ! -s "$APTargetHashPath" ]; then
    echo -e "$FLUXIONVLine $FLUXIONHashFileDoesNotExistError"
    sleep 3
    return 1
  fi

  local verifier

  if [ "$FLUXIONAuto" ]; then
    verifier="pyrit"
  else
    fluxion_header

    echo -e "$FLUXIONVLine $FLUXIONHashVerificationMethodQuery"
    echo

    fluxion_show_ap_info "$APTargetSSID" "$APTargetEncryption" "$APTargetChannel" "$APTargetMAC" "$APTargetMaker"

    local choices=("$FLUXIONHashVerificationMethodPyritOption" "$FLUXIONHashVerificationMethodAircrackOption" "$FLUXIONGeneralBackOption")
    io_query_choice "" choices[@]

    echo

    case "$IOQueryChoice" in
    "$FLUXIONHashVerificationMethodPyritOption") verifier="pyrit" ;;
    "$FLUXIONHashVerificationMethodAircrackOption") verifier="aircrack-ng" ;;
    "$FLUXIONGeneralBackOption") return 1 ;;
    esac
  fi

  hash_check_handshake "$verifier" "$APTargetHashPath" "$APTargetSSID" "$APTargetMAC" >$FLUXIONOutputDevice
  local hashResult=$?

  # A value other than 0 means there's an issue with the hash.
  if [ $hashResult -ne 0 ]; then echo -e "$FLUXIONVLine $FLUXIONHashInvalidError"
  else echo -e "$FLUXIONVLine $FLUXIONHashValidNotice"
  fi

  sleep 3

  if [ $hashResult -ne 0 ]; then return 1; fi
}

function fluxion_set_hash_path() {
  fluxion_header
  echo
  echo -e "$FLUXIONVLine $FLUXIONPathToHandshakeFileQuery"
  echo
  echo -ne "$FLUXIONAbsolutePathInfo: "
  read APTargetHashPath
}

function fluxion_unset_hash() {
  APTargetHashPath=""
}

function fluxion_set_hash() {
  if [ "$APTargetHashPath" ]; then return 0; fi

  fluxion_unset_hash

  # Scan for an existing hash for potential use, if one exists,
  # ask the user if we should use it, or to skip it.
  if [ -f "$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap" -a \
    -s "$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap" ]; then

    if [ ! "$FLUXIONAuto" ]; then
      fluxion_header

      echo -e "$FLUXIONVLine $FLUXIONFoundHashNotice"
      echo

      fluxion_show_ap_info "$APTargetSSID" "$APTargetEncryption" "$APTargetChannel" "$APTargetMAC" "$APTargetMaker"

      printf "Path: %s\n" "$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap"
      echo -ne "$FLUXIONVLine ${CRed}$FLUXIONUseFoundHashQuery$CClr [${CWht}Y$CClr/n] "

      read APTargetHashPathConsidered

      echo
    fi

    if [ "$APTargetHashPathConsidered" = "" -o "$APTargetHashPathConsidered" = "y" -o "$APTargetHashPathConsidered" = "Y" ]; then
      APTargetHashPath="$FLUXIONHashPath/$APTargetSSIDClean-$APTargetMAC.cap"
      fluxion_check_hash
      # If the user decides to go back, we must unset.
      if [ $? -ne 0 ]; then
        fluxion_unset_hash
        return 1
      fi
    fi
  fi

  # If the hash was not found, or if it was skipped,
  # ask for location or for gathering one.
  while [ ! -f "$APTargetHashPath" -o ! -s "$APTargetHashPath" ]; do
    fluxion_header

    echo -e "$FLUXIONVLine $FLUXIONHashSourceQuery"
    echo

    fluxion_show_ap_info "$APTargetSSID" "$APTargetEncryption" "$APTargetChannel" "$APTargetMAC" "$APTargetMaker"

    local choices=("$FLUXIONHashSourcePathOption" "$FLUXIONHashSourceRescanOption" "$FLUXIONGeneralBackOption")
    io_query_choice "" choices[@]

    echo

    case "$IOQueryChoice" in
    "$FLUXIONHashSourcePathOption")
      fluxion_set_hash_path
      fluxion_check_hash
      ;;
    "$FLUXIONHashSourceRescanOption") fluxion_set_hash ;; # Rescan checks hash automatically.
    "$FLUXIONGeneralBackOption")
      fluxion_unset_hash
      return 1
      ;;
    esac

    # This conditional is required for return values
    # of operation performed in the case statement.
    if [ $? -ne 0 ]; then
      fluxion_unset_hash
      return 1
    fi
  done

  # Copy to workspace for hash-required operations.
  cp "$APTargetHashPath" "$FLUXIONWorkspacePath/$APTargetSSIDClean-$APTargetMAC.cap"
}

###################################### < Attack > ######################################
function fluxion_unset_attack() {
  if [ "$FLUXIONAttack" ]; then unprep_attack
  fi
  FLUXIONAttack=""
}

# Select the attack strategy to be used.
function fluxion_set_attack() {
  if [ "$FLUXIONAttack" ]; then return 0; fi

  fluxion_unset_attack

  fluxion_header

  echo -e "$FLUXIONVLine $FLUXIONAttackQuery"
  echo

  fluxion_show_ap_info "$APTargetSSID" "$APTargetEncryption" "$APTargetChannel" "$APTargetMAC" "$APTargetMaker"

  #local attacksMeta=$(head -n 3 attacks/*/language/$FLUXIONLanguage.sh)

  #local attacksIdentifier
  #readarray -t attacksIdentifier < <("`echo "$attacksMeta" | grep -E "^# identifier: " | sed -E 's/# \w+: //'`")

  #local attacksDescription
  #readarray -t attacksDescription < <("`echo "$attacksMeta" | grep -E "^# description: " | sed -E 's/# \w+: //'`")

  local attacks
  readarray -t attacks < <(ls -1 attacks)

  local descriptions
  readarray -t descriptions < <(head -n 3 attacks/*/language/$FLUXIONLanguage.sh | grep -E "^# description: " | sed -E 's/# \w+: //')

  local identifiers=()

  local attack
  for attack in "${attacks[@]}"; do
    local identifier="$(head -n 3 "attacks/$attack/language/$FLUXIONLanguage.sh" | grep -E "^# identifier: " | sed -E 's/# \w+: //')"
    if [ "$identifier" ]; then identifiers+=("$identifier")
    else identifiers+=("$attack")
    fi
  done

  attacks+=("$FLUXIONGeneralBackOption")
  identifiers+=("$FLUXIONGeneralBackOption")
  descriptions+=("")

  io_query_format_fields "" "\t$CRed[$CSYel%d$CClr$CRed]$CClr%0.0s $CCyn%b$CClr %b\n" attacks[@] identifiers[@] descriptions[@]

  echo

  if [ "${IOQueryFormatFields[1]}" = "$FLUXIONGeneralBackOption" ]; then
    fluxion_unset_target_ap
    fluxion_unset_attack
    return 1
  fi

  FLUXIONAttack=${IOQueryFormatFields[0]}

  # Load attack and its corresponding language file.
  source "attacks/$FLUXIONAttack/language/$FLUXIONLanguage.sh"
  source "attacks/$FLUXIONAttack/attack.sh"

  prep_attack

  if [ $? -ne 0 ]; then
    fluxion_unset_attack
    return 1
  fi
}

# Attack
function fluxion_run_attack() {
  start_attack

  local choices=("$FLUXIONSelectAnotherAttackOption" "$FLUXIONGeneralExitOption")
  io_query_choice "$(io_dynamic_output $FLUXIONAttackInProgressNotice)" choices[@]

  echo

  # IOQueryChoice is a global, meaning, its value is volatile.
  # We need to make sure to save the choice before it changes.
  local choice="$IOQueryChoice"

  stop_attack

  if [ "$choice" = "$FLUXIONGeneralExitOption" ]; then fluxion_handle_exit; fi

  fluxion_unset_attack
}

################################### < FLUXION Loop > ###################################
fluxion_set_resolution
fluxion_set_language

while true; do
  fluxion_set_interface
  if [ $? -ne 0 ]; then continue; fi
  fluxion_set_scanner
  if [ $? -ne 0 ]; then continue; fi
  fluxion_set_target_ap
  if [ $? -ne 0 ]; then continue; fi
  fluxion_set_attack
  if [ $? -ne 0 ]; then continue; fi
  fluxion_run_attack
  if [ $? -ne 0 ]; then continue; fi
done

# FLUXSCRIPT END
