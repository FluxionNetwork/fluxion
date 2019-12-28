#!/usr/bin/env bash

if [ "$HashUtilsVersion" ]; then return 0; fi
readonly HashUtilsVersion="1.0"

HashOutputDevice="/dev/stdout"

function hash_check_handshake() {
  local -r handshakeVerifier=$1
  local -r handshakePath=$2
  local -r handshakeAPSSID=$3
  local -r handshakeAPMAC=$4

  echo "Verifier Parameters: " > $HashOutputDevice
  echo " Verifier: $handshakeVerifier" > $HashOutputDevice
  echo "Hash Path: $handshakePath" > $HashOutputDevice
  echo "Hash SSID: \"$handshakeAPSSID\"" > $HashOutputDevice
  echo " Hash MAC: $handshakeAPMAC" > $HashOutputDevice

  local analysis # Since it's being used in all relevant instances.

  case "$handshakeVerifier" in
    "pyrit")
      readarray analysis < <(pyrit -r "$handshakePath" analyze 2> $HashOutputDevice)
      if [ "${#analysis[@]}" -eq 0 -o $? != 0 ]; then
        echo "Error: pyrit seems to be broken!" > $HashOutputDevice
        return 1
      fi

      local hashMeta=$(echo "${analysis[@]}" | grep -F "AccessPoint ${handshakeAPMAC,,} ('$handshakeAPSSID')")

      if [ "$hashMeta" ]; then
        local hashID=$(echo "$hashMeta" | awk -F'[ #:]' '{print $3}')
        local hashData=$(echo "${analysis[@]}" | awk "\$0~/#$hashID: HMAC_(SHA[0-9]+_AES|MD5_RC4)/{ print \$0 }")
      else
        echo "No valid hash meta was found for \"$handshakeAPSSID\"" > $HashOutputDevice
      fi
      ;;
    "aircrack-ng")
      readarray analysis < <(aircrack-ng "$handshakePath" 2> $HashOutputDevice)
      if [ "${#analysis[@]}" -eq 0 -o $? != 0 ]; then
        echo "Error: aircrack-ng seems to be broken!" > $HashOutputDevice
        return 1
      fi

      local hashData=$(echo "${analysis[@]}" | grep -E "${handshakeAPMAC^^}\s+" | grep -F "$handshakeAPSSID")
      ;;
    "cowpatty")
      readarray analysis < <(aircrack-ng "$handshakePath" 2> $HashOutputDevice)
      if [ "${#analysis[@]}" -eq 0 -o $? != 0 ]; then
        echo "Error: cowpatty (aircrack-ng) seems to be broken!" > $HashOutputDevice
        return 1
      fi

      if echo "${analysis[@]}" | grep -E "${handshakeAPMAC^^}\s+" | grep -qF "$handshakeAPSSID"; then
        local hashData=$(cowpatty -cr "$handshakePath")
      fi
      ;;
    *)
      echo "Invalid verifier, quitting!" > $HashOutputDevice
      return 1
      ;;
  esac

  if [ -z "$hashData" ]; then
    echo "Handshake for $handshakeAPSSID ($handshakeAPMAC) is missing!"
    return 1
  fi

  case "$handshakeVerifier" in
    "pyrit")
      if echo "$hashData" | grep -qF "good"; then
        local -r hashResult=1
      fi ;;

    "aircrack-ng")
      if echo "$hashData" | grep -qE "\(1 handshake\)"; then
        local -r hashResult=1
      fi ;;

    "cowpatty")
      if echo "$hashData" | grep -q "Collected all necessary data to mount crack against WPA2/PSK passphrase."; then
        local -r hashResult=1
      fi ;;
  esac

  if [ -z "$hashResult" ]; then
    echo "Invalid hash for $handshakeAPSSID ($handshakeAPMAC)!" > $HashOutputDevice
    HASHCheckHandshake="invalid"
    return 1
  else
    echo "Valid hash for $handshakeAPSSID ($handshakeAPMAC)!" > $HashOutputDevice
    HASHCheckHandshake="valid"
  fi
}
