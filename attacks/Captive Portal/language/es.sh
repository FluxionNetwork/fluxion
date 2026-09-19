#!/usr/bin/env bash
# identifier: Portal Cautivo
# description: Crea un punto de acceso "gemelo malvado".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Seleccione una interaz para realizar jamming."
CaptivePortalAccessPointInterfaceQuery="Selecccione una interfaz para el punto de acceso."
CaptivePortalCannotStartInterfaceError="${CRed}Imposible iniciar un portal de captura para la interfaz $CClr, cancelando!"
CaptivePortalStaringAPServiceNotice="Iniciando un servicio de Portal de Captura..."
CaptivePortalStaringAPRoutesNotice="Iniciando un Portal de Captura como punto de acceso..."
CaptivePortalStartingDHCPServiceNotice="Iniciando un portal de acceso servicio DHCP como proceso..."
CaptivePortalStartingDNSServiceNotice="Iniciando un portal de acceso DNS como proceso..."
CaptivePortalStartingWebServiceNotice="Iniciando un portal de acceso como ..."
CaptivePortalStartingJammerServiceNotice="Iniciando un porta de acceso jammer como servicio..."
CaptivePortalStartingAuthenticatorServiceNotice="Iniciando script de autencticación..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Seleccione un punto de acceso como proceso"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="MÉTODO PARA VERIFICAR CONTRASEÑA"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Seleccione ruta del certificado SSL para el portal de acceso"
CaptivePortalCertificateSourceGenerateOption="Crear un certificado SSL"
CaptivePortalCertificateSourceRescanOption="Detectar un certifacdo SSL (${CClr}buscando $CGry)"
CaptivePortalCertificateSourceDisabledOption="Ningún (${CYel} SSL Certifcado$CGry)"
CaptivePortalUIQuery="Seleccione una interfaz para el portal de captura"
CaptivePortalGenericInterfaceOption="Portal genérica"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Selecciona una conexión a internet para la suplantación de red."
CaptivePortalConnectivityDisconnectedOption="Desconexión (${CGrn}recomendado$CClr)"
CaptivePortalConnectivityEmulatedOption="Emulado"
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
