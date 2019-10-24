#!/usr/bin/env bash

# ================================================================
# Configuration Section
# ================================================================
#APServiceConfigDirectory=$FLUXIONWorkspacePath
# ================================================================

#if [ "$APServiceVersion" ]; then return 0; fi
#readonly APServiceVersion="1.0"

function ap_service_stop() {
  if [ "$APServicePID" ]; then
    kill $APServicePID &> $FLUXIONOutputDevice
  fi

  APServicePID=""
}

function ap_service_reset() {
  ap_service_stop

  APServiceAccessInterface=""

  APServiceChannel=""
  APServiceMAC=""
  APServiceSSID=""
  APServiceInterfaceAddress=""
  APServiceInterface=""
}

function ap_service_route() {
  local networkSubnet=${APServiceInterfaceAddress%.*}
  local networkAddress=$(( ( ${APServiceInterfaceAddress##*.} + 1 ) % 255 ))

  if [ $hostID -eq 0 ]; then
    let hostID++
  fi

  # TODO: Dynamically get the airbase-ng tap interface & use below.
  # WARNING: Notice the interface below is STATIC, it'll break eventuajly!
 if ! ip addr add "at0" $networkSubnet.$networkAddress/24; then
    return 1
  fi

  if ! sysctl net.ipv6.conf.at0.disable_ipv6=1 &> $FLUXIONOutputDevice; then
    return 2
  fi
}

function ap_service_prep() {
  if [ ${#@} -lt 5 ]; then return 1; fi

  APServiceInterface=$1
  APServiceInterfaceAddress=$2
  APServiceSSID=$3
  APServiceMAC=$4
  APServiceChannel=$5

  ap_service_stop

  # Spoof virtual interface MAC address.
  # This is done by airbase-ng automatically.

  # airbase-ng uses a monitor-mode virtual interface
  # and creates a separate interface, atX, for dhcpd.
  APServiceAccessInterface="at0"
}

function ap_service_start() {
  ap_service_stop

  xterm $FLUXIONHoldXterm $TOP -bg "#000000" -fg "#FFFFFF" \
    -title "FLUXION AP Service [airbase-ng]" -e \
    airbase-ng -y -e $APServiceSSID -c $APServiceChannel \
      -a $APServiceMAC $APServiceInterface &
  local parentPID=$!

  # Wait till airebase-ng starts and creates the extra virtual interface.
  while [ ! "$APServicePID" ]; do
    sleep 1
    APServicePID=$(pgrep -P $parentPID)
  done
  eval ifconfig at0 192.169.254.1
  ap_service_route
}

# FLUXSCRIPT END
