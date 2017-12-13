#!/bin/bash
# identifier: Gefangenes Portal
# description: Erstellt einen "bösen Zwilling" Zugangspunkt.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Wähle die Netzwerkkarte für den AP"
CaptivePortalStartingInterfaceNotice="Starte den Hotspot"
CaptivePortalCannotStartInterfaceError="${CRed}Es ist nicht möglich den AP zu starten$CClr, rückkehr!"
CaptivePortalStartedInterfaceNotice="${CGrn}Erfolgreich${CClr}, Netzwerkkarte ist im AP Modus"
CaptivePortalStaringAPServiceNotice="Starte AP Service"
CaptivePortalStaringAPRoutesNotice="Starte den routing Service "
CaptivePortalStartingDHCPServiceNotice="Starte den DHCP Service"
CaptivePortalStartingDNSServiceNotice="Starte den DNS Service."
CaptivePortalStartingWebServiceNotice="Starte den AP"
CaptivePortalStartingJammerServiceNotice="Starte mdk3 als Service"
CaptivePortalStartingAuthenticatorServiceNotice="Authentifizierungsskript wird gestartet"
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
