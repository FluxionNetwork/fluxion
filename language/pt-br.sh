#!/bin/bash
# Português Brazileiro
# native: Português-BR

FLUXIONInterfaceQuery="Selecione sua interface wireless"
FLUXIONUnblockingWINotice="Desbloqueando interfaces wireless..."
FLUXIONFindingExtraWINotice="A procura de interfaces wireless..."
FLUXIONRemovingExtraWINotice="Removendo interfaces wireless..."
FLUXIONFindingWINotice="Procurando por interfaces wireless válidas..."
FLUXIONSelectedBusyWIError="A interface selecionada esta aparentemente em uso"
FLUXIONSelectedBusyWITip="Execute \"export FLUXIONWIKillProcesses=1\" antes do FLUXION ."
FLUXIONGatheringWIInfoNotice="Relhendo informações da interface..."
FLUXIONUnknownWIDriverError="Ative o drive da interface!"
FLUXIONUnloadingWIDriverNotice="Esperando pela interface \"\$wiSelected\" para descarregar..."
FLUXIONLoadingWIDriverNotice="Esperando pela interface \"\$wiSelected\" para carregar..."
FLUXIONFindingConflictingProcessesNotice="Procurando serviços conflitantes..."
FLUXIONKillingConflictingProcessesNotice="Matando serviços conflitantes..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Não é possível determinar o dispositivo físico da interface!"
FLUXIONStartingWIMonitorNotice="Iniciando modo monitor..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Interface em modo monitor ativada!"
FLUXIONMonitorModeWIFailedError="${CRed}Falha ao ativar modo monitor!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Iniciando busca, aguarde por favor..."
FLUXIONStartingScannerTip="Five seconds after the target AP appears, close the FLUXION Scanner."
FLUXIONPreparingScannerResultsNotice="Sintetizando os resultados da varredura, aguarde..."
FLUXIONScannerFailedNotice="Wireless card não suportado (sem APs encontrados)"
FLUXIONScannerDetectedNothingNotice="Sem APs encontrados, retornando..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Arquivo hash não existe!"
FLUXIONHashInvalidError="${CRed}Error$CClr, arquivo hash inválido!"
FLUXIONHashValidNotice="${CGrn}Success$CClr, verificação de hash completa!"
FLUXIONPathToHandshakeFileQuery="Insira o arquivo de handshake $CClr(Exemplo: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Caminho "
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Selecione um canal para monitorar"
FLUXIONScannerChannelOptionAll="Todos os Canais"
FLUXIONScannerChannelOptionSpecific="Canais específicos"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Canal único"
FLUXIONScannerChannelMiltipleTip="Múltiplos canais"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION Scanner"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Selecione um serviço de ponto de acesso"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recomendado$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}lento$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Selecione um método para capturar o handshake"
FLUXIONHashSourcePathOption="Caminho para captura do arquivo"
FLUXIONHashSourceRescanOption="Diretório do handshake"
FLUXIONFoundHashNotice="Um handshake para o AP alvo foi encontrado."
FLUXIONUseFoundHashQuery="Gostaria de usar esse arquivo?"
FLUXIONHashVerificationMethodQuery="Selecione um método de verificação para a hash"
FLUXIONHashVerificationMethodPyritOption="pyrit verification (${CGrn}recomendada$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng verification (${CYel}não confiável$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Selecione uma rede sem fio para atacar"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr ataque em progresso..."
FLUXIONSelectAnotherAttackOption="Selecione outro ataque"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Voltar"
FLUXIONGeneralExitOption="${CRed}Sair"
FLUXIONGeneralRepeatOption="${CRed}Repetir"
FLUXIONGeneralNotFoundError="Não encontrado"
FLUXIONGeneralXTermFailureError="${CRed}Falha ao iniciar a sessão xterm (possivelmente configuração errada)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Limpando e saindo"
FLUXIONKillingProcessNotice="Matando ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Desabilitando interface do modo monitor"
FLUXIONDisablingExtraInterfacesNotice="Desabilitando interfaces extras"
FLUXIONDisablingPacketForwardingNotice="Desabilitando ${CGry}encaminhador de pacotes"
FLUXIONDisablingCleaningIPTablesNotice="Limpando ${CGry}iptables"
FLUXIONRestoringTputNotice="Restaurando ${CGry}tput"
FLUXIONDeletingFilesNotice="Deletando ${CGry}arquivos"
FLUXIONRestartingNetworkManagerNotice="Reiniciando ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Limpeza completa!"
FLUXIONThanksSupportersNotice="Obrigado por usar o FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
