#!/bin/bash
# Russian
# native: Русский

FLUXIONInterfaceQuery="Выберите беспроводной интерфейс"
FLUXIONAllocatingInterfaceNotice="Выделение зарезервированного интерфейса $CGrn\"\$interfaceIdentifier\"."
FLUXIONDeallocatingInterfaceNotice="Перераспределение зарезервированного интерфейса $CGrn\"\$interfaceIdentifier\"."
FLUXIONReidentifyingInterface="Переименование интерфейса."
FLUXIONUnblockingWINotice="Разблокирование всех беспроводных интерфейсов."

FLUXIONTargetTrackerInterfaceQuery="Выберите интерфейс для отслеживания целей."

#FLUXIONFindingExtraWINotice="Поиск посторонних беспроводных интерфейсов..."
FLUXIONRemovingExtraWINotice="Удаление посторонних беспроводных интерфейсов..."
FLUXIONFindingWINotice="Поиск доступных беспроводных интерфейсов..."
FLUXIONSelectedBusyWIError="Выбранный беспроводной интерфейс, по-видимому, используется в настоящее время!"
FLUXIONSelectedBusyWITip="Обычно это вызвано сетевым менеджером (network manager), использующим выбранный интерфейс. Рекомендуется$CGrn правильно остановить сетевой менеджер $CClr или настроить его на игнорирование выбранного интерфейса. В качестве альтернативы выполняйте \"export FLUXIONWIKillProcesses=1\" перед запуском fluxion, чтобы выгрузить сетевой менеджер, но рекомендуется$CRed избегать использование этого флага${CClr}."
FLUXIONGatheringWIInfoNotice="Сбор информации об интерфейсе..."
FLUXIONUnknownWIDriverError="Не удалось определить драйвер интерфейса!"
FLUXIONUnloadingWIDriverNotice="Ожидание выгрузки интерфейса \"\$interface\"..."
FLUXIONLoadingWIDriverNotice="Ожидание поднятия интерфейса \"\$interface\"..."
FLUXIONFindingConflictingProcessesNotice="Поиск конфликтующих служб..."
FLUXIONKillingConflictingProcessesNotice="Остановка конфликтующих служб..."
FLUXIONPhysicalWIDeviceUnknownError="${CRed}Невозможно определить физическое устройство интерфейса!"
FLUXIONStartingWIMonitorNotice="Запуск интерфейса монитора..."
FLUXIONInterfaceAllocatedNotice="${CGrn}Успешное распределение интерфейса!"
FLUXIONInterfaceAllocationFailedError="${CRed}Не удалось выполнить резервирование интерфейса!"


FLUXIONIncompleteTargettingInfoNotice="Отсутствует информация об essid, bssid или канале!"

FLUXIONTargettingAccessPointAboveNotice="Fluxion нацелен на вышеприведённую точку доступа."

FLUXIONContinueWithTargetQuery="Продолжить с этой целью?"

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONStartingScannerNotice="Запуск сканера, пожалуйста, подождите..."
FLUXIONStartingScannerTip="Через пять секунд после появления целевой точки ТД закройте сканер FLUXION."
FLUXIONPreparingScannerResultsNotice="Подготовка результатов сканирования, пожалуйста, ожидайте..."
FLUXIONScannerFailedNotice="Возможно, беспроводная карта не поддерживается (точки доступа не найдены)"
FLUXIONScannerDetectedNothingNotice="Точки доступа не обнаружены, возвращаемся назад..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashFileDoesNotExistError="Хэш-файл (файл с рукопожатием) не существует!"
FLUXIONHashInvalidError="${CRed}Ошибка$CClr, неверный файл рукопожатия!"
FLUXIONHashValidNotice="${CGrn}Успех$CClr, верификация рукопожатия прошла успешно!"
FLUXIONPathToHandshakeFileQuery="Введите путь до файла рукопожатия $CClr(Пример: /путь/до/file.cap)"
FLUXIONPathToHandshakeFileReturnTip="Чтобы вернуться назад, оставьте путь до файла рукопожатия пустым."
FLUXIONAbsolutePathInfo="Абсолютный путь"
FLUXIONEmptyOrNonExistentHashError="${CRed}Ошибка$CClr, введённый путь указывает на несуществующий или пустой файл рукопожатия."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelQuery="Выберите канал для мониторинга"
FLUXIONScannerChannelOptionAll="Все каналы"
FLUXIONScannerChannelOptionSpecific="Конкретный канал (каналы)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerChannelSingleTip="Один канал"
FLUXIONScannerChannelMiltipleTip="Несколько каналов"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONScannerHeader="Сканер FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONHashSourceQuery="Выберите способ получения рукопожатия"
FLUXIONHashSourcePathOption="Путь к файлу захвата"
FLUXIONHashSourceRescanOption="Повторное сканирование директории рукопожатия"
FLUXIONFoundHashNotice="Был найден хэш (рукопожатие) для целевой точки доступа."
FLUXIONUseFoundHashQuery="Вы хотите использовать этот файл?"
FLUXIONUseFoundHashOption="Использовать найденное рукопожатие"
FLUXIONSpecifyHashPathOption="Укажите путь к рукопожатию"
FLUXIONHashVerificationMethodQuery="Выберите метод проверки рукопожатия"
FLUXIONHashVerificationMethodPyritOption="проверка с помощью pyrit (${CGrn}рекомендуется$CClr)"
FLUXIONHashVerificationMethodAircrackOption="проверка с помощью aircrack-ng (${CYel}ненадёжная$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONAttackQuery="Выбор беспроводной атаки для точки доступа"
FLUXIONAttackInProgressNotice="${CCyn}\$FluxionAttack$CClr идёт атака..."
FLUXIONSelectAnotherAttackOption="Выбор другой атаки"
FluxionRestartOption="Перезапуск"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONGeneralSkipOption="${CYel}Пропустить"
FLUXIONGeneralBackOption="${CRed}Назад"
FLUXIONGeneralExitOption="${CRed}Выход"
FLUXIONGeneralRepeatOption="${CRed}Повторить"
FLUXIONGeneralNotFoundError="Не найдено"
FLUXIONGeneralXTermFailureError="${CRed}Не удалось запустить xterm (возможно неправильная настройка, безголовая машина)."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
FLUXIONCleanupAndClosingNotice="Очистка и закрытие"
FLUXIONKillingProcessNotice="Закрытие ${CGry}\$targetID$CClr"
FLUXIONRestoringPackageManagerNotice="Восстановление ${CCyn}\$PackageManagerCLT$CClr"
FLUXIONDisablingMonitorNotice="Отключение режима монитора"
FLUXIONDisablingExtraInterfacesNotice="Отключение дополнительный интерфейсов"
FLUXIONDisablingPacketForwardingNotice="Отключение ${CGry}форвардинга (переадресации) пакетов"
FLUXIONDisablingCleaningIPTablesNotice="Очистка ${CGry}iptables"
FLUXIONRestoringTputNotice="Восстановление ${CGry}tput"
FLUXIONDeletingFilesNotice="Удаление ${CGry}файлов"
FLUXIONRestartingNetworkManagerNotice="Восстановление ${CGry}Network-Manager"
FLUXIONCleanupSuccessNotice="Очистка выполнена успешно!"
FLUXIONThanksSupportersNotice="Спасибо что пользуетесь FLUXION"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
