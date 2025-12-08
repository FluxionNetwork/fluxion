#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Получает зашифрованные WPA/WPA2 хэши (рукопожатия).

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="Выберите интерфейс для мониторинга и глушения."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="Выберите метод для получения handshake"
HandshakeSnooperMonitorMethodOption="Мониторинг (${CYel}пассивный$CClr)"
HandshakeSnooperAireplayMethodOption="aireplay-ng deauthentication (${CRed}агрессивный$CClr)"
HandshakeSnooperMdk4MethodOption="mdk4 deauthentication (${CRed}агрессивный$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="Как часто проверять наличие рукопожатия?"
HandshakeSnooperVerifierInterval30SOption="Каждые 30 секунд (${CGrn}рекомендуется${CClr})."
HandshakeSnooperVerifierInterval60SOption="Каждые 60 секунд."
HandshakeSnooperVerifierInterval90SOption="Каждые 90 секунд."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="Как должна происходить верификация?"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="Асинхронно (${CYel}только на быстрых системах${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="Синхронно (${CGrn}рекомендуется${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="Запуск демона ${CCyn}Разведчик рукопожатий$CClr."
HandshakeSnooperSnoopingForNSecondsNotice="Проверка каждые \$HandshakeSnooperVerifierInterval секунд."
HandshakeSnooperStoppingForVerifierNotice="Остановка атаки и проверка хэшей."
HandshakeSnooperSearchingForHashesNotice="Поиск хэшей в файле захвата."
HandshakeSnooperArbiterAbortedWarning="${CYel}Прервано${CClr}: Операция была прервана, не найдено валидного хэша."
HandshakeSnooperArbiterSuccededNotice="${CGrn}Успех${CClr}: Валидный хэш был найден и сохранён в базе данных fluxion."
HandshakeSnooperArbiterCompletedTip="Атака ${CBCyn}Разведчик рукопожатий$CBYel завершена, закройте это окно и начните другую атаку.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
