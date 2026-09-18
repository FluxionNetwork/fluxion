#!/usr/bin/env bash

# ================================================================
# Configuration Section
# ================================================================
#APServiceConfigDirectory=$FLUXIONWorkspacePath
# ================================================================

#if [ "$APServiceVersion" ]; then return 0; fi
#readonly APServiceVersion="1.0"

function ap_service_stop() {
  if [ "$APServiceXtermPID" ]; then
    kill $APServiceXtermPID &>> $FLUXIONOutputDevice
  fi

  if [ "$APServicePID" ]; then
    kill $APServicePID &>> $FLUXIONOutputDevice
  fi

  APServiceXtermPID=""
  APServicePID=""
}

function ap_service_reset() {
  ap_service_stop

  # Restore original regulatory domain if we changed it.
  if [ "$APServiceOrigRegDomain" ]; then
    local __iw=$(command -v iw 2>/dev/null || echo /usr/sbin/iw)
    if [ -x "$__iw" ]; then
      "$__iw" reg set "$APServiceOrigRegDomain" 2>/dev/null
    fi
    APServiceOrigRegDomain=""
  fi

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

  ip addr add "$networkSubnet.$networkAddress/24" dev "at0" 2>/dev/null

  if ! sysctl net.ipv6.conf.at0.disable_ipv6=1 &>> $FLUXIONOutputDevice; then
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

  # For 5GHz channels, set a permissive regulatory domain to allow
  # transmission (many adapters default to country 00 which marks
  # all 5GHz as no-IR/passive-scan only).
  if [ "$APServiceChannel" -gt 14 ] 2>/dev/null; then
    local __iw=$(command -v iw 2>/dev/null || echo /usr/sbin/iw)
    if [ -x "$__iw" ]; then
      APServiceOrigRegDomain=$("$__iw" reg get 2>/dev/null | grep -m1 "^country" | sed 's/country \([A-Z0-9]*\).*/\1/')
      "$__iw" reg set "${FLUXIONRegDomain:-US}" 2>/dev/null
      sleep 0.5
    fi
  fi

  # Spoof virtual interface MAC address.
  # This is done by airbase-ng automatically.

  # airbase-ng uses a monitor-mode virtual interface
  # and creates a separate interface, atX, for kea-dhcp4.
  APServiceAccessInterface="at0"
}

function ap_service_start() {
  ap_service_stop

  fluxion_window_open APServiceXtermPID \
    "FLUXION AP Service [airbase-ng]" "$TOP" "#000000" "#FFFFFF" \
    "airbase-ng -P -e $APServiceSSID -c $APServiceChannel -a $APServiceMAC $APServiceInterface"

  # Wait till airbase-ng starts and creates the extra virtual interface.
  while [ ! "$APServicePID" ]; do
    sleep 1
    APServicePID=$(pgrep -P $APServiceXtermPID 2>/dev/null)
  done

  # Wait for airbase-ng to create the at0 virtual interface.
  local __retries=0
  while ! ip link show at0 &>/dev/null; do
    sleep 1
    __retries=$((__retries + 1))
    if [ $__retries -ge 15 ]; then
      echo "at0 not created after 15s; aborting." >> $FLUXIONOutputDevice
      return 1
    fi
  done

  # Bring at0 up — retry in case it needs a moment after creation.
  __retries=0
  while ! ip link set at0 up 2>/dev/null || \
        ! ip link show at0 2>/dev/null | grep -q "UP"; do
    sleep 1
    __retries=$((__retries + 1))
    if [ $__retries -ge 10 ]; then
      echo "at0 failed to come up after 10s; aborting." >> $FLUXIONOutputDevice
      return 1
    fi
  done

  ip addr flush dev at0 2>/dev/null
  ip addr add "$APServiceInterfaceAddress/24" dev "at0" 2>/dev/null
  ap_service_route
}

# FLUXSCRIPT END
