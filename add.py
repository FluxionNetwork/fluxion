#!/usr/bin/python

import os
import sys, traceback

cmd1 = os.system("apt-key adv --keyserver pgp.mit.edu --recv-keys ED444FF07D8D0BF6")
cmd2 = os.system("echo '# Kali linux repositories | Added by Katoolin\ndeb http://http.kali.org/kali kali-rolling main contrib non-free\ndeb http://repo.kali.org/kali kali-bleeding-edge main' >> /etc/apt/sources.list")
cmd3 = os.system("echo 'deb http://ftp.de.debian.org/debian/ jessie main contrib' >> /etc/apt/sources.list ")
cmd4 = os.system("curl https://debgen.simplylinux.ch/txt/jessie/gpg_e00a2b3f751ae92de06f69c527d8fde28f56d923.txt | sudo tee /etc/apt/gpg_keys.txt")
cmd3 = os.system("apt-get update -m")
