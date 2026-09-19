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

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# English fallbacks (auto-added; translate when possible)
CaptivePortalAPChannelQuery="Select the rogue access point's channel"
CaptivePortalAPChannelTargetOption="Same as target (${CGrn}recommended$CClr)"
CaptivePortalAPChannelCustomOption="Custom channel (${CYel}different band$CClr)"
CaptivePortalAPChannelCustomNotice="Enter a channel for the rogue access point."
CaptivePortalAPChannelExampleTip="Example channel"
CaptivePortalAPChannelBandsTip="Interface supports"
CaptivePortalAPChannelInvalidError="${CRed}Invalid channel or unsupported by the access point interface$CClr, try again."
CaptivePortalAPChannelSharedRadioWarning="${CYel}Warning$CClr: jammer and access point share one radio; a single card cannot cover both bands at once. Use a second interface."
CaptivePortalAPChannelUnsupportedWarning="${CRed}The access point interface can't host on the target's band$CClr, pick a ${CGrn}custom channel$CClr on a band it supports."
CaptivePortalAPChannelUnsupportedAutoError="The access point interface can't host on the requested channel's band. Pass --ap-channel with a supported channel, or select a different --ap-interface."
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}default${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}unreliable${CClr})"

# FLUXSCRIPT END
