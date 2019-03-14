#!/usr/bin/env bash
# identifier: Portail Captif
# description: Crée un point d'accès «jumeau malveillant».

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Select an interface for jamming."
CaptivePortalAccessPointInterfaceQuery="Select an interface for the access point."
CaptivePortalCannotStartInterfaceError="${CRed}Incapable de lancer une interface de portail captif$CClr, retour arrière !"
CaptivePortalStaringAPServiceNotice=" Lancement du service de point d'accès du portail captif..."
CaptivePortalStaringAPRoutesNotice="Lancement des routes du portail captif de point d'accès..."
CaptivePortalStartingDHCPServiceNotice="Lancement du service DHCP de point d'accès comme daemon..."
CaptivePortalStartingDNSServiceNotice="Lancement du service DNS de point d'accès comme daemon..."
CaptivePortalStartingWebServiceNotice="Lancement du portail captif de point d'accès comme daemon..."
CaptivePortalStartingJammerServiceNotice="Lancement de l'interrupteur de point d'accès comme daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Lancement du script d'authentification..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Select an access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="METHODE DE VÉRIFICATION DU MOT DE PASSE"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Sélectionnez le certificat SSL source pour le portail captif."
CaptivePortalCertificateSourceGenerateOption="Créer un certificat SSL"
CaptivePortalCertificateSourceRescanOption="Détecter le certificat SSL (${CClr}chercher encore$CGry)"
CaptivePortalCertificateSourceDisabledOption="None (${CYel}disable SSL$CGry)"
CaptivePortalUIQuery="Sélectionnez une interface de portail captif pour le réseau parasite."
CaptivePortalGenericInterfaceOption="Portail générique"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}recommended$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
