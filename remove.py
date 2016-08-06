#!/usr/bin/python

import os
import sys, traceback

infile = "/etc/apt/sources.list"
outfile = "/etc/apt/sources.list"

delete_list = ["# Kali linux repositories | Added by Katoolin\n", "deb http://http.kali.org/kali kali-rolling main contrib non-free\n","deb http://repo.kali.org/kali kali-bleeding-edge main\n"]
delete_list = ["deb http://ftp.de.debian.org/debian/ jessie main contrib"]
fin = open(infile)
os.remove("/etc/apt/sources.list")
fout = open(outfile, "w+")
for line in fin:
    for word in delete_list:
        line = line.replace(word, "")
    fout.write(line)
fin.close()
fout.close()

print "\033[1;31mDONE!  \033[1;m"
