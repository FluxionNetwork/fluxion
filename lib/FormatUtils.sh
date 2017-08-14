#!/bin/bash

FormatTabLength=8
FormatValidSpecifiers='%([+-]?([0-9]+|\*)?(\.([0-9]+|\*))?)?[bqdiouxXfeEgGcsnaA]'

# This should be relocated (here temporarily)
tabs -$FormatTabLength # Set tab width to var

#format_strip_specifiers() {
#	FormatStripSpecifiers=$(echo "$1" | sed -r "s/$FormatValidSpecifiers//g")
#}=

function format_strip_invisibles() {
	# This function currently only strips the following:
	# Color escape sequences, & control characters
	FormatStripInvisibles=$(echo "$1" | sed -r 's/\\(e\[([0-9]*;?[0-9]+)m|(t|n))//g')
}

function format_expand_invisibles() {
	FormatExpandInvisibles=$(echo "$1" | sed -r 's/\\(e\[([0-9]*;?[0-9]+)m|n)/%0s/g; s/\\t/%'"$FormatTabLength"'s/g')
}

function format_list_specifiers() {
	# Special specifier also included (with length value as '*').
	FormatListSpecifiers=($(echo "$1" | grep -oP "$FormatValidSpecifiers"))
}

# Statics are all specifiers with a fixed size
function format_calculate_statics_length() {
	local __format_calculate_statics_length__specifiers=("${!2}")

	if [ ! "$2" ]; then
		echo "format_calculate_statics_length missing \$2"
		format_list_specifiers "$1"
		__format_calculate_statics_length__specifiers=("${FormatListSpecifiers[@]}")
	fi
	FormatCalculateStaticsLength=$(echo "${__format_calculate_statics_length__specifiers[@]}" | sed -r 's/\.[0-9]+s/s/g' |  grep -oP '\d+' | awk 'BEGIN {s=0} {s+=$0} END {print s}')
}

function format_calculate_literals_length() {
	local __format_calculate_literals_length__normalizedFormat="`echo "$2" | sed -r 's/%%|\*\*/%1s/g'`"
	local __format_calculate_literals_length__specifiers=("${!3}")

	if [ ! "$2" ]; then
		echo "format_calculate_literals_length missing \$2"
		format_strip_invisibles "$1"
		__format_calculate_literals_length__normalizedFormat="`echo "$FormatStripInvisibles" | sed -r 's/%%|\*\*/%1s/g'`"
	fi

	if [ ! "$3" ]; then
		echo "format_calculate_literals_length missing \$3"
		format_list_specifiers "$1"
		__format_calculate_literals_length__specifiers=("${FormatListSpecifiers[@]}")
	fi

	FormatCalculateLiteralsLength=$((${#__format_calculate_literals_length__normalizedFormat} - ($(echo "${__format_calculate_literals_length__specifiers[@]}" | wc -m) - ${#__format_calculate_literals_length__specifiers[@]})))
}

function format_calculate_dynamics_length() {
	local __format_calculate_dynamics_length__staticsLength=$2
	local __format_calculate_dynamics_length__literalsLength=$3

	if [ ! "$2" ]; then
		echo "format_calculate_dynamics_length missing \$2"
		format_expand_invisibles "$1"
		format_list_specifiers "$FormatExpandInvisibles"
		format_calculate_statics_length X FormatListSpecifiers[@]
		__format_calculate_dynamics_length__staticsLength=$FormatCalculateStaticsLength
	fi

	if [ ! "$3" ]; then
		if [ "$2" ]; then
			format_expand_invisibles "$1"
			format_list_specifiers "$FormatExpandInvisibles"
		fi
		echo "format_calculate_dynamics_length missing \$3"
		format_calculate_literals_length X "$FormatExpandInvisibles" FormatListSpecifiers[@]
		__format_calculate_dynamics_length__literalsLength=$FormatCalculateLiteralsLength
	fi

	FormatCalculateDynamicsLength=$(( $(tput cols) - (__format_calculate_dynamics_length__staticsLength + __format_calculate_dynamics_length__literalsLength) ))
}

function format_calculate_autosize_length() {
	local __format_calculate_autosize_length__dynamicsLength=$2
	local __format_calculate_autosize_length__dynamicsCount=$3

	if [ ! "$2" ]; then
		format_expand_invisibles "$1"
		format_list_specifiers "$FormatExpandInvisibles"
		format_calculate_statics_length X FormatListSpecifiers[@]
		format_calculate_literals_length X "$FormatExpandInvisibles" FormatListSpecifiers[@]
		format_calculate_dynamics_length X "$FormatCalculateStaticsLength" "$FormatCalculateLiteralsLength"
		__format_calculate_autosize_length__dynamicsLength=$FormatCalculateDynamicsLength
	fi

	if [ ! "$3" ]; then
		if [ "$2" ]
		then format_list_specifiers "$1"
		fi
		# local __format_calculate_autosize_length__dynamics=("${FormatListSpecifiers[@]}")
		# ("`echo "${FormatListSpecifiers[@]}" | awk '{ for(i = 1; i <= NF; i++) { if ($i !~ /[0-9]+/) print $i; } }'`")
		__format_calculate_autosize_length__dynamicsCount=0
		for __format_calculate_autosize_length__specifier in "${FormatListSpecifiers[@]}"; do
			if echo "$__format_calculate_autosize_length__specifier" | grep '\*' >/dev/null 2>&1; then
				((__format_calculate_autosize_length__dynamicsCount++))
			fi
		done
	fi

	if [ $__format_calculate_autosize_length__dynamicsCount -ne 0 -a \
		$__format_calculate_autosize_length__dynamicsLength -ge 0 ]
	then FormatCalculateAutosizeLength=$(( __format_calculate_autosize_length__dynamicsLength / __format_calculate_autosize_length__dynamicsCount ))
	else FormatCalculateAutosizeLength=0
	fi
}

# Note that this does not yet support multiple lines (multiple \n).
function format_apply_autosize() {
	format_calculate_autosize_length "$1"
	FormatApplyAutosize=$(echo "$1" | sed -r 's/\*\.\*/'"$FormatCalculateAutosizeLength"'.'"$FormatCalculateAutosizeLength"'/g; s/(^|[^*])\*([^*]|$)/\1'"$FormatCalculateAutosizeLength"'\2/g; s/\*\*/*/g')
}

function format_center_static() {
	format_strip_invisibles "$1"
	local __format_center_static__text_length=${#FormatStripInvisibles}
	format_apply_autosize "%*s%${__format_center_static__text_length}s%*s"
	FormatCenterStatic=$(printf "$FormatApplyAutosize" "" "$1" "")
}

function format_center_dynamic() {
	format_calculate_length "$1"
	format_apply_autosize "%*s%${FormatCalculateLength}s%*s"
	# Temporary, I'll find a better solution later (too tired).
	FormatCenterDynamic=$(printf "`echo "$FormatApplyAutosize" | sed -r 's/%[0-9]+s/%s/2'`" "" "$1" "")
}
