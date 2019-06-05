#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Získává šifrovací hash WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Vyberte rozhraní pro monitorování/rušení."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Vyberte metodu získání handshaku"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}pasivní$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}agresivní$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}agresivní$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Jak často kontrolovat získání handshaku?"
HandshakeSnooperVerifierInterval30SOption="Každých 30 vteřin (${CGrn}doporučeno${CClr})."
HandshakeSnooperVerifierInterval60SOption="Každých 60 vteřin."
HandshakeSnooperVerifierInterval90SOption="Každých 90 vteřin."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Jak by mělo dojít k ověření?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchronně (${CYel}pouze pro rychlé PC${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchronně (${CGrn}doporučeno${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr daemon běží."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping for \$HandshakeSnooperVerifierInterval seconds."
HandshakeSnooperStoppingForVerifierNotice="Zastavuji snooper & kontroluji hashe."
HandshakeSnooperSearchingForHashesNotice="Hledám hashe v zachyceném souboru."
HandshakeSnooperArbiterAbortedWarning="${CYel}Přerušeno${CClr}: Operace byla přerušena, nebyl nalezen žádný platný hash."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Úspěch${CClr}: Platný hash byl detekován a uložen do databáze fluxionu."
HandshakeSnooperArbiterCompletedTip="Útok ${CBCyn}Handshake Snooper$CBYel dokončen, zavřete toto okno a začněte další útok.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
