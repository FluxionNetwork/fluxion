#!/usr/bin/env bash

if [ "$ColorUtilsVersion" ]; then return 0; fi
readonly ColorUtilsVersion="1.0"

################################# < Shell Color Codes > ################################

# Regular Text
readonly CRed="\e[0;31m"
readonly CGrn="\e[0;32m"
readonly CYel="\e[0;33m"
readonly CBlu="\e[0;34m"
readonly CPrp="\e[0;35m"
readonly CCyn="\e[0;36m"
readonly CGry="\e[0;37m"
readonly CWht="\e[0;37m"
readonly CClr="\e[0m"

# [S] - Strong text (bold)
readonly CSRed="\e[1;31m"
readonly CSGrn="\e[1;32m"
readonly CSYel="\e[1;33m"
readonly CSBlu="\e[1;34m"
readonly CSPrp="\e[1;35m"
readonly CSCyn="\e[1;36m"
readonly CSGry="\e[1;37m"
readonly CSWht="\e[1;37m"

# [D] - Dark text
readonly CDRed="\e[2;31m"
readonly CDGrn="\e[2;32m"
readonly CDYel="\e[2;33m"
readonly CDBlu="\e[2;34m"
readonly CDPrp="\e[2;35m"
readonly CDCyn="\e[2;36m"
readonly CDGry="\e[2;37m"
readonly CDWht="\e[2;37m"

# [I] Italicized text
readonly CIRed="\e[3;31m"
readonly CIGrn="\e[3;32m"
readonly CIYel="\e[3;33m"
readonly CIBlu="\e[3;34m"
readonly CIPrp="\e[3;35m"
readonly CICyn="\e[3;36m"
readonly CIGry="\e[3;37m"
readonly CIWht="\e[3;37m"

# [U] - Underlined text
readonly CURed="\e[4;31m"
readonly CUGrn="\e[4;32m"
readonly CUYel="\e[4;33m"
readonly CUBlu="\e[4;34m"
readonly CUPrp="\e[4;35m"
readonly CUCyn="\e[4;36m"
readonly CUGry="\e[4;37m"
readonly CUWht="\e[4;37m"

# [B] - Blinking text
readonly CBRed="\e[5;31m"
readonly CBGrn="\e[5;32m"
readonly CBYel="\e[5;33m"
readonly CBBlu="\e[5;34m"
readonly CBPrp="\e[5;35m"
readonly CBCyn="\e[5;36m"
readonly CBGry="\e[5;37m"
readonly CBWht="\e[5;37m"

# FLUXSCRIPT END
