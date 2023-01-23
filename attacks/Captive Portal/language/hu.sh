#!/usr/bin/env bash
# identifier: Captive Portal
# description: Creates an "evil twin" access point.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Válassz ki egy interfészt a zavaráshoz."
CaptivePortalAccessPointInterfaceQuery="Válassz ki egy interfészt a hozzáférési ponthoz."
CaptivePortalCannotStartInterfaceError="${CRed}Nem lehetett elindítani a bejelentkező oldal interfészét$CClr, visszalépés!"
CaptivePortalStaringAPServiceNotice="Bejelentkező oldalhoz tartozó hozzáférési pont elindítása..."
CaptivePortalStaringAPRoutesNotice="Bejelentkező oldalhoz tartozó hozzáférési pont útvonalazásának felépítése..."
CaptivePortalStartingDHCPServiceNotice="Hozzáférési ponthoz tartozó DHCP szerver indítása démonként..."
CaptivePortalStartingDNSServiceNotice="Hozzáférési ponthoz tartozó DNS szerver indítása dámonként..."
CaptivePortalStartingWebServiceNotice="Hozzáférési ponthoz tartozó bejelentkező oldal indítása démonként..."
CaptivePortalStartingJammerServiceNotice="Hozzáférési pont zavaró indítása démonként..."
CaptivePortalStartingAuthenticatorServiceNotice="Hitelesítő szkript indítása..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Válassz ki egy hozzáférési pont szolgáltatást"
CaptivePortalAPServiceHostapdOption="Hamisítot hozzáférési pont - hostapd (${CGrn}ajánlott$CClr)"
CaptivePortalAPServiceAirbaseOption="Hamisítot hozzáférési pont - airbase-ng (${CYel}lassú$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Válassz ki egy jelszó ellenőrző metódust"
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (alapértelmezett, ${CYel}megbízhatatlan${CClr})"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Válasszd ki a bejelentkező olhadlhoz tartozó SSL tanúsítványt"
CaptivePortalCertificateSourceGenerateOption="SSL tanúsítvány készításe"
CaptivePortalCertificateSourceRescanOption="SSL tanúsítvány detektálása (${CClr}keresés ismét$CGry)"
CaptivePortalCertificateSourceDisabledOption="Nincs (${CYel}SSL kikapcsolása$CGry)"
CaptivePortalUIQuery="Válassz ki egy bejelentkező oldal interfészt ami a hamis hálózat lesz."
CaptivePortalGenericInterfaceOption="Általános Portál"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Válassz egy internetkapcsolat típust a hamis hálózathoz."
CaptivePortalConnectivityDisconnectedOption="szétkapcsolva (${CGrn}ajánlott$CClr)"
CaptivePortalConnectivityEmulatedOption="emulált"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
