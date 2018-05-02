#!/usr/bin/env bash

if [ "$SandboxUtilsVersion" ]; then return 0; fi
readonly SandboxUtilsVersion="1.0"

SandboxWorkspacePath="/tmp/sandbox"
SandboxOutputDevice="/dev/stdout"

# After changing global identifiers in the main script,
# I forgot to update the identifiers here, leading to a
# horrific accident where the script ended and executed
# the command "rm -rf /*" ... yeah, fuck that...
# Spent an entire day retreiving all my shit back.
function sandbox_remove_workfile() {
  # Check we've got the environment variables ready.
  if [[ -z "$SandboxWorkspacePath" || -z "$SandboxOutputDevice" ]]; then
    echo "The workspace path, or the output device is missing." >$SandboxOutputDevice
    return 1
  fi

  # Check we're actually deleting a workfile.
  if [[ "$1" != $SandboxWorkspacePath* ]]; then
    echo "Stopped an attempt to delete non-workfiles." >$SandboxOutputDevice
    return 2
  fi

  # Attempt to remove iff it exists.
  #if [ ! -e "$1" -a "$1" != *"/"*"*" ]; then
  #	echo "Stopped an attempt to delete non-existent files" > $SandboxOutputDevice
  #	return 3;
  #fi

  # Remove the target file (do NOT force it).
  eval "rm -r $1 &> $SandboxOutputDevice"
}

# FLUXSCRIPT END
