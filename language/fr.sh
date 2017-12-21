#!/bin/bash
# French
# native: français

FLUXIONInterfaceQuery="Sélectionnez une interface"
FLUXIONUnblockingWINotice="Débloque toutes les interfaces wireless..."
FLUXIONFindingExtraWINotice="Cherche des interfaces wireless externes..."
FLUXIONRemovingExtraWINotice="Suppression des interfaces wireless externes..."
FLUXIONFindingWINotice="Cherche des interfaces wireless disponibles..."
FLUXIONSelectedBusyWIError="L'interface wireless sélectionnée semble déjà en cours d'utilisation !"
FLUXIONSelectedBusyWITip="Run \"export FLUXIONWIKillProcesses=1\" before FLUXION to use it."
FLUXIONGatheringWIInfoNotice="Récupération des informations d'interface..."
FLUXIONUnknownWIDriverError="Incapable de déterminer les drivers d'interface !"
FLUXIONUnloadingWIDriverNotice="En attente du déchargement de l'interface \"\$wiSelected\"..."
FLUXIONLoadingWIDriverNotice="En attente du chargement de l'interface \"\$wiSelected\"..."
FLUXIONFindingConflictingProcessesNotice="Looking for notorious services..."
FLUXIONKillingConflictingProcessesNotice="Killing notorious services..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Incapable de déterminer l'interface physique !"
FLUXIONStartingWIMonitorNotice="Lancement de l'interface de monitoring..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Mode monitoring activé."
FLUXIONMonitorModeWIFailedError="${CRed}Échec de l'activation du mode monitoring !"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Lancement du scanner, veuillez patienter..."
FLUXIONStartingScannerTip="Five seconds after the target AP appears, close the FLUXION Scanner."
FLUXIONPreparingScannerResultsNotice="Synthèse des résultats du scan, veuillez patienter..."
FLUXIONScannerFailedNotice="Carte wireless probablement pas supportée (pas de point d'accès trouvé)."
FLUXIONScannerDetectedNothingNotice="Pas de point d'accès trouvé, retour..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Fichier hash inexistant !"
FLUXIONHashInvalidError="${CRed}Error$CClr, fichier hash invalide !"
FLUXIONHashValidNotice="${CGrn}Success$CClr, vérification du hash complète !"
FLUXIONPathToHandshakeFileQuery="Entrez le chemin du hash $CClr(Exemple: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Chemin absolu"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Sélectionnez un canal"
FLUXIONScannerChannelOptionAll="Tous les canaux"
FLUXIONScannerChannelOptionSpecific="Canal spécifique"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Un seul canal"
FLUXIONScannerChannelMiltipleTip="Plusieurs canaux"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="Scanner FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Sélectionnez une option d'attaque"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommandé$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}Connexion plus lente$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Sélectionnez une méthode de récupération de handshake"
FLUXIONHashSourcePathOption="Chemin du fichier capturé"
FLUXIONHashSourceRescanOption="Dossier du handshake (rescan)"
FLUXIONFoundHashNotice="Un hash pour le point d'accès ciblé a été trouvé."
FLUXIONUseFoundHashQuery="Voulez-vous utiliser ce fichier ?"
FLUXIONHashVerificationMethodQuery="Sélectionnez une méthode de vérification du hash"
FLUXIONHashVerificationMethodPyritOption="vérification pyrit (${CGrn}recommandé$CClr)"
FLUXIONHashVerificationMethodAircrackOption="vérification aircrack-ng (${CYel}peu fiable$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Sélectionnez une attaque wireless pour le point d'accès"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr attaque en cours..."
FLUXIONSelectAnotherAttackOption="Sélectionnez une autre attaque"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Retour"
FLUXIONGeneralExitOption="${CRed}Sortie"
FLUXIONGeneralRepeatOption="${CRed}Répéter l'opération"
FLUXIONGeneralNotFoundError="Non trouvé"
FLUXIONGeneralXTermFailureError="${CRed} Echec au lancement de la session xterm (mauvaise configuration possible)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Nettoyage et fermeture"
FLUXIONKillingProcessNotice="Killing ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Désactivation de l'interface de monitoring"
FLUXIONDisablingExtraInterfacesNotice="Désactivation de l'interface"
FLUXIONDisablingPacketForwardingNotice="Désactivation de ${CGry}transmission de paquets"
FLUXIONDisablingCleaningIPTablesNotice="Nettoyage de ${CGry}iptables"
FLUXIONRestoringTputNotice="Restauration de ${CGry}tput"
FLUXIONDeletingFilesNotice="Suppression ${CGry}files"
FLUXIONRestartingNetworkManagerNotice="Redémarrage de ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Nettoyage effectué avec succès !"
FLUXIONThanksSupportersNotice="Merci d'avoir utilisé FLUXION !"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
