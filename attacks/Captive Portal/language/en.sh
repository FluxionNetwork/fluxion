#!/usr/bin/env bash
# identifier: Captive Portal
# description: Creates an "evil twin" access point.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Select an interface for jamming."
CaptivePortalAccessPointInterfaceQuery="Select an interface for the access point."
CaptivePortalCannotStartInterfaceError="${CRed}Unable to start captive portal interface$CClr, returning!"
CaptivePortalStaringAPServiceNotice="Starting Captive Portal access point service..."
CaptivePortalStaringAPRoutesNotice="Starting Captive Portal access point routes..."
CaptivePortalStartingDHCPServiceNotice="Starting access point DHCP service as daemon..."
CaptivePortalStartingDNSServiceNotice="Starting access point DNS service as daemon..."
CaptivePortalStartingWebServiceNotice="Starting access point captive portal as daemon..."
CaptivePortalStartingJammerServiceNotice="Starting access point jammer as daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Starting authenticator script..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Select an access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Select a password verification method"
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}default${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}unreliable${CClr})"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Select SSL certificate source for captive portal."
CaptivePortalCertificateSourceGenerateOption="Create an SSL certificate"
CaptivePortalCertificateSourceRescanOption="Detect SSL certificate (${CClr}search again$CGry)"
CaptivePortalCertificateSourceDisabledOption="None (${CYel}disable SSL$CGry)"
CaptivePortalUIQuery="Select a captive portal interface for the rogue network."
CaptivePortalGenericInterfaceOption="Generic Portal"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}recommended$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
