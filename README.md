<p align="center">
  <img src="https://github.com/FluxionNetwork/fluxion/raw/master/logos/logo.jpg" alt="Fluxion-NG Logo" width="600"/>
</p>

<h1 align="center">Fluxion-NG</h1>
<h3 align="center">Next-Generation WiFi Security Auditing Framework</h3>

<p align="center">
  <img src="https://img.shields.io/badge/version-7.0-blue?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/platform-Linux-green?style=for-the-badge&logo=linux" alt="Platform"/>
  <img src="https://img.shields.io/badge/license-GPL--3.0-red?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/bash-4.0+-yellow?style=for-the-badge&logo=gnubash" alt="Bash"/>
  <img src="https://img.shields.io/badge/python-3.x-blue?style=for-the-badge&logo=python" alt="Python"/>
</p>

<p align="center">
  <b>Fluxion-NG</b> is a complete rewrite of the original Fluxion tool — a security auditing and social-engineering research framework for WPA/WPA2 networks. Built for <b>authorized penetration testing</b> and <b>security research</b> only.
</p>

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Attack Flow Diagram](#attack-flow-diagram)
- [Features](#features)
- [What's New in Fluxion-NG](#whats-new-in-fluxion-ng)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start Guide](#quick-start-guide)
- [Usage & Options](#usage--options)
- [Attack Modules](#attack-modules)
- [Headless Mode (No VM/GUI)](#headless-mode-no-vmgui)
- [Supported Languages](#supported-languages)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Credits](#credits)
- [Disclaimer](#disclaimer)

---

## Overview

Fluxion-NG is a WiFi security auditing tool that tests WPA/WPA2 network security through social engineering techniques. It captures a WPA handshake and then creates a convincing captive portal that prompts users for their network password. The entered password is verified against the captured handshake in real-time.

> **Important:** This tool is designed for **authorized security testing only**. Always obtain written permission before testing any network you don't own.

### Why Fluxion-NG?

The original Fluxion had great concepts but suffered from numerous bugs, race conditions, and outdated code. Fluxion-NG addresses these issues:

| Issue | Original Fluxion | Fluxion-NG |
|-------|-----------------|------------|
| Security vulnerabilities | `eval` injection bugs in core utils | All `eval` calls removed/secured |
| Variable quoting | Widespread unquoted variables | Properly quoted throughout |
| Error handling | Silent failures, undefined variables | Robust error checking |
| Display requirement | Required X11/xterm always | Headless mode available |
| Deauth selection | Raw input, inconsistent UI | Integrated menu system |
| Process management | Race conditions, zombies | Timeouts and proper cleanup |
| Code quality | Inconsistent, profanity in comments | Clean, documented, consistent |
| Python compatibility | Mixed Python 2/3 | Python 3 only |
| Dependencies | Missing `import re` crash | All imports verified |

---

## How It Works

Fluxion-NG uses a multi-stage approach to test WPA/WPA2 security:

```
Step 1: RECONNAISSANCE          Step 2: HANDSHAKE CAPTURE
+-----------------------+       +------------------------+
|  Scan WiFi networks   |  -->  | Capture WPA handshake  |
|  Identify target AP   |       | via deauthentication   |
|  Gather AP details    |       | Verify handshake valid |
+-----------------------+       +------------------------+
                                          |
                                          v
Step 4: VERIFICATION            Step 3: CAPTIVE PORTAL
+------------------------+      +------------------------+
| Check password against | <--  | Create rogue AP clone  |
| captured handshake     |      | Serve login portal     |
| Log if correct         |      | Redirect all traffic   |
+------------------------+      +------------------------+
```

### Detailed Process

1. **Interface Setup** - Select and configure wireless interface(s) for monitor mode
2. **Network Scanning** - Scan for WPA/WPA2 networks using airodump-ng
3. **Target Selection** - Choose target with signal quality, client count, and vendor info
4. **Handshake Capture** - Deauthenticate clients to capture the 4-way WPA handshake
5. **Handshake Verification** - Validate capture using aircrack-ng, cowpatty, or pyrit
6. **Attack Configuration** - Select AP service, deauth method, portal design, SSL settings
7. **Attack Execution** - Launch rogue AP, captive portal, DNS spoof, and deauthenticator
8. **Password Verification** - Each submitted password is checked against the handshake
9. **Completion** - Valid password is logged and all services are cleanly shut down

---

## Attack Flow Diagram

```
                    +------------------+
                    |   Start Fluxion  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Select Language   |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Select Interface  |
                    +--------+---------+
                             |
                    +--------v---------+
                    |  Scan Networks    |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Select Target AP  |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v----------+       +----------v---------+
    | Handshake Snooper  |       |  Captive Portal    |
    | (Capture WPA hash) |       |  (Phishing attack) |
    +---------+----------+       +----------+----------+
              |                             |
              |    +----------------+       |
              +--->| Verify Hash    |<------+
                   +-------+--------+
                           |
              +------------+------------+
              |                         |
    +---------v----------+    +---------v----------+
    |  Parallel Services |    |  Monitor & Verify  |
    |  - Rogue AP        |    |  - Check passwords |
    |  - DHCP Server     |    |  - Log attempts    |
    |  - DNS Spoofer     |    |  - Track clients   |
    |  - Web Server      |    |  - Channel track   |
    |  - Deauthenticator |    |                    |
    +--------------------+    +---------+----------+
                                        |
                              +---------v----------+
                              | Password Found!    |
                              | Log & Clean Up     |
                              +--------------------+
```

---

## Features

### Core Capabilities

- **WPA/WPA2 Handshake Capture** - Automated handshake snooping with verification
- **Captive Portal Attack** - Configurable phishing portal with multiple templates
- **Multi-Interface Support** - Separate interfaces for AP, jamming, and tracking
- **Channel Tracking** - Automatic detection and adaptation to channel changes
- **Attack Persistence** - Save and restore attack configurations

### Deauthentication Methods

| Method | Description | Best For |
|--------|-------------|----------|
| **mdk4** | Targeted deauth with blacklist support | Most situations (recommended) |
| **aireplay-ng** | Classic broadcast deauthentication | Simple setups |
| **deauth-ng.py** | Custom Python deauth with 5GHz support | 5GHz networks |

### AP Services

| Service | Description | Pros |
|---------|-------------|------|
| **hostapd** | Native AP via nl80211 driver | Stable, efficient, recommended |
| **airbase-ng** | AP via aircrack-ng suite | More chipset compatibility |

### Captive Portal Options

- **24 language-specific generic portals** - Auto-generated with localized text
- **Custom portal templates** - Drop-in HTML/CSS/JS portals (e.g., ARRIS router)
- **SSL/TLS support** - Optional self-signed or custom certificates
- **Connectivity emulation** - Fake Apple/Google connectivity check responses

### Security Verification

- **cowpatty** - Recommended, reliable WPA verification
- **aircrack-ng** - Widely available, good fallback
- **pyrit** - GPU-accelerated (optional, if installed)

---

## What's New in Fluxion-NG

### Security Fixes
- Removed dangerous `eval` calls that allowed command injection
- Fixed path traversal in sandbox file operations
- Proper input sanitization in PHP authenticator
- Fixed undefined variable references

### Bug Fixes
- Fixed wrong variable name in `io_input_enumerated_choice()` that caused crashes
- Fixed contradictory logic in chipset capability checking
- Fixed undefined `$authService` variable in shutdown handler
- Fixed undefined `$hostID` in airbase-ng routing
- Fixed `systemd-resolved` restart logic (inverted condition)
- Fixed SSL certificate condition operator precedence
- Fixed SSID escape handling for special characters
- Fixed missing `import re` in deauth-ng.py (caused runtime crash)
- Fixed deauth method selection breaking the UI flow
- Added missing `$FLUXIONGeneralBackOption` to hash verifier menu

### Improvements
- **Headless mode** - Run without X11/xterm using `--headless` flag
- **Better UX** - Guided prompts, attack summaries, confirmation dialogs
- **Proper quoting** - All variables properly quoted to prevent word splitting
- **Timeout handling** - AP service startup has timeout to prevent infinite loops
- **Monitor mode verification** - Jammer interface mode verified before deauth
- **Process cleanup** - Improved signal handling and process termination
- **Updated dependencies** - Python 3 only, modern tool versions
- **21+ languages** - Full internationalization support

---

## Requirements

### Operating System

| OS | Support Level | Notes |
|----|--------------|-------|
| **Kali Linux 2025.4+** | Full support | Recommended |
| **Parrot Security OS** | Full support | Alternative |
| **Ubuntu/Debian** | Supported | May need manual dependency install |
| **Arch Linux** | Supported | Available via BlackArch repo |
| **Fedora** | Supported | DNF package manager supported |
| **Other Linux** | Partial | Must have all dependencies |
| **WSL/WSL2** | Not supported | No wireless interface access |
| **macOS/Windows** | Not supported | Linux only |

### Hardware

- **Wireless adapter** with monitor mode and packet injection support
- **Recommended chipsets:** Atheros AR9271, Ralink RT3070, Realtek RTL8812AU
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 100MB free space

### Required Tools

All dependencies are auto-checked and can be installed with `./fluxion.sh -i`:

<details>
<summary><b>Click to expand full dependency list</b></summary>

| Tool | Package | Purpose |
|------|---------|---------|
| `aircrack-ng` | aircrack-ng | WPA cracking & verification |
| `airodump-ng` | aircrack-ng | Packet capture & scanning |
| `aireplay-ng` | aircrack-ng | Deauthentication |
| `airmon-ng` | aircrack-ng | Monitor mode management |
| `mdk4` | mdk4 | Advanced deauthentication |
| `hostapd` | hostapd | Access point creation |
| `lighttpd` | lighttpd | Web server for portal |
| `php-cgi` | php-cgi | PHP processing |
| `dhcpd` | isc-dhcp-server | DHCP for rogue network |
| `dsniff` | dsniff | DNS spoofing |
| `nmap` | nmap | Network scanning |
| `macchanger` | macchanger | MAC address spoofing |
| `iw` | iw | Wireless interface config |
| `openssl` | openssl | SSL certificate generation |
| `cowpatty` | cowpatty | WPA hash verification |
| `curl` | curl | Update checking |
| `xterm` | xterm | Terminal windows (GUI mode) |
| `bc` | bc | Window size calculations |
| `rfkill` | rfkill | Radio frequency management |
| `7zr` | p7zip | Archive handling |
| `unzip` | unzip | Archive extraction |
| `route` | net-tools | Network routing |
| `fuser` | psmisc | Port management |
| `killall` | psmisc | Process management |

**Optional:**
| Tool | Package | Purpose |
|------|---------|---------|
| `pyrit` | pyrit | GPU-accelerated WPA cracking |
| `tmux` | tmux | Required for headless mode |
| `scapy` | python3-scapy | Custom deauth (deauth-ng.py) |

</details>

---

## Installation

### Quick Install (Kali Linux)

```bash
# Clone the repository
git clone https://github.com/FluxionNetwork/fluxion.git fluxion-ng
cd fluxion-ng

# Install dependencies and run
sudo ./fluxion.sh -i
```

### Detailed Install

```bash
# 1. Clone the repository
git clone https://github.com/FluxionNetwork/fluxion.git fluxion-ng

# 2. Enter directory
cd fluxion-ng

# 3. Check and install dependencies
sudo ./fluxion.sh -i

# 4. Run Fluxion-NG
sudo ./fluxion.sh
```

### Arch Linux / BlackArch

```bash
# From BlackArch repository
sudo pacman -S fluxion

# Or build from source
cd bin/arch
makepkg -si
```

### Verify Installation

```bash
# Check version
sudo ./fluxion.sh -v

# Run diagnostics
sudo bash scripts/diagnostics.sh
```

---

## Quick Start Guide

### Step-by-Step Walkthrough

**1. Launch Fluxion-NG**
```bash
sudo ./fluxion.sh
```

**2. Select Your Language**
```
[*] Select your language
  [1] en / English
  [2] es / Espanol
  [3] fr / Francais
  ...
```

**3. Choose Attack Type**
```
  [1] Captive Portal    - Rogue AP with phishing portal
  [2] Handshake Snooper - Capture WPA handshake only
```

**4. Select Wireless Interface**
> Your wireless adapter will be listed. Interfaces in monitor mode appear green.

**5. Scan for Networks**
```
  [1] All channels (2.4GHz)     - Most common
  [2] All channels (5GHz)       - For 5GHz networks
  [3] All channels (Both)       - Comprehensive scan
  [4] Specific channel(s)       - Targeted scan
```
> A scanner window opens. Press `Ctrl+C` when you see your target.

**6. Select Target Network**
> Networks are listed with signal quality, client count, channel, and vendor.
> Green entries have connected clients (better success chance).

**7. Configure Attack Options**
> Follow the prompts to select:
> - Deauth method (mdk4 recommended)
> - AP service (hostapd recommended)
> - Hash verification method
> - SSL certificate (optional)
> - Portal template
> - Connectivity mode

**8. Monitor the Attack**
> Multiple windows show real-time status:
> - AP service status
> - DHCP client connections
> - DNS queries
> - Web server access log
> - Password attempts and verification
> - Deauth activity

**9. Password Captured!**
> When a valid password is submitted, the attack auto-terminates and the password is saved to the log file.

---

## Usage & Options

```
Usage: sudo ./fluxion.sh [options] [-- attack-options]

DISPLAY OPTIONS:
  -v, --version              Show version and exit
  -h, --help                 Show detailed help page

MODE OPTIONS:
  -d, --debug                Enable debug mode (verbose logging)
  --debug-log <path>         Custom debug log file path
  --auto                     Auto mode (minimal user interaction)
  --headless, --no-xterm     Run without X11 (uses tmux)

WIRELESS OPTIONS:
  -k, --killer               Kill interfering processes (NetworkManager, etc.)
  -5, --5ghz                 Enable 5GHz band scanning support
  -r, --reloader             Reload wireless drivers before use
  -n, --airmon-ng            Use airmon-ng for interface management

TARGET OPTIONS:
  -b, --bssid <MAC>          Pre-select target by BSSID
  -e, --essid <SSID>         Pre-select target by ESSID
  -c, --channel <CH>         Specify channel(s) to scan

CONFIGURATION:
  -l, --language <code>      Set language (en, es, fr, de, etc.)
  -a, --attack <name>        Select attack directly
  -i, --install              Check/install dependencies only
  --ratio <number>           Window size ratio (default: 4)
  --skip-dependencies        Skip dependency verification
```

### Examples

```bash
# Basic usage - interactive mode
sudo ./fluxion.sh

# Auto mode with debug logging
sudo ./fluxion.sh --auto -d

# Target specific network on channel 6
sudo ./fluxion.sh -b AA:BB:CC:DD:EE:FF -c 6

# Headless mode (no GUI, uses tmux)
sudo ./fluxion.sh --headless

# Spanish language, kill interfering processes
sudo ./fluxion.sh -l es -k

# 5GHz support enabled with debug
sudo ./fluxion.sh -5 -d --debug-log /tmp/fluxion-debug.log

# Install dependencies only
sudo ./fluxion.sh -i
```

---

## Attack Modules

### Handshake Snooper

Captures the WPA/WPA2 4-way handshake from a target access point.

```
Process:
  1. Put interface in monitor mode on target channel
  2. Start airodump-ng to capture packets
  3. Deauthenticate clients (forces reconnection)
  4. Capture handshake during reconnection
  5. Verify handshake integrity
  6. Save to attacks/Handshake Snooper/handshakes/
```

**Configuration Options:**
- Deauth method: mdk4 or aireplay-ng
- Verification: aircrack-ng, cowpatty, or pyrit
- Verification interval: periodic or continuous
- Verification mode: blocking or non-blocking

### Captive Portal

Creates a rogue access point with a convincing login portal.

```
Architecture:
  ┌─────────────────────────────────────────────┐
  │              Captive Portal Attack           │
  │                                              │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
  │  │ hostapd  │  │  dhcpd   │  │ lighttpd │  │
  │  │ Rogue AP │  │   DHCP   │  │ Web Srvr │  │
  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
  │       │              │              │        │
  │       v              v              v        │
  │  ┌──────────────────────────────────────┐   │
  │  │        Rogue Network (192.169.254.x) │   │
  │  └──────────────────────────────────────┘   │
  │       │              │              │        │
  │  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  │
  │  │ dnsspoof │  │ iptables │  │ php-cgi  │  │
  │  │ DNS Spf  │  │   NAT    │  │ Auth Chk │  │
  │  └──────────┘  └──────────┘  └──────────┘  │
  │                                              │
  │  ┌──────────┐                ┌──────────┐   │
  │  │ mdk4 /   │                │ Tracker  │   │
  │  │ aireplay │                │ (Ch.Mon) │   │
  │  │ Deauth   │                │          │   │
  │  └──────────┘                └──────────┘   │
  └─────────────────────────────────────────────┘
```

**Portal Templates Available:**
- Generic portal (24 languages)
- ARRIS router portal
- Custom templates (add your own in `attacks/Captive Portal/sites/`)

---

## Headless Mode (No VM/GUI)

Fluxion-NG can run without X11 or xterm using **headless mode**. This is ideal for:

- Running over SSH connections
- Systems without a display server
- Docker containers
- Lightweight VMs without GUI

### How to Use

```bash
# Launch in headless mode
sudo ./fluxion.sh --headless

# Or equivalently
sudo ./fluxion.sh --no-xterm
```

### Requirements for Headless Mode

- `tmux` must be installed: `sudo apt install tmux`
- Terminal must support ANSI colors
- All other dependencies remain the same

### How It Works

In headless mode, Fluxion-NG replaces xterm windows with tmux panes:

```
┌─────────────────┬─────────────────┐
│ AP Service      │ Authenticator   │
│ (hostapd)       │ (monitor)       │
├─────────────────┼─────────────────┤
│ DHCP Service    │ Jammer Service  │
│ (dhcpd)         │ (mdk4/aireplay) │
├─────────────────┼─────────────────┤
│ DNS Service     │ Web Service     │
│ (dnsspoof)      │ (lighttpd log)  │
└─────────────────┴─────────────────┘
```

---

## Supported Languages

Fluxion-NG supports **21+ languages** for both the main interface and captive portal pages:

| Code | Language | Code | Language |
|------|----------|------|----------|
| `en` | English | `it` | Italiano |
| `es` | Espanol | `nl` | Nederlands |
| `fr` | Francais | `pl` | Polski |
| `de` | Deutsch | `ro` | Romana |
| `pt-br` | Portugues (BR) | `sk` | Slovensky |
| `ru` | Russkiy | `sl` | Slovenscina |
| `zh` | Zhongwen | `tur` | Turkce |
| `ar` | Arabic | `cs` | Cestina |
| `el` | Ellinika | `hu` | Magyar |
| `id` | Indonesian | `bg` | Bulgarian |
| `sr` | Serbian | | |

### Adding a New Language

1. Copy `language/en.sh` to `language/<code>.sh`
2. Translate all strings
3. Add attack-specific translations in `attacks/*/language/<code>.sh`
4. For captive portal text, add `attacks/Captive Portal/generic/languages/<code>.lang`

---

## Troubleshooting

<details>
<summary><b>Wireless interface not detected</b></summary>

- Ensure your adapter supports monitor mode
- Try: `sudo airmon-ng check kill` then re-run
- Check with: `iwconfig` or `iw dev`
- USB adapters: verify with `lsusb`
- Use `-r` flag to reload drivers: `sudo ./fluxion.sh -r`
</details>

<details>
<summary><b>Handshake capture fails</b></summary>

- Ensure clients are connected to the target AP
- Try different deauth methods (mdk4 vs aireplay-ng)
- Move closer to the target AP
- Try a longer capture duration
- Verify your adapter supports packet injection: `aireplay-ng --test <interface>`
</details>

<details>
<summary><b>Captive portal not loading on client devices</b></summary>

- Try enabling "Emulated" connectivity mode
- Ensure DNS spoofing is working (check DNS service window)
- Some devices may cache DNS - client needs to reconnect
- iOS devices: portal should auto-popup; Android: open browser
- Try disabling SSL if clients show certificate warnings
</details>

<details>
<summary><b>Dependencies won't install</b></summary>

- Run with install flag: `sudo ./fluxion.sh -i`
- Manual install: `sudo apt update && sudo apt install <package>`
- Check package manager logs: `/tmp/fluxspace/package_manager.log`
</details>

<details>
<summary><b>"No X display" error</b></summary>

- If running over SSH: use `--headless` flag
- If on desktop: ensure X11 is running (`echo $DISPLAY`)
- Try: `export DISPLAY=:0` then re-run
</details>

<details>
<summary><b>Network manager interferes</b></summary>

- Use `-k` flag to auto-kill interfering processes
- Or manually: `sudo systemctl stop NetworkManager`
- Re-enable after: `sudo systemctl start NetworkManager`
</details>

---

## Project Structure

```
fluxion-ng/
├── fluxion.sh                  # Main entry point
├── lib/                        # Core libraries
│   ├── ColorUtils.sh           # Terminal colors
│   ├── FormatUtils.sh          # Text formatting
│   ├── IOUtils.sh              # User I/O
│   ├── InterfaceUtils.sh       # WiFi interface management
│   ├── HashUtils.sh            # Handshake verification
│   ├── SandboxUtils.sh         # Safe file operations
│   ├── ArrayUtils.sh           # Array helpers
│   ├── ChipsetUtils.sh         # Chipset checks
│   ├── HelpUtils.sh            # Help text
│   ├── ap/                     # AP service backends
│   │   ├── hostapd.sh
│   │   └── airbase-ng.sh
│   └── installer/              # Dependency management
│       ├── InstallerUtils.sh
│       └── managers/           # Package manager adapters
├── attacks/
│   ├── Captive Portal/         # Captive portal attack
│   │   ├── attack.sh
│   │   ├── deauth-ng.py        # Custom deauth tool
│   │   ├── lib/                # PHP auth scripts
│   │   ├── generic/            # Generic portal templates
│   │   └── sites/              # Custom portal templates
│   └── Handshake Snooper/      # Handshake capture attack
│       ├── attack.sh
│       └── handshakes/         # Saved handshakes
├── language/                   # 21+ language files
├── scripts/                    # Utility scripts
└── preferences/                # User configuration
```

---

## Contributing

All contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Follow** the existing code style (bash conventions, variable naming)
4. **Test** your changes on Kali Linux
5. **Submit** a pull request with clear description

### Code Style

- Use `[[ ]]` for conditionals (bash-specific features OK)
- Quote all variables: `"$variable"` not `$variable`
- Use `$(command)` not backticks
- Add error handling for all external commands
- No `eval` unless absolutely necessary and properly sanitized

---

## Credits

| Contributor | Role |
|------------|------|
| **FluxionNetwork** | Project maintainers |
| **Cyberfee** | Fluxion-NG development |
| **l3op** | Core contributor |
| **dlinkproto** | Core contributor |
| **vk496** | Original linset developer |
| **Derv82** | Wifite inspiration |
| **MPX4132** | Fluxion V3 architecture |
| **usama7628674** | Contributor |
| **cjb900** | Moderator |

---

## Disclaimer

> **This tool is for authorized security testing and educational purposes only.**

- Using Fluxion-NG against networks without explicit written authorization is **illegal** in most jurisdictions.
- Authors assume **no liability** for misuse or damage caused by this tool.
- It is the end user's responsibility to comply with all applicable local, state, and federal laws.
- The authors **do not** endorse illegal activity.

### Legal Notice

- Logos under `/attacks/Captive Portal/sites/` are property of their respective owners. Usage falls under Section 107 of the Copyright Act 1976 ("fair use").
- Beware of sites pretending to be affiliated with Fluxion — they may distribute malware.

---

## Additional Notes

- **WiFi Adapter Compatibility:** For RTL8188EUS (WN722n V2/V3), see [rtl8188eus driver](https://github.com/aircrack-ng/rtl8188eus)
- **WSL/WSL2:** Not supported (no wireless interface access)
- **Tested on:** Kali Linux 2025.4, Parrot Security 6.x, Ubuntu 24.04

---

<p align="center">
  <b>Fluxion-NG</b> - Next Generation WiFi Security Auditing<br>
  <a href="https://github.com/FluxionNetwork/fluxion/issues">Report Issues</a> |
  <a href="https://discord.gg/G43gptk">Discord Community</a>
</p>
