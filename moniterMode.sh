#! /bin/bash
function banner(){
echo -e "\e[92m _____ _            _             "
echo -e "\e[92m|  ___| |_   ___  _(_) ___  _ __  "
echo -e "\e[92m| |_  | | | | \ \/ / |/ _ \| '_ \ "
echo -e "\e[92m|  _| | | |_| |>  <| | (_) | | | |"
echo -e "\e[92m|_|   |_|\__,_/_/\_\_|\___/|_| |_|"
echo -e "\e[92m                         Shortcuts"
}
function ask()
{
    echo "Enable Moniter Mode ? y/n"
    read choice
    if [[ $choice == "y" || $choice == "Y" ]]
    then
    sudo ifconfig wlan0 down
    echo "wlan0 is down..."
    sleep 1
    sudo iwconfig wlan0 mode moniter
    echo "wlan0 is set to Moniter Mode..."
    sleep 1
    sudo ifconfig wlan0 up
    echo "wlan0 is up..."
    sleep 1
    echo "Moniter Mode Enabled !"
    echo "========================"
    echo "Execute fluxion ?"
    echo "y/n"
    read choice
    if [[ $choice == "y" || $choice == "Y" ]]
    then
    sudo ./fluxion.sh
    elif [[ $choice == "n" || $choice == "N" ]]
    then 
        echo "Exiting Program..."
        sleep 3
    fi
    elif [[ $choice == "n" || $choice == "N" ]]
    then
    echo "Exiting Program..."
    sleep 3
    fi
}

clear
banner
ask