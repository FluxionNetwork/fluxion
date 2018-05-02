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

# FLUXSCRIPT END
