#!/bin/bash
# identifier: Handshake Snopper
# description: 检索WPA/WPA2加密散列。

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="选择一种方式来检查握手包获取状态"
HandshakeSnooperMonitorMethodOption="监听模式 (${CYel}被动$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng 解除认证方式 (${CRed}侵略性$CClr)"
HandshakeSnooperMdk3MethodOption="mdk3 解除认证方式 (${CRed}侵略性$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="How often should the verifier check for a handshake?"
HandshakeSnooperVerifierInterval10SOption="Every 10 seconds (${CYel}fast systems only${CClr})."
HandshakeSnooperVerifierInterval30SOption="Every 30 seconds (${CGrn}recommended${CClr})."
HandshakeSnooperVerifierInterval90SOption="Every 90 seconds."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="How should verification occur?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchronously (${CYel}fast systems only${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchronously."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr arbiter daemon running."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping for \$HANDSHAKEVerifierInterval seconds."
HandshakeSnooperStoppingForVerifierNotice="Stopping snooper & checking for hashes."
HandshakeSnooperSearchingForHashesNotice="Searching for hashes in the capture file."
HandshakeSnooperArbiterAbortedWarning="${CYel}Aborted${CClr}: The operation's been aborted, no valid hash was found."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Success${CClr}: A valid hash was detected and saved to fluxion's database."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
