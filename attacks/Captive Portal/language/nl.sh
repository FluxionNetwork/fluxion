#!/usr/bin/env bash
# identifier: Captive Portal
# description: Creates an "evil twin" access point.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Selecteer een interface voor jamming."
CaptivePortalAccessPointInterfaceQuery="Selecteer een interface voor het access point."
CaptivePortalCannotStartInterfaceError="${CRed}Niet mogelijk om captive portal interface te starten$CClr, ga terug!"
CaptivePortalStaringAPServiceNotice="Starten van Captive Portal access point service..."
CaptivePortalStaringAPRoutesNotice="Starten van Captive Portal access point routes..."
CaptivePortalStartingDHCPServiceNotice="Starten van access point DHCP service als daemon..."
CaptivePortalStartingDNSServiceNotice="Starten van access point DNS service als daemon..."
CaptivePortalStartingWebServiceNotice="Starten van access point captive portal als daemon..."
CaptivePortalStartingJammerServiceNotice="Starten van access point jammer als daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Starten authenticator script..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Selecteer een access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}aangeraden$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}traag$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Selecteer een wachtwoord verificatie methode"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Selecteer een SSL certificaat bron voor captive portal."
CaptivePortalCertificateSourceGenerateOption="Creeer een SSL certificaat"
CaptivePortalCertificateSourceRescanOption="Detecteer SSL certificaaat (${CClr}zoek opnieuw$CGry)"
CaptivePortalCertificateSourceDisabledOption="Geen (${CYel}Schakel SSL uit$CGry)"
CaptivePortalUIQuery="Selecteer een captive portal interface voor het rogue network."
CaptivePortalGenericInterfaceOption="Generiek Portaal"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Selecteer eenn internet verbindingstype voor het rogue network."
CaptivePortalConnectivityDisconnectedOption="Verbroken (${CGrn}aangeraden$CClr)"
CaptivePortalConnectivityEmulatedOption="geemuleerd"
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
