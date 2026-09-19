#!/usr/bin/env bash
# identifier: Captive Portal
# deskripsi: membuat sebuah titik akses "evil twin".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Pilih antarmuka jaringan untuk mengganggu."
CaptivePortalAccessPointInterfaceQuery="Pilih antarmuka untuk titik akses."
CaptivePortalCannotStartInterfaceError="${CRed}Tidak dapat memulai antarmuka Portal Tawanan$CClr, kembali!"
CaptivePortalStaringAPServiceNotice="Memulai layanan titik akses Portal Tawanan..."
CaptivePortalStaringAPRoutesNotice="Memulai router titik akses Portal Tawanan..."
CaptivePortalStartingDHCPServiceNotice="Memulai titik akses DHCP sebagai daemon..."
CaptivePortalStartingDNSServiceNotice="Memulai titik akses DNS sebagai daemon..."
CaptivePortalStartingWebServiceNotice="Memulai titik akses Portal Tawanan sebagai daemon..."
CaptivePortalStartingJammerServiceNotice="Memulai titik akses pengganggu sebagai daemon..."
CaptivePortalStartingAuthenticatorServiceNotice="Memulai skrip pengautentikasi..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Pilih sebuah layanan titik akses"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}rekomendasi$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}lambat$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Pilih metode verifikasi kata sandi"
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}default${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}tidak bisa diandalkan${CClr})"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Pilih sumber sertifikat SSL untuk Portal Tawanan."
CaptivePortalCertificateSourceGenerateOption="Buat sebuah sertifikat SSL"
CaptivePortalCertificateSourceRescanOption="Deteksi sertifikat SSL (${CClr}cari lagi$CGry)"
CaptivePortalCertificateSourceDisabledOption="Tidak ada (${CYel}nonaktifkan ssl$CGry)"
CaptivePortalUIQuery="Pilih antarmuka Portal Tawanan untuk jaringan penipu."
CaptivePortalGenericInterfaceOption=" Portal Umum"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Pilih jenis konektivitas internet untuk jaringan penipu."
CaptivePortalConnectivityDisconnectedOption="Terputus (${CGrn}rekomendasi$CClr)"
CaptivePortalConnectivityEmulatedOption="Meniru"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# English fallbacks (auto-added; translate when possible)
CaptivePortalAPChannelQuery="Select the rogue access point's channel"
CaptivePortalAPChannelTargetOption="Same as target (${CGrn}recommended$CClr)"
CaptivePortalAPChannelCustomOption="Custom channel (${CYel}different band$CClr)"
CaptivePortalAPChannelCustomNotice="Enter a channel for the rogue access point."
CaptivePortalAPChannelExampleTip="Example channel"
CaptivePortalAPChannelBandsTip="Interface supports"
CaptivePortalAPChannelInvalidError="${CRed}Invalid channel or unsupported by the access point interface$CClr, try again."
CaptivePortalAPChannelSharedRadioWarning="${CYel}Warning$CClr: jammer and access point share one radio; a single card cannot cover both bands at once. Use a second interface."
CaptivePortalAPChannelUnsupportedWarning="${CRed}The access point interface can't host on the target's band$CClr, pick a ${CGrn}custom channel$CClr on a band it supports."
CaptivePortalAPChannelUnsupportedAutoError="The access point interface can't host on the requested channel's band. Pass --ap-channel with a supported channel, or select a different --ap-interface."

# FLUXSCRIPT END
