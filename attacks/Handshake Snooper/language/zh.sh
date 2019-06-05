#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: 检索WPA/WPA2加密散列。

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="选择一个用于监控和干扰的接口."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="选择一种方式来检查握手包获取状态"
HandshakeSnooperMonitorMethodOption="监听模式 (${CYel}被动$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng 解除认证方式 (${CRed}侵略性$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 解除认证方式 (${CRed}侵略性$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="每隔多久检查一次握手包"
HandshakeSnooperVerifierInterval30SOption="每30秒钟 (${CGrn}推荐${CClr})."
HandshakeSnooperVerifierInterval60SOption="每60秒钟"
HandshakeSnooperVerifierInterval90SOption="每90秒钟"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="如何进行验证?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchronously (${CYel}fast systems only${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchronously (${CGrn}推荐${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr 仲裁守护进程正在运行."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping for \$HandshakeSnooperVerifierInterval seconds."
HandshakeSnooperStoppingForVerifierNotice="停止窥探并检查hashes."
HandshakeSnooperSearchingForHashesNotice="在捕获文件中搜索hashes."
HandshakeSnooperArbiterAbortedWarning="${CYel}失败${CClr}: 操作已中止，未找到有效的hash."
HandshakeSnooperArbiterSuccededNotice="${CGrn}成功${CClr}: 检测到有效hash并保存到fluxion的数据库中."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel 攻击完成，关闭此窗口并开始另一次攻击.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
