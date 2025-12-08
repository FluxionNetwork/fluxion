#!/usr/bin/env bash
# identifier: Handshake Snooper
# deskripsi: Mendapatkan hash enkrikpsi  WPA/WPA2.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Pilih antarmuka untuk pemantauan & pengganggu."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Pilih metode pengambilan handshake"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}pasif$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}agresif$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}agresif$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Seberapa sering pemverifikasi harus memeriksa handshake?"
HandshakeSnooperVerifierInterval30SOption="setiap 30 detik (${CGrn}rekomendasi${CClr})."
HandshakeSnooperVerifierInterval60SOption="setiap 60 detik."
HandshakeSnooperVerifierInterval90SOption="setiap 90 detik."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Bagaimana seharusnya verifikasi terjadi?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asynchronously (${CYel}sistem cepat saja${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Synchronously (${CGrn}rekomendasi${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Pengintai handshake$CClr daemon pemisah sedang berjalan."
HandshakeSnooperSnoopingForNSecondsNotice="Mengintai untuk \$HandshakeSnooperVerifierInterval detik."
HandshakeSnooperStoppingForVerifierNotice="Menghentikan pengintai & memeriksa hash."
HandshakeSnooperSearchingForHashesNotice="Mencari hash di file tangkapan."
HandshakeSnooperArbiterAbortedWarning="${CYel}dibatalkan${CClr}: Operasi telah dibatalkan, hash yang valid tidak ditemukan.."
HandshakeSnooperArbiterSuccededNotice="${CGrn}sukses${CClr}: Hash yang valid terdeteksi dan disimpan ke database fluxion."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Pengintai handshake$CBYel serangan selesai, tutup jendela ini dan mulai serangan lain.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
