#!/bin/bash
# identifier: Captive Portal
# description: Crea un punto di accesso "gemello cattivo".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Select an interface for the captive portal."
CaptivePortalStartingInterfaceNotice="Starting captive portal interface..."
CaptivePortalCannotStartInterfaceError="${CRed}Unable to start captive portal interface$CClr, returning!"
CaptivePortalStartedInterfaceNotice="${CGrn}Success${CClr}, captive portal interface ready!"
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
CaptivePortalCertificateSourceQuery="Seleziona il certificato SSL"
CaptivePortalCertificateSourceGenerateOption="Crea il certificato SSL"
CaptivePortalCertificateSourceRescanOption="Identifica il certificato SSL (${CClr}cerca ancora$CGry)"
CaptivePortalUIQuery="Seleziona l'intefaccia del Portale di Cattura"
CaptivePortalGenericInterfaceOption="Portale Generico"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
