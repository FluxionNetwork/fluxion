#!/usr/bin/env bash

if [ "$ArrayUtilsVersion" ]; then return 0; fi
readonly ArrayUtilsVersion="1.0"

# Due to the fact we're passing arrays via indirection,
# we've got to mangle variable names used within array
# functions to prevent accidentally having a naming
# conflic with an array, for example, an array with the
# "choice" identifier in the input_choice function.
# Eventually, input_choice's "choice" variable will
# be indirectly expanded rather than the choice array.
function array_contains() {
  local __array_contains__item

  # An efficient way to pass arrays around in bash
  # is to perform indirect expansion by using the
  # expansion symbol, $, along with the indirection
  # symbol, !, in curly braces, ${! }, resulting in:
  # function call: array_contains array[@] "text"
  #  funct params: $1 = "array[@]" $2 = "text"
  #  indirect exp: ${!1} => ${array[@]} (replaced!)
  for __array_contains__item in "${!1}"; do
    [[ "$__array_contains__item" == "$2" ]] && return 0
  done

  return 1 # Not found
}

# FLUXSCRIPT END
