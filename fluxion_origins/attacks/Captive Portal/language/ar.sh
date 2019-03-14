#!/usr/bin/env bash
# identifier: Captive Portal
# description: Creates an "evil twin" access point.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="إختر بطاقة شبكة من أجل التشويش."
CaptivePortalAccessPointInterfaceQuery="إختر بطاقة شبكة لتكون نقطة الوصول."
CaptivePortalCannotStartInterfaceError="${CRed}غير قادر على بدء واجهة البوابة المقيدة$CClr, returning!"
CaptivePortalStaringAPServiceNotice="بدء تشغيل خدمة نقطة الوصول للبوابة المقيدة..."
CaptivePortalStaringAPRoutesNotice="بدء توجيه مسارات نقطة الوصول المقيدة..."
CaptivePortalStartingDHCPServiceNotice="بدء تشغيل خدمة الـ DHCP لنقطة الوصول في الخلفية..."
CaptivePortalStartingDNSServiceNotice="بدء تشغيل خدمة الـ DNS لنقطة الوصول في الخلفية..."
CaptivePortalStartingWebServiceNotice="بدء تشغيل خدمة الـ WEB لنقطة الوصول في الخلفية..."
CaptivePortalStartingJammerServiceNotice="بدء تشغيل التشويش لنقطة الوصول في الخلفية..."
CaptivePortalStartingAuthenticatorServiceNotice="بدء برنامج المصادقة النصي..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="إختر خدمة نقطة وصول"
CaptivePortalAPServiceHostapdOption="نقطة الوصول الاحتيالية - hostapd (${CGrn}مستحسن$CClr)"
CaptivePortalAPServiceAirbaseOption="نقطة الوصول الاحتيالية - airbase-ng (${CYel}slow$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="إختر طريقة التحقق من كلمة المرور"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="حدد مصدر شهادة SSL الخاص بالبوابة المقيدة."
CaptivePortalCertificateSourceGenerateOption="قم بإنشاء شهادة SSL"
CaptivePortalCertificateSourceRescanOption="كشف شهادة SSL (${CClr}بحث مجددا$CGry)"
CaptivePortalCertificateSourceDisabledOption="لا شيء (${CYel}تعطيل SSL$CGry)"
CaptivePortalUIQuery="إختر بطاقة شبكة من أجل البوابة المقيدة للشبكة الاحتيالية."
CaptivePortalGenericInterfaceOption="بوابة عامة"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="حدد نوع اتصال إنترنت للشبكة الاحتيالية."
CaptivePortalConnectivityDisconnectedOption="قطع الاتصال (${CGrn}مستحسن$CClr)"
CaptivePortalConnectivityEmulatedOption="محاكات"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
