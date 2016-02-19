#!/bin/bash

########## Modo DEBUG ##########
##			      ##
        flux_DEBUG=0
##			      ##
################################

################################
# Name : Flux
# Version : 0.01
# ##############################


clear
##################################### < CONFIGURATION vom SCRIPT > #####################################
#DUMP_PATH 
DUMP_PATH="/tmp/TMPlflux"
#Anzahl der "DEAUTHTIME"
DEAUTHTIME="8"
#Anzahl der "revision"
revision=35
# Numero de version
version=0.101
# IP DHCP
IP=192.168.1.1
RANG_IP=$(echo $IP | cut -d "." -f 1,2,3)

#Farben 
#Colores
Weiß"\033[1;37m"
Grau="\033[0;37m"
Magenta="\033[0;35m"
Rot="\033[1;31m"
Grün="\033[1;32m"
Gelb="\033[1;33m"
Blau="\033[1;34m"
Transparent="\e[0m"


