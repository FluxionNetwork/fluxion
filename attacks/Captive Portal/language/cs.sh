#!/usr/bin/env bash
# identifier: Captive Portal
# description: Vytvoří přístupový bod "Evil Twin".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Vyberte rozhraní pro rušení."
CaptivePortalAccessPointInterfaceQuery="Vyberte rozhraní pro přístupový bod."
CaptivePortalCannotStartInterfaceError="${CRed}Nebylo možné spustit rozhraní Captive Portalu$CClr, vracím se!"
CaptivePortalStaringAPServiceNotice="Spouštím službu Captive Portal přístupového bodu..."
CaptivePortalStaringAPRoutesNotice="Spouštím cesty pro Captive Portal přístupového bodu..."
CaptivePortalStartingDHCPServiceNotice="Spouštím službu DHCP přístupového bodu jako daemon..."
CaptivePortalStartingDNSServiceNotice="Spouštím službu DNS přístupového bodu jako daemon..."
CaptivePortalStartingWebServiceNotice="Spouštím Captive Portal přístupového bodu jako daemon..."
CaptivePortalStartingJammerServiceNotice="Spouštím rušení přístupového bodu jako daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Spouštím skript autentizátoru..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Vyberte typ služby přístupového bodu"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}doporučeno$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}pomalé$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="METHODA ZÍSKÁNÍ HESLA"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Vyberte zdroj SSL certifikátu pro Captive Portal."
CaptivePortalCertificateSourceGenerateOption="Vytvořit SSL certifikát"
CaptivePortalCertificateSourceRescanOption="Zjistit SSL certifikát (${CClr}hledat znovu$CGry)"
CaptivePortalCertificateSourceDisabledOption="Žádný (${CYel}zakázat SSL$CGry)"
CaptivePortalUIQuery="Select a captive portal interface for the rogue network."
CaptivePortalGenericInterfaceOption="Generic Portal"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}doporučeno$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
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
