#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

# Extract the target-completeness conditions straight out of fluxion.sh's
# fluxion_target_set() so this test tracks the real implementation instead
# of a hand-copied stand-in.
extract_complete_condition() {
  awk '
    /^fluxion_target_set\(\) \{/ { infunc=1 }
    infunc && /^  if \[\[ \\$/ { capture=1; sub(/^  if /, ""); print; next }
    capture { print }
    capture && /\]\]; then$/ { exit }
  ' "$REPO_DIR/fluxion.sh" | sed 's/; then$//'
}

extract_partial_condition() {
  awk '
    /^fluxion_target_set\(\) \{/ { infunc=1 }
    infunc && /^  elif \[\[ \\$/ { capture=1; sub(/^  elif /, ""); print; next }
    capture { print }
    capture && /\]\]; then$/ { exit }
  ' "$REPO_DIR/fluxion.sh" | sed 's/; then$//'
}

COMPLETE_CONDITION=$(extract_complete_condition)
PARTIAL_CONDITION=$(extract_partial_condition)

if [ -z "$COMPLETE_CONDITION" ] || [ -z "$PARTIAL_CONDITION" ]; then
  fail "Could not locate the target-completeness checks in fluxion.sh"
  finish_tests
  exit $?
fi

check_target_state() {
  local FluxionTargetSSID=$1
  local FluxionTargetMAC=$2
  local FluxionTargetChannel=$3
  local state

  eval "
    if $COMPLETE_CONDITION; then state=complete
    elif $PARTIAL_CONDITION; then state=partial
    else state=none
    fi
  " 2>"$TEST_RUNTIME_DIR/stderr.log"

  echo "$state"
}

echo "=== Target Completeness Test Suite ==="
echo

echo "Test 1: an SSID matching a test(1) operator token is still a complete target"
# A hostile or coincidentally-named nearby AP can use any of these as a
# literal SSID. The bare "-a"/"-o" chained form used to collide with these
# tokens and throw a bash syntax error instead of evaluating truthiness.
for ssid in "-a" "-o" "!" "-f" "-z" "-n"; do
  : >"$TEST_RUNTIME_DIR/stderr.log"
  STATE=$(check_target_state "$ssid" "AA:BB:CC:DD:EE:FF" "6")

  assert_contains "$STATE" "complete" \
    "SSID '$ssid' with MAC and channel set is recognized as a complete target"
  assert_empty_file "$TEST_RUNTIME_DIR/stderr.log" \
    "SSID '$ssid' does not trigger a test(1) syntax error"
done

echo "Test 2: a normal SSID is still recognized as a complete target"
STATE=$(check_target_state "MyHomeNetwork" "AA:BB:CC:DD:EE:FF" "6")
assert_contains "$STATE" "complete" \
  "A normal SSID with MAC and channel set is recognized as a complete target"

echo "Test 3: a partially set target is recognized as partial, not complete"
STATE=$(check_target_state "MyHomeNetwork" "" "")
assert_contains "$STATE" "partial" \
  "An SSID with no MAC or channel is recognized as a partial target"

echo "Test 4: a fully empty target is recognized as neither complete nor partial"
STATE=$(check_target_state "" "" "")
assert_contains "$STATE" "none" \
  "An empty SSID, MAC, and channel is recognized as having no target"

finish_tests

# FLUXSCRIPT END
