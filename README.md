#Fluxion is the future
Fluxion is a remake of linset by vk439 with fixed bugs and added features. It's compatible with the latest release of Kali (Rolling)

## :scroll: Changelog
Fluxion gets updated weekly with new features, improvements and bugfixes. 
Be sure to check out the [Changelog] (https://github.com/deltaxflux/fluxion)

## :octocat: How to contribute
All contributions are welcome, from code to documentation to graphics to design suggestions to bug reports.  Please use GitHub to its fullest-- contribute Pull Requests, contribute tutorials or other wiki content-- whatever you have to offer, we can use it!

## :book: How it works

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

##  :heavy_exclamation_mark: Requirements

A linux operating system. We recommend Kali Linux 2 or Kali 2016.1 rolling. Kali 2 & 2016 support the latest aircrack-ng versions. A external wifi card is recommended. 


##  :eight_spoked_asterisk: Bugs fixed
- [x] Negative Channel
- [x] Kali Patch for Kali Patch 2 
- [x] Added airmon 
- [x] Translate DE --> EN
- [x] Handshake get fixed 
- [x] Check Updates 
- [x] Animations
- [x] Wifi List Bug 

## :octocat: Credits
1. Deltax @FLuX and Fluxion main developer 
2. Strasharo @Fluxion help to fix DHCPD and pyrit problems, spelling mistakes
3. vk439 @Linset main developer of linset 
4. ApatheticEuphoria @WPS-SLAUGHTER,Bruteforce Script,Help with Fluxion
5. Derv82 @Wifite/2 

## Disclaimer

***Note: Fluxion is intended to be used for legal security purposes only, and you should only use it to protect networks/hosts you own or have permission to test. Any other use is not the responsibility of the developer(s).  Be sure that you understand and are complying with the Fluxion licenses and laws in your area.  In other words, don't be stupid, don't be an asshole, and use this tool responsibly and legally.***
