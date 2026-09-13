#!/usr/bin/env bash

TESTS_LIB_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
readonly TESTS_LIB_DIR
TESTS_DIR=$(dirname "$TESTS_LIB_DIR")
readonly TESTS_DIR
REPO_DIR=$(dirname "$TESTS_DIR")
readonly REPO_DIR

tests_init() {
  TEST_NAME=${1:-$(basename "$0")}
  PASS=0
  FAIL=0
  CAPTURE_COUNT=0
  TEST_RUNTIME_DIR="$TESTS_DIR/.runtime/${TEST_NAME%.sh}.$$"
  mkdir -p "$TEST_RUNTIME_DIR"
  trap tests_cleanup EXIT
}

tests_cleanup() {
  if [ -n "${TEST_RUNTIME_DIR:-}" ] && [ -d "$TEST_RUNTIME_DIR" ]; then
    rm -rf "$TEST_RUNTIME_DIR"
  fi
}

pass() {
  echo "  PASS: $1"
  PASS=$((PASS + 1))
}

fail() {
  echo "  FAIL: $1"
  FAIL=$((FAIL + 1))
}

assert_exit_code() {
  local expected=$1
  local actual=$2
  local label=$3

  if [ "$actual" -eq "$expected" ]; then
    pass "$label"
  else
    fail "$label (expected $expected, got $actual)"
  fi
}

assert_contains() {
  local haystack=$1
  local needle=$2
  local label=$3

  if [[ "$haystack" == *"$needle"* ]]; then
    pass "$label"
  else
    fail "$label"
  fi
}

assert_empty_file() {
  local path=$1
  local label=$2

  if [ ! -s "$path" ]; then
    pass "$label"
  else
    fail "$label"
  fi
}

run_capture() {
  local -n stdout_ref=$1
  local -n stderr_ref=$2
  local -n status_ref=$3
  shift 3

  CAPTURE_COUNT=$((CAPTURE_COUNT + 1))
  local prefix="$TEST_RUNTIME_DIR/capture_$CAPTURE_COUNT"

  "$@" >"$prefix.stdout" 2>"$prefix.stderr"
  status_ref=$?
  stdout_ref=$(cat "$prefix.stdout")
  stderr_ref=$(cat "$prefix.stderr")
}

finish_tests() {
  echo
  echo "=== Results: $PASS passed, $FAIL failed ==="

  if [ "$FAIL" -gt 0 ]; then
    return 1
  fi

  return 0
}
