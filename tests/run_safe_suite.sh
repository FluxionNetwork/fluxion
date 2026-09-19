#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

tests=(
  "$SCRIPT_DIR/test_window_utils.sh"
  "$SCRIPT_DIR/test_cli_smoke.sh"
  "$SCRIPT_DIR/test_locales.sh"
  "$SCRIPT_DIR/test_library_sourcing.sh"
  "$SCRIPT_DIR/test_hash_utils.sh"
  "$SCRIPT_DIR/test_process_cleanup.sh"
  "$SCRIPT_DIR/test_target_completeness.sh"
  "$SCRIPT_DIR/test_mac_brand_lookup.sh"
  "$SCRIPT_DIR/test_ap_channel.sh"
)

failures=0

for test_script in "${tests[@]}"; do
  echo ">>> Running $(basename "$test_script")"
  if ! bash "$test_script"; then
    failures=$((failures + 1))
  fi
  echo
done

if [ "$failures" -gt 0 ]; then
  echo "$failures test script(s) failed."
  exit 1
fi

echo "All safe test scripts passed."

# FLUXSCRIPT END
