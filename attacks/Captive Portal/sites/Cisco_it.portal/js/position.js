// Tree Menu List
var PAGE_NAME=3;
var PAGE_POWER=4;
var PAGE_HELP=5;
var PAGE_IPMODE=6;

//  IP MODE
//  LAN:IPv4 WAN:IPv4,
//  LAN:IPv6 WAN:IPv4,
//  LAN:IPv6 WAN:IPv6, 
//  LAN:IPv4+IPv6 WAN:IPv4, 
//  LAN:IPv4+IPv6 WAN:IPv4+IPv6
//  LAN:IPv4 WAN:Ipv6

var Menu=new Array(); 
var sid=0,m=0;

Menu[m]=new Array();
Menu[m++][sid++]=new Array(__T(g_start.title),'','','getstart-asp.htm',0,'getting_started.html','111111');

var sid=0;
Menu[m]=new Array();
Menu[m][sid++]=new Array(__T(share.sts),__T(router.dashboard),'','dashboard-asp.htm',0,'status_dashboard.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(g_start.sys_summary),'','system-asp.htm',0,'status_summary.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(router.activeservice),'','activelist-asp.htm',0,'status_tcpip.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(wl.T1),'','status_wireless-asp.htm',0,'status_wireless_statistics.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(wl.captivest),'','status_captive-asp.htm',0,'status_captive_portal.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(vpn.sitetositevpn),'','status_sitetosite-asp.htm',0,'status_site_ipsec.html','100110');
Menu[m][sid++]=new Array(__T(share.sts),__T(vpn.vpnser),'','status_vpn-asp.htm',0,'status_ipsec.html','100110');
Menu[m][sid++]=new Array(__T(share.sts),__T(wan.pptpserver),'','status_pptp-asp.htm',0,'status_pptp.html','100110');
Menu[m][sid++]=new Array(__T(share.sts),__T(viewlog.title),'','view_logs-asp.htm',0,'status_logs.html','100110');
Menu[m][sid++]=new Array(__T(share.sts),__T(lan.connectdev),'','lan_host-asp.htm',0,'status_devices.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(wan.wiredst),'','status_wide-asp.htm',0,'status_ports.html','111111');
Menu[m][sid++]=new Array(__T(share.sts),__T(wwan.mobilenet),'','status_mobile-asp.htm',0,'mobile_status.html','110110');
m++;

sid=0;
Menu[m]=new Array();


Menu[m][sid++]=new Array(__T(lan.networking),__T(wan.wan),__T(wan.wanconfig),'wan-asp.htm',0,'net_wan.html','110110');
Menu[m][sid++]=new Array(__T(lan.networking),__T(wan.wan),__T(wan.pppoeps),'pppoe_profile-asp.htm',0,'net_pppoe_profile.html','110110');
Menu[m][sid++]=new Array(__T(lan.networking),__T(wan.wan),__T(wwan.mobilenet),'mobile-asp.htm',0,'Mobile_Network.html','110110');
Menu[m][sid++]=new Array(__T(lan.networking),__T(wan.wan),__T(wwan.failover),'failover-asp.htm',0,'failover_recovery.html','110110');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(lan.lanconfig),'lan-asp.htm',0,'net_lan.html','100111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(lan.vlanmembership),'vlan_membership-asp.htm',0,'net_vlans.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(lan.staticdhcp),'static_dhcp-asp.htm',0,'net_static_dhcp.html','100111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(lan.dhcpleasedclient),'dhcp_leased_client-asp.htm',0,'net_dhcp_leased.html','100111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(lan.dmzhost),'dmz_host-asp.htm',0,'net_dmz.html','101110');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(lan.rstp),'RSTP-asp.htm',0,'net_rtsp.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(router.portmang),'port_management-asp.htm',0,'net_port_mgmt.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.lan),__T(router.linkagg),'linkagg-asp.htm',0,'net_link_aggregation.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(lan.macclone),'','macclone-asp.htm',0,'net_mac.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(router.routing),'','routing-asp.htm',0,'net_routing.html','110111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(router.routingtb),'','routingtb-asp.htm',0,'net_routing_table.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(wan.ddns),'','ddns-asp.htm',0,'net_dynamic_dns.html','110111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(router.ipmode),'','ip_mode-asp.htm',0,'net_ip_mode.html','111111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.wantitle),'wan_ipv6-asp.htm',0,'net_ipv6_wan.html','001011');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.lantitle),'lan_ipv6-asp.htm',0,'net_ipv6_lan.html','011110');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.staticrouting),'ipv6_routing-asp.htm',0,'net_ipv6_static_routing.html','011111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.rripng),'ripng-asp.htm',0,'net_ipv6_ripng.html','011111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.tunneling),'tunneling_6to4-asp.htm',0,'net_ipv6_6to4.html','011111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.tunnelst),'status_ipv6-asp.htm',0,'net_ipv6_tunnel.html','011111');
Menu[m][sid++]=new Array(__T(lan.networking),__T(ipv6.ipv6),__T(ipv6.routeradv),'router_ad-asp.htm',0,'net_ipv6_advert.html','011110');

m++;
sid=0;
Menu[m]=new Array()
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.basicset),'','Wireless_Manual-asp.htm',0,'wireless_basic.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.advset),'','Wireless_Advanced-asp.htm',0,'wireless_advanced.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.rogueap),'','authap-asp.htm',0,'wireless_rogueap.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.wds),'','wds-asp.htm',0,'wireless_wds.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.wps),'','Wireless_WPS-asp.htm',0,'wireless_wps.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.captive),__T(wl.portalprofile),'Wireless_welcome-asp.htm',0,'wireless_captive_portal.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.captive),__T(wl.portalprofilerev),'Wireless_welcome_prev-asp.htm',0,'wireless_captive_portal.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(wl.captive),__T(wl.useraccount),'Wireless_user-asp.htm',0,'wireless_captive_portal.html','111111');
Menu[m][sid++]=new Array(__T(wl.wl),__T(router.workmode),'','workmode-asp.htm',0,'wireless_device_mode.html','111111');

m++;
sid=0;
Menu[m]=new Array()
Menu[m][sid++]=new Array(__T(filter.firewall),__T(wl.basicset),'','firewall-asp.htm',0,'firewall_basic.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.schmang),'','schedule_manage-asp.htm',0,'firewall_schedule.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.mangservice),'','service_manage-asp.htm',0,'firewall_service.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.accessrules),'','ip_based_acl-asp.htm',0,'firewall_access.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.IAP),'','filter-asp.htm',0,'firewall_policy.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.nat1to1),'','nat_1to1-asp.htm',0,'firewall_1to1nat.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.singleforward),'','singleforward-asp.htm',0,'firewall_single.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.portrangeforward),'','portforward-asp.htm',0,'firewall_range.html','111111');
Menu[m][sid++]=new Array(__T(filter.firewall),__T(filter.portrangetrigger),'','triggering-asp.htm',0,'firewall_trigger.html','111111');
m++;
sid=0;
Menu[m]=new Array()
Menu[m][sid++]=new Array(__T(vpn.vpn),__T(vpn.sitetositevpn),__T(vpn.basicvpnsetup),'vpn_basic-asp.htm',0,'vpn_basic_setup.html','110110');
Menu[m][sid++]=new Array(__T(vpn.vpn),__T(vpn.sitetositevpn),__T(vpn.ipsecpolicy),'vpn_adv-asp.htm',0,'vpn_advanced.html','110110'); 
Menu[m][sid++]=new Array(__T(vpn.vpn),__T(vpn.vpnser),__T(filter.setup),'ipsec_setup-asp.htm',0,'ipsec_vpn_config.html','110110'); 
Menu[m][sid++]=new Array(__T(vpn.vpn),__T(vpn.vpnser),__T(vpn.user),'ipsec_user-asp.htm',0,'ipsec_vpn_user.html','110110'); 
Menu[m][sid++]=new Array(__T(vpn.vpn),__T(wan.pptpserver),'','vpn_client-asp.htm',0,'pptp_config.html','110110'); 
Menu[m++][sid++]=new Array(__T(vpn.vpn),__T(vpn.passthrough),'','VPN-asp.htm',0,'vpn_pass.html','110110');

sid=0;
Menu[m]=new Array()
Menu[m][sid++]=new Array(__T(filter.qos),__T(filter.bandwidthmang),'','bandwidth-asp.htm',0,'qos_bandwidth.html','111111');
Menu[m][sid++]=new Array(__T(filter.qos),__T(filter.qosportset),'','qos_port-asp.htm',0,'qos_port_settings.html','111111');
Menu[m][sid++]=new Array(__T(filter.qos),__T(filter.cosset),'','cos-asp.htm',0,'qos_cos.html','111111');
Menu[m++][sid++]=new Array(__T(filter.qos),__T(filter.dscpset),'','dscp-asp.htm',0,'qos_dscp.html','111111');

sid=0;
Menu[m]=new Array()
Menu[m][sid++]=new Array(__T(mang.administration),__T(router.devicepro),'','device-asp.htm',0,'device_properties.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.pwdcomplex),'','password-asp.htm',0,'admin_password.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.users),'','users-asp.htm',0,'admin_users.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.sessiontimeout),'','session_timeout-asp.htm',0,'admin_timeout.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.snmp),'','snmp-asp.htm',0,'admin_snmp.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.diagnostics),__T(mang.networktools),'network_tools-asp.htm',0,'admin_diag_net.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.diagnostics),__T(mang.portmirror),'port_mirror-asp.htm',0,'admin_diag_mirror.html');
Menu[m][sid++]=new Array(__T(mang.administration),__T(syslog.logging),__T(syslog.title),'log-asp.htm',0,'admin_log_settings.html');
Menu[m][sid++]=new Array(__T(mang.administration),__T(syslog.logging),__T(logemail.set),'log_email-asp.htm',0,'admin_log_email.html');
Menu[m][sid++]=new Array(__T(mang.administration),__T(bonjour.title),'','bonjour-asp.htm',0,'admin_bonjour.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.timesetting),'','time_zone-asp.htm',0,'admin_date_time.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.bkrestoreset),'','backup-asp.htm',0,'admin_backup.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(router.fwupgrade),'','upgrade-asp.htm',0,'admin_firmware.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.reboot),'','reboot-asp.htm',0,'admin_restart.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.restoredef),'','factory-asp.htm',0,'admin_factory.html','111111');
Menu[m][sid++]=new Array(__T(mang.administration),__T(mang.setupwizard),'','wizard-asp.htm',0,'','111111');
Menu[m++][sid++]=new Array(__T(mang.administration),__T(mang.vpnsetupwizard),'','wizard_vpn-asp.htm',0,'','111111');

sid=0;
var MHELP=new Array();
MHELP[sid++]=new Array('Wireless_Manual-asp.htm', 'WL_WPATable-asp.htm','wireless_security.html');
MHELP[sid++]=new Array('Wireless_Manual-asp.htm', 'Wireless_MAC-asp.htm','wireless_mac_filter.html');
MHELP[sid++]=new Array('Wireless_Manual-asp.htm', 'access_time-asp.htm','wireless_time_day.html');
MHELP[sid++]=new Array('schedule_manage-asp.htm', 'schedule_manage_edit-asp.htm','firewall_sched_add_edit.html');
MHELP[sid++]=new Array('filter-asp.htm', 'filter_edit-asp.htm','firewall_policy_add_edit.html');
MHELP[sid++]=new Array('ip_based_acl-asp.htm', 'ip_based_acl_edit-asp.htm','firewall_access_add.html');
MHELP[sid++]=new Array('ip_based_acl-asp.htm', 'ip_based_acl_order-asp.htm','firewall_access.html');
MHELP[sid++]=new Array('vpn_basic-asp.htm', 'vpn_basic_view-asp.htm','vpn_default_values.html');
MHELP[sid++]=new Array('vpn_adv-asp.htm', 'ike_edit-asp.htm','vpn_ike_add_edit.html');
MHELP[sid++]=new Array('vpn_adv-asp.htm', 'ipsec_edit-asp.htm','vpn_policy_add_edit.html');



var close_session = '1';

var disableKey = function(e){
	if( !e ) var e = window.event;
	var keycode = e.keyCode;
	if( e.which ) keycode = e.which;
	var src = e.srcElement;
	if ( e.target ) src = e.target;
	if ( 116 == keycode || 13 == keycode ) 
	{
		if ( e.preventDefault ) 
		{
			e.preventDefault();
			e.returnValue = false;
		}else if( e.keyCode ){
			e.keyCode = 0;
			e.returnValue = false;
			e.cancelBubble = true;
		}
		return false;
	} 
}

function __T(obj)
{
	return obj;
}

function __TC(obj)
{
	if ( now_lang == "FR" ) 
		return obj+" :";
	else
		return obj+":";
}

function get_url_key(flg)
{
        var NOWPATH;
	var pos=0;
	var tmp="";
	if ( typeof flg != "undefined" && flg == 1 ) 
	{
		if ( Browser == "Firefox" ) 
		{
			NOWPATH = document.location.href;
			if ( NOWPATH.indexOf(";") != -1 ) 
				tmp = NOWPATH.substring(NOWPATH.lastIndexOf(";"), NOWPATH.length);
		}
		else
		{
        		NOWPATH = document.location.pathname.substring(1,document.location.pathname.length);
			pos = NOWPATH.indexOf(";");
			if ( pos != -1 ) 
				tmp = NOWPATH.substring(pos,document.location.pathname.length);
		}
 	// For apply or gozila cgi used
 		if ( tmp.indexOf(";") != -1 ) 
		{
 			if ( document.forms[0].session_key ) 
 				document.forms[0].session_key.value = tmp.substring(tmp.indexOf("=")+1,tmp.length);
		}
 		return tmp;
 	}
 	else
 	{
 		return parent.document.getElementById("session_key").value;
 	}
}

function get_position(page,flg)
{
	var getflg=0;
	var itemcnt=0;
	if ( typeof flg == "undefined" ) flg = 0;
	for(var i=0; i<Menu.length; i++)
	{
		itemcnt=0;
		for(var j=0; j<Menu[i].length; j++)
		{
                        if ( (j!=0 && Menu[i][j-1][1] != Menu[i][j][1]) ) itemcnt++;
			if ( page == Menu[i][j][3] )
			{
				if ( Menu[i][j][2] !="" && 
                                     (typeof Menu[i][j+1][1] != 'undefined' && Menu[i][j+1][1] == Menu[i][j][1]) || 
				     ( j!=0 &&
				     (typeof Menu[i][j-1][1] != 'undefined' && Menu[i][j-1][1] == Menu[i][j][1])) )
				{
                                    if((j!=0 && (typeof Menu[i][j-1][1] != 'undefined' && Menu[i][j-1][1] != Menu[i][j][1])) || 
				       (j<Menu[i].length-1 && typeof Menu[i][j+1][1] != 'undefined' &&
					Menu[i][j+1][1] != Menu[i][j][1]) || j == Menu[i].length-1 )
					itemcnt++;
                			parent.document.getElementById("fun").contentWindow.SEL_THRMENU(i,j,itemcnt,flg);	
				}else{
                			parent.document.getElementById("fun").contentWindow.SEL_SUBMENU(i,j,flg);
					getflg = 1;
				}
			}
		}
		if ( getflg == 1 ) break;
	}
}

function get_now_url()
{
        var NOWPATH = document.location.pathname.substring(1,document.location.pathname.length);
        if ( close_session != "1" )
        {
                if ( Browser == "Firefox" )
                        NOWPATH = document.location.pathname.substring(1,document.location.pathname.length);
                else
                        NOWPATH = document.location.pathname.substring(1,document.location.pathname.indexOf(";"));
        }
        return NOWPATH;
         
}

function goto_page(page,flg)
{
	var url,tmpurl;
	var NOWPATH;
	NOWPATH = get_now_url();

	if ( page != "#" ) parent.document.getElementById("newpage").value = page;
	if ( page != "Wireless_WPS-asp.htm" ) 
	{
		if ( parent.document.getElementById("rightframe") ) 
			parent.document.getElementById("rightframe").contentWindow.before_leave();
		if ( parent.document.getElementById("GUI_FUN").value == 0 ) return;
		if ( parent.document.getElementById("GUI_FUN").value == 1 )
			parent.document.getElementById("GUI_FUN").value = 0;
	}
	tmpurl = goto_link(page,flg);
	if ( NOWPATH.substring(0,4) == "https" && url.indexOf("https") == -1 ) 
		url = "http://192.168.1.1/" + tmpurl;
	else
		url = tmpurl;
	if ( parent.document.getElementById("GUI_LOCK").value == 0 )  
	{
		//alert("goto_page(), enter GUI LOCK = 0");
		//alert(parent.document.getElementById("rightframe").src);
		if ( parent.document.getElementById("rightframe") != 'undefined' )
	            	parent.document.getElementById("rightframe").src = url;
	}
}

function goto_link(page,gui_st) 
	    { 
		return page; 
	    } 
	    function goto_link2(page,gui_st)
{
	var url = "";
	var pos=0;
	var is_wps=0;
	var tmp_page;
	var session_key="";
	//alert("close_session="+close_session);
	if ( close_session != "1" ) 
	{
		if ( parent.document.getElementById("session_key") )
		{
			if ( session_key == "" ) session_key = get_url_key(); 
		}else{
			if ( session_key == "" ) session_key = get_url_key(1); 
		}
//		alert("session_key="+session_key);
		if ( session_key.indexOf("session_id") != -1 )
			url = page + session_key;
		else
			url = page + ";session_id="+ session_key;
	}
	if ( url == "" ) url = page ;
//	alert("url="+url);
	return url;

}

