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

echo "Test 4: aircrack-ng fixtures validate a captured handshake"
reset_hash_state
FAKE_AIRCRACK_FIXTURE="$FIXTURE_DIR/aircrack-valid.txt"
export FAKE_AIRCRACK_FIXTURE
if hash_check_handshake aircrack-ng fixture.cap "Test SSID" "AA:BB:CC:DD:EE:FF"; then
  pass "Aircrack-ng fixture validates successfully"
else
  fail "Aircrack-ng fixture should validate"
fi
assert_contains "$HASHCheckHandshake" "valid" "Aircrack-ng success marks the handshake as valid"

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

finish_tests
