#!/bin/bash
# English
# native: Polski

FLUXIONInterfaceQuery="Wybierz kartę bezprzewodową..."
FLUXIONUnblockingWINotice="Odblokowanie wszystkick kart bezprzewodowych..."
FLUXIONFindingExtraWINotice="Wyszukiwanie zewnętrznych kart bezprzewodowych..."
FLUXIONRemovingExtraWINotice="Usuwanie zewnętrznych kart bezprzewodowych..."
FLUXIONFindingWINotice="Wyszukiwanie dostępnych kart bezprzewodowych..."
FLUXIONSelectedBusyWIError="Wygląda na to, że wybrana karta bezprzewodowa jest obecnie używana!"
FLUXIONSelectedBusyWITip="Uruchom \"export FLUXIONWIKillProcesses=1\" przed startem FLUXION aby jej użyć."
FLUXIONGatheringWIInfoNotice="Pozyskiwanie informacji o karcie..."
FLUXIONUnknownWIDriverError="Nie można ustalić sterownika karty!"
FLUXIONUnloadingWIDriverNotice="Waiting for interface \"\$wiSelected\" to unload..."
FLUXIONLoadingWIDriverNotice="Waiting for interface \"\$wiSelected\" to load..."
FLUXIONFindingConflictingProcessesNotice="Poszukiwanie przeszkadzających usług..."
FLUXIONKillingConflictingProcessesNotice="Zabijanie przeszkadzających usług..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Unable to determine interface's physical device!"
FLUXIONStartingWIMonitorNotice="Starting monitor interface..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Tryb monitorowania dla karty aktywowany."
FLUXIONMonitorModeWIFailedError="${CRed}Aktywowanie trybu monitorowania nieudane!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Uruchamianie skanera, proszę czekać..."
FLUXIONStartingScannerTip="Five seconds after the target AP appears, close the FLUXION Scanner."
FLUXIONPreparingScannerResultsNotice="Synthesizing scan results, please wait..."
FLUXIONScannerFailedNotice="Twoja karta może być nie obsługiwana (nie znaleziono żadnego(ych) AP)"
FLUXIONScannerDetectedNothingNotice="Nie znaleziono punktów dostępu, powracanie..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Plik hash nie istnieje!"
FLUXIONHashInvalidError="${CRed}Error$CClr, invalid hash file!"
FLUXIONHashValidNotice="${CGrn}Success$CClr, hash verification completed!"
FLUXIONPathToHandshakeFileQuery="Podaj ścieżkę dostępu do pliku handshake $CClr(Example: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Absolute path"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Wybierz kanał do monitorowania"
FLUXIONScannerChannelOptionAll="Wszystkie kanały"
FLUXIONScannerChannelOptionSpecific="Wybrany(e) kanał(y)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Jeden kanał"
FLUXIONScannerChannelMiltipleTip="Wiele kanałów"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="Skaner FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Select an access point service"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Wybierz metodę pozyskania handshake'a"
FLUXIONHashSourcePathOption="Path to capture file"
FLUXIONHashSourceRescanOption="Handshake directory (rescan)"
FLUXIONFoundHashNotice="Hash dla AP został znaleziony."
FLUXIONUseFoundHashQuery="Chcesz użyć ten plik?"
FLUXIONHashVerificationMethodQuery="Wybierz metodę weryfikacji hash'a"
FLUXIONHashVerificationMethodPyritOption="weryfikacja przy pomocy pyrit-a  (${CGrn}recommended$CClr)"
FLUXIONHashVerificationMethodAircrackOption="weryfikacja przy pomocy aircrack-ng (${CYel}unreliable$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Wybierz rodzaj ataka na punkt dostępowy"
FLUXIONAttackInProgressNotice="Atak ${CCyn}\$FLUXIONAttack$CClr w trakcie..."
FLUXIONSelectAnotherAttackOption="Wybierz inny rodzaj ataku"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Cofnij"
FLUXIONGeneralExitOption="${CRed}Wyjście"
FLUXIONGeneralRepeatOption="${CRed}Powtórz"
FLUXIONGeneralNotFoundError="Nie znaleziono"
FLUXIONGeneralXTermFailureError="${CRed} Start xterm niemożliwy (źle skonfigurowany?)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Sprzątanie i zamykanie"
FLUXIONKillingProcessNotice="Zabijanie procesu ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Wyłączanie karty monitorującej"
FLUXIONDisablingExtraInterfacesNotice="Disabling extra interfaces"
FLUXIONDisablingPacketForwardingNotice="Disabling ${CGry}forwarding of packets"
FLUXIONDisablingCleaningIPTablesNotice="Cleaning ${CGry}iptables"
FLUXIONRestoringTputNotice="Restoring ${CGry}tput"
FLUXIONDeletingFilesNotice="Usuwanie ${CGry}files"
FLUXIONRestartingNetworkManagerNotice="Restartowanie ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Sprzątanie zakończone powodzeniem!"
FLUXIONThanksSupportersNotice="Dziękuję za użycie FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
