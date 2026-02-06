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

  # Canonicalize the path to prevent traversal attacks (e.g., ../../etc/passwd).
  # Use realpath -m to resolve without requiring the path to exist (it may be a glob).
  # For glob patterns, check the directory portion only.
  local checkPath="$1"
  # Strip glob characters from the end to get a checkable path prefix
  local dirPath="${checkPath%%[*?]*}"
  if [ -z "$dirPath" ]; then dirPath="$checkPath"; fi
  local resolvedPath
  resolvedPath=$(realpath -m "$dirPath" 2>/dev/null) || resolvedPath="$dirPath"
  local resolvedWorkspace
  resolvedWorkspace=$(realpath -m "$SandboxWorkspacePath" 2>/dev/null) || resolvedWorkspace="$SandboxWorkspacePath"

  if [[ "$resolvedPath" != "$resolvedWorkspace"* ]]; then
    echo "Stopped an attempt to delete non-workfiles (path traversal blocked)." >"$SandboxOutputDevice"
    return 2
  fi

  # $1 is intentionally unquoted to allow glob expansion (callers pass patterns
  # like "$path/dump*"), but $SandboxOutputDevice is quoted for safety.
  rm -r $1 &> "$SandboxOutputDevice"
}

# FLUXSCRIPT END
