// Help and Message ==========================================================


var HelpOptionsVar = "width=480,height=420,scrollbars,toolbar,resizable,dependent=yes";
var GlossOptionsVar = "width=420,height=180,scrollbars,toolbar,resizable,dependent=yes";
var bigsub   = "width=700,height=440,scrollbars,menubar,resizable,status,dependent=yes";
var macfiltersub = "width=700,height=550,scrollbars,menubar,resizable,status,dependent=yes";
var pclistsub = "width=700,height=620,scrollbars,menubar,resizable,status,dependent=yes";
var portinfoub = "width=700,height=660,scrollbars,menubar,resizable,status,dependent=yes";
var summarysub  = "width=700,height=500,scrollbars,menubar,resizable,status,dependent=yes";
var smallsub = "width=440,height=320,scrollbars,resizable,dependent=yes";
var sersub   = "width=500,height=380,scrollbars,resizable,status,dependent=yes";
var multisub   = "width=630,height=470,scrollbars,menubar,resizable,status,dependent=yes";
var helpWinVar = null;
var glossWinVar = null;
var datSubWinVar = null;
var ValidStr = 'abcdefghijklmnopqrstuvwxyz-';
var ValidStr_ddns = 'abcdefghijklmnopqrstuvwxyz-1234567890';
var hex_str = "ABCDEFabcdef0123456789";
var DEBUG = 0; 
var fontScale=1; 
var rtime;
function showMsg()
{
	var msgVar=document.forms[0].message.value;
	if (msgVar.length > 1)
		rALERT("", msgVar);
}
function checkMsg(msg)
{
	if(msg.length > 1)
	{
		rALERT("", msg);
		return false;
	}
	return true;
}

function setHTML(windowObj, el, htmlStr)  // el must be str, not reference
{
    if (document.all)
	{
	  if (windowObj.document.all(el) )
        windowObj.document.all(el).innerHTML = htmlStr;
	}
	else if (document.getElementById)
	{
	  if (windowObj.document.getElementById(el) )
	    windowObj.document.getElementById(el).innerHTML = htmlStr;
	}
}


function closeWin(win_var)
{
	if ( ((win_var != null) && (win_var.close)) || ((win_var != null) && (win_var.closed==false)) )
		win_var.close();
}

function openHelpWin(file_name)
{
   helpWinVar = window.open(file_name,'help_win',HelpOptionsVar);
   if (helpWinVar.focus)
		setTimeout('helpWinVar.focus()',200);
}

function openGlossWin()
{
	glossWinVar = window.open('','gloss_win',GlossOptionsVar);
	if (glossWinVar.focus)
		setTimeout('glossWinVar.focus()',200);
}

function closeSubWins()
{
	closeWin(helpWinVar);
	closeWin(glossWinVar);
	closeWin(datSubWinVar);
}

function openDataSubWin(filename,win_type)
{
	closeWin(datSubWinVar);
	datSubWinVar = window.open(filename,'datasub_win',win_type);
	if (datSubWinVar.focus)
		setTimeout('datSubWinVar.focus()',200);
}

function showHelp(helpfile)
{
	if(top.frames.length == 0)
		return;
	top.helpframe.location.href = helpfile;
}


function addstr(input_msg)
{
	var last_msg = "";
	var str_location;
	var temp_str_1 = "";
	var temp_str_2 = "";
	var str_num = 0;
	temp_str_1 = addstr.arguments[0];
	while(1)
	{
		str_location = temp_str_1.indexOf("%s");
		if(str_location >= 0)
		{
			str_num++;
			temp_str_2 = temp_str_1.substring(0,str_location);
			last_msg += temp_str_2 + addstr.arguments[str_num];
			temp_str_1 = temp_str_1.substring(str_location+2,temp_str_1.length);
			continue;
		}
		if(str_location < 0)
		{
			last_msg += temp_str_1;
			break;
		}
	}
	return last_msg;
}




//  High-level test functions - generate messages

function checkBlank(fieldObj, fname)
{
	var msg = "";
	if (fieldObj.value.length < 1){
		msg = addstr(msg_blank,fname);
        }
	return msg;
}

function checkNoBlanks(fObj, fname)
{
	var space = " ";
 	if (fObj.value.indexOf(space) >= 0 )
		return addstr(msg_space, fname);
	else return "";
}

// add by barry,7.27,2005
function checkMail(fobj, fname)
{
   var tmp_str = fobj.value;
   var msg = "";

   //matching Email address format(regular expression)
   var pattern = /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\w+([-.]\w+)*$/;

   if(!pattern.test(tmp_str))
     msg = addstr(msg_invalid_email, fname);

   return msg;
}

function checkAllSpaces(fieldObj, fname)
{
	var msg = "";
	if(fieldObj.value.length == 0)
		return "";
	var tstr = makeStr(fieldObj.value.length," ");
	if (tstr == fieldObj.value)
		msg = addstr(msg_allspaces,fname);
	return msg;
}

function checkValid(text_input_field, field_name, Valid_Str, max_size, mustFill)
{
	var error_msg= "";
	var size = text_input_field.value.length;
	var str = text_input_field.value;

	if ((mustFill) && (size != max_size) )
		error_msg = addstr(msg_blank_in,field_name);
 	for (var i=0; i < size; i++)
  	{
    	if (!(Valid_Str.indexOf(str.charAt(i)) >= 0))
    	{
			error_msg = addstr(msg_invalid,field_name,Valid_Str);
			break;
    	}
  	}
  	return error_msg;
}

function checkvaluerange(text_input_field, min_value, max_value)
// NOTE: Doesn't allow negative numbers, required is true/false
{
	var str = text_input_field.value;

	if (text_input_field.value.length==0) // blank
	{
//		if (required)
			return false;
	}
	else // not blank, check contents
	{
		for (var i=0; i < str.length; i++)
		{
			if ((str.charAt(i) < '0') || (str.charAt(i) > '9'))
				return false;
		}
		if ( true) // don't parse if invalid
		{
			var int_value = parseInt(str,10);
			if (int_value < min_value || int_value > max_value)
				return false;
		}
	}
	return true;
}

function checkInt(text_input_field, field_name, min_value, max_value, required)
// NOTE: Doesn't allow negative numbers, required is true/false
{
	var str = text_input_field.value;
	var error_msg= "";

	if (text_input_field.value.length==0) // blank
	{
		if (required)
			error_msg = addstr(msg_blank,field_name);
	}
	else // not blank, check contents
	{
		for (var i=0; i < str.length; i++)
		{
			if ((str.charAt(i) < '0') || (str.charAt(i) > '9'))
				error_msg = addstr(msg_check_invalid,field_name);
		}
		if (error_msg.length < 2) // don't parse if invalid
		{
			var int_value = parseInt(str,10);
			if (int_value < min_value || int_value > max_value)
				error_msg = addstr(msg_valid_range,field_name,min_value,max_value);
		}
	}
	return(error_msg);
}

function checkMAC(fObj, fname, removeSeparators)
{
	var msg = "";
	if(badMac(fObj, removeSeparators))
		msg = addstr(msg_invalid_mac, fname);
	return msg;
}


// Low-level test functions - return true or false ============================


function blankIP(ip1, ip2, ip3, ip4) // ip fields, true if 0 or blank
{
return ((ip1.value == "" || ip1.value == "0")
	 && (ip2.value == "" || ip2.value == "0")
	 && (ip3.value == "" || ip3.value == "0")
	 && (ip4.value == "" || ip4.value == "0"))
}

function badIP(ip1, ip2, ip3, ip4, max)   // ip fields, 1.0.0.1 to 254.255.255.max
{
	if(!(isInteger(ip1.value,1,254,false))) return true;
	if(!(isInteger(ip2.value,0,255,false))) return true;
	if(!(isInteger(ip3.value,0,255,false))) return true;
	if(!(isInteger(ip4.value,0,max,false))) return true;
	if(parseInt(ip1.value) == 127 
//	   parseInt(ip2.value) == 0 &&
//	   parseInt(ip3.value) == 0 &&
//	   parseInt(ip4.value) == 1
	)
		return true;	
   	return false;
}
function badIP2(obj)
{
	var valid_ip = /^((\d{1,3}\.){3})(\d{1,3})$/;

	if(!valid_ip.test(obj.value))
	{
		return true;
	}
	else
	{
		var ip_array = new Array(4);
		ip_array = obj.value.split(".");

		if(!(isInteger(ip_array[0],1,254,false))) return true;
		if(!(isInteger(ip_array[1],0,255,false))) return true;
		if(!(isInteger(ip_array[2],0,255,false))) return true;
		if(!(isInteger(ip_array[3],0,254,false))) return true;
		if(parseInt(ip_array[0]) == 127 
//		   parseInt(ip_array[1]) == 0 &&
//		   parseInt(ip_array[2]) == 0 &&
//		   parseInt(ip_array[3]) == 1
		)
			return true;
	}
	return false;
		
}
function badSubnetIP(ip1, ip2, ip3, ip4, max)   // ip fields 1.0.0.0. to 255.255.255.max
{
	if(!(isInteger(ip1.value,1,254,false))) return true;
	if(!(isInteger(ip2.value,0,255,false))) return true;
	if(!(isInteger(ip3.value,0,255,false))) return true;
	if(!(isInteger(ip4.value,0,max,false))) return true;
   	return false;
}

function badDestSubnetIP(ip1, ip2, ip3, ip4, max)   // ip fields 0.0.0.0. to 255.255.255.max
{
	if(!(isInteger(ip1.value,0,254,false))) return true;
	if(!(isInteger(ip2.value,0,255,false))) return true;
	if(!(isInteger(ip3.value,0,255,false))) return true;
	if(!(isInteger(ip4.value,0,max,false))) return true;
   	return false;
}

function isipmask(val)
{
	if( (val == 255)||(val == 254)||(val == 252)||(val == 248)||
	    (val == 240)||(val == 224)||(val == 192)||(val == 128)||(val == 0))
	    return true;
	return false;
}

function badMask(ip1, ip2, ip3, ip4)   // mask fields 0 to 255
{
	var ipstr = "";

	if(!isipmask(parseInt(ip1.value))) return true;
	if(!isipmask(parseInt(ip2.value))) return true;
	if(!isipmask(parseInt(ip3.value))) return true;
	if(!isipmask(parseInt(ip4.value))) return true;

	if(parseInt(ip1.value) == 0)
		ipstr += 0;
	else
		ipstr += 1;
	if (parseInt(ip1.value) != 255 && parseInt(ip2.value) != 0 )
		return true;

	if(parseInt(ip2.value) == 0)
		ipstr += 0;
	else
		ipstr += 1;
	if (parseInt(ip2.value) != 255 && parseInt(ip3.value) != 0 )
		return true;

	if(parseInt(ip3.value) == 0)
		ipstr += 0;
	else
		ipstr += 1;
	if (parseInt(ip3.value) != 255 && parseInt(ip4.value) != 0 )
		return true;

	if(parseInt(ip4.value) == 0)
		ipstr += 0;
	else
		ipstr += 1;

	if((ipstr=="1111")||(ipstr=="1110")||(ipstr=="1100")||(ipstr=="1000"))
   		return false;

   	return true;
}


function badMac(macfld, removeSeparators) // macfld is form field, removeSeparators true/false
{
	var myRE = /[0-9a-fA-F]{12}/;
	var MAC = macfld.value;

	MAC = MAC.replace(/:/g,"");
	MAC = MAC.replace(/-/g,"");
	if (removeSeparators)
		macfld.value = MAC;
	if((MAC.length != 12) || (MAC == "000000000000")||(myRE.test(MAC)!=true))
		return true;
	else
	 	return false;
}

function ValidMacAddress(macAddr)
{
	var i;

	macAddr=macAddr.toUpperCase();

	if ((macAddr.indexOf(':')!=-1)||(macAddr.indexOf('-')!=-1))
	{
        macAddr = macAddr.replace(/:/g,"");
		macAddr = macAddr.replace(/-/g,"");
	}

	if ((macAddr.length == 12) && (macAddr != "000000000000") && (macAddr != "FFFFFFFFFFFF"))
	{
		for(i=0; i<macAddr.length;i++)
		{
			var c = macAddr.substring(i, i+1)
			if(("0" <= c && c <= "9") || ("a" <= c && c <= "f") || ("A" <= c && c <= "F"))
				continue;
			else
				return false;
		}

		return true;
	}

	return false;
}

function ValidIP(str){
  return   /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(str);
}

function badIpRange(from1,from2,from3,from4,to1,to2,to3,to4)
// parameters are form fields, returns true if invalid ( from > to )
{
    var total1 = 0;
    var total2 = 0;

    total1 += parseInt(from4.value,10);
    total1 += parseInt(from3.value,10)*256;
    total1 += parseInt(from2.value,10)*256*256;
    total1 += parseInt(from1.value,10)*256*256*256;

    total2 += parseInt(to4.value,10);
    total2 += parseInt(to3.value,10)*256;
    total2 += parseInt(to2.value,10)*256*256;
    total2 += parseInt(to1.value,10)*256*256*256;
    if(total1 >= total2)
        return true;
    return false;
}

function checkItem(fieldObj)
{
	if (fieldObj.value.length < 1){
		return false;
    }
	return true;
}

function checkipmaskgw(ip1, ip2, ip3, ip4, mask1, mask2, mask3, mask4, gw1, gw2, gw3, gw4,
    msg_invalid_ip, msg_invalid_mask, msg_invalid_gw, msg_ip_mask_mismatch, msg_gw_wrong_subnet)
{
    var ipaddr=0, netmask=0, gateway=0;
    var msg = "";

    if(badIP(ip1, ip2, ip3, ip4, 255)) {
	    msg+= msg_invalid_ip;
	}

    if(badMask(mask1, mask2, mask3, mask4)) {
	    msg+= msg_invalid_mask;
	}

    if(badIP(gw1, gw2, gw3, gw4, 255)) {
	    msg+= msg_invalid_gw;
	}

    if(msg.length <= 0) {
        ipaddr = (ip1.value << 24) | (ip2.value << 16) | (ip3.value << 8) | ip4.value;
        netmask = (mask1.value << 24) | (mask2.value << 16) | (mask3.value << 8) | mask4.value;
        gateway = (gw1.value << 24) | (gw2.value << 16) | (gw3.value << 8) | gw4.value;

	    if (0 == (ipaddr&~netmask) || 0 == ~(ipaddr|netmask)) {
		    msg+=msg_ip_mask_mismatch;
	    }
	    if (0 != gateway) {
		    if (0 == (gateway&~netmask) || 0 == ~(gateway|netmask)) {
			    msg+=msg_invalid_gw;
		    }
		    if ((ipaddr&netmask) != (gateway&netmask)) {
			    msg+=msg_gw_wrong_subnet;
		    }
	    }
    }

    return msg;
}



function isBlank(str)
{
	return (str.length == 0 );
}


function isBigger(str_a, str_b)
//  true if a bigger than b
{
	var int_value_a = parseInt(str_a);
	var int_value_b = parseInt(str_b);
	return (int_value_a > int_value_b);
}

function isInteger(str,min_value,max_value,allowBlank)  // allowBlank = true or false
// return true if positive Integer, false otherwise
{
	if(str.length == 0)
		if(allowBlank)
			return true;
		else
			return false;
	for (var i=0; i < str.length; i++)
	{
		if ((str.charAt(i) < '0') || (str.charAt(i) > '9'))
				return false;
	}
	var int_value = parseInt(str,10);
	if ((int_value < min_value) || (int_value > max_value))
		return false;
	return true;
}


function isHex(str) {
    var i;
    for(i = 0; i<str.length; i++) {
        var c = str.substring(i, i+1);
        if(("0" <= c && c <= "9") || ("a" <= c && c <= "f") || ("A" <= c && c <= "F")) {
            continue;
        }
        return false;
    }
    return true;
}

function isTelephoneNum(str)
{
	var c;
    if(str.length == 0)
        return false;
    for (var i = 0; i < str.length; i++)
	{
        c = str.substring(i, i+1);
        if (c>= "0" && c <= "9")
            continue;
        if ( c == '-' && i !=0 && i != (str.length-1) )
            continue;
        if ( c == ',' ) continue;
        if (c == ' ') continue;
        if (c>= 'A' && c <= 'Z') continue;
        if (c>= 'a' && c <= 'z') continue;
        return false;
    }
    return true;
}

function checkDay(year,month,day)  // check if valid date
{
	var isleap = false;
	if(year%400 == 0 || (year%4 == 0 && year%100 != 0))
		isleap = true;
	if(month%2)
	{
		if((month<=7)&&(day>31))
			return false;
		if((month>7)&&(day>30))
			return false;
	}
	else
	{
		if(month<=6)
		{
			if(month == 2)
			{
				if((isleap)&&(day>29))
				{
					return false;
				}
				if((!isleap)&&(day>28))
				{
					return false;
				}
			}
			else
			{
				if(day > 30)
					return false;
			}
		}
		else
			if(day>31)
				return false;
	}
	return true;
}

function CheckSpaceInName(text_input_field)
//not allow space in name,
{
	if (text_input_field.value.length>1)
	{
		for (var i=0;i<text_input_field.value.length;i++)
		{
			if (text_input_field.value.charAt(i) == ' ')
				return false;
		}
	}
	return true;
}
//change for nvram->"subscription_status"  change
function checkstatus(obj)
{
	

		if(obj==0 || obj == 10)
	{
		top.document.getElementById("PL_show_1").className="pro_hidden";
		top.document.getElementById("PL_show_2").className="pro_hidden";
		top.document.getElementById("PL_show_3").className="pro_hidden";
	}
	else
	{
		top.document.getElementById("PL_show_1").className="pro_show";
		top.document.getElementById("PL_show_2").className="pro_show";
		top.document.getElementById("PL_show_3").className="pro_show";
	}

}
// Utility & Misc functions ===================================================

//false: valide ip address, true: invalid ip address
function checkIPAddress(ipbox, max, bAllowBlank)
{
	if(bAllowBlank == true)
	{
		if((eval("document.forms[0]."+ipbox+"1").value == "0"||eval("document.forms[0]."+ipbox+"1").value == "")
		&& (eval("document.forms[0]."+ipbox+"2").value == "0"||eval("document.forms[0]."+ipbox+"2").value == "")
		&& (eval("document.forms[0]."+ipbox+"3").value == "0"||eval("document.forms[0]."+ipbox+"3").value == "")
		&& (eval("document.forms[0]."+ipbox+"4").value == "0"||eval("document.forms[0]."+ipbox+"4").value == ""))
		     return false;
	}

	return checkIP(	eval("document.forms[0]."+ipbox+"1"),
					eval("document.forms[0]."+ipbox+"2"),
					eval("document.forms[0]."+ipbox+"3"),
					eval("document.forms[0]."+ipbox+"4"), max);
}

function check_vip(ip1, ip2, ip3, ip4, max) {
    if(checkIPMain(ip1,255)) return true;
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value)==0)||(parseInt(ip1.value)==0)&&(parseInt(ip2.value)==0)&&(parseInt(ip3.value)==0)&&(parseInt(ip4.value)==0))
    	return true;
    return false;
}

/* Check IP Address Format*/
function checkIPMain(ip,max)
{
    if( false == isNumeric(ip, max) )
    {
        ip.focus();
        return true;
    }

    return false;
}

function _isNumeric(str) {
    var i;
    for(i = 0; i<str.length; i++) {
        var c = str.substring(i, i+1);
        if("0" <= c && c <= "9") {
            continue;
        }
        return false;
    }
    return true;
}

/* Check Numeric*/
function isNumeric(str, max) {
		if(str.value.length <= 3){
				str.value = str.value.replace(/^000/g,"0");
				str.value = str.value.replace(/^00/g,"0");
				if(str.value.length > 1)
						str.value = str.value.replace(/^0/g,"");
		}

    if(str.value.length == 0 || str.value == null || str.value == "") {
        str.focus();
        return false;
    }

    var i = parseInt(str.value);

    if(i>max) {
        str.focus();
        return false;
    }
    for(i=0; i<str.value.length; i++) {
        var c = str.value.substring(i, i+1);
        if("0" <= c && c <= "9") {
            continue;
        }
        str.focus();
        return false;
    }
    return true;
}

function checkIP(ip1, ip2, ip3, ip4, max) {
    if(checkIPMain(ip1,255)) return true;
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value)==0)||(parseInt(ip1.value)==0)&&(parseInt(ip2.value)==0)&&(parseInt(ip3.value)==0)&&(parseInt(ip4.value)==0))
    	return true;
    return false;
}

// Utility & Misc functions ===================================================

function isIE()
{
    if(navigator.appName.indexOf("Microsoft") != -1)
        return true;
    else return false;
}

function setChecked(OnOffFlag,formFields)
{
	for (var i = 1; i < setChecked.arguments.length; i++)
		setChecked.arguments[i].checked = OnOffFlag;
}

function setDisabled(OnOffFlag,formFields)
{
	for (var i = 1; i < setDisabled.arguments.length; i++)
		setDisabled.arguments[i].disabled = OnOffFlag;
}

function makeStr(strSize, fillChar)
{
	var temp = "";
	for (i=0; i < strSize ; i ++)
		temp = temp + fillChar;
	return temp;
}

var showit = "block";
var hideit = "none";

function show_hide(el,shownow)  // IE & NS6; shownow = true, false
{
//	alert("el = " + el);
	if (document.all)
		document.all(el).style.display = (shownow) ? showit : hideit ;
	else if (document.getElementById)
		document.getElementById(el).style.display = (shownow) ? showit : hideit ;
}


function printPage()
{
    location.href="javascript:print();";
}



ie4 = ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4 ))
ns4 = ((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) < 6 ))
ns6 = ((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) >= 6 ))

// 0.0.0.0
var ZERO_NO = 1;	// 0x0000 0001
var ZERO_OK = 2;	// 0x0000 0010
// x.x.x.0
var MASK_NO = 4;	// 0x0000 0100
var MASK_OK = 8;	// 0x0000 1000
// 255.255.255.255
var BCST_NO = 16;	// 0x0001 0000
var BCST_OK = 32;	// 0x0010 0000

var SPACE_NO = 1;
var SPACE_OK = 2;

function choose_disable(dis_object)
{
	if(!dis_object)	return;
	dis_object.disabled = true;

	if(!ns4)
		dis_object.style.backgroundColor = "#e0e0e0";
}

function check(val)
{
	if((parseInt(val) >= 0)&&(parseInt(val) <= 255))
		return true;
	else
		return false;
}

function ip_to_str(val)
{
	var i = parseInt(val);
	var j = 0;
	var str = "";

	for(j = 0; j < 8; j++)
	{
		str = parseInt(i%2) + str;
		i = parseInt(i/2);
	}

	return str;
}

function check_is_ip(ip1,ip2,ip3,ip4,mask1,mask2,mask3,mask4)
{
	var i = 0;
	var tag = true;
	ip_str = "";
	var mask = "";
	mask_length = 0;

	if(check(mask1.value) &&
	   check(mask2.value) &&
	   check(mask3.value) &&
	   check(mask4.value) )
	{
	    mask += ip_to_str(parseInt(mask1.value));
	    mask += ip_to_str(parseInt(mask2.value));
	    mask += ip_to_str(parseInt(mask3.value));
	    mask += ip_to_str(parseInt(mask4.value));
	}else
		return false;

	for(i=0;i<32;i++)
		if(mask.charAt(i) == "1")
			mask_length++;

	if(check(ip1.value) &&
	   check(ip2.value) &&
	   check(ip3.value) &&
	   check(ip4.value) )
	{
	    ip_str += ip_to_str(parseInt(ip1.value));
	    ip_str += ip_to_str(parseInt(ip2.value));
	    ip_str += ip_to_str(parseInt(ip3.value));
	    ip_str += ip_to_str(parseInt(ip4.value));
	}else
		return false;
	for( i = mask_length; i < 32; i++)
		if(ip_str.charAt(i) == "0")
        	tag = false;

    if(ip_str == "11111111111111111111111111111111")
    	return false;

    if( tag == false)
        return true;
    else
    	return false;
}

function is_same_net(wan_mask_1,wan_mask_2,wan_mask_3,wan_mask_4,
						wan_ip_1,wan_ip_2,wan_ip_3,wan_ip_4,
						wan_gw_1,wan_gw_2,wan_gw_3,wan_gw_4)
{
	var mask;
	var wan_ip;
	var gw_ip;
	var mask = "";
	mask_length = 0;

	mask = ip_to_str(parseInt(wan_mask_1))+ip_to_str(parseInt(wan_mask_2))+ip_to_str(parseInt(wan_mask_3))+ip_to_str(parseInt(wan_mask_4));
	wan_ip = ip_to_str(parseInt(wan_ip_1))+ip_to_str(parseInt(wan_ip_2))+ip_to_str(parseInt(wan_ip_3))+ip_to_str(parseInt(wan_ip_4));
	gw_ip = ip_to_str(parseInt(wan_gw_1))+ip_to_str(parseInt(wan_gw_2))+ip_to_str(parseInt(wan_gw_3))+ip_to_str(parseInt(wan_gw_4));

	for(i=0;i<32;i++)
		if(mask.charAt(i) == "1")
			mask_length++;

	for( i = 0; i < mask_length; i++)
		if(wan_ip.charAt(i) != gw_ip.charAt(i))
        	return false;

    return true;
}
//  add for checking invalid characters
function is_valid_string(object, needed, fname)
{
	var msg="";
	var invalid_str = "`~!@#$^*()=+[]{}\\|;:\'\",<>/?";
	var str = object.value;
	msg +=checkBlank(object, fname);
	if((msg.length > 1))
	{
	     if(needed)
		return msg;
	     else
		return "";
	}
	msg = "";
	for(i = 0; i < invalid_str.length; i++)
	{
		if(str.indexOf(invalid_str.charAt(i)) != -1)
		{
			msg = fname + invalid_string;
			break;
		}
	}
	return msg;


}

function check_valid_macs(message_title, macs) {
    var i,j;
    var macvalue;
    var myRE = /[0-9a-fA-F]{12}/;

    /* Change the MAC Address format to XX:XX:XX:XX:XX:XX at first */
    for(i=1; i<check_valid_macs.arguments.length; i++) {
        macvalue = check_valid_macs.arguments[i].value;

        if(macvalue.length == 0) {
            check_valid_macs.arguments[i].value = "00:00:00:00:00:00";
            continue;
        }

    	if(macvalue.length!=12 && macvalue.length!=17){
    		rALERT("Mac", message_title + i);
    		return false;
    	}

    	if (macvalue.length == 12) {
            var str = macvalue.substring(0,2)+":"
                        +macvalue.substring(2,4)+":"
    	                +macvalue.substring(4,6)+":"
    	                +macvalue.substring(6,8)+":"
    	                +macvalue.substring(8,10)+":"
    	                +macvalue.substring(10,12);
    	    macvalue = str;
    	}

        /* Now, macvalue.lenght must be equal to 17 */
        for(j=2;j<17;j+=3) {
            if(macvalue.charAt(j)!=':' && macvalue.charAt(j)!='-' ) {
			    rALERT("Mac", message_title + i );
			    return false;
		    }
        }

	    if ( macvalue!="00:00:00:00:00:00" ) {
		    if( ValidMacAddress(macvalue)==false ) {
			    rALERT("Mac", message_title + i );
			    return false;
		    }
	    }
	    check_valid_macs.arguments[i].value = macvalue;
    }


    for(i=1; i<check_valid_macs.arguments.length-1; i++) {
        macvalue = check_valid_macs.arguments[i].value;

	    if ( macvalue!="00:00:00:00:00:00")	{
            for( j=i+1; j<check_valid_macs.arguments.length; j++) {
                if(macvalue.toUpperCase() == check_valid_macs.arguments[j].value.toUpperCase() )
                {
                   rALERT("Mac", msg_mac + i + msg_item + j + msg_same );
	                return false;
                }
         	}
	    }
    }
    return true;
}
/* add by pacino to check fix ip and static router*/

function parseInt_new(num)
{
	if(isNaN(num))
		return parseInt(num.value);
	return num;
}

function badNetworkIP(ip1,ip2,ip3,ip4,mask1,mask2,mask3,mask4,gw1,gw2,gw3,gw4)
{
	var i=0;
	var ip = new Array();
	var mask = new Array();
	var gw = new Array();
	ip[0]=parseInt_new(ip1);
	ip[1]=parseInt_new(ip2);
	ip[2]=parseInt_new(ip3);
	ip[3]=parseInt_new(ip4);
	mask[0]=parseInt_new(mask1);
	mask[1]=parseInt_new(mask2);
	mask[2]=parseInt_new(mask3);
	mask[3]=parseInt_new(mask4);
	gw[0]=parseInt_new(gw1);
	gw[1]=parseInt_new(gw2);
	gw[2]=parseInt_new(gw3);
	gw[3]=parseInt_new(gw4);
	for(i=0;i<4;i++)
	{
//		alert("ip[i]="+ip[i]+"mask[i]="+mask[i]+"gw[i]="+gw[i]);
		if((ip[i]&mask[i])!=(gw[i]&mask[i]))
			return true;
	}
	return false;
}

function checkNetOrHost(ip1,ip2,ip3,ip4)
{
	// net --> return true  host --> return false
	if(parseInt_new(ip4)==0)
	{
		return true;
	}
	return false;
}

function checkMask(mask1,mask2,mask3,mask4)
{
	var mask=new Array();
	var i;
	if(checkIP(mask1,mask2,mask3,mask4,255))
		return true;
	mask[0]=parseInt_new(mask1);
	mask[1]=parseInt_new(mask2);
	mask[2]=parseInt_new(mask3);
	mask[3]=parseInt_new(mask4);
	for(i=0;i<4;i++)
	{
		var tmpmask=~(mask[i]+0xffffff00);
//		alert("tmpmask="+tmpmask);
		if(tmpmask&(tmpmask+1))
			return true;
		if(tmpmask!=0)
		{
			var j=0;
			for(j=i+1;j<4;j++)
			{
				if(mask[j]!=0)
					return true;
			}
		}
	}
	return false;
}
/*
   return 1 Netmask and host route conflict
   return 2 Netmask and route address conflict
   return 3 Network is unreachable
*/

function checkStaticRt(dest1,dest2,dest3,dest4,mask1,mask2,mask3,mask4,gw1,gw2,gw3,gw4,lanip,wanip,lanmask,wanmask)
{
	var dest=new Array();
	var mask=new Array();
	var lanipArray=new Array();
	var lanmaskArray=new Array();
	var wanipArray=new Array();
	var wanmaskArray=new Array();
	var i,flag=0;

	dest[0]=parseInt_new(dest1);
	dest[1]=parseInt_new(dest2);
	dest[2]=parseInt_new(dest3);
	dest[3]=parseInt_new(dest4);
	mask[0]=parseInt_new(mask1);
	mask[1]=parseInt_new(mask2);
	mask[2]=parseInt_new(mask3);
	mask[3]=parseInt_new(mask4);

	if(checkMask(mask1,mask2,mask3,mask4))
	{
//		alert("the Mask is invaild");
		return 1;
	}
	if(false == checkNetOrHost(dest1,dest2,dest3,dest4))
	{
//		alert("The dest ip is a host");
		for(i=0;i<4;i++)
		{
			if(mask[i]!=0xff)
				return 1;
		}
	}

	for(i=0;i<4;i++)
	{
		if(dest[i] & ~(mask[i]+0xffffff00))
		{
	//		alert("dest&mask!=0");
			return 2;
		}
	}
//	alert("check lan ip");
	if(lanip.value.length>=7)
	{
		lanipArray=lanip.value.split(".");
	//	alert("lanip = "+lanip.value);
		lanmaskArray=lanmask.value.split(".");
	//	alert("lanmsk = "+lanmask.value);
		if(false==badNetworkIP(lanipArray[0],lanipArray[1],lanipArray[2],lanipArray[3],lanmaskArray[0],lanmaskArray[1],lanmaskArray[2],lanmaskArray[3],gw1,gw2,gw3,gw4))
		{
			flag=1;
		}
	}
	//alert("check wan ip");
	if(wanip.value.length>=7)
	{
		wanipArray=wanip.value.split(".");
		//alert("wanip = "+wanip.value);
		wanmaskArray=wanmask.value.split(".");
		//alert("wanmsk = "+wanmask.value);
		if(false==badNetworkIP(wanipArray[0],wanipArray[1],wanipArray[2],wanipArray[3],wanmaskArray[0],wanmaskArray[1],wanmaskArray[2],wanmaskArray[3],gw1,gw2,gw3,gw4))
		{
			flag=1;
		}
	}
	if(flag==0)
		return 3;

	return false;
}

function feat_ip(ip1, ip2, ip3, ip4, max,local_ip)
{
	var   strlocalip=new   Array();

	strlocalip=local_ip.split(".");


	if( (parseInt(ip1.value) == strlocalip[0])
	 && (parseInt(ip2.value) == strlocalip[1])
	 && (parseInt(ip3.value) == strlocalip[2])
	 && (parseInt(ip4.value) == strlocalip[3]) )
	{
		return true;
	}

	if( (parseInt(ip1.value) == 127)
	 && (parseInt(ip2.value) == 0)
	 && (parseInt(ip3.value) == 0)
	 && (parseInt(ip4.value) == 1) )
	{
		return true;
	}

	return false;
}

function multicastIP(ip1, ip2, ip3, ip4, max,local_ip)   // multicast IP, 224.0.0.0 to 239.255.255.max
{
	var   strlocalip=new   Array();

	strlocalip=local_ip.split(".");

	if( (parseInt(ip1.value) == strlocalip[0])
	 && (parseInt(ip2.value) == strlocalip[1])
	 && (parseInt(ip3.value) == strlocalip[2])
	 && (parseInt(ip4.value) == strlocalip[3]) )
	{
		return true;
	}

	if( (parseInt(ip1.value) == 127)
	 && (parseInt(ip2.value) == 0)
	 && (parseInt(ip3.value) == 0)
	 && (parseInt(ip4.value) == 1) )
	{
		return true;
	}

	if((parseInt(ip1.value)>=224)&&(parseInt(ip1.value)<=239))
		return true;


   	return false;
}

function Destination_Lan_IP(destip,maskip,ip1, ip2, ip3, ip4,mip1,mip2,mip3,mip4)
{
	var   strlocalip=new   Array();
	var   strlocalmask=new   Array();

	strlocalip=destip.split(".");
	strlocalmask=maskip.split(".");

	if(((strlocalip[0] & strlocalmask[0])==(ip1.value & mip1.value))
		&& ((strlocalip[1] & strlocalmask[1])==(ip2.value & mip2.value))
		&& ((strlocalip[2] & strlocalmask[2])==(ip3.value & mip3.value))
		&& ((strlocalip[3] & strlocalmask[3])==(ip4.value & mip4.value))){
			return true;
		}

   	return false;
}

//  add for checking invalid characters
function is_valid_domain(object, needed, fname)
{
	var msg="";
    var reg = /^[A-Za-z0-9-.]{1,}$/;
	var str = object.value;

	msg +=checkBlank(object, fname);
	if((msg.length > 1)){
        if(needed)
            return msg;
        else
            return "";
	}

    msg = "";
    if(!reg.test(str)) {
        msg = fname + invalid_domain;
    }
	return msg;
}

function checkKey(evt)
{
	evt = (evt) ? evt : ((window.event) ? window.event : null)
	var srcElement = 	document.forms[0].elements[fieldIndex];
	var indexs=parseInt(srcElement.name.substr(srcElement.name.length-1,1));
	if(null != evt)
	{lastkeypressed = (evt.keyCode) ? evt.keyCode : (evt.which ) ? evt.which : null;}
    else
    {return false;}

	var bTemp=(lastkeypressed>=112 &&lastkeypressed<=135) || (lastkeypressed>=33 &&lastkeypressed<=40) || lastkeypressed==45 ||lastkeypressed==46 ;
	//F1-F24 key={112-135}   keycode 34=Next 35=End 36=Home 37=Left 38=Up 39=Right 40=Downkeycode 45=Insert 46=Delete
	if(true == ipfield && lastkeypressed!=9 && !bTemp) //tab key=9
	{
				if(lastkeypressed==32 || lastkeypressed==190 || lastkeypressed==110 )
				 {//keycode 32=space 190=period colon 110=KP_Decimal
						if(srcElement.value.length == 0)
							{
									document.forms[0].elements[fieldIndex].focus();
									return false;
							}
				        if (srcElement.type == 'text')
							{
								if(lastf == false)
								 {document.forms[0].elements[fieldIndex + 1].focus();}
								 return false;
							}

				}
			else if (lastkeypressed != 8)//keycode 8=BackSpace
				{
						if(!((lastkeypressed >= 48 && lastkeypressed <= 57 ) || (lastkeypressed >= 96 && lastkeypressed <= 105 )))
							{//keycode 48-57={0-9} 96-105={KP_0-KP_9}
								document.forms[0].elements[fieldIndex].focus();
								return false;
							}

				}
			else if(lastkeypressed == 8)
				{
					if (srcElement.type == 'text' && srcElement.value.length == 0)
						{
							if(firstf == false)
							{document.forms[0].elements[fieldIndex - 1].focus();bFlag=true;}
							return false;
						}
				}
				bIsLicet=true;
	}

}

function BackSpaceForIExplorer()
{
		var e = document.forms[0].elements[fieldIndex];
		var r =e.createTextRange();
		r.moveStart("character",e.value.length);
		r.collapse(true);
		r.select();
		bFlag=false;
}

function setIPfield(formObj,fieldObj)
{
	ipfield = true;
	firstf = false;
	lastf = false;
	bIsLicet=false;
	for (var i = 0; i < formObj.elements.length; i++)
		{
			if (formObj.elements[i].name == fieldObj.name)
			{
				fieldIndex = i;
				break;
			}
		}
	if(navigator.userAgent.match( /MSIE (\d+\.\d+)/) && bFlag == true)
	{
		BackSpaceForIExplorer();
	}
}

function NextGetFocus()
{
	var srcElement = document.forms[0].elements[fieldIndex];
	if(bIsLicet && srcElement.value.length == srcElement.size)
	{
		if(lastf == false)
			{document.forms[0].elements[fieldIndex + 1].focus();}
	}
}
//add by alex_qian begin

function isMulticastIP(ip1,ip2,ip3,ip4)
{
	var ip01;
	var ip02;
	var ip03;
	var ip04;
	if(isNaN(ip1)) ip01=ip1.value;
	else ip01=ip1;
	if(isNaN(ip2)) ip01=ip1.value;
	else ip02=ip2;
	if(isNaN(ip3)) ip01=ip1.value;
	else ip03=ip3;
	if(isNaN(ip4)) ip01=ip1.value;
	else ip04=ip4;

    if( ( isInteger(ip01,224,239,false) ) && 
        ( isInteger(ip02,0,255,false) ) && 
        ( isInteger(ip03,0,255,false) ) &&
        ( isInteger(ip04,1,254) ) ) 
        return true;
    else 
        return false;
}

function  isEtypeIP(ip1,ip2,ip3,ip4)
{
	var ip01;
	var ip02;
	var ip03;
	var ip04;
	if(isNaN(ip1)) ip01=ip1.value;
	else ip01=ip1;
	if(isNaN(ip2)) ip01=ip1.value;
	else ip02=ip2;
	if(isNaN(ip3)) ip01=ip1.value;
	else ip03=ip3;
	if(isNaN(ip4)) ip01=ip1.value;
	else ip04=ip4;

    if( ( isInteger(ip01,240,255,false) ) &&
        ( isInteger(ip02,0,255) ) &&
        ( isInteger(ip03,0,255,false) ) &&
        ( isInteger(ip04,1,254,false) ) ) 
        return true;
    else 
        return false;
}

function isReservedIP(ip1,ip2,ip3,ip4)
{
    if( ( parseInt_new(ip1)==0 ) &&
        ( parseInt_new(ip2)==0 ) && 
        ( parseInt_new(ip3)==0 ) && 
        ( parseInt_new(ip4)==0 ) )
        return true;
    if( parseInt_new(ip1)==127 ) 
        return true;
    if( ( parseInt_new(ip1)==169) &&
        ( parseInt_new(ip2)==254)) 
        return true;
    return false;
}

function isM_E_RIP(ip1,ip2,ip3,ip4)
{
    if( ( isMulticastIP(ip1,ip2,ip3,ip4) ) ||
        ( isEtypeIP(ip1,ip2,ip3,ip4) ) || 
        ( isReservedIP(ip1,ip2,ip3,ip4) ) )
        return true;
    else 
        return false;
}

function CheckStr2ip(str)
{
	var ipArray=new Array();
	ipArray = str.split(".",4);
	if( (isEipNovalue( ipArray[0],ipArray[1],ipArray[2],ipArray[3] ) ) ||
		(isReservedIP( ipArray[0],ipArray[1],ipArray[2],ipArray[3] ) ) )
		return true;
	else return false;
}

function isEipNovalue(ip1,ip2,ip3,ip4) //for check var without walue 
{
	if( ( isInteger(ip1,240,255,false) ) &&
        ( isInteger(ip2,0,255) ) &&
        ( isInteger(ip3,0,255,false) ) &&
        ( isInteger(ip4,1,254,false) ) ) 
        return true;
    else 
		return false;
}


/*
   The following functions are added for new features
   Gerry Wu 2009/01/23
*/
 var isMSIE = navigator.userAgent.indexOf("MSIE") !=  - 1;
 

function viewTop(obj)
{
    var viewsTop = 0;

        while(obj != null )
        {
           // alert("obj=" + obj + "obj.offsetTop =" + obj.offsetTop + "obj.offsetParent=" +obj.offsetParent);
            viewsTop += obj.offsetTop * 1 ;
            obj = obj.offsetParent;
        }

    return viewsTop;
};



function viewLeft(obj)
{
    var viewsLeft = 0;

        while (obj != null)
        {
            viewsLeft += obj.offsetLeft * 1 ;
            obj = obj.offsetParent;
        }


    return viewsLeft;
};

var h = 0;
var w = 0;

function extendPageSize()
{
 
        if (arguments[1]==null)
        arguments[1] = 10;
        
        var obj = document.getElementById(arguments[0]);
        if(obj == null)
        return;
        
        h = document.body.clientHeight - viewTop(obj) ;
        var factor = isMSIE ? 1 : 2;
        var parentWidth = Math.max(obj.parentNode.clientWidth, obj.parentNode.offsetWidth);
        var pageAreaWidth = (document.body.clientWidth - viewLeft(obj));
        w = Math.min((parentWidth - factor * arguments[1]), pageAreaWidth);
        if (obj.style != null)
        {
            obj.style.height = h + "px";
            obj.style.width = w + "px";
            obj.style.marginLeft = arguments[1] + "px";
            obj.style.paddingRight = arguments[1] + "px";
           // alert(obj.style.height + obj.style.width + obj.style.marginLeft + obj.style.paddingRight);
        }
        else
        {
            obj.height = h + "px";
            obj.width = w + "px";
        }
       
  
        
    
};

/*
1->ID
2->gap
*/

function myExtendHeight()
{

        if (arguments[1] ==null)
        arguments[1] = 0;
        var obj = document.getElementById(arguments[0]);
        if (obj == null)
        return;
        var pageBelow = document.getElementById("copyrightline");
        if (pageBelow != null)
        arguments[1] += pageBelow.offsetHeight;
        var nextHeight = document.body.clientHeight - viewTop(obj) - arguments[1];
        if (obj.style != null)
            obj.style.height = nextHeight + "px";
            else
            obj.height = nextHeight;
            
};




var LastContent = null;

function inewResizeContent(indent)
{
    if (indent != null)
        LastContent = indent;
     //alert(LastContent);
    extendPageSize("newContentArea", LastContent);
 
};

var routerOnresizeTimer = null;
function inewOnresizeHandler()
{
	//alert("routerOnresizeHandler");
    if (routerOnresizeTimer != null)
        clearTimeout(routerOnresizeTimer);
    routerOnresizeTimer = setTimeout("inewResizeContent()", 200);
};



/* Alert Box */
var ABTRF = "AB_FRAME";
var ABNoMsg = "<input name=\"NoMsg\" id=\"NoMsg\" type=\"checkbox\" value=\"0\">&nbsp; Don't show me this again";
var ABBtnOK = "<div id=\"AB_OK\" class=\"Norm2\" onMouseOver=\"this.className='Over2'\" onMouseOut=\"this.className='Norm2'\" onClick=\"OK_AB('" + ABFile + "');\">OK</div>";
var ABBtnCANCEL = "<div id=\"AB_CANCEL\" class=\"Norm5\" onMouseOver=\"this.className='Over5'\" onMouseOut=\"this.className='Norm5'\" onClick=\"enableAllFields();\">Cancel</div>";
var ABBtnYES = "<div id=\"AB_YES\" class=\"Norm3\" onMouseOver=\"this.className='Over3'\" onMouseOut=\"this.className='Norm3'\" onClick=\"YES_AB('" + ABFile + "');\">Yes</div>";
var ABBtnNO = "<div id=\"AB_NO\" class=\"Norm2\" onMouseOver=\"this.className='Over2'\" onMouseOut=\"this.className='Norm2'\" onClick=\"NO_AB();\">No</div>";

//element
var ABTitle;
var ABFile;     // current file with
var ABType;     // Crit, Info, Warn
var ABMsg;     // Message
var ABNOM;     // No/Yes Message
var ABBT1;     // Button 1
var ABBT2;     // Button 2
var ABNum;     // Message Number / Numbers of Message
var BOX;



function setABox(windowObj, el, ABTitle, ABType, ABMsg,  ABBT1, ABBT2)
{
    
BOX = '<table border="0" cellspacing="0" cellpadding="0" class="AB_TABLE"><tr><td colspan="3" class="AB_TD_top"><table border="0" cellspacing="0" cellpadding="0" class="top_TABLE"><tr><td class="top_td_l"></td><td id="AB_Title" class="top_td_ct">' + ABTitle + "</td><td class=\"top_td_cc\"><img src=\"img_alert/Close.gif\" class=\"td_cc_img\" onClick=\"enableAllFields();\"></td><td class=\"top_td_r\"></td></tr></table></td></tr><tr><td class=\"AB_TD_Ml\"></td><td class=\"AB_TD_Mc\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"Help_TABLE\"><tr><td><span id=\"AB_Help\" class=\"Help_span\" ;\"></span> </td></tr></table><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"MSG_TABLE\"><tr><td id=\"AB_Type\" class=\"MSG_type\"><img id=\"AB_Tye\" src=\"img_alert/ICON-" + ABType + '.gif"></td><td id="AB_Msg" class="MSG_cont">' + ABMsg.replace(/\n/g,"<br>") + '</td></tr></table><table border="0" cellspacing="0" cellpadding="0" class="MSG_TABLE"><tr><td class="MSG_BTN_t"></td></tr><tr><td><table border="0" cellspacing="0" cellpadding="0" align="center"><tr><td id="AB_Btn1">' + ABBT1 + '</td><td id="AB_Btn2">' + ABBT2 + '</td></tr></table></td></tr></table><input type="hidden" name="h_NoMsg" value="@h_NoMsg#"><table border="0" cellspacing="0" cellpadding="0" class="MSG_TABLE"><tr><td class="MSG_Num_t"></td></tr></table></td><td class="AB_TD_Mr"></td></tr><tr><td colspan="3" class="AB_TD_btm"><table border="0" cellspacing="0" cellpadding="0" class="btm_TABLE"><tr><td class="btm_td_l"></td><td class="btm_td_cc"></td><td class="btm_td_r"></td></tr></table></td></tr></table>';

	if (document.all)
	{
	  if (windowObj.document.all(el))
	  {
		windowObj.document.all(el).innerHTML = BOX;
	  }
	}
	else if (document.getElementById)
	{
	  if (windowObj.document.getElementById(el) )
	  {
		windowObj.document.getElementById(el).innerHTML = BOX;
		
	  }
	}
	disableAllFields();
	/*if(ABNOM != "")
	{
		var af = document.ABox.NoMsg;
		af.disabled = false;
	}
	else{ABNOM = "&nbsp;";}*/
}





function ALERT(windowObj, el, ABTitle,  ABType, ABMsg,  ABBT1, ABBT2 )
{
   
  
	if(ABMsg != "")
	{
		setABox(windowObj, el, ABTitle,  ABType, ABMsg,  ABBT1, ABBT2);
	}
	else
	{ document.forms[0].submit(); }
}

function rALERT(rTitle, rMsg)
{
    ALERT(parent, "CON", rTitle,  "Crit", rMsg, ABBtnOK, "");
    return false;    
}

function rConfirm(rTitle, rMsg)
{
   if (ALERT(parent, "CON", rTitle, "Warn", rMsg, ABBtnYES, ABBtnNO))
   {
        //alert("in the rConfirm: true");
        return true;
    
   }
   else
   {
        //alert("in the rConfirm : false");     
        return false;
   }
    
}
function disableAllFields()
{
    
    
 /*   for ( var i=1; i<=9; i++)
    {
         var z = parent.document.getElementById('btn' + i);
         //alert(z.getAttribute("onClick"));
         z.setAttribute('onClick_bak', z.getAttribute('onClick'));
         //alert("before:" + z.getAttribute('onClick'));
         //z.setAttribute("onClick", "function anonymous() { }");
         //alert("bak=" + z.getAttribute('onClick_bak'));
         z.removeAttribute('onClick');
    }*/
    
        /* 
	var e = parent.document.getElementsByTagName('a');
	//alert("e.length= " + e.length);
	for(var i=0;i<e.length;i++)
	{
		disableAnchor(e[i], true);
	}
	var f = document.getElementsByTagName('input');
	//alert("f.length= " +f.length);
	for(var i=0;i<f.length;i++)
	{
		f[i].setAttribute('disabled',true)
	}
	var g = document.getElementsByTagName('select');
	//alert("g.length= " + g.length);
	for(var i=0;i<g.length;i++)
	{
		g[i].setAttribute('disabled',true)
	}
        */
	/*var A = parent.document.getElementsByTagName('a');
	alert("A.length =" + A.length);
	for(var i=0;i<A.length;i++)
	{
		disableAnchor(A[i], true);
	}*/
	parent.document.getElementById('CON').style.display='block';
        if(parent.document.getElementById('alert_filter'))
	    parent.document.getElementById('alert_filter').style.display='block';
}

function move_up() { document.getElementById('ContentArea').scrollTop = 0; }	

function disableAnchor(obj, disable)
{
  if(disable)
  {
    var href = obj.getAttribute("href");
    
    if(href && href != "" && href != null)
	{
       obj.setAttribute('href_bak', href);
       //if (href != obj.getAttribute("href_bak"))
       //alert("mistake");
       //alert(obj.attributes['href_bak'].nodeValue);
    }
    obj.removeAttribute('href');
  }
  else
  {
    //alert(obj.attributes['href_bak'].nodeValue);
    //obj.setAttribute('href', obj.attributes['href_bak'].nodeValue);
    //alert(obj.getAttribute("href_bak"));
    if (obj.getAttribute("href_bak") != null)
    {
        obj.setAttribute('href', obj.getAttribute("href_bak"));
    }
    
    
  }
}

function enableAllFields()
{
   
	parent.document.getElementById('CON').style.display='none';
        if(parent.document.getElementById('alert_filter'))
	    parent.document.getElementById('alert_filter').style.display='none';
	/*for (var i=1; i<=9; i++)
	{
	    var z = parent.document.getElementById('btn' + i);
	    z.setAttribute('onClick', z.getAttribute('onClick_bak'));
	    z.removeAttribute('onClick_bak');    
	}*/
/*	
	var e = parent.document.getElementsByTagName('a');
	for(var i=0;i<e.length;i++)
	{
		disableAnchor(e[i], false);
	}
	
	var A = parent.document.getElementsByTagName('a');
	for(var i=0;i<A.length;i++)
	{
		disableAnchor(A[i], false);
	}
	var f = rightframe.document.getElementsByTagName('input');
	//alert("f.length= " + f.length);
	for(var i=0;i<f.length;i++)
	{
		f[i].disabled = false;
	}
	var g = rightframe.document.getElementsByTagName('select');
	for(var i=0;i<g.length;i++)
	{
		g[i].disabled = false;
	}
	//alert("g.length= " + g.length);
*/        
}

function OK_AB()
{
	//var Af = document.ABox;
	//Af.submit();
    var cf = rightframe.document.forms[0];        
    enableAllFields();

    if(cf.name == "lan")
    {
        if(cf.h_alertflag.value == "1")
        {
            cf.h_alertflag.value = "0";
            return true;
        }
	else if(cf.h_alertflag.value == "2")
	{
	    cf.h_alertflag.value = "0";
            cf.submit();
            return true;        
        }  
	else if(cf.h_alertflag.value == "0")
            return true;
        	
        return true;        
    }  
}



var rback_page="Setup.htm";

function rnoClick() {
    if ((rightframe.event.button==1)||(rightframe.event.button==2)) {
        //alert('Firmware upgrading...')
        rALERT("FirmwareUpgrade", "Firmware upgrading...");
    }
}

function rnoKey()
{
	rALERT("FirmwareUpgrade", "Firmware upgrading...");
	return false;
}
/***************    alex  begin   ******************/
function allgray()
{
	var cf = parent.document.getElementById("btngrp");
	var rline = parent.document.getElementById("rline");
	var rlineA = rline.getElementsByTagName("a");
	var alldiv = cf.getElementsByTagName("div");
	for(var j = 0;j<rlineA.length;j++)
	{
		rlineA[j].href="#";
	}
	for(var i = 0;i<alldiv.length;i++)
	{
		if(alldiv[i].className=="closesub")
			continue;
		if(alldiv[i].className=="btn_normal")
		{
			alldiv[i].onclick="";
			alldiv[i].onmouseover="";
			alldiv[i].onmouseout="";
//			alert("name :"+alldiv[i].className);
//			alert("onclick :"+alldiv[i].onclick);

		}
		else
			if(alldiv[i].className=="btn_clk")
			{
				document.getElementById(alldiv[i].id+"Toggler").src="drawerTriangleCollapsedT.html";
				alldiv[i].className="btn_normal";
				alldiv[i].onclick="";
				alldiv[i].onmouseover="";
				alldiv[i].onmouseout="";
//				alert("name :"+alldiv[i].className);
//				alert("onclick :"+alldiv[i].onclick);
			}
			else
				if(alldiv[i].className=="opensub")
					alldiv[i].className="closesub";
	}
}
/******************** alex end    ******************/
function rstartUpload()
{
    if (rightframe.document.all)
		rightframe.document.all("uploadStatus").style.display = (true) ? showit : hideit ;
	else if (rightframe.document.getElementById)
		rightframe.document.getElementById("uploadStatus").style.display = (true) ? showit : hideit ;
	allgray();
    if(rpc > 0)
    {
        clearTimeout(rtime);
        rpc = 0;
    }
    rload();
    rightframe.document.onmousedown=rnoClick;
    top.document.onkeydown=rnoKey;
}

var rpc = 0;
function rload()
{
	rpc=rpc+1;

	if (rpc > 100)
	{
		//location.href = rback_page;
		clearTimeout(rtime);
		return;
	}
	rsetWidth(self, "rlpc", rpc+"%");
	rsetHTML(self, "rpercent", rpc+"%");
	rtime = setTimeout("rload()",1800);//unit:0.1 second
}

function rsetHTML(windowObj, el, htmlStr)
{
    if (rightframe.document.all)
	{
	  if (windowObj.rightframe.document.all(el) )
        windowObj.rightframe.document.all(el).innerHTML = htmlStr;
	}
	else if (rightframe.document.getElementById)
	{
	  if (windowObj.rightframe.document.getElementById(el) )
	    windowObj.rightframe.document.getElementById(el).innerHTML = htmlStr;
	}
}

function rsetWidth(windowObj, el, newwidth)
{
    if (rightframe.document.all)
	{
	  if (windowObj.rightframe.document.all(el) )
        windowObj.rightframe.document.all(el).style.width = newwidth ;
	}
	else if (rightframe.document.getElementById)
	{
	  if (windowObj.rightframe.document.getElementById(el) )
	    windowObj.rightframe.document.getElementById(el).style.width = newwidth;
	}
}

function alert_modify_data(idx, active) {
	var cf = rightframe.document.forms[0];
	var username = eval("cf.vpn_client_username"+idx);
	var password = eval("cf.vpn_client_password"+idx);
	var passchange = eval("cf.vpn_client_change"+idx);
	var active = eval("cf.vpn_client_enabled"+idx);

	username.value = cf.QVPNusername.value;
	password.value = cf.QVPNpassword.value;
	if(cf.pass_change[0].checked==true)
		passchange.value="1";
	else
		passchange.value="0";
	passchange.value = (cf.pass_change[0].checked==true)?1:0;
	/* Need set active */
	if(active==0)
		active.value=1;
	return;
}
function YES_AB()
{ 
    var cf = rightframe.document.forms[0];
    enableAllFields();
	
    if(cf.name == "vpn_main")
    {
        cf.h_ipsec_select.value = cf.ipsec_select.options[cf.ipsec_select.selectedIndex].value;
        cf.todo.value = "tunnel_del";
        cf.submit();
        return true;
    }


    if (cf.name == "firmwareupgrade")
	{
	    if(cf.remote_upgrade_disable.value==1 && cf.remote_ip_in_local.value==0)
	    {
		    //alert("Remote Upgrade is disable, you can't upgrade firmware from remote\n");
		    rALERT("FirmwareUpgrade", "Remote Upgrade is disable, you can't upgrade firmware from remote\n");	
		    return false;
	    }
	    rstartUpload();
    } 
    else if(cf.name == "url_filter")
    {      
         var jump_str;
         jump_str = "\""+ parent.location + "\"";
         jump_str = jump_str.replace("url_filtering.htm","Factorydefaults.htm");
         jump_str = jump_str.substring(1,jump_str.length-1);
         parent.location = jump_str;
         return true;        
    }
    else if(cf.name=="quickvpnsetup")
    {
        var username;
        for(i=1; i<=5; i++)     {
            username = eval("cf.vpn_client_username"+i);
            if(username.value!=""&&compare_str(username.value,cf.QVPNusername.value)==0)
            {
                rALERT("Quick_vpn_setup",msg_user_exist);
            return;
            }
        }        
       	for(i=1; i<=5; i++)	
		{
			username = eval("cf.vpn_client_username"+i);

			if(username.value == "") 
			{
				/* default active */
				alert_modify_data(i, 1);
				cf.submit();
				return true;
			}
		}
		rALERT("Quick_vpn_setup", msg_qvpn_full);     
    }
    
    if (rightframe.document.forms[1] && rightframe.document.forms[1].name== "restorefile")
    {
         rightframe.document.forms[1].submit(); 
         return true;
    } 
     
    	
	//cf.todo.value = "proceed";
	cf.submit();	
	return true;
}

function NO_AB()
{
    var jump_str;
    
    enableAllFields();
    var cf = rightframe.document.forms[0];
    
    if (cf.name == "url_filter")
    {
        jump_str = "\""+ parent.location + "\"";
        jump_str = jump_str.replace("url_filtering.htm","Setup_summary.htm");
        jump_str = jump_str.substring(1,jump_str.length-1);
        parent.location = jump_str;    
        return true;
    }
    
    return false;    
}
