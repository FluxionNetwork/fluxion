#!/bin/bash

if [ "$APServiceVersion" ]; then return 0; fi
readonly APServiceVersion="1.0"

VIGW="at0"
VIAP=$WIAccessPoint

#APServiceAuthenticationMethods=("hash" "wpa_supplicant")
#APServiceAuthenticationMethodsInfo=("(handshake, recommended)" "(connection, slow)")

# airbase-ng uses a monitor-mode virtual interface
# and creates a separate interface, atX, for dhcpd.
VIAPAddress="$VIGWNetwork.2"

# APServiceConfigDirectory=$FLUXIONWorkspacePath

function ap_stop() {
	killall airbase-ng &> $FLUXIONOutputDevice
	
	local FLUXIONAPService=$(ps a | grep -e "FLUXION AP Service" | awk '{print $1'})
	if [ "$FLUXIONAPService" ]; then
		kill $FLUXIONAPService &> $FLUXIONOutputDevice
	fi
}

function ap_reset() {
	ap_stop
}

function ap_route() {
	ifconfig $VIAP $VIAPAddress netmask 255.255.255.0
	sysctl net.ipv6.conf.at0.disable_ipv6=1 &> $FLUXIONOutputDevice
}

function ap_prep() {
	ap_stop

	# Spoof virtual interface MAC address.
	# This is done by airbase-ng automatically.
}

function ap_start() {
	xterm $BOTTOMRIGHT -bg "#000000" -fg "#FFFFFF" -title "FLUXION AP Service [airbase-ng]" -e airbase-ng -P -e $APTargetSSID -c $APTargetChannel -a $APRogueMAC $VIAP &

	# Wait till airebase-ng has started and created the extra virtual interface.
	while [ ! $(ps a | awk '$5~/^airbase-ng/ && $0~/'"$APRogueMAC"'/{print $1}') ]
	do sleep 1
	done

	ap_route
}

# FLUXSCRIPT END
