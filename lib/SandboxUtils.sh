#!/usr/bin/env bash

if [ "$SandboxUtilsVersion" ]; then return 0; fi
readonly SandboxUtilsVersion="1.0"

SandboxWorkspacePath="/tmp/sandbox"
SandboxOutputDevice="/dev/stdout"

# After changing global identifiers in the main script,
# identifiers here were not updated, leading to a dangerous
# accident where the script executed "rm -rf /*".
# Spent an entire day retrieving everything back.
function sandbox_remove_workfile() {
  # Check we've got the environment variables ready.
  if [[ -z "$SandboxWorkspacePath" || -z "$SandboxOutputDevice" ]]; then
    echo "The workspace path, or the output device is missing." >"$SandboxOutputDevice"
    return 1
  fi

  # Check we're actually deleting a workfile.
  if [[ "$1" != $SandboxWorkspacePath* ]]; then
    echo "Stopped an attempt to delete non-workfiles." >"$SandboxOutputDevice"
    return 2
  fi

  # Security fix: removed dangerous eval to prevent command injection.
  # $1 is intentionally unquoted to allow glob expansion (callers pass patterns
  # like "$path/dump*"), but $SandboxOutputDevice is quoted for safety.
  rm -r $1 &> "$SandboxOutputDevice"
}

# FLUXSCRIPT END
