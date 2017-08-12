#!/bin/bash

FormatTabLength=8

# This should be relocated (here temporarily)
tabs -$FormatTabLength # Set tab width to var

format_strip_invisibles() {
	FormatStripInvisibles=$1

	# Strip color escape sequences
	FormatStripInvisibles=$(echo "$FormatStripInvisibles" | sed -r 's/\\e\[([0-9]*;?[0-9]+)m//g')

	# Strip control characters
	FormatStripInvisibles=$(echo "$FormatStripInvisibles" | sed -r 's/\\t//g' | sed -r 's/\\n//g')
}

format_strip_specifiers() {
	FormatStripSpecifiers=$(echo "$1" | sed -r 's/%[\+-]?(([0-9]+|\*)|[0-9]*\.([0-9]+|\*))?[bqdiouxXfeEgGcsnaA]//g')
}

format_list_specifiers() {
	# Special specifier also included (with length value as '*').
	FormatListSpecifiers=($(echo "$1" | grep -oP '%[\+-]?(([0-9]+|\*)|[0-9]*\.([0-9]+|\*))?[bqdiouxXfeEgGcsnaA]'))
}

format_emulate_expansion() {
echo
}

format_calculate_length() {
	# Retrieve string of printable characters only in format before substitution.
	format_strip_invisibles "`echo "$1" | sed -r 's/%%/%1s/g'`"
	local __format_calculate_length__visibles=$FormatStripInvisibles

	# Calculate number of all printable characters in format before substitution.
	format_strip_specifiers "$__format_calculate_length__visibles"
	local __format_calculate_length__literalsLength=${#FormatStripSpecifiers}

	format_list_specifiers "$__format_calculate_length__visibles"

	local __format_calculate_length__staticsLength=$(echo "${FormatListSpecifiers[@]}" | grep -oP '\d+' | awk '{s+=$0} END {print s}')

	FormatCalculateLength=$((__format_calculate_length__literalsLength + __format_calculate_length__staticsLength))
}

format_autosize() {
	# Treat horizontal tab as a specifier with a length of tab-length.
	format_calculate_length "`echo "$1" | sed -r 's/\\\\t/%'"$FormatTabLength"'s/g'`"
	# Exploit the fact the previous function just calculated FormatStripSpecifiers. 
	local __format_autosize__dynamics_count=$(echo "${FormatListSpecifiers[@]}" | grep -oP '%[\+-]?\.?\*[bqdiouxXfeEgGcsnaA]' | wc -l)
	local __format_autosize__availableLength=$(( $(tput cols) - $FormatCalculateLength ))
	local __format_autosize__dynamicsLength=$(( $__format_autosize__availableLength / $__format_autosize__dynamics_count ))
	FormatAutosize="$1"
	FormatAutosize=$(echo "$FormatAutosize" | sed -r 's/%\*s/%'"$__format_autosize__dynamicsLength"'s/g')
	FormatAutosize=$(echo "$FormatAutosize" | sed -r 's/%\.\*s/%.'"$__format_autosize__dynamicsLength"'s/g')
	FormatAutosize=$(echo "$FormatAutosize" | sed -r 's/%-\*s/%-'"$__format_autosize__dynamicsLength"'s/g')
	FormatAutosize=$(echo "$FormatAutosize" | sed -r 's/%-\.\*s/%-.'"$__format_autosize__dynamicsLength"'s/g')
}

format_center() {
	format_strip_invisibles "$1"
	local __format_center__text_length=${#FormatStripInvisibles}
	format_autosize "%*s%${__format_center__text_length}s%*s"
	FormatCenter=$(printf "$FormatAutosize" "" "$1" "")
	#FormatCenter=$(echo "$FormatCenter" | cut -d X -f 1)"$1"$(echo "$FormatCenter" | cut -d X -f 2)
}
