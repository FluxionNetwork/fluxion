#!/bin/bash

########## DEBUG Mode ##########
##                            ##
if [ -z ${INSTALLER_DEBUG+x} ]; then INSTALLER_DEBUG=0
else INSTALLER_DEBUG=1
fi
##                            ##
################################

#Config
version=2
revision=8

#Colors
red='\e[1;31m'
blue='\e[1;34m'
yellow='\e[1;33m'
transparent="\e[0m"

function conditional_clear() {

        if [[ "$INSTALLER_output_device" != "/dev/stdout" ]]; then clear; fi
}

#Config_END
if [ $INSTALLER_DEBUG = 1 ]; then
        ## Developer Mode
        export INSTALLER_output_device=/dev/stdout
        HOLD="-hold"
else
        ## Normal Mode
        export INSTALLER_output_device=/dev/null
        HOLD=""
fi

#Check root
if [[ $EUID -ne 0 ]]; then
        echo -e "\e[1;31mYou don't have admin privilegies, execute the script as root."$transparent
                                exit
fi

clear

#Check for X display
if [ -z "${DISPLAY:-}" ]; then
    echo -e "\e[1;31mThe script should be executed inside a X (graphical) session."$transparent""
    exit 1
fi

function mostrarheader(){

        conditional_clear
        echo -e "$red[~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]"
        echo -e "$red[                                                      ]"
        echo -e "$red[  $red    FLUXION $version" "${yellow} ${red}  < F""${yellow}luxion" "${red}I""${yellow}s" "${red}T""${yellow}he ""${red}F""${yellow}uture >          "${blue}"]"
        echo -e "$blue[                                                      ]"
        echo -e "$blue[~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]""$transparent"
        echo
        echo

}

function setresolution {

        function resA {
                TOPLEFT="-geometry 90x13+0+0"
                TOPRIGHT="-geometry 83x26-0+0"
                BOTTOMLEFT="-geometry 90x24+0-0"
                BOTTOMRIGHT="-geometry 75x12-0-0"
                TOPLEFTBIG="-geometry 91x42+0+0"
                TOPRIGHTBIG="-geometry 83x26-0+0"
        }

        function resB {
                TOPLEFT="-geometry 92x14+0+0"
                TOPRIGHT="-geometry 68x25-0+0"
                BOTTOMLEFT="-geometry 92x36+0-0"
                BOTTOMRIGHT="-geometry 74x20-0-0"
                TOPLEFTBIG="-geometry 100x52+0+0"
                TOPRIGHTBIG="-geometry 74x30-0+0"
        }
        function resC {
                TOPLEFT="-geometry 100x20+0+0"
                TOPRIGHT="-geometry 109x20-0+0"
                BOTTOMLEFT="-geometry 100x30+0-0"
                BOTTOMRIGHT="-geometry 109x20-0-0"
                TOPLEFTBIG="-geometry  100x52+0+0"
                TOPRIGHTBIG="-geometry 109x30-0+0"
        }
        function resD {
                TOPLEFT="-geometry 110x35+0+0"
                TOPRIGHT="-geometry 99x40-0+0"
                BOTTOMLEFT="-geometry 110x35+0-0"
                BOTTOMRIGHT="-geometry 99x30-0-0"
                TOPLEFTBIG="-geometry 110x72+0+0"
                TOPRIGHTBIG="-geometry 99x40-0+0"
        }
        function resE {
                TOPLEFT="-geometry 130x43+0+0"
                TOPRIGHT="-geometry 68x25-0+0"
                BOTTOMLEFT="-geometry 130x40+0-0"
                BOTTOMRIGHT="-geometry 132x35-0-0"
                TOPLEFTBIG="-geometry 130x85+0+0"
                TOPRIGHTBIG="-geometry 132x48-0+0"
        }
        function resF {
                TOPLEFT="-geometry 100x17+0+0"
                TOPRIGHT="-geometry 90x27-0+0"
                BOTTOMLEFT="-geometry 100x30+0-0"
                BOTTOMRIGHT="-geometry 90x20-0-0"
                TOPLEFTBIG="-geometry  100x70+0+0"
                TOPRIGHTBIG="-geometry 90x27-0+0"
        }

detectedresolution=$(xdpyinfo | grep -A 3 "screen #0" | grep dimensions | tr -s " " | cut -d" " -f 3)
##  A) 1024x600
##  B) 1024x768
##  C) 1280x768
##  D) 1280x1024
##  E) 1600x1200
case $detectedresolution in
        "1024x600" ) resA ;;
        "1024x768" ) resB ;;
        "1280x768" ) resC ;;
        "1366x768" ) resC ;;
        "1280x1024" ) resD ;;
        "1600x1200" ) resE ;;
        "1366x768"  ) resF ;;
                  * ) resA ;;
esac
}


# Installer function
function installer {
	echo -ne "$1.............................." | cut -z -b1-30 
	echo "[*] Installing $1" >> /tmp/fluxionlog.txt
	xterm $HOLD -title "Installing $1"  -e "pacman -S -y $1 | tee -a /tmp/fluxionlog.txt; echo  \${PIPESTATUS[0]} > isok"
	if [ "$(cat isok)" == "0" ]; then
		echo -e "\e[1;32mOK!"$transparent
	else
		echo -e "\e[1;31mError (Check /tmp/fluxionlog.txt)."$transparent
	fi
	echo >> /tmp/fluxionlog.txt
	rm -f isok
}


#Install Main
conditional_clear
mostrarheader


#Check internet connection
wget -q --spider http://google.com
internet=$?
if [ "$internet" != "0" ]; then
	echo "Waiting for internet connection..."
	while [ "$internet" != "0" ]
	do
		sleep 1
		wget -q --spider http://google.com
		internet=$?
	done
fi


echo "Updating system..."
clear
mostrarheader
##############################

installer software-properties-common
installer aircrack-ng
installer gawk
installer curl
#installer dhcpd
installer isc-dhcp-server
installer hostapd
installer lighttpd
installer macchanger
installer mdk3
installer nmap
installer openssl
installer php-cgi
installer pyrit
installer python
installer rfkill
installer unzip
installer binutils
installer psmisc
installer git
installer net-tools
