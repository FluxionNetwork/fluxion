#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"
shopt -s nullglob

check_required_variables() {
  local locale_file=$1
  shift

  if (
    source "$locale_file"
    for required_name in "$@"; do
      [ -n "${!required_name-}" ] || exit 1
    done
  ); then
    pass "$(basename "$locale_file") loads required strings"
  else
    fail "$(basename "$locale_file") is missing required strings"
  fi
}

echo "=== Locale Syntax and Loading Test Suite ==="
echo

for locale_file in "$REPO_DIR"/language/*.sh; do
  if bash -n "$locale_file"; then
    pass "$(basename "$locale_file") passes bash -n"
  else
    fail "$(basename "$locale_file") fails bash -n"
  fi

  check_required_variables \
    "$locale_file" \
    FLUXIONInterfaceQuery \
    FLUXIONAttackQuery \
    FLUXIONCleanupSuccessNotice
done

for locale_file in "$REPO_DIR"/attacks/Captive\ Portal/language/*.sh; do
  if bash -n "$locale_file"; then
    pass "Captive Portal $(basename "$locale_file") passes bash -n"
  else
    fail "Captive Portal $(basename "$locale_file") fails bash -n"
  fi

  check_required_variables \
    "$locale_file" \
    CaptivePortalJammerInterfaceQuery \
    CaptivePortalAPServiceQuery \
    CaptivePortalConnectivityQuery
done

for locale_file in "$REPO_DIR"/attacks/Handshake\ Snooper/language/*.sh; do
  if bash -n "$locale_file"; then
    pass "Handshake Snooper $(basename "$locale_file") passes bash -n"
  else
    fail "Handshake Snooper $(basename "$locale_file") fails bash -n"
  fi

  check_required_variables \
    "$locale_file" \
    HandshakeSnooperJammerInterfaceQuery \
    HandshakeSnooperMethodQuery \
    HandshakeSnooperArbiterSuccededNotice
done

finish_tests

# FLUXSCRIPT END
