#!/bin/bash
# German
# native: Deutsch

FLUXIONInterfaceQuery="Wähle deine Netzwerkkarte aus"
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
FLUXIONHashSourceQuery="Select a method to retrieve the handshake"
FLUXIONHashSourcePathOption="Path to capture file"
FLUXIONHashSourceRescanOption="Handshake directory (rescan)"
FLUXIONFoundHashNotice="A hash for the target AP was found."
FLUXIONUseFoundHashQuery="Do you want to use this file?"
FLUXIONHashVerificationMethodQuery="Select a method of verification for the hash"
FLUXIONHashVerificationMethodPyritOption="pyrit verification (${CGrn}recommended$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng verification (unreliable)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Wählen Sie einen drahtlosen Angriff für den Zugangspunkt aus"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr attack in progress..."
FLUXIONSelectAnotherAttackOption="Select another attack"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Zurück"
FLUXIONGeneralExitOption="${CRed}Ausgang"
FLUXIONGeneralRepeatOption="${CRed}Wiederholen Sie den Vorgang"
FLUXIONGeneralNotFoundError="Nicht gefunden"
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
