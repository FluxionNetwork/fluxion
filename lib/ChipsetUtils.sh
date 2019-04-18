#!/usr/bin/env bash

# ChipsetUtils: check if chipset is supported
check_chipset() {
    if [ "$1" == "" ];then printf "\033[31mInvalid input, chipset appears invalid\033[0m\n"; exit 1;fi

    # =================== < CONFIG > ===================
    if [ -d "misc" ];then
        readonly local CHIPSET_LIST="misc/devices.xml" # chipset file list
    elif [ -d "../misc" ];then
        readonly local CHIPSET_LIST="../misc/devices.xml" # chipset file list
    else
        echo -e "\033[31Can't find required resources\033[0m"
    fi
    local SUPPORT_AP="" # check if chipset support ap mode
    local SUPPORT_MO="" # check if chipset support monitor mode
    # =================== < CONFIG > ===================

    if [ ! -f $CHIPSET_LIST ];then 
        echo "Can't open file"
    fi

    local line=$(cat $CHIPSET_LIST | grep -n $1 | cut -d ":" -f1 | head -n 1) # get current position of chipset
    local length=$(wc -l $CHIPSET_LIST | awk '{print $1}')
    if [ "$line" == "" ];then printf "\033[31mChipset is not in list\033[0m\n";exit 1;fi # Catch if chipset is not present

    local cout=$line
    local i=$cout
    while true;do
        local data=$(cat $CHIPSET_LIST | sed -n -e "${cout}p")
        local iden=$(echo $data | cut -d ">" -f1 | cut -d "<" -f2)
        local row=$(echo $data | cut -d ">" -f2 | cut -d "<" -f1)

        if [ "$iden" == "AP" ];then
            case $row in
                y) echo -e "\033[32mChipset support ap mode\033[0m";SUPPORT_AP=true;;
                n) echo -e "\033[31mChipset doesn't support ap mode\033[0m";SUPPORT_AP=false;;
                ?) echo -e "\033[33mNo information if chipset support ap mode\033[0m";SUPPORT_AP=unknown;;
            esac
        fi

        if [ "$iden" == "Monitor" ];then
            case $row in
                y) echo -e "\033[32mChipset support monitor mode\033[0m"; SUPPORT_MO=true;;
                n) echo -e "\033[31mChipset doesn't support monitor mode\033[0m";SUPPORT_MO=false;;
                ?) echo -e "\033[33mNo information if chipset support monitor mode\033[0m";SUPPORT_MO=unknown;
            esac
        fi

        if [ "$SUPPORT_MO" == false -a "$SUPPORT_MO" == true ] && [ "$SUPPORT_AP4" == false -a "$SUPPORT_AP" == true ]; then break; fi

        cout=$(echo $(($cout+1)))
        if [ $cout -gt $length ] || [ "$cout" -eq $(echo $(($i+10))) ];then echo -e "\033[33mDon't reseve all required information\033[0m";break ;fi # Catch out of range
    done

    if [ "$SUPPORT_AP" == true ] && [ "$SUPPORT_MO" == true ]; then return 0; else return 1;fi
}
