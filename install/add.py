#!/usr/bin/python

from os import system

commands = [
    "apt-key adv --keyserver pgp.mit.edu --recv-keys ED444FF07D8D0BF6",
    "echo '# Kali linux repositories",
    "deb http://http.kali.org/kali kali-rolling main contrib non-free",
    "apt-get update -m"
]

for i in commands:
    system(i)
