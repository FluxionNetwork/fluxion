#!/usr/bin/env bash
# identifier: Gefangenes Portal
# description: Erstellt einen "bösen Zwilling" Zugangspunkt.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Select an interface for jamming."
CaptivePortalAccessPointInterfaceQuery="Select an interface for the access point."
CaptivePortalCannotStartInterfaceError="${CRed}Es ist nicht möglich den AP zu starten$CClr, rückkehr!"
CaptivePortalStaringAPServiceNotice="Starte AP Service"
CaptivePortalStaringAPRoutesNotice="Starte den routing Service "
CaptivePortalStartingDHCPServiceNotice="Starte den DHCP Service"
CaptivePortalStartingDNSServiceNotice="Starte den DNS Service."
CaptivePortalStartingWebServiceNotice="Starte den AP"
CaptivePortalStartingJammerServiceNotice="Starte mdk4/aireplay als Service"
CaptivePortalStartingAuthenticatorServiceNotice="Authentifizierungsskript wird gestartet"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Select an access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Methode zum Prüfen des Handshake"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Wähle die Quelle für das SSL Zertifikat "
CaptivePortalCertificateSourceGenerateOption="Erstelle das SSL Zertifikat"
CaptivePortalCertificateSourceRescanOption="Zertifikat wurde nicht erkannt"
CaptivePortalCertificateSourceDisabledOption="Kein Zertifikat (${CYel}SSL wird deaktiviert $CGry)"
CaptivePortalUIQuery="Wähle Interface für den unechten AP"
CaptivePortalGenericInterfaceOption="Gernerische Router Seiten"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Wähle die Methode für die Internet verbindung"
CaptivePortalConnectivityDisconnectedOption="Getrennt (${CGrn}Emfohlen$CClr)"
CaptivePortalConnectivityEmulatedOption="Emuliert"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
