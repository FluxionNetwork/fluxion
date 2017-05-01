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

#DUMP_PATH
rm -rf /tmp/Installer/
mkdir /tmp/Installer/
DUMP_PATH="/tmp/Installer/"

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
	echo -e "$red[  $red    FLUXION $version" "${yellow} ${red}  < F""${yellow}luxion" "${red}I""${yellow}s" "${red}T""${yellow}he ""${red}F""${yellow}uture >     "          ${blue}" ]"
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

#Install Main
conditional_clear
mostrarheader

echo "Updating system..."

#cleaning up
sudo apt-get install -f -y
sudo apt-get autoremove -y
sudo apt-get autoclean -y
sudo apt-get clean -y
sudo apt-get update
sudo apt-get install xterm --yes
clear
mostrarheader
xterm $HOLD -title "Updating System"  $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get install software-properties-common --yes
xterm $HOLD -title "Updating System"  $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e python remove.py
xterm $HOLD -title "Updating System"  $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e python add.py

##############################

echo -ne "Aircrack-ng....."
	if ! hash aircrack-ng 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent
	 xterm $HOLD -title "Installing Aircrack-ng" -e apt-get --yes install aircrack-ng
	else
    echo -e "\e[1;32mOK!"$transparent
	fi
	sleep 0.025

##############################

echo -ne "Aireplay-ng....."
	if ! hash awk 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		xterm $HOLD -title "Installing Awk" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install gawk
	else
		echo -e "\e[1;32mOK!"$transparent
	fi
	sleep 0.025
##############################

echo -ne "Airodump-ng....."
if ! hash airodump-ng 2>/dev/null; then
	echo -e "\e[1;31mInstalling ..."$transparent""
	xterm $HOLD -title "Installing Airodump-ng" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install aircrack-ng
else
	echo -e "\e[1;32mOK!"$transparent""
fi
##############################
	echo -ne "Bully..........."
	if ! hash bully 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		xterm $HOLD -title "Installing Bully" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install bully
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
##############################
echo -ne "Curl............"
	if ! hash curl 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing Curl" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install curl
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################

echo -ne "Dhcpd..........."
	if ! hash dhcpd 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		xterm $HOLD -title "Installing isc-dhcp-server" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install isc-dhcp-server
	else
		echo -e "\e[1;32mOK!"$transparent
  	fi
	sleep 0.025
##############################

echo -ne "Hostapd........."
	if ! hash hostapd 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		xterm $HOLD -title "Installing Hostapd" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install hostapd
	else
		echo -e "\e[1;32mOK!"$transparent
  	fi
	sleep 0.025
##############################

echo -ne "Iwconfig........"
if ! hash iwconfig 2>/dev/null; then
			echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing Iwconfig" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install iwconfig
else
	echo -e "\e[1;32mOK!"$transparent""
fi
sleep 0.025
##############################
	echo -ne "Lighttpd........"
	if ! hash lighttpd 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing Lighttpd" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install lighttpd
	else
		echo -e "\e[1;32mOK!"$transparent
  	fi
	sleep 0.025
##############################

echo -ne "Macchanger......"
	if ! hash macchanger 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing Macchanger" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install macchanger
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################

echo -ne "Mdk3............"
	if ! hash mdk3 2>/dev/null; then
	echo -e "\e[1;31mInstalling ..."$transparent""
	xterm $HOLD -title "Installing Macchanger" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install mdk3
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025

##############################

echo -ne "Nmap............"
	if ! hash nmap 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		xterm $HOLD -title "Installing Nmap" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get install --yes nmap
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################
echo -ne "Openssl........."
if ! hash openssl 2>/dev/null; then
	echo -e "\e[1;31mInstalling ..."$transparent""
	xterm $HOLD -title "Installing Openssl" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install openssl
else
	echo -e "\e[1;32mOK!"$transparent""
fi
sleep 0.025
##############################
echo -ne "Php-cgi........."
	if ! hash php-cgi 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing php-cgi" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install php-cgi
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################

	echo -ne "Pyrit..........."
	if ! hash pyrit 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		xterm $HOLD -title "Installing Pyrit" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install pyrit
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################

echo -ne "Python.........."
	if ! hash python 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing Python" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install python
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################

echo -ne "rfkill.........."
        if ! hash rfkill 2>/dev/null; then
              echo -e "\e[1;31mInstalling ..."$transparent""
              xterm $HOLD -title "Installing Rfkill" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install rfkill
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

##############################

echo -ne "Unzip..........."
	if ! hash unzip 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
			xterm $HOLD -title "Installing unzip" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install unzip
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################

echo -ne "Xterm..........."
	if ! hash xterm 2>/dev/null; then
		echo -e "\e[1;31mInstalling ..."$transparent""
		apt-get install xterm
	else
		echo -e "\e[1;32mOK!"$transparent
  fi
	sleep 0.025
##############################
echo -ne "strings........."
if ! hash strings 2>/dev/null; then
        echo -e "\e[1;31mInstalling ..."$transparent""
        xterm $HOLD -title "Installing binutils" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install binutils
else
        echo -e "\e[1;32mOK!"$transparent""
fi
sleep 0.025
#############################
echo -ne "fuser..........."
if ! hash fuser 2>/dev/null; then
        echo -e "\e[1;31mInstalling ..."$transparent""
        xterm $HOLD -title "Installing psmisc" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e apt-get --yes install psmisc
else
        echo -e "\e[1;32mOK!"$transparent""
fi
sleep 0.025
#############################

xterm $HOLD -title "Remove repositories"  -e python remove.py

git clone https://github.com/molovo/revolver revolver
chmod u+x revolver/revolver
mv revolver/revolver /usr/local/bin
