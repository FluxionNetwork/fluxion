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

# FLUXSCRIPT END
