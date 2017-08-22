#!/bin/bash

if [ "$ColorUtilsVersion" ]; then return 0; fi
readonly ColorUtilsVersion="1.0"

################################# < Shell Color Codes > ################################
readonly CRed="\e[1;31m"
readonly CGrn="\e[1;32m"
readonly CYel="\e[1;33m"
readonly CBlu="\e[1;34m"
readonly CPrp="\e[5;35m"
readonly CCyn="\e[5;36m"
readonly CGry="\e[0;37m"
readonly CWht="\e[1;37m"
readonly CClr="\e[0m"

# FLUXSCRIPT END
