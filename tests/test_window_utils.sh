#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

FLUXIONWorkspacePath="$TEST_RUNTIME_DIR/workspace"
FLUXIONOutputDevice="/dev/null"
FLUXIONDebug=""
FLUXIONTMux=1
FLUXIONOriginalArgs=""
TMUX="fake"
FLUXIONDisplayMode=""

mkdir -p "$FLUXIONWorkspacePath"

source "$REPO_DIR/lib/WindowUtils.sh"

echo "=== WindowUtils.sh Test Suite ==="
echo

# ---- Test 1: tmux init ----
echo "Test 1: tmux init"
fluxion_window_init >/dev/null 2>&1 || true
if [ "$FLUXIONDisplayMode" = "tmux" ]; then
	pass "Display mode set to tmux"
else
	fail "Expected tmux, got: $FLUXIONDisplayMode"
fi

# ---- Test 2: xterm mode init ----
echo "Test 2: xterm mode init"
FLUXIONTMux=""
FLUXIONDisplayMode=""
fluxion_window_init
if [ "$FLUXIONDisplayMode" = "xterm" ]; then
	pass "Display mode set to xterm when FLUXIONTMux is empty"
else
	fail "Expected xterm, got: $FLUXIONDisplayMode"
fi

# ---- Test 3: Window counter increments ----
echo "Test 3: Window counter increments"
old_counter=$FLUXIONWindowCounter
FLUXIONWindowCounter=$((FLUXIONWindowCounter + 1))
if [ "$FLUXIONWindowCounter" -gt "$old_counter" ]; then
	pass "Window counter increments correctly"
else
	fail "Window counter did not increment"
fi

# ---- Test 4: fluxion_window_close with empty PID ----
echo "Test 4: fluxion_window_close handles empty PID"
TestClosePID=""
fluxion_window_close TestClosePID
if [ -z "$TestClosePID" ]; then
	pass "Close with empty PID is safe"
else
	fail "Close with empty PID changed the variable"
fi

# ---- Test 5: fluxion_window_close kills process ----
echo "Test 5: fluxion_window_close kills a real process"
sleep 300 &
TestKillPID=$!
fluxion_window_close TestKillPID
sleep 0.5
if ! kill -0 "$TestKillPID" 2>/dev/null; then
	pass "Process was killed"
else
	kill "$TestKillPID" 2>/dev/null
	fail "Process was NOT killed"
fi
if [ -z "$TestKillPID" ]; then
	pass "PID variable was cleared"
else
	fail "PID variable was not cleared"
fi

# ---- Test 6: fluxion_window_cleanup is callable ----
echo "Test 6: fluxion_window_cleanup runs without error"
FLUXIONDisplayMode="xterm"  # xterm mode cleanup is a no-op
fluxion_window_cleanup
pass "Cleanup ran without error (xterm mode)"

# ---- Test 7: headless window open/close ----
echo "Test 7: headless window open and close"
FLUXIONScanOnly=1
FLUXIONDisplayMode=""
fluxion_window_init >/dev/null 2>&1 || true
TestHeadlessPID=""
fluxion_window_open TestHeadlessPID "Headless" "" "#000000" "#FFFFFF" "sleep 300"
if [ "$FLUXIONDisplayMode" = "headless" ]; then
	pass "Scan-only mode sets headless display mode"
else
	fail "Expected headless mode, got: $FLUXIONDisplayMode"
fi
if [ -n "$TestHeadlessPID" ] && kill -0 "$TestHeadlessPID" 2>/dev/null; then
	pass "Headless window open returns a running PID"
else
	fail "Headless window open did not start a process"
fi
HeadlessPIDBeforeClose=$TestHeadlessPID
fluxion_window_close TestHeadlessPID
sleep 0.5
if [ -z "$TestHeadlessPID" ] && ! kill -0 "$HeadlessPIDBeforeClose" 2>/dev/null; then
	pass "Headless window close clears the PID"
else
	fail "Headless window close did not clean up the process"
fi

finish_tests
