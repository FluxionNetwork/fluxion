#!/bin/bash
# French
# native: français

FLUXIONInterfaceQuery="Sélectionnez une interface"
FLUXIONUnblockingWINotice="Unblocking all wireless interfaces..."
FLUXIONFindingExtraWINotice="Looking for extraneous wireless interfaces..."
FLUXIONRemovingExtraWINotice="Removing extraneous wireless interfaces..."
FLUXIONFindingWINotice="Looking for available wireless interfaces..."
FLUXIONSelectedBusyWIError="The wireless interface selected appears to be currently in use!"
FLUXIONSelectedBusyWITip="Run \"export FLUXIONWIKillProcesses=1\" before FLUXION to use it."
FLUXIONGatheringWIInfoNotice="Gathering interface information..."
FLUXIONUnknownWIDriverError="Unable to determine interface driver!"
FLUXIONUnloadingWIDriverNotice="Waiting for interface \"\$wiSelected\" to unload..."
FLUXIONLoadingWIDriverNotice="Waiting for interface \"\$wiSelected\" to load..."
FLUXIONFindingConflictingProcessesNotice="Looking for notorious services..."
FLUXIONKillingConflictingProcessesNotice="Killing notorious services..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Unable to determine interface's physical device!"
FLUXIONStartingWIMonitorNotice="Starting monitor interface..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Interface monitor mode enabled."
FLUXIONMonitorModeWIFailedError="${CRed}Interface monitor mode failed!"
FLUXIONStartingWIAccessPointNotice="Starting access point interface..."
FLUXIONCannotStartWIAccessPointError="${CRed}Unable to create AP's virtual interface$CClr, returning!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Starting scanner, please wait..."
FLUXIONStartingScannerTip="Once the target AP appears, close the FLUXION Scanner to continue."
FLUXIONPreparingScannerResultsNotice="Synthesizing scan results, please wait..."
FLUXIONScannerFailedNotice="Wireless card may not be supported (no APs found)"
FLUXIONScannerDetectedNothingNotice="No access points were detected, returning..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Hash file does not exist!"
FLUXIONHashInvalidError="${CRed}Error$CClr, invalid hash file!"
FLUXIONHashValidNotice="${CGrn}Success$CClr, hash verification completed!"
FLUXIONPathToHandshakeFileQuery="Enter path to handshake file $CClr(Example: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Absolute path"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Sélectionnez un canal"
FLUXIONScannerChannelOptionAll="Tous les canaux "
FLUXIONScannerChannelOptionSpecific="Canal spécifique"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Un seul canal"
FLUXIONScannerChannelMiltipleTip="Plusieurs canaux"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION Scanner"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Sélectionnez une option d'attaque"
FLUXIONAPServiceHostapdOption="Rogue AP - Hostapd (${CRed}Recommandé)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (Connexion plus lente)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Select a method to retrieve the handshake"
FLUXIONHashSourcePathOption="Path to capture file"
FLUXIONHashSourceRescanOption="Handshake directory (rescan)"
FLUXIONFoundHashNotice="A hash for the target AP was found."
FLUXIONUseFoundHashQuery="Do you want to use this file?"
FLUXIONHashVerificationMethodQuery="Select a method of verification for the hash"
FLUXIONHashVerificationMethodPyritOption="pyrit verification (${CGrn}recommended$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng verification (unreliable)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Sélectionnez une attaque sans fil pour le point d'accès"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr attack in progress..."
FLUXIONSelectAnotherAttackOption="Select another attack"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Retour"
FLUXIONGeneralExitOption="${CRed}Sortie"
FLUXIONGeneralRepeatOption="${CRed}Répéter l'opération"
FLUXIONGeneralNotFoundError="Non trouvé"
FLUXIONGeneralXTermFailureError="${CRed}Failed to start xterm session (possible misconfiguration)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Nettoyage et fermeture"
FLUXIONKillingProcessNotice="Killing ${CGry}\$targetID$CClr"
FLUXIONDisablingMonitorNotice="Désactivation de l'interface de monitoring"
FLUXIONDisablingExtraInterfacesNotice="Désactivation de l'interface"
FLUXIONDisablingPacketForwardingNotice="Désactivation de ${CGry}transmission de paquets"
FLUXIONDisablingCleaningIPTablesNotice="Nettoyage de ${CGry}iptables"
FLUXIONRestoringTputNotice="Restauration de ${CGry}tput"
FLUXIONDeletingFilesNotice="Deleting ${CGry}files"
FLUXIONRestartingNetworkManagerNotice="Redémarrage de ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Nettoyage effectué avec succès!"
FLUXIONThanksSupportersNotice="Merci d'avoir utilisé fluxion"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
