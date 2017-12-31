#!/bin/bash

if [ "$InstallerUtilsVersion" ]; then return 0; fi
readonly InstallerUtilsVersion="1.0"

InstallerUtilsWorkspacePath="/tmp/verspace"

InstallerUtilsOutputDevice="/dev/stdout"

InstallerUtilsNoticeMark="*"

PackageManagerLog="$InstallerUtilsWorkspacePath/package_manager.log"

function installer_utils_run_spinner() {
  local pid=$1
  local delay=0.15
  local spinstr="|/-\\"

  tput civis
  while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
    local temp=${spinstr#?}
    printf " [%c]  " "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\b\b\b\b\b\b"
  done

  printf "    \b\b\b\b"
  tput cnorm
}

# Pamaters:
# $1 source - Online Info File (text)
# $2 version regex - Online version (regex)
# $3 revision regex - Online version (regex)
function installer_utils_check_version() {
  if [ ${#@} -ne 3 ]; then return 1; fi

  # Attempt to retrieve versioning information from repository script.
  local -r __installer_utils_check_version__info=("$(timeout -s SIGTERM 20 curl "$1" 2>/dev/null)")

  local -r __installer_utils_check_version__onlineVersion=$(echo "${__installer_utils_check_version__info[@]}" | egrep "$2" | egrep -o "[0-9]+")
  local -r __installer_utils_check_version__onlineRevision=$(echo "${__installer_utils_check_version__info[@]}" | egrep "$3" | egrep -o "[0-9]+")

  if [ "$__installer_utils_check_version__onlineVersion" ] && [ "$__installer_utils_check_version__onlineRevision" ]; then echo -e "$__installer_utils_check_version__onlineVersion\n$__installer_utils_check_version__onlineRevision" >"$InstallerUtilsWorkspacePath/latest_version"
  fi
}

# Pamaters:
# $1 source - Online Info File (text)
# $2 version regex - Online version (regex)
# $3 version local - Local version (number)
# $4 revision regex - Online version (regex)
# $5 revision local - Local version (number)
function installer_utils_check_update() {
  # The following set of statements aren't very generic, need to be refactored.
  local versionDialog="Online Version"
  local versionDialogOffset=$(($(tput cols) / 2 + ((${#versionDialog} / 2) - 4)))
  printf "%${versionDialogOffset}s" "$versionDialog"

  installer_utils_check_version "${@:1:3}" &
  installer_utils_run_spinner "$!" # This should be done externally (refactored).

  local __installer_utils_check_update__localVersion=$4
  local __installer_utils_check_update__localRevision=$5
  local __installer_utils_check_update__version="?"
  local __installer_utils_check_update__revision="?"

  if [ -f "$InstallerUtilsWorkspacePath/latest_version" -a \
    -s "$InstallerUtilsWorkspacePath/latest_version" ]; then
    local __installer_utils_check_update__vInfo
    mapfile -tn 2 __installer_utils_check_update__vInfo <"$InstallerUtilsWorkspacePath/latest_version"

    sandbox_remove_workfile "$InstallerUtilsWorkspacePath/latest_version"

    __installer_utils_check_update__version=${__installer_utils_check_update__vInfo[0]}
    __installer_utils_check_update__revision=${__installer_utils_check_update__vInfo[1]}
  fi

  echo -e "$CClr [$__installer_utils_check_update__version.$__installer_utils_check_update__revision$CClr]"

  if [ "$__installer_utils_check_update__version" != "?" -a "$__installer_utils_check_update__revision" != "?" ]; then
    if [ "$__installer_utils_check_update__version" -gt "$__installer_utils_check_update__localVersion" -o \
      "$__installer_utils_check_update__version" -eq "$__installer_utils_check_update__localRevision" -a \
      "$__installer_utils_check_update__revision" -gt "$__installer_utils_check_update__localRevision" ]; then
      format_center_literals "${CRed}A newer version has been found!$CClr"
      return 0
    fi
  fi

  return 1 # Failure
}

# Parameters: $1 - Update source (zip) $2 - Backup file name $3 - Update output
function installer_utils_run_update() {
  if [ ${#@} -ne 2 ]; then return 1; fi

  local __installer_utils_run_update__source="$1"
  local __installer_utils_run_update__backup="$2"
  local __installer_utils_run_update__output="$3"

  format_center_literals "${CYel}[ Press Y or enter to update, anything else to skip ]$CClr"

  tput civis
  local __installer_utils_run_update__option
  read -N1 __installer_utils_run_update__option
  tput cnorm

  __installer_utils_run_update__option=${__installer_utils_run_update__option:-Y}

  # If the user doesn't want to upgrade, stop this procedure.
  if [ "$__installer_utils_run_update__option" != "Y" -a \
    "$__installer_utils_run_update__option" != "y" ]; then return 1
  fi

  local __installer_utils_run_update__backupFile="$__installer_utils_run_update__backup-$(date +%F_%T)"
  local __installer_utils_run_update__backupPath="$(dirname $__installer_utils_run_update__output)/$__installer_utils_run_update__backupFile.7z"

  # If a file with the backup name already exists, abort.
  if [ -f "$__installer_utils_run_update__backupPath" ]; then return 2
  fi

  format_center_literals "${CClr}[ ~ Creating Backup ~ ]$CClr"
  echo
  # This could use a progress indicator, but I'm a bit tired.
  7zr a "$__installer_utils_run_update__backupPath" "$__installer_utils_run_update__output" &>$InstallerUtilsOutputDevice

  format_center_literals "${CClr}[ ~ Downloading Update ~ ]$CClr"
  echo
  if ! curl -L "$__installer_utils_run_update__source" -o "$InstallerUtilsWorkspacePath/update.zip"; then
    format_center_literals "${CRed}[ ~ Download Failed ~ ]$CClr"
    sleep 3
    return 3
  fi

  format_center_literals "${CClr}[ ~ Verifying Download ~ ]$CClr"
  echo
  if ! unzip -t "$InstallerUtilsWorkspacePath/update.zip"; then
    format_center_literals "${CRed}[ ~ Download Appears Corrupted ~ ]$CClr"
    sleep 3
    return 4
  fi

  format_center_literals "${CClr}[ ~ Extracting Files ~ ]$CClr"
  echo
  mkdir "$InstallerUtilsWorkspacePath/update_contents"
  unzip "$InstallerUtilsWorkspacePath/update.zip" -d "$InstallerUtilsWorkspacePath/update_contents"

  if [ ! -d "$__installer_utils_run_update__output" ]; then
    if ! mkdir -p "$__installer_utils_run_update__output"; then
      format_center_literals "${CRed}[ ~ Failed To Create Destination Directory ~ ]$CClr"
      echo
    fi
  fi

  format_center_literals "${CClr}[ ~ Moving Files ~ ]$CClr"
  echo
  mv "$InstallerUtilsWorkspacePath"/update_contents/* "$__installer_utils_run_update__output"

  format_center_literals "${CGrn}[ ~ Update Completed ~ ]$CClr"
  echo
  sleep 3
}

# Parameters: $1 - CLI Tools required array $2 - CLI Tools missing array (will be populated)
function installer_utils_check_dependencies() {
  if [ ! "$1" ]; then return 1; fi

  local __installer_utils_run_dependencies__CLIToolsInfo=("${!1}")
  InstallerUtilsCheckDependencies=()

  local __installer_utils_run_dependencies__CLIToolInfo
  for __installer_utils_run_dependencies__CLIToolInfo in "${__installer_utils_run_dependencies__CLIToolsInfo[@]}"; do
    local __installer_utils_run_dependencies__CLITool=${__installer_utils_run_dependencies__CLIToolInfo/:*/}
    local __installer_utils_run_dependencies__identifier="$(printf "%-44s" "$__installer_utils_run_dependencies__CLITool")"
    local __installer_utils_run_dependencies__state=".....$CGrn OK.$CClr"

    if ! hash "$__installer_utils_run_dependencies__CLITool" 2>/dev/null; then
      __installer_utils_run_dependencies__state="$CRed Missing!$CClr"
      InstallerUtilsCheckDependencies+=("$__installer_utils_run_dependencies__CLIToolInfo")
    fi

    format_center_literals "$InstallerUtilsNoticeMark ${__installer_utils_run_dependencies__identifier// /.}$__installer_utils_run_dependencies__state"
    echo -e "$FormatCenterLiterals"
  done

  if [ ${#InstallerUtilsCheckDependencies[@]} -gt 0 ]; then return 2; fi
}

# Parameters: $1 - CLI Tools missing array (will be installed) $2 - substitutes array
function installer_utils_run_dependencies() {
  if [ ! "$1" ]; then return 1; fi

  # The array below holds all the packages that will be installed.
  local __installer_utils_run_dependencies__dependenciesInfo=("${!1}")

  local __installer_utils_run_dependencies__managers=(lib/installer/managers/*)

  local __installer_utils_run_dependencies__manager
  for __installer_utils_run_dependencies__manager in "${__installer_utils_run_dependencies__managers[@]}"; do
    source "$__installer_utils_run_dependencies__manager"
    if [ "$PackageManagerCLT" ]; then break; fi
  done

  if [ ! "$PackageManagerCLT" ]; then
    format_center_literals "${CRed}[ ~ No Suitable Package Manager Found ~ ]$CClr"
    echo
    sleep 3
    return 2
  fi

  prep_package_manager

  for __installer_utils_run_dependencies__dependencyInfo in "${__installer_utils_run_dependencies__dependenciesInfo[@]}"; do
    local __installer_utils_run_dependencies__target=${__installer_utils_run_dependencies__dependencyInfo/:*/}
    local __installer_utils_run_dependencies__packages=${__installer_utils_run_dependencies__dependencyInfo/*:/}
    for __installer_utils_run_dependencies__package in ${__installer_utils_run_dependencies__packages//|/ }; do
      clear
      if $PackageManagerCLT $PackageManagerCLTInstallOptions $__installer_utils_run_dependencies__package; then break
      fi
    done
  done

  unprep_package_manager
}

# FLUXSCRIPT END
