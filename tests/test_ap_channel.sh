#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

ATTACK="$REPO_DIR/attacks/Captive Portal/attack.sh"

# Pull captive_portal_channel_supported straight out of the attack module so
# this test tracks the real implementation instead of a hand-copied stand-in.
channel_supported_source=$(
  awk '
    /^captive_portal_channel_supported\(\) \{/ { capture=1 }
    capture { print }
    capture && /^\}/ { exit }
  ' "$ATTACK"
)

if [ -z "$channel_supported_source" ]; then
  fail "Could not locate captive_portal_channel_supported in the attack module"
  finish_tests
  exit $?
fi

eval "$channel_supported_source"

# Mirrors the fallback used at every AP-channel consumer in the attack module.
effective_ap_channel() {
  local CaptivePortalAccessPointChannel=$1
  local FluxionTargetChannel=$2
  echo "${CaptivePortalAccessPointChannel:-$FluxionTargetChannel}"
}

assert_supported() {
  local channel=$1 bands=$2 label=$3
  if captive_portal_channel_supported "$channel" "$bands"; then
    pass "$label"
  else
    fail "$label"
  fi
}

assert_unsupported() {
  local channel=$1 bands=$2 label=$3
  if ! captive_portal_channel_supported "$channel" "$bands"; then
    pass "$label"
  else
    fail "$label"
  fi
}

echo "=== Rogue AP Channel Test Suite ==="
echo

echo "Test 1: 2.4GHz channels require a 2.4GHz-capable AP interface"
assert_supported 6 "2.4GHz/5GHz" "Channel 6 accepted on a dual-band interface"
assert_supported 1 "2.4GHz" "Channel 1 accepted on a 2.4GHz interface"
assert_unsupported 6 "5GHz" "Channel 6 rejected on a 5GHz-only interface"

echo "Test 2: 5GHz channels require a 5GHz-capable AP interface"
assert_supported 36 "2.4GHz/5GHz" "Channel 36 accepted on a dual-band interface"
assert_supported 149 "5GHz" "Channel 149 accepted on a 5GHz interface"
assert_unsupported 36 "2.4GHz" "Channel 36 rejected on a 2.4GHz-only interface"

echo "Test 3: unknown band capabilities do not block valid channels"
assert_supported 6 "unknown" "Channel 6 accepted when bands are unknown"
assert_supported 44 "unknown" "Channel 44 accepted when bands are unknown"

echo "Test 4: nonsense and out-of-range channels are rejected"
assert_unsupported 0 "2.4GHz/5GHz" "Channel 0 rejected"
assert_unsupported 200 "2.4GHz/5GHz" "Channel 200 rejected"
assert_unsupported abc "2.4GHz/5GHz" "Non-numeric channel rejected"

echo "Test 5: rogue AP channel falls back to the target channel when unset"
result=$(effective_ap_channel "" "48")
assert_contains "$result" "48" "Empty AP channel mirrors the target channel"
result=$(effective_ap_channel "6" "48")
assert_contains "$result" "6" "Explicit AP channel overrides the target channel"

echo
echo "=== Results: $PASS passed, $FAIL failed ==="

finish_tests

# FLUXSCRIPT END
