#!/bin/bash
# Italian
# native: italiano

FLUXIONInterfaceQuery="Seleziona un'interfaccia"
FLUXIONUnblockingWINotice="Sblocca tutte le interfacce wireless..."
FLUXIONFindingExtraWINotice="Trova interfacce extra wireless..."
FLUXIONRemovingExtraWINotice="Rimuove interfacce extra wireless..."
FLUXIONFindingWINotice="Trova interfacce wireless disponibili..."
FLUXIONSelectedBusyWIError="L'interfaccia selezionata sembra in uso in questo momento!"
FLUXIONSelectedBusyWITip="Usa \"export FLUXIONWIKillProcesses=1\" prima di FLUXION per sfruttarlo."
FLUXIONGatheringWIInfoNotice="Raccolta informazioni interfaccia..."
FLUXIONUnknownWIDriverError="Impossibile trovare il driver dell'interfaccia!"
FLUXIONUnloadingWIDriverNotice="Attendo che l'interfaccia \"\$wiSelected\" venga scaricata..."
FLUXIONLoadingWIDriverNotice="Attendo che l'interfaccia \"\$wiSelected\" venga caricata..."
FLUXIONFindingConflictingProcessesNotice="Individuo i servizi noti..."
FLUXIONKillingConflictingProcessesNotice="Chiudo i servizi noti..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Impossibile determinare l'interfaccia del dispositivo fisico!"
FLUXIONStartingWIMonitorNotice="Avvio dell'interfaccia MONITOR..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Interfaccia monitor ATTIVATA."
FLUXIONMonitorModeWIFailedError="${CRed}Interfaccia monitor FALLITA!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Avvio Scanner, attendi..."
FLUXIONStartingScannerTip="Five seconds after the target AP appears, close the FLUXION Scanner."
FLUXIONPreparingScannerResultsNotice="Sintetizzo i risultati dello scan, attendi..."
FLUXIONScannerFailedNotice="La scheda Wireless non è supportata (nessun APs trovato)"
FLUXIONScannerDetectedNothingNotice="Nessun Access Point e' stato trovato, ritorno..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Il file di hash non esiste!"
FLUXIONHashInvalidError="${CRed}Errore$CClr, hash del file invalido!"
FLUXIONHashValidNotice="${CGrn}Perfetto$CClr, verifica hash completata!"
FLUXIONPathToHandshakeFileQuery="Inserisci il percorso del file di handshake $CClr(Esempio: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Path assoluto"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Selezione Canale"
FLUXIONScannerChannelOptionAll="Tutti i Canali"
FLUXIONScannerChannelOptionSpecific="Definisci Canale/i"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Canale Singolo"
FLUXIONScannerChannelMiltipleTip="Canali Multipli"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="WIFI Monitor"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Seleziona Opzione d'Attacco"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}Consigliato!$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}Connessione Lenta$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Seleziona il metodo di scoperta dell'handshake"
FLUXIONHashSourcePathOption="Path del file catturato"
FLUXIONHashSourceRescanOption="Handshake directory (rescan)"
FLUXIONFoundHashNotice="L'hash del target AP è stato trovato."
FLUXIONUseFoundHashQuery="Vuoi usare questo file?"
FLUXIONHashVerificationMethodQuery="Seleziona il metodo di verifica dell'hash"
FLUXIONHashVerificationMethodPyritOption="pyrit verification (${CGrn}raccomandato$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng verification (${CYel}inaffidabile$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Seleziona la tua scelta"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr attacco in corso..."
FLUXIONSelectAnotherAttackOption="Seleziona un altro tipo di attacco"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Indietro"
FLUXIONGeneralExitOption="${CRed}Esci"
FLUXIONGeneralRepeatOption="${CRed}Ripeti Operazione"
FLUXIONGeneralNotFoundError="Non Trovato"
FLUXIONGeneralXTermFailureError="${CRed}Errore nell'avvio della sessione XTerm (possibile configurazione errata)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Pulizia e chiusura"
FLUXIONKillingProcessNotice="Killing ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Disabilito l'Interfaccia Monitor"
FLUXIONDisablingExtraInterfacesNotice="Disabilito l'Interfaccia"
FLUXIONDisablingPacketForwardingNotice="Disabilito ${CGry}l'invio dei pacchetti"
FLUXIONDisablingCleaningIPTablesNotice="Pulisco ${CGry}iptables"
FLUXIONRestoringTputNotice="Ripristino ${CGry}tput"
FLUXIONDeletingFilesNotice="Cancello ${CGry}files"
FLUXIONRestartingNetworkManagerNotice="Riavvio il ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Pulizia avvenuta con successo!"
FLUXIONThanksSupportersNotice="Grazie per aver utilizzato Fluxion"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
