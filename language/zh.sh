#!/bin/bash
# Chinese
# native: 中文

FLUXIONInterfaceQuery="请选择你要调用的网卡设备"
FLUXIONUnblockingWINotice="解除所有占用无线接口设备的进程..."
FLUXIONFindingExtraWINotice="查询USB外部网卡接口设备..."
FLUXIONRemovingExtraWINotice="正在移除USB外部网卡接口设备..."
FLUXIONFindingWINotice="寻找可用的USB外部网卡接口设备..."
FLUXIONSelectedBusyWIError="选择的USB外部网卡接口设备正在被调用!"
FLUXIONSelectedBusyWITip="Run \"export FLUXIONWIKillProcesses=1\" before FLUXION to use it."
FLUXIONGatheringWIInfoNotice="采集接口信息..."
FLUXIONUnknownWIDriverError="Unable to determine interface driver!"
FLUXIONUnloadingWIDriverNotice="Waiting for interface \"\$wiSelected\" to unload..."
FLUXIONLoadingWIDriverNotice="Waiting for interface \"\$wiSelected\" to load..."
FLUXIONFindingConflictingProcessesNotice="自动查询干扰Fluxion运行的进程..."
FLUXIONKillingConflictingProcessesNotice="结束干扰Fluxion运行的进程..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Unable to determine interface's physical device!"
FLUXIONStartingWIMonitorNotice="启动监听模式..."
FLUXIONMonitorModeWIEnabledNotice="${CGrn}Interface monitor mode enabled."
FLUXIONMonitorModeWIFailedError="${CRed}Interface monitor mode failed!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="启动扫描, 请稍等..."
FLUXIONStartingScannerTip="Five seconds after the target AP appears, close the FLUXION Scanner."
FLUXIONPreparingScannerResultsNotice="综合扫描的结果获取中,请稍等..."
FLUXIONScannerFailedNotice="你的无线网卡好像不支持 (没有发现APs)"
FLUXIONScannerDetectedNothingNotice="没有发现访问点, 请返回重试..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Hash文件不存在!"
FLUXIONHashInvalidError="${CRed}错误$CClr, 无效的Hash文件!"
FLUXIONHashValidNotice="${CGrn}成功$CClr, Hash效验完成!"
FLUXIONPathToHandshakeFileQuery="指定捕获到的握手包存放的路径 $CClr(例如: /.../dump-01.cap)"
FLUXIONAbsolutePathInfo="捕获到握手包后存放的绝对路径"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="选择要扫描的信道"
FLUXIONScannerChannelOptionAll="扫描所有信道 "
FLUXIONScannerChannelOptionSpecific="扫描指定信道"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="单一信道"
FLUXIONScannerChannelMiltipleTip="多个信道"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="FLUXION 扫描仪"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAPServiceQuery="选择攻击方式"
FLUXIONAPServiceHostapdOption="钓鱼热点破解 - hostapd (${CGrn}推荐用这个$CClr)"
FLUXIONAPServiceAirbaseOption="钓鱼热点破解 - airbase-ng (${CYel}缓慢$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="选择一种方式来检查握手包获取状态"
FLUXIONHashSourcePathOption="检测文件的路径"
FLUXIONHashSourceRescanOption="握手包目录(重新扫描)"
FLUXIONFoundHashNotice="发现目标热点的Hash文件."
FLUXIONUseFoundHashQuery="你想要使用这个文件吗?"
FLUXIONHashVerificationMethodQuery="选择Hash的验证方法"
FLUXIONHashVerificationMethodPyritOption="验证码 (${CGrn}推荐用这个$CClr)"
FLUXIONHashVerificationMethodAircrackOption="aircrack-ng 验证 (${CYel}不推荐$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="请选择一个攻击方式"
FLUXIONAttackInProgressNotice="${CCyn}\$FLUXIONAttack$CClr attack in progress..."
FLUXIONSelectAnotherAttackOption="选择启动攻击方式"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralBackOption="${CRed}返回"
FLUXIONGeneralExitOption="${CRed}退出"
FLUXIONGeneralRepeatOption="${CRed}重复操作"
FLUXIONGeneralNotFoundError="未找到"
FLUXIONGeneralXTermFailureError="${CRed}Failed to start xterm session (possible misconfiguration)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="清理进程并退出"
FLUXIONKillingProcessNotice="Killing ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Restoring ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="关闭监听模式界面"
FLUXIONDisablingExtraInterfacesNotice="关闭USB外部网卡接口"
FLUXIONDisablingPacketForwardingNotice="关闭 ${CGry}转发数据包"
FLUXIONDisablingCleaningIPTablesNotice="清理 ${CGry}iptables"
FLUXIONRestoringTputNotice="恢复 ${CGry}tput"
FLUXIONDeletingFilesNotice="删除 ${CGry}文件"
FLUXIONRestartingNetworkManagerNotice="重启 ${CGry}网络管理"
FLUXIONCleanupSuccessNotice="所有进程清理完成!"
FLUXIONThanksSupportersNotice="再次感谢使用Fluxion!"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
