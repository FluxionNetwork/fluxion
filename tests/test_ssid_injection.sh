#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

# The target's ESSID is chosen by whoever runs the access point. These tests
# feed hostile ESSIDs through every place where Fluxion turns the ESSID into
# shell, sed or HTML source, using code extracted from the real scripts.

CP_ATTACK="$REPO_DIR/attacks/Captive Portal/attack.sh"
AIRBASE="$REPO_DIR/lib/ap/airbase-ng.sh"
MARKER="$TEST_RUNTIME_DIR/ssid_injection_marker"

extract_function() {
  awk -v name="$1" '
    $0 ~ "^" name "\\(\\) \\{" { capture=1 }
    capture { print }
    capture && /^}/ { exit }
  ' "$2"
}

HELPERS=$(
  extract_function captive_portal_html_escape "$CP_ATTACK"
  extract_function captive_portal_sed_replacement "$CP_ATTACK"
  extract_function fluxion_target_normalize_SSID "$REPO_DIR/fluxion.sh"
)
eval "$HELPERS"

for fn in captive_portal_html_escape captive_portal_sed_replacement fluxion_target_normalize_SSID; do
  if ! declare -F "$fn" >/dev/null; then
    fail "Could not load $fn from the Fluxion sources"
    finish_tests
    exit $?
  fi
done

# Each payload tries to run "touch $MARKER" in a different syntax.
PAYLOADS=(
  "\$(touch $MARKER)"
  "\`touch $MARKER\`"
  "a;touch $MARKER;#"
  "a\"; touch $MARKER; #"
  "a'; touch $MARKER; #"
  "x\\/;e touch $MARKER;#"
  "a&&touch $MARKER"
  "a|touch $MARKER"
  "a\$(touch\${IFS}$MARKER)"
)

assert_not_executed() {
  if [ -e "$MARKER" ]; then
    fail "$1"
    rm -f "$MARKER"
  else
    pass "$2"
  fi
}

echo "=== SSID Injection Test Suite ==="
echo

echo "Test 1: portal template substitution (sed) treats the SSID as text"
SED_LINE=$(grep -m1 "sed -i -e 's/\$APTargetSSID/" "$CP_ATTACK" | sed 's/^ *//; s/ {} \\;$//')
if [ -z "$SED_LINE" ]; then
  fail "Could not locate the portal template sed command"
else
  for payload in "${PAYLOADS[@]}"; do
    rm -f "$MARKER"
    template="$TEST_RUNTIME_DIR/index.html"
    printf '%s\n' '<p>$APTargetSSID</p>' >"$template"
    FluxionTargetSSID=$payload
    FluxionTargetMAC="AA:BB:CC:DD:EE:FF"
    FluxionTargetChannel="6"
    sedSSID=$(captive_portal_sed_replacement "$(captive_portal_html_escape "$FluxionTargetSSID")")
    sedMAC=$(captive_portal_sed_replacement "$(captive_portal_html_escape "$FluxionTargetMAC")")
    sedChannel=$(captive_portal_sed_replacement "$(captive_portal_html_escape "$FluxionTargetChannel")")
    eval "$SED_LINE \"\$template\"" 2>/dev/null
    assert_not_executed "sed template ran a command for SSID $payload" \
      "sed template treats SSID $payload as text"
    expected="<p>$(captive_portal_html_escape "$payload")</p>"
    assert_contains "$(cat "$template")" "$expected" \
      "sed template inserts the HTML-escaped SSID $payload verbatim"
  done
fi

echo "Test 2: HTML escaping leaves no markup characters"
escaped=$(captive_portal_html_escape "<script>alert('x')</script>&\"")
if [[ "$escaped" == *[\<\>\"\']* ]]; then
  fail "HTML escaping left markup characters: $escaped"
else
  pass "HTML escaping removes < > \" ' ($escaped)"
fi

echo "Test 3: cowpatty verification line in the authenticator script"
COWPATTY_LINE=$(grep -m1 'local -r verifiedCondition="cowpatty ' "$CP_ATTACK" | sed 's/^ *local -r //')
if [ -z "$COWPATTY_LINE" ]; then
  fail "Could not locate the cowpatty verification command"
else
  for payload in "${PAYLOADS[@]}" $'tab\there' "  spaced  "; do
    rm -f "$MARKER"
    FluxionTargetSSID=$payload
    FLUXIONWorkspacePath="$TEST_RUNTIME_DIR"
    CaptivePortalHashPath="$TEST_RUNTIME_DIR/hash.cap"
    FLUXIONOutputDevice=/dev/null
    eval "$COWPATTY_LINE"
    script="$TEST_RUNTIME_DIR/authenticator.sh"
    {
      echo "cowpatty() { printf '%s' \"\$6\" > \"$TEST_RUNTIME_DIR/cowpatty_ssid\"; }"
      echo "if $verifiedCondition; then :; fi"
    } >"$script"
    rm -f "$TEST_RUNTIME_DIR/cowpatty_ssid"
    bash "$script" 2>/dev/null
    assert_not_executed "cowpatty line ran a command for SSID $payload" \
      "cowpatty line treats SSID $payload as data"
    if [ "$(cat "$TEST_RUNTIME_DIR/cowpatty_ssid" 2>/dev/null)" = "$payload" ]; then
      pass "cowpatty receives the exact SSID $payload"
    else
      fail "cowpatty did not receive the exact SSID $payload"
    fi
  done
fi

echo "Test 4: normalized SSIDs used in generated script paths are inert"
for payload in "${PAYLOADS[@]}" "Café WiFi" "../../etc/passwd"; do
  FluxionTargetSSID=$payload
  clean=$(fluxion_target_normalize_SSID)
  if [[ "$clean" =~ ^[A-Za-z0-9_-]*$ ]]; then
    pass "SSID $payload normalizes to safe name $clean"
  else
    fail "SSID $payload normalizes to unsafe name $clean"
  fi
  rm -f "$MARKER"
  printf 'cat /dev/null >> "%s/%s-AA.log"\n' "$TEST_RUNTIME_DIR" "$clean" >"$TEST_RUNTIME_DIR/paths.sh"
  bash "$TEST_RUNTIME_DIR/paths.sh" 2>/dev/null
  assert_not_executed "normalized SSID path ran a command for $payload" \
    "normalized SSID path is inert for $payload"
done
FluxionTargetSSID="MyHome-Net_5G"
assert_contains "$(fluxion_target_normalize_SSID)" "MyHome-Net_5G" \
  "A plain SSID normalizes unchanged"

echo "Test 5: airbase-ng command string"
AIRBASE_LINE=$(grep -m1 '"airbase-ng -P -e ' "$AIRBASE" | sed 's/^ *//')
if [ -z "$AIRBASE_LINE" ]; then
  fail "Could not locate the airbase-ng command"
else
  STUB_DIR="$TEST_RUNTIME_DIR/bin"
  mkdir -p "$STUB_DIR"
  printf '#!/usr/bin/env bash\nprintf "%%s" "$3" > "%s/airbase_ssid"\n' "$TEST_RUNTIME_DIR" >"$STUB_DIR/airbase-ng"
  chmod +x "$STUB_DIR/airbase-ng"
  for payload in "${PAYLOADS[@]}" "two  spaces"; do
    APServiceSSID=$payload
    APServiceChannel=6
    APServiceMAC="AA:BB:CC:DD:EE:FF"
    APServiceInterface="fluxwl0"
    eval "command=$AIRBASE_LINE"

    # tmux mode: the command is written verbatim into a bash script.
    rm -f "$MARKER" "$TEST_RUNTIME_DIR/airbase_ssid"
    printf '#!/usr/bin/env bash\n%s\n' "$command" >"$TEST_RUNTIME_DIR/airbase.sh"
    PATH="$STUB_DIR:$PATH" bash "$TEST_RUNTIME_DIR/airbase.sh" 2>/dev/null
    assert_not_executed "airbase-ng script ran a command for SSID $payload" \
      "airbase-ng script treats SSID $payload as data"
    if [ "$(cat "$TEST_RUNTIME_DIR/airbase_ssid" 2>/dev/null)" = "$payload" ]; then
      pass "airbase-ng receives the exact SSID $payload"
    else
      fail "airbase-ng did not receive the exact SSID $payload"
    fi

    # Scan-only/headless mode: fluxion_window_open runs "eval $command".
    rm -f "$MARKER"
    (PATH="$STUB_DIR:$PATH"; eval $command) 2>/dev/null
    assert_not_executed "airbase-ng eval ran a command for SSID $payload" \
      "airbase-ng eval treats SSID $payload as data"
  done
fi

finish_tests
exit $?

# FLUXSCRIPT END
