#!/bin/bash
# English
# native: English

FLUXIONInterfaceQuery="Select a wireless interface"
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
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Starting scanner, please wait..."
FLUXIONStartingScannerTip="Five seconds after the target AP appears, close the FLUXION Scanner."
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
FLUXIONScannerChannelQuery="Select a channel to monitor"
FLUXIONScannerChannelOptionAll="All channels"
FLUXIONScannerChannelOptionSpecific="Specific channel(s)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Single channel"
FLUXIONScannerChannelMiltipleTip="Multiple channels"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION Scanner"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Select an access point service"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Select a method to retrieve the handshake"
FLUXIONHashSourcePathOption="Path to capture file"
FLUXIONHashSourceRescanOption="Handshake directory (rescan)"
FLUXIONFoundHashNotice="A hash for the target AP was found."
FLUXIONUseFoundHashQuery="Do you want to use this file?"
FLUXIONHashVerificationMethodQuery="Select a method of verification for the hash"
FLUXIONHashVerificationMethodPyritOption="pyrit verification (${CGrn}recommended$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng verification (${CYel}unreliable$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Select a wireless attack for the access point"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr attack in progress..."
FLUXIONSelectAnotherAttackOption="Select another attack"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Back"
FLUXIONGeneralExitOption="${CRed}Exit"
FLUXIONGeneralRepeatOption="${CRed}Repeat"
FLUXIONGeneralNotFoundError="Not Found"
FLUXIONGeneralXTermFailureError="${CRed}Failed to start xterm session (possible misconfiguration)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Cleaning and closing"
FLUXIONKillingProcessNotice="Killing ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Disabling monitoring interface"
FLUXIONDisablingExtraInterfacesNotice="Disabling extra interfaces"
FLUXIONDisablingPacketForwardingNotice="Disabling ${CGry}forwarding of packets"
FLUXIONDisablingCleaningIPTablesNotice="Cleaning ${CGry}iptables"
FLUXIONRestoringTputNotice="Restoring ${CGry}tput"
FLUXIONDeletingFilesNotice="Deleting ${CGry}files"
FLUXIONRestartingNetworkManagerNotice="Restarting ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Cleanup performed successfully!"
FLUXIONThanksSupportersNotice="Thank you for using FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
