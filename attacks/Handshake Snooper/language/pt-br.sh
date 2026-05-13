#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Recupera hashes de criptografia WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Selecione uma interface para monitoramento & interferência."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Selecione um método de recuperação de handshake"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}passivo$CClr)"
HandshakeSnooperAireplayMethodOption="Desautenticação aireplay-ng (${CRed}agressivo$CClr)"
HandshakeSnooperMdk4MethodOption="Desautenticação mdk4 (${CRed}agressivo$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Quanto tempo o verificador deve checar para um handshake?"
HandshakeSnooperVerifierInterval30SOption="A cada 30 segundos (${CGrn}recomendado${CClr})."
HandshakeSnooperVerifierInterval60SOption="A cada 60 segundos."
HandshakeSnooperVerifierInterval90SOption="A cada 90 segundos."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Como a verificação deve ocorrer?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Assincronamente (${CYel}apenas sistemas rápidos${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Sincronamente (${CGrn}recomendado${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Monitor de Handshake$CClr: serviço de arbitragem em execução."
HandshakeSnooperSnoopingForNSecondsNotice="Monitorando por \$HandshakeSnooperVerifierInterval segundos."
HandshakeSnooperStoppingForVerifierNotice="Parando o monitor e verificando hashes."
HandshakeSnooperSearchingForHashesNotice="Procurando hashes no arquivo de captura."
HandshakeSnooperArbiterAbortedWarning="${CYel}Abortado${CClr}: A operação foi interrompida, nenhum hash válido foi encontrado."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Sucesso${CClr}: Um hash válido foi detectado e salvo no banco de dados do fluxion."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Monitor de Handshake$CBYel: ataque concluído, feche esta janela e inicie outro ataque.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
