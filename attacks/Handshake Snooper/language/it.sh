#!/bin/bash
# identifier: Handshake Snopper
# description: Acquisisce gli hash di crittografia WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Seleziona il metodo di scoperta dell'handshake"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}passivo$CClr)"
HandshakeSnooperAireplayMethodOption="deautenticazione aireplay-ng (${CRed}aggressivo$CClr)"
HandshakeSnooperMdk3MethodOption="deautenticazione mdk3 (${CRed}aggressivo$CClr)"
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
