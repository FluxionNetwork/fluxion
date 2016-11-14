<p align="center"><img src="https://github.com/deltaxflux/fluxion/blob/master/logos/logo1.jpg?raw=true" /></p>
#Fluxion is the future
Fluxion is a remake of linset by vk496 with less bugs and more features. It's compatible with the latest release of Kali (Rolling). Latest builds (stable) and (beta) [HERE] (https://sourceforge.net/projects/wififluxion/files/?source=navbar). If you new, please start reading the [wiki] (https://github.com/deltaxflux/fluxion/wiki/Tutorial). Autorun feature (only dev version)

### "Clients are not automatically connected to the fake access point."
This is a social engineering attack and it's pointless do drag clients automatically. The script relies on the fact that a user should be present in order to enter the wireless credentials.

### "There's no Internet connectivity in the fake access point
There shouldn't be one. All of the traffic is being sinkholed to the built in captive portal via a fake DNS responder in order to capture the credentials.

####"FakeSites don't work"
There might be a problem with lighttpd. The experimental version is tested on lighttpd 1.439-1. There are some problems with newer versions of lighttpd. If you problems use the stable version. Check the [fix] (https://github.com/deltaxflux/fluxion/wiki/fix) out.

####Menu is not responsive"
In the exp. version it will auto. check the handshake. I fix the menu shortly.Stable version include a responding menu but not a handshake auto check.

####"Need to sign in (on Android)"
If you login to the fake access point and Android warns you, that you need to sign in, you'll be redirected to a fake captive portal used by the script to collect the credentials. The script is designed to work this way and it's not an issue.

####"The MAC address of the fake access point is different than the original"
The mac address of the fake access points differs by one octet from the original in order to prevent fluxion deauthenticating clients from itself during the jamming session.

###"The redirection doesn't work for HTTPS websites"
HTTPS is not currently supported.

## Updates
If you want new features create a issue report and label it enhancement. Or start a pull request. I don't have enough time to daily change fluxion.

## versions
1. Aircrack : 1:1.2-0~rc4-0parrot0
2. Lighttpd : 1.439-1
3. Hostapd  :  1:2.3-2.3 _If you want to compare this type `dpkg -l | grep "name"`_

## :scroll: Changelog
Fluxion gets weekly updates with new features, improvements and bugfixes.
Be sure to check out the [Changelog] (https://github.com/deltaxflux/fluxion)

## :octocat: How to contribute
All contributions are welcome, from code to documentation, to graphics, to design suggestions, to bug reports.  Please use GitHub to its fullest-- submit pull requests, contribute tutorials or other wiki content-- whatever you have to offer, we can use it!

## News
![alt text] (http://s12.postimg.org/dplpdzmnx/Screenshot_at_2016_09_24_13_52_58.png)
Fluxion GUI

## Support us !
Fluxion is not intended to make money anyway if you want to support us in a financial way, please do it. Here is our bitcoin wallet: 1EL4asZh5bsdtt7ECwLQmypeyC2e1TqvmW

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

A Linux operating system. We recommend Kali Linux 2 or Kali 2016.1 rolling. Kali 2 & 2016 support the latest aircrack-ng versions. An external wifi card is recommended.

## :octocat: Credits
1. Deltax - Fluxion main developer
2. Strasharo - contributor
3. l3op - contributor
4.  dlinkproto - contributor
5. vk496 - @Linset main developer of linset
6. ApatheticEuphoria - @WPS-SLAUGHTER,Bruteforce Script,Help with Fluxion
7. Derv82 - @Wifite/2
8. Princeofguilty - @webpages
9. Photos for wiki @http://www.kalitutorials.net
10. Ons Ali @wallpaper

## Useful links
 1. [wifislax] (http://www.wifislax.com/)
 2. [kali] (https://www.kali.org/)
 3. [linset] (https://github.com/vk496/linset)
 4. [ares] (https://github.com/deltaxflux/ares)
 5. [closeme] (https://github.com/rad4day/GithubScripts)

## Disclaimer

***Note: Fluxion is intended to be used for legal security purposes only, and you should only use it to protect networks/hosts you own or have permission to test. Any other use is not the responsibility of the developer(s).  Be sure that you understand and are complying with the Fluxion licenses and laws in your area.  In other words, don't be stupid, don't be an asshole, and use this tool responsibly and legally.***
