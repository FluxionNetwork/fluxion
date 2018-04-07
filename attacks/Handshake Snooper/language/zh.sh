#!/bin/bash
# identifier: Handshake Snopper
# description: 检索WPA/WPA2加密散列。

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="选择一种方式来检查握手包获取状态"
HandshakeSnooperMonitorMethodOption="监听模式 (${CYel}被动$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng 解除认证方式 (${CRed}侵略性$CClr)"
HandshakeSnooperMdk3MethodOption="mdk3 解除认证方式 (${CRed}侵略性$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="每隔多久检查一次握手包"
HandshakeSnooperVerifierInterval30SOption="每30秒钟 (${CGrn}推荐${CClr})."
HandshakeSnooperVerifierInterval60SOption="每60秒钟"
HandshakeSnooperVerifierInterval90SOption="每90秒钟"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="选择验证方式"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchronously (${CYel}fast systems only${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchronously (${CGrn}推荐${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}抓取握手包$CClr arbiter后台运行"
HandshakeSnooperSnoopingForNSecondsNotice="侦听 \$HANDSHAKEVerifierInterval 秒"
HandshakeSnooperStoppingForVerifierNotice="停止嗅探并检查握手包"
HandshakeSnooperSearchingForHashesNotice="在嗅探文件中寻找有效握手包文件"
HandshakeSnooperArbiterAbortedWarning="${CYel}中止${CClr}: 操作已中止,找不到有效的握手包文件"
HandshakeSnooperArbiterSuccededNotice="${CGrn}成功${CClr}: 保存一个有效的握手包文件到Fluxion\attacks\Handshake Snooper\Handshakes"
HandshakeSnooperArbiterCompletedTip="${CBCyn}抓取握手包$CBYel 攻击完成后，关闭此窗口并开始另一次攻击$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
