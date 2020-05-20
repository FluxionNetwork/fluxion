#!/usr/bin/env bash
# identifier: Captive Portal
# description: Создаёт точку доступа "Злой Двойник".

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalJammerInterfaceQuery="Выберите интерфейс для глушения."
CaptivePortalAccessPointInterfaceQuery="Выберите интерфейс для точки доступа."
CaptivePortalCannotStartInterfaceError="${CRed}Не получается запустить перехватывающий портал interface$CClr, возврат!"
CaptivePortalStaringAPServiceNotice="Запуск службы точки доступа с Перехватывающим Порталом..."
CaptivePortalStaringAPRoutesNotice="Запуск маршрутизации точки доступа с Перехватывающим Порталом..."
CaptivePortalStartingDHCPServiceNotice="Запуск службы DHCP точки доступа в качестве демона..."
CaptivePortalStartingDNSServiceNotice="Запуск службы DNS точки доступа в качестве демона..."
CaptivePortalStartingWebServiceNotice="Запуск точки доступа с Перехватывающим Порталом в качестве демона..."
CaptivePortalStartingJammerServiceNotice="Запуск глушителя точки доступа в качестве демона..."
CaptivePortalStartingAuthenticatorServiceNotice="Запуск скрипта аутентификации..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalAPServiceQuery="Выберите службу точки доступа"
CaptivePortalAPServiceHostapdOption="Мошенническая ТД - hostapd (${CGrn}рекомендуется$CClr)"
CaptivePortalAPServiceAirbaseOption="Мошенническая ТД - airbase-ng (${CYel}медленная$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Выберите метод верификации пароля"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Выберите источник SSL-сертификата для перехватывающего портала."
CaptivePortalCertificateSourceGenerateOption="Создать новый SSL-сертификат"
CaptivePortalCertificateSourceRescanOption="Найти SSL-сертификат (${CClr}искать снова$CGry)"
CaptivePortalCertificateSourceDisabledOption="Не использовать (${CYel}SSL отключен$CGry)"
CaptivePortalUIQuery="Выберите интерфейс перехватывающего портала для мошеннической сети."
CaptivePortalGenericInterfaceOption="Обычный Портал"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Выберите тип Интернет-соединения для мошеннической сети."
CaptivePortalConnectivityDisconnectedOption="отключено (${CGrn}рекомендуется$CClr)"
CaptivePortalConnectivityEmulatedOption="эмулированное"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
