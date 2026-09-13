#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

FAKEBIN_DIR="$TEST_RUNTIME_DIR/fakebin"
KILLALL_LOG="$TEST_RUNTIME_DIR/killall.log"
FLUXIONOutputDevice="$TEST_RUNTIME_DIR/output.log"
mkdir -p "$FAKEBIN_DIR"
: >"$KILLALL_LOG"
: >"$FLUXIONOutputDevice"

cat >"$FAKEBIN_DIR/airmon-ng" <<'EOF'
#!/usr/bin/env bash
cat <<'OUT'

Found 3 processes that could cause trouble.
Kill them using 'airmon-ng check kill' before putting
the card in monitor mode, they will interfere by changing channels
and sometimes putting the interface back in managed mode

    PID Name
   3270 NetworkManager
   3527 wpa_supplicant
   3612 dhclient
OUT
EOF
chmod +x "$FAKEBIN_DIR/airmon-ng"

cat >"$FAKEBIN_DIR/killall" <<EOF
#!/usr/bin/env bash
echo "\$*" >> "$KILLALL_LOG"
EOF
chmod +x "$FAKEBIN_DIR/killall"

# Extract the conflicting-process cleanup loop straight out of fluxion.sh so
# this test tracks the real implementation instead of a hand-copied stand-in.
extract_cleanup_loop() {
  awk '
    /while IFS= read -r program; do/ { capture=1 }
    capture { print }
    capture && /done < <\(timeout 5 airmon-ng check/ { exit }
  ' "$REPO_DIR/fluxion.sh"
}

CLEANUP_LOOP=$(extract_cleanup_loop)

if [ -z "$CLEANUP_LOOP" ]; then
  fail "Could not locate the conflicting-process cleanup loop in fluxion.sh"
  finish_tests
  exit $?
fi

echo "=== Process Cleanup Test Suite ==="
echo

echo "Test 1: each conflicting process is killed individually"
PATH="$FAKEBIN_DIR:$PATH" eval "$CLEANUP_LOOP"

assert_contains "$(cat "$KILLALL_LOG")" $'NetworkManager\nwpa_supplicant\ndhclient' \
  "killall is invoked once per conflicting process, in order"

KILLALL_CALLS=$(wc -l <"$KILLALL_LOG")
assert_exit_code 3 "$KILLALL_CALLS" "killall is invoked exactly once per process, not once total"

echo "Test 2: a differently-shaped airmon-ng header doesn't leak into the process list"
# Some airmon-ng versions omit the leading blank line before the summary
# text. The header skip must key off the numeric PID column, not a fixed
# line count, or the "PID Name" header row itself gets treated as a process.
cat >"$FAKEBIN_DIR/airmon-ng" <<'EOF'
#!/usr/bin/env bash
cat <<'OUT'
Found 1 processes that could cause trouble.
Kill them using 'airmon-ng check kill' before putting
the card in monitor mode, they will interfere by changing channels
and sometimes putting the interface back in managed mode

    PID Name
   4210 NetworkManager
OUT
EOF
chmod +x "$FAKEBIN_DIR/airmon-ng"

: >"$KILLALL_LOG"
PATH="$FAKEBIN_DIR:$PATH" eval "$CLEANUP_LOOP"

assert_contains "$(cat "$KILLALL_LOG")" "NetworkManager" \
  "The relocated header is still skipped correctly"

KILLALL_CALLS=$(wc -l <"$KILLALL_LOG")
assert_exit_code 1 "$KILLALL_CALLS" "The header row itself is never passed to killall"

finish_tests
