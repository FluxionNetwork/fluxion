#!/usr/bin/env bash
# identifier: Captive Portal
# description: Crea un punto di accesso "gemello cattivo".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Select an interface for jamming."
CaptivePortalAccessPointInterfaceQuery="Select an interface for the access point."
CaptivePortalCannotStartInterfaceError="${CRed}Impossibile avviare il portale interface$CClr, ritorno!"
CaptivePortalStaringAPServiceNotice="Avvio del servizio del Portale di Cattura..."
CaptivePortalStaringAPRoutesNotice="Avvio access point del Portale di Cattura..."
CaptivePortalStartingDHCPServiceNotice="Avvio del servizio DHCP..."
CaptivePortalStartingDNSServiceNotice="Avvio del servizio DNS..."
CaptivePortalStartingWebServiceNotice="Avvio del servizio del Portale WEB..."
CaptivePortalStartingJammerServiceNotice="Avvio del servizio di JAMMING..."
CaptivePortalStartingAuthenticatorServiceNotice="Avvio Script di Autenticazione..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Select an access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="MODALITA' DI VERIFICA DELLA PASSWORD"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Seleziona il certificato SSL."
CaptivePortalCertificateSourceGenerateOption="Crea il certificato SSL"
CaptivePortalCertificateSourceRescanOption="Identifica il certificato SSL (${CClr}cerca ancora$CGry)"
CaptivePortalCertificateSourceDisabledOption="Nessuno (${CYel}disabilita SSL$CGry)"
CaptivePortalUIQuery="Seleziona l'intefaccia del Portale di Cattura."
CaptivePortalGenericInterfaceOption="Portale Generico"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Seleziona una conettività internet per il punto di accesso cattivo."
CaptivePortalConnectivityDisconnectedOption="disconnesso (${CGrn}raccomandato$CClr)"
CaptivePortalConnectivityEmulatedOption="emulato"
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
