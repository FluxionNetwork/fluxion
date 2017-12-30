#!/bin/bash
# identifier:  Πύλη αιχμαλωσίας
# description: Δημιουργεί ένα σημείο πρόσβασης "κακό δίδυμο".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Διαλεξτε μια διεπαφη για την πύλη αιχμαλωσίας."
CaptivePortalStartingInterfaceNotice="Ξεκιναω το περιβάλλον της πύλης αιχμαλωσίας..."
CaptivePortalCannotStartInterfaceError="${CRed}Αδυνατον να ξεκινησω το περιβάλλον της πυλης αιχμαλωσιας$CClr, επιστρεφω!"
CaptivePortalStartedInterfaceNotice="${CGrn}Success${CClr}, περιβάλλον πυλης αιχμαλωσιας έτοιμο!"
CaptivePortalStaringAPServiceNotice="Ξεκιναω την υπηρεσία για το περιβάλλον της πύλης αιχμαλωσίας..."
CaptivePortalStaringAPRoutesNotice="Ξεκιναω τις διαδρομες για το περιβάλλον της  πύλης αιχμαλωσίας..."
CaptivePortalStartingDHCPServiceNotice="Ξεκιναω τις υπηρεσίες του δικτυου πρόσβασης DHCP σαν daemon..."
CaptivePortalStartingDNSServiceNotice="Ξεκιναω τις υπηρεσιες DNS του δικτύου πρόσβασης σαν daemon..."
CaptivePortalStartingWebServiceNotice="Ξεκιναω την πυλη αιχμαλωσίας του δικτύου πρόσβασης σαν daemon..."
CaptivePortalStartingJammerServiceNotice="Ξεκιναω τον παρεμβολεα του δικτύου πρόσβασης σαν daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Ξεκιναω το πρόγραμμα επιβεβαίωσης..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Μέθοδος επαλήθευσης κωδικού πρόσβασης"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Διαλεξε την πηγη του πιστοποιητικού SSL για την πύλη αιχμαλωσίας."
CaptivePortalCertificateSourceGenerateOption="Δημιουργηστε ενα πιστοποιητικό SSL"
CaptivePortalCertificateSourceRescanOption="Ανιχνευση πιστοποιητικού (${CClr}Ψαξε ξανά$CGry)"
CaptivePortalCertificateSourceDisabledOption="Κανένα (${CYel} απενεργοποίηση SSL$CGry)"
CaptivePortalUIQuery="Διαλεξε διεπαφή της πύλης αιχμαλωσίας για το κακοβουλο δίκτυο."
CaptivePortalGenericInterfaceOption="Γενική Πύλη"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Διαλεξτε τροπο δικτύωσης για το κακόβουλο Δίκτυο."
CaptivePortalConnectivityDisconnectedOption="Αποσυνδεδεμενο (${CGrn}προτεινωμενο$CClr)"
CaptivePortalConnectivityEmulatedOption="προσποιητα συνδεδεμενο"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END zartaz edit :D
