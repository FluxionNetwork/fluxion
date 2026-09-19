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
CaptivePortalVerificationMethodPyritOption="hash - pyrit"
CaptivePortalVerificationMethodCowpattyOption="hash - cowpatty (${CGrn}default${CClr})"
CaptivePortalVerificationMethodAircrackNG="hash - aircrack-ng (${CYel}unreliable${CClr})"

# FLUXSCRIPT END
