#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

ATTACK_SH="$REPO_DIR/attacks/Captive Portal/attack.sh"

# Extract the client-MAC presence check straight out of
# captive_portal_get_MAC_brand() so this test tracks the real
# implementation instead of a hand-copied stand-in.
extract_mac_check() {
  awk '
    /^captive_portal_get_MAC_brand\(\) \{/ { infunc=1; next }
    infunc && /^  if \[/ { print; exit }
  ' "$ATTACK_SH"
}

MAC_CHECK=$(extract_mac_check)

if [ -z "$MAC_CHECK" ]; then
  fail "Could not locate the client-MAC presence check in attack.sh"
  finish_tests
  exit $?
fi

check_mac_presence() {
  local mac_value=$1
  local result

  captive_portal_get_IP_MAC() { echo -n "$mac_value"; }

  eval "$MAC_CHECK result=found; else result=missing; fi" \
    2>"$TEST_RUNTIME_DIR/stderr.log"

  echo "$result"
}

echo "=== MAC Brand Lookup Test Suite ==="
echo

echo "Test 1: no client MAC yet (empty lookup) produces no shell errors"
: >"$TEST_RUNTIME_DIR/stderr.log"
RESULT=$(check_mac_presence "")
assert_contains "$RESULT" "missing" \
  "An empty client MAC is correctly treated as absent"
assert_empty_file "$TEST_RUNTIME_DIR/stderr.log" \
  "An empty client MAC lookup does not emit a test(1) syntax error"

echo "Test 2: a resolved client MAC is detected as present"
: >"$TEST_RUNTIME_DIR/stderr.log"
RESULT=$(check_mac_presence "aa:bb:cc:dd:ee:ff")
assert_contains "$RESULT" "found" \
  "A resolved client MAC is correctly treated as present"
assert_empty_file "$TEST_RUNTIME_DIR/stderr.log" \
  "A resolved client MAC lookup does not emit shell errors"

finish_tests
