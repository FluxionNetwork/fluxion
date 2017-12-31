#!/bin/bash

if [ "$HashUtilsVersion" ]; then return 0; fi
readonly HashUtilsVersion="1.0"

HashOutputDevice="/dev/stdout"

function hash_check_handshake() {
  local handshakeVerifier=$1
  local handshakePath=$2
  local handshakeAPSSID=$3
  local handshakeAPMAC=$4

  local analysis
  local hashData

  echo "Verifier Parameters: $handshakeVerifier, path $handshakePath, SSID \"$handshakeAPSSID\", MAC $handshakeAPMAC" >$HashOutputDevice

  case "$handshakeVerifier" in
  "pyrit")
    readarray analysis < <(pyrit -r "$handshakePath" analyze 2>$HashOutputDevice)
    if [ "${#analysis[@]}" -eq 0 -o $? != 0 ]; then
      echo "Error: pyrit seems to be broken!" >$HashOutputDevice
      return 1
    fi

    local hashMeta=$(echo "${analysis[@]}" | grep -F "AccessPoint ${handshakeAPMAC,,} ('$handshakeAPSSID')")

    if [ "$hashMeta" ]; then
      local hashID=$(echo "$hashMeta" | awk -F'[ #:]' '{print $3}')
      hashData=$(echo "${analysis[@]}" | awk "\$0~/#$hashID: HMAC_SHA[0-9]+_AES/{ print \$0 }")
    else
      echo "No valid hash meta was found for \"$handshakeAPSSID\"" >$HashOutputDevice
    fi
    ;;
  "aircrack-ng")
    readarray analysis < <(aircrack-ng "$handshakePath" 2>$HashOutputDevice)
    if [ "${#analysis[@]}" -eq 0 -o $? != 0 ]; then
      echo "Error: aircrack-ng seems to be broken!" >$HashOutputDevice
      return 1
    fi

    hashData=$(echo "${analysis[@]}" | grep -E "${handshakeAPMAC^^}\s+" | grep -F "$handshakeAPSSID")
    ;;
  *)
    echo "Invalid verifier, quitting!"
    return 1
    ;;
  esac

  if [ -z "$hashData" ]; then
    echo "Handshake for $handshakeAPSSID ($handshakeAPMAC) is missing!"
    return 1
  fi

  local hashResult
  case "$handshakeVerifier" in
  "pyrit") hashResult=$(echo "$hashData" | grep "good") ;;
  "aircrack-ng") hashResult=$(echo "$hashData" | grep "(1 handshake)") ;;
  esac

  if [ -z "$hashResult" ]; then
    echo "Invalid hash for $handshakeAPSSID ($handshakeAPMAC)!"
    HASHCheckHandshake="invalid"
    return 1
  else
    echo "Valid hash for $handshakeAPSSID ($handshakeAPMAC)!"
    HASHCheckHandshake="valid"
  fi
}
