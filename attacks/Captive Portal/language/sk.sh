#!/usr/bin/env bash
# identifier: Captive Portal
# description: Vytvorí prístupový bod "zlé dvojča"

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Select an interface for jamming."
CaptivePortalAccessPointInterfaceQuery="Select an interface for the access point."
CaptivePortalCannotStartInterfaceError="${CRed}Nepodarilo sa spustiť adaptér 'Captive Portal' $CClr, vraciam sa!"
CaptivePortalStaringAPServiceNotice="Spúšťam službu 'Captive Portal' prístupového bodu..."
CaptivePortalStaringAPRoutesNotice="Spúšťam smerovanie 'Captive Portal' prístupového bodu..."
CaptivePortalStartingDHCPServiceNotice="Spúšťam službu DHCP prístupového bodu ako 'daemon'..."
CaptivePortalStartingDNSServiceNotice="Spúšťam službu DNS prístupového bodu ako 'daemon'..."
CaptivePortalStartingWebServiceNotice="Spúšťam 'Captive Portal' prístupového bodu ako 'daemon'..."
CaptivePortalStartingJammerServiceNotice="Spúšťam blokovanie prístupového bodu ako 'daemon'..."
CaptivePortalStartingAuthenticatorServiceNotice="Spúšťam autentifikačný skript..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Select an access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Vyberte spôsob overenia hesla"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Vyberte SSL certifikát pre 'Captive Portal'."
CaptivePortalCertificateSourceGenerateOption="Vytvoriť SSL certifikát."
CaptivePortalCertificateSourceRescanOption="Detekovať SSL certifikát (${CClr}hľadať znovu$CGry)"
CaptivePortalCertificateSourceDisabledOption="None (${CYel}disable SSL$CGry)"
CaptivePortalUIQuery="Vyberte 'Captive Portal' adaptér pre falošnú sieť (rogue network)."
CaptivePortalGenericInterfaceOption="Všeobecný Portál (generic portal)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}recommended$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
