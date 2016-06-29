#Fluxion is the future
Fluxion is a remake of linset by vk496 with less bugs and more features. It's compatible with the latest release of Kali (Rolling)

## :scroll: Changelog
Fluxion gets weekly updates with new features, improvements and bugfixes. 
Be sure to check out the [Changelog] (https://github.com/deltaxflux/fluxion)

## :octocat: How to contribute
All contributions are welcome, from code to documentation, to graphics, to design suggestions, to bug reports.  Please use GitHub to its fullest-- contribute Pull Requests, contribute tutorials or other wiki content-- whatever you have to offer, we can use it!
## Chat
[Invite] (https://discordapp.com/invite/0i2gj5uQ6RH9XYx5)

## :book: How it works

* Scan the networks.
* Capture a handshake (can't be used without a valid handshake, it's necessary to verify the password)
* Use WEB Interface *
* Launch a FakeAP instance to imitate the original access point
* Spawns a MDK3 process, which deauthenticates all users connected to the target network, so they can be lured to connect to the FakeAP and enter the WPA password.
* A fake DNS server is launched in order to capture all DNS requests and redirect them to the host running the script
* A captive portal is launched in order to serve a page, which prompts the user to enter their WPA password
* Each submitted password is verified by the handshake captured earlier
* The attack will automatically terminate, as soon as a correct password is submitted

##  :heavy_exclamation_mark: Requirements

A linux operating system. We recommend Kali Linux 2 or Kali 2016.1 rolling. Kali 2 & 2016 support the latest aircrack-ng versions. A external wifi card is recommended. 

## :octocat: Credits
1. Deltax @FLuX and Fluxion main developer 
2. Strasharo @Fluxion help to fix DHCPD and pyrit problems, spelling mistakes
3. vk496 @Linset main developer of linset 
4. ApatheticEuphoria @WPS-SLAUGHTER,Bruteforce Script,Help with Fluxion
5. Derv82 @Wifite/2 

## Useful links
 1. [wifislax] (http://www.wifislax.com/)
 2. [kali] (https://www.kali.org/)
 3. [linset] (https://github.com/vk496/linset)

## Disclaimer

***Note: Fluxion is intended to be used for legal security purposes only, and you should only use it to protect networks/hosts you own or have permission to test. Any other use is not the responsibility of the developer(s).  Be sure that you understand and are complying with the Fluxion licenses and laws in your area.  In other words, don't be stupid, don't be an asshole, and use this tool responsibly and legally.***
