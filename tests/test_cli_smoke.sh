#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

write_unexpected_stub() {
  local command_name=$1
  cat >"$FAKEBIN_DIR/$command_name" <<EOF
#!/usr/bin/env bash
echo "$command_name \$*" >> "$UNEXPECTED_LOG"
exit 99
EOF
  chmod +x "$FAKEBIN_DIR/$command_name"
}

run_fluxion() {
  local stdout_value=""
  local stderr_value=""
  local status_value=0

  run_capture stdout_value stderr_value status_value \
    env \
      PATH="$FAKEBIN_DIR:$PATH" \
      FLUXIONWorkspacePath="$TEST_RUNTIME_DIR/fluxspace" \
      FLUXIONPreferencesFile="$TEST_RUNTIME_DIR/preferences.conf" \
      InstallerUtilsInstalledPackagesFile="$TEST_RUNTIME_DIR/installed_packages.list" \
      bash "$REPO_DIR/fluxion.sh" "$@"

  FLUXION_STDOUT=$stdout_value
  FLUXION_STDERR=$stderr_value
  FLUXION_STATUS=$status_value
}

EXPECTED_VERSION=$(
  awk -F= '
    /^readonly FLUXIONVersion=/ { version=$2 }
    /^readonly FLUXIONRevision=/ { revision=$2 }
    END { print "FLUXION V" version "." revision }
  ' "$REPO_DIR/fluxion.sh"
)

FAKEBIN_DIR="$TEST_RUNTIME_DIR/fakebin"
UNEXPECTED_LOG="$TEST_RUNTIME_DIR/unexpected.log"
mkdir -p "$FAKEBIN_DIR"
: >"$UNEXPECTED_LOG"

for stub_name in airodump-ng ip iptables-save iw macchanger script tmux xterm xdpyinfo; do
  write_unexpected_stub "$stub_name"
done

cat >"$FAKEBIN_DIR/grep" <<EOF
#!/usr/bin/env bash
if [ "\$1" = "-qs" ] && [ "\$2" = "DEVTYPE=wlan" ] && [[ "\$3" == /sys/class/net/*/uevent ]]; then
  exit 1
fi
exec /usr/bin/grep "\$@"
EOF
chmod +x "$FAKEBIN_DIR/grep"

echo "=== CLI Smoke Test Suite ==="
echo

echo "Test 1: version mode handles non-interactive flags safely"
run_fluxion --auto --scan-only --version
assert_exit_code 0 "$FLUXION_STATUS" "Combined version mode exits successfully"
assert_contains "$FLUXION_STDOUT" "$EXPECTED_VERSION" "Combined version mode prints the expected version"

echo "Test 2: help mode advertises smoke-safe flags"
run_fluxion --help
assert_exit_code 0 "$FLUXION_STATUS" "Help mode exits successfully"
assert_contains "$FLUXION_STDOUT" "--scan-only" "Help output documents scan-only mode"
assert_contains "$FLUXION_STDOUT" "--list-interfaces" "Help output documents list-interfaces mode"

echo "Test 3: list-interfaces exits cleanly without wireless hardware"
run_fluxion --list-interfaces
assert_exit_code 1 "$FLUXION_STATUS" "List-interfaces reports no hardware"
assert_contains "$FLUXION_STDOUT" "No wireless interfaces detected." "List-interfaces prints the no-hardware message"

assert_empty_file "$UNEXPECTED_LOG" "Smoke modes did not invoke stubbed wireless or terminal commands"

finish_tests
