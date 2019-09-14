#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Získa WPA/WPA2 kryptovancie 'hashes'.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Select an interface for monitoring & jamming."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Vyberte metódu získania 'handshake'"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}passive$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}aggressive$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}aggressive$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Ako často sa má kontrolovať 'handshake'?"
HandshakeSnooperVerifierInterval30SOption="Každých 30 sekúnd (${CGrn}odporúčané${CClr})."
HandshakeSnooperVerifierInterval60SOption="Každých 60 sekúnd."
HandshakeSnooperVerifierInterval90SOption="Každých 90 sekúnd."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Ako sa má overovať?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchrónne (${CYel}len rýchle systémy${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchrónne (${CGrn}odporúčané${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr arbiter daemon aktivovaný."
HandshakeSnooperSnoopingForNSecondsNotice="Špehujem \$HandshakeSnooperVerifierInterval sekúnd."
HandshakeSnooperStoppingForVerifierNotice="Prerušujem špehovanie & kontrolujem 'hashes'."
HandshakeSnooperSearchingForHashesNotice="Hľadám 'hashes' v 'capture' súbore."
HandshakeSnooperArbiterAbortedWarning="${CYel}Prerušené${CClr}: Operácia bola prerušená, žiadny platný 'hash' neboj nájdený."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Úspešné${CClr}: Platný 'hash' bol detekovaný a uložený do fluxion databázy."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel attack completed, close this window and start another attack.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
