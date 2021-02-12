#!/usr/bin/env bash
# identifier: Portal Cautivo
# description: Crea un punto de acceso "gemelo malvado".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Selecciones una interaz para realizar jamming."
CaptivePortalAccessPointInterfaceQuery="Sleccciones una interfaz para el punto de acceso."
CaptivePortalCannotStartInterfaceError="${CRed}Imposible iniciar una portal de captura para la interfaz $CClr, cancelando!"
CaptivePortalStaringAPServiceNotice="Iniciando un servicio de Portal de Captura..."
CaptivePortalStaringAPRoutesNotice="Inciando un Portal de Caputara como punto de acceso..."
CaptivePortalStartingDHCPServiceNotice="Iniciando un portal de acceso servicio DHCPP como proceso..."
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
CaptivePortalUIQuery="Selecciones a una interfaz para el portal de captura"
CaptivePortalGenericInterfaceOption="Portal genérica"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Selecciona una conexión a internet para la suplantación de red."
CaptivePortalConnectivityDisconnectedOption="Desconexión (${CGrn}recomendado$CClr)"
CaptivePortalConnectivityEmulatedOption="Emulado"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
