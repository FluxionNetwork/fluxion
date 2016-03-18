#Fluxion is the future
Fluxion is a remake of linset by vk439 with fixed bugs and added features. It's compatible with the latest release of Kali (Rolling)

#How it works

* Scan the networks.
* Capture handshake (can't be used without a valid handshake, it's necessary to verify the password)
* Use WEB Interface *
* Launches a FakeAP instance imitating the original access point
* Spawns a MDK3 processs, which deauthentificates all of the users connected to the target network, so they can be lured to connect to FakeAP network and enter the WPA password.
* A DHCP server is lainched in FakeAP network
* A fake DNS server is launched in order to capture all of the DNS requests and redirect them to the host running the script
* A captive portal is launched in order to serve a page, which prompts the user to enter their WPA password
* Each submitted password is verified against the handshake captured earlier
* The attack will automatically terminate once correct password is submitted


#Install dependencies:
1. Run installer script
```shell
sudo ./Installer.sh
```
#Launch fluxion
2) Execute the main script
```shell 
$ sudo ./fluxion
```

#Credits
1. Deltax @FLuX and Fluxion main developer 
2. Strasharo @Fluxion help to fix DHCPD and pyrit problems, spelling mistakes
3. vk439 @Linset main developer of linset 
4. ApatheticEuphoria @Wifi-Slaughter WPS Crack 
5. Derv82 @Wifite/2 
6. Sophron @Wifiphisher
7. sensepost @Mana


#Bugs fixed
- [x] Negative Channel
- [x] Kali Patch for Kali Patch 2 
- [x] Added airmon 
- [x] Translate DE --> EN
- [x] Handshake get fixed 
- [x] Check Updates 
- [x] Animations
- [x] Wifi List Bug 

