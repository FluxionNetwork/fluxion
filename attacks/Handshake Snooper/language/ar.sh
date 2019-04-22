#!/usr/bin/env bash
# identifier: Handshake Snooper
# description: Acquires WPA/WPA2 encryption hashes.

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperJammerInterfaceQuery="إختر بطاقة شبكة من أجل المراقبة والتشويش."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperMethodQuery="إختر طريقة لاسترجاع المصافحة"
HandshakeSnooperMonitorMethodOption="مراقبة (${CYel}passive$CClr)"
HandshakeSnooperAireplayMethodOption="الغاء المصادقة aireplay-ng (${CRed}aggressive$CClr)"
HandshakeSnooperMdk4MethodOption="الغاء المصادقة mdk4 (${CRed}aggressive$CClr)"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierIntervalQuery="كم مرة يجب على المدقق التحقق من المصافحة؟"
HandshakeSnooperVerifierInterval30SOption="كل 30 ثانية (${CGrn}مستحسن${CClr})."
HandshakeSnooperVerifierInterval60SOption="كل 60 ثانية."
HandshakeSnooperVerifierInterval90SOption="كل 90 ثانية."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperVerifierSynchronicityQuery="كيف ينبغي على التحقق ان يحدث؟"
HandshakeSnooperVerifierSynchronicityAsynchronousOption="غير تزامني (${CYel}للأنظمةالسريعة فقط${CClr})."
HandshakeSnooperVerifierSynchronicitySynchronousOption="تزامني (${CGrn}مستحسن${CClr})."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
HandshakeSnooperStartingArbiterNotice="${CCyn}متطفل المصافحة$CClr يشتغل."
HandshakeSnooperSnoopingForNSecondsNotice="التطفل لـ \$HandshakeSnooperVerifierInterval ثواني."
HandshakeSnooperStoppingForVerifierNotice="وقف المتطفل والتحقق من وجود التجزئة."
HandshakeSnooperSearchingForHashesNotice="البحث عن التجزئات في ملف الالتقاط."
HandshakeSnooperArbiterAbortedWarning="${CYel}تم الإحباط${CClr}: تم إحباط العملية ، ولم يتم العثور على تجزئة صالحة."
HandshakeSnooperArbiterSuccededNotice="${CGrn}نجاح${CClr}: تم الكشف عن تجزئة صالحة وحفظها إلى قاعدة بيانات فلاكسيون."
HandshakeSnooperArbiterCompletedTip="${CBCyn}متطفل المصافحة$CBYel اكتمل الهجوم ، أغلق هذه النافذة وابدأ في هجوم آخر.$CClr"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
