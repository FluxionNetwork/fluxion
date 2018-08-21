var default_language = 'uk';
var language = getCookie('language');
var file = '/file/' + language + '.txt';
var tekst = readFile(file);
var tekst_array = tekst.split("~");

function getCookie(c_name)
	{
	if (document.cookie.length>0)
		{
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1)
			{
			c_start=c_start + c_name.length+1
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		}
	}
	return default_language;
}

function calcHeight(source)
{
 var browser=navigator.userAgent.toLowerCase();
	if (browser.indexOf('safari/') == -1  || browser.indexOf('mozilla/') == -1  || browser.indexOf('opera/') == -1){
		var extra=25;
	}else{
		var extra=0;
	}
 	if(source=='parent'){
		//find the height of the internal page
		var the_height=document.getElementById('iframe').contentWindow.document.body.scrollHeight;
		//change the height of the iframe
		document.getElementById('iframe').height=the_height + extra;
  	}
	else if( source=='parent1' ){
		var the_height=document.getElementById('client_list').contentWindow.document.body.scrollHeight;
		document.getElementById('client_list').height=the_height + extra;
	}
	else if( source=='parent2' ){
		var the_height=document.getElementById('static_list').contentWindow.document.body.scrollHeight;
		document.getElementById('static_list').height=the_height + extra;
	}
	else if( source=='parent3' ){
		var the_height=document.getElementById('routing_frame').contentWindow.document.body.scrollHeight;
		document.getElementById('routing_frame').height=the_height + extra;
	}
	else if( source=='parent4' ){
		var the_height=document.getElementById('acl_frame').contentWindow.document.body.scrollHeight;
		document.getElementById('acl_frame').height=the_height + extra;
	}
	else if( source=='parent5' ){
		var the_height=document.getElementById('ipfilter_frame').contentWindow.document.body.scrollHeight;
		document.getElementById('ipfilter_frame').height=the_height + extra;
	}
	else if( source=='parent6' ){
		var the_height=document.getElementById('cgi_frame').contentWindow.document.body.scrollHeight;
		document.getElementById('cgi_frame').height=the_height + extra;
	}
	else if( source=='parent7' ){
                var the_height=document.getElementById('ipaddr_frame').contentWindow.document.body.scrollHeight;
                document.getElementById('ipaddr_frame').height=the_height + extra;
        }
	else if( source=='parent8' ){
                var the_height=document.getElementById('urlfilter_frame').contentWindow.document.body.scrollHeight;
                document.getElementById('urlfilter_frame').height=the_height + extra;
        }
	else if( source=='parent9' ){
                var the_height=document.getElementById('urlfilter_frame').contentWindow.document.body.scrollHeight;
                document.getElementById('urlfilter_frame').height=the_height + extra;
        }
	else{
		//find the height of the internal page
		var the_height=document.body.scrollHeight;
		//change the height of the iframe
		parent.document.getElementById('iframe').height=the_height + extra;
	}
}

function swapClass(main){
	var items=['one','two','three','four','five','six'];
	for (var i in items){
		if (items[i]==main){
			document.getElementById(items[i]).className="on";
		}else{
		 	document.getElementById(items[i]).className="off";
		}
	}
}

function readFile(url){
  var xmlhttp;
  /*@cc_on
  @if (@_jscript_version >= 5)
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
        xmlhttp = false;
      }
    }
  @else
  xmlhttp = false;
  @end @*/

  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp = false;
    }
  }
  xmlhttp.open("GET",url,false);
  xmlhttp.send(null);
  return xmlhttp.responseText;
}

function showText(number) {
	return tekst_array[number];
}
/*var select_language=[ 'uk', 'de', 'nl', 'fr', 'it', 'es', 'pt', 'no', 'dk', 'se', 'fi', 'ru' ];
var stype = getCookie('language');
function dw(message)
{		
	document.write(message[0]);
	for(i=0; i<12; i++){
		if(stype == select_language[i])
			document.write(message[i]);
	}
}*/
function decode(code){
code=code.replace(/"/g,'\\"');
code='"  '+code+'  "';
code=(eval(code));
return code
}
function decode_1(code,idx,len){
code=code.replace(/"/g,'\\"');
code="'"+code+"'"
code=(eval(code));
return code
}

function basicLink(index){
	var picArry=new Array();
	for(i=1;i<=6;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"\/cgi-bin\/home_lan.asp\" target=\"iframe\">"+(showText(13))+"</a></li>");
	document.write("<li"+picArry[2]+"><a href=\"\/cgi-bin\/home_dhcp.asp\" target=\"iframe\">"+(showText(14))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"\/cgi-bin\/home_wan.asp\">"+(showText(15))+"</script></a></li>");
	document.write("<li"+picArry[4]+"><a href=\"\/cgi-bin\/home_wireless.asp\" target=\"iframe\">"+(showText(16))+"</a></li>");
	document.write("<li"+picArry[5]+"><a href=\"\/cgi-bin\/home_security.asp\" target=\"iframe\">"+(showText(17))+"</a></li>");
	document.write("<li"+picArry[6]+"><a href=\"\/cgi-bin\/home_wlmacfilter.asp\" target=\"iframe\">"+(showText(628))+"</a></li>");
}

function advancedLink(index){
	var picArry=new Array();
	for(i=1;i<=8;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"\/cgi-bin\/adv_wlan.asp\" target=\"iframe\">"+(showText(629))+"</a></li>");
	document.write("<li"+picArry[2]+"><a href=\"\/cgi-bin\/adv_qos.asp\" target=\"iframe\">"+(showText(630))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"\/cgi-bin\/access_upnp.asp\">"+(showText(631))+"</a></li>");
	document.write("<li"+picArry[4]+"><a href=\"\/cgi-bin\/adv_routing_table.asp\" target=\"iframe\">"+(showText(19))+"</a></li>");
	document.write("<li"+picArry[5]+"><a href=\"\/cgi-bin\/access_snmp.asp\" target=\"iframe\">"+(showText(632))+"</a></li>");
	document.write("<li"+picArry[6]+"><a href=\"\/cgi-bin\/access_ddns.asp\" target=\"iframe\">"+(showText(633))+"</a></li>");
	document.write("<li"+picArry[7]+"><a href=\"\/cgi-bin\/adv_nat_top.asp\" target=\"iframe\">"+(showText(634))+"</a></li>");
	document.write("<li"+picArry[8]+"><a href=\"\/cgi-bin\/access_cwmp.asp\" target=\"iframe\">TR-69</a></li>");
	
}

function firewallLink(index){
	var picArry=new Array();
	for(i=1;i<=6;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"\/cgi-bin\/adv_firewall.asp\" target=\"iframe\">"+(showText(5))+"</a></li>");
	document.write("<li"+picArry[2]+"><a href=\"\/cgi-bin\/access_acl.asp\">"+(showText(636))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"\/cgi-bin\/access_ipfilter.asp\" target=\"iframe\">"+(showText(637))+"</a></li>");
	document.write("<li"+picArry[4]+"><a href=\"\/cgi-bin\/adv_nat_dmz.asp\" target=\"iframe\">"+(showText(638))+"</a></li>");
	document.write("<li"+picArry[5]+"><a href=\"\/cgi-bin\/adv_nat_virsvr.asp\" target=\"iframe\">"+(showText(639))+"</a></li>");	

}

function maintenanceLink(index){
	var picArry=new Array();
	for(i=1;i<=5;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"\/cgi-bin\/tools_admin.asp\" target=\"iframe\">"+(showText(26))+"</a></li>");
	document.write("<li"+picArry[2]+"><a href=\"\/cgi-bin\/tools_time.asp\" target=\"iframe\">"+(showText(640))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"\/cgi-bin\/tools_update.asp\" target=\"iframe\">"+(showText(29))+"</a></li>");
	document.write("<li"+picArry[4]+"><a href=\"\/cgi-bin\/tools_system.asp\" target=\"iframe\">"+(showText(641))+"</a></li>");
	document.write("<li"+picArry[5]+"><a href=\"\/cgi-bin\/status_log.cgi\" target=\"iframe\">System log</a></li>");

}

function statusLink(index){
	var picArry=new Array();
	for(i=1;i<=4;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"\/cgi-bin\/status_deviceinfo.asp\">"+(showText(8))+"</a></li>");
	document.write("<li"+picArry[2]+"><a href=\"\/cgi-bin\/status_statistics.asp\" target=\"iframe\">"+(showText(9))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"\/cgi-bin\/status_dhcplist.asp\" target=\"iframe\">"+(showText(11))+"</a></li>");
	document.write("<li"+picArry[4]+"><a href=\"\/cgi-bin\/tools_test.asp\">"+(showText(32))+"</a></li>");

}
