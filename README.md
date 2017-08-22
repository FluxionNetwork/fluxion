![Fuxion logo](https://github.com/FluxionNetwork/fluxion/raw/master/logos/logo.jpg)

# Fluxion is the future of MITM WPA attacks
Fluxion is a remake of linset by vk496 with (hopefully) less bugs and more functionality. It's compatible with the latest release of Kali (rolling). The attack is mostly manual, but experimental versions will automatically handle most functionality from the stable releases.

## Router login page
Share your own router page with a simple script
```
cd scripts
sudo sh router.sh
```

[FAQ](https://github.com/FluxionNetwork/fluxion/wiki/FAQ)

## Installation
```
git clone --recursive https://github.com/FluxionNetwork/fluxion.git # Download the latest revision
cd fluxion # Switch to tool's directory
```

## :white_check_mark: Included dependency versions
1. Aircrack : 1:1.2-0~rc4-0parrot0
2. Lighttpd : 1.439-1
3. Hostapd  : 1:2.3-2.3 _If you want to compare this type `dpkg -l | grep "name"`_

## :scroll: Changelog
Fluxion gets weekly updates with new features, improvements and bugfixes.
Be sure to check out the [changelog here](https://github.com/FluxionNetwork/fluxion/commits/master).

## :octocat: How to contribute
All contributions are welcome! Code, documentation, graphics or even design suggestions are welcome; use GitHub to its fullest. Submit pull requests, contribute tutorials or other wiki content -- whatever you have to offer, it would be appreciated!

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

## :heavy_exclamation_mark: Requirements

A Linux-based operating system. We recommend Kali Linux 2 or Kali 2016.1 rolling. Kali 2 & 2016 support the latest aircrack-ng versions. An external wifi card is recommended.

## Related work

For development I use vim and tmux. Here are my [dotfiles](https://github.com/deltaxflux/takumi/)
## :octocat: Credits
1. l3op - contributor
2. dlinkproto - contributor
3. vk496 - developer of linset
4. Derv82 - @Wifite/2
5. Princeofguilty - @webpages and @buteforce
6. Photos for wiki @http://www.kalitutorials.net
7. Ons Ali @wallpaper
8. PappleTec @sites
9. MPX4132 - Fluxion V3

## Disclaimer
* Authors do not own the logos under the `/attacks/Captive Portal/sites/` directory. Copyright Disclaimer Under Section 107 of the Copyright Act 1976, allowance is made for "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research.

* Usage of Fluxion for attacking infrastructures without prior mutual consistency can be considered as an illegal activity. It is the final user's responsibility to obey all applicable local, state and federal laws. Authors assume no liability and are not responsible for any misuse or damage caused by this program.

## Note
* Be aware of sites pretending to be related with the Fluxion Project. They may be delivering malware.

* If you are using Microsoft's versions of Ubuntu or the other distros, do not forget to first install a X-server like X-Ming and before running the script run the following `export DISPLAY=:0`


