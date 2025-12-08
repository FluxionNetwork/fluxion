#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Retrieves WPA/WPA2 encryption hashes.(translate)

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Select an interface for monitoring & jamming."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Izberi metodo pridobitve handshake-a"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}pasiven$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}agresiven$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}agresiven$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="How often should the verifier check for a handshake?"
HandshakeSnooperVerifierInterval30SOption="Every 30 seconds (${CGrn}recommended${CClr})."
HandshakeSnooperVerifierInterval60SOption="Every 60 seconds."
HandshakeSnooperVerifierInterval90SOption="Every 90 seconds."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="How should verification occur?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchronously (${CYel}fast systems only${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchronously (${CGrn}recommended${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr arbiter daemon running."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping for \$HandshakeSnooperVerifierInterval seconds."
HandshakeSnooperStoppingForVerifierNotice="Stopping snooper & checking for hashes."
HandshakeSnooperSearchingForHashesNotice="Searching for hashes in the capture file."
HandshakeSnooperArbiterAbortedWarning="${CYel}Aborted${CClr}: The operation's been aborted, no valid hash was found."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Success${CClr}: A valid hash was detected and saved to fluxion's database."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel attack completed, close this window and start another attack.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
