#!/usr/bin/env bash
# identifier: Captive Portal
# description: Cria um ponto de acesso "Gêmeo malicioso".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Selecione uma interface para interferência."
CaptivePortalAccessPointInterfaceQuery="Selecione uma interface para o ponto de acesso."
CaptivePortalCannotStartInterfaceError="${CRed}Não foi possível iniciar a interface do captive portal$CClr, retornando!"
CaptivePortalStaringAPServiceNotice="Iniciando serviço de ponto de acesso do captive portal..."
CaptivePortalStaringAPRoutesNotice="Iniciando rotas de ponto de acesso do captive portal..."
CaptivePortalStartingDHCPServiceNotice="Iniciando serviço DHCP do ponto de acesso como daemon..."
CaptivePortalStartingDNSServiceNotice="Iniciando serviço DNS do ponto de acesso como daemon..."
CaptivePortalStartingWebServiceNotice="Iniciando serviço de ponto de acesso captive portal como daemon..."
CaptivePortalStartingJammerServiceNotice="Iniciando serviço de ponto de acesso de interferência como daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Iniciando script de autenticação..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Selecione um serviço de ponto de acesso"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recomendado$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}lento$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Selecione um método de verificação de senha"
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (padrão, ${CYel}inconfiável${CClr})"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Selecione a fonte de certificado SSL para o captive portal."
CaptivePortalCertificateSourceGenerateOption="Criar um certificado SSL"
CaptivePortalCertificateSourceRescanOption="Detectar certificado SSL (${CClr}pesquisar novamente$CGry)"
CaptivePortalCertificateSourceDisabledOption="Nenhum (${CYel}desabilitar SSL$CGry)"
CaptivePortalUIQuery="Selecione uma interface de captive portal para a rede falsa."
CaptivePortalGenericInterfaceOption="Portal Genérico"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Selecione um tipo de conexão de internet para a rede falsa."
CaptivePortalConnectivityDisconnectedOption="desconectado (${CGrn}recomendado$CClr)"
CaptivePortalConnectivityEmulatedOption="emulado"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
