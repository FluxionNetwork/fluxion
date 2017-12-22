#!/bin/bash
# Slovak
# native: slovenčina

FLUXIONInterfaceQuery="Vyberte bezdrôtový adaptér"
FLUXIONUnblockingWINotice="Odblokúvam všetky bezdrôtové adaptéry..."
FLUXIONFindingExtraWINotice="Hľadám prídavné bezdrôtové adaptéry..."
FLUXIONRemovingExtraWINotice="Odstraňujem prídavné bezdrôtové adaptéry..."
FLUXIONFindingWINotice="Hľadám dostupné bezdrôtové adaptéry..."
FLUXIONSelectedBusyWIError="Vybraný bezdrôtový adaptér sa pravdepodobne používa!"
FLUXIONSelectedBusyWITip="Pred spustením FLUXION spustite \"export FLUXIONWIKillProcesses=1\" aby to bolo možné použiť."
FLUXIONGatheringWIInfoNotice="Zhromažďujem informácie o adaptéri..."
FLUXIONUnknownWIDriverError="Nepodarilo sa zistiť driver adaptéru!"
FLUXIONUnloadingWIDriverNotice="Čakám na uvolnenie adaptéru \"\$wiSelected\" ..."
FLUXIONLoadingWIDriverNotice="Čakám na pripravenie adaptéru \"\$wiSelected\" ..."
FLUXIONFindingConflictingProcessesNotice="Hľadám známe služby..."
FLUXIONKillingConflictingProcessesNotice="Zastavujem známe služby..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Nedokážem zistiť fyzické zariadenie adaptéru!"
FLUXIONStartingWIMonitorNotice="Štartujem monitorovací adaptér..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Monitorovací mód adaptéru aktivovaný."
FLUXIONMonitorModeWIFailedError="${CRed}Monitorovací mód adaptéru zlyhal!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Štartujem scanner, čakajte..."
FLUXIONStartingScannerTip="Päť sekúnd po objavení sa cieľového AP, zavrite FLUXION Scanner."
FLUXIONPreparingScannerResultsNotice="Výsledky scanu sa pripravujú, čakajte..."
FLUXIONScannerFailedNotice="Bezdrôtová sieťová karta nemusí byť podporovaná (nenašli sa žiadne AP)"
FLUXIONScannerDetectedNothingNotice="Žiadne prístupové body neboli najdené, vraciam sa..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Súbor 'hash' neexistuje!"
FLUXIONHashInvalidError="${CRed}Error$CClr, nesprávny 'hash' súbor!"
FLUXIONHashValidNotice="${CGrn}Success$CClr, 'hash' overenie úspešné!"
FLUXIONPathToHandshakeFileQuery="Zadajte cestu k 'handshake' súboru $CClr(Príklad: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="Absolúna cesta"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Vyberte kanál, ktorý chcete monitorovať"
FLUXIONScannerChannelOptionAll="Všetky kanály"
FLUXIONScannerChannelOptionSpecific="Špecifický kanál(y)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Jeden kanál"
FLUXIONScannerChannelMiltipleTip="Viecero kanálov"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION Scanner"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="Vyberte spôsob útoku"
FLUXIONAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}Odporúčané$CClr)"
FLUXIONAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}pomalšie$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Vyberte spôsob získania 'handshake'"
FLUXIONHashSourcePathOption="Cesta ku 'capture' súboru"
FLUXIONHashSourceRescanOption="Priečinok s 'handshake' (preskenovať)"
FLUXIONFoundHashNotice="Našiel sa 'hash' pre vybrané AP."
FLUXIONUseFoundHashQuery="Chcete použiť tento súbor?"
FLUXIONHashVerificationMethodQuery="Vyberte spôsob overenia pre 'hash'"
FLUXIONHashVerificationMethodPyritOption="pyrit verification (${CGrn}Odporúčané$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng verification (${CYel}nespoľahlivé$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Vyberte spôsob útoku pre prístupový bod"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr prebieha útok..."
FLUXIONSelectAnotherAttackOption="Vyberte iný útok"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}Späť"
FLUXIONGeneralExitOption="${CRed}Exit"
FLUXIONGeneralRepeatOption="${CRed}Opakovať"
FLUXIONGeneralNotFoundError="Nenájdené"
FLUXIONGeneralXTermFailureError="${CRed}Nepodarilo sa spustiť 'xterm session' (možná nesprávna konfigurácia)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Čistím a zatváram"
FLUXIONKillingProcessNotice="Ukončujem ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Vypínam monitorovací adaptér"
FLUXIONDisablingExtraInterfacesNotice="Vypínam extra adaptéry"
FLUXIONDisablingPacketForwardingNotice="Vypínam ${CGry}smerovanie packet-ov"
FLUXIONDisablingCleaningIPTablesNotice="Čistím ${CGry}iptables"
FLUXIONRestoringTputNotice="Obnovujem ${CGry}tput"
FLUXIONDeletingFilesNotice="Mažem ${CGry}súbory"
FLUXIONRestartingNetworkManagerNotice="Reštartujem ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Čistenie prebehlo úspešne!"
FLUXIONThanksSupportersNotice="Ďakujeme za použitie FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
