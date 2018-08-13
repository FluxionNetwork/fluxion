//
// Email Notification
//
//1.3.6.1.4.1.4115.1.20.1.1.5.18.7.1
//1.3.6.1.4.1.4115.1.20.1.1.5.18.7.2
//1.3.6.1.4.1.4115.1.20.1.1.5.18.7.3
//1.3.6.1.4.1.4115.1.20.1.1.5.18.7.4
//1.3.6.1.4.1.4115.1.20.1.1.5.18.8


/*
var SCM_EmailNotification = new Container("SCM_EmailNotification", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456");
SCM_EmailNotification.RecipientEmail = new Scalar("SCM_EmailNotificationRecipientEmail", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.1", 2);
SCM_EmailNotification.FirewallBreach = new Scalar("SCM_EmailNotificationFirewallBreach", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.3", 2);
SCM_EmailNotification.ParentalControlBreach = new Scalar("SCM_EmailNotificationParentalControlBreach", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.4", 2);
SCM_EmailNotification.AlertsorWarnings  = new Scalar("SCM_EmailNotificationAlertsorWarnings", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.5", 2);
SCM_EmailNotification.SendLogs  = new Scalar("SCM_EmailNotificationSendLogs", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.6", 2);
SCM_EmailNotification.SMTPSerAddr  = new Scalar("SCM_EmailNotificationSMTPSerAddr", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.8", 2);
SCM_EmailNotification.ComcastEmailAddr  = new Scalar("SCM_EmailNotificationComcastEmailAddr", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.9", 2);
SCM_EmailNotification.ComcastUsername  = new Scalar("SCM_EmailNotificationComcastUsername", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.10", 2);
SCM_EmailNotification.ComcastPassword  = new Scalar("SCM_EmailNotificationComcastPassword", "1.3.6.1.4.1.4115.1.3.3.1.1.1.456.11", 2);
var arSCM_EmailNotificationRecipientEmail = SCM_EmailNotification.RecipientEmail;
var arSCM_EmailNotificationFirewallBreach = SCM_EmailNotification.FirewallBreach;
var arSCM_EmailNotificationParentalControlBreach = SCM_EmailNotification.ParentalControlBreach;
var arSCM_EmailNotificationAlertsorWarnings = SCM_EmailNotification.AlertsorWarnings;
var arSCM_EmailNotificationSendLogs = SCM_EmailNotification.SendLogs;
var arSCM_EmailNotificationSMTPSerAddr = SCM_EmailNotification.SMTPSerAddr;
var arSCM_EmailNotificationComcastEmailAddr = SCM_EmailNotification.ComcastEmailAddr;
var arSCM_EmailNotificationComcastUsername = SCM_EmailNotification.ComcastUsername;
var arSCM_EmailNotificationComcastPassword = SCM_EmailNotification.ComcastPassword;
*/


//XFINITY Network
var WanCurrentTable2 = new Table("WanCurrentTable2", "1.3.6.1.4.1.4115.1.20.1.1.1.457");
WanCurrentTable2.WanCurrentLinkLocalAddr = new Column("WanCurrentLinkLocalAddr","1.3.6.1.4.1.4115.1.20.1.1.1.457.1.1",2);
var arWanCurrentLinkLocalAddr=WanCurrentTable2.WanCurrentLinkLocalAddr;

//CM DHCP Parameters
var arrisCmDoc30Setup2 = new Container("arrisCmDoc30Setup2", "1.3.6.1.4.1.4115.1.3.4.1.8");
arrisCmDoc30Setup2.LearnedIPMode = new Scalar("LearnedIPMode","1.3.6.1.4.1.4115.1.3.4.1.8.3",2);
var arCmDoc30Setup2LearnedIPMode = arrisCmDoc30Setup2.LearnedIPMode;


//Firewall > IPv6 ChengDa Lee






var FWCfgv6 = new Container("FWCfgv6", "1.3.6.1.4.1.4115.1.20.1.1.4.40");
/*FWCfgv6.FWv6Enabled= new Scalar("FWv6Enabled","1.3.6.1.4.1.4115.1.20.1.1.459.1",2);
FWCfgv6.FWv6SecurityLevel= new Scalar("FWv6SecurityLevel","1.3.6.1.4.1.4115.1.20.1.1.459.9",2);
FWCfgv6.FWv6ResetDefaults= new Scalar("FWv6ResetDefaults","1.3.6.1.4.1.4115.1.20.1.1.459.22",2);
FWCfgv6.FWv6BlockHTTP= new Scalar("FWv6BlockHTTP","1.3.6.1.4.1.4115.1.20.1.1.459.23",2);
FWCfgv6.FWv6BlockP2P= new Scalar("FWv6BlockP2P","1.3.6.1.4.1.4115.1.20.1.1.459.24",2);
FWCfgv6.FWv6BlockIdent= new Scalar("FWv6BlockIdent","1.3.6.1.4.1.4115.1.20.1.1.459.25",2);
FWCfgv6.FWv6BlockICMP= new Scalar("FWv6BlockICMP","1.3.6.1.4.1.4115.1.20.1.1.459.26",2);
FWCfgv6.FWv6BlockMulticast= new Scalar("FWv6BlockMulticast","1.3.6.1.4.1.4115.1.20.1.1.459.27",2);
*/
/*var arFWv6Enabled=FWCfgv6.FWv6Enabled;
var arFWv6SecurityLevel=FWCfgv6.FWv6SecurityLevel;
var arFWv6ResetDefaults=FWCfgv6.FWv6ResetDefaults;
var arFWv6BlockHTTP=FWCfgv6.FWv6BlockHTTP;
var arFWv6BlockP2P=FWCfgv6.FWv6BlockP2P;
var arFWv6BlockIdent=FWCfgv6.FWv6BlockIdent;
var arFWv6BlockICMP=FWCfgv6.FWv6BlockICMP;
var arrisRouterFWIPv6Enable=FWCfgv6.FWv6BlockMulticast;
*/
FWCfgv6.FWIPv6SecurityLevel         = new Scalar("FWIPv6SecurityLevel", "1.3.6.1.4.1.4115.1.20.1.1.4.40.1", 2);
FWCfgv6.FWIPv6BlockHTTP             = new Scalar("FWIPv6BlockHTTP",     "1.3.6.1.4.1.4115.1.20.1.1.4.40.2", 2);
FWCfgv6.FWIPv6BlockICMP             = new Scalar("FWIPv6BlockICMP",     "1.3.6.1.4.1.4115.1.20.1.1.4.40.3", 2);
FWCfgv6.FWIPv6BlockMulticast        = new Scalar("FWIPv6BlockMulticast","1.3.6.1.4.1.4115.1.20.1.1.4.40.4", 2);
FWCfgv6.FWIPv6BlockP2P              = new Scalar("FWIPv6BlockP2P",      "1.3.6.1.4.1.4115.1.20.1.1.4.40.5", 2);
FWCfgv6.FWIPv6BlockIDENT            = new Scalar("FWIPv6BlockIDENT",    "1.3.6.1.4.1.4115.1.20.1.1.4.40.6", 2);
FWCfgv6.FWIPv6Enable                = new Scalar("FWIPv6Enable",        "1.3.6.1.4.1.4115.1.20.1.1.4.40.7", 2);
FWCfgv6.FWIPv6ResetDefaults         = new Scalar("FWIPv6ResetDefaults", "1.3.6.1.4.1.4115.1.20.1.1.4.40.8", 2);      
                                                                        
var arrisRouterFWIPv6SecurityLevel  =FWCfgv6.FWIPv6SecurityLevel;
var arrisRouterFWIPv6BlockHTTP      =FWCfgv6.FWIPv6BlockHTTP    ;
var arrisRouterFWIPv6BlockICMP      =FWCfgv6.FWIPv6BlockICMP    ;
var arrisRouterFWIPv6BlockMulticast =FWCfgv6.FWIPv6BlockMulticast ;
var arrisRouterFWIPv6BlockP2P       =FWCfgv6.FWIPv6BlockP2P     ;
var arrisRouterFWIPv6BlockIDENT     =FWCfgv6.FWIPv6BlockIDENT   ;
var arrisRouterFWIPv6Enable         =FWCfgv6.FWIPv6Enable       ;
var arrisRouterFWIPv6ResetDefaults	=FWCfgv6.FWIPv6ResetDefaults       ;

//Software
var mib2system2 = new Container("mib2system2", "1.3.6.1.4.1.4115.1.3.4.1.460");
mib2system2.SoftwareImageName = new Scalar("SoftwareImageName","1.3.6.1.4.1.4115.1.3.4.1.460.1",2);
mib2system2.AdvancedServices = new Scalar("AdvancedServices","1.3.6.1.4.1.4115.1.3.4.1.460.2",2);
var mib2system2SoftwareImageName = mib2system2.SoftwareImageName;
var mib2system2AdvancedServices = mib2system2.AdvancedServices;

//battery
var MtaDevBatteryStatusTable2 = new Table("MtaDevBatteryStatusTable2", "1.3.6.1.4.1.4115.1.3.3.1.3.5.461");
MtaDevBatteryStatusTable2.MtaDevBatteryCondition = new Column("MtaDevBatteryCondition", "1.3.6.1.4.1.4115.1.3.3.1.3.5.461.1.2", 2);
MtaDevBatteryStatusTable2.MtaDevNumberofCycles = new Column("MtaDevNumberofCycles", "1.3.6.1.4.1.4115.1.3.3.1.3.5.461.1.5", 2);
var arMtaDevBatteryCondition = MtaDevBatteryStatusTable2.MtaDevBatteryCondition;
var arMtaDevNumberofCycles = MtaDevBatteryStatusTable2.MtaDevNumberofCycles;

var MtaDevBatteryStatus = new Container("MtaDevBatteryStatus", "1.3.6.1.4.1.4115.1.3.3.1.3.5");
MtaDevBatteryStatus.MtaDevTotalCapacity = new Scalar("MtaDevTotalCapacity","1.3.6.1.4.1.4115.1.3.3.1.3.5.5",2);
MtaDevBatteryStatus.MtaDevActualCapacity = new Scalar("MtaDevActualCapacity","1.3.6.1.4.1.4115.1.3.3.1.3.5.6",2);
var mib2MtaDevTotalCapacity = MtaDevBatteryStatus.MtaDevTotalCapacity;
var mib2MtaDevActualCapacity = MtaDevBatteryStatus.MtaDevActualCapacity;

//remote management
var cmDocExtendCmParamterTable = new Table("cmDocExtendCmParamterTable", "1.3.6.1.4.1.4115.1.3.4.1.8.7");
cmDocExtendCmParamterTable.CmParamterType = new Column("CmParamterType","1.3.6.1.4.1.4115.1.3.4.1.8.7.1.2",2);
cmDocExtendCmParamterTable.CmParamterIpAddress = new Column("CmParamterIpAddress","1.3.6.1.4.1.4115.1.3.4.1.8.7.1.3",4);
var arCmParamterType=cmDocExtendCmParamterTable.CmParamterType;
var arCmParamterIpAddress=cmDocExtendCmParamterTable.CmParamterIpAddress;

//moca
var ArrisMoCAMib = new Container("ArrisMoCAMib", "1.3.6.1.4.1.4115.1.21");
ArrisMoCAMib.MoCAApplySettings= new Scalar("MoCAApplySettings","1.3.6.1.4.1.4115.1.21.2",2);
var arMoCAApplySettings=ArrisMoCAMib.MoCAApplySettings;

var mocaConfigation = new Container("mocaConfigation", "1.3.6.1.4.1.4115.1.21.1");
mocaConfigation.ChanncelSetMethod = new Scalar("ChanncelSetMethod","1.3.6.1.4.1.4115.1.21.1.1",2);
mocaConfigation.TabooChanncel = new Scalar("TabooChanncel","1.3.6.1.4.1.4115.1.21.1.4",66);
mocaConfigation.mocaChanncelMark = new Scalar("mocaChanncelMark","1.3.6.1.4.1.4115.1.21.1.2",66);
mocaConfigation.mocaLOF = new Scalar("mocaLOF","1.3.6.1.4.1.4115.1.21.1.5",2);
mocaConfigation.mocaPrimchnoff = new Scalar("mocaPrimchnoff","1.3.6.1.4.1.4115.1.21.1.6",2);

var arChanncelSetMethod = mocaConfigation.ChanncelSetMethod;
var arTabooChanncel = mocaConfigation.TabooChanncel;
var armocaChanncelMark = mocaConfigation.mocaChanncelMark;
var armocaLOF = mocaConfigation.mocaLOF;
var armocaPrimchnoff = mocaConfigation.mocaPrimchnoff;


//Gateway > Hardware > LAN Ethernet
//var mib2interface2 = new Container("mib2interface2", "1.3.6.1.2.1.2.2.1.5.4.462");
//mib2interface2.ifPort4Enable = new Scalar("ifPort4Enable","1.3.6.1.2.1.2.2.1.5.4.462.1",2);
//var arifPort4Enable = mib2interface2.ifPort4Enable;

//Gateway > Hardware > USB : port 1/port 2
var mib2interfaceUSB = new Container("mib2interfaceUSB", "1.3.6.1.4.1.4.2.1.5.4.463");
mib2interfaceUSB.USB1status=    new Scalar("USB1status","1.3.6.1.4.1.4.2.1.5.4.463.1");
mib2interfaceUSB.USB1Desc=      new Scalar("USB1Desc",  "1.3.6.1.4.1.4.2.1.5.4.463.2");
mib2interfaceUSB.USB1SN=        new Scalar("USB1SN",    "1.3.6.1.4.1.4.2.1.5.4.463.3");
mib2interfaceUSB.USB1Speed=     new Scalar("USB1Speed","1.3.6.1.4.1.4.2.1.5.4.463.4");
mib2interfaceUSB.USB1Manufacturer= new Scalar("USB1Manufacturer","1.3.6.1.4.1.4.2.1.5.4.463.5");
var arUSB1status=mib2interfaceUSB.USB1status;
var arUSB1Desc=mib2interfaceUSB.USB1Desc;
var arUSB1SN=mib2interfaceUSB.USB1SN;
var arUSB1Speed=mib2interfaceUSB.USB1Speed;
var arUSB1Manufacturer=mib2interfaceUSB.USB1Manufacturer;

//Connected Devices > Network Storage, NetworkStorage
var MtaDevBatteryStatusTable2 = new Table("MtaDevBatteryStatusTable2", "1.3.6.1.4.1.4115.1.3.3.1.3.5.461");
    MtaDevBatteryStatusTable2.MtaDevBatteryCondition = new Column("MtaDevBatteryCondition", "1.3.6.1.4.1.4115.1.3.3.1.3.5.461.1.2", 2);
//var arMtaDevBatteryCondition = MtaDevBatteryStatusTable2.MtaDevBatteryCondition;

var mib2interfaceNetworkStorageTable= new Table("mib2interfaceNetworkStorageTable", "1.3.6.1.4.1.4.2.1.5.4.464");
mib2interfaceNetworkStorageTable.NSName=                 new Column("NSName", "1.3.6.1.4.1.4.2.1.5.4.464.1.1");
mib2interfaceNetworkStorageTable.NSFileSystem =          new Column("NSFileSystem", "1.3.6.1.4.1.4.2.1.5.4.464.1.2");
mib2interfaceNetworkStorageTable.NSSpaceAvailable =      new Column("NSSpaceAvailable",    "1.3.6.1.4.1.4.2.1.5.4.464.1.3");
mib2interfaceNetworkStorageTable.NSTotalSpace=           new Column("NSTotalSpace","1.3.6.1.4.1.4.2.1.5.4.464.1.4");
mib2interfaceNetworkStorageTable.NSLocation=             new Column("NSLocation","1.3.6.1.4.1.4.2.1.5.4.464.1.5");
var arNSName=            mib2interfaceNetworkStorageTable.NSName;
var arNSFileSystem =     mib2interfaceNetworkStorageTable.NSFileSystem;
var arNSSpaceAvailable = mib2interfaceNetworkStorageTable.NSSpaceAvailable;
var arNSTotalSpace =     mib2interfaceNetworkStorageTable.NSTotalSpace;
var arNSLocation =       mib2interfaceNetworkStorageTable.NSLocation;


// Range Extenders
var mib2interfaceRangeExtender=new Table("mib2interfaceRangeExtender", "1.3.6.1.4.1.4.2.1.5.4.465");
mib2interfaceRangeExtender.RangeExtenderName    =new Column("RangeExtenderName", "1.3.6.1.4.1.4.2.1.5.4.465.1.1");
mib2interfaceRangeExtender.RESSID             =new Column("RESSID", "1.3.6.1.4.1.4.2.1.5.4.465.1.2");
mib2interfaceRangeExtender.REBSSID            =new Column("REBSSID", "1.3.6.1.4.1.4.2.1.5.4.465.1.3");
mib2interfaceRangeExtender.REFrequencyBand    =new Column("REFrequencyBand", "1.3.6.1.4.1.4.2.1.5.4.465.1.4");
mib2interfaceRangeExtender.REChannel          =new Column("REChannel", "1.3.6.1.4.1.4.2.1.5.4.465.1.5");
mib2interfaceRangeExtender.RESecurityMode     =new Column("RESecurityMode", "1.3.6.1.4.1.4.2.1.5.4.465.1.6");
var arRangeExtenderName=mib2interfaceRangeExtender.RangeExtenderName  ;
var arRESSID           =mib2interfaceRangeExtender.RESSID             ;
var arREBSSID          =mib2interfaceRangeExtender.REBSSID            ;
var arREFrequencyBand  =mib2interfaceRangeExtender.REFrequencyBand    ;
var arREChannel        =mib2interfaceRangeExtender.REChannel          ;
var arRESecurityMode   =mib2interfaceRangeExtender.RESecurityMode     ;


// Advanced >> remote_management
var mib2interfaceRemoteManagement = new Container("mib2interfaceRemoteManagement", "1.3.6.1.4.1.4.2.1.5.4.466");
mib2interfaceRemoteManagement.RMEnableHttp=   new Scalar("RMEnableHttp", "1.3.6.1.4.1.4.2.1.5.4.466.1", 2);
mib2interfaceRemoteManagement.RMEnableHttps=  new Scalar("RMEnableHttps", "1.3.6.1.4.1.4.2.1.5.4.466.2", 2);
mib2interfaceRemoteManagement.RMAddrv4=       new Scalar("RMAddrv4", "1.3.6.1.4.1.4.2.1.5.4.466.3", 2);
mib2interfaceRemoteManagement.RMAddrv6=       new Scalar("RMAddrv6", "1.3.6.1.4.1.4.2.1.5.4.466.4", 2);
mib2interfaceRemoteManagement.RMAllowedIndex= new Scalar("RMAllowedIndex", "1.3.6.1.4.1.4.2.1.5.4.466.5", 2);
mib2interfaceRemoteManagement.RMAddrv4From=   new Scalar("RMAddrv4From", "1.3.6.1.4.1.4.2.1.5.4.466.6", 2);
mib2interfaceRemoteManagement.RMAddrv4End=    new Scalar("RMAddrv4End", "1.3.6.1.4.1.4.2.1.5.4.466.7", 2);
mib2interfaceRemoteManagement.RMAddrv6From=   new Scalar("RMAddrv6From", "1.3.6.1.4.1.4.2.1.5.4.466.8", 2);
mib2interfaceRemoteManagement.RMAddrv6End=    new Scalar("RMAddrv6End", "1.3.6.1.4.1.4.2.1.5.4.466.9", 2);
mib2interfaceRemoteManagement.RMTelnetEnble=    new Scalar("RMTelnetEnble", "1.3.6.1.4.1.4.2.1.5.4.466.10", 2);
mib2interfaceRemoteManagement.RMSSHEnable=    new Scalar("RMSSHEnable", "1.3.6.1.4.1.4.2.1.5.4.466.11", 2);
var arRMEnableHttp= mib2interfaceRemoteManagement.RMEnableHttp;
var arRMEnableHttps=mib2interfaceRemoteManagement.RMEnableHttps;
var arRMAddrv4=     mib2interfaceRemoteManagement.RMAddrv4;
var arRMAddrv6=     mib2interfaceRemoteManagement.RMAddrv6;
var arRMAllowedIndex= mib2interfaceRemoteManagement.RMAllowedIndex;
var arRMAddrv4From= mib2interfaceRemoteManagement.RMAddrv4From;
var arRMAddrv4End=  mib2interfaceRemoteManagement.RMAddrv4End;
var arRMAddrv6From= mib2interfaceRemoteManagement.RMAddrv6From;
var arRMAddrv6End=  mib2interfaceRemoteManagement.RMAddrv6End;
var arRMTelnetEnble=mib2interfaceRemoteManagement.RMTelnetEnble;
var arRMSSHEnable=  mib2interfaceRemoteManagement.RMSSHEnable;

// Advanced >> Radius Servers
var RadiusServerTable           =new Table ("RadiusServerTable","1.3.6.1.4.1.4.2.1.5.4.469");
RadiusServerTable.RSEnable      =new Column("RSEnable",         "1.3.6.1.4.1.4.2.1.5.4.469.1.1");
RadiusServerTable.RSIp          =new Column("RSIp",             "1.3.6.1.4.1.4.2.1.5.4.469.1.2");
RadiusServerTable.RSAuthPort    =new Column("RSAuthPort",       "1.3.6.1.4.1.4.2.1.5.4.469.1.3");
RadiusServerTable.RSAcctPort    =new Column("RSAcctPort",       "1.3.6.1.4.1.4.2.1.5.4.469.1.4");
RadiusServerTable.RSLocalIF     =new Column("RSLocalIF",        "1.3.6.1.4.1.4.2.1.5.4.469.1.5");
RadiusServerTable.RSTimout      =new Column("RSTimout",         "1.3.6.1.4.1.4.2.1.5.4.469.1.6");
RadiusServerTable.RSReAuthTmt   =new Column("RSReAuthTmt",      "1.3.6.1.4.1.4.2.1.5.4.469.1.7");
RadiusServerTable.RSSharedSecret=new Column("RSSharedSecret",   "1.3.6.1.4.1.4.2.1.5.4.469.1.8");
var arRSEnable      = RadiusServerTable.RSEnable      ;
var arRSIp          = RadiusServerTable.RSIp          ;
var arRSAuthPort    = RadiusServerTable.RSAuthPort    ;
var arRSAcctPort    = RadiusServerTable.RSAcctPort    ;
var arRSLocalIF     = RadiusServerTable.RSLocalIF     ;
var arRSTimout      = RadiusServerTable.RSTimout      ;
var arRSReAuthTmt   = RadiusServerTable.RSReAuthTmt   ;
var arRSSharedSecret= RadiusServerTable.RSSharedSecret;

// samba_server_config.php
var FileShareTable              =new Table ("FileShareTable","1.3.6.1.4.1.4.2.1.5.4.472");
FileShareTable.FSDirectory      =new Column("FSDirectory",         "1.3.6.1.4.1.4.2.1.5.4.472.1.1");
FileShareTable.FSName           =new Column("FSName",             "1.3.6.1.4.1.4.2.1.5.4.472.1.2");
FileShareTable.FSVisible        =new Column("FSVisible",       "1.3.6.1.4.1.4.2.1.5.4.472.1.3");
FileShareTable.FSPermissions    =new Column("FSPermissions",       "1.3.6.1.4.1.4.2.1.5.4.472.1.4");
FileShareTable.FSEnableHttp     =new Column("FSEnableHttp",        "1.3.6.1.4.1.4.2.1.5.4.472.1.5");
FileShareTable.FSEnableFTP      =new Column("FSEnableFTP",         "1.3.6.1.4.1.4.2.1.5.4.472.1.6");
FileShareTable.FSDesc           =new Column("FSDesc",      "1.3.6.1.4.1.4.2.1.5.4.472.1.7");
FileShareTable.FSUSB12          =new Column("FSUSB12",      "1.3.6.1.4.1.4.2.1.5.4.472.1.8");
var arFSDirectory       =FileShareTable.FSDirectory;
var arFSName            =FileShareTable.FSName;
var arFSVisible         =FileShareTable.FSVisible;
var arFSPermissions     =FileShareTable.FSPermissions;
var arFSEnableHttp      =FileShareTable.FSEnableHttp;
var arFSEnableFTP       =FileShareTable.FSEnableFTP;
var arFSUSB12           =FileShareTable.FSUSB12;

// samba_server_config.php
var FileShareManage =       new Container("FileShareManage", "1.3.6.1.4.1.4.2.1.5.4.471");
FileShareManage.FSMShare=   new Scalar("FSMShare",  "1.3.6.1.4.1.4.2.1.5.4.471.1",2);
FileShareManage.FSMName=    new Scalar("FSMName",   "1.3.6.1.4.1.4.2.1.5.4.471.2",2);
FileShareManage.FSMReserve= new Scalar("FSMReserve","1.3.6.1.4.1.4.2.1.5.4.471.3",2);
var arFSMShare=   FileShareManage.FSMShare;
var arFSMName=    FileShareManage.FSMName;
var arFSMReserve= FileShareManage.FSMReserve;


//qos1.php
var QOSSettings = new Container("QOSSettings",  "1.3.6.1.4.1.4.2.1.5.4.473");
QOSSettings.QOS4Wmmd=    new Scalar("QOS4Wmmd", "1.3.6.1.4.1.4.2.1.5.4.473.1",2);
QOSSettings.QOS4Moca=    new Scalar("QOS4Moca", "1.3.6.1.4.1.4.2.1.5.4.473.2",2);
QOSSettings.QOS4Lan=    new Scalar("QOS4Lan",   "1.3.6.1.4.1.4.2.1.5.4.473.3",2);
QOSSettings.QOS4Upnp=    new Scalar("QOS4Upnp", "1.3.6.1.4.1.4.2.1.5.4.473.4",2);
var arQOS4Wmmd= QOSSettings.QOS4Wmmd;
var arQOS4Moca= QOSSettings.QOS4Moca;
var arQOS4Lan=  QOSSettings.QOS4Lan;
var arQOS4Upnp= QOSSettings.QOS4Upnp;

//dlna_settings.php
var DLNASettings = new Container("DLNASettings", "1.3.6.1.4.1.4.2.1.5.4.474");
DLNASettings.DLNAEnabled=    new Scalar("DLNAEnabled","1.3.6.1.4.1.4.2.1.5.4.474.1", 2);
DLNASettings.DLNAMediaType=    new Scalar("DLNAMediaType","1.3.6.1.4.1.4.2.1.5.4.474.2", 2);
DLNASettings.DLNAMediaSrc=    new Scalar("DLNAMediaSrc","1.3.6.1.4.1.4.2.1.5.4.474.3", 2);
DLNASettings.DLNAMediaPath=    new Scalar("DLNAMediaPath","1.3.6.1.4.1.4.2.1.5.4.474.4", 2);
//DLNASettings.=    new Scalar("","1.3.6.1.4.1.4.2.1.5.4.474.5", 2);
//DLNASettings.=    new Scalar("","1.3.6.1.4.1.4.2.1.5.4.474.6", 2);
var arDLNAEnabled=   DLNASettings.DLNAEnabled;
var arDLNAMediaType= DLNASettings.DLNAMediaType;
var arDLNAMediaSrc=  DLNASettings.DLNAMediaSrc;
var arDLNAMediaPath= DLNASettings.DLNAMediaPath;

// digital_media_players.php
var DLMediaPlayer       =new Table ("DLMediaPlayer","1.3.6.1.4.1.4.2.1.5.4.475");
DLMediaPlayer.DLMPName  =new Column("FSDirectory",  "1.3.6.1.4.1.4.2.1.5.4.475.1.1");
DLMediaPlayer.DLMPAllw  =new Column("DLMediaPlayer","1.3.6.1.4.1.4.2.1.5.4.475.1.2");
var arDLMPName = DLMediaPlayer.DLMPName;
var arDLMPAllw = DLMediaPlayer.DLMPAllw;

// digital_media_index.php
var DLMIndexTable       =new Table ("DLMIndexTable","1.3.6.1.4.1.4.2.1.5.4.476");
DLMIndexTable.DLMName   =new Column("DLMName",      "1.3.6.1.4.1.4.2.1.5.4.476.1.1");
DLMIndexTable.DLMGenre  =new Column("DLMGenre",     "1.3.6.1.4.1.4.2.1.5.4.476.1.2");
DLMIndexTable.DLMArtist =new Column("DLMArtist",    "1.3.6.1.4.1.4.2.1.5.4.476.1.3");
DLMIndexTable.DLMDurat  =new Column("DLMDurat",     "1.3.6.1.4.1.4.2.1.5.4.476.1.4");
DLMIndexTable.DLMFold   =new Column("DLMFold",      "1.3.6.1.4.1.4.2.1.5.4.476.1.5");
DLMIndexTable.DLMRate   =new Column("DLMRate",      "1.3.6.1.4.1.4.2.1.5.4.476.1.6");
DLMIndexTable.DLMAlbum  =new Column("DLMAlbum",     "1.3.6.1.4.1.4.2.1.5.4.476.1.7");
DLMIndexTable.DLMCmmnt  =new Column("DLMCmmnt",     "1.3.6.1.4.1.4.2.1.5.4.476.1.9");
DLMIndexTable.DLMType   =new Column("DLMType",      "1.3.6.1.4.1.4.2.1.5.4.476.1.8");
var arDLMName   = DLMIndexTable.DLMName   ; // string
var arDLMGenre  = DLMIndexTable.DLMGenre  ; // 1-8,Fiction, Action, Drama, Comedy,
                                            // Classical, Rock, Fusion, Metal.
var arDLMArtist = DLMIndexTable.DLMArtist ; // string
var arDLMDurat  = DLMIndexTable.DLMDurat  ; // number
var arDLMFold   = DLMIndexTable.DLMFold   ; // string
var arDLMRate   = DLMIndexTable.DLMRate   ; // 1-3: G, PG, R
var arDLMAlbum  = DLMIndexTable.DLMAlbum  ; // string (music)
var arDLMCmmnt  = DLMIndexTable.DLMCmmnt  ; // string (picture)
var arDLMType   = DLMIndexTable.DLMType   ; // png(1), jpeg(2); 
                                            // Video    (8)
                                            // TV Shows (16)
                                            // Pictures (24)
