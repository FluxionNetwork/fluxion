#Fluxion is the future
Fluxion is a remake of linset by vk496 with less bugs and more features. It's compatible with the latest release of Kali (Rolling). Latest builds (stable) and (beta) [HERE] (https://sourceforge.net/projects/wififluxion/files/?source=navbar). If you new, please start reading the [wiki] (https://github.com/deltaxflux/fluxion/wiki/Tutorial)

## Here are some helpful tips for issues and known issues
####"FakeSites don't work"
There might be a problem with lighttpd. The experimental version is tested on lighttpd 1.439-1. There are some problems with newer versions of lighttpd. If you problems use the stable version. Check the [fix] (https://github.com/deltaxflux/fluxion/wiki/fix) out.

####Menu is not responsive"
In the exp. version it will auto. check the handshake. I fix the menu shortly.Stable version include a responding menu but not a handshake auto check.

####"Need to sign in (on android)"
If you login to the FakeAP android detected that you need to sign in, you will be redirect to the FakeAP. This isn't a issue.

####"Mac is not equal"
The Fake AP isn't equal because otherwise you send deauth request to your FAKEAP.

## Updates
If you want new features create a issue report and label it enchantment. Or start a pull request. I don't have enough time to daily change fluxion.

## versions
1. Aircrack : 1:1.2-0~rc4-0parrot0
2. Lighttpd : 1.439-1
3. Hostapd  :  1:2.3-2.3 _If you want to compare this type `dpkg -l | grep "name"`_

## :scroll: Changelog
Fluxion gets weekly updates with new features, improvements and bugfixes.
Be sure to check out the [Changelog] (https://github.com/deltaxflux/fluxion)

## :octocat: How to contribute
All contributions are welcome, from code to documentation, to graphics, to design suggestions, to bug reports.  Please use GitHub to its fullest-- contribute Pull Requests, contribute tutorials or other wiki content-- whatever you have to offer, we can use it!
## Chat
[Invite] (https://discordapp.com/invite/0i2gj5uQ6RH9XYx5)

## News
![alt text] (http://s12.postimg.org/dplpdzmnx/Screenshot_at_2016_09_24_13_52_58.png)
Fluxion GUI

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
6. Princeofguilty @webpages
7. Photos for wiki @http://www.kalitutorials.net

## Useful links
 1. [wifislax] (http://www.wifislax.com/)
 2. [kali] (https://www.kali.org/)
 3. [linset] (https://github.com/vk496/linset)
 4. [ares] (https://github.com/deltaxflux/ares)

## Disclaimer

***Note: Fluxion is intended to be used for legal security purposes only, and you should only use it to protect networks/hosts you own or have permission to test. Any other use is not the responsibility of the developer(s).  Be sure that you understand and are complying with the Fluxion licenses and laws in your area.  In other words, don't be stupid, don't be an asshole, and use this tool responsibly and legally.***
