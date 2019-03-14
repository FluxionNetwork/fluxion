#!/usr/bin/env bash

if [ "$FormatUtilsVersion" ]; then return 0; fi
readonly FormatUtilsVersion="1.0"

FormatTabLength=8
FormatValidSpecifiers='%([+-]?([0-9]+|\*)?(\.([0-9]+|\*))?)?[bqdiouxXfeEgGcsnaA]'

# This should be relocated (here temporarily)
tabs -$FormatTabLength # Set tab width to var

# This function strips (some) invisible characters.
# It only strips those needed by fluxion, currently.
# Parameters: $1 - format
function format_strip_invisibles() {
  # This function currently only strips the following:
  # Color escape sequences, & control characters
  FormatStripInvisibles=$(echo "$1" | sed -r 's/\\(e\[([0-9]*;?[0-9]+)m|(t|n))//g')
}

# This function replaces all invisible characters
# with a specifier of their corresponding length.
# Parameters: $1 - format
function format_expand_invisibles() {
  FormatExpandInvisibles=$(echo "$1" | sed -r 's/\\(e\[([0-9]*;?[0-9]+)m|n)/%0s/g; s/\\t/%'"$FormatTabLength"'s/g')
}

# This function lists all operators in format.
# Parameters: $1 - format
function format_list_specifiers() {
  # Special specifier also included (with length value as '*').
  FormatListSpecifiers=($(echo "$1" | grep -oP "$FormatValidSpecifiers"))
}

# This function calculates the dynamic specifier count in format.
# Parameters: $1 - format [$2 - specifier array]
function format_calculate_dynamics_count() {
  local __format_calculate_dynamics_count__specifiers=("${!2}")

  if [ ! "$2" ]; then
    format_list_specifiers "$1"
    __format_calculate_dynamics_count__specifiers=("${FormatListSpecifiers[@]}")
  fi

  FormatCalculateDynamicsCount=0
  local __format_calculate_dynamics_count__specifier
  for __format_calculate_dynamics_count__specifier in "${__format_calculate_dynamics_count__specifiers[@]}"; do
    if echo "$__format_calculate_dynamics_count__specifier" | grep '\*' >/dev/null 2>&1; then ((FormatCalculateDynamicsCount++))
    fi
  done
}

# This function calculates total length of statics in format.
# Statics are all specifiers in format with a fixed size.
# Parameters: $1 - format [$2 - specifier array]
function format_calculate_statics_length() {
  local __format_calculate_statics_length__specifiers=("${!2}")

  if [ ! "$2" ]; then
    echo "format_calculate_statics_length missing \$2"
    format_list_specifiers "$1"
    __format_calculate_statics_length__specifiers=("${FormatListSpecifiers[@]}")
  fi
  FormatCalculateStaticsLength=$(echo "${__format_calculate_statics_length__specifiers[@]}" | sed -r 's/\.[0-9]+s/s/g' | grep -oP '\d+' | awk 'BEGIN {s=0} {s+=$0} END {print s}')
}

# This function calculates total length of literals in format.
# Literals are all characters in format printed literally.
# Parameters: $1 - format [$2 - processed format [$3 - specifier array]]
function format_calculate_literals_length() {
  local __format_calculate_literals_length__normalizedFormat="$(echo "$2" | sed -r 's/%%|\*\*/X/g')"
  local __format_calculate_literals_length__specifiers=("${!3}")

  if [ ! "$2" ]; then
    echo "format_calculate_literals_length missing \$2"
    format_strip_invisibles "$1"
    __format_calculate_literals_length__normalizedFormat="$(echo "$FormatStripInvisibles" | sed -r 's/%%|\*\*/X/g')"
  fi

  if [ ! "$3" ]; then
    echo "format_calculate_literals_length missing \$3"
    format_list_specifiers "$1"
    __format_calculate_literals_length__specifiers=("${FormatListSpecifiers[@]}")
  fi

  FormatCalculateLiteralsLength=$((${#__format_calculate_literals_length__normalizedFormat} - ($(echo "${__format_calculate_literals_length__specifiers[@]}" | wc -m) - ${#__format_calculate_literals_length__specifiers[@]})))
}

# This function calculates the total length of statics & literals in format.
# Parameters: $1 - format [$2 - statics length [$3 - literals length]]
function format_calculate_length() {
  local __format_calculate_length__staticsLength=$2
  local __format_calculate_length__literalsLength=$3

  if [ ! "$2" ]; then
    #echo "format_calculate_length missing \$2"
    format_expand_invisibles "$1"
    format_list_specifiers "$FormatExpandInvisibles"
    format_calculate_statics_length X FormatListSpecifiers[@]
    __format_calculate_length__staticsLength=$FormatCalculateStaticsLength
  fi

  if [ ! "$3" ]; then
    if [ "$2" ]; then
      format_expand_invisibles "$1"
      format_list_specifiers "$FormatExpandInvisibles"
    fi
    #echo "format_calculate_length missing \$3"
    format_calculate_literals_length X "$FormatExpandInvisibles" FormatListSpecifiers[@]
    __format_calculate_length__literalsLength=$FormatCalculateLiteralsLength
  fi

  FormatCalculateLength=$((__format_calculate_length__staticsLength + __format_calculate_length__literalsLength))
}

# This function calculates total length of dynamics in format.
# Dynamics are all asterisk-containing specifiers in format.
# Parameters: $1 - format [$2 - format length ]
function format_calculate_dynamics_length() {
  local __format_calculate_dynamics_length__formatLength=$2

  if [ ! "$2" ]; then
    echo "format_calculate_dynamics_length missing \$2"
    format_calculate_length "$1"
    __format_calculate_dynamics_length__formatLength=$FormatCalculateLength
  fi

  FormatCalculateDynamicsLength=$(($(tput cols) - $__format_calculate_dynamics_length__formatLength))
}

# This function calculates the size of individual dynamics in format.
# Parameters: $1 - format [$2 - dynamics length [$3 - dynamics count]]
function format_calculate_autosize_length() {
  local __format_calculate_autosize_length__dynamicsLength=$2
  local __format_calculate_autosize_length__dynamicsCount=$3

  if [ ! "$2" ]; then
    format_expand_invisibles "$1"
    format_list_specifiers "$FormatExpandInvisibles"
    format_calculate_statics_length X FormatListSpecifiers[@]
    format_calculate_literals_length X "$FormatExpandInvisibles" FormatListSpecifiers[@]
    format_calculate_length X "$FormatCalculateStaticsLength" "$FormatCalculateLiteralsLength"
    format_calculate_dynamics_length X "$FormatCalculateLength"
    __format_calculate_autosize_length__dynamicsLength=$FormatCalculateDynamicsLength
  fi

  if [ ! "$3" ]; then
    if [ "$2" ]; then format_list_specifiers "$1"
    fi
    format_calculate_dynamics_count X FormatListSpecifiers[@]
    __format_calculate_autosize_length__dynamicsCount=$FormatCalculateDynamicsCount
  fi

  if [ $__format_calculate_autosize_length__dynamicsCount -ne 0 -a \
    $__format_calculate_autosize_length__dynamicsLength -ge 0 ]; then FormatCalculateAutosizeLength=$((__format_calculate_autosize_length__dynamicsLength / __format_calculate_autosize_length__dynamicsCount))
  else FormatCalculateAutosizeLength=0
  fi
}

# This function replaces dynamics' asterisks with their length, in format.
# Parameters: $1 - format [$2 - dynamics length [$3 - dynamics count]]
# Warning: Strings containing '\n' result in undefined behavior (not supported).
# Warning: Strings containing [0-9]+.* result in undefined behavior.
# Notice: Single asterisks are auto-sized, doubles are replaced "**" -> "*".
function format_apply_autosize() {
  format_calculate_autosize_length "${@}" # Pass all arguments on.
  FormatApplyAutosize=$1
  let format_apply_autosize_overcount=$FormatCalculateDynamicsLength%$FormatCalculateDynamicsCount
  if [ $format_apply_autosize_overcount -gt 0 ]; then # If we've got left-over, fill it left-to-right.
    let format_apply_autosize_oversize=$FormatCalculateAutosizeLength+1
    FormatApplyAutosize=$(echo "$FormatApplyAutosize" | sed -r 's/(^|[^*])\*(\.\*|[^*]|$)/\1'$format_apply_autosize_oversize'\2/'$format_apply_autosize_overcount'; s/([0-9]+\.)\*/\1'$format_apply_autosize_oversize'/'$format_apply_autosize_overcount)
  fi
  FormatApplyAutosize=$(echo "$FormatApplyAutosize" | sed -r 's/\*\.\*/'$FormatCalculateAutosizeLength'.'$FormatCalculateAutosizeLength'/g; s/(^|[^*])\*([^*]|$)/\1'$FormatCalculateAutosizeLength'\2/g; s/\*\*/*/g')
}

# This function centers literal text.
# Parameters: $1 - literals
function format_center_literals() {
  format_strip_invisibles "$1"
  local __format_center_literals__text_length=${#FormatStripInvisibles}
  format_apply_autosize "%*s%${__format_center_literals__text_length}s%*s"
  FormatCenterLiterals=$(printf "$FormatApplyAutosize" "" "$1" "")
}

# This function centers statics in format.
# Parameters: $1 - format
function format_center_dynamic() {
  format_calculate_length "$1"
  format_calculate_dynamics_length X $FormatCalculateLength
  format_apply_autosize "%*s%${FormatCalculateLength}s%*s" $FormatCalculateDynamicsLength 2
  # Temporary, I'll find a better solution later (too tired).
  FormatCenterDynamic=$(printf "$(echo "$FormatApplyAutosize" | sed -r 's/%[0-9]+s/%s/2')" "" "$1" "")
}
