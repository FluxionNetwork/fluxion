#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: WPA / WPA2 şifreleme karma değerlerini alır.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="İzleme ve jamming için bir arayüz seçiniz."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Tokalasma edinme methodu seciniz"
HandshakeSnooperMonitorMethodOption="Monitor (${CYel}pasif$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}agresif$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}agresif$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Doğrulayıcı ne sıklıkta bir tokalasma için kontrol etmeli?"
HandshakeSnooperVerifierInterval30SOption="Her 30 saniyede (${CGrn}tavsıye edilen${CClr})."
HandshakeSnooperVerifierInterval60SOption="Her 60 saniyede."
HandshakeSnooperVerifierInterval90SOption="Her 90 saniyede."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Doğrulama nasıl yapılmalıdır?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asenkron (${CYel}sadece hızlı sistemler${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Senkronize (${CGrn}tavsıye edilen${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Tokalaşma Snooper$CClr arbiter çalışan daemon."
HandshakeSnooperSnoopingForNSecondsNotice="Snooping \$HandshakeSnooperVerifierInterval saniye."
HandshakeSnooperStoppingForVerifierNotice="Snooper'ı durdurma & karmaları kontrol etme."
HandshakeSnooperSearchingForHashesNotice="Yakalama dosyasında karma aranıyor."
HandshakeSnooperArbiterAbortedWarning="${CYel}İptal edildi${CClr}: İşlem iptal edildi, geçerli bir karma bulunamadı."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Başarılı${CClr}: Geçerli bir karma tespit edildi ve fluxion veritabanına kaydedildi."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Tokalasma Snooper$CBYel saldırı tamamlandı, bu pencereyi kapatın ve başka bir saldırı başlatın.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
