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

# FLUXSCRIPT END
