#!/usr/bin/env bash

fluxion_check_ap() {
  readonly SUPPORT_AP=$(sed -n -e "$(echo $(($1+4)))p" devices.xml | cut -d ">" -f2 | cut -d "<" -f1)
  echo "$SUPPORT_AP"
}

fluxion_check_mo() {
  readonly SUPPORT_MO=$(sed -n -e "$(echo $(($1+6)))p" devices.xml | cut -d ">" -f2 | cut -d "<" -f1)
  echo "$SUPPORT_MO"
}

# first identifier
fluxion_check_chipset() {
  declare -r LINE=$(grep "$1" devices.xml -n | head -n 1 | cut -d ":" -f1)

  if [ "$(fluxion_check_ap "$LINE")" == "n" ] || [ "$(fluxion_check_mo "$LINE")" == "n" ];then
    echo "false"
  else
	  if [ "$(fluxion_check_ap "$LINE")" == "?" ] || [ "$(fluxion_check_mo "$LINE")" == "?" ];then
	    echo "Chipset not in list"
	  else
	    echo "true"
	  fi
  fi
}

fluxion_check_chipset "$1"
