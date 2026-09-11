#!/usr/bin/env bash

# Fluxion Diagnostics Script
# Collects system, tool, and wireless adapter information for troubleshooting.
# Usage: sudo bash scripts/diagnostics.sh [wireless_interface]
# If no interface is given, all wireless interfaces are diagnosed.

set -o pipefail

RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BOLD='\033[1m'
RESET='\033[0m'

section() { echo -e "\n${BOLD}=== $1 ===${RESET}"; }
item() { printf "  %-24s %s\n" "$1:" "$2"; }
ok() { echo -e "${GREEN}$1${RESET}"; }
warn() { echo -e "${YELLOW}$1${RESET}"; }
err() { echo -e "${RED}$1${RESET}"; }
cmd_version() {
	local cmd="$1"
	if command -v "$cmd" &>/dev/null; then
		local ver
		ver=$("$cmd" --version 2>&1 | head -1) || ver=$("$cmd" -v 2>&1 | head -1) || ver="(installed)"
		item "$cmd" "$ver"
	else
		item "$cmd" "$(err 'NOT FOUND')"
	fi
}

# Resolve fluxion root directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../fluxion.sh" ]; then
	FLUXION_ROOT="$SCRIPT_DIR/.."
elif [ -f "./fluxion.sh" ]; then
	FLUXION_ROOT="."
else
	echo "Error: cannot find fluxion.sh. Run from the fluxion directory or scripts/." >&2
	exit 1
fi

# Source interface utilities if available.
HAS_IFACE_UTILS=0
if source "$FLUXION_ROOT/lib/InterfaceUtils.sh" 2>/dev/null; then
	HAS_IFACE_UTILS=1
fi

# ── Fluxion ──────────────────────────────────────────────────────────────────
section "Fluxion"
fluxion_version=$(grep -oP 'FLUXIONVersion=\K[0-9]+' "$FLUXION_ROOT/fluxion.sh" 2>/dev/null)
fluxion_revision=$(grep -oP 'FLUXIONRevision=\K[0-9]+' "$FLUXION_ROOT/fluxion.sh" 2>/dev/null)
item "Version" "${fluxion_version:-?}.${fluxion_revision:-?}"
item "Path" "$(cd "$FLUXION_ROOT" && pwd)"
if command -v git &>/dev/null && [ -d "$FLUXION_ROOT/.git" ]; then
	item "Git branch" "$(git -C "$FLUXION_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null)"
	item "Git commit" "$(git -C "$FLUXION_ROOT" log -1 --format='%h %s' 2>/dev/null)"
	local_changes=$(git -C "$FLUXION_ROOT" status --porcelain 2>/dev/null | wc -l)
	[ "$local_changes" -gt 0 ] && item "Uncommitted changes" "$(warn "$local_changes file(s)")"
fi

# ── System ───────────────────────────────────────────────────────────────────
section "System"
item "Kernel" "$(uname -r)"
item "OS" "$(. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME" || uname -o)"
item "Arch" "$(uname -m)"
item "Hostname" "$(hostname)"
item "Uptime" "$(uptime -p 2>/dev/null || uptime | sed 's/.*up/up/')"
item "Running as" "$(id -un) (UID $(id -u))"
if [ "$(id -u)" -ne 0 ]; then
	echo "  $(warn 'WARNING: Not running as root. Some checks will be incomplete.')"
fi

# ── Display Environment ─────────────────────────────────────────────────────
section "Display Environment"
if [ -n "$TMUX" ]; then
	item "Inside tmux" "yes ($(tmux display-message -p '#{session_name}' 2>/dev/null))"
	item "tmux version" "$(tmux -V 2>/dev/null)"
else
	item "Inside tmux" "no"
	cmd_version tmux
fi
if [ -n "$DISPLAY" ]; then
	item "DISPLAY" "$DISPLAY"
	if command -v xdpyinfo &>/dev/null; then
		item "X11 server" "$(xdpyinfo 2>/dev/null | grep 'vendor string' | sed 's/.*: *//' || echo 'unavailable')"
	fi
	cmd_version xterm
else
	item "DISPLAY" "$(warn 'not set (xterm mode will fail)')"
fi

# ── Dependencies ─────────────────────────────────────────────────────────────
section "Dependencies"
# Core tools in the order they appear in requiredCLITools
for tool in \
	aircrack-ng airodump-ng aireplay-ng airmon-ng \
	hostapd lighttpd php-cgi kea-dhcp4 dnsmasq \
	mdk4 cowpatty iw macchanger rfkill nmap openssl \
	iptables curl bc awk route fuser killall unzip 7zr; do
	cmd_version "$tool"
done

# ── Wireless Interfaces ─────────────────────────────────────────────────────
section "Wireless Interfaces"

# Build interface list: from argument or auto-detect.
if [ -n "$1" ]; then
	ifaces=("$1")
else
	ifaces=()
	for dev in /sys/class/net/*/wireless; do
		[ -e "$dev" ] || continue
		ifaces+=("$(basename "$(dirname "$dev")")")
	done
	# Also pick up monitor-mode interfaces (no wireless/ dir but type monitor).
	for dev in /sys/class/net/*/; do
		iface=$(basename "$dev")
		if iw dev "$iface" info 2>/dev/null | grep -q "type monitor"; then
			# Add if not already in list.
			found=0
			for existing in "${ifaces[@]}"; do [ "$existing" = "$iface" ] && found=1; done
			[ "$found" -eq 0 ] && ifaces+=("$iface")
		fi
	done
fi

if [ ${#ifaces[@]} -eq 0 ]; then
	echo "  $(err 'No wireless interfaces found!')"
else
	for iface in "${ifaces[@]}"; do
		echo -e "\n  ${BOLD}[$iface]${RESET}"
		# Basic info from iw
		iw_info=$(iw dev "$iface" info 2>/dev/null)
		if [ -n "$iw_info" ]; then
			item "  Type" "$(echo "$iw_info" | grep -oP 'type \K\w+' || echo 'unknown')"
			chan=$(echo "$iw_info" | grep -oP 'channel \K[0-9]+' || true)
			freq=$(echo "$iw_info" | grep -oP '\(\K[0-9]+ MHz' || true)
			[ -n "$chan" ] && item "  Channel" "$chan ($freq)"
			txpower=$(echo "$iw_info" | grep -oP 'txpower \K[0-9.]+' || true)
			[ -n "$txpower" ] && item "  TX Power" "${txpower} dBm"
		fi

		# Link state
		link_state=$(cat "/sys/class/net/$iface/operstate" 2>/dev/null || echo "unknown")
		item "  Link state" "$link_state"

		# Driver
		driver=$(readlink "/sys/class/net/$iface/device/driver" 2>/dev/null | xargs basename 2>/dev/null)
		item "  Driver" "${driver:-unknown}"

		# USB/PCI bus info
		devpath=$(readlink -f "/sys/class/net/$iface/device" 2>/dev/null)
		if [[ "$devpath" == */usb* ]]; then
			# Walk up to the USB device directory containing idVendor.
			usbdir="$devpath"
			while [ -n "$usbdir" ] && [ ! -f "$usbdir/idVendor" ]; do
				usbdir="${usbdir%/*}"
			done
			if [ -f "$usbdir/idVendor" ]; then
				usb_id="$(cat "$usbdir/idVendor"):$(cat "$usbdir/idProduct")"
			else
				usb_id="unknown"
			fi
			item "  Bus" "USB ($usb_id)"
		elif [[ "$devpath" == */pci* ]]; then
			item "  Bus" "PCI"
		else
			item "  Bus" "unknown"
		fi

		# Chipset via airmon-ng
		chipset=$(airmon-ng 2>/dev/null | grep -F "$iface" | awk '{for(i=4;i<=NF;i++) printf "%s ", $i; print ""}' | sed 's/ *$//')
		[ -n "$chipset" ] && item "  Chipset" "$chipset"

		# Band support
		if [ "$HAS_IFACE_UTILS" -eq 1 ]; then
			interface_bands "$iface" 2>/dev/null
			item "  Bands" "${InterfaceBands:-unknown}"
		else
			# Fallback: check phy info directly
			phy=$(cat "/sys/class/net/$iface/phy80211/name" 2>/dev/null)
			if [ -n "$phy" ]; then
				bands=""
				iw phy "$phy" info 2>/dev/null | grep -qE "24[0-9]{2}" && bands="2.4GHz"
				iw phy "$phy" info 2>/dev/null | grep -qE "5[0-9]{3}" && { [ -n "$bands" ] && bands="$bands/"; bands="${bands}5GHz"; }
				item "  Bands" "${bands:-unknown}"
			fi
		fi

		# Monitor mode support
		phy=$(cat "/sys/class/net/$iface/phy80211/name" 2>/dev/null)
		if [ -n "$phy" ]; then
			if iw phy "$phy" info 2>/dev/null | grep -q "\* monitor"; then
				item "  Monitor mode" "$(ok 'supported')"
			else
				item "  Monitor mode" "$(err 'NOT supported')"
			fi
			if iw phy "$phy" info 2>/dev/null | grep -q "\* AP"; then
				item "  AP mode" "$(ok 'supported')"
			else
				item "  AP mode" "$(warn 'NOT supported')"
			fi
		fi

		# Injection test (only if root and interface is up)
		if [ "$(id -u)" -eq 0 ] && [ "$link_state" != "down" ]; then
			inj_result=$(timeout 10 aireplay-ng --test "$iface" 2>&1 | grep -oE "Injection is working!|No Answer..." | head -1)
			if [ "$inj_result" = "Injection is working!" ]; then
				item "  Injection" "$(ok 'working')"
			elif [ -n "$inj_result" ]; then
				item "  Injection" "$(err 'FAILED (no answer)')"
			else
				item "  Injection" "$(warn 'test inconclusive')"
			fi
		fi
	done
fi

# ── rfkill ───────────────────────────────────────────────────────────────────
section "RF Kill Status"
if command -v rfkill &>/dev/null; then
	rfkill list 2>/dev/null | while IFS= read -r line; do echo "  $line"; done
else
	echo "  $(warn 'rfkill not found')"
fi

# ── Interfering Processes ────────────────────────────────────────────────────
section "Interfering Processes"
for proc in NetworkManager wpa_supplicant dhclient avahi-daemon; do
	pid=$(pgrep -x "$proc" 2>/dev/null | head -1)
	if [ -n "$pid" ]; then
		item "$proc" "$(warn "running (PID $pid)")"
	else
		item "$proc" "$(ok 'not running')"
	fi
done

# ── Regulatory Domain ───────────────────────────────────────────────────────
section "Regulatory Domain"
if command -v iw &>/dev/null; then
	reg_country=$(iw reg get 2>/dev/null | grep -oP 'country \K\S+' | head -1)
	item "Current domain" "${reg_country:-unknown}"
	# Show DFS status
	dfs_regions=$(iw reg get 2>/dev/null | grep -c "DFS" || true)
	item "DFS channels" "$dfs_regions entries"
else
	echo "  $(warn 'iw not found')"
fi

# ── iptables ─────────────────────────────────────────────────────────────────
section "iptables"
if command -v iptables &>/dev/null && [ "$(id -u)" -eq 0 ]; then
	rules=$(iptables -L -n 2>/dev/null | grep -Ecv '^Chain|^target|^$'; true)
	item "Active rules" "$rules"
	nat_rules=$(iptables -t nat -L -n 2>/dev/null | grep -Ecv '^Chain|^target|^$'; true)
	item "NAT rules" "$nat_rules"
	if [ -f "$FLUXION_ROOT/iptables-rules" ]; then
		item "Backup file" "$(ok 'present')"
	else
		item "Backup file" "not present"
	fi
else
	echo "  $(warn 'Requires root')"
fi

# ── AppArmor ────────────────────────────────────────────────────────────────
section "AppArmor"
if [ -d /etc/apparmor.d ]; then
	if command -v aa-status &>/dev/null && [ "$(id -u)" -eq 0 ]; then
		enforced=$(aa-status 2>/dev/null | grep -oP '\K[0-9]+(?= profiles are in enforce mode)' || echo "?")
		item "Profiles enforced" "$enforced"
	fi
	if [ -f /etc/apparmor.d/usr.sbin.kea-dhcp4 ]; then
		item "kea-dhcp4 profile" "present"
		if [ -f /etc/apparmor.d/local/usr.sbin.kea-dhcp4 ]; then
			if grep -q "fluxspace" /etc/apparmor.d/local/usr.sbin.kea-dhcp4 2>/dev/null; then
				item "kea-dhcp4 fluxspace override" "$(ok 'configured')"
			else
				item "kea-dhcp4 fluxspace override" "$(warn 'file exists but no fluxspace rule')"
			fi
		else
			item "kea-dhcp4 fluxspace override" "$(err 'MISSING — kea-dhcp4 will fail to read /tmp/fluxspace/')"
		fi
	else
		item "kea-dhcp4 profile" "not present (OK)"
	fi
else
	item "AppArmor" "not installed"
fi

# ── lighttpd ─────────────────────────────────────────────────────────────────
section "lighttpd Service"
if command -v systemctl &>/dev/null; then
	lighttpd_active=$(systemctl is-active lighttpd 2>&1) || true
	lighttpd_enabled=$(systemctl is-enabled lighttpd 2>&1) || true
	item "Service active" "${lighttpd_active:-unknown}"
	item "Service enabled" "${lighttpd_enabled:-unknown}"
	if [ "$lighttpd_active" = "active" ]; then
		echo "  $(warn 'WARNING: lighttpd system service is running and will conflict with Captive Portal (port 80)')"
	fi
else
	item "systemctl" "not available"
fi
# Check if port 80 is in use.
if [ "$(id -u)" -eq 0 ] && command -v ss &>/dev/null; then
	port80=$(ss -tlnp 'sport = :80' 2>/dev/null | tail -n +2)
	if [ -n "$port80" ]; then
		item "Port 80" "$(warn "IN USE: $(echo "$port80" | awk '{print $NF}' | head -1)")"
	else
		item "Port 80" "$(ok 'available')"
	fi
fi

# ── Workspace ────────────────────────────────────────────────────────────────
section "Workspace"
workspace="/tmp/fluxspace"
if [ -d "$workspace" ]; then
	item "Path" "$workspace (exists)"
	item "Contents" "$(ls -1 "$workspace" 2>/dev/null | wc -l) items"
	item "Disk usage" "$(du -sh "$workspace" 2>/dev/null | awk '{print $1}')"
else
	item "Path" "$workspace (does not exist)"
fi
tmp_free=$(df -h /tmp 2>/dev/null | tail -1 | awk '{print $4}')
item "/tmp free space" "${tmp_free:-unknown}"

# ── Summary ──────────────────────────────────────────────────────────────────
section "End of Diagnostics"
echo "  Collected at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "  Paste this output when reporting issues."
