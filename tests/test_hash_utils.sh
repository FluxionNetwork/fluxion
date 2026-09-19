#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

FAKEBIN_DIR="$TEST_RUNTIME_DIR/fakebin"
HASH_OUTPUT="$TEST_RUNTIME_DIR/hash-output.log"
FIXTURE_DIR="$REPO_DIR/tests/fixtures/hashutils"
ORIGINAL_PATH=$PATH

mkdir -p "$FAKEBIN_DIR"
: >"$HASH_OUTPUT"

cat >"$FAKEBIN_DIR/pyrit" <<'EOF'
#!/usr/bin/env bash
cat "$FAKE_PYRIT_FIXTURE"
EOF
chmod +x "$FAKEBIN_DIR/pyrit"

cat >"$FAKEBIN_DIR/aircrack-ng" <<'EOF'
#!/usr/bin/env bash
cat "$FAKE_AIRCRACK_FIXTURE"
EOF
chmod +x "$FAKEBIN_DIR/aircrack-ng"

cat >"$FAKEBIN_DIR/cowpatty" <<'EOF'
#!/usr/bin/env bash
cat "$FAKE_COWPATTY_FIXTURE"
EOF
chmod +x "$FAKEBIN_DIR/cowpatty"

PATH="$FAKEBIN_DIR:$ORIGINAL_PATH"
source "$REPO_DIR/lib/HashUtils.sh"
HashOutputDevice="$HASH_OUTPUT"

reset_hash_state() {
  HASHCheckHandshake=""
  : >"$HASH_OUTPUT"
}

echo "=== HashUtils.sh Test Suite ==="
echo

echo "Test 1: invalid verifier is rejected"
reset_hash_state
if hash_check_handshake invalid verifier.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  fail "Invalid verifier should fail"
else
  pass "Invalid verifier fails"
fi
assert_contains "$(cat "$HASH_OUTPUT")" "Invalid verifier, quitting!" "Invalid verifier writes the expected error"

echo "Test 2: pyrit fixtures validate a captured handshake"
reset_hash_state
FAKE_PYRIT_FIXTURE="$FIXTURE_DIR/pyrit-valid.txt"
export FAKE_PYRIT_FIXTURE
if hash_check_handshake pyrit fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  pass "Pyrit fixture validates successfully"
else
  fail "Pyrit fixture should validate"
fi
assert_contains "$HASHCheckHandshake" "valid" "Pyrit success marks the handshake as valid"

echo "Test 3: pyrit fixtures reject a missing handshake"
reset_hash_state
FAKE_PYRIT_FIXTURE="$FIXTURE_DIR/pyrit-missing.txt"
export FAKE_PYRIT_FIXTURE
if hash_check_handshake pyrit fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  fail "Pyrit missing fixture should fail"
else
  pass "Pyrit missing fixture fails"
fi

echo "Test 4: aircrack-ng validates a captured handshake"
reset_hash_state
FAKE_AIRCRACK_FIXTURE="$FIXTURE_DIR/aircrack-valid.txt"
export FAKE_AIRCRACK_FIXTURE
if hash_check_handshake aircrack-ng fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  pass "Aircrack-ng fixture validates successfully"
else
  fail "Aircrack-ng fixture should validate"
fi
assert_contains "$HASHCheckHandshake" "valid" "Aircrack-ng success marks the handshake as valid"

echo "Test 4b: aircrack-ng validates a handshake reported with a PMKID"
reset_hash_state
FAKE_AIRCRACK_FIXTURE="$FIXTURE_DIR/aircrack-pmkid.txt"
export FAKE_AIRCRACK_FIXTURE
# The "(1 handshake, with PMKID)" form must still be accepted; the old
# "\(1 handshake\)" regex missed the trailing ", with PMKID".
if hash_check_handshake aircrack-ng fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  pass "Aircrack-ng accepts a handshake reported with a PMKID"
else
  fail "Aircrack-ng should accept a handshake reported with a PMKID"
fi

echo "Test 4c: aircrack-ng rejects a capture with no crackable handshake"
reset_hash_state
FAKE_AIRCRACK_FIXTURE="$FIXTURE_DIR/aircrack-nohandshake.txt"
export FAKE_AIRCRACK_FIXTURE
if hash_check_handshake aircrack-ng fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  fail "Aircrack-ng should reject a capture with (0 handshake)"
else
  pass "Aircrack-ng rejects a capture with no handshake"
fi
assert_contains "$HASHCheckHandshake" "invalid" "No-handshake capture is marked invalid"

echo "Test 5: cowpatty fixtures validate a captured handshake"
reset_hash_state
FAKE_AIRCRACK_FIXTURE="$FIXTURE_DIR/aircrack-valid.txt"
FAKE_COWPATTY_FIXTURE="$FIXTURE_DIR/cowpatty-valid.txt"
export FAKE_AIRCRACK_FIXTURE FAKE_COWPATTY_FIXTURE
if hash_check_handshake cowpatty fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  pass "Cowpatty fixture validates successfully"
else
  fail "Cowpatty fixture should validate"
fi
assert_contains "$HASHCheckHandshake" "valid" "Cowpatty success marks the handshake as valid"

echo "Test 6: cowpatty rejects an incomplete handshake"
reset_hash_state
FAKE_AIRCRACK_FIXTURE="$FIXTURE_DIR/aircrack-valid.txt"
FAKE_COWPATTY_FIXTURE="$FIXTURE_DIR/cowpatty-incomplete.txt"
export FAKE_AIRCRACK_FIXTURE FAKE_COWPATTY_FIXTURE
if hash_check_handshake cowpatty fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  fail "Cowpatty should reject an incomplete handshake"
else
  pass "Cowpatty rejects an incomplete handshake"
fi
assert_contains "$HASHCheckHandshake" "invalid" "Incomplete handshake is marked invalid"

finish_tests

# FLUXSCRIPT END
