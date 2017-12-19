#!/bin/bash
# identifier: 专属门户
# description: 创建一个“邪恶的双胞胎”接入点。

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="Select an interface for the captive portal."
CaptivePortalStartingInterfaceNotice="Starting captive portal interface..."
CaptivePortalCannotStartInterfaceError="${CRed}Unable to start captive portal interface$CClr, returning!"
CaptivePortalStartedInterfaceNotice="${CGrn}Success${CClr}, captive portal interface ready!"
CaptivePortalStaringAPServiceNotice="开始建立钓鱼热点AP..."
CaptivePortalStaringAPRoutesNotice="启动钓鱼热点AP路由服务..."
CaptivePortalStartingDHCPServiceNotice="启动接入点DHCP服务作为守护进程..."
CaptivePortalStartingDNSServiceNotice="启动接入点DNS服务作为守护进程..."
CaptivePortalStartingWebServiceNotice="启动钓鱼热点作为守护进程..."
CaptivePortalStartingJammerServiceNotice="启动接入点干扰器作为守护进程..."
CaptivePortalStartingAuthenticatorServiceNotice="启动验证器脚本..."
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalVerificationMethodQuery="请选择验证密码方式"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalCertificateSourceQuery="选择钓鱼认证门户的SSL证书来源"
CaptivePortalCertificateSourceGenerateOption="创建SSL证书"
CaptivePortalCertificateSourceRescanOption="检测SSL证书 (${CClr}再次搜索$CGry)"
CaptivePortalCertificateSourceDisabledOption="None (${CYel}disable SSL$CGry)"
CaptivePortalUIQuery="选择钓鱼热点的认证网页界面"
CaptivePortalGenericInterfaceOption="通用认证网页"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="Select an internet connectivity type for the rogue network."
CaptivePortalConnectivityDisconnectedOption="disconnected (${CGrn}recommended$CClr)"
CaptivePortalConnectivityEmulatedOption="emulated"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
