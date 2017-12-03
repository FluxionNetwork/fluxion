#!/bin/bash
# identifier: Handshake Snopper
# description: Obțineți hash criptografic WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Select a method of handshake retrieval"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}passive$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}aggressive$CClr)"
HandshakeSnooperMdk3MethodOption="mdk3 deauthentication (${CRed}aggressive$CClr)"
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
HandshakeSnooperSnoopingForNSecondsNotice="Snooping for \$HANDSHAKEVerifierInterval seconds."
HandshakeSnooperStoppingForVerifierNotice="Stopping snooper & checking for hashes."
HandshakeSnooperSearchingForHashesNotice="Searching for hashes in the capture file."
HandshakeSnooperArbiterAbortedWarning="${CYel}Aborted${CClr}: The operation's been aborted, no valid hash was found."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Success${CClr}: A valid hash was detected and saved to fluxion's database."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel attack completed, close this window and start another attack.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
