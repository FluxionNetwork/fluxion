#!/usr/bin/env bash

source "$(dirname "$(readlink -f "$0")")/lib/testlib.sh"

tests_init "$(basename "$0")"

echo "=== Library Sourcing Test Suite ==="
echo

library_files=(
  "$REPO_DIR/lib/ArrayUtils.sh"
  "$REPO_DIR/lib/ColorUtils.sh"
  "$REPO_DIR/lib/FormatUtils.sh"
  "$REPO_DIR/lib/HashUtils.sh"
  "$REPO_DIR/lib/HelpUtils.sh"
  "$REPO_DIR/lib/IOUtils.sh"
  "$REPO_DIR/lib/InterfaceUtils.sh"
  "$REPO_DIR/lib/SandboxUtils.sh"
  "$REPO_DIR/lib/WindowUtils.sh"
  "$REPO_DIR/lib/installer/InstallerUtils.sh"
  "$REPO_DIR/lib/ap/airbase-ng.sh"
  "$REPO_DIR/lib/ap/hostapd.sh"
)

library_symbol_type() {
  case "$1" in
    ArrayUtils.sh) echo "function array_contains" ;;
    ColorUtils.sh) echo "variable CGrn" ;;
    FormatUtils.sh) echo "function format_apply_autosize" ;;
    HashUtils.sh) echo "function hash_check_handshake" ;;
    HelpUtils.sh) echo "function fluxion_help" ;;
    IOUtils.sh) echo "function io_query_choice" ;;
    InterfaceUtils.sh) echo "function interface_list_wireless" ;;
    SandboxUtils.sh) echo "function sandbox_remove_workfile" ;;
    WindowUtils.sh) echo "function fluxion_window_init" ;;
    InstallerUtils.sh) echo "function installer_utils_check_dependencies" ;;
    airbase-ng.sh|hostapd.sh) echo "function ap_service_start" ;;
    *) echo "" ;;
  esac
}

for library_file in "${library_files[@]}"; do
  library_meta=$(library_symbol_type "$(basename "$library_file")")
  library_kind=${library_meta%% *}
  library_symbol=${library_meta#* }

  if (
    FLUXIONPath="$REPO_DIR"
    FLUXIONLibPath="$REPO_DIR/lib"
    FLUXIONWorkspacePath="$TEST_RUNTIME_DIR/workspace"
    FLUXIONOutputDevice="$TEST_RUNTIME_DIR/output.log"
    InstallerUtilsInstalledPackagesFile="$TEST_RUNTIME_DIR/installed_packages.list"
    source "$library_file"

    case "$library_kind" in
      function) declare -F "$library_symbol" >/dev/null ;;
      variable) [ -n "${!library_symbol-}" ] ;;
      *) false ;;
    esac
  ); then
    pass "$(basename "$library_file") sources cleanly"
  else
    fail "$(basename "$library_file") failed to source cleanly"
  fi
done

finish_tests
