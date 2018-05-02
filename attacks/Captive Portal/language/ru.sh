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
CaptivePortalAPServiceHostapdOption="Rogue AP - hostapd (${CGrn}рекомендуется$CClr)"
CaptivePortalAPServiceAirbaseOption="Rogue AP - airbase-ng (${CYel}медленная$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="Выбор метода верификации пароля"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="Выбор источника SSL сертификата для перехватывающего портала."
CaptivePortalCertificateSourceGenerateOption="Создание SSL сертификата"
CaptivePortalCertificateSourceRescanOption="Поиск SSL сертификата (${CClr}искать снова$CGry)"
CaptivePortalCertificateSourceDisabledOption="Нет (${CYel} SSL отключено$CGry)"
CaptivePortalUIQuery="Выберите интерфейс перехватывающего портала для мошеннической сети."
CaptivePortalGenericInterfaceOption="Обычный Портал"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Выберите тип Интернет-соединения для мошеннической сети."
CaptivePortalConnectivityDisconnectedOption="отключено (${CGrn}рекомендуется$CClr)"
CaptivePortalConnectivityEmulatedOption="эмулирован"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
