#!/bin/bash
# identifier: Captive Portal
# description: Vytvorí prístupový bod "zlé dvojča"

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Vyberte adaptér pre 'Captive Portal'."
CaptivePortalStartingInterfaceNotice="Spúšťam 'Captive Portal'..."
CaptivePortalCannotStartInterfaceError="${CRed}Nepodarilo sa spustiť adaptér 'Captive Portal' $CClr, vraciam sa!"
CaptivePortalStartedInterfaceNotice="${CGrn}Success${CClr}, 'Captive Portal' adaptér pripravený!"
CaptivePortalStaringAPServiceNotice="Spúšťam službu 'Captive Portal' prístupového bodu..."
CaptivePortalStaringAPRoutesNotice="Spúšťam smerovanie 'Captive Portal' prístupového bodu..."
CaptivePortalStartingDHCPServiceNotice="Spúšťam službu DHCP prístupového bodu ako 'daemon'..."
CaptivePortalStartingDNSServiceNotice="Spúšťam službu DNS prístupového bodu ako 'daemon'..."
CaptivePortalStartingWebServiceNotice="Spúšťam 'Captive Portal' prístupového bodu ako 'daemon'..."
CaptivePortalStartingJammerServiceNotice="Spúšťam blokovanie prístupového bodu ako 'daemon'..."
CaptivePortalStartingAuthenticatorServiceNotice="Spúšťam autentifikačný skript..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Vyberte spôsob overenia hesla"
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
