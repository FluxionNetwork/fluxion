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
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}alapértelmezett${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}megbízhatatlan${CClr})"
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

# FLUXSCRIPT END
