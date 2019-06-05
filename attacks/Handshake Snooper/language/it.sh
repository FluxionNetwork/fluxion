#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Acquisisce gli hash di crittografia WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Select an interface for monitoring & jamming."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Seleziona il metodo di scoperta dell'handshake"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}passivo$CClr)"
HandshakeSnooperAireplayMethodOption="deautenticazione aireplay-ng (${CRed}aggressivo$CClr)"
HandshakeSnooperMdk4MethodOption="deautenticazione mdk4 (${CRed}aggressivo$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Ogni quanto il verificatore deve controllare per l'handshake?"
HandshakeSnooperVerifierInterval30SOption="Ogni 30 secondi (${CGrn}raccomandato${CClr})."
HandshakeSnooperVerifierInterval60SOption="Ogni 60 secondi."
HandshakeSnooperVerifierInterval90SOption="Ogni 90 secondi."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Come deve avvenire la verifica?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="In modo asincrono (${CYel}solo sistemi veloci${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="In modo sincrono (${CGrn}raccomandato${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr arbiter daemon avviato."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping per \$HandshakeSnooperVerifierInterval secondi."
HandshakeSnooperStoppingForVerifierNotice="Stop dello snooper & Ricerca degli hash."
HandshakeSnooperSearchingForHashesNotice="Ricerca degli hash nel file di cattura."
HandshakeSnooperArbiterAbortedWarning="${CYel}Cancellato${CClr}: L'operazione è stata cancellata, nessun hash trovato."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Riuscito${CClr}: Un hash valido è stato rilevato e salvato nel database fluxion."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel attacco completato, chiudi questa finestra ed inizia un nuovo attacco.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
