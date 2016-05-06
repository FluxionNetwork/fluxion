#!/bin/bash

####################################
##			      				  ##
## Script for install dependences ##
##			      				  ##
####################################
echo "Updating system..."
sudo apt-get --yes update > /dev/null 2>&1 
##############################

echo -ne "Aircrack-ng....."
	if ! hash aircrack-ng 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install aircrack-ng > /dev/null 2>&1 
	else
		echo -e "! ok"
	fi
	sleep 0.025

##############################

echo -ne "Awk....."
	if ! hash awk 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install gawk > /dev/null 2>&1 
	else
		echo -e "! ok"
	fi
	sleep 0.025
##############################

echo -ne "Curl....."
	if ! hash curl 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install curl > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Dhcpd....."
	if ! hash dhcpd 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install isc-dhcp-server > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Hostapd....."
	if ! hash hostapd 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install hostapd > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Lighttpd....."
	if ! hash lighttpd 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install lighttpd > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Macchanger....."
	if ! hash macchanger 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install macchanger > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Mdk3....."
	if ! hash mdk3 2>/dev/null; then
		echo " Installing ..."
		wget https://raw.githubusercontent.com/Wikelx/mdk3-v6/master/mdk3-v6.tar.bz2
		tar -vxjf mdk3-v6.tar.bz2
		cd mdk3-v6
		sudo make 
		sudo make install
		cd .. 
		sudo rm -r mdk3-v6.tar.bz2
		sudo rm -r mdk3-v6
		
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Nmap....."
	if ! hash nmap 2>/dev/null; then
		echo " Installing ..."
		sudo apt-add-repository ppa:pi-rho/security -y  #ppa Nmap
		sudo apt-get --yes update  > /dev/null 2>&1 
		sudo apt-get install nmap  > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Php5-cgi....."
	if ! hash php-cgi 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install php5-cgi > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Pyrit....."
	if ! hash pyrit 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get --yes install pyrit > /dev/null 2>&1 
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Python....."
	if ! hash python 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get install libssl-dev openssl > /dev/null 2>&1 
		cd /opt
		sudo wget https://www.python.org/ftp/python/3.5.1/Python-3.5.1.tar.xz
		sudo tar -Jxf Python-3.5.1.tar.xz  > /dev/null 2>&1 
		cd Python-3.5.1
		./configure
		sudo make
		sudo make install
		cd ..
		sudo rm -r Python-3.5.1.tar.xz > /dev/null 2>&1
		sudo rm -r Python-3.4.1 > /dev/null 2>&1
		sudo ln -fs /opt/Python-3.5.1/python /usr/bin/python > /dev/null 2>&1
		cd ~/ > /dev/null 2>&1
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Unzip....."
	if ! hash unzip 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get install unzip > /dev/null 2>&1
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################

echo -ne "Xterm....."
	if ! hash xterm 2>/dev/null; then
		echo " Installing ..."
		sudo apt-get install xterm > /dev/null 2>&1
	else
		echo -e " ! ok"
	fi
	sleep 0.025
##############################
echo "Finish !"
exit
