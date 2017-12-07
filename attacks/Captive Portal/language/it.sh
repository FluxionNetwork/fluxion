#!/bin/bash
# identifier: Captive Portal
# description: Crea un punto di accesso "gemello cattivo".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Seleziona l'interfaccia per il punto di accesso Cattivo."
CaptivePortalStartingInterfaceNotice="Avvio dell'interfaccia del Portale di Cattura..."
CaptivePortalCannotStartInterfaceError="${CRed}Impossibile avviare il portale interface$CClr, ritorno!"
CaptivePortalStartedInterfaceNotice="${CGrn}Perfetto${CClr}, portale di cattura avviato con successo!"
CaptivePortalStaringAPServiceNotice="Avvio del servizio del Portale di Cattura..."
CaptivePortalStaringAPRoutesNotice="Avvio access point del Portale di Cattura..."
CaptivePortalStartingDHCPServiceNotice="Avvio del servizio DHCP..."
CaptivePortalStartingDNSServiceNotice="Avvio del servizio DNS..."
CaptivePortalStartingWebServiceNotice="Avvio del servizio del Portale WEB..."
CaptivePortalStartingJammerServiceNotice="Avvio del servizio di JAMMING..."
CaptivePortalStartingAuthenticatorServiceNotice="Avvio Script di Autenticazione..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="MODALITA' DI VERIFICA DELLA PASSWORD"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Seleziona il certificato SSL."
CaptivePortalCertificateSourceGenerateOption="Crea il certificato SSL"
CaptivePortalCertificateSourceRescanOption="Identifica il certificato SSL (${CClr}cerca ancora$CGry)"
CaptivePortalCertificateSourceDisabledOption="None (${CYel}disable SSL$CGry)"
CaptivePortalUIQuery="Seleziona l'intefaccia del Portale di Cattura."
CaptivePortalGenericInterfaceOption="Portale Generico"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}recommended$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
