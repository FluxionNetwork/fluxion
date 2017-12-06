#!/bin/bash

# ================================================================
# Configuration Section
# ================================================================
VIGW="at0"
VIAP=$WIAccessPoint

# airbase-ng uses a monitor-mode virtual interface
# and creates a separate interface, atX, for dhcpd.
VIAPAddress="$VIGWNetwork.2"

# APServiceConfigDirectory=$FLUXIONWorkspacePath
# ================================================================


#if [ "$APServiceVersion" ]; then return 0; fi
#readonly APServiceVersion="1.0"


function ap_stop() {
	if [ "$APServicePID" ]
		then kill $APServicePID &> $FLUXIONOutputDevice
	fi

	APServicePID=""
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
    ap_stop

	xterm $FLUXIONHoldXterm $TOP -bg "#000000" -fg "#FFFFFF" -title "FLUXION AP Service [airbase-ng]" -e airbase-ng -P -e $APTargetSSID -c $APTargetChannel -a $APRogueMAC $VIAP &
	local parentPID=$!

	# Wait till airebase-ng has started and created the extra virtual interface.
	while [ ! "$APServicePID" ]
		do sleep 1; APServicePID=$(pgrep -P $parentPID)
	done

	ap_route
}

# FLUXSCRIPT END
