#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Acquires WPA/WPA2 encryption hashes.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Válassz ki egy interfészt a felderítéshez és a zavaráshoz."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Válaszd ki a kézfogás visszakeresésének módszerét"
HandshakeSnooperMonitorMethodOption="Felderítés (${CYel}passzív$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deautentikálás (${CRed}agresszív$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deautentikálás (${CRed}agresszív$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Milyen gyakran kell a hitelesítőnek ellenőriznie a kézfogást?"
HandshakeSnooperVerifierInterval30SOption="Minden 30 másodpercben (${CGrn}ajánlott${CClr})."
HandshakeSnooperVerifierInterval60SOption="Minden 60 másodpercben."
HandshakeSnooperVerifierInterval90SOption="Minden 90 másodpercben."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Hogyan kell az ellenőrzésnek megtörténnie?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Aszinkron módon (${CYel}csak gyors rendszereknél${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Szinkron módon (${CGrn}ajánlott${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Kézfogás felderítő$CClr arbiter démon fut."
HandshakeSnooperSnoopingForNSecondsNotice="Felderítés \$HandshakeSnooperVerifierInterval másodpercenként."
HandshakeSnooperStoppingForVerifierNotice="Kézfogás felderítő leállítása és a hash -ek ellenőrzése."
HandshakeSnooperSearchingForHashesNotice="Hash értékek keresése a capture fájlban."
HandshakeSnooperArbiterAbortedWarning="${CYel}Megszakítva${CClr}: A művelet megszakadt, nem található érvényes hash."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Siker${CClr}: Van érvényes hash, és a fluxion elmentette az adatbázisba."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Kézfogás felderítő$CBYel támadás befejeződött, zárd be ezt az ablakot, és indíts egy újabb támadást.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
