#!/usr/bin/env bash

fluxion_check_ap() {
  readonly SUPPORT_AP=$(sed -n -e "$(echo $(($1+4)))p" devices.xml | cut -d ">" -f2 | cut -d "<" -f1)
  if [ "$SUPPORT_AP" == "n" ];then
    echo "false"
  fi
}

fluxion_check_mo() {
  readonly SUPPORT_MO=$(sed -n -e "$(echo $(($1+6)))p" devices.xml | cut -d ">" -f2 | cut -d "<" -f1)
  if [ "$SUPPORT_MO" == "n" ];then
    echo "false"
  fi
}

# first identifier
fluxion_check_chipset() {
  declare -r LINE=$(grep "$1" devices.xml -n | head -n 1 | cut -d ":" -f1)

  if [ "$(fluxion_check_ap "$LINE")" == "false" ] || [ "$(fluxion_check_mo "$LINE")" == "false" ];then
    echo "false"
  else
    echo "true"
  fi
}

fluxion_check_chipset "$1"
