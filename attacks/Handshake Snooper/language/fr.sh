#!/bin/bash
# identifier: Handshake Snopper
# description: Acquitte les hachages de cryptage WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Sélectionnez une méthode de récupération de handshake"
HandshakeSnooperMonitorMethodOption="Monitorer (${CYel}passif$CClr)"
HandshakeSnooperAireplayMethodOption="Désauthentification aireplay-ng (${CRed}aggressif$CClr)"
HandshakeSnooperMdk3MethodOption="Désauthentification mdk3 (${CRed}aggressif$CClr)"
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

# FLUXSCRIPT END
