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
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}padrão${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}inconfiável${CClr})"
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
