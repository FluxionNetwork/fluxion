	clear
	echo -e "\e[1;31mInstaller - by Deltax"
	echo -e "\e[1;31mCheck & autoinstall"
	echo -e "\e[1;31mDebian only"
	echo -e "\e[1;31mFix coming soon"
	echo -e "\e[1;31mBug add-apt-repository"
	echo -e "\e[1;31mor add kali sources in etc/apt/source.lst"

	
	
	sleep 2
	clear
	echo -ne "Aircrack-ng....."
	if ! hash aircrack-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install aircrack-ng -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Aireplay-ng....."
	if ! hash aireplay-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install aireplay-ng -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Airmon-ng......."
	if ! hash airmon-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install airmon-ng -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Airodump-ng....."
	if ! hash airodump-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install airodump-ng -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Awk............."
	if ! hash awk 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install awk -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Curl............"
	if ! hash curl 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install curl -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Dhcpd..........."
	if ! hash dhcpd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent" (isc-dhcp-server)"
		sudo apt-get install dhcpd -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Hostapd........."
	if ! hash hostapd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install hostapd -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Iwconfig........"
	if ! hash iwconfig 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install iwconfig -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Lighttpd........"
	if ! hash lighttpd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install lighttpd -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Macchanger......"
	if ! hash macchanger 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install macchanger -y
	else
	    echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Mdk3............"
	if ! hash mdk3 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install mdk3 -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Php5-cgi........"
	if ! [ -f /usr/bin/php-cgi ]; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install php5-cgi -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Pyrit..........."
	if ! hash pyrit 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install pyrit
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Python.........."
	if ! hash python 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install python -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Unzip..........."
	if ! hash unzip 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install unzip -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Xterm..........."
	if ! hash xterm 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		sudo apt-get install xterm -y
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	sleep 10
	clear

