#!/bin/bash
# German
# native: Deutsch

FLUXIONInterfaceQuery="Wähle deine Netzwerkkarte aus"
FLUXIONUnblockingWINotice="Entferne den Softblock von allen Netzwerkkarten..."
FLUXIONFindingExtraWINotice="Schaue nach fremden drahlosen Netzwerkkarten..."
FLUXIONRemovingExtraWINotice="Entferne freme drahtlose Netzwerkkarten..."
FLUXIONFindingWINotice="Schaue nach fremden drahlosen Netzwerkkarten..."
FLUXIONSelectedBusyWIError="Die ausgewählte Netzwerkkarte befindet sich gerade in benutzung"
FLUXIONSelectedBusyWITip="Führe \"export FLUXIONWIKillProcesses=1\" aus bevor du FLUXION nutzt."
FLUXIONGatheringWIInfoNotice="Sammeln der Daten von allen Netzwerken..."
FLUXIONUnknownWIDriverError="Netzwerkkartentreiber konnte nicht bestimmt werden"
FLUXIONUnloadingWIDriverNotice="Warte auf Netzwerkarte \"\$wiSelected\"..."
FLUXIONLoadingWIDriverNotice="Warte auf Netzwerkarte \"\$wiSelected\"..."
FLUXIONFindingConflictingProcessesNotice="Suche nach Diensten die Probleme verursachen können..."
FLUXIONKillingConflictingProcessesNotice="Beende Diensten die Probleme verursachen können..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Die Physische Schnittstelle konnte nicht ermittelt werden"
FLUXIONStartingWIMonitorNotice="Starte die Grafikkarte im Monitor Mode"
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Monitormode konnte erfolgreich gestartet werden"
FLUXIONMonitorModeWIFailedError="${CRed}Monitormode konnte nicht gestartet werden"
FLUXIONStartingWIAccessPointNotice="Starte drahtloses Netzwerk"
FLUXIONCannotStartWIAccessPointError="${CRed}Virtuelles Netzwerk konnte nicht gestartet werden$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Starte Scanner"
FLUXIONStartingScannerTip="Sobald der Scanner gestartet ist und Netzwerke zusehen sind, schließen sie das Fenster"
FLUXIONPreparingScannerResultsNotice="Analysieren von allen gesammelten Daten..."
FLUXIONScannerFailedNotice="Netzwerkkarte ist möglichweise nicht geeignet ( Keine Netzwerke gefunden )"
FLUXIONScannerDetectedNothingNotice="Keine Netzwerke konnten gefunden werden"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Hash Datei existiert nicht"
FLUXIONHashInvalidError="${CRed}Error$CClr, falscher Hash"
FLUXIONHashValidNotice="${CGrn}Success$CClr,Hash Verifizierung erfolgreich"
FLUXIONPathToHandshakeFileQuery="Geben sie den Pfad zum Handshake an $CClr(Beispiel: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Absoluten Pfad"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Wähle deinen Kanal aus"
FLUXIONScannerChannelOptionAll="Alle Kanäle"
FLUXIONScannerChannelOptionSpecific="Spezifische Kanal(e)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Einzelner Kanal"
FLUXIONScannerChannelMiltipleTip="Mehrere Kanäle"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION Scanner"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Wähle deine Angriffsmethode aus"
FLUXIONAPServiceHostapdOption="Rogue AP - Hostapd (${CYel}Empfohlen$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (Langsame Verbindung)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Wähle eine Methode aus um den Handshake zu erlangen"
FLUXIONHashSourcePathOption="Handshake Pfad eingeben"
FLUXIONHashSourceRescanOption="Handshake Ordner neu einlesen"
FLUXIONFoundHashNotice="Ein hash wurde für das Netzwerk gefunden"
FLUXIONUseFoundHashQuery="Möchten sie dieses Netzwerk nutzen"
FLUXIONHashVerificationMethodQuery="Wählen sie eine Methode um den Hash zu Verifizieren"
FLUXIONHashVerificationMethodPyritOption="Pyrit Verifizierung (${CGrn}Empfohlen$CClr)"
FLUXIONHashVerificationMethodAircrackOption="Aircrack Verfizierung (Unglaubwürdig)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Wählen Sie einen drahtlosen Angriff für den Zugangspunkt aus"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr Angriff gestartet"
FLUXIONSelectAnotherAttackOption="Wähle einen anderen Angriff"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Zurück"
FLUXIONGeneralExitOption="${CRed}Ausgang"
FLUXIONGeneralRepeatOption="${CRed}Wiederholen Sie den Vorgang"
FLUXIONGeneralNotFoundError="Nicht gefunden"
FLUXIONGeneralXTermFailureError="${CRed}Xterm Terminal konnte nicht gestartet werden"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Aufräumen und schließen"
FLUXIONKillingProcessNotice="Killing ${CGry}\$targetID$CClr"
FLUXIONDisablingMonitorNotice="Deaktivierung des Monitor Interface"
FLUXIONDisablingExtraInterfacesNotice="Deaktivierung des Interface"
FLUXIONDisablingPacketForwardingNotice="Deaktivierung ${CGry}von weiterleiten von Paketen"
FLUXIONDisablingCleaningIPTablesNotice="Säubere ${CGry}iptables"
FLUXIONRestoringTputNotice="Wiederherstellung von ${CGry}tput"
FLUXIONDeletingFilesNotice="Deleting ${CGry}files"
FLUXIONRestartingNetworkManagerNotice="Neustarten des ${CGry}Netzwerk Manager"
FLUXIONCleanupSuccessNotice="Wiederherstellung war erfolgreich"
FLUXIONThanksSupportersNotice="Vielen Dank für die Nutzung von FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
