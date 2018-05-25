#!/usr/bin/env bash

if [ "$IOUtilsVersion" ]; then return 0; fi
readonly IOUtilsVersion="1.0"

if [ ! "$FLUXIONLibPath" ]; then return 1; fi

IOUtilsHeader="[x] ================================ [x]"
IOUtilsQueryMark="[-] "
IOUtilsPrompt="[$USER@$HOSTNAME]> "

if [ ! "$ArrayUtilsVersion" ]; then
  source "$FLUXIONLibPath/ArrayUtils.sh"
fi

io_input_choice() {
  local __io_input_choice__choice
  until [ ! -z "$__io_input_choice__choice" ]; do
    echo -ne "$IOUtilsPrompt"

    local __io_input_choice__input
    read __io_input_choice__input

    local __io_input_choice__choices
    for __io_input_choice__choices in ${@}; do
      array_contains $__io_input_choice__choices "$__io_input_choice__input"
      if [ $? -eq 0 ]; then
        __io_input_choice__choice="$__io_input_choice__input"
        break
      fi
    done
  done

  IOInputChoice=$__io_input_choice__choice
}

io_dynamic_output() {
  eval 'echo -ne "'${@}'"'
}

io_input_enumerated_choice() {
  local __io_input_enumerated_choice__choices=("${!1}")
  local __io_input_enumerated_choice__indexes=($(seq ${#__io_input_numeric_choice__choices[@]}))
  io_input_choice __io_input_enumerated_choice__indexes[@]
  IOInputEnumeratedChoice=${__io_input_enumerated_choice__choices[$IOInputChoice]}
}

# This function outputs formatted lines of fields.
# The function takes an output file (like stdout),
# a "printf format string," and a variable number
# of indirect-expansion passed arrays (reference).
# NOTICE: At least the first array must be passed!
# Example: /dev/stdout "%s is %s." name[@] mood[@]
io_output_format_fields() {
  # Determine the amount of arguments passed.
  local __io_output_format_fields__argument_count=${#@}

  # Load locally by indirect expansion, ${! ... },
  # and mangle the variable number argument arrays.
  local __io_output_format_fields__i
  for ((__io_output_format_fields__i = 3; __io_output_format_fields__i <= __io_output_format_fields__argument_count; __io_output_format_fields__i++)); do
    eval "local __io_output_format_fields__field$__io_output_format_fields__i=(\"\${!$__io_output_format_fields__i}\")"
  done

  # Determine the amount of records/lines to print.
  # Notice at least the first array must be passed.
  local __io_output_format_fields__record_count=${#__io_output_format_fields__field3[@]}

  for ((__io_output_format_fields__i = 0; __io_output_format_fields__i < __io_output_format_fields__record_count; __io_output_format_fields__i++)); do
    local __io_output_format_fields__values="\"\${__io_output_format_fields__field"$(
      seq -s "[$__io_output_format_fields__i]}\" \"\${__io_output_format_fields__field" 3 $__io_output_format_fields__argument_count
    )"[$__io_output_format_fields__i]}\""
    eval "printf \"$2\" $__io_output_format_fields__values > $1"
  done
}

io_query_format_fields() {
  # Assure we've got required parameters.
  if [ ${#@} -lt 2 ]; then
    return 1
  fi

  local __io_query_format_fields__argument_count=${#@}

  local __io_query_format_fields__query="$1"
  local __io_query_format_fields__format="$2"

  # Load locally by indirect expansion, ${! ... },
  # and mangle the variable number argument arrays.
  local __io_query_format_fields__i
  for ((__io_query_format_fields__i = 3; __io_query_format_fields__i <= __io_query_format_fields__argument_count; __io_query_format_fields__i++)); do
    eval "local __io_query_format_fields__f$__io_query_format_fields__i=(\"\${!$__io_query_format_fields__i}\")"
  done

  local __io_query_format_fields__record_count=${#__io_query_format_fields__f3[@]}
  local __io_query_format_fields__indexes=($(seq $__io_query_format_fields__record_count))

  if [ ! -z "$1" ]; then
    if [ "$(type -t $(echo -e "$IOUtilsHeader" | grep -vE '\s'))" = "function" ]; then $IOUtilsHeader
    else echo -e "$IOUtilsHeader"; fi

    echo -e "$__io_query_format_fields__query"
    echo
  fi

  io_output_format_fields /dev/stdout "$__io_query_format_fields__format" __io_query_format_fields__indexes[@] ${@:3}

  echo

  io_input_choice __io_query_format_fields__indexes[@]

  IOQueryFormatFields=()
  for ((__io_query_format_fields__i = 3; __io_query_format_fields__i <= __io_query_format_fields__argument_count; __io_query_format_fields__i++)); do
    eval "IOQueryFormatFields[${#IOQueryFormatFields[@]}]=\${__io_query_format_fields__f$__io_query_format_fields__i[IOInputChoice - 1]}"
  done
}

io_query_choice() {
  # Assure we've got required parameters.
  if [ ${#@} -lt 2 ]; then
    return 1
  fi

  __io_query_choice__query=$([ -z "$1" ] && echo -n "" || echo -ne "$FLUXIONVLine $1\n")
  io_query_format_fields "$__io_query_choice__query" "\t$CRed[$CSYel%d$CClr$CRed]$CClr %b\n" $2

  IOQueryChoice="${IOQueryFormatFields[0]}"
}

io_query_file() {
  if [ ${#@} -lt 2 ]; then
    return 1
  fi

  local __io_query_file__options

  # List a line per line and redirect output.
  # readarray __io_query_file__options < $2
  mapfile __io_query_file__options <$2

  # Strip newline characters from array elements
  __io_query_file__options=("${__io_query_file__options[@]/$'\n'/}")

  io_query_choice "$1" __io_query_file__options[@]

  IOQueryFile=$IOQueryChoice
}

# FLUXSCRIPT END
