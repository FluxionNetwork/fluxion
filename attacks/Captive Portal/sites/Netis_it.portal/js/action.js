var APINPUT=null;var APMAC='';var APSSID='';var APCHAN='';var MOD="save";var MODData='';var sec_map={'0':'None','1':'WEP','2':'WPA-PSK','3':'WPA2-PSK','4':'WPA/WPA2-PSK'};var net_map={'0':'AP','1':'WDS','2':'AP+WDS','3':'CLIENT','4':'REPEATER','5':'WDS','6':'AP+WDS'};var wisp_map={'3':'WISP-PPPoE','1':'WISP-Dynamic IP','0':'WISP-Static IP'};var comm_map={'3':'PPPoE','1':'Dynamic IP','0':'Static IP','4':'Russia PPPoE','5':'Unifi PPPoE','6':'L2TP/Russia L2TP','7':'PPTP/Russia PPTP','8':'Maxis PPPoE'};var refresh_time=null;function refresh_ten_time(){if(refresh_time!=null){window.clearInterval(refresh_time);}
refresh_time=window.setInterval(function(){getAppData(function(data){$.Refresh();})},10000);}
var sys_status_time=null;function init_status(){if(sys_status_time!=null){window.clearInterval(sys_status_time);}
get_sys_status();init_version();sys_status_time=window.setInterval(get_sys_status,5000);}
function get_sys_status(){if($.CurrentApp!="status"){window.clearInterval(sys_status_time);return;}
getAppData(function(data){data=$.DataMap;setAppTagData(data);if($.CurrentApp=='status'){change_status_show(data);getTag('status_wan','connected').btn.entity.onclick=function(){var obj=new Object();var val=(data.connected=='0')?'1':'0';obj.connected=val;var ct=(data.connected=='0')?"connect_tip":"disconnect_tip";if(confirm($.CommonLan[ct])){setAppData(null,obj,function(data){});}else{return;}}
getTag('status_wan','connected').btn.entity.value=(data.connected=='0')?$.CommonLan['connect']:$.CommonLan['disconnect'];}});}
function getConntypeLanguage(index){var conntypes=eval("("+Language[$.Language].network.wan.conntype_options+")");var conntypeOptions=eval("("+Panels.wan[3].tags[0].value+")");for(var i=0;i<conntypeOptions.length;i++){if(index==conntypeOptions[i]){return(conntypes[i].indexOf('('))?conntypes[i].split('(')[0]:conntypes[i];}}}
function change_status_show(data){var data=$.DataMap;(data.conntype==6)?getPan(0).show():getPan(0).hide();(data.conntype==7)?getPan(1).show():getPan(1).hide();var secd=(data.conntype==4||data.conntype==5||data.conntype==8)?'show':'hide';getTag(2,7).setAttr({"style":"border-top:1px solid green"});setTagDomAction(2,[7,8],null,secd);getTag(2,"connected").btn.entity.value=(data.connected=='0')?$.CommonLan['connect']:$.CommonLan['disconnect']; if(data.access_mode=='2'){getTagDom(2,0,"context").html("WISP-"+getConntypeLanguage(data.conntype));getTagDom(2,1,"context").html(data.wl_mac);}else{var c_val=($.DataMap.chip_flag=='1'&&data.conntype=='6')?"L2TP":getConntypeLanguage(data.conntype);getTagDom(2,0,"context").html(c_val);} 
var con=data.connected;var val=(con=="0")?$.CommonLan['disconnected']:$.CommonLan['connected'];getTagDom(2,"connected","context").html(val);var disab=(data.conntype=='0')?true:false;getTag(2,'connected').btn.entity.disabled=disab; var dhcp=data.dhcp_enable;var dhcp_v=(dhcp=='0')?$.CommonLan['off']:$.CommonLan['on'];getTagDom(3,3,"context").html(dhcp_v);var dhcp_f=(dhcp=='1')?(" ("+$.DataMap.dhcp_start_ip+"-"+$.DataMap.dhcp_end_ip+")"):"";getTagDom(3,3,"con_after").html(dhcp_f); var wl=data.wl_enable;var wl_v=(wl=='0')?$.CommonLan['off']:$.CommonLan['on'];getTagDom(4,0,"context").html(wl_v); var mode_v=net_map[data.net_mode];getTagDom(4,2,"context").html(mode_v); var sec_v=sec_map[data.sec_mode];getTagDom(4,3,"context").html(sec_v); if(data.channel=='0'){var ch_val=(data.real_channel=='0')?$.CommonLan['auto_type']:data.real_channel;getTagDom(4,4,"context").html(ch_val);} 
var wps=data.wps_enable;var wps_v=(wps=='0')?$.CommonLan['off']:$.CommonLan['on'];getTagDom(4,6,"context").html(wps_v);}
function init_version(){var data=$.DataMap;if(data.version){ID("version_v").innerHTML=data.version.split("(")[1].split(")")[0];var v=data.version.split("-")[1].split(",")[0];ID("version_n").innerHTML=v;}
document.title=$.CommonLan['advanced_title'];if($.Debug)
var str=window.location.toString().replace('index.htm','welcome.htm');else

var str=window.location.toString().replace(/index.htm/g,'');document.getElementById("welcomea").href=str;var sel=document.getElementById('menu_bottom');if(!sel.innerHTML&&$.ShowLan){var option=eval("("+$.Lan_opt+")");var select=new CreateSelect(option);sel.appendChild(select.entity);}}
var diag_timer=null;var tools_cmd='1';function init_diagnostic(){setAppTagData($.DataMap);if(diag_timer!=null){window.clearInterval(diag_timer);}
getTag(0,1).btn.entity.value=$.CommonLan["start"];getTag(0,1).btn.entity.onclick=function(){tools_cmd=(tools_cmd=='1')?'0':'1';var str=(tools_cmd=='1')?"start":"end";getTag(0,1).btn.entity.value=$.CommonLan[str];beginCheck(str);}
var cont=new Element("DIV");var Cl=($.BrowserVersion.indexOf('IE6')!=-1)?"df_diag_ie":"df_diag";cont.setClass(Cl);getTag(0,3).append(cont);getTag(0,3).cont=cont;getTag(0,3).entity.style.padding="0px 0px 10px 30px";getTag(0,3).entity.style.width="610px";getTag(0,3).cont.entity.innerHTML="The Router is ready.";}
function beginCheck(fl){if(!checkTag([0])){return;}
if(diag_timer!=null){window.clearInterval(diag_timer);}
setAppData(null,[0],function(data){diag_timer=window.setInterval(function(){if($.CurrentApp!="diagnostic"){window.clearInterval(diag_timer);return;}
getAppData(function(data){getTag(0,3).cont.entity.innerHTML=parse_diagnostic(data.tools_results);});},1000);})}
function parse_diagnostic(data){var arr=data.split(';');var str='';for(var i in arr){str+=arr[i]+'<br>';}
return str;}
function setWPSDisable(bo){disableDom(getTag(0,1).btn,bo);disableDom(getTag(0,2).btn,bo);}
function setWPSStyle(wps){if($.DataMap.wps_enable=="0"){getTag(0,0).context.html($.CommonLan["off"]);getTag(0,0).context.entity.style.color="red";wps.setValue($.CommonLan["wps_on"]);setWPSDisable(true);}else if($.DataMap.wps_enable=="1"){getTagDom(0,0,"context").html($.CommonLan["on"]);getTag(0,0).context.entity.style.color="green";wps.setValue($.CommonLan["wps_off"]);setWPSDisable(false);}
getTag(0,1).context.entity.innerHTML=$.DataMap.pin;getTag(0,1).btn.entity.value=$.CommonLan["new_pin"];}
function init_wl_wps(){setWPSStyle(getTag(0,0).btn); getAppData(function(data){setAppTagData($.DataMap);var wps=getTag(0,0).btn;wps.entity.onclick=function(){var obj=new Object();obj.wps_mode='enable';var val=($.DataMap.wps_enable=='0')?'1':'0';obj.wps_enable=val;setAppData('save',obj,function(data){$.Refresh();});}
var pin=getTag(0,1).btn;pin.entity.onclick=function(){var obj=new Object();obj.wps_mode="mkpin";setAppData(null,obj,function(data){$.Refresh();});}
setWPSStyle(wps);});}
function init_wps_hand_add(tag){if(tag.panel[0].pin){return;}
var pin=new DefaultInput(null,"text",'simple_text');pin.setID('new_pin');pin.entity.maxLength='8';tag.panel[0].push(pin);tag.panel[0].pin=pin;getTag(1,0).panel[0].radio.checked();}
function hand_add_show(){getPan(1).display='1';$.Apps[$.CurrentApp].Pans[1].show();}
function hand_add_hide(){$.Apps[$.CurrentApp].Pans[1].hide();}
function add_link_pin(){if(getTag(1,0).data=='pin'){if(!checkDom(getTag(1,0).panel[0].pin,"text_pin")){return;}}
var obj=new Object();obj.wps_mode=getTag(1,0).data
obj.pin_host=getTag(1,0).panel[0].pin.entity.value;setAppData('add',obj,function(data){$.Apps[$.CurrentApp].Pans[1].hide();});}
function refresh_wps_list(){getAppData(function(data){$.Refresh();});}
function change_conntype_options(arr){for(var i=0;i<arr.length;i++){if(arr[i].indexOf('L2TP/index.html')!=-1){arr[i]=arr[i].split('http://www.netis-systems.com/')[0];}}}
function change_wan_sec_mode(tag){var val=(getTag(1,'rp_sec_mode').data=='0')?'0':'1';getPan(2).display=val;setTagDomAction(2,[0,1,2,3,4,5],null,'hide');switch(tag.data){case'0':setPanAction([2],'hide');break;case'1':setPanAction([2],'show');setTagDomAction(2,[0,2,4],null,'show');break;default:setPanAction([2],'show');setTagDomAction(2,[1,3,5],null,'show');break;}
var va=getTag(1,'rp_sec_mode').data;getPan(2).title.entity.innerHTML=sec_map[va];add_wep_wpa_after();}
function interface_mode_check(tag){if(tag.data=='0'){setPanAction([1,2],'hide');setPanArr([1,2],'0');setTagDomAction(1,[0,1],null,'hide');setTagDomAction(2,[0,1,2,3,4,5],null,'hide');var lan=($.ShowLan)?$.Lan_map[$.DataMap.language]:$.Language;var arr=eval("("+Language[lan].network.wan.conntype_options+")");if($.DataMap.chip_flag=='1'){change_conntype_options(arr);}
var arr_v=getTag(3,'conntype').value;for(var i=0;i<arr.length;i++){var opt=new Option(arr[i],arr_v[i]);getTag(3,"conntype").select.entity.options[i]=opt;}
getTag(3,0).select.checked($.DataMap.conntype);}else{setPanArr([1,2],'1');setPanAction([1,2],'show');setTagDomAction(1,[0,1],null,'show');change_wan_sec_mode(getTag(1,'rp_sec_mode'));change_wisp_connect_type();}}
function change_wan_connect_type(tag){$.Flag='0';getPan(4).hide();var showArr={'3':[1,2,20,21,26,27,28,29,30],'1':[20,22,28,29],'0':[17,18,19,20,23,28,29],'4':[1,2,20,21,26,27,28,29,30],'5':[1,2,20,21,26,27,28,29,30],'6':[3,4,5,6,7,8,9,20,24,28,29,31],'7':[10,11,12,13,14,15,16,20,25,28,29,32],'8':[1,2,20,21,26,27,28,29,30]
};setTagDomAction(3,['1-32'],null,'hide');setTagDomAction(3,showArr[tag.select.entity.value],null,'show');if(tag.select.entity.value=='4'||tag.select.entity.value=='5'||tag.select.entity.value=='8'){getPan(4).show();}
show_wan_advance();change_second_in(getTag(3,'l2tp_type'));change_second_in(getTag(3,'pptp_type'));tag.after.entity.style.color="red";(tag.data==5||tag.data==8)?(tag.after.show()):(tag.after.hide());getTag(3,'dns_a').after.entity.style.display=(tag.select.entity.value=='0')?'none':'block';}
function add_ppp_time_text(tag){var str=tag.panel[1].txt.entity.innerHTML.split('#');var txt=new Element('DIV');var time=new Element('input');time.entity.type='text';var cls=($.BrowserVersion=='Firefox')?'df_text_fire':'df_text';time.entity.className=cls;time.entity.id=tag.name.split('_')[0]+'_time';time.entity.maxLength='2';time.entity.style.width='20px';time.entity.style.height='15px';var span_a=new Element("SPAN");span_a.entity.style.float='left';span_a.html(str[0]);var span_b=new Element("SPAN");span_b.entity.style.float='left';span_b.html(str[1]);txt.push(span_a,time,span_b);tag.panel[1].txt.html(txt.entity.innerHTML);time_disable(tag);}
function time_disable(tag){if(!tag){return;}
var flag=(tag.data=='1')?false:true;ID(tag.name.split('_')[0]+'_time').disabled=flag;}
function init_mac_clone(){var btn_a=getTag(3,'mac_addr').btn_a;btn_a.entity.style.width='120px';btn_a.setValue($.CommonLan["clone_mac"]);btn_a.entity.onclick=function(){var val=($.DataMap.access_mode=='0')?$.DataMap.mac_default:$.DataMap.wl_mac_def;getTag(3,'mac_addr').text.entity.value=$.DataMap.mac_clone;}
var btn_b=getTag(3,'mac_addr').btn_b;btn_b.entity.style.width='120px';btn_b.setValue($.CommonLan["df_mac"]);btn_b.entity.onclick=function(){getTag(3,'mac_addr').text.entity.value=$.DataMap.mac_default;}
}
function setWanData(){getTag(3,'l2tp_ip').text.entity.value=$.AllData.l2tp_ip;getTag(3,'l2tp_mask').text.entity.value=$.AllData.l2tp_mask;getTag(3,'l2tp_gw').text.entity.value=$.AllData.l2tp_gw;getTag(3,'pptp_ip').text.entity.value=$.AllData.pptp_ip;getTag(3,'pptp_mask').text.entity.value=$.AllData.pptp_mask;getTag(3,'pptp_gw').text.entity.value=$.AllData.pptp_gw;ID('ppp_time').value=$.DataMap.ppp_time;ID('l2tp_time').value=$.DataMap.l2tp_time;ID('pptp_time').value=$.DataMap.pptp_time;}
function change_wisp_connect_type(){var mode=getTag("mode","access_mode").data;var sel=getTag("wan_set","conntype").select;var opt_new=eval("("+sel.wisp+")");var opt_old=sel.opt;var newlen=opt_new.length;var oldlen=opt_old.length;var opt_val=eval("("+Language[$.Language].network.wan.conntype_options+")");var opt_arr=new Object();if(mode=='2'||mode=='3'){ for(var i=0;i<newlen;i++){var j=0;while(j<oldlen){if(opt_new[i]==opt_old[j]){opt_arr[i]=opt_val[j];break;}
j++;}}
for(var k in opt_new){var opt=new Option(opt_arr[k],opt_new[k]);sel.entity.options[k]=opt;}
sel.entity.options.length=newlen;var chVal=(mode!=$.DataMap.access_mode)?'1':$.DataMap.conntype;sel.checked(chVal);}}
function init_wan_set(){setAppTagData($.DataMap);setWanData();init_ap_scan();init_mac_clone();interface_mode_check(getTag(0,0));change_wan_connect_type(getTag(3,0));change_second_type(getTag(4,0));}
function save_wan_set(){if(!checkTag([1,2,3,4])){return;}
var val=getTag(3,'conntype').select.entity.value;var opmode=getTag(0,'access_mode').data;if(opmode=='2'){if(APCHAN!=0){var len=getTag(2,'rp_key_wep').text.entity.value.length;if(APSEC=='WEP'&&len!=5&&len!=10&&len!=13&&len!=26){checkShow(getTagDom(2,'rp_key_wep','text'),$.CommonLan['_default']);return;}else if(APSEC!='no'&&APSEC!='WEP'&&getTag(2,'rp_key_wpa').text.entity.value.length<8){checkShow(getTagDom(2,'rp_key_wpa','text'),$.CommonLan['_default']);return;}}else
if(!check_wl_key(getTag(1,'rp_sec_mode'),'1')){return;}}
if(!check_ppp_time(getTag(3,'ppp_connect_mode'),3)){return;}
if(!check_ppp_time(getTag(3,'ppp_connect_mode'),4)){return;}
if(!check_ppp_time(getTag(3,'ppp_connect_mode'),5)){return;}
if(!check_ppp_time(getTag(3,'l2tp_connect_mode'),6)){return;}
if(!check_ppp_time(getTag(3,'pptp_connect_mode'),7)){return;}
var s_ip=getTag(3,'wan_ip').text.entity.value;var s_mask=getTag(3,'wan_mask').text.entity.value;var s_gw=getTag(3,'wan_gw').text.entity.value;if(val=='0'){ if(!check_ip_mask(s_ip,s_mask,getTag(3,'wan_ip'))){return;}
if(!check_ip_mask(s_gw,s_mask,getTag(3,'wan_gw'),s_ip)){return;}
if(!check_wan_lan_segment(getTag(3,'wan_ip'),getTag(3,'wan_mask'),'wan',getTag(3,'wan_gw'))){return;}
if(getTag(3,'dns_a').text.entity.value==''){checkShow(getTag(3,'dns_a').text,$.CommonLan['dns_null_err']);return;}}
if((val==4||val==5)&&getTag(4,0).data==1){var ip_s=getTag(4,1).text.entity.value;var mk_s=getTag(4,2).text.entity.value;if(!check_ip_mask(ip_s,mk_s,getTag(4,1))){return;}
if(!check_wan_lan_segment(getTag(4,1),getTag(4,2),'wan')){return;}}
if(val=='6'&&getTag(3,'l2tp_type').data=='1'){var ip_l=getTag(3,'l2tp_ip').text.entity.value;var mk_l=getTag(3,'l2tp_mask').text.entity.value;var gw_l=getTag(3,'l2tp_gw').text.entity.value;if(!check_ip_mask(ip_l,mk_l,getTag(3,'l2tp_ip'))){return;}
if(!check_ip_mask(gw_l,mk_l,getTag(3,'l2tp_gw'),ip_l)){return;}
if(!check_wan_lan_segment(getTag(3,'l2tp_ip'),getTag(3,'l2tp_mask'),'wan')){return;}}
if(val=='7'&&getTag(3,'pptp_type').data=='1'){var ip_p=getTag(3,'pptp_ip').text.entity.value;var mk_p=getTag(3,'pptp_mask').text.entity.value;var gw_p=getTag(3,'pptp_gw').text.entity.value;if(!check_ip_mask(ip_p,mk_p,getTag(3,'pptp_ip'))){return;}
if(!check_ip_mask(gw_p,mk_p,getTag(3,'pptp_gw'),ip_p)){return;}
if(!check_wan_lan_segment(getTag(3,'pptp_ip'),getTag(3,'pptp_mask'),'wan')){return;}}
setAppData('save',[0,1,2,3,4,5],function(data){$.Refresh();});}
function show_wan_advance(){var val=getTag(3,0).select.entity.value;var hideArr={'3':[20,21,26,27,28,29],'1':[20,22,28,29],'0':[20,23],'4':[20,21,26,27,28,29],'5':[20,21,26,27,28,29],'6':[20,24,28,29],'7':[20,25,28,29],'8':[20,21,26,27,28,29]
};($.Flag==1)?(setTagDomAction(3,hideArr[val],null,'show'),$.Flag=0):(setTagDomAction(3,hideArr[val],null,'hide'),$.Flag=1);}
function change_second_in(tag){var ty=(tag.data==1&&tag.entity.style.display=='block')?'show':'hide';var pan=(tag.name=='l2tp_type')?[7,8,9]:[14,15,16];setTagDomAction(3,pan,null,ty);}
function change_second_type(tag){var ty=(tag.data==0)?'hide':'show';setTagDomAction(4,[1,2],null,ty);}
function init_lan_set(){getAppData(function(data){setAppTagData($.DataMap);change_dhcp_list_show();dhcp_disable();});}
function save_lan_set(){if(!checkTag([0])){return;}
if(!check_ip_mask(getTag(0,0).text.entity.value,getTag(0,1).text.entity.value,getTag(0,0))){return;}
var lan_ip=getTag(0,0).text.entity.value;var obj=new Object();obj.lan_ip=lan_ip;obj.lan_mask=getTag(0,1).text.entity.value;if(confirm($.CommonLan["reboot_tip"])){ID("p_menu_misc").onclick();ID("c_menu_reboot").onclick();reboot('http://'+lan_ip,obj);}else{return;}}
function dhcp_disable(){var flag=(getTag(1,0).data=='0')?true:false;disableDom(getTagDom(1,1,"text"),flag);disableDom(getTagDom(1,2,"text"),flag);}
function save_dhcp_server(){if(!checkTag([1])){return;}
if(getTag(1,0).data=='1'){if(!check_ip_limit(getTag(1,1),getTag(1,2),'dhcp')){return;}}
setAppData('save',[1],function(data){});}
function keep_dhcp(row){getAppData(function(data){var list=$.AllData.reservation_list;if(row.data.reserved!="Dynamic"){alert($.CommonLan['reserved_keep']);return;}
var parame=new Object();parame.reserve_des=row.data.host;parame.reserve_ip=row.data.ip;parame.reserve_mac=row.data.mac;var obj=saveTablelist(list,parame);setAppData('add',obj,function(data){MOD='save';$.Refresh();});});}
function cancel_dhcp(row){var list=$.AllData.reservation_list;if(row.data.reserved=="Dynamic"){alert($.CommonLan['reserved_cancel']);return;}
for(var i=0;i<list.length;i++){if(list[i].reserve_ip==row.data.ip&&list[i].reserve_mac==row.data.mac){var row_id=list[i].id;}}
var obj=delTablelist(list,row_id);setAppData('save',obj,function(data){$.Refresh();});}
function dhcp_keep_all(){var list_d=$.AllData.dhcp_client_list;var list_r=$.AllData.reservation_list;var tmp_list=list_r;var obj=new Array();for(var i=0;i<list_d.length;i++){if(list_d[i].reserved=='Dynamic'){var parame=new Object();parame.id=tmp_list.length+1;parame.reserve_des=list_d[i].host;parame.reserve_ip=list_d[i].ip;parame.reserve_mac=list_d[i].mac;tmp_list.splice(tmp_list.length,0,parame);}}
if(!getLen(parame)){for(var i=0;i<tmp_list.length;i++){var new_id=parseInt(tmp_list[i].id);for(var j in tmp_list[i]){obj[j+new_id]=tmp_list[i][j];}
obj['id'+new_id]=new_id;}}else{tmp_list.splice(tmp_list.length-1,1);obj=saveTablelist(tmp_list,parame);}
setAppData('save',obj,function(data){$.Refresh();});}
function init_iptv_set(){setAppTagData($.DataMap);}
function change_iptv_mode(tag){setPanAction([1,2,3],'hide');if(tag.data==1){getPan(1).show()}else if(tag.data==2){setPanAction([2,3],'show');}}
function save_iptv(){if(getTag(0,0).data=="2"){if(!checkTag([2])){return;}}
if(getTag(0,0).data=="1"&&$.DataMap.iptv_mode!="1"){var obj=getSubmitData([0,1,2,3]);setLogic(obj);var lan_ip=$.DataMap.lan_ip;if(confirm($.CommonLan["reboot_tip"])){ID("p_menu_misc").onclick();ID("c_menu_reboot").onclick();reboot('http://'+lan_ip,obj);}else{return;}}else
setAppData('save',[0,1,2,3],function(data){});}
function init_reserve(){setAppTagData($.DataMap);get_ip_arr($.DataMap.reservation_list,"reserve_ip");}
function add_reservation(tag){getAppData(function(data){var list=$.AllData.reservation_list;$.TabLen=list.length;if(!checkTag([0])){return;}
if($.TabLen>=20&&MOD!="mod"){checkShow(getTagDom(0,0,'text'),$.CommonLan['item_err']);return;}
if(!check_lan_ip(getTag(0,1))){return;}
if(!check_ip_list(getTag(0,1),'reserve_ip')){return;}
var obj=saveTablelist(list,[0]);setAppData('add',obj,function(data){MOD=tag.name;$.Refresh();});});}
function mod_reservation(row){MOD="mod";setModify(row.data);MODData=row.data;SetCancelBtn(getTag(0,3),'1');}
function del_reservation(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.reservation_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_all_reservation(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_opmode_set(){setAppTagData($.DataMap);}
function save_opmode(){setAppData('save',[0],function(data){$.Refresh();});}
var APTYPE='';var APSCAN=true;var APSEC='';var aptype_map={'TKIP':'1','AES':'2','AES&TKIP':'3'};var apsec_map={'no':'0','WEP':'1','WPA':'2','WPA-PSK':'2','WPA2':'3','WPA2-PSK':'3','WPA/WPA2':'4','WPA-PSK/WPA2':'4','WPA-PSK/WPA2-PSK':'4'};function init_ap_scan(){APTYPE='';APMAC='';APSCAN=true;var tag=($.CurrentApp=="wan")?(getTag(1,0).btn):(getTag(0,'repeater_ssid').btn);tag.entity.value=$.CommonLan['ap_get'];tag.entity.onclick=function(){APINPUT=$.CurrentApp;getAPInfo();}}
function getAPInfo(){if($.CurrentApp=='base'){var tag=getPan(6).Tags['ap_get'];}else if($.CurrentApp=='wds'){var tag=getPan(2).Tags['ap_get'];}else{ var tag=getPan(5).Tags['ap_get'];}
var tag=new initSimpleTable(tag);var tab=tag.tab;tab.entity.style.width="800px";$.lockWin($.CommonLan['search'],true);getRequestData("netcore_get",{"ap_scan":"1","wlan_idx_num":"0"},function(data){var _data=new Array();data=$.DataMap.ap_scan_list;for(var i=0;i<data.length;i++){var obj=new Object();obj.id=i;obj2obj(obj,data[i]); var btn='<input type="radio" name="ap_enable" value='+$.CommonLan['connect']+' id='+i+' onclick="get_ap_info(this.id)"/>';obj.btn=btn;_data.push(obj);}
if(tab.tbody){tab.data=_data;tab.tbody.refresh();}else{tab.createTable(_data);}
$.unlockWin();$.lockWin(' ',true);tag.entity.style.width="800px";$.Lock.load.push(tag);tag.show();});}
function set_ap_scan_show(){if(APSEC=='WEP'){getTag(2,0).hide();getTag(2,2).hide();getTag(2,4).text.entity.maxLength=26;getTag(2,4).after.entity.style.display='none';}else if(APSEC=='WPA'||APSEC=='WPA-PSK'||APSEC=='WPA2'||APSEC=='WPA2-PSK'||APSEC=='WPA/WPA2'||APSEC=='WPA-PSK/WPA2'||APSEC=='WPA-PSK/WPA2-PSK'){getTag(2,3).hide();getTag(2,5).text.entity.maxLength=64;getTag(2,5).after.entity.style.display="none";}}
function get_ap_info(id){if($.CurrentApp=='base'){var tab=getPan(6).Tags['ap_get'].tab;}else if($.CurrentApp=='wds'){var tab=getPan(2).Tags['ap_get'].tab;}else{ var tab=getPan(5).Tags['ap_get'].tab;}
var data=tab.tbody.Rows[id-tab.size*(tab.page-1)].data;var aptype=$.AllData.ap_scan_list[id].wl_ss_type;APTYPE=(aptype!='--')?aptype_map[aptype]:'2';APSCAN=(data.wl_ss_secmo!='no')?false:true;APCHAN=data.wl_ss_channel.split(' ')[0];APSSID=data.wl_ss_ssid;APMAC=data.wl_ss_bssid;APSEC=data.wl_ss_secmo;switch(APINPUT){case'base':getTagDom(0,'channel','select').checked(APCHAN);getTagDom(0,'repeater_ssid','text').setValue(APSSID);getTagDom(0,'repeater_ssid','text').entity.value=APSSID;getTagDom(0,'repeater_mac','text').setValue(APMAC);var netmode=getTag(0,'net_mode').select.entity.value;var secmo=(apsec_map[data.wl_ss_secmo]=='4')?'3':apsec_map[data.wl_ss_secmo];if(netmode==3&&getTag(0,'cl_config').data==1){ getTagDom(2,'cl_sec_mode','select').checked(secmo);if(getTag(2,0).data==2||getTag(2,0).data==3)
if(APTYPE!='3'){getTag(2,2).panel[parseInt(APTYPE)-1].radio.checked();}}else if((netmode==4||netmode==6)&&getTag(0,'rp_config').data==1){ getTagDom(3,'rp_sec_mode','select').checked(secmo);if(getTag(3,0).data==2||getTag(3,0).data==3)
if(APTYPE!='3'){getTag(3,2).panel[parseInt(APTYPE)-1].radio.checked();}}
break;case'wan':getTagDom(1,'repeater_ssid','text').setValue(APSSID);getTagDom(1,'channel','select').checked(APCHAN);var secmo=(apsec_map[data.wl_ss_secmo]=='4')?'3':apsec_map[data.wl_ss_secmo];getTagDom(1,'rp_sec_mode','select').checked(secmo);var typepan=(secmo=='2'&&APTYPE=='3')?'0':(APTYPE=='3')?'1':(parseInt(APTYPE)-1); if(typepan)getTag(2,1).panel[typepan].radio.checked();set_ap_scan_show();break;case'wds':getTagDom(0,0,'text').setValue(APSSID);getTagDom(0,1,'text').setValue(APMAC);break;}}
function save_ap_scan(){$.unlockWin();if($.CurrentApp=='base'){disableDom(getTagDom(2,'cl_key_auto','text'),APSCAN);disableDom(getTagDom(3,'rp_key_auto','text'),APSCAN);}}
function refresh_ap_scan(tag){getRequestData("netcore_get",{"ap_scan":"1","wlan_idx_num":"0"},function(data){var _data=new Array();data=$.DataMap.ap_scan_list;var tab=getTag('ap_get','ap_get').tab;for(var i=0;i<data.length;i++){var obj=new Object();obj.id=i;obj2obj(obj,data[i]); var btn='<input type="radio" name="ap_enable" value='+$.CommonLan['connect']+' id='+i+' onclick="get_ap_info(this.id)"/>';obj.btn=btn;_data.push(obj);}
if(tab.tbody){tab.data=_data;tab.tbody.refresh();}else{tab.createTable(_data);}});}
function init_wl_base(){init_ap_scan();setAppTagData($.DataMap);if($.DataMap.access_mode=='2'){getTag(0,'net_mode').data='0';getTag(0,'net_mode').select.entity.options.length=1;}
}
function save_wl_base(){if(!checkTag([0])){return;}
var netmode=getTag(0,'net_mode').select.entity.value;if(netmode=='1'||netmode=='2'){if(!check_wl_key(getTag(1,'wds_sec_mode'),'0','wds')){return;}} 
if(netmode=='0'||netmode=='2'||netmode=='6'){if(!check_wl_key(getTag(4,'sec_mode'))){return;}} 
if((netmode=='3'||netmode=='5')&&getTag(0,10).data!='0'){ if(!check_wl_key(getTag(2,'cl_sec_mode'))){return;}}else if(netmode=='3'&&getTag(0,10).data=='0'&&!getTag(2,'cl_key_auto').text.entity.disabled){ var len=getTag(2,'cl_key_auto').text.entity.value.length;if(APSEC=='WEP'&&len<5){checkShow(getTagDom(2,'cl_key_auto','text'),$.CommonLan['_default']);return;}else if(APSEC!='no'&&APSEC!='WEP'&&len<8){checkShow(getTagDom(2,'cl_key_auto','text'),$.CommonLan['_default']);return;}
if(!checkDom(getTag(2,'cl_key_auto').text,"text_string")){return;}}
if((netmode=='4'||netmode=='6')&&getTag(0,11).data!='0'){ var rp=(netmode!='4')?'rp':'';if(!check_wl_key(getTag(3,'rp_sec_mode'),'0',rp)){return;}}
else if(netmode=='4'&&getTag(0,11).data=='0'&&!getTag(3,'rp_key_auto').text.entity.disabled){ var len=getTag(3,'rp_key_auto').text.entity.value.length;if(APSEC=='WEP'&&len<5){checkShow(getTagDom(3,'rp_key_auto','text'),$.CommonLan['_default']);return;}else if(APSEC!='no'&&APSEC!='WEP'&&len<8){checkShow(getTagDom(3,'rp_key_auto','text'),$.CommonLan['_default']);return;}
if(!checkDom(getTag(3,'rp_key_auto').text,"text_string")){return;}}
setAppData('save',[0,1,2,3,4],function(data){if(getTag(0,0).data=='1'){$.Refresh();}});}
function change_wds_sec_mode(tag){var val=tag.select.entity.value;setTagDomAction(1,[1,2,3,4],null,'hide');if(val=="1"||val=="2"){setTagDomAction(1,[1,3],null,'show');}else if(val=="3"||val=="4"){setTagDomAction(1,[2,4],null,'show');}
add_wds_after();}
function change_cl_rp_sec_mode(tag){var pan=(tag.name.indexOf('rp')!=-1)?3:2;setTagDomAction(pan,['1-7'],null,'hide');switch(tag.data){case'0':setTagDomAction(pan,['1-7'],null,'hide');break;case'1':setTagDomAction(pan,[1,3,5],null,'show');break;default:setTagDomAction(pan,[2,4,6],null,'show');break;}
var flag=(pan==3)?'rp':'cl';add_cl_rp_after(flag);}
function wep_tips(){var val=getTag(1,0).data;var p=($.CurrentApp=='security'&&val=='4')?'3':'2';getTag(p,1).hide();if($.DataMap.wps_enable=='1'){(getTag(p,0).data=='1')?getTag(p,1).show():getTag(p,1).hide();}}
function change_wl_stand(){var net=getTag(0,'net_mode').data;var val=getTag(0,'wl_stand').data;if((val=='7'||val=='9'||val=='10')&&net!=3&&net!=4&&net!=5){setTagDomAction(0,[8,9],null,'show');setAppTagData($.DataMap.channel_width);getTag(0,'channel_width').panel[$.DataMap.channel_width].radio.checked();(getTag(0,'channel_width').data=='0')?getTag(0,'channel_bind').hide():getTag(0,'channel_bind').show();if(val=='7'&&getTag(0,'region').data=='6'&&getTag(0,'channel_width').data=='0'){getTag(0,'channel').select.entity.options.length=14;}
}else{getTag(0,'channel_width').panel[0].radio.checked();setTagDomAction(0,[8,9],null,'hide');}
change_channel_width();}
function change_wl_sec_modes(tag){var pan,alltag,tagArr,tag;var showArr={'0':{ap:null,other:null},'1':{ap:[2,3,5,7],other:[1,3,5]},'2':{ap:[4,6,8],other:[2,4,6]},'3':{ap:[4,6,8],other:[2,4,6]},'4':{ap:[4,6,8],other:[2,4,6]}};var netMode=getTag(0,2).select.entity.value;if(netMode==1){return;} 
if(netMode==0||netMode==2||netMode==6){ tag=getTag(4,1);pan=4;alltag='2-8';tagArr=showArr[tag.select.entity.value].ap;}else if(netMode==3||netMode==5){ tag=getTag(2,0);pan=2;alltag='1-7';tagArr=showArr[tag.select.entity.value].other;}else if(netMode==4){ tag=getTag(3,0);pan=3;alltag='1-7';tagArr=showArr[tag.select.entity.value].other;}
setTagDomAction(pan,[alltag],null,'hide');if(getTag(0,10).entity.style.display=='block'&&getTag(0,10).data==1){getTag(pan,0).show();}
if(getTag(0,11).entity.style.display=='block'&&getTag(0,11).data==1){getTag(pan,0).show();}
switch(tag.data){case'0':setTagDomAction(pan,[alltag],null,'hide');break;case'1':setTagDomAction(pan,tagArr,null,'show');break;default:setTagDomAction(pan,tagArr,null,'show');break;}
add_wep_wpa_after();if(netMode==6&&getTag(0,11).data==1){change_cl_rp_sec_mode(getTag(3,0));}}
function change_base_sel(tag){var showArr={'0':{tag:[1,2,3,4,5,6,7,8,9],pan:[4]},'1':{tag:[1,2,3,6,7,8,9,12,13],pan:[1]},'2':{tag:[1,2,3,4,5,6,7,8,9,12,13],pan:[1,4]},'3':{tag:[1,2,10,12,13],pan:[2]},'4':{tag:[1,2,11,12,13],pan:[3]},'5':{tag:[1,2,10,12,13],pan:[2]},'6':{tag:[1,2,3,4,5,6,7,8,9,11,12,13],pan:[3,4]}
};setPanAction([1,2,3,4,6],'hide');setPanAction(showArr[tag.select.entity.value].pan,'show');setTagDomAction(0,['1-13'],null,'hide');setTagDomAction(0,showArr[tag.select.entity.value].tag,null,'show');change_wl_sec_modes();change_wl_stand();(getTag(0,10).entity.style.display=='block')?change_base_config(getTag(0,10)):change_base_config(getTag(0,11));var titleWds=(tag.select.entity.value==5)?'wds_security_panel':'client_security_panel';var titleRp=(tag.select.entity.value==6)?'wds_security_panel':'repeater_security_panel';getPan(2).title.entity.innerHTML=Language[$.Language].wireless.base[titleWds];getPan(3).title.entity.innerHTML=Language[$.Language].wireless.base[titleRp];}
function change_base_config(tag){var netMode=getTag(0,2).select.entity.value;if(tag.data==0){if(netMode==3||netMode==5){disableDom(getTagDom(2,'cl_key_auto','text'),true);setTagDomAction(2,[0,1,2,3,4,5,6],null,'hide');getTag(2,7).show();}else if(netMode==4||netMode==6){disableDom(getTagDom(3,'rp_key_auto','text'),true);setTagDomAction(3,[0,1,2,3,4,5,6],null,'hide');getTag(3,7).show();}}else{getTag(3,0).show();change_wl_sec_modes();}}
var arr_map={"default_1":['Auto','1','2','3','4','5','6','7','8','9','10','11'],"default_2":['Auto','1','2','3','4','5','6','7','8','9','10','11'],"default_3":['Auto','1','2','3','4','5','6','7','8','9','10','11','12','13'],"default_4":['Auto','10','11'],"default_5":['Auto','10','11','12','13'],"default_6":['Auto','1','2','3','4','5','6','7','8','9','10','11','12','13','14'],"default_7":['Auto','3','4','5','6','7','8','9','10','11','12','13'],"down_1":['Auto','1','2','3','4','5','6','7','8','9'],"up_1":['Auto','5','6','7','8','9','10','11'],"down_2":['Auto','1','2','3','4','5','6','7','8','9'],"up_2":['Auto','5','6','7','8','9','10','11'],"down_3":['Auto','1','2','3','4','5','6','7','8','9'],"up_3":['Auto','5','6','7','8','9','10','11','12','13'],"down_4":['10'],"up_4":['11'],"down_5":['10'],"up_5":['13'],"down_6":['Auto','1','2','3','4','5','6','7','8','9'],"up_6":['Auto','5','6','7','8','9','10','11','12','13'],"down_7":['Auto','3','4','5','6','7','8','9'],"up_7":['Auto','5','6','7','8','9','10','11','12','13']};var reg_map={'1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'6','9':'6','10':'6','11':'1','12':'3','13':'1','14':'6','15':'3'};function change_channel_width(r){
var tmp_region=reg_map[getTag(0,'region').select.entity.value];if($.DataMap.region=='0'){tmp_region='1';}
(getTag(0,'channel_width').data=='0')?getTag(0,'channel_bind').hide():getTag(0,'channel_bind').show();var width=getTag(0,'channel_width').data;var bind=getTag(0,'channel_bind').data;var t=(width=='1')?((bind=='0')?('down_'+tmp_region):('up_'+tmp_region)):('default_'+tmp_region);if(getTag(0,'wl_stand').data=='7'&&tmp_region=='6'&&width=='0'){t='default_3';} 
var sel=getTag(0,'channel').select.entity;sel.options.length=arr_map[t].length;for(var i=0;i<arr_map[t].length;i++){if(arr_map[t].length==1){var val=arr_map[t][i];}else{var val=(i!=0)?arr_map[t][i]:i;}
var str=(i==0)?$.CommonLan['auto_type']:$.CommonLan['channel']+" "+arr_map[t][i];var opt=new Option(str,val);sel.options[i]=opt;}
getTag(0,'channel').select.checked($.DataMap.channel);}
function change_base_display(){if(getTag(0,0).data=="0"){setPanAction([1,2,3,4,6],'hide');setTagDomAction(0,[1,2,3,4,5,6,7,8,9,10,11,12,13],null,'hide');}else{setTagDomAction(0,[1,2,3,4,5,6,7,8,9,10,11,12,13],null,'show');change_base_sel(getTag(0,2));}}
function check_wl_key(tag,o,wds){var key_map={'wds_sec_mode':{p:'1',t:'3'},'sec_mode':{p:'4',t:'7'},'ap1_sec_mode':{p:'3',t:'6'},'cl_sec_mode':{p:'2',t:'5'},'rp_sec_mode':{p:'3',t:'5',p1:'2',t1:'4'}};var p=(o!='1')?key_map[tag.name].p:key_map[tag.name].p1;var t=(o!='1')?key_map[tag.name].t:key_map[tag.name].t1;if(tag.data=='1'||(tag.data=='2'&&wds=='wds')){if(!check_keyvalue(getTag(p,t),wds)){return false;}}else if(tag.data!='0'){if(!check_keyvalue(getTag(p,parseInt(t)+1),wds)){return false;}}
return true;}
function init_wl_mac(){setAppTagData($.DataMap);get_mac_arr($.DataMap.wl_mac_filter_list,"macaddr")}
function save_wl_mac_filter(){setAppData('save',[0],function(data){});}
function add_wl_mac(tag){var list=$.DataMap.wl_mac_filter_list;$.TabLen=list.length;if(!checkTag([1])){return;}
if($.TabLen>=20&&MOD!="mod"){checkShow(getTagDom(1,0,'text'),$.CommonLan['item_err']);return;}
if(!check_mac_list(getTag(1,1),'macaddr')){return;}
var obj=saveTablelist(list,[1]);setAppData('add',obj,function(data){MOD=tag.name;$.Refresh();});}
function mod_wl_mac(row){MOD="mod";setModify(row.data);MODData=row.data;SetCancelBtn(getTag(1,2),'1');}
function del_wl_mac(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=new Object();obj=delTablelist($.AllData.wl_mac_filter_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_wl_mac_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_wl_wds(){setAppTagData($.DataMap);get_mac_arr($.DataMap.wl_wds_list,"wds_mac");}
function add_wds(tag){if(!checkTag([0])){return;}
if($.TabLen>=8&&MOD!="mod"){checkShow(getTagDom(0,0,'text'),$.CommonLan['item_err']);return;}
if(!check_mac_list(getTag(0,1),'wds_mac')){return;}
setAppData('add',[0],function(data){MOD=tag.name;$.Refresh();});}
function mod_wds(row){MOD="mod";setModify(row.data);MODData=row.data;}
function del_wds(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=new Object();obj.save="del";obj2obj(obj,row.data);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function init_wl_advance(){setAppTagData($.DataMap);}
function save_wl_advance(){if(!checkTag([0])){return;}
setAppData('save',[0],function(data){});}
var list_timer=null;function init_wl_client_list(){if(list_timer!=null){window.clearInterval(list_timer);}
getRequestData("netcore_get",{"wl_link":"0"},function(data){setAppTagData($.DataMap);list_timer=window.setInterval(function(data){if($.CurrentApp!="list"){window.clearInterval(list_timer);return;}else{getRequestData("netcore_get",{"wl_link":"0"},function(data){setAppTagData($.DataMap);});}},10000);});}
function refresh_wl_list(){getRequestData("netcore_get",{"wl_link":"0"},function(data){$.Refresh();});}
function change_ap_display(){var dis=(getTag(0,0).data=='0')?'hide':'show';setTagDomAction(0,[1,2,3],null,dis);}
function change_ap_select(tag){var val=tag.select.entity.value;var data=change_ap_parame($.DataMap,val,'1');setAppTagData(data);}
function init_wl_ap(){setAppTagData($.DataMap);getTag(3,1).hide();}
function save_wl_ap(){if(!checkTag([1,3])){return;}
var ap=getTag(0,0).data;var mac=getTag(1,1).data;var ssid=getTag(1,2).text.entity.value;if((ap=='1'&&((ssid==$.DataMap.ap2_ssid&&mac==$.DataMap.ap2_wl_mac)||(ssid==$.DataMap.ap3_ssid&&mac==$.DataMap.ap3_wl_mac)))||(ap=='2'&&((ssid==$.DataMap.ap1_ssid&&mac==$.DataMap.ap1_wl_mac)||(ssid==$.DataMap.ap3_ssid&&mac==$.DataMap.ap3_wl_mac)))||(ap=='3'&&((ssid==$.DataMap.ap1_ssid&&mac==$.DataMap.ap1_wl_mac)||(ssid==$.DataMap.ap2_ssid&&mac==$.DataMap.ap2_wl_mac)))){checkShow(getTag(1,2).text,$.CommonLan['item_exist']);return;}
if(!check_wl_key(getTag(3,'ap1_sec_mode'))){return;}
setAppData('save',[1,3],function(data){});}
function mod_wl_ap(row){MOD="mod";setModify(row.data);MODData=row.data;}
function del_wl_ap(row){MOD="del";var obj=delTablelist($.DataMap.wl_link_ap1_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}
function refresh_wl_ap_list(){getAppData(function(data){if(getTag(4,0).tab.tbody){getTagDom(4,0,'tab').data=data.wl_link_ap1_list;getTagDom(4,0,'tab').tbody.refresh();}else{getTagDom(4,0,'tab').createTable(data.wl_link_ap1_list);}});}
function change_wl_sec_mode(tag){setTagDomAction(3,[1,2,3,4,5,6,7],null,'hide');switch(tag.data){case'0':setTagDomAction(3,[1,2,3,4,5,6,7],null,'hide');break;case'1':setTagDomAction(3,[1,2,4,6],null,'show');break;default:setTagDomAction(3,[3,5,7],null,'show');break;}
add_wep_wpa_after();}
function virtual_protocol_sel(tag){var i=getTagDom(0,2,"select").entity.selectedIndex;var map=[["","",""],["","",""],["","",""],["80","80"," "],["443","443"," "],["21","21"," "],["110","110"," "],["25","25"," "],["53","53"," "],["23","23"," "],["500","500"," "],["1723","1723"," "],["3389","3389"," "],["9292","9292"," "],["1720","1720"," "],["22321","22321"," "]];getTagDom(0,3,"text_a").setValue(map[i][0]);getTagDom(0,3,"text_b").setValue(map[i][2]);getTagDom(0,4,"text_a").setValue(map[i][1]);getTagDom(0,4,"text_b").setValue(map[i][2]);}
function init_virtual(){setAppTagData($.DataMap);}
function save_virtual(tag){getAppData(function(data){var list=$.AllData.virtual_server_list;$.TabLen=list.length;if(!checkTag([0])){return;}
if($.TabLen>=16&&MOD!="mod"){checkShow(getTagDom(0,1,'text'),$.CommonLan['item_err']);return;}
if(!check_lan_segment(getTag(0,1))){return;}
if(!check_port_limit(getTag(0,3),null)){return;}
if(!check_port_limit(getTag(0,4),null)){return;}
if(!check_port_list(getTag(0,3),'virtual_server_list',getTag(0,2))){return;}
if(!check_port_list(getTag(0,4),'virtual_server_list',getTag(0,2))){return;}
if(!check_port_len(getTag(0,3),getTag(0,4))){return;}
var obj=saveTablelist(list,[0]);setAppData('save',obj,function(data){MOD='save';$.Refresh();});});}
function mod_virtual(row){MOD="mod";var data=$.AllData.virtual_server_list[row.data.id-1];setModify(data);MODData=row.data;SetCancelBtn(getTag(0,5),'1');}
function del_virtual(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.virtual_server_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_virtual_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function app_port_sel(tag){if(tag.data=='0'){getTagDom(0,1,"text").entity.value="";getTagDom(0,3,"text_a").entity.value="";getTagDom(0,3,"text_b").entity.value="";getTagDom(0,5,"text_a").entity.value="";getTagDom(0,5,"text_b").entity.value="";getTagDom(0,2,"select").setData('1');getTagDom(0,4,"select").setData('1');}else if(tag.data=='1'){getTagDom(0,2,"select").setData('1');getTagDom(0,4,"select").setData('1');switch(getTagDom(0,0,"select").entity.selectedIndex){case 1:getTagDom(0,1,"text").setValue("GuruGuru");getTagDom(0,3,"text_a").setValue('31200');getTagDom(0,3,"text_b").entity.value="";getTagDom(0,5,"text_a").setValue('9292');getTagDom(0,5,"text_b").entity.value="";break;case 2:getTagDom(0,1,"text").setValue("BuddyBuddy");getTagDom(0,3,"text_a").setValue('41');getTagDom(0,3,"text_b").entity.value="";getTagDom(0,5,"text_a").setValue('987');getTagDom(0,5,"text_b").entity.value="";break;case 3:getTagDom(0,1,"text").setValue("Enppy");getTagDom(0,3,"text_a").setValue('4001');getTagDom(0,3,"text_b").entity.value="";getTagDom(0,5,"text_a").setValue('4901');getTagDom(0,5,"text_b").setValue('7878');break;case 4:getTagDom(0,1,"text").setValue("PrunaTCP");getTagDom(0,3,"text_a").setValue('4661');getTagDom(0,3,"text_b").entity.value="";getTagDom(0,5,"text_a").setValue('4661');getTagDom(0,5,"text_b").setValue('4662');break;}}else{getTagDom(0,2,"select").setData('2');getTagDom(0,4,"select").setData('2');getTagDom(0,1,"text").setValue("PrunaUDP");getTagDom(0,3,"text_a").setValue('4665');getTagDom(0,3,"text_b").entity.value="";getTagDom(0,5,"text_a").setValue('4665');getTagDom(0,5,"text_b").setValue('4672');}}
function init_portTrigger(){setAppTagData($.DataMap);}
function save_app(tag){getAppData(function(data){var list=$.AllData.app_port_list;$.TabLen=list.length;if(!checkTag([0])){return;}
if($.TabLen>=16&&MOD!="mod"){checkShow(getTagDom(0,1,'text'),$.CommonLan['item_err']);return;}
if(!check_port_limit(getTag(0,3),null)){return;}
if(!check_port_limit(getTag(0,5),null)){return;}
if(!check_port_list(getTag(0,3),'app_port_list',getTag(0,2))){return;}
if(!check_port_list(getTag(0,5),'app_port_list',getTag(0,4))){return;}
var obj=saveTablelist(list,[0]);setAppData('save',obj,function(data){MOD=tag.name;$.Refresh();app_port_sel(getTag(0,0));getTag(0,1).data=" ";});});}
function mod_app_port(row){MOD="mod";var data=$.AllData.app_port_list[row.data.id-1];setModify(data);MODData=row.data;SetCancelBtn(getTag(0,6),'1');}
function del_app_port(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.app_port_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_app_port_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_dmz(){setAppTagData($.DataMap);($.DataMap.dmz_enable=='1')?disable_pan(getTag(0,0),1,0,[0,1,2]):disable_pan(getTag(1,0),0,1,[0,1,2]);change_dmz_txt_state(getTag(0,0));change_dmz_txt_state(getTag(1,0));}
function change_dmz_txt_state(tag){var txt=(tag.name=='dmz_enable')?getTagDom(0,1,'text'):getTagDom(1,1,'text');txt.entity.disabled=(tag.data=='0')?true:false;}
function disable_radio(p,t_a,bo){setTagDomAction(p,t_a,null,function(o){if(o.type=='simple_text'){disableDom(o.text,bo);}else if(o.type=='simple_btn'){disableDom(o.btn,bo);}else{for(var i=0;i<o.panel.length;i++){disableDom(o.panel[i].radio,bo);}}});}
function disable_pan(tag,p,t,t_a){if(tag.data=="1"){disable_radio(p,t_a,true);getTag(p,t).data="0";}else{disable_radio(p,t_a,false);if(getTag(p,t).data="0"){change_dmz_txt_state(getTag(p,t));}}}
function port_text_disabled(){var flag=(getTag(0,0).data=='0')?true:false;disableDom(getTagDom(0,1,'text'),flag);}
function save_dmz(){if(getTag(0,0).data=='1'){if(!checkTag([0])){return;}}
setAppData('save',[0],function(data){$.Refresh();});}
function save_super_dmz(){if(getTag(1,0).data=='1'){if(!checkTag([1])){return;}}
setAppData('save',[1],function(data){$.Refresh();disable_pan(getTag(1,0),0,0,[0,1]);});}
function init_upnp(){setAppTagData($.DataMap);}
function save_upnp(){setAppData('save',[0],function(data){});}
function init_ftp(){setAppTagData($.DataMap);port_text_disabled();}
function save_ftp(){if(getTag(0,0).data=='1'){if(!checkTag([0])){return;}}
setAppData('save',[0],function(data){});}
function change_pkt(tag){var flag=(tag.data=="0")?true:false;disableDom(tag.text,flag);}
function init_attack_defense(){refresh_attack_log();}
function save_attack(){if(!checkTag([0])){return;}
if(!checkDom(getTag(0,3).text,"text_pak")){return;}
if(!checkDom(getTag(0,4).text,"text_pak")){return;}
if(!checkDom(getTag(0,5).text,"text_pak")){return;}
setAppData('save',[0],function(data){});}
function del_attack_log_all(){var obj=new Object();obj.del_attack_log='del_all';if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function refresh_attack_log(){getAppData(function(data){setAppTagData($.DataMap);var arr=new Array();for(var i in data.attack_log_list){var obj=new Object();obj.id=parseInt(i)+1;obj.time=data.attack_log_list[i].time;obj.msg=get_log_msg(data.attack_log_list[i]);arr.push(obj);}
var tab=getTag(1,0).tab;if(tab.tbody){tab.data=arr;tab.tbody.refresh();}else{tab.createTable(arr);}});}
function change_ip_src_sele(tag){var val=getTagDom(1,2,'select').entity.value;setTagDomAction(1,[3,4,5,6],null,'hide');if(val=='host'||val=='sub_host'){setTagDomAction(1,[3,4],null,'show');var dom=getTagDom(1,4,'text');disableDom(dom,false);if(MOD!='mod'){dom.setValue(" ");}
if(val=='host'){disableDom(dom,true);dom.setValue("255.255.255.255");}}else if(val=='ip_host')
setTagDomAction(1,[5,6],null,'show');}
function change_ip_des_sele(tag){var val=getTagDom(1,7,'select').entity.value;setTagDomAction(1,[8,9,10,11],null,'hide');if(val=='host'||val=='sub_host'){setTagDomAction(1,[8,9],null,'show');var dom=getTagDom(1,9,'text');disableDom(dom,false);if(MOD!='mod'){dom.setValue(" ");}
if(val=='host'){disableDom(dom,true);dom.setValue("255.255.255.255");}}else if(val=='ip_host')
setTagDomAction(1,[10,11],null,'show');}
function init_ip_filter(){setAppTagData($.DataMap);}
function ip_disable_proto(){var val=getTagDom(1,'ip_proto','select').entity.value;var flag=(val=='3'||val=='4')?true:false;disableDom(getTagDom(1,'ip_port',"text_a"),flag);disableDom(getTagDom(1,'ip_port',"text_b"),flag);getTagDom(1,'ip_port',"text_a").entity.value="";getTagDom(1,'ip_port',"text_b").entity.value="";}
function save_ip_filter(){setAppData('save',[0],function(data){$.Refresh();});}
function add_ip_filter(tag){getAppData(function(data){var list=$.AllData.ip_filter_list;$.TabLen=list.length;if(!checkTag([1])){return;}
if($.TabLen>=16&&MOD!="mod"){checkShow(getTagDom(1,0,'text'),$.CommonLan['item_err']);return;}
var sel=getTag(1,"ip_proto").children[1].entity.value;if(!check_port_limit(getTag(1,'ip_port'),sel)){return;}
if(getTag(1,'ip_time').chk_all.entity.checked==false){if(!time_compare(1,'ip_time')){return;}}
var src_s=getTagDom(1,'ip_src_sele','select').entity.value;if(!check_host_ip(src_s,1,5)){return;}
var des_s=getTagDom(1,'ip_des_sele','select').entity.value;if(!check_host_ip(des_s,1,10)){return;}
if(!check_ip_filter_tab([1])){return;}
var obj=saveTablelist(list,[1]);setAppData('add',obj,function(data){MOD=tag.name;$.Refresh();});});}
function mod_ip_filter(row){MOD="mod";var data=$.AllData.ip_filter_list[row.data.id-1];setModify(data);set_ip_filter(row.data);MODData=data;change_ip_src_sele();change_ip_des_sele();SetCancelBtn(getTag(1,16),'1');}
function del_ip_filter(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.ip_filter_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_ip_filter_all(){var obj=new Object();obj.ip_filter_set='1';if(confirm($.CommonLan["del_tip"])){getAppData(function(data){setAppData('delete',obj,function(data){$.Refresh();});});}else{return;}}
function set_ip_filter(obj){var list=$.AllData.ip_filter_list;obj.ip_source=getHostIP(list[obj.id-1],'ip_src_sele');var source=obj.ip_source.replace(/<br>/g,'').split('http://www.netis-systems.com/');var val_src=list[obj.id-1].ip_src_sele;getTagDom(1,'ip_src_sele','select').entity.value=val_src;if(val_src!='all'&&val_src!='ip_host'){getTagDom(1,'ip_src_ip','text').entity.value=source[0];getTagDom(1,'ip_src_mask','text').entity.value=source[1];}else if(val_src=='ip_host'){getTagDom(1,'ip_src_start','text').entity.value=list[obj.id-1].ip_src_start;getTagDom(1,'ip_src_end','text').entity.value=list[obj.id-1].ip_src_end;}
obj.ip_destination=getHostIP(list[obj.id-1],'ip_des_sele');var des=obj.ip_destination.replace(/<br>/g,'').split('http://www.netis-systems.com/');var val_des=list[obj.id-1].ip_des_sele;getTagDom(1,'ip_des_sele','select').entity.value=val_des;if(val_des!='all'&&val_des!='ip_host'){getTagDom(1,'ip_des_ip','text').entity.value=des[0];getTagDom(1,'ip_des_mask','text').entity.value=des[1];}else if(val_des=='ip_host'){getTagDom(1,'ip_des_start','text').entity.value=list[obj.id-1].ip_des_start;getTagDom(1,'ip_des_end','text').entity.value=list[obj.id-1].ip_des_end;}}
function init_mac_filter(){setAppTagData($.DataMap);}
function save_mac_filter(){setAppData('save',[0],function(data){$.Refresh()});}
function add_mac_filter(tag){getAppData(function(data){var list=$.DataMap.mac_filter_list;$.TabLen=list.length;if(!checkTag([1])){return;}
if($.TabLen>=16&&MOD!="mod"){checkShow(getTagDom(1,0,'text'),$.CommonLan['item_err']);return;}
if(getTag(1,4).chk_all.entity.checked==false){if(!time_compare(1,4)){return;}}
if(!check_mac_filter_tab()){return;}
var obj=saveTablelist(list,[1]);setAppData('add',obj,function(data){MOD=tag.name;$.Refresh();});});}
function mod_mac_filter(row){MOD="mod";setModify(row.data);MODData=row.data;SetCancelBtn(getTag(1,5),'1');}
function del_mac_filter(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.mac_filter_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_mac_filter_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_dns_filter(){setAppTagData($.DataMap);getTag(1,'dns_rule').select.checked(0);}
function save_dns_filter(){setAppData('save',[0],function(data){$.Refresh();});}
function add_dns_filter(tag){getAppData(function(data){var list=$.DataMap.dns_filter_list;$.TabLen=list.length;if(!checkTag([1])){return;}
if($.TabLen>=8&&MOD!="mod"){checkShow(getTagDom(1,0,'text'),$.CommonLan['item_err']);return;}
if(getTag(1,4).chk_all.entity.checked==false){if(!time_compare(1,4)){return;}}
if(!check_dns_filter_tab()){return;}
var obj=saveTablelist(list,[1]);setAppData('add',obj,function(data){MOD=tag.name;$.Refresh();});});}
function mod_dns_filter(row){MOD="mod";setModify(row.data);MODData=row.data;SetCancelBtn(getTag(1,5),'1');}
function del_dns_filter(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.dns_filter_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_dns_filter_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_port_filter(){setAppTagData($.DataMap);}
function save_port_filter(){}
function add_port_filter(){}
function mod_port_filter(){}
function del_port_filter(){}
function del_port_filter_all(){}
function init_con_limit(){setAppTagData($.DataMap);get_ip_arr($.DataMap.limit_connect_list,"con_limit_start","con_limit_end");}
function save_all_num(){if(!checkTag([0])){return;}
if(parseInt(getTag(0,0).text.entity.value,10)<parseInt(getTag(0,1).text.entity.value,10)){checkShow(getTagDom(0,1,'text'),$.CommonLan['too_big_err']);return;}
setAppData('save',[0],function(data){});}
function save_host_conn(tag){if(!checkTag([1])){return;}
if(!check_ip_arr(getTag(1,0),getTag(1,1))){return;}
setAppData('save',[1],function(data){MOD=tag.name;$.Refresh();});}
function mod_connect(row){MOD="mod";setModify(row.data);MODData=row.data;}
function del_connect(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=new Object();obj.save="del";obj2obj(obj,row.data);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_conn_all(){var obj=new Object();obj.del_conn='del_all';if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function change_qos_rule(tag){var flag=(tag.data=='0')?'true':false;disableDom(getTagDom(0,1,'text_a'),flag);disableDom(getTagDom(0,1,'text_b'),flag);}
function set_qos_rule(obj){var list=$.AllData.qos_rule_list;obj.qos_ip=getHostIP(list[obj.id-1],'qos_sele');var ip=obj.qos_ip.replace(/<br>/g,'').split('http://www.netis-systems.com/');var val=list[obj.id-1].qos_sele;getTagDom(1,'qos_sele','select').entity.value=val;if(val!='all'&&val!='ip_host'){getTagDom(1,'qos_ip','text').entity.value=ip[0];getTagDom(1,'qos_mask','text').entity.value=ip[1];}else if(val=='ip_host'){getTagDom(1,'qos_ip_start','text').entity.value=list[obj.id-1].qos_ip_start;getTagDom(1,'qos_ip_end','text').entity.value=list[obj.id-1].qos_ip_end;}}
function change_qos_ip_sele(){var val=getTagDom(1,2,'select').entity.value;setTagDomAction(1,[3,4,5,6],null,'hide');if(val=='host'||val=='sub_host'){setTagDomAction(1,[3,4],null,'show');var dom=getTagDom(1,4,'text');disableDom(dom,false);if(MOD!='mod'){dom.setValue(" ");}
if(val=='host'){disableDom(dom,true);dom.setValue("255.255.255.255");}}else if(val=='ip_host')
setTagDomAction(1,[5,6],null,'show');}
function init_qos(){setAppTagData($.DataMap);getTag(0,1).text_a.entity.value=$.DataMap.qos_speed_up;getTag(0,1).text_b.entity.value=$.DataMap.qos_speed_down;}
function save_qos_conf(){var obj=new Object();obj.qos_enable=getTag(0,0).data;obj.qos_speed_up=getTag(0,1).text_a.entity.value;obj.qos_speed_down=getTag(0,1).text_b.entity.value;setAppData('save',obj,function(data){});}
function add_qos_rule(tag){getAppData(function(data){var list=$.AllData.qos_rule_list;$.TabLen=list.length;if(!checkTag([1])){return;}
if($.TabLen>=10&&MOD!="mod"){checkShow(getTagDom(1,0,'text'),$.CommonLan['item_err']);return;}
var qos_s=getTag(1,'qos_sele').select.entity.value;if(!check_host_ip(qos_s,1,5)){return;}
if(qos_s=='host'||qos_s=='sub_host'){}
if(qos_s=='ip_host'){if(!check_ip_arrs(getTag(1,5),getTag(1,6),'qos_rule_list')){return;}}
var obj=saveTablelist(list,[1]);setAppData('add',obj,function(data){$.Refresh();});});}
function mod_qos_rule(row){MOD="mod";setModify(row.data);set_qos_rule(row.data);MODData=$.AllData.qos_rule_list[row.data.id-1];change_qos_ip_sele();SetCancelBtn(getTag(1,9),'1');}
function del_qos_rule(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.qos_rule_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_qos_rule_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_igmp(){setAppTagData($.DataMap);}
function save_igmp(){setAppData('save',[0],function(data){});}
function init_vpn(){setAppTagData($.DataMap);}
function save_vpn(){setAppData('save',[0],function(data){});}
function init_wakeup(){setAppTagData($.DataMap);}
function save_wakeup(){if(!checkTag([0])){return;}
setAppData('save',[0],function(data){$.Refresh();});}
function init_binds(){setAppTagData($.DataMap);get_ip_arr($.DataMap.binds_list,"binds_ip");get_mac_arr($.DataMap.binds_list,"binds_mac")}
function save_binds(){setAppData('save',[0],function(data){});}
function add_binds(tag){getAppData(function(data){var list=$.DataMap.binds_list;$.TabLen=list.length;if(!checkTag([1])){return;}
if($.TabLen>=16&&MOD!="mod"){checkShow(getTagDom(1,0,'text'),$.CommonLan['item_err']);return;}
if(!check_ip_list(getTag(1,1),'binds_ip')){return;}
if(!check_mac_list(getTag(1,2),'binds_mac')){return;}
var obj=saveTablelist(list,[1]);setAppData('add',obj,function(data){MOD=tag.name;$.Refresh();});});}
function mod_binds(row){MOD="mod";setModify(row.data);MODData=row.data;SetCancelBtn(getTag(1,4),'1');}
function del_binds(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.binds_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_binds_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
var arp_timer=null;function init_arp_list(){if(arp_timer!=null){window.clearInterval(arp_timer);}
setAppTagData($.DataMap);arp_timer=window.setInterval(function(data){if($.CurrentApp!="arp_list"){window.clearInterval(arp_timer);return;}else{getAppData(function(data){setAppTagData($.DataMap);});}},50000);}
function refresh_arp_list(){init_arp_list();}
function bind_arp(row){if(row.data.arp_st=='0x6'){alert($.CommonLan['reserved_keep']);return;}
var list=$.DataMap.binds_list;var parame=new Object();parame.binds_des="";parame.binds_ip=$.AllData.arp_list[row.data.id-1].arp_ip;parame.binds_mac=$.AllData.arp_list[row.data.id-1].arp_mac;parame.binds_port=($.AllData.arp_list[row.data.id-1].arp_dev=='br0')?0:1;var obj=saveTablelist(list,parame);setAppData('add',obj,function(data){MOD='save';$.Refresh();});}
function cancel_arp(row){var data=$.AllData;MOD="del";var num=0;for(var i in data.binds_list){if(data.binds_list[i].binds_ip==row.data.arp_ip&&data.binds_list[i].binds_mac==row.data.arp_mac){num=data.binds_list[i].id;}}
var obj=delTablelist($.AllData.binds_list,num);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}
function binds_arp_all(){getAppData(function(data){var list_a=$.AllData.arp_list;var list_b=$.DataMap.binds_list;$.TabLen=list_b.length;var tmp_list=list_b;var obj=new Array();for(var i=0;i<list_a.length;i++){var parame=new Object();if(list_a[i].arp_st=='0x2'){parame.id=tmp_list.length+1;parame.binds_des="";parame.binds_ip=list_a[i].arp_ip;parame.binds_mac=list_a[i].arp_mac;parame.binds_port=(list_a[i].arp_dev=='br0')?0:1;tmp_list.splice(tmp_list.length,0,parame);}}
if(!getLen(parame)){for(var i=0;i<tmp_list.length;i++){var new_id=parseInt(tmp_list[i].id);for(var j in tmp_list[i]){obj[j+new_id]=tmp_list[i][j];}
obj['id'+new_id]=new_id;}}else{tmp_list.splice(tmp_list.length-1,1);obj=saveTablelist(tmp_list,parame);}
setAppData('add',obj,function(data){MOD="save";$.Refresh();});});}
function init_routing(){setAppTagData($.DataMap);}
function set_routing_type(tag){var dom=getTagDom(0,3,"text");if(tag.select.entity.selectedIndex=="0"){disableDom(dom,false);dom.setValue(' ');}else{disableDom(dom,true);dom.setValue('255.255.255.255');}}
function save_routing(tag){getAppData(function(data){var list=$.DataMap.static_routing_list;$.TabLen=list.length;if(!checkTag([0])){return;}
if($.TabLen>=16&&MOD!="mod"){checkShow(getTagDom(0,1,'text'),$.CommonLan['item_err']);return;}
var obj=saveTablelist(list,[0]);setAppData('save',obj,function(data){MOD=tag.name;$.Refresh();});});}
function mod_routing(row){MOD="mod";setModify(row.data);MODData=row.data;SetCancelBtn(getTag(0,5),'1');}
function del_routing(row){if(confirm($.CommonLan["del_one_tip"])){MOD="del";var obj=delTablelist($.AllData.static_routing_list,row.data.id);setAppData('delete',obj,function(data){MOD="save";$.Refresh();});}else{return;}}
function del_routing_all(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_interface_mode(){setAppTagData($.DataMap);}
function save_interface_mode(){setAppData('save',[0],function(data){$.Refresh();});}
var ddns_timer=null;var ddns_map={'5':[1,2,3,4,6],'0':[1,2,3,4,6]};var url_map={"5":"<a target='_blank' href='http://www.noip.com'>www.noip.com</a>","0":"<a target='_blank' href='http://dyn.com'>www.dyndns.org</a>"};function init_ddns(){setAppTagData($.DataMap);change_ddns_info_show($.DataMap);get_ddns_info();}
function save_ddns(){if(!checkTag([0])){return;}
setAppData('save',[0],function(data){$.Refresh();});}
function refresh_ddns(){getAppData(function(data){setAppTagData($.DataMap);change_ddns_after();change_ddns_show();change_ddns_info_show($.DataMap);});}
function change_ddns_show(){if(getTag(0,0).data=='0'){setTagDomAction(0,[1,2,3,4,5,6],null,'hide');}else{setTagDomAction(0,ddns_map[getTag(0,1).select.entity.value],null,'show');}}
function change_ddns_after(){setTagDomAction(0,[2,3,4,5],null,'hide');if(getTag(0,1).data=="0"){getTagDom(0,1,'after').html(url_map["0"]);setTagDomAction(0,[2,3,4],null,'show');}else{ setTagDomAction(0,[2,3,4],null,'show');getTagDom(0,1,'after').html(url_map["5"]);}}
function get_ddns_info(){if(ddns_timer!=null){window.clearInterval(ddns_timer);}
ddns_timer=window.setInterval(function(){if($.CurrentApp=='ddns'){getAppData(function(data){change_ddns_info_show(data);});}else{window.clearInterval(ddns_timer);}},5000);}
function change_ddns_info_show(data){var info=data.ddns_info;var context=getTagDom(0,'ddns_info','context');if(info[0]=="DDNS_STATE_START"){context.html($.CommonLan['DDNS_ERR_CONNECTING']);}else if(info[0]=="DDNS_STATE_AUTH_OK"){context.html($.CommonLan['connected']);}else if(info[0]=="DDNS_STATE_AUTH_FAILED"||info[0]=="DDNS_STATE_INPUT_ERR"||info[0]=="DDNS_STATE_DOMAIN_FAILED"||info[0]=="DDNS_STATE_CONNECT_FAILED"){context.html($.CommonLan['DDNS_ERR_FAILED']);}else{context.html(" ");}}
file_form=null;file_val=null;function init_update(){setAppTagData($.DataMap);getPan(1).hide();getTagDom(0,1,"file").setAttr({"allowtransparency":"yes","width":"460px","height":"25px","scrolling":"no","border":"0","id":"update_frame","src":"./update.htm"});getTag(0,2).text.entity.style.width="250px";disableDom(getTag(0,2).text,true)
getTagDom(0,1,"file").entity.setAttribute("frameborder","0",0);getTag(0,2).btn.entity.value=$.CommonLan['browse'];getTag(0,2).btn.entity.onclick=function(){$.CurrentApp="update";file_form.update.click();file_form.update.onchange=function(){getTag(0,2).text.entity.value=file_form.update.value;}
getTag(0,2).text.entity.value=file_form.update.value;}}
function update_set(tag){$.CurrentApp="update";if(getTag(0,2).text.entity.value==''){$.CurrentApp="update_err";checkShow(ID('updata_file'),$.CommonLan['update_err']);return;}
getPan(1).show();getPan(0).hide();$.lockWin();window.onresize=function(){$.lockWin();}
getTag(1,0).setTimeout(100);try{file_form.submit();check_update_faild("update_faild",5000);}catch(e){};}
function check_update_faild(info,time){window.setTimeout(function(data){getRequestData("netcore_get",{"up_grade_set":"1"},function(data){if(data.upgrade_err&&data.upgrade_err!=0){getPan(1).hide();getPan(0).show();$.lockWin(" ");$.unlockWin($.CommonLan[info]);}});},time);}
function init_backup(){setAppTagData($.DataMap);getPan(2).hide();getTagDom(1,1,"file").setAttr({"allowtransparency":"yes","width":"460px","height":"25px","scrolling":"no","border":"0","src":"./backup.htm"});getTag(1,2).text.entity.style.width="250px";disableDom(getTag(1,2).text,true)
getTag(1,2).btn.entity.value=$.CommonLan['browse'];getTag(1,2).btn.entity.onclick=function(){$.CurrentApp="backup";backup_form.parame_backup.click();backup_form.parame_backup.onchange=function(){getTag(1,2).text.entity.value=backup_form.parame_backup.value;}
getTag(1,2).text.entity.value=backup_form.parame_backup.value;}}
function save_backup(){setAppData(null,{'backup_get':'1'},function(data){window.open("Config.html","_blank");});}
function check_backup_faild(info,time){window.setTimeout(function(data){getRequestData("netcore_get",{"up_grade_set":"1"},function(data){if((data.backup_error&&data.backup_error!=0)||(data.upgrade_err&&data.upgrade_err!=0)){window.clearInterval(TimesOut);getPan("load").hide();getPan("backup").show();getPan("restore").show();$.lockWin(" ");$.unlockWin($.CommonLan[info]);$.Refresh();}});},time);}
backup_form=null;function save_restore(){$.CurrentApp="backup";if(getTag(1,2).text.entity.value==''){$.CurrentApp="backup_err";checkShow(ID('file_up'),$.CommonLan['backup_err']);return;}
if(confirm($.CommonLan["backup_tip"])){getPan(2).show();getPan(0).hide();getPan(1).hide();$.lockWin();window.onresize=function(){$.lockWin();}
getTag(2,0).setTimeout(30);getTag(2,0).tip.html($.CommonLan['restoring']);backup_form.submit();check_backup_faild("backup_faild",5000);}else{return;}}
function init_default(){getPan(1).hide();setAppTagData($.DataMap);}
function default_set(){if(confirm($.CommonLan["default_tip"])){getPan(1).show();getPan(0).hide();$.lockWin();getTag(1,0).setTimeout(40);getTag(1,0).tip.html($.CommonLan["defaulting"]);setAppData(null,{redefault:'1'},function(data){});}else{return;}}
function init_web_config(){setAppTagData($.DataMap);port_text_disabled();}
function save_web_port(){if(!checkTag([0])){return;}
var obj=new Object();obj.web_port=getTag(0,0).text.entity.value;if(confirm($.CommonLan["reboot_web_tip"])){ID("p_menu_misc").onclick();ID("c_menu_reboot").onclick();var wport=(obj.web_port!='80')?":"+obj.web_port:"";reboot('http://'+$.DataMap.lan_ip+wport+"/index.htm",obj);}else{return;}}
function save_remote_port(){if(getTag(0,0).data=='1'){if(!checkTag([0])){return;}}
setAppData('save',[0],function(data){});}
function show_sys_time(){setTagDomAction(0,[2,3,4],null,'hide');var val=getTag(0,1).data;if(val=='1'){getTag(0,4).show();}else{setTagDomAction(0,[2,3],null,'show');}}
var sys_timer=null;function init_sys_time(){if(sys_timer!=null){window.clearInterval(sys_timer);}
getAppData(function(data){setAppTagData($.DataMap);});sys_timer=window.setInterval(function(){if($.CurrentApp!="sys_time"){window.clearInterval(sys_timer);return;}
getAppData(function(data){getTag(0,0).context.html(data.time_now);});},1000);}
function save_sys_time(){if(sys_timer!=null){window.clearInterval(sys_timer);}
if(getTag(0,1).data=='0'){var year=getTag(0,2).text_a.entity.value;var mon=getTag(0,2).text_b.entity.value;var day=getTag(0,2).text_c.entity.value;var hour=getTag(0,3).text_a.entity.value;var min=getTag(0,3).text_b.entity.value;var sec=getTag(0,3).text_c.entity.value;if(!check_YMD(year,mon,day)){return;}
if(!check_HMS(hour,min,sec)){return;}}
setAppData('save',[0],function(data){$.Refresh();});}
function refresh_sys_time(){getAppData(function(data){setAppTagData(data);show_sys_time();getTagDom(0,0,"context").html(data.time_now);});}
function save_ntp_server(){if(sys_timer!=null){window.clearInterval(sys_timer);}
setAppData('save',[1],function(data){$.Refresh();});}
function init_passwd(){setAppTagData($.DataMap);getTag(0,1).text.entity.value='';if($.DataMap.old_pwd==''){disableDom(getTagDom(0,1,'text'),true);};}
function save_passwd(){if(!checkTag([0])){return;}
var old_p=getTag(0,'old_pwd').text.entity.value;var new_p=getTag(0,'new_pwd').text.entity.value;var con_p=getTag(0,'new_pwd_confirm').text.entity.value;if(old_p!=$.DataMap.old_pwd){checkShow(getTag(0,"old_pwd").text,$.CommonLan['password_err']);return;}
if(new_p!=con_p){checkShow(getTag(0,"new_pwd_confirm").text,$.CommonLan['password_err']);return;}
setAppData('save',[0],function(data){$.Refresh();});}
function init_statistics(){var data=$.DataMap;getAppData(function(data){setAppTagData(data);var runTime=data.days+$.CommonLan['days']+' '+data.hours+$.CommonLan['hours']+' '+data.minutes+$.CommonLan['minutes']+' '+data.seconds+$.CommonLan['seconds'];getTagDom(0,0,'context').html(runTime);});}
function refresh_statis(){$.Refresh();}
function init_sys_log(){getAppData(function(data){var arr=new Array();for(var i in data.sys_log){var info=data.sys_log[i].log.split(",");var obj=new Object();obj.id=parseInt(i)+1;if(info[1]=="CONNECTION"){obj.time=info[2];obj.msg=get_log(eval('('+data.sys_log[i].log.split(":,")[1]+')'));}
else{obj.time=info[0];obj.msg=info[2];}
arr.push(obj);}
var tab=getTag(0,0).tab;if(tab.tbody){tab.data=arr;tab.tbody.refresh();}else{tab.createTable(arr);}});}
function get_log(ary){var str=log_map[ary[0]];if(ary.length==1){return str;}else{var str_arr=new Array();var str_new='';for(var h=1;h<ary.length;h++){str_arr=str.split('['+h+']');str_new=str_arr[0];for(var j=1;j<str_arr.length;j++){str_new=str_new+ary[h]+str_arr[j];}
str=str_new;}}
return str;}
function del_all_sys_log(){var obj=new Object();if(confirm($.CommonLan["del_tip"])){setAppData('delete',obj,function(data){$.Refresh();});}else{return;}}
function init_reboot(){getPan(1).hide()}
function reboot(ip,parame){if(parame&&ip){getPan(1).show();getPan(0).hide();$.lockWin();var obj=new Object();getTag(1,0).setTimeout(40,ip);obj2obj(obj,parame);getTag(1,0).tip.html($.CommonLan["rebooting"]);setAppData(null,obj,function(data){});}else{if(confirm($.CommonLan["reboot_tip"])){getPan(1).show();getPan(0).hide();$.lockWin();var obj=new Object();if(ip&&typeof ip=='string'){getTag(1,0).setTimeout(40,ip);obj2obj(obj,parame);}else{getTag(1,0).setTimeout(40);}
getTag(1,0).tip.html($.CommonLan["rebooting"]);setAppData(null,obj,function(data){});}else{return;}}}
function set_reboot(){if(getTag(1,0).data=='1'){if(!check_reboot_date(getTag(1,1).text.entity.value,getTag(1,2).text.entity.value)){return;}}
setAppData('save',[1],function(data){});}
function init_service(){}
function CreateSelect(options){if($.BrowserVersion.indexOf('IE')!=-1){Element.call(this,"SELECT:df_select_ie");}else{Element.call(this,"SELECT:df_select");}
this.setID('setlan');for(var i in options){this.entity.options.add(new Option(options[i],i));}
var _this=this;this.entity.onchange=function(){var ch=false;for(var i=0;i<this.options.length;i++){var opt=this.options[i];if(opt.value==this.value){this.setAttribute("selected",this.value);ch=true;}}
if(!ch&&$.BrowserVersion.indexOf('IE')!=-1){_this.data=this.options[0].value;_this.checked(_this.data);}
var lan_val=($.ShowLan)?this.value:$.Language;($.CurrentApp!='Welcome')?$.load($.CurrentApp,false,this.value):change_language_show(lan_val);if($.CurrentApp=='status'){change_status_show($.DataMap)}
setAppData(null,{'language':lan_val},function(data){});}
this.checked=function(val){this.entity.value=val;this.entity.onchange();}
this.setData=function(val){if(val){this.checked(val);this.data=val;}}}
var ch_info='';function add_wep_wpa_after(){var val=getTag(1,0).data;var p=($.CurrentApp=='wan')?'2':'3';var t=($.CurrentApp=='multiple_ssid')?'6':'4';if($.CurrentApp=="wan"){var secmode=getTag(1,'rp_sec_mode').data;var keysize=getTag(p,0).data; var keymode=getTag(p,2).data; var wpamode=getTag(p,3).data; var after=getTagDom(p,4,"after");var after_wpa=getTagDom(p,5,"after");}else if($.CurrentApp=="base"&&(getTag(0,2).data==0||getTag(0,2).data==2||getTag(0,2).data==6)){ p=4;t=7;var secmode=getTag(p,1).data;var keysize=getTag(p,3).data; var keymode=getTag(p,5).data; var wpamode=getTag(p,6).data; var after=getTagDom(p,7,"after");var after_wpa=getTagDom(p,8,"after");}else if($.CurrentApp=="base"&&(getTag(0,2).data==3||getTag(0,2).data==4||getTag(0,2).data==5)){ p=(getTag(0,2).select.entity.value==3||getTag(0,2).select.entity.value==5)?'2':'3';t=5;var secmode=getTag(p,0).data;var keysize=getTag(p,1).data; var keymode=getTag(p,3).data; var wpamode=getTag(p,4).data; var after=getTagDom(p,5,"after");var after_wpa=getTagDom(p,6,"after");}else{var secmode=getTag(p,0).data;var keysize=getTag(p,2).data; var keymode=getTag(p,4).data; var wpamode=getTag(p,5).data; var after=getTagDom(p,6,"after");var after_wpa=getTagDom(p,7,"after");}
var v=null;if(secmode=="1"){ if(keysize=="0"){v=(keymode=="0")?(after_map['a']):(after_map['b']);getTag(p,t).text.entity.maxLength=v.ch;after.html($.CommonLan[v.str]);}else{v=(keymode=="0")?(after_map['c']):(after_map['d']);getTag(p,t).text.entity.maxLength=v.ch;after.html($.CommonLan[v.str]);}}else{ v=(wpamode=="0")?(after_map['e']):(after_map['f']);var v_v=(v.ch.indexOf('-')!=-1)?'63':'64';getTag(p,parseInt(t)+1).text.entity.maxLength=v_v;after_wpa.html($.CommonLan[v.str]);}
ch_info=v;if($.CurrentApp=='base'&&getTag(0,2).data==6){add_cl_rp_after('rp');}}
var wds_info='';function add_wds_after(){var val=getTagDom(1,0,"select").data;var hex_asc=getTag(1,1).data;var hex_asc_wpa=getTag(1,2).data;var after_wep=getTagDom(1,3,"after");var after_wpa=getTagDom(1,4,"after");if(val=='1'){var vv=(hex_asc=="0")?(after_map['a']):(after_map['b']);getTag(1,3).text.entity.maxLength=vv.ch;after_wep.html($.CommonLan[vv.str]);}else if(val=='2'){var vv=(hex_asc=="0")?(after_map['c']):(after_map['d']);getTag(1,3).text.entity.maxLength=vv.ch;after_wep.html($.CommonLan[vv.str]);}else if(val=='3'||val=='4'){var vv=(hex_asc_wpa=="0")?(after_map['e']):(after_map['f']);var v_v=(vv.ch.indexOf('-')!=-1)?'63':'64';getTag(1,4).text.entity.maxLength=v_v;after_wpa.html($.CommonLan[vv.str]);}
wds_info=vv;}
var cl_rp_info='';function add_cl_rp_after(flag){var pan=(flag=='rp')?3:2;var val=getTagDom(pan,0,"select").data;var secmode=getTag(pan,0).data;var keysize=getTag(pan,1).data; var keymode=getTag(pan,3).data; var wpamode=getTag(pan,4).data; var after=getTagDom(pan,5,"after");var after_wpa=getTagDom(pan,6,"after");var v=null;if(secmode=="1"){ if(keysize=="0"){v=(keymode=="0")?(after_map['a']):(after_map['b']);getTag(pan,5).text.entity.maxLength=v.ch;after.html($.CommonLan[v.str]);}else{v=(keymode=="0")?(after_map['c']):(after_map['d']);getTag(pan,5).text.entity.maxLength=v.ch;after.html($.CommonLan[v.str]);}}else{ v=(wpamode=="0")?(after_map['e']):(after_map['f']);var v_v=(v.ch.indexOf('-')!=-1)?'63':'64';getTag(pan,parseInt(5)+1).text.entity.maxLength=v_v;after_wpa.html($.CommonLan[v.str]);}
cl_rp_info=v;}
function check_keyvalue(tag,o){var val=tag.text.entity.value;var ch=(!o)?ch_info.ch:((o=='wds')?wds_info.ch:cl_rp_info.ch);var type=(!o)?ch_info.type:((o=='wds')?wds_info.type:cl_rp_info.type);var str=(!o)?ch_info.str:((o=='wds')?wds_info.str:cl_rp_info.str);if(!val||val==''){checkShow(tag.text,$.CommonLan[str]);return false;}
if(ch.split('-').length!=2){if(val.length!=parseInt(ch,10)&&val.indexOf('%26')=='-1'){checkShow(tag.text,$.CommonLan[str]);return false;}}else{var a=parseInt(ch.split('-')[0],10);var b=parseInt(ch.split('-')[1],10);if(val.length<a||val.length>b){checkShow(tag.text,$.CommonLan[str]);return false;}}
var ch_str=(type=='hex')?'text_hex':'text_ascii';if(!checkDom(tag.text,ch_str)){return false;}
return true;}
function setMOD(parame,MODData){if(MOD=="mod"){obj2obj(parame,{save:"mod"});obj2obj(parame,setOldData(MODData));}else if(MOD=="save"||MOD=="add")
obj2obj(parame,{save:"save"});else obj2obj(parame,{save:"del"});}
var after_map={"a":{str:"after_map_a",ch:'10',type:'hex'},"b":{str:'after_map_b',ch:'5',type:'asc'},"c":{str:"after_map_c",ch:'26',type:'hex'},"d":{str:'after_map_d',ch:'13',type:'asc'},"e":{str:"after_map_e",ch:'64',type:'hex'},"f":{str:'after_map_f',ch:'8-63',type:'asc'},"g":{str:'after_map_g'}};var log_map={dhcp_unicasting_release_time:"DHCP: release [1]!",udhcp_client_started:"DHCP: Client enable!",dhcp_send_discover:"DHCP:Send DISCOVER Packet!",dhcp_send_discover_no_respone:"DHCP:Not recv OFFER Packet!",dhcp_send_renew_ip:"DHCP:[1] send Renew!",dhcp_lease_time:"DHCP:[2] get the relay time:[1]!",Received_DHCP_NAK:"DHCP:Send NAK!",udhcp_server_started:"DHCP:DHCP Server enable!",send_OFFER_failed:"DHCP:Send OFFER fail!",dhcp_receive_decline:"DHCP:Recv DECLINE Packet!",dhcp_receive_release:"DHCP:Recv RELEASE Packet!",dhcp_receive_inform:"DHCP:Recv INFORM Packet!",option_fields_too_long:"DHCP:bogus packet, option fields too long.",dhcp_sending_nack:"DHCP:Send NAK!",dhcp_sending_ack:"DHCP:Send ACK to [1]",dhcp_receive_discover:"DHCP:Recv DISCOVER!",dhcp_receive_request:"DHCP:Recv REQUEST!",dhcp_sending_offer:"DHCP:Will get IP address:[1]",dhcp_receive_ack:"DHCP:[1] recv ACK!",dhcp_receive_nack:"DHCP:[1] recv NACK!",dhcp_send_discovery:"DHCP:[1] send DISCOVER!",dhcp_receive_offer:"DHCP:[1] recv OFFER!",dhcp_send_request:"DHCP:[1] send REQUEST!",dhcp_send_release:"DHCP:[1] senbd RELEASE",dhcp_send_renew:"DHCP: Send RENEW!",dhcp_send_decline:"DHCP:[1] send DECLINE!",pppoe_connection_terminated:"PPPOE connection terminated.",pppoe_lcp_down:"PPPOE LCP down.",pppoe_peer_refused_to_authenticate:"PPPOE peer refused to authenticate: terminating link.",pppoe_authentication_failed:"PPPOE Authentication failed",pppoe_terminating_connection_due_to_lack_of_activity:"PPPOE Terminating connection due to lack of activity.",pppoe_connect_time_expired:"PPPOE Connect time expired",pppoe_login_failed:"PPPOE Login failed",pppoe_user_logged_in:"PPPOE user [1] logged in.",ppoe_invalid_address_length_in_auth:"PPPOE invalid address length [1] in auth. address list.",pppoe_peer_failed_to_respond_to_chap_challenge:"PPPOE Peer failed to respond to CHAP challenge.",pppoe_out_of_memory_in_chapreceivefailure:"Out of memory in ChapReceiveFailure.",pppoe_chap_receive_failure:"PPPOE Chap receive failure.",pppoe_chap_authentication_failed:"PPPOE Chap authentication failed.",pppoe_pap_authentication_failed:"WAN authentication failed,Account or password is error.",pppoe_get_session:"PPPOE get session: [1].",pppoe_local_remote_ip_address:"PPPOE Local IP address:[1],Remote IP address:[2].",pppoe_primary_dns_address:"PPPOE primary DNS address: [1]",pppooe_secondary_dns_address:"PPPOE secondary DNS address: [1]",pppoe_line_connected:"PPPOE line connected.",pppoe_local_remote_ip_address_speed:"Local IP address:[1],Remote IP address:[2] ",pppoe_received_protocol_reject_for_LCP:"Received Protocol-Reject for LCP!",pppoe_received_bad_ack:"PPPOE  lcp_acki: received bad Ack!",pppoe_loopback_detected:"Serial line is looped back.",pppoe_received_bad_nak:"PPPOE lcp_nakci: received bad Nak!",pppoe_rcvd_AUTHTYPE_PAP_rejecting:"lcp_reqci: rcvd AUTHTYPE PAP, rejecting...",pppoe_rcvd_AUTHTYPE_CHAP:"PPPOE lcp_reqci: rcvd AUTHTYPE CHAP, rejecting...",pppoe_peer_not_responding:"PPPOE Peer not responding",pppoe_appear_to_have_received_our_own_echo_reply:"PPPOE appear to have received our own echo-reply!",pppd_started_uid:"Pppd [1] started by [2], uid [3].",pppoe_Exit:"PPPOE Exit",Can_not_execute:"PPPOE Can not execute [1].",pppoe_send_padt:"PPPOE send PADT.",pppoe_send_padi:"PPPOE send PADI.",pppoe_recv_pado:"PPPOE recv PADO.",pppoe_send_padr:"PPPOE send PADR.",pppoe_recpado:"PPPOE recv PADO"};