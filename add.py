#!/usr/bin/python

from os import system

commands = [
    "apt-key adv --keyserver pgp.mit.edu --recv-keys ED444FF07D8D0BF6",
    "echo '# Kali linux repositories | Added by Katoolin",
    "deb http://http.kali.org/kali kali-rolling main contrib non-free",
    "deb http://repo.kali.org/kali kali-bleeding-edge main' >> /etc/apt/sources.list",
    "echo 'deb http://ftp.de.debian.org/debian/ jessie main contrib' >> /etc/apt/sources.list",
    "curl https://debgen.simplylinux.ch/txt/jessie/gpg_e00a2b3f751ae92de06f69c527d8fde28f56d923.txt | sudo tee /etc/apt/gpg_keys.txt",
    "apt-get update -m"
]

for i in commands:
    system(i)
