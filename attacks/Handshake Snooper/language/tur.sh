#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: WPA/WPA2 encryption hash değerlerini alır.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Monitör & Jamming(parazit oluşturma) için bir arabirim seçin."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Handshake ele geçirilmesi için bir yöntem seçin"
HandshakeSnooperMonitorMethodOption="Monitör (${CYel}pasif$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}agresif$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}agresif$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Doğrulacı ne kadar aralıklarla hash kontrolü yapsın?"
HandshakeSnooperVerifierInterval30SOption="Her 30 saniyede (${CGrn}önerilen${CClr})."
HandshakeSnooperVerifierInterval60SOption="Her 60 saniyede."
HandshakeSnooperVerifierInterval90SOption="Her 90 saniyede."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Doğrulama işlemi nasıl yapılsın?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Asenkron (${CYel}hızlı sistemler için${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Senkron (${CGrn}önerilen${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}Handshake Snooper$CClr daemon'ı çalışıyor."
HandshakeSnooperSnoopingForNSecondsNotice="\$HandshakeSnooperVerifierInterval saniye boyunca izleniyor..."
HandshakeSnooperStoppingForVerifierNotice="İzleme durduruluyor & hash kontrolü yapılıyor"
HandshakeSnooperSearchingForHashesNotice="Capture dosyasında hash aranıyor..."
HandshakeSnooperArbiterAbortedWarning="${CYel}Durduruldu${CClr}: Bu işlem durduruldu, geçerli bir hash bulunamadı."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Başarı${CClr}: Geçerli bir hash tespit edildi ve fluxion veritabanına kaydedildi."
HandshakeSnooperArbiterCompletedTip="${CBCyn}Handshake Snooper$CBYel saldırısı tamamlandı, bu pencereyi kapatın ve başka bir saldırıya başlayın.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
