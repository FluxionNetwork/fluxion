#!/bin/bash
# identifier: 专属门户
# description: 创建一个“邪恶的双胞胎”接入点。

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalInterfaceQuery="为捕获的握手包文件选择一个网络功击接口"
CaptivePortalStartingInterfaceNotice="启动握手包文件网络功击接口"
CaptivePortalCannotStartInterfaceError="${CRed}无法启动网络功击接口$CClr, 返回"
CaptivePortalStartedInterfaceNotice="${CGrn}启动成功${CClr},网络功击接口准备就绪"
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
CaptivePortalCertificateSourceGenerateOption="创建SSL证书(${CGrn}推荐$CClr)"
CaptivePortalCertificateSourceRescanOption="检测SSL证书 (${CClr}再次搜索$CGry)"
CaptivePortalCertificateSourceDisabledOption="没有SSL证书 (${CYel}禁用SSL$CGry)"
CaptivePortalUIQuery="选择钓鱼热点的认证网页界面"
CaptivePortalGenericInterfaceOption="通用认证网页"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
CaptivePortalConnectivityQuery="为流氓网络选择Internet连接类型"
CaptivePortalConnectivityDisconnectedOption="断开原网络 (${CGrn}推荐$CClr)"
CaptivePortalConnectivityEmulatedOption="仿真"
# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# FLUXSCRIPT END
