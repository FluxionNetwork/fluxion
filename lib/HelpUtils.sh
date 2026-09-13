#!/usr/bin/env bash

fluxion_help(){
  echo " FLUXION(1)                       User Manuals                       FLUXION(1)



  NAME
         fluxion  -  Fluxion  is  a  security  auditing  and  social-engineering
         research tool

  SYNOPSIS
         fluxion [-debug] [-l language ] [-m] [--auto] [--scan-time N] attack ...

  DESCRIPTION
         fluxion is a security auditing and  social-engineering  research  tool.
         It  is  a remake of linset by vk496 with (hopefully) less bugs and more
         functionality. The script attempts to retrieve the WPA/WPA2 key from  a
         target  access point by means of a social engineering (phising) attack.
         It's compatible with the latest release of  Kali  (rolling).  Fluxion's
         attacks'  setup  is  mostly  manual, but experimental auto-mode handles
         some of the attacks' setup parameters.

  OPTIONS
         -v     Print version number.

         --help Print help page and exit with 0.

         -m     Use tmux multiplexer instead of xterm. Enables headless
                operation without an X11/graphical session. If not already
                inside a tmux session, fluxion will re-exec itself inside
                one. All sub-windows are opened as tmux windows instead of
                xterm terminals.

         --auto Run fluxion in fully non-interactive auto mode. Every
                interactive prompt auto-selects a sensible default. Implies
                --killer (-k). In auto mode, fluxion runs one attack cycle
                and exits (no looping). Best combined with -m for headless
                operation.

         --scan-time <seconds>
                Duration in seconds for the wireless scanner in auto mode.
                Default is 30. After this time, the scanner is killed and
                results are processed. Only meaningful with --auto or
                --scan-only.

         --scan-only
                Scan for nearby WPA networks, print results to stdout, and
                exit. Does not launch any attack. Implies --auto and -k.
                Use with --scan-time to control scan duration and -c to
                restrict channels. Output is a machine-friendly table.

         --list-interfaces
                List all detected wireless network interfaces with their
                supported bands, driver, chipset, bus type, and state, then exit.

         --interface <iface>
                Use the specified wireless interface for scanning and
                operations. If not given, the first available wireless
                interface is used.

         --jammer-interface <iface>
                Use the specified wireless interface for the deauth jammer
                (Captive Portal attack). Overrides auto-selection for this
                role only.

         --ap-interface <iface>
                Use the specified wireless interface for the rogue access
                point (Captive Portal attack). Overrides auto-selection for
                this role only.

         --tracker-interface <iface>
                Use the specified wireless interface for the target tracker
                (channel-change detection). In auto mode the tracker is
                disabled unless this option is given.

         --ap-service <hostapd|airbase-ng>
                Override the rogue AP service. Default is hostapd.
                On DFS channels (52-64, 100-144) auto mode selects
                airbase-ng automatically since hostapd requires driver
                radar/CAC support that USB adapters lack.

         --deauth-method <mdk4|aireplay-ng>
                Override the deauthentication method used by auto mode
                (Captive Portal and Handshake Snooper attacks). Default is
                aireplay-ng. Note mdk4's "d" mode only sends deauth packets
                once it observes live data traffic from a client, and stays
                silent until then; pass mdk4 once that upstream issue is
                fixed, or if you specifically want its traffic-triggered
                behavior.

         --reg-domain <CC>
                Override the wireless regulatory domain used when bringing
                up the rogue AP on 5 GHz channels (e.g. US, DE, JP).
                Default is US. The original domain is restored on exit.

         --timeout <minutes>
                Maximum duration in minutes for the attack in auto mode.
                After this time the attack is stopped and fluxion exits.
                Default is no timeout (runs indefinitely until the attack
                succeeds or is interrupted).

         -k     Kill interfering wireless processes (NetworkManager, etc.)
                before allocating interfaces. Implied by --auto.

         -d     Run fluxion in debug mode.

         -r     Reload driver.

         -l <language>
                Define a certain language. In auto mode, defaults to \"en\".

         -e <essid>
                Select the target network based on the ESSID. In auto mode,
                used to filter scan results to the matching network.

         --band <bg|a|abg>
                Wireless band to scan. bg = 2.4 GHz, a = 5 GHz,
                abg = both. Default is bg. Overrides auto-detection
                from -c. Passed directly to airodump-ng --band.

         -c <channel>
                Indicate the channel(s) to listen to. In auto mode, the
                scanner is restricted to these channels.

         -a <attack>
                Define a certain attack. In auto mode, this selects the
                attack type without prompting.

         --ratio <ratio>
                Define the windows size. Bigger ratio ->  smaller  window  size.
                Default is 4. Only applies in xterm mode.

         -b <bssid>
                Select the target network based on the access point MAC address.
                In auto mode, used to filter scan results.

         -j <jamming interface>
                Define a certain jamming interface.

         -a <access point interface>
                Define a certain access point interface.

  EXAMPLES
         # List all nearby WPA networks (60-second scan):
         sudo ./fluxion.sh -m --scan-only --scan-time 60

         # List networks on channel 6 only:
         sudo ./fluxion.sh -m --scan-only --scan-time 30 -c 6

         # Scan both 2.4 GHz and 5 GHz bands:
         sudo ./fluxion.sh --scan-only --scan-time 30 --band abg

         # Headless, non-interactive, 15-second scan:
         sudo ./fluxion.sh -m --auto -l en --scan-time 15

         # Headless with specific target:
         sudo ./fluxion.sh -m --auto -b AA:BB:CC:DD:EE:FF -c 6

  FILES
         /tmp/fluxspace/
                The system wide tmp directory.
         \$FLUXION/attacks/
                Folder where handshakes and passwords are stored in.

  ENVIRONMENT
         FLUXIONAuto
                Automatically run fluxion in auto mode if exported.

         FLUXIONDebug
                Automatically run fluxion in debug mode if exported.

         FLUXIONWIKillProcesses
                Automatically kill any interfering process(es).

  DIAGNOSTICS
         Please checkout the other log files or use the debug mode.

  BUGS
         Please  report  any  bugs  at:  https://github.com/FluxionNetwork/flux-
         ion/issues

  AUTHOR
         Cyberfee, l3op, dlinkproto, vk496, MPX4132

  SEE ALSO
         aircrack-ng(8),


  Linux                             MARCH 2018                        FLUXION(1)"

}
