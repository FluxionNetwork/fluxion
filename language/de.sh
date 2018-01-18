#!/bin/bash
# German
# native: Deutsch

FLUXIONInterfaceQuery="Wähle Sie ihre Netzwerkkarte aus"
FLUXIONUnblockingWINotice="Wiederherstellen von allen Netzwerkkarten..."
FLUXIONFindingExtraWINotice="Suche nach Netzwerkkarten..."
FLUXIONRemovingExtraWINotice="Entferne Netzwerkkarten..."
FLUXIONFindingWINotice="Suche nach Netzwerkkarten..."
FLUXIONSelectedBusyWIError="Die ausgewählte Netzwerkkarte befindet sich gerade in Benutzung"
FLUXIONSelectedBusyWITip="Führe \"export FLUXIONWIKillProcesses=1\" aus bevor Sie FLUXION benutzen"
FLUXIONGatheringWIInfoNotice="Sammeln von Daten, von allen Netzwerken..."
FLUXIONUnknownWIDriverError="Netzwerkkartentreiber konnte nicht bestimmt werden"
FLUXIONUnloadingWIDriverNotice="Warte auf Netzwerkarte \"\$wiSelected\"..."
FLUXIONLoadingWIDriverNotice="Warte auf Treiberantwort \"\$wiSelected\"..."
FLUXIONFindingConflictingProcessesNotice="Suche nach Diensten die Probleme verursachen können..."
FLUXIONKillingConflictingProcessesNotice="Beende Diensten die Probleme verursachen können..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Die Physische Schnittstelle konnte nicht ermittelt werden"
FLUXIONStartingWIMonitorNotice="Starte die Netzwerkkarte im sogenannten Monitor Mode"
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Monitormode konnte erfolgreich gestartet werden"
FLUXIONMonitorModeWIFailedError="${CRed}Monitormode konnte nicht gestartet werden"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Starte Netzwerkscanner"
FLUXIONStartingScannerTip="Wenn nach etwa 30 Sekunden Netzwerke sichbar werden, schließe Netzwerkscanner"
FLUXIONPreparingScannerResultsNotice="Analysieren von allen gesammelten Daten..."
FLUXIONScannerFailedNotice="Netzwerkkarte ist möglichweise nicht geeignet ( Keine Netzwerke gefunden )"
FLUXIONScannerDetectedNothingNotice="Keine Netzwerke konnten gefunden werden"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Hash Datei existiert nicht"
FLUXIONHashInvalidError="${CRed}Fehler$CClr, falscher Hash"
FLUXIONHashValidNotice="${CGrn}Erfolgreich$CClr,Hash wurde erfolgreich verifiziert"
FLUXIONPathToHandshakeFileQuery="Geben sie den Pfad zum Handshake an $CClr(Beispiel: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Geben sie den absoluten Pfad ein"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Wähle deinen Netzwerkfrequenz aus"
FLUXIONScannerChannelOptionAll="Alle Netzwerkfrequenzen"
FLUXIONScannerChannelOptionSpecific="Spezifische Frequenz(en)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Einzelne Frequenz"
FLUXIONScannerChannelMiltipleTip="Mehrere Frequenzen"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION Scanner"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Wähle deine Angriffsmethode aus"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}Empfohlen$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}Langsame Verbindung$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Wähle eine Methode aus um den Handshake zu erlangen"
FLUXIONHashSourcePathOption="Handshake Pfad eingeben"
FLUXIONHashSourceRescanOption="Handshake Ordner neu einlesen"
FLUXIONFoundHashNotice="Ein Hash wurde für das Netzwerk gefunden"
FLUXIONUseFoundHashQuery="Möchten Sie dieses Netzwerk nutzen?"
FLUXIONHashVerificationMethodQuery="Wählen sie eine Methode um den Hash zu verifizieren"
FLUXIONHashVerificationMethodPyritOption="Pyrit verifizierung (${CGrn}Empfohlen$CClr)"
FLUXIONHashVerificationMethodAircrackOption="Aircrack verfizierung (${CYel}Nicht empfohlen$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Wählen Sie einen drahtlosen Angriff für den Zugangspunkt aus"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr Angriff gestartet"
FLUXIONSelectAnotherAttackOption="Wählen Sie einen anderen Angriff"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Zurück"
FLUXIONGeneralExitOption="${CRed}Ausgang"
FLUXIONGeneralRepeatOption="${CRed}Wiederholen Sie den Vorgang"
FLUXIONGeneralNotFoundError="Nicht gefunden"
FLUXIONGeneralXTermFailureError="${CRed}Xterm Terminal konnte nicht gestartet werden"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Aufräumen und schließen"
FLUXIONKillingProcessNotice="Beende ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Deaktivierung der Netzwerkkarte"
FLUXIONDisablingExtraInterfacesNotice="Deaktivierung der Netzwerkkarte"
FLUXIONDisablingPacketForwardingNotice="Deaktivierung ${CGry}von der Weiterleitung von Paketen"
FLUXIONDisablingCleaningIPTablesNotice="Säubere ${CGry}iptables"
FLUXIONRestoringTputNotice="Wiederherstellung von ${CGry}tput"
FLUXIONDeletingFilesNotice="Löschen ${CGry}von Daten"
FLUXIONRestartingNetworkManagerNotice="Neustarten des ${CGry}Netzwerk Manager"
FLUXIONCleanupSuccessNotice="Wiederherstellung war erfolgreich"
FLUXIONThanksSupportersNotice="Vielen Dank für die Nutzung von FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
