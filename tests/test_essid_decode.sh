#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

# Extract the ESSID decode step straight out of fluxion_get_target() so this
# test tracks the real implementation. The ESSID is attacker-controlled: any
# nearby access point can broadcast it, and it is decoded for every scan
# result before the user selects a target.
DECODE_SNIPPET=$(
  awk '
    /^fluxion_get_target\(\) \{/ { infunc=1 }
    infunc && /local essidLength=/ { capture=1 }
    capture { print }
    capture && /\[\[:cntrl:\]\]/ { exit }
  ' "$REPO_DIR/fluxion.sh" | sed 's/^ *local //'
)

if [ -z "$DECODE_SNIPPET" ]; then
  fail "Could not locate the ESSID decode step in fluxion.sh"
  finish_tests
  exit $?
fi

MARKER="$TEST_RUNTIME_DIR/essid_injection_marker"

decode_essid() {
  local candidateAPInfo=$1
  # fluxion_get_target() normalizes spaces after CSV delimiters before this
  # snippet runs; do the same so the extracted code has its real input.
  candidateAPInfo=$(printf '%s' "$candidateAPInfo" | sed -r 's/,\s*/,/g')
  local i=0
  local sanitizedESSID
  local candidatesESSID=()
  eval "$DECODE_SNIPPET" 2>"$TEST_RUNTIME_DIR/stderr.log"
  printf '%s' "${candidatesESSID[0]}"
}

# Build a scan CSV line (after fluxion's ",\s*" -> "," squeeze) with the
# given ESSID as field 14. `ssid_length` is a byte count in airodump-ng's
# CSV, so tests for its escaped notation pass the original byte length as $2.
csv_line() {
  local length=${2:-}
  if [ -z "$length" ]; then
    length=$(LC_ALL=C printf '%s' "$1" | wc -c)
  fi
  printf 'AA:BB:CC:DD:EE:FF,2026-01-01 00:00:00,2026-01-01 00:00:01,6,130,WPA2,CCMP,PSK,-50,10,0,0.0.0.0,%s,%s,%s,\n' \
    "$length" "$1" ''
}

decoded_length() {
  LC_ALL=C printf '%b' "$1" | wc -c
}

echo "=== ESSID Decode Test Suite ==="
echo

echo "Test 1: an ESSID with backslash-quote sequences is never executed"
for prefix in "" '\' '\\\' '\\\\\'; do
  rm -f "$MARKER"
  essid="net${prefix}'; touch $MARKER; #"
  decode_essid "$(csv_line "$essid")" >/dev/null
  if [ -e "$MARKER" ]; then
    fail "ESSID with ${#prefix} leading backslash(es) executed a shell command"
  else
    pass "ESSID with ${#prefix} leading backslash(es) is treated as data"
  fi
done

echo "Test 2: command substitution in an ESSID is never executed"
for essid in "\$(touch $MARKER)" "\`touch $MARKER\`"; do
  rm -f "$MARKER"
  decode_essid "$(csv_line "$essid")" >/dev/null
  if [ -e "$MARKER" ]; then
    fail "ESSID $essid executed a shell command"
  else
    pass "ESSID $essid is treated as data"
  fi
done

echo "Test 3: ordinary and escaped ESSIDs still decode correctly"
assert_contains "$(decode_essid "$(csv_line "MyHomeNetwork")")" "MyHomeNetwork" \
  "A plain ESSID decodes unchanged"
assert_contains "$(decode_essid "$(csv_line "Bob's WiFi")")" "Bob's WiFi" \
  "An ESSID containing an apostrophe decodes unchanged"
assert_contains "$(decode_essid "$(csv_line 'caf\xc3\xa9' 5)")" "café" \
  "A hex-escaped non-ASCII ESSID is decoded"
assert_contains "$(decode_essid "$(csv_line 'coffee,shop')")" "coffee,shop" \
  "A comma in an ESSID is not mistaken for a CSV field separator"
assert_contains "$(decode_essid "$(csv_line 'literal\x41')")" 'literal\x41' \
  "A printable literal backslash-x sequence is not decoded"

echo "Test 4: control characters never survive decoding"
for essid in 'a\nssid=evil' 'a\x1b]0;title\x07' 'a\rb' 'a\tb' 'a\x7fb'; do
  decoded=$(decode_essid "$(csv_line "$essid" "$(decoded_length "$essid")")")
  if [[ "$decoded" == *[[:cntrl:]]* ]]; then
    fail "ESSID $essid decodes to a control character"
  else
    pass "ESSID $essid decodes without control characters ($decoded)"
  fi
done

finish_tests
exit $?

# FLUXSCRIPT END
