#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Acquires WPA/WPA2 encryption hashes.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Selecteer een interface voor monitoring & jamming."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Selecteer een methode voor handshake verkrijgen"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}passief$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}agressief$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}agressief$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Hoe vaak moet er gecontrollerd worden voor een handshake?"
HandshakeSnooperVerifierInterval30SOption="Elke 30 seconden (${CGrn}aangeraden${CClr})."
HandshakeSnooperVerifierInterval60SOption="Elke 60 seconden."
HandshakeSnooperVerifierInterval90SOption="Elke 90 seconden."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Hoe vaak zal er geverifieerd moeten worden?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchroon (${CYel}alleen voor snelle systemen${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchroon (${CGrn}aangeraden${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr arbiter daemon draait."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping voor \$HandshakeSnooperVerifierInterval seconden."
HandshakeSnooperStoppingForVerifierNotice="Stop snooper & controle voor hashes."
HandshakeSnooperSearchingForHashesNotice="Zoek naar hashes in het capture bestand."
HandshakeSnooperArbiterAbortedWarning="${CYel}Afgebroken${CClr}: De operatie is afgebroken, geen geldige hash gevonden."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Gelukt${CClr}: Een geldige hash is gedetecteerd en opgeslagen in de fluxion database."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel aanval afgerond, Sluit dit scherm en start een andere aanval.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
