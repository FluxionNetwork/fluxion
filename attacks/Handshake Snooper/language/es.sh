#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Adquiere los hashes de cifrado WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Selecione una interfaz para monitorear y jammear."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Seleccione un método para recupera el handshake"
HandshakeSnooperMonitorMethodOption="Monitorizar (${CYel}passive$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}aggressive$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}aggressive$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="¿Con qué frecuencia debe validadar el handshake?"
HandshakeSnooperVerifierInterval30SOption="Cada 30 segundos (${CGrn}recommended${CClr})."
HandshakeSnooperVerifierInterval60SOption="Cada 60 segundos."
HandshakeSnooperVerifierInterval90SOption="Cada 90 segundos."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="¿Cuándo debe verificar?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asíncrono (${CYel} sistemas rápidos ${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Síncrono (${CGrn} recomendado ${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn} Sercicio Handshake Snooper$CClr ejecutándose."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping para \$HandshakeSnooperVerifierInterval segundos."
HandshakeSnooperStoppingForVerifierNotice="Parando snooper y verificando hashes."
HandshakeSnooperSearchingForHashesNotice="Buscando hashes en el fichero capturado."
HandshakeSnooperArbiterAbortedWarning="${CYel}Cancelando${CClr}: La operación fue cancelada, no se ha encontrado un hash válido."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Success${CClr}: Hash correcto detectado y guardado en la base de daros de fluxion."
HandshakeSnooperArbiterCompletedTip="Ataque ${CBCyn}Handshake Snooper$CBYel completado, cierra esta ventana e inicia otro ataque.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
