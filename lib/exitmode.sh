function exitmode {
    if [ $FLUX_DEBUG != 1 ]; then
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
            ./lib/airmon/airmon    stop $WIFI_MONITOR &> $flux_output_device
        fi


        if [ "$WIFI" != "" ]; then
            echo -e ""$weis"["$rot"-"$weis"] "$weis"$general_exitmode_2 "$green"$WIFI"$transparent""
            ./lib/airmon/airmon    stop $WIFI &> $flux_output_device
            macchanger -p $WIFI &> $flux_output_device
        fi


        if [ "$(cat /proc/sys/net/ipv4/ip_forward)" != "0" ]; then
            echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_3"$transparent""
            sysctl -w net.ipv4.ip_forward=0 &>$flux_output_device
        fi

        echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_4"$transparent""
        if [ ! -f $DUMP_PATH/iptables-rules ];then 
            iptables --flush 
            iptables --table nat --flush 
            iptables --delete-chain
            iptables --table nat --delete-chain 
        else 
            iptables-restore < $DUMP_PATH/iptables-rules   
        fi

        echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_5"$transparent""
        tput cnorm

        if [ $FLUX_DEBUG != 1 ]; then

            echo -e ""$white"["$red"-"$white"] "$white"Delete "$grey"files"$transparent""
            rm -R $DUMP_PATH/* &>$flux_output_device
        fi

		if [ $KEEP_NETWORK = 0 ]; then

	        echo -e ""$white"["$red"-"$white"] "$white"$general_exitmode_6"$transparent""
	        # systemctl check
	        systemd=`whereis systemctl`
	        if [ "$systemd" = "" ];then
	            service network-manager restart &> $flux_output_device &
		  		service networkmanager restart &> $flux_output_device &
	            service networking restart &> $flux_output_device &
	        else
	            systemctl restart NetworkManager &> $flux_output_device & 	
	        fi 
	        echo -e ""$white"["$green"+"$white"] "$green"$general_exitmode_7"$transparent""
	        echo -e ""$white"["$green"+"$white"] "$grey"$general_exitmode_8"$transparent""
	        sleep 2
	        clear
	    fi

	fi

        exit
    
}