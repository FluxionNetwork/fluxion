#!/bin/bash

##################################### < CONFIGURATION  > #####################################

gateway=$(ip route | grep default | awk '{print $3}')

#Colors
white="\033[1;37m"
red="\033[1;31m"
blue="\033[1;34m"
transparent="\e[0m"

#############################################################################################

clear
echo -e "$red[~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]"
echo -e "$red Prepare router page."
echo -e "$blue[~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]""$transparent"
echo "[i] Prepare dep."

# Check which package manager is installed
echo "Package Manager"
if hash pacman 2>/dev/null; then
  PACK="pacman -S"
else
  if hash apt-get 2>/dev/null; then
    PACK="apt-get install"
  else
    if hash yum 2>/dev/null; then
      PACK="yum install"
    fi
  fi
fi
sleep 0.025
echo "================================================================================="

echo -ne "Httrack........."
if ! hash httrack 2>/dev/null; then
  echo -e "\e[1;31mNot installed"$transparent""
  $PACK httrack
else
  echo -e "\e[1;32mOK!"$transparent""
fi
sleep 0.025
echo "================================================================================="

echo -ne "cutycapt........"
if ! hash httrack 2>/dev/null; then
  echo -e "\e[1;31mNot installed"$transparent""
  $PACK cutycapt
else
  echo -e "\e[1;32mOK!"$transparent""
fi
sleep 0.025
echo "================================================================================="

if [ ! -d sites ]; then
  mkdir sites
fi

#############################################################################################
echo "[i] Download preview picture"
cutycapt --url=http://$gateway --out=sites/$(date | awk '{print $4}').png
echo "================================================================================="

cd sites
echo "[i] Download router site"
httrack $gateway
echo "================================================================================="
echo "[I] DONE"
