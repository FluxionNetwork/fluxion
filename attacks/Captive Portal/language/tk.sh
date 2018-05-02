#!/usr/bin/env bash
# identifier: Esaret Portalı
# description: "Kötü ikiz" bir erişim noktası oluşturur.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Select an interface for jamming."
CaptivePortalAccessPointInterfaceQuery="Select an interface for the access point."
CaptivePortalCannotStartInterfaceError="${CRed}Esaret Portali arayuzu baslatilamadi$CClr, geri donuluyor!"
CaptivePortalStaringAPServiceNotice="Esaret Portali Erisim Noktasi servisi baslatiliyor..."
CaptivePortalStaringAPRoutesNotice="Esaret Portali Erisim Noktasi yonlendirmeleri baslatiliyor..."
CaptivePortalStartingDHCPServiceNotice="Erisim noktasi DHCP servisi daemon olarak baslatiliyor..."
CaptivePortalStartingDNSServiceNotice="Erisim noktasi DNS servisi deamon olarak baslatiliyor..."
CaptivePortalStartingWebServiceNotice="Erisim noktasi Esaret Portali deamon olarak baslatiliyor..."
CaptivePortalStartingJammerServiceNotice="Erisim noktasi jammer deamon olarak baslatiliyor..."
CaptivePortalStartingAuthenticatorServiceNotice="Dogrulayici kodu baslatiliyor..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Select an access point service"
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}recommended$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Sifre dogrulama methodu seciniz"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Esaret Portali icin SSL sertifika kaynagi seciniz."
CaptivePortalCertificateSourceGenerateOption="SSL sertifikasi olustur"
CaptivePortalCertificateSourceRescanOption="SSL sertifikasi belirle (${CClr}tekrar ara$CGry)"
CaptivePortalCertificateSourceDisabledOption="None (${CYel}disable SSL$CGry)"
CaptivePortalUIQuery="Duzenbaz ag icin Esaret Portali arayuzu seciniz."
CaptivePortalGenericInterfaceOption="Generic Portal"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}recommended$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
