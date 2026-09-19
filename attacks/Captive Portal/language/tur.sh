#!/usr/bin/env bash
# identifier: Captive Portal
# description: "Evil Twin" access point'i oluşturur

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Jamming(parazit oluşturma) için bir arabirim seçin."
CaptivePortalAccessPointInterfaceQuery="Access point oluşturmak için bir arabirim seçin."
CaptivePortalCannotStartInterfaceError="${CRed}Captive portal arabirimi oluşturulamadı$CClr, geri dönülüyor!"
CaptivePortalStaringAPServiceNotice="Captive Portal access point servisi başlatılıyor..."
CaptivePortalStaringAPRoutesNotice="Captive point access point rotaları devreye sokuluyor..."
CaptivePortalStartingDHCPServiceNotice="Access point DHCP servisi bir daemon olarak başlatılıyor..."
CaptivePortalStartingDNSServiceNotice="Access point DNS servisi bir daemon olarak başlatılıyor..."
CaptivePortalStartingWebServiceNotice="Access point Captive Portal servisi bir daemon olarak başlatılıyor..."
CaptivePortalStartingJammerServiceNotice="Access point jammer'ı bir daemon olarak başlatılıyor..."
CaptivePortalStartingAuthenticatorServiceNotice="Doğrulayıcı script çalıştırılıyor..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Bir access point servisi seçin"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}önerilen$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}yavaş$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Parola doğrulama yöntemi seçin"
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}varsayılan${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}tutarsız${CClr})"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Captive Portal için SSL sertifikası kaynağı seçin"
CaptivePortalCertificateSourceGenerateOption="SSL sertifikası oluştur"
CaptivePortalCertificateSourceRescanOption="SSL sertifikası tespit et (${CClr}yeniden ara$CGry)"
CaptivePortalCertificateSourceDisabledOption="Hiçbiri (${CYel}SSL'i devre dışı bırak$CGry)"
CaptivePortalUIQuery="Rogue network için bir Captive Portal arabirimi seçin."
CaptivePortalGenericInterfaceOption="Sıradan Portal"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Rogue network için internet bağlantısı tipi seçin."
CaptivePortalConnectivityDisconnectedOption="internet bağlantısı yok (${CGrn}önerilen$CClr)"
CaptivePortalConnectivityEmulatedOption="taklit edilen"
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
