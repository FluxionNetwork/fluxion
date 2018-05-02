#!/usr/bin/env bash
# identifier: Captiv Portal
# description: Creează un punct de acces "gemeni rău".

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
CaptivePortalVerificationMethodQuery="METODA PENTRU VERIFICAREA PAROLEI"
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
