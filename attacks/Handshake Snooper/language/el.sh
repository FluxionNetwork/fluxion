#!/bin/bash
# identifier: Handshake Snopper
# description: Αποκτά τα hashes κρυπτογράφησης WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Διαλεξτε μια μεθοδο για την αποκτηση του handshake"
HandshakeSnooperMonitorMethodOption="Παρακολουθηση (${CYel}αβλαβης$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng αποσυνδεση (${CRed}επιθετικη$CClr)"
HandshakeSnooperMdk3MethodOption="mdk3 αποσυνδεση (${CRed}επιθετικη$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Ανα ποση ωρα να ελεγχω για το handshake?"
HandshakeSnooperVerifierInterval30SOption="Καθε 30 δευτερολεπτα(${CGrn}προτεινομενο${CClr})."
HandshakeSnooperVerifierInterval60SOption="Καθε 60 δευτερολεπτα."
HandshakeSnooperVerifierInterval90SOption="Καθε 90 δευτερολεπτα."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Πως να κανω την επιβεβαιωση?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Ασυγχρονα (${CYel}γρηγορα συστηματα μονο${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Συγχρονισμενα (${CGrn}προτεινομενο${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}ανιχνευτης Handshake$CClr ελεγκτης υπηρεσιας τρεχει."
HandshakeSnooperSnoopingForNSecondsNotice="ελεγχος για \$HANDSHAKEVerifierInterval δευτερολεπτα."
HandshakeSnooperStoppingForVerifierNotice="τερματισμος ανιχνευτη & ελεγχος για hashes."
HandshakeSnooperSearchingForHashesNotice="ψαχνω για hashes στο προσληφθεν αρχειο."
HandshakeSnooperArbiterAbortedWarning="${CYel}τερματιστηκε${CClr}: Η διαδικασια τερματιστηκε, δε βρεθηκε εγκυρο hash."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Επιτυχες${CClr}: Ενα εγκυρο hash βρεθηκε και αποθηκευτηκε στη βαση δεδομενων του Fluxion."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Ελεγκτης$CBYel η επιθεση ολοκληρωθηκε,κλειστε αυτο το παραθυρο και ξεκινηστε μια αλλη επιθεση.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END Ζαρτας
