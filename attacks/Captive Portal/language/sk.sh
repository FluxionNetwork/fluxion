#!/bin/bash
# identifier: Captive Portal
# description: Vytvorí prístupový bod "zlé dvojča"

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Vyberte adaptér pre 'captive portal'."
CaptivePortalStartingInterfaceNotice="Spúšťam 'captive portal'..."
CaptivePortalCannotStartInterfaceError="${CRed}Nepodarilo sa spustiť adaptér 'captive portal' $CClr, vraciam sa!"
CaptivePortalStartedInterfaceNotice="${CGrn}Success${CClr}, 'captive portal' adaptér pripravený!"
CaptivePortalStaringAPServiceNotice="Spúšťam službu 'Captive Portal' prístupového bodu..."
CaptivePortalStaringAPRoutesNotice="Spúšťam smerovanie 'Captive Portal' prístupového bodu..."
CaptivePortalStartingDHCPServiceNotice="Spúšťam službu DHCP prístupového bodu ako 'daemon'..."
CaptivePortalStartingDNSServiceNotice="Spúšťam službu DNS prístupového bodu ako 'daemon'..."
CaptivePortalStartingWebServiceNotice="Spúšťam 'captive portal' prístupového bodu ako 'daemon'..."
CaptivePortalStartingJammerServiceNotice="Spúšťam blokovanie prístupového bodu ako 'daemon'..."
CaptivePortalStartingAuthenticatorServiceNotice="Spúšťam autentifikačný skript..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Vyberte spôsob overenia hesla"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Vyberte SSL certifikát pre 'captive portal'"
CaptivePortalCertificateSourceGenerateOption="Vytvoriť SSL certifikát"
CaptivePortalCertificateSourceRescanOption="Detekovať SSL certifikát (${CClr}hľadať znovu$CGry)"
CaptivePortalUIQuery="Vyberte 'captive portal' adaptér pre falošnú sieť (rogue network)"
CaptivePortalGenericInterfaceOption="Všeobecný Portál (generic portal)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END 
