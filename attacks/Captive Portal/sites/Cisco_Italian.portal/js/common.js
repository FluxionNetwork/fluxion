var ZERO_NO = 1;	// 0x0000 0001
var ZERO_OK = 2;	// 0x0000 0010
// x.x.x.0
var MASK_NO = 4;	// 0x0000 0100
var MASK_OK = 8;	// 0x0000 1000
// 255.255.255.255
var BCST_NO = 16;	// 0x0001 0000
var BCST_OK = 32;	// 0x0010 0000

var SPACE_NO = 64;      // 0x0100 0000
var SPACE_OK = 128;     // 0x1000 0000

var LANSUBNET_NO = 64;      // 0x0100 0000
var LANSUBNET_OK = 128;     // 0x1000 0000

var VALID_IP_RULE1="1-223.0-255.0-255.1-254";
var VALID_IP_RULE2="0-255.0-255.0-255.0-255";
var VALID_IP_RULE3="1-223.0-255.0-255.0-254";
var VALID_IP_RULE4="10-10.0-255.0-255.0-255";
var VALID_IP_RULE5="172-172.16-31.0-255.0-255";
var VALID_IP_RULE6="192-192.168-168.0-255.0-255";
var VALID_IP_RULE7="1-223.0-255.0-255.0-255";

var http_power='r';
var http_from = 'lan';

/* MAXLENGTH */
var FORWARD_MAX=30;
var SINGLEFORWARD_MAX=20;
var MAX_WIFI=4;
var FORWARDING_MAXLEN=20; 
var TRIGGER_MAXLEN=20;

//AUTO=1 call keep_val() for check
//AUTO=0 call get_data() for check
var CHK_VALUE_AUTO=1;

/*
 Description: Defined table of td type
 function Name: draw_td
 Author: Emily Liao
 Modify: 2010.3.25
*/
var FUNTITLE     =1;
var SUBTITLE     =2;
var ISHR         =3;
var TABLETD      =4;
var TABLETD_TAIL =5;
var TABLETD_TAIL_R =27;
var TABLETD_TAIL_C =28;
var TABLETD_SINGLE_LINE=6;
var TABLETD_SINGLE_LINE_R=25;
var TABLETD_SINGLE_LINE_C=26;
var MAINFUN      =8;
var SUBTITLE_M   =9;
var FUNTITLE_R     =13;
var TABLETD_SINGLE_LINE_FIRST=18;
var TABLETD_SINGLE_LINE_FIRST_R=7;
var TABLETD_SINGLE_LINE_FIRST_C=24;
var ICONLINE=19;
var CREATE_EDIT_TABLE=20;
var PWDLINE=21;
var SUBTITLE_NOSHIFT   =22;
var SUBTITLE_MSG=23;

//TABLE TD TYPE DEFINE END

// Output type define 
var O_GUI = 1;
var O_VAR = 2;
var O_MSG = 3;
var O_PAGE = 4;

var WARNING=1;
var ERROR=2;
var INFO=3;
var SUCCESS=4;

var support_3g = 0;
support_3g=1

var PASS=1;
var FAIL=0;
var Browser = CheckBrowser();
var current_model_name = "RV130W";
var PASS_ICON_PATH="image/Status_success_icon.png";
var ERROR_ICON_PATH="image/Status_ciriticalerror_icon.png";
var INFO_ICON_PATH="image/Status_information_icon.png";
var WARN_ICON_PATH="image/Status_warning_icon.gif";
var ap_mode = "0";
if ( ap_mode != "1" ) ap_mode == "0";
var now_lang="EN"; 
var is_24_lang_list=new Array("FR","DE","SP","PT","IT");

var flg_24=0;
for(var i=0; i<is_24_lang_list.length; i++)
{
	if ( now_lang == is_24_lang_list[i] )   
        {
        	flg_24 = 1;
                break;
        }
}
// OBJ BEHAVIOR FUNCTION START ================================================================================

function Capture(obj)
{
	document.write(obj);
}

function CaptureC(obj)
{
	if ( now_lang == "FR" ) 
		document.write(obj+" :");
	else
		document.write(obj+":");
}

function choose_enable(en_object)
{
	if(!en_object)	return;
	en_object.disabled = false;			
	if ( Browser == "IE" )
	{
		if ( en_object.type == "text" || en_object.type == "password" || en_object.type == "select-one" ){
			en_object.style.backgroundColor = "";
			en_object.style.color = "#000000";
		}
	}
	if ( en_object.type == "button" )
	{
		if ( en_object.className == "BT_L_DISABLE" ) 
			en_object.className = "BT_L";
		else if ( en_object.className == "BT_DISABLE" ) 
			en_object.className = "BT";
		else if ( en_object.className == "BT_S_DISABLE" ) 
			en_object.className = "BT_S";
		else if ( en_object.className == "BT_UP_DISABLE") 
			en_object.className = "BT_UP";
		else if ( en_object.className == "BT_DOWN_DISABLE") 
			en_object.className = "BT_DOWN";
		else if ( en_object.className == "BT_DOWN_DISABLE") 
			en_object.className = "BT_DOWN";
		else if ( en_object.className == "BT_AUTO_DISABLE") 
			en_object.className = "BT_AUTO";
	}
}

function choose_disable(dis_object)
{
	if(!dis_object)	return;
	if ( Browser == "IE" )
	{ 
		if ( dis_object.type == "text" || dis_object.type == "password" || dis_object.type == "select-one" )
		{
			dis_object.style.backgroundColor = "#e0e0e0";
			dis_object.style.color = "#7e7e7e";
		}
	}
	if ( dis_object.type == "button" )
	{
		if ( dis_object.className == "BT_L" ) 
			dis_object.className = "BT_L_DISABLE";
		else if ( dis_object.className == "BT" || dis_object.className == "BT_Press") 
			dis_object.className = "BT_DISABLE";
		else if ( dis_object.className == "BT_S" ) 
			dis_object.className = "BT_S_DISABLE";
		else if ( dis_object.className == "BT_UP" ) 
			dis_object.className = "BT_UP_DISABLE";
		else if ( dis_object.className == "BT_DOWN" ) 
			dis_object.className = "BT_DOWN_DISABLE";
		else if ( dis_object.className == "BT_AUTO" ) 
			dis_object.className = "BT_AUTO_DISABLE";
	}
	dis_object.disabled = true;
}

function DISABLE_PART(F,start,end,flag)
{
        var i,starti,endi;
        var len = F.elements.length;
	//alert("PART element length="+len);
        for(i=0; i<len; i++)
        {
                if(F.elements[i].name==start) starti=i;
                if(F.elements[i].name==end) endi=i;
        }
        if(starti == '' || endi == '')return true;
        for(i=starti; i<=endi; i++)
        {
                if(flag==0)
                        choose_enable(F.elements[i]);
                else
                        choose_disable(F.elements[i]);
        }
}

// FOR IP MODE Used.
function DISABLE_ALL(F,flg)
{
        var len,i,bt;
        len = F.elements.length;
	//alert("ALL element length="+len);
        for(i=0; i<len; i++)
        {
                if ( flg == true )
                choose_disable(F.elements[i]);
        }
}

function HIDDEN_PART(tagname,start,end,flag)
{
        var i,starti,endi;
        var obj = document.getElementsByTagName(tagname);
	var len = obj.length;
        for(i=0; i<len; i++)
        {
		if( obj[i].id.indexOf(start)!=-1) starti = i; 
		if( obj[i].id.indexOf(end)!=-1) endi = i; 
        }
        if( starti == undefined ) return true;
	if( endi == undefined) endi = starti;
        for(i=starti; i<=endi; i++)
        {
                if(flag==0)
			document.getElementsByTagName(tagname)[i].style.display="";
                else
			document.getElementsByTagName(tagname)[i].style.display="none";
        }
}

function str_replace(search, replace, str)
{
        var regex = new RegExp(search,"g");
        return str.replace(regex, replace);
}

function spell_words()
{
	var args_cnt=0;
	var args = new Array;
	for(var i=0; i<10; i++)
	{
		args[i] = arguments[i];
		if ( typeof(args[i])=='undefined' ) break;
		args_cnt++;
	}
	var new_msg = args[0];
	var re="";
	for(var i=1; i<args_cnt; i++)
	{
		re = eval('/<args'+i+'>/');
       		new_msg = new_msg.replace(re,args[i]);
	}
	return new_msg;
}

function parseIP(ipaddr)
{
    	if( check_ipv4(ipaddr,VALID_IP_RULE7) != PASS ) 
		return ipaddr;
	var tmpip = ipaddr.split(".");
	var newip = "";
	if ( tmpip.length != 4 ) return ipaddr;
	for(var i=0; i<4; i++)
	{
		if ( newip != "" ) newip+=".";
		newip += parseInt(tmpip[i], 10);
	}
	return newip;
}

function clear_msg(obj_name, span_id){
	if ( document.getElementById(obj_name) )
		document.getElementById(obj_name).style.backgroundColor="";
	if ( document.getElementById(span_id) )
		document.getElementById(span_id).innerHTML="";
}

function table_msg(img_id,obj_id,div_id,index,errmsg)
{
	if ( typeof index != 'undefined' ) 
	{
		if ( document.getElementById("tmsg"+index) )
		{ 
			document.getElementById("tmsg"+index).innerHTML = __T(share.tableerrmsg);
			document.getElementById("tmsg"+index).style.display="";
		}
	}else{
		if ( document.getElementById("tmsg") ) 
		{
			document.getElementById("tmsg").innerHTML = __T(share.tableerrmsg);
			document.getElementById("tmsg").style.display="";
		}
	}
	document.getElementById(img_id).style.display="";
	if ( document.getElementById(obj_id) )  // For not Row selected
		document.getElementById(obj_id).className="TABLECONTENT__TD_ERR";
	document.getElementById("div_msg"+div_id).innerHTML = errmsg;
	document.getElementById("tr_table"+index).className= "TABLECONTENT_ERR";
}

function clear_table_msg(guide_id,image_id,object_id,index)
{
	//document.getElementById(guide_id).style.display="none";
	if ( document.getElementById(image_id) ) 
	{
		document.getElementById(image_id).style.display="none";
		document.getElementById(image_id).alt="";
	}
	if ( document.getElementById(object_id) )
		document.getElementById(object_id).className= "TABLECONTENT__TD_RECOVERY";
	//table message
	if ( document.getElementById("tmsg") ) 
		document.getElementById("tmsg").innerHTML = __T(msg.tablemsg);
	var tmp=-1;
	if ( chk_chartype(index,DIGIT) == PASS ) 
		tmp = index;
	else 
		tmp = index.substring(index.indexOf("_")+1,index.length);
	if ( tmp != -1 ) 
	{
		if ( tmp%2 == 0 ) 
			document.getElementById("tr_table"+index).className= "TABLECONTENT_S";
		else	
			document.getElementById("tr_table"+index).className= "TABLECONTENT_D";
	}
}

function SHOW_HIDDEN_TABLE(bt_name,table_id,img_id,show_str,hide_str)
{
        var obj = document.getElementById(bt_name).innerHTML;
	
        if (obj == show_str){
		document.getElementById(img_id).src = "image/show1.gif";
                document.getElementById(table_id).style.display="";
		document.getElementById(bt_name).innerHTML = hide_str;
	}else{
		document.getElementById(img_id).src = "image/show.gif";
                document.getElementById(table_id).style.display="none";
		document.getElementById(bt_name).innerHTML = show_str;
	}
	
}

function get_full_ip(F,obj_name)
{
	var tmp="";
	for(var i=0; i<4; i++)
	{
		if ( tmp != "" ) tmp+=".";
		tmp += document.getElementById(obj_name+"_"+i).value;
//		tmp += eval("F."+obj_name+"_"+i).value;	
	}
	return tmp;
}

function table_bt_out(obj_id,img_id,show_str)
{
	if ( document.getElementById(img_id).src.indexOf("image/showDis") !=-1 ) return;
	if ( document.getElementById(obj_id).innerHTML == show_str) 
		document.getElementById(img_id).src = "image/show.gif";  
	else
		document.getElementById(img_id).src = "image/show1.gif";  
}

function table_bt_over(obj_id,img_id,show_str)
{
	if ( document.getElementById(img_id).src.indexOf("image/showDis") !=-1 ) return;
	if ( document.getElementById(obj_id).innerHTML == show_str) 
		document.getElementById(img_id).src = "image/showHover.gif";  
	else
		document.getElementById(img_id).src = "image/showHover1.gif";  
}

function removed_pwd_result(id)
{
	var tbody = document.getElementById("pwdtb"+id).getElementsByTagName("TBODY")[0];
        if (document.getElementById("pwd_tr"+id) != 'undefined' && document.getElementById("pwd_tr"+id) != null)
                tbody.removeChild(document.getElementById("pwd_tr"+id));
}

function show_pwd_result(cnt,id)
{
	var obj_msg = document.getElementById("msg_pwd"+id);
	if ( cnt == 0 ) 
	{
		obj_msg.style.display="none";
		return;
	}
	obj_msg.style.display="";
	removed_pwd_result(id);
	document.getElementById("pwdtb"+id).style.display="";
	var tbody = document.getElementById("pwdtb"+id).getElementsByTagName("TBODY")[0];
	var row = document.createElement("tr");
	row.setAttribute("id","pwd_tr"+id);
	for(var i=0; i<14; i++)
	{
		if ( cnt > i ) 
		{
			if ( i < 4 ) color = "red";
        	        else if ( i>=4 && i<=8 ) color = "yellow";
                	else color = "green";
		}else
                	color="#e7eff7";
			
		tdArray = document.createElement("td");
	        tdArray.setAttribute("bgColor",color);
		tdArray.style.color=color;
		tdArray.style.font="4px Arial";
	        tdArray.innerHTML = "2";
        	row.appendChild(tdArray);
	}
	tbody.appendChild(row);
	if ( cnt>0 && cnt<=4 ) obj_msg.innerHTML = __T(msg.belowmin);
	else if ( cnt>4 && cnt<=7 ) obj_msg.innerHTML = __T(msg.weak);
	else if ( cnt>7 && cnt<=10 ) obj_msg.innerHTML = __T(msg.strong);
	else if ( cnt>10 && cnt<=12 ) obj_msg.innerHTML = __T(msg.verystrong);
	else if ( cnt>12 ) obj_msg.innerHTML = __T(msg.secure);
}

var ISNUM=1;
var ISCHAR=2;
var ISBCHAR=4;
var ISOTHER=8;
function chk_char_type(ch)
{
	if( ch >= 48 && ch <= 57 ) return ISNUM;
	else if( ch >= 65 && ch <= 90  ) return ISCHAR;
	else if( ch >= 97 && ch <= 122 ) return ISBCHAR;
	return ISOTHER;
	
}

function count_pwd(val,len,pwd_class)
{
	var ch="",ch1="";
	var ch_type0=0,chtype1=0;
	var now_class=0, trans_num=0, class_type=0, add_num=0;
	if ( pwd_class == 0 && len == 0 ) return 5;
	for(var i=0; i<val.length; i++)
	{
	    	ch = val.charCodeAt(i);
		ch_type0 = chk_char_type(ch);
		class_type = (class_type | ch_type0);
		if ( i == val.length-1 ) break;
	    	ch1 = val.charCodeAt(i+1);
		ch_type1 = chk_char_type(ch1);
		if ( i == val.length-2 )
			class_type = (class_type | ch_type1);
		//alert("ch0="+val.charCodeAt(i)+";type="+ch_type0+"\nch1="+val.charCodeAt(i+1)+";type="+ch_type1);
		if ( ch_type0 != ch_type1 ) trans_num ++;
	}
	//alert("class_type="+class_type);
	//alert("1.now_class="+now_class+";trans_num="+trans_num);
	if ( (class_type & ISNUM) == ISNUM ) now_class++;
	if ( (class_type & ISCHAR) == ISCHAR ) now_class++;
	if ( (class_type & ISBCHAR) == ISBCHAR ) now_class++;
	if ( (class_type & ISOTHER) == ISOTHER ) now_class++;
	//alert("2.now_class="+now_class+";trans_num="+trans_num);
	if ( val.length == 0 ) return 0;
	if ( pwd_class > now_class || len > val.length ) return 4;
	
	if ( parseInt(len,10)+parseInt(pwd_class,10) < 10 ) 
	{
		add_num = 10-(parseInt(len,10)+parseInt(pwd_class,10));
		if ( trans_num < parseInt(pwd_class,10) ) add_num+=(parseInt(pwd_class,10)-trans_num);
	}
	var score = parseInt((val.length+trans_num+add_num)/2,10);
	
	return score;
}

function get_url_filename(flag)
{
        var NOWPATH;
	var pos=0;
	var ret=0;
	if ( Browser == "Firefox" ) 
		NOWPATH = document.location.href;
	else
        	NOWPATH = document.location.pathname.substring(1,document.location.pathname.length);
		
	if(flag == 1) 
	{
		// No file name 
		if (typeof parent.frames['content_area'].location.href != 'undefined') 
		{
			if ( parent.frames['content_area'].location.href.indexOf("change_password-asp.htm") != -1 )
				NOWPATH = "change_password-asp.htm";	
		}	
		if( ( NOWPATH.indexOf("change_password-asp.htm") != -1 ))
			ret = 1;
		
		if ( NOWPATH.indexOf("default-asp.htm") != -1 ) ret=0;
	}
	else //login.cg
	{
		if( NOWPATH.indexOf("default-asp.htm") != -1 ) 
			ret = 1;
	}

	return ret;
}

function keep_val(F,except){
	var form_len = F.length;
	var obj;
	var result="", skip=0;
	//parent.document.getElementById("right_form").value = F;
	for(var i=0; i<form_len; i++)
	{
		obj = F.elements[i];
		skip = 0 ;
		for(k=0; k<except.length; k++)
		{
			if ( obj.name == except[k] ) 
			{
				skip = 1;
				break;
			}
		}
		if ( skip == 1 ) continue;
		if ( obj.type == "text" || obj.type == "select-one" || obj.type == "radio" || 
                     obj.type =="checkbox" || obj.type == "hidden" || obj.type == "password" )  
		{
			if ( result != "" ) result += ",";
			if ( obj.type == "checkbox" ) 
			{
				if ( obj.name != "" && eval("F."+obj.name).checked ) result += "1";
				else result += "0";
			}
			else if ( obj.type == "radio" ) 
			{
				i += eval("F."+obj.name).length;
				for(j=0; j<eval("F."+obj.name).length; j++)
				{
					if ( eval("F."+obj.name)[j].checked )
					{
						result += eval("F."+obj.name)[j].value;
						break;
					}
				}
			}
			else
				result += obj.value;
		}
	}
	return result;
	
}

function transferunit(strNum)
{
	var args = new Array;
	for(var i=0; i<4; i++)
	{
		args[i] = arguments[i];
		args[i] = typeof(args[i])!='undefined'?args[i]:'';
	}
	var tmp = "";
	if ( parseInt(strNum,10) <= 999 ) return strNum;
	if ( parseInt(strNum,10) > 999 && parseInt(strNum,10) <= 999999 ){
		if ( args[1] == "byte" ) 
			tmp = formatNumByComma((parseInt(strNum,10)/1000).toFixed(2),lang)+" "+__T(unit.KB);
		else
			tmp = formatNumByComma((parseInt(strNum,10)/1000).toFixed(2),lang)+" "+__T(unit.onlyK);
	}else if ( parseInt(strNum,10) > 999999 && parseInt(strNum,10) <= 999999999 ){ 
		if ( args[1] == "byte" ) 
			tmp = formatNumByComma((parseInt(strNum,10)/1000000).toFixed(2),lang)+" "+__T(unit.MB);
		else
			tmp = formatNumByComma((parseInt(strNum,10)/1000000).toFixed(2),lang)+" "+__T(unit.onlyM);
	}else if ( parseInt(strNum,10) > 999999999 ){
		if ( args[1] == "byte" ) 
			tmp = formatNumByComma((parseInt(strNum,10)/1000000000).toFixed(2),lang)+" "+__T(unit.GB);
		else
			tmp = formatNumByComma((parseInt(strNum,10)/1000000000).toFixed(2),lang)+" "+__T(unit.onlyG);
	}
	return tmp;		
}

function formatNumByComma(strNum){
	if ( strNum.length <=3 ) return strNum;
	if ( !/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum) ){
		return strNUm; //Invalid format
	}
	var a = RegExp.$1, b=RegExp.$2, c=RegExp.$3;
	var re = new RegExp();
	re.compile("(\\d)(\\d{3})(,|$)");
	while(re.test(b))
	{
		if ( now_lang == "EN" ) 
			b = b.replace(re, "$1,$2$3");
		else
			b = b.replace(re, "$1.$2$3");
	}
	return a+""+b+""+c;
	
}

function bt(x,st)
{
        var obj = document.getElementById(x);
        if ( st == "move" )
        {
               obj.style.background="url('https://www.cisco.com/image/BT_Hover.jpg')";
               obj.style.border="1px solid #1fa0d5";
               obj.style.borderwidth="thick thin";
        }
	else if ( st == "out" )
	{
              obj.style.background="url('https://www.cisco.com/image/BT_Normal.jpg')";
              obj.style.border="1px solid #53636a";
              obj.style.borderwidth="thick thin";
        }
	else if ( st == "down" )
	{
               obj.style.background="url('https://www.cisco.com/image/BT_Press.jpg')";
               obj.style.border="1px solid #1fa0d5";
               obj.style.borderwidth="thick thin";
        }else if ( st == "disabled" ) 
	{
               obj.style.background="url('https://www.cisco.com/image/BT_Disabled.jpg')";
               obj.style.border="1px solid #8e8e8e";
               obj.style.borderwidth="thick thin";
	}
}

function chg_win_height(obj)
{
	top.document.body.style.overflow="hidden";
        top.document.getElementById(obj).style.height = top.document.body.clientHeight+"px";
        top.document.getElementById(obj).style.width = top.document.body.clientWidth+"px";
	top.document.body.style.overflow="auto";
}

function cy_speccode_encode(string) 
{
	string = string.toString();
	string = string.replace(/&/g,'&#38;');
	string = string.replace(/</g,'&#60;');
	string = string.replace(/>/g,'&#62;');
	string = string.replace(/"/g,'&#34;');
	string = string.replace(/'/g,'&#39;');
	string = string.replace(/:/g,'&semi;');
	string = string.replace(/ /g,'&nbsp;');
	string = string.replace(/@/g,'&copy;');
	return string;
}

function cy_speccode_decode(string) 
{
	string = string.toString();
	string = string.replace(/&#92;/g, '\\');
	string = string.replace(/&#39;/g, '\'');
	string = string.replace(/&#38;/g, '&');
	string = string.replace(/&#60;/g, '<');
	string = string.replace(/&lt;/g, '<');
	string = string.replace(/&#62;/g, '>');
	string = string.replace(/&gt;/g, '>');
	string = string.replace(/&#34;/g, '"');
	string = string.replace(/&semi;/g, ':');
	string = string.replace(/&nbsp;/g, ' ');
	string = string.replace(/&amp;/g, '&');
	string = string.replace(/&copy;/g, '@');
	return string;
} 

function string_break(len,src)
{
	var line = parseInt(src.length/len) ; 
	var i ,dst="" ; 
	if ( line == 0 ) return src;
	if ( parseInt(src%len) != 0 ) line ++ ; 
	for(i=0; i<line; i++)
	{
		dst = dst + src.substring(0,len)+"<BR>";
		src = src.substring(len,src.length);
	}
	return dst ; 
}

function alert_result(val)
{
	if ( val == 1 )
	{
		parent.document.getElementById("GUI_LOCK").value = 0;
	        parent.document.getElementById("rightframe").src = document.getElementById("newpage").value;
	}
	else
	{
		parent.document.getElementById("GUI_LOCK").value = 0;
	}
	
	parent.document.getElementById("div_alert").style.display="none";
	//if ( document.getElementById("c1") )
	//	choose_enable( document.getElementById("c1") ) ; 
	//if ( document.getElementById("c3") )
	//	choose_enable( document.getElementById("c3") ) ; 
}

function chg_layout(){//O -> obj_id, 1-> Firefox style, 2-> IE style
	var args = new Array;
	for(var i=0; i<10; i++)
	{
		args[i] = arguments[i];
		args[i] = typeof(args[i])!='undefined'?args[i]:'';
	}
	if ( document.getElementById("divcontent") ){
		if ( Browser == "IE" ) 
			document.getElementById("divcontent").className="content_layer";
		else 
			document.getElementById("divcontent").className="content_layer_f";
	}	
	// Add session key
	if ( close_session != "1" ) 
        {
        	if ( document.getElementById("frm") ) 
                {
                	document.getElementById("frm").action = goto_link(document.getElementById("frm").action);
                        //alert(document.getElementById("frm").action);
                }
        }
	var wps_ap_role = "proxy" ; 
	var wps_result='0';		
	if ( (wps_result == "3" || wps_result == "4") && wps_ap_role == "withReg" )
		get_position("Wireless_WPS-asp.htm");
}

function hideHint(obj_id){
        //document.getElementById("div_msg"+obj_id).innerHTML ="";
        document.getElementById("div"+obj_id).style.display="none";
}

function showHint(img_id,obj_id,e){
        if ( document.getElementById(img_id).style.display == "none" || 
             document.getElementById("div_msg"+obj_id).innerHTML == "" ) return;
       	var s = document.getElementById("div"+obj_id);
        var content_width = parseInt(top.document.body.clientWidth,10)-(15+5+170+15);
	var obj_pos=0;
	s.style.display="";
	
  if ( window.event )
  {
		obj_pos=content_width-e.x;
		s.style.pixelTop = e.y+document.body.scrollTop+15;
    s.style.top = e.pageY+15+"px";//
		if ( obj_pos < 0 ) 
		{
			s.style.pixelLeft = e.x+document.body.scrollLeft+obj_pos;
      s.style.left = e.pageX+obj_pos+"px";//
		}
    else
    {
			if ( obj_pos < 200 )
      {
				s.style.pixelLeft = e.x+document.body.scrollLeft-obj_pos;
        s.style.left = e.pageX-obj_pos+"px";//
      }
			else
      {
				s.style.pixelLeft = e.x+document.body.scrollLeft-15;
        s.style.left = e.pageX-15+"px";//
      }
		}
	}else{  // Firefox
		obj_pos = content_width-e.pageX;
    s.style.top = e.pageY+15+"px";
		if ( obj_pos < 0 ) 
			 s.style.left = e.pageX+obj_pos+"px";
		else{	
			if ( obj_pos < 200 ) 
		    s.style.left = e.pageX-obj_pos+"px";
			else
	      s.style.left = e.pageX-15+"px";
		}
	}
		
}

function del_row(obj_id,flg)
{
	// table message
	document.getElementById("tmsg").innerHTML = __T(msg.tablemsg); 
	document.getElementById("tmsg").style.display="";
	// disabled the add and edit button
	choose_disable(document.getElementById("t2"));
	choose_disable(document.getElementById("t3"));

//	if ( flg == 1 ) 
//		document.getElementById("tr_table"+obj_id).className= "TABLECONTENT_DEL_1";
//	else
		document.getElementById("tr_table"+obj_id).className= "TABLECONTENT_DEL";
}

function edit_row(namelist,objlist,obj_id)
{
	if ( document.getElementById("tmsg") ) 
	{
		document.getElementById("tmsg").innerHTML = __T(msg.tablemsg); 
		document.getElementById("tmsg").style.display="";
	}
	// disable add and del button
	choose_disable(document.getElementById("t2"));
	choose_disable(document.getElementById("t4"));

	for(var i=0; i<namelist.length; i++)
	{
		if ( typeof objlist[i] == 'undefined') continue;
		document.getElementById(namelist[i]+obj_id).innerHTML = "";
		document.getElementById(namelist[i]+obj_id).innerHTML = objlist[i];	
	}
	
}

function add_row(index,list,chk_obj,action_st,start_idx){
	// Grayout Edit and Delete
	choose_enable(document.getElementById("t2"));
	choose_disable(document.getElementById("t3"));
	choose_disable(document.getElementById("t4"));
	//table message
	if ( action_st.substring(0,3) == "add" ) 
	{
		if ( action_st.substring(0,3) == "add" && action_st != "add" ) 
		{
			var tmp = action_st.substring(3,action_st.length);
			document.getElementById("tmsg"+tmp).innerHTML = __T(msg.tablemsg);
			document.getElementById("tmsg"+tmp).style.display="";
		}else{
			document.getElementById("tmsg").innerHTML = __T(msg.tablemsg);
			document.getElementById("tmsg").style.display="";
		}
		//disable all checked
		if ( action_st.substring(0,3) == "add" )
		{
			for(var i=0; i<index; i++){
				if ( document.getElementById(chk_obj+i) ) 
					choose_disable(document.getElementById(chk_obj+i));
			}	
		}
	}
	//add the new data row
	var insert_idx=0;
        if ( typeof start_idx != "undefined" )
                insert_idx = start_idx+index;
        else
                insert_idx = index;
	var tmp="";
	if ( action_st == "show" )
	{
		document.getElementById("_nodata"+chk_obj).style.display="none";
        	var Tr = document.getElementById("_table"+chk_obj).insertRow(insert_idx);
	}else{
		if ( action_st.substring(0,3) == "add" && action_st != "add" ) 
		{
			tmp = action_st.substring(3,action_st.length);
			document.getElementById("_nodata"+tmp).style.display="none";
        		var Tr = document.getElementById("_table"+tmp).insertRow(insert_idx);
					
		}else if ( action_st.substring(0,4) == "init" && action_st != "init" ){ 
			tmp = action_st.substring(4,action_st.length);
			document.getElementById("_nodata"+tmp).style.display="none";
        		var Tr = document.getElementById("_table"+tmp).insertRow(insert_idx);
		}else{
			document.getElementById("_nodata").style.display="none";
        		var Tr = document.getElementById("_table").insertRow(insert_idx);
		}
	}
	if ( (action_st.substring(0,3) == "add" && action_st != "add") ||
             (action_st.substring(0,4) == "init" && action_st != "init"))
		Tr.setAttribute("id","tr_table"+tmp+"_"+index);
	else
		Tr.setAttribute("id","tr_table"+index);
	if (index%2 == 0){
                Tr.setAttribute("class", "TABLECONTENT_S");
                Tr.setAttribute("className", "TABLECONTENT_S");
        }else{
                Tr.setAttribute("class", "TABLECONTENT_D");
                Tr.setAttribute("className", "TABLECONTENT_D");
        }
	
	for(var i=0; i<list.length; i++)
	{
		td=Tr.insertCell(Tr.cells.length);
		td.setAttribute("id",list[i][0]);
		if ( list[i][2] == 1 ){      // align left
        	        td.setAttribute("class","TABLECONTENT_TD_1");
                        td.setAttribute("className","TABLECONTENT_TD_1");
	        }else if ( list[i][2] == 2 ){ //align right
        	        td.setAttribute("class","TABLECONTENT_TD_VM");
                        td.setAttribute("className","TABLECONTENT_TD_VM");
		}else if ( list[i][2] == 3 ){ //align Center
        	        td.setAttribute("class","TABLECONTENT_TD_MID");
                        td.setAttribute("className","TABLECONTENT_TD_MID");
		}else if ( list[i][2] == 4 ){ //align left and allow wrap
        	        td.setAttribute("class","TABLECONTENT_TD_WRAP");
                        td.setAttribute("className","TABLECONTENT_TD_WRAP");
	        }else{ // align left
        	        td.setAttribute("class","TABLECONTENT_TD");
                        td.setAttribute("className","TABLECONTENT_TD");
		}
		td.innerHTML = list[i][1];
	}
	
}

function recovery_row(obj_list,data_list,index){
	if ( obj_list.length == 0 || data_list.length == 0 ) return;
	for(var i=0; i<obj_list.length; i++){
		if ( document.getElementById(obj_list[i]+index) )
		{
			document.getElementById(obj_list[i]+index).innerHTML = data_list[i];
		}
	}
}

function to_check(){
	var args = new Array;
        for(var i=0; i<10; i++)
        {
                args[i] = arguments[i];
                args[i] = typeof(args[i])!='undefined'?args[i]:'';
        }
	var obj_name = args[0];
	var chk_st = args[1];
	var id = args[2];
	var count = args[3];
	var action_st = args[4];
	var extra_id="";
	if ( action_st.substring(0,3) == "add" || action_st.substring(0,4) == "init" ) chk_checked_item(count,obj_name);
	if ( action_st.indexOf("add") != -1 || action_st.indexOf("del") != -1) 
		extra_id= action_st.substring(3,action_st.length)+"_";
	if ( action_st.indexOf("init") != -1 || action_st.indexOf("edit") != -1 ) 
		extra_id = action_st.substring(4,action_st.length)+"_";
	if ( extra_id == "_" ) extra_id = "";
	if ( chk_st == true )
		document.getElementById("tr_table"+extra_id+id).className = "TABLECONTENT_SEL";
	else{
		if ( parseInt(id,10)%2 ) 
			document.getElementById("tr_table"+extra_id+id).className = "TABLECONTENT_D";
		else
			document.getElementById("tr_table"+extra_id+id).className = "TABLECONTENT_S";
		if ( action_st.substring(0,4) == "edit" || action_st.substring(0,3) == "del" ) recovery_row(args[5],args[6],id);
	}
}

function getPath(obj)
{
        if ( obj ) 
        {
		var path = obj.value;
		var x = path.lastIndexOf('\\');
		if ( x>=0 ) /// windows-based path
			return path.substr(x+1);
		x = path.lastIndexOf('https://www.cisco.com/');
		if ( x>=0 ) //Unix-based path
			return path.substr(x+1);
		return path;
        }
}

function trans_16to2(val)
{
	var str="",tmpstr="";
	var tmp="";
       if ( typeof val == "undefined" ) return str;
	var cnt=0, tmplen=val.length;
	if ( val == "0" )
	{
		for(var i=0; i<16; i++)
			str+="0";		
		return str;
	}
	for(var j=0; j<4-tmplen; j++)
		val="0"+val;
   	for(var i=0; i<val.length; i++)
	{
		tmp = val.charAt(i).toUpperCase();
		if ( tmp == 'F' ) tmp=15;
		else if ( tmp == 'E' ) tmp=14;
		else if ( tmp == 'D' ) tmp=13;
		else if ( tmp == 'C' ) tmp=12;
		else if ( tmp == 'B' ) tmp=11;
		else if ( tmp == 'A' ) tmp=10;
		cnt=0;
		tmpstr="";
		if ( parseInt(tmp,10) > 1 ) 
		{
			while(1)
			{
				if ( tmp > 1 ) 
				{
					if ( parseInt(tmp/2,10) > 0 )tmpstr=(tmp%2)+tmpstr;
					else tmpstr=parseInt(tmp/2,10)+tmpstr;	
					tmp=parseInt(tmp/2,10);
				}
				else
				{
					tmpstr=tmp+tmpstr;	
					tmp=0;
				}
				cnt++;
				if ( cnt == 4 ){
				 	break;
				}
			}
			str+=tmpstr;
			for(var j=0; j<4-cnt; j++) str+="0";
		}else
		{
			for(var j=0; j<3; j++) str+="0";
			str+=tmp;
		}
	}
	return str;
}

function trans_2to16(val)
{
	var total = parseInt(val.charAt(3),10)+
		    parseInt(val.charAt(2),10)*2+
		    parseInt(val.charAt(1),10)*4+
		    parseInt(val.charAt(0),10)*8;
	if ( total == 15 ) return "F";
	else if ( total == 14 ) return "E";
	else if ( total == 13 ) return "D";
	else if ( total == 12 ) return "C";
	else if ( total == 11 ) return "B";
	else if ( total == 10 ) return "A";
	else return total;	
	
}

function trans_time_format(H,M,T)
{
        var tmp_hour, tmp_min;
	var tmpval=0, tmp_T=0;
        if ( T == "pm" )
		tmp_T=12;
	else if( T == "am" ) 
		tmp_T=0;
        if ( parseInt(H,10) == 12 )
        	tmp_hour = tmp_T;
        else
                tmp_hour = parseInt(H,10)+tmp_T;
	if ( tmp_T.length < 2 ) tmp_T = "0"+tmp_T;
        if ( parseInt(M,10) < 10 )
                tmp_min = "0"+M;
        else
                tmp_min = M;
        return tmp_hour+":"+tmp_min;
}

/*
enum {
	RANGE_ERR = 1,
	SPACE_ERR,
	FORMAT_ERR,
	HEADER_ERR,
	TYPE_ERR,
	REPEAT_ERR
};*/
/* flg = 0, "Configuration settings have been saved successfully"
 * flg = 1, "Upgrade Fail"
 * flg = 2, "Invalid language file." 
 * flg = 3, "The firmware version is up to date" 
 * flg = 4, "The firmware is invalid"
 * flg = 5, "Download firmware fail. Please try it again later"
 * flg = 6, "USB flash drive is not found"
 * flg = 7, "Store file fail"
 * flg = 8, "Store file success"
 * */

function get_result_msg(filename,flg)
{
	
	if ( flg == 0 )
		return __T(msg.configsuccess);
	else if (flg == 6 )
		return __T(usbupgrade.nousb);
	else if (flg == 7 )
		return __T(usbupgrade.savefail);
	else if (flg == 8 )
		return __T(usbupgrade.savesuccess);
	else{
		/*
		if ( typeof(args[2])!='undefined' )
		{
			if ( 
		}else{ */
			if ( filename == "upgrade-asp.htm" ) 
			{
				if ( flg == 1 ) 
					return __T(msg.invalidfw);
				else if ( flg == 2 ) 
					return __T(msg.invalidlang);
				else if ( flg == 3)
					return __T(bsd.fw_st_same);
				else if ( flg == 4)
					return __T(bsd.fw_st_invalid);
				else if ( flg == 5)
					return __T(bsd.fw_st_nofw);

			}
			//else if ( filename == "vpn_client-asp.htm" || filename == "backup-asp.htm" ) 
			else if ( filename == "vpn_client-asp.htm") 
				return __T(msg.invalidcfg);
			else if( filename == "backup-asp.htm")
			{	
				if (flg == 1)
					return __T(msg.invalidcfg);
				else if(flg == 2)
					return __T(mang.seederror);
				else if(flg == 3)
					return __T(mang.filechange);
			}
			else if ( filename == "man_cerificate-asp.htm" ) 
				return __T(msg.invalidcert);
			else if ( filename == "users-asp.htm" ) 
				return __T(msg.invaliduser);
			else if ( filename == "Wireless_welcome_edit-asp.htm" ) 
				return __T(msg.invalidimage);
			else if ( filename == "authap-asp.htm" && flg == 1 ) 
				return spell_words(max_rule,AUTHAP_ENTRY,__T(wl.authaps));
			else
				return __T(msg.configfail);
		//}

	}
}

function cal_submask(F,obj_id,ret_obj_id,option)
{
	var ipaddr;
	var sub_ip;
	var ipval = document.getElementById(obj_id).value;

	if( parseInt(option,10) != 4) return;
	ipaddr = ipval.split(/\./);

	if((ipaddr[0] >= 1) && (ipaddr[0] <= 127))
		sub_ip = "255.0.0.0";
	else if((ipaddr[0] >= 128) && (ipaddr[0] <= 191))
		sub_ip = "255.255.0.0";
	else 
		sub_ip = "255.255.255.0";

	document.getElementById(ret_obj_id).value = sub_ip;
}

function get_extra_help(nowhelp)
{
	nowhelp+="-asp.htm";
	//alert("now_page="+parent.document.getElementById("now_page").value);
	for(var i=0; i<MHELP.length; i++)
	{
		if ( MHELP[i][0] != parent.document.getElementById("now_page").value) continue;
		if ( MHELP[i][1] == nowhelp ) 
		{
			parent.document.getElementById("now_help").value = MHELP[i][2];
			//alert("now_help="+parent.document.getElementById("now_help").value);
			break;
		}
	}
}
// OBJ BEHAVIOR FUNCTION END  ======================================================================================
//
// DRAW OBJ  FUNCTION START  =======================================================================================
/*
ARG0 = OUTPUT TYPE
ARG1 = CALL TYPE
AGR2 = CSS ATTRIB
ARG3 = NAME1
ARG4 = NAME2
....
*/
function draw_td(){
	var args = new Array;
	for(var i=0; i<15; i++)
	{
		args[i] = arguments[i];
		args[i] = typeof(args[i])!='undefined'?args[i]:'';
	}
	var FUNNAME= parseInt(args[1],10);
	var out_type = parseInt(args[0],10);
	var td_code = "";
	if ( FUNNAME == FUNTITLE ) 
	{
		 td_code = "<TD class=FUNTITLE "+args[3]+">"+args[2]+"</TD>";
	}
    	else if ( FUNNAME == SUBTITLE){
      		 td_code = "<TD class=SUBTITLE "+args[3]+">"+args[2]+"</TD><TD class=SUBITEM_SHIFT "+args[4]+">";
	}
    	else if ( FUNNAME == SUBTITLE_NOSHIFT){
      		 td_code = "<TD class=SUBTITLE "+args[3]+">"+args[2]+"</TD><TD class=SUBITEM "+args[4]+">";
	}
    	else if ( FUNNAME == SUBTITLE_M ){
                 td_code = "<TD class=SUBTITLE_M "+args[2]+">";
	}
    	else if ( FUNNAME == SUBTITLE_MSG ){
                 td_code = "<TD class=SUBTITLE_MSG "+args[2]+">";
	}
	else if ( FUNNAME == ISHR ){
		 td_code = "<TD class=HRTD "+args[2]+"><HR size=1 class=ISHR></TD>";
	}
    	else if ( FUNNAME == TABLETD_SINGLE_LINE ) 
	{
                        td_code="<TD class=TABLECONTENT "+args[3]+">";
			td_code += args[2]+"</TD>";
    	}else if ( FUNNAME == TABLETD_SINGLE_LINE_R ) 
	{
                        td_code="<TD class=TABLECONTENT_RIGHT "+args[3]+">";
			td_code += args[2]+"</TD>";
    	}else if ( FUNNAME == TABLETD_SINGLE_LINE_C ) 
	{
                        td_code="<TD class=TABLECONTENT_CENTER "+args[3]+">";
			td_code += args[2]+"</TD>";
	}else if ( FUNNAME == TABLETD_SINGLE_LINE_FIRST )
        {
                        td_code="<TD class=TABLECONTENT_FIRST "+args[3]+">";
                        td_code += args[2]+"</TD>";
	}else if ( FUNNAME == TABLETD_SINGLE_LINE_FIRST_R )
        {
                        td_code="<TD class=TABLECONTENT_FIRST_RIGHT "+args[3]+">";
                        td_code += args[2]+"</TD>";
	}else if ( FUNNAME == TABLETD_SINGLE_LINE_FIRST_C )
        {
                        td_code="<TD class=TABLECONTENT_FIRST_CENTER "+args[3]+">";
                        td_code += args[2]+"</TD>";
        }
    	else if ( FUNNAME == TABLETD_TAIL )
	{
    		td_code="<TD class=TABLECONTENT_TAIL "+args[2]+">";
    		td_code+=args[3]+"</TD>";
    	}else if ( FUNNAME == TABLETD_TAIL_R )
	{
    		td_code="<TD class=TABLECONTENT_TAIL_RIGHT "+args[2]+">";
    		td_code+=args[3]+"</TD>";
    	}else if ( FUNNAME == TABLETD_TAIL_C )
	{
    		td_code="<TD class=TABLECONTENT_TAIL_CENTER "+args[2]+">";
    		td_code+=args[3]+"</TD>";
	}else if ( FUNNAME == MAINFUN ) 
	{
		td_code="<TD class=CONTENT_TITLE "+args[3]+">"+args[2]+"</TD><TR><TD colspan=2 id=page_msg_td style=display:none><TABLE><TR><TD><img id=msg_icon style='padding-bottom:15px;'></TD><TD id=msg_label class=PAGE_LEVEL>Success status message here</TD></TR></TABLE></TD><TR>";
	}
	else if ( FUNNAME == ICONLINE ){
		
		td_code ="<div id=div"+args[4]+" class=errhint style=display:none><TABLE><TR><TD id=div_msg"+args[4]+" style='font-size:10px;font-family:Arial;font-weight: bolder;color:#000000;background-color:#ffffff;'></TD></TR></TABLE></div><TABLE "+args[6]+"><TR><TD><img id="+args[2]+" src=image/AlertCritical16Wht.gif style=display:none></TD><TD "+args[5]+">"+args[3]+"</TD></TR></TABLE></div>";
	}else if ( FUNNAME == CREATE_EDIT_TABLE ){
		var tmp = args[2].split(",");
		var field_count = tmp.length;
		var row_span = "";
		if ( typeof args[12] != "undefined" ) 
			row_span = args[12].split(",");
		var col_span = "";
		if ( typeof args[13] != "undefined" ) 
			col_span = args[13].split(",");
		var tmp_width=0;
		td_code+="<SPAN class=TABLE_MSG id=tmsg"+args[8]+" style=display:none></SPAN>";
		td_code +="<TABLE class=TABLELIST id=_table"+args[8]+" cellspacing=0 width=100% cellspacing=0 cellpadding=0>";
		for(var i=0; i<tmp.length; i++)
		{
			td_code+="<col width='"+tmp[i]+"%'>";
			tmp_width+=parseInt(tmp[i],10);
		}
		if ( tmp_width < 100 )
		{ 
			td_code+="<col width='"+(100-tmp_width)+"%'>";
			field_count++;
		}
		td_code+="<TR><TD colspan="+field_count;
		if ( args[10] != "" && typeof args[10] != 'undefined') 
			td_code+="><table width=100% cellspacing=0><TR><TD colspan="+parseInt(parseInt(field_count,10)-1,10)+" class=TABLETITLE>"+args[3]+"</TD><TD class=TABLETITLE_OPT><I>"+args[10]+"</I></TD></TR></table></TD></TR>";
		else
			td_code+=" class=TABLETITLE>"+args[3]+"</TD></TR>";
				
		if ( args[7] != "" && typeof args[7] != 'undefined') 
			td_code+="<TR><TD colspan="+field_count+" class=TABLEOPTION>"+args[7]+"</TD></TR>";
		td_code+="<TR>";
		var tmp_title = args[4].split(",");
		if (typeof row_span[1] != "undefined" && row_span.length > 0 ) 
			var titlelen = row_span.length+1;
		else
			var titlelen = tmp_title.length;
		var tmp_align = "";
		if ( args[9] != "" && typeof args[9] != 'undefined') 
			tmp_align = args[9].split(",");
		for(var i=0; i<titlelen; i++)
		{
			var rs="";
			if (typeof row_span[i] != "undefined" )
			{
				if ( row_span[i] != "") 
					rs = "rowspan=2";
			}
			if (typeof col_span[i] != "undefined" )
			{
				if ( col_span[i] != 0 ) 
					rs = "colspan=2";
			}
			if ( i == 0 )
			{ 
				if ( tmp_align != "" && tmp_align[i] != 0) 
				{
					
					if ( tmp_align[i] == 1 ) 
						td_code+=draw_td(O_VAR,TABLETD_SINGLE_LINE_FIRST_R,tmp_title[i],rs);	 				       	      else if ( tmp_align[i] == 2 ) 
						td_code+=draw_td(O_VAR,TABLETD_SINGLE_LINE_FIRST_C,tmp_title[i],rs)
						
				}else
					td_code+=draw_td(O_VAR,TABLETD_SINGLE_LINE_FIRST,tmp_title[i],rs);	
				
			}
                        else 
			{
				if ( tmp_align != "" && tmp_align[i] != 0) 
				{
					if ( tmp_align[i] == 1 ) 
					{
						if ( i == parseInt(field_count,10)-1 ) //LAST FIELD
                					td_code+=draw_td(O_VAR,TABLETD_TAIL_R,"",tmp_title[i],rs);
						else
							td_code+=draw_td(O_VAR,TABLETD_SINGLE_LINE_R,tmp_title[i],rs);
					}
					else if ( tmp_align[i] == 2 ) 
					{
						if ( i == parseInt(field_count,10)-1 ) //LAST FIELD
                					td_code+=draw_td(O_VAR,TABLETD_TAIL_C,"",tmp_title[i],rs);
						else
							td_code+=draw_td(O_VAR,TABLETD_SINGLE_LINE_C,tmp_title[i],rs);
					}
				}else{
					if ( i == parseInt(field_count,10)-1 ) //LAST FIELD
                				td_code+=draw_td(O_VAR,TABLETD_TAIL,"",tmp_title[i],rs);
					else
						td_code+=draw_td(O_VAR,TABLETD_SINGLE_LINE,tmp_title[i],rs);
				}
			}
		}
		if ( tmp_width < 100 )
                	td_code+=draw_td(O_VAR,TABLETD_TAIL,"","&nbsp;");
		td_code+="</TR>";
		if (typeof row_span[1] != "undefined" && row_span.length > 0 ) 
		{
			td_code+="<TR>";
			for(var i=0; i<field_count-row_span.length; i++)
			{
                		  td_code+=draw_td(O_VAR,TABLETD_TAIL_C,"",tmp_title[titlelen+i]);
			}
			td_code+="</TR>";
		}
		td_code+="<TR id=_nodata"+args[8]+" class=TABLECONTENT_S>";
		td_code+="<TD class=TABLECONTENT_TD colspan="+field_count+">";
		if ( ( args[5] != "" && typeof args[5] != 'undefined') || ( args[6] != "" && typeof args[6] != 'undefined')) 
			td_code+="<input type=checkbox id=hidden_chkbox disabled>&nbsp;&nbsp;";
		td_code+=__T(msg.nodata)+"</TD></TR>";
		if ( args[5] != "" && typeof args[5] != 'undefined'){
			td_code+="<tr><td colspan="+field_count;
			if ( args[11] != "" && typeof args[11] != 'undefined')
				td_code+="><TABLE cellspacing=0 width=100%><tr><td colspan="+parseInt(parseInt(field_count,10)-1,10)+" class=TABLECONTENT_CMD_TAIL>";
			else
				td_code+=" class=TABLECONTENT_CMD_TAIL>";
			tmp = args[5].split(",");
			for(var i=0; i<tmp.length; i++)
			{
				if ( tmp[i] == "add" )
					td_code+=draw_object(O_VAR,BT,__T(share.addrow),"t2","BT","to_add()");
				else if ( tmp[i] == "edit" )
					td_code+=draw_object(O_VAR,BT,__T(share.edit),"t3","BT","to_edit()");
				else if ( tmp[i] == "del" )
					td_code+=draw_object(O_VAR,BT,__T(share.del),"t4","BT","to_del()");
			}
			if ( args[11] != "" && typeof args[11] != 'undefined')
				td_code+="</TD><TD class=TABLECONTENT_CMD_TAIL_RIGHT align=right>"+args[11]+"</TD></TR></table>";
		}
		if ( args[6] != "" && typeof args[6] != 'undefined') 
		{
			td_code+="<tr><td colspan="+field_count;
			if ( args[11] != "" && typeof args[11] != 'undefined')
				td_code+="><table cellspacing=0 width=100%><tr><td colspan="+parseInt(parseInt(field_count,10)-1,10)+" class=TABLECONTENT_CMD_TAIL>";
			else
				td_code+=" class=TABLECONTENT_CMD_TAIL>";
			for(var i=0; i<args[6].length; i++)
			{
				if ( args[6][i][0] && args[6][i][0].indexOf("BT")!= -1 ) 
				td_code+=draw_object(O_VAR,BT,args[6][i][2],args[6][i][1],args[6][i][0],args[6][i][3]);
				else
				td_code+=args[6][i];
			}
			if ( args[11] != "" && typeof args[11] != 'undefined')
				td_code+="</TD><TD class=TABLECONTENT_CMD_TAIL_RIGHT align=right>"+args[11]+"</TD></TR></table>";
		}
		td_code+="</TD></TR></TABLE>";	
		
	}else if ( FUNNAME == PWDLINE ){
		td_code="<TABLE id=pwdtb"+args[2]+" style='border:1px solid #8499a2;display:none' cellspacing=1><TBODY>"
		td_code+="</TBODY></TABLE><TD id=msg_pwd"+args[2]+" style='font-size:10px'></TD>"
	}
	if ( out_type == O_GUI ) document.write(td_code);
	else return td_code;
}

//ARG0=TYPE
//ARG1-NAME
//ARG2=DEFAULT VAL
var IP=1;
var SELBOX=2;
var RADIO=3;
var BT=4;
var TABLE_BT=5;
function draw_object()
{
	var args = new Array;
	var _val=new Array;
	var selflg="";
	for(var i=0; i<10; i++)
	{
		args[i] = arguments[i];
		args[i] = typeof(args[i])!='undefined'?args[i]:'';
	}
	if ( args[0] == "" ) return;
	var out_type = parseInt(args[0],10);
	var FUNNAME=parseInt(args[1],10);
	var tmp="";
	if ( FUNNAME == IP ) 
	{
		if ( args[3] != "" )
			_val = args[3].split(".");
		for(var j=0; j<4; j++)
		{
			if ( j!=0 && j!=j-1) tmp+=".";
			if ( typeof _val[j] == "undefined" ) _val[j] = "";
			tmp += "<input size=3 maxlength=3 id='"+args[2]+"_"+j+"' name='"+args[2]+"_"+j+"' value='"+_val[j]+"' "+args[4]+" onblur=update_val(this.name)>";
		}
	}else if ( FUNNAME == SELBOX ){
		tmp = "<select name="+args[2]+" id="+args[2]+" "+args[3]+">";
		var len = 0 ;
		var startj=0;
		var interval=1;
		var dis_len=0;
		var obj_len=0;
		var show_name="", show_val="";
		if ( args[4][0] == "ISRANGE" ) 
		{
			len = args[4][2];
			startj=args[4][1];
			len=parseInt(len,10)+1;
			interval=args[4][3];
			if ( args[4][4] != "" ) dis_len = parseInt(args[4][4]);
		}
		else len = args[4].length;
		for(var j=startj; j<len; j=parseInt(j,10)+parseInt(interval,10))
		{
			selflg = "";
			if ( args[4][0] == "ISRANGE" )
				show_name = j ;
			else
				show_name = args[4][j];
			if ( args[5][0] == "ISRANGE" )
				show_val = j;
			else
				show_val = args[5][j];
			if ( show_val == args[6] ) selflg = "selected";
			if ( dis_len > 1  && args[4][0] == "ISRANGE" )
			{
				if ( j < 10 ) 
					show_name = "0" + show_name;
			}
			tmp += "<option value='"+show_val+"' "+selflg+">"+show_name+"</option>";
		}
		tmp += "</select>";
	}else if ( FUNNAME == RADIO){
		for(var j=0; j<args[4].length; j++)
		{
			selflg = "";
			if ( args[5] == args[3][j] ) selflg = "checked"
			tmp += "<input type=radio name='"+args[2]+"' value='"+args[3][j]+"' "+selflg+" "+args[6]+">"+args[4][j];
		}
	}else if ( FUNNAME == BT ){
		if ( args[2] == __T(share.save) && args[4]=="" )
		{
			if ( args[2].length > 11 ) args[4] = "BT_AUTO";
			else args[4] = "BT"; 
			tmp = "<input type=button class='"+args[4]+"' onclick=uiDoSave(this.form) value="+__T(share.save)+" id="+args[3]+" onMouseover=\"this.className='"+args[4]+"_Hover'\" onMouseout=\"this.className='"+args[4]+"'\" onMousedown=\"this.className='"+args[4]+"_Press'\">";
		}
		else if ( args[2] == __T(share.cancel) && args[4]=="" )  
		{
			if ( args[2].length > 11 ) args[4] = "BT_AUTO";
			else args[4] = "BT"; 
			tmp = "<input type=button class='"+args[4]+"' onclick=uiDoCancel(this.form) value="+__T(share.cancel)+" id="+args[3]+" onMouseover=\"this.className='"+args[4]+"_Hover'\" onMouseout=\"this.className='"+args[4]+"'\" onMousedown=\"this.className='"+args[4]+"_Press'\">";
		}else{
			if ( args[2].length > 23 ) args[4] = "BT_AUTO";
			if ( args[4] == "BT" && args[2].length > 11 ) args[4] = "BT_AUTO";
			tmp = "<input type=button class="+args[4]+" onclick='"+args[5]+"' value=\""+args[2]+"\" id="+args[3]+" onMouseover=\"this.className='"+args[4]+"_Hover'\" onMouseout=\"this.className='"+args[4]+"'\" onMousedown=\"this.className='"+args[4]+"_Press'\">";
			
		}
	}else if ( FUNNAME == TABLE_BT ){
		tmp = "<TABLE><TR><TD>";
		tmp += "<img id="+args[2]+" src=image/show.gif onMouseover=\"table_bt_over('"+args[4]+"','"+args[2]+"','"+args[5]+"')\" onMouseOut=\"table_bt_out('"+args[4]+"','"+args[2]+"','"+args[5]+"')\" onClick="+args[3]+">";
		tmp += "</TD><TD class=FUNTITLE><span id="+args[4]+">"+args[5]+"</span></TD></TR></TABLE>";
	}
	if ( out_type == O_GUI ) document.write(tmp);
	else return tmp;
	
}

function my_alert(){
	var args = new Array;
        for(var i=0; i<10; i++)
        {
                args[i] = arguments[i];
                args[i] = typeof(args[i])!='undefined'?args[i]:'';
        }
	var output = args[0];
	if ( output == O_MSG )
	{
		alert(args[1]);
		return;
	}else if( output == O_GUI ){
		parent.document.getElementById("GUI_LOCK").value = 1;
		parent.document.getElementById("alert_type").value = "";
		parent.document.getElementById("alert_title").innerHTML = "";
		parent.document.getElementById("alert_content").innerHTML = "";
		parent.document.getElementById("alert_type").value = args[1];
		parent.document.getElementById("alert_title").innerHTML = args[2];
		parent.document.getElementById("alert_content").innerHTML = args[3];
		parent.document.getElementById("div_alert").style.display="";
		if ( args[1] == WARNING ) 
		{
			var okbt = __T(share.sok);
			var cabt = __T(share.cancel);
			var okstyle = "BT";
			var castyle = "BT";
			if ( args[7] != "" && args[7] == "yesno" ) 
			{
				okbt = __T(filter.yes);
				cabt = __T(filter.no);
				okstyle = "BT_S";
				castyle = "BT_S";
			}
			//added by yu in 2013.04.25
			if ( args[7] != "" && args[7] == "bsd" ) 
			{
				okbt = __T("Upgrade Now");
				okstyle = "BT_L";
				castyle = "BT";
			}

			parent.document.getElementById("alert_logo").src=WARN_ICON_PATH;
			if ( args[6] != "" && args[6] == "wizard" ) 
			{
				parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,okbt,"a1",okstyle,"parent.document.getElementById(\"wizard\").contentWindow."+args[4]) + draw_object(O_VAR,BT,cabt,"a2",castyle,"parent.document.getElementById(\"wizard\").contentWindow."+args[5]);
			}
			else{
				if(args[7] != "" && args[7] == "bsd" ){
					parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,okbt,"a1",okstyle,""+args[4]) + draw_object(O_VAR,BT,cabt,"a2",castyle,""+args[5]);
	                                parent.document.getElementById("close_icon").innerHTML="<img src=image/AlertCritical16Wht.gif align=right valign=top onclick='javascript:"+args[5]+"'>";
				}
				else 
				{
					parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,okbt,"a1",okstyle,"parent.content_area."+args[4]) + draw_object(O_VAR,BT,cabt,"a2",castyle,"parent.content_area."+args[5]);
                	                parent.document.getElementById("close_icon").innerHTML="<img src=image/AlertCritical16Wht.gif align=right valign=top onclick='javascript:parent.content_area."+args[5]+"'>";
				}
			}
		}	
		else if ( args[1] == ERROR ) 
		{
			parent.document.getElementById("alert_logo").src=ERROR_ICON_PATH;
			parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,__T(share.sok),"a1","BT_S","alert_result(0)");
		}
		else
		{
			parent.document.getElementById("alert_logo").src=INFO_ICON_PATH;
			if ( args[4] != "" )
			{
				if ( args[5] != "" && args[5] == "wizard" )
				{
					parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,__T(share.sok),"a1","BT_S","parent.document.getElementById(\"wizard\").contentWindow."+args[4]);
				}
                                else if ( args[5] != "" && args[5] == "bsd" )
                                {
                                        parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,__T(share.sok),"a1","BT_S",args[4]);
                                        parent.document.getElementById("close_icon").innerHTML="<img src=image/AlertCritical16Wht.gif align=right valign=top onclick='javascript:"+args[4]+"'>";
                                }
				else{
					parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,__T(share.sok),"a1","BT_S","parent.content_area."+args[4]);
					parent.document.getElementById("close_icon").innerHTML="<img src=image/AlertCritical16Wht.gif align=right valign=top onclick='javascript:parent.content_area."+args[4]+"'>";
				}
			}else
			 	parent.document.getElementById("alert_bt").innerHTML= draw_object(O_VAR,BT,__T(share.sok),"a1","BT_S","alert_result(0)");
			        parent.document.getElementById("close_icon").innerHTML="<img src=image/AlertCritical16Wht.gif align=right valign=top onclick='javascript:alert_result(0)'>";
		}
	}else if ( output == O_VAR ){
			var obj = parent.document.getElementById("rightframe").contentWindow;
			obj.document.getElementById(args[4]).className = "ERRMSG";
			if ( args[2] != "")
			{
				if ( args[5] != "" && args[5] != 0 ) 
					obj.document.getElementById(args[4]).innerHTML = "<img src=image/iconDownArrowRed.gif style='padding-right:5px'>"+args[2];
				else
					obj.document.getElementById(args[4]).innerHTML = "<img src=image/ContextMessageArrow_LeftT.gif style='padding-right:5px;height:16px'>"+args[2];
			}
			if ( args[3] != "" && args[3] != 0 ) 
			{
				for(var k=0; k<args[3]; k++)
					obj.document.getElementById(args[1]+"_"+k).style.backgroundColor="#FFFF99";
			}
			else
				obj.document.getElementById(args[1]).style.backgroundColor="#FFFF99";
	}else if ( output == O_PAGE ){
			var obj = parent.document.getElementById("rightframe").contentWindow;
			var img_src = "";
			if ( args[1] == WARNING ) img_src = WARN_ICON_PATH;
			else if ( args[1] == ERROR ) img_src = ERROR_ICON_PATH;
			else if ( args[1] == INFO ) img_src = INFO_ICON_PATH;
			else if ( args[1] == SUCCESS ) 
			{
			//	parent.document.getElementById("save_bg").style.display="";
				img_src = PASS_ICON_PATH;
			}
			if ( obj.document.getElementById("msg_icon"))
			{
				obj.document.getElementById("msg_icon").src = img_src;
				obj.document.getElementById("msg_label").innerHTML = args[2];	
				obj.document.getElementById("page_msg_td").style.display="";
			}
			if ( args[3] != "")
				obj.document.getElementById(args[3]).style.backgroundColor="#FFFF99";
	}
}

function chk_checked_item(count,obj_name){
        for(var i=0; i<count; i++){
                if ( document.getElementById(obj_name+i).checked == true )
                {
                        choose_disable(document.getElementById("t2"));
                        choose_enable(document.getElementById("t3"));
                        choose_enable(document.getElementById("t4"));
                        return true;
                }
        }
        choose_enable(document.getElementById("t2"));
        choose_disable(document.getElementById("t3"));
        choose_disable(document.getElementById("t4"));
        return false;
}


// DRAW OBJ  FUNCTION END  =========================================================================================
// VALID CHECK FUNCTION START ======================================================================================
function valid_hostname(val)
{
	if ((val.length < 1) || (val.length > 63)) 
		return __T(msg.validname);
		
        if(!preg_match('^[A-Za-z0-9\\-]+$',val))
		return __T(msg.hostnameformat1); 

	if (val.charAt(0) == "-" || val.charAt(val.length-1) == "-" )
		return __T(msg.hostnameformat1); 
	return "";
}

function my_valid_email(val,obj_id,span_id)
{
	clear_msg(obj_id,span_id);
	if(!valid_email(val))
	{
                parent.document.getElementById("obj_id").value = span_id;
		my_alert(O_VAR,obj_id,__T(syslog.emailfail),"0",span_id);
		return false;
	}
	return true;
}

function valid_email(e)
{
        var isValid = PASS; //1:success, 0:fail
	var eindex=e.lastIndexOf("@");

        if(eindex <= 0)
                isValid = FAIL;
        else
        {
                var domain_value = e.substr(eindex+1,e.length);
                var local_value = e.substr(0,eindex);
                var domain_len = domain_value.length;
                var local_len = local_value.length;
                var local_replace = str_replace("\\\\","\\",local_value);

                if((local_len < 1) || (local_len > 64))
                        isValid = FAIL;
                else if((domain_len < 1) || (domain_len > 255))
                        isValid = FAIL;
                else if((local_value.charAt(0) == '.') || (local_value.charAt(local_len-1) == '.'))
                        isValid = FAIL;
                else if(preg_match('\\.\\.',local_value))
                        isValid = FAIL;
                else if(!preg_match('^[A-Za-z0-9\\-\\.]+$',domain_value))
                        isValid = FAIL;
                else if(preg_match('\\.\\.',domain_value))
                        isValid = FAIL;
                else if(!preg_match('^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$',local_replace))
                {
                        if(!preg_match('^"(\\\\"|[^"])+"$',local_replace))
                                isValid = FAIL;
                }
        }
        return isValid;
}

function valid_email_server(val)
{
	var val_len = val.length;
        if((val_len < 1) || (val_len > 255))
		return false;
        else if(!preg_match('^[A-Za-z0-9\\-\\.]+$',val))
		return false;
        else if(preg_match('\\.\\.',val))
                return false;
	return true;
}

function preg_match(regStr,str)
{
        var re = new RegExp(regStr);
        return re.test(str);
}

var DIGIT=0;
var XDIGIT=1;
var ASCII=2;
var ISCHAR=3;
var IDNAME=4;

function chk_chartype(val,type)
{
    var i,ch;
    for(i=0 ; i<val.length; i++){
	ch = val.charAt(i).toLowerCase();
	switch(type){
		case DIGIT:
			if(ch < '0' || ch > '9')
			return FAIL;
			break;
		case XDIGIT:
                	if(ch >= '0' && ch <= '9' || ch >= 'a' && ch <= 'f')
				break;
	                return FAIL;
		case ASCII:
			if(ch < ' ' || ch > '~')
				return FAIL;	
			break;
		case ISCHAR:
	   		if( ch.search(/^[A-Za-z0-9-]/i) == -1 )
				return FAIL;
			break;
		case IDNAME:
	   		if( ch.search(/^[A-Za-z0-9-_()-]/i) == -1 )
				return FAIL;
			break;
      }
    }
    return PASS;
}

function mac12to17(val)
{
	var tmp="";
	if ( val.indexOf(":") != -1 ||  val.length != 12 ) return val;
	for(var i=0; i<12; i+=2)
	{
		if ( tmp != "" ) tmp+=":";
		tmp+=val.substring(0,2);
		val = val.substring(2,val.length);
	} 
	return tmp;
}

function valid_macs_all(I)
{
	//I = ignoreSpaces(I);
	I = str_replace(" ","",I);
	var tmp;
	if(I != "")
	{
		if(I == "00:00:00:00:00:00" || I == "000000000000") 
		{
			return __T(msg.mac1);
		}
		else if(I.length == 12)
		{
			tmp = mac12to17(I);
			return valid_macs_17(tmp);
		}
		else if(I.length == 17)
		{
			return valid_macs_17(I);
		}
		else
		{
			return __T(msg.mac2);
		}
		return "";
	}else{
		return __T(msg.mac3);
	}
	return "";
}

function valid_macs_17(I)
{
	if ( I == "00:00:00:00:00:00" ) return __T(msg.mac1); 
	var mac = I;
	var m = mac.split(":");
	if (m.length != 6) 
	{
		return __T(msg.mac3);
	}
	for(var i in m)
	{
		if((!chk_chartype(m[i],XDIGIT)) || ((m[i].length != 1) && (m[i].length != 2)))
		{
			return __T(msg.mac4);
		}
	}

	mac = mac.toUpperCase();
	if((parseInt(mac.charAt(1), 16) & 1) == 1)
	{
		return __T(msg.mac5);
	}

	I = mac;
	return "";
}

//Modify by emily for meaning name used. 2011/1/25
//1.Cannot be blank, for example:
//  valid_meaning_name("",ZERO_NO) return BLANK_ERR;
//2.Leading and tailing cannot be blank on meaning name field, for example:
//  valid_meaning_name(" test ",ZERO_NO) return LEAD_TAIL_SPACE_ERR;
//  Leading and tailing will auto removed on id name field.
//3.Support ASCII 33 to 126, for example:
//  valid_meaning_name("test 123",ZERO_NO|SPACE_NO) return MIDDLE_SPACE_ERR;
//  ID_NAME means only for identification.
var MEANING_NAME=0;
var ID_NAME=1;
function valid_meaning_id_name(type,I,flag,obj_id)
{
	if( type == ID_NAME )
	{ 
		I = I.replace(/^\s*/,"");
		I = I.replace(/\s*$/,"");
		if( !chk_chartype(I,IDNAME) )
			return __T(msg.nameformat1);
		if ( obj_id != null ) 
			document.getElementById(obj_id).value = I;
	}
	if ( flag & ZERO_NO )
	{
		if ( I == "" ) return __T(msg.notblank);
	}
	if( chk_chartype(I,ASCII) == true )
	{
		if(type == MEANING_NAME )
                {
                       	if(I.search(/^\s/) != -1 || I.search(/\s$/) !=-1 )
			{
				if ( flag & SPACE_OK ) return "";
                               	return __T(msg.notleadtailblank);
			}
                }
		if(flag & SPACE_NO){
                       	if(I.search(/\s/) != -1 )
				return __T(msg.middlespace);
		}
		return "";
	}
	return __T(msg.validname);
}
var FORMAT_ERROR=-1;
var CHARTYPE_ERROR=-2;
var ZERONO_ERROR=-3;
var BCSTNO_ERROR=-4;
var SUBNET_ERROR=-5;

function valid_mask(F,N,flag,span_id){	
	var obj_cnt=0;
	if ( eval("F."+N+"_0") )
		obj_cnt=4; // focus all
	var errmsg = valid_mask_msg(F,N,flag);
	if ( errmsg != "" ) 
	{
		my_alert(O_VAR,N,errmsg,obj_cnt,span_id);
		return false;
	}
	return true;	
}

function valid_mask_msg(F,N,flag)
{
	var errmsg = check_mask(F,N,flag);
	if ( errmsg == FORMAT_ERROR ) 
		return __T(msg.maskillegal);
	else if ( errmsg == CHARTYPE_ERROR )
		return __T(msg.maskillegal);
	else if ( errmsg == ZERONO_ERROR )
		return __T(msg.maskillegal);
	else if ( errmsg == BCSTNO_ERROR )
		return __T(msg.maskillegal);
	else if ( errmsg == SUBNET_ERROR )
		return __T(msg.maskillegal);
	return "";
	
}

function check_mask(F,N,flag){
	var match0 = -1;
	var match1 = -1;
	var m, obj_cnt=0;
	if ( eval("F."+N+"_0") ){
		obj_cnt=4; // focus all
		m = new Array(4);
		for(i=0;i<4;i++)
		{
			if ( document.getElementById(N+"_"+i).value.length>1 && 
                             document.getElementById(N+"_"+i).value.substring(0,1)=="0" ) 
			{
				document.getElementById(N+"_"+i).value = parseInt(eval("F."+N+"_"+i).value,10);
			}
			m[i] = document.getElementById(N+"_"+i).value;
		}
	}else{
		m = eval("F."+N).value.split(".");
	}
	if ( m.length != 4 )
	{
		return FORMAT_ERROR;
	}
        for(var i=0; i<4; i++)
	{
		if ( chk_chartype(m[i],DIGIT) == FAIL ) 
		{
			return CHARTYPE_ERROR;
		}
	} 		
	if(m[0] == "0" && m[1] == "0" && m[2] == "0" && m[3] == "0"){
		if(flag & ZERO_NO){
			return ZERONO_ERROR;
		}
	}

	if(m[0] == "255" && m[1] == "255" && m[2] == "255" && m[3] == "255"){
		if(flag & BCST_NO){
			return BCSTNO_ERROR;
		}
	}

	for(i=3;i>=0;i--){
		for(j=1;j<=8;j++){
			if((m[i] % 2) == 0)   match0 = (3-i)*8 + j;
			else if(((m[i] % 2) == 1) && match1 == -1)   match1 = (3-i)*8 + j;
			m[i] = Math.floor(m[i] / 2);
		}
	}
	if(match0 > match1){
		return SUBNET_ERROR;
	}
	var tmpip="";
	var tmpm="";
	if ( eval("F."+N) ){
		tmpm = eval("F."+N).value.split(".");
		for(var i=0; i<4; i++)
		{
			if ( tmpip != "" ) tmpip+=".";
			tmpip += parseInt(tmpm[i],10);
		}
		eval("F."+N).value = tmpip;
	}
	return true;
}

function chk_range(obj_id,val,start,end,th)
{
	if ( th != "nochg" && val != "" && val.length>1 && val.substring(0,1)=="0") 
	{
		document.getElementById(obj_id).value=parseInt(val,10);
	}
	if ( typeof th == 'undefined' || th == "nochg" ) th=10;
	if ( th == 10 ) 
		if ( !chk_chartype(val,DIGIT) ) return FAIL;
	else if ( th == 16 ) 
		if ( !chk_chartype(val,XDIGIT) ) return FAIL;
	var d = parseInt(val,th);
	if ( !(d<=parseInt(end,th) && d>=parseInt(start,th)) ) return FAIL;
	return PASS;
	
}

//TYPE 1: FIELD ERROR
//        my_alert(O_VAR,[object ID],[Error Message],[Error count],[SPAN ID],[ARROW DIRECTION]);
//
//TYPE 2: TABLE ERROR
//	  table_msg([TABLE ID],[IMAGE ID],[Div ID],[object index],[Error Message]);
var IS_FIELD=0;
var IS_TABLE=1;
function msg_chk_range(obj_val,obj_id,start,to,th,errtype){//args[0]~args[5]
	var args = new Array;
	for(var i=0; i<10; i++)
	{
		args[i] = arguments[i];
		args[i] = typeof(args[i])!='undefined'?args[i]:'';
	}
	if ( errtype == IS_FIELD )
		clear_msg(obj_id,args[7]);
	else
		clear_table_msg("",args[7],obj_id,args[9]);
	//alert("obj_id="+obj_id+";obj_val="+obj_val+";start="+start+";to="+to);
	if ( chk_range(obj_id,obj_val,start,to,th) == FAIL ) 
	{
		if ( errtype == IS_FIELD )
		{ 
			parent.document.getElementById("obj_id").value = args[7];
			my_alert(O_VAR,obj_id,spell_words(range_rule,start,to),args[6],args[7],args[8]);
		}else{
			document.getElementById(args[6]).innerHTML = __T(share.tableerrmsg);
			document.getElementById(args[6]).style.display="";
			table_msg(args[7],obj_id,args[8],args[9],spell_words(range_rule,start,to));	
			document.getElementById("tmsg").style.display="none";
		}
		return false;
	}
	return true;
}

function my_valid_m_value(){
	var args = new Array;
	for(var i=0; i<10; i++)
	{
		args[i] = arguments[i];
		args[i] = typeof(args[i])!='undefined'?args[i]:'';
	}	
	
	for(var i=0; i<4; i++)
		document.getElementById(args[2]+"_"+i).style.backgroundColor="";
	if ( args[0] == "IP" ) 
	{
		if ( check_ipv4(get_full_ip(args[1],args[2]),args[4],args[5]) <= 0 )
		{
	                my_alert(O_VAR,args[2],__T(msg.validname),4,args[6]);
			return false;
		}
	}
	else if ( args[0] == "MASK" ) 
	{
		document.getElementById(args[4]).innerHTML = "";
		if ( !valid_mask(args[1],args[2],args[3],args[4]) ) 
			return false;
	}
        return true;
}

var IPV4_FORMAT_ERR=-1;
var IPV4_ZERO_ERR=-2;
var IPV4_RANGE_ERR=-3;
var IPV4_MULTCAST_ERR=-4;
var IPV4_SUBNET_ERR=-5;
var IPV4_LANSUBNET_ERR=-6;
var IPV4_NOLANSUBNET_ERR=-7;

function check_ipv4(ipaddr,rule,flag){
	//alert("check_ipv4(): ipaddr="+ipaddr+";rule="+rule);
	var m = ipaddr.split(".");
	if ( m.length != 4 )
		return IPV4_FORMAT_ERR;
	
	if(m[0] == "0" && m[1] == "0" && m[2] == "0" && m[3] == "0"){
		if(flag & ZERO_OK) return PASS;
		return IPV4_ZERO_ERR;
	}

	// check range
	var tmp = rule.split(".");
	var range;
	var returnval;
	for(var j=0; j<4; j++)
	{
		returnval = chk_chartype(m[j],DIGIT);
		range = tmp[j].split("-");

		if ( returnval == PASS ) 
		{
			returnval = chk_range("",m[j],range[0],range[1],"nochg");
		}
		if ( returnval != PASS ) 
                        return IPV4_RANGE_ERR;
	}
		
			
	if(m[0] == 127 || m[0] == 224){
		return IPV4_MULTICAST_ERR;
	}

	if((m[0] != "0" || m[1] != "0" || m[2] != "0") && m[3] == "0"){
		if(flag & MASK_NO){
			return IPV4_SUBNET_ERR;
		}
	}
	if ( flag & LANSUBNET_OK )
	{
		if ( !lan_subnet_ip(ipaddr) ) return IPV4_LANSUBNET_ERR;
	}
	if ( flag & LANSUBNET_NO )
	{
		if ( lan_subnet_ip(ipaddr) ) return IPV4_NOLANSUBNET_ERR;
	}
	return PASS;
}

function valid_ip_in_subnet(ip_val,mask_val)
{
	var ip = ip_val.split(".");
	var mask = mask_val.split(".");
	var subnet_ip="",broadcast_ip="";

	if ( ip.length != 4 || mask.length != 4 ) return false;
	for(var i=0; i<4; i++)
	{
		if ( subnet_ip != "" ) subnet_ip +=".";
		subnet_ip += parseInt(ip[i],10)&parseInt(mask[i],10);
		if ( broadcast_ip != "" ) broadcast_ip += ".";
		if ( parseInt(mask[i],10) == 255 ) 
			broadcast_ip += ip[i];
		else if ( parseInt(mask[i],10) > 0 ) 
			broadcast_ip += (255-parseInt(mask[i],10));
		else
			broadcast_ip += "255";
	}
	//alert("subnet_ip="+subnet_ip+";broadcast_ip="+broadcast_ip);
	if ( ip_val == subnet_ip || ip_val==broadcast_ip ) return false;
	return true;	
}

function valid_ip_gw(F,I,N,G)
{
	var IP = new Array(4);
	var NM = new Array(4);
	var GW = new Array(4);
	
	for(i=0;i<4;i++)
		IP[i] = eval(I+"_"+i).value;
	for(i=0;i<4;i++)
		NM[i] = eval(N+"_"+i).value;
	for(i=0;i<4;i++)
		GW[i] = eval(G+"_"+i).value;

	for(i=0;i<4;i++){
		if((IP[i] & NM[i]) != (GW[i] & NM[i])){
			//alert("IP address and gateway address are not using the same subnet mask.");
			//alert(errmsg.err32);
			return false;
		}
	}
	if((IP[0] == GW[0]) && (IP[1] == GW[1]) && (IP[2] == GW[2]) && (IP[3] == GW[3])){
		//alert("IP address and gateway address cannot be the same.");
		//alert(errmsg.err33);
		return false;
	}
	
	return true;
}

function swap_num(num1,num2)
{
    var num_array = new Array(); 
    num_array[0] = num2;
    num_array[1] = num1;
    return num_array;
}

function check_port(i_startport,i_endport,o_startport,o_endport)
{
  var num_array = new Array(); 
  if(i_startport > i_endport)
  {
    num_array = swap_num(i_startport,i_endport);
    i_startport = num_array[0];
    i_endport = num_array[1];
  }
  
  if(o_startport > o_endport)
  {
    num_array = swap_num(o_startport,o_endport);
    o_startport = num_array[0];
    o_endport = num_array[1];
  }
  
  if((i_startport <= o_startport) && (i_endport >= o_endport))
    return false;  
  else if((i_startport >= o_startport) && (i_startport <= o_endport) && (i_endport >= o_endport))
    return false;  
  else if((i_endport >= o_startport) && (i_endport <= o_endport))
    return false;  
  else if((i_startport >= o_startport) && (i_endport <= o_endport))
    return false;  
  else if((i_startport == o_endport) || (i_endport == o_startport) || (i_endport == o_endport))
    return false;  

  return true;
}

function valid_subnet(I,N,G)
{
	var IP = new Array(4);
	var NM = new Array(4);
	var GW = new Array(4);
	
	IP = I.split(".");
	NM = N.split(".");
	GW = G.split(".");
	for(i=0;i<4;i++){
		if((IP[i] & NM[i]) != (GW[i] & NM[i])){
			return false;
		}
	}
	return true;
}

function chk_change(def,chg)
{
	var failflg = false;
	if ( def.length != chg.length ) failflg = true;
	if ( def != chg ) failflg = true;
	if ( failflg == true ) 
		parent.document.getElementById("GUI_LOCK").value = 1;
	else
		parent.document.getElementById("GUI_LOCK").value = 0;
}

function CheckBrowser(){
	var cb = "UnKnow";
	if ( window.ActiveXObject ) 
		cb = "IE" ; 
	else if ( navigator.userAgent.toLowerCase().indexOf("firefox") != -1 )
		cb = "Firefox";
	else if ( navigator.userAgent.toLowerCase().indexOf("opera") != -1 ) 
		cb = "Opera";
	else if ( navigator.userAgent.toLowerCase().indexOf("safari") != -1 ) 
		cb = "Safari";
	else if ( (typeof document.implementation != "undefined") && (typeof document.implementation.createDocument != "undefined") && (typeof HTMLDocument != "undefined" ))
		cb = "Mozila";
	return cb;
}

function check_ip_domain(value)
{
	var count = 0;
	var flag = false;
   	for(i=0; i<value.length; i++)
	{
	    	ch = value.charAt(i);
	    	if(ch == '.')
	        	count++;
	    	if(count > 3)
	        	flag = true;
	    	else if(ch.search(/^[0-9.]/i) == -1)
   			flag = true; 
	}
	if(flag == true)
		return check_domain(value);
	else if(flag == false)
	{	
    	    if( check_ipv4(value,VALID_IP_RULE7) == PASS )
	     	return true;
	    else
    		return false;
	}
    
}

function check_domain(domain_main)
{
    var sub_name;
    var temp_firstchar;
    var temp_endchar;    
    if ( (domain_main.length==0) || (domain_main==null) || (domain_main.length > 256))
    	return false;
    else
    {
        temp_firstchar = domain_main.charAt(0);
        temp_endchar = domain_main.charAt(domain_main.length-1);
        if((temp_firstchar.search(/^[A-Za-z0-9]/i) == -1) ||
            (temp_endchar.search(/^[A-Za-z0-9]/i) == -1))
           return false;
    }
    
    sub_name = domain_main.split(/\./);  
    if(sub_name.length < 2)	// Support google.com
  	return false;

    for(var i = 0; i < sub_name.length; i++)
    {
	if((sub_name[i].length > 0) && (sub_name[i].length > 63))
	{
    		return false;
	}
      	else if( !chk_chartype(sub_name[i],ISCHAR))
	{
      		return false;
	}
     }
    if ( sub_name.length == 4)
	{
	    if((!isNaN(sub_name[0]))&&(!isNaN(sub_name[1]))&&(!isNaN(sub_name[2]))&&(!isNaN(sub_name[3])))
      		return false;
  	}
    else if ( sub_name.length == 3)
	{
	    if((!isNaN(sub_name[0]))&&(!isNaN(sub_name[1]))&&(!isNaN(sub_name[2])))
      		return false;
  	}
    else if ( sub_name.length == 2)
	{
	    if((!isNaN(sub_name[0]))&&(!isNaN(sub_name[1])))
      		return false;
  	}

    return true;

}

function check_url(domain_main)
{
    var sub_name;
    var temp_firstchar;
    var temp_endchar;    
    if ( (domain_main.length==0) || (domain_main==null) || (domain_main.length > 256))
    	return false;
    else
    {
        temp_firstchar = domain_main.charAt(0);
        temp_endchar = domain_main.charAt(domain_main.length-1);
        if((temp_firstchar.search(/^[A-Za-z0-9]/i) == -1) ||
            (temp_endchar.search(/^[A-Za-z0-9\/]/i) == -1))
           return false;
    }
    
    sub_name = domain_main.split(/\./);  
    if(sub_name.length < 2)	// Support google.com
  	return false;

    for(var i = 0; i < sub_name.length; i++)
    {
	if((sub_name[i].length > 0) && (sub_name[i].length < 2) || (sub_name[i].length > 63))
    		return false;
      	//else if(check_char(sub_name[i])) Support http://
      	//	return false;
     }
    if ( sub_name.length == 4)
	{
	    if((!isNaN(sub_name[0]))&&(!isNaN(sub_name[1]))&&(!isNaN(sub_name[2]))&&(!isNaN(sub_name[3])))
      		return false;
  	}
    else if ( sub_name.length == 3)
	{
	    if((!isNaN(sub_name[0]))&&(!isNaN(sub_name[1]))&&(!isNaN(sub_name[2])))
      		return false;
  	}
    else if ( sub_name.length == 2)
	{
	    if((!isNaN(sub_name[0]))&&(!isNaN(sub_name[1])))
      		return false;
  	}

    return true;

}

//Add check ipv6 address format
function substr_count (haystack, needle, offset, length)
{
    var pos = 0, cnt = 0;
    haystack += '';
    needle += '';
  
    if (isNaN(offset))
        offset = 0;
       
    if (isNaN(length))
        length = 0;
   
    offset--;
   
    while ((offset = haystack.indexOf(needle, offset+1)) != -1)
    {
        if (length > 0 && (offset+needle.length) > length)
            return false;
        else
            cnt++;
    }
 
    return cnt;
}

var lan_arr = new Array();
function LAN(vlan_id,ipaddr,netmask,proto,dhcprelay_ip,start_ip,user_num,lease_time,dns1,dns2,dns3,wins)
{
        this.vlan_id = vlan_id;
        this.ipaddr = ipaddr;
        this.netmask = netmask;
        this.proto = proto;
        this.dhcprelay_ip = dhcprelay_ip;
        this.start_ip = start_ip;
        this.user_num = user_num;
        this.lease_time = lease_time;
        this.dns1=dns1;
        this.dns2=dns2;
        this.dns3=dns3;
        this.wins=wins;
}
lan_arr[0]=new LAN('1','192.168.1.1','255.255.255.0','dhcp','0.0.0.0','100','50','1440','0.0.0.0','0.0.0.0','0.0.0.0','0.0.0.0','0');


function lan_subnet_ip(ipaddr)
{
	for(var j=0; j<lan_arr.length; j++)
        {
        	if ( valid_subnet(ipaddr,lan_arr[j].netmask,lan_arr[j].ipaddr) )
			return true;
        }
	return false;
}

function lan_subnet_mask(ipaddr)
{
  	for(var j=0; j<lan_arr.length; j++)
        {
        	if ( valid_subnet(ipaddr,lan_arr[j].netmask,lan_arr[j].ipaddr) )
		{
        		if ( !valid_ip_in_subnet(ipaddr,lan_arr[j].netmask) )
				return false;
		}
        }
	return true;
}

function valid_ipmode_check(F,objname,flg)
{
	var wan_ip_mode = "3"; //1:IPv4 2:IPv6
	var lan_ip_mode = "3"; //1:IPv4 2:IPv6 3:IPv4&IPv6
	var errmsg="",errflg=0;
	var change_ipmode="";
	var args3 = arguments[3];
	
	if ( (lan_ip_mode == "2" && wan_ip_mode == "1") || (lan_ip_mode == "3" && wan_ip_mode == "1") && 
	     typeof args3 != "undefined" && args3 != "" ) 
		change_ipmode=args3;
	if ( change_ipmode == "IPv4" || (lan_ip_mode == "1" && wan_ip_mode == "1") ) //(LAN/WAN:IPv4/IPv4)
	{
		errflg = check_ipv4(eval("F."+objname).value,VALID_IP_RULE7,flg);
	}else if ( change_ipmode == "IPv6" || ( lan_ip_mode == "2" && wan_ip_mode == "2" ) )//(LAN/WAN:IPv6/IPv6)
	{
		errmsg = valid_ipv6(eval("F."+objname).value);
		
	}else{
		errflg = check_ipv4(eval("F."+objname).value,VALID_IP_RULE7,flg);
		if ( errflg == IPV4_FORMAT_ERR )
		{
			errmsg = valid_ipv6(eval("F."+objname).value);
			if ( errmsg == "" ) errflg = 1;
		}
	}
	if ( errmsg == "" && errflg <= 0 ) 
	{
		if ( errflg == IPV4_LANSUBNET_ERR ) 
			errmsg = __T(msg.subnet8);
		else if ( errflg == IPV4_NOLANSUBNET_ERR ) 
			errmsg = __T(msg.subnet12);
		else
			errmsg = __T(msg.ivalidipformat);
	}
	return errmsg;	
	
}

function valid_ipv6_prefix(prefix,prefix_len)
{
	var new_ipaddr = trans_ipv6_array(prefix);
	var binary_str="";
	for(var i=0; i<8; i++)
	{
		binary_str += trans_16to2(new_ipaddr[i]);
	}
	for(var i=127; i>=prefix_len; i--)
	{
		if ( binary_str.charAt(i) != '0' ) 
			return false;
	}
	return true;
	
}

function check_ipv6_subnet(ipaddr,prefix_len,cmp_ipaddr)
{
	var new_ipaddr = new Array(); 
	var new_cmp_ipaddr = new Array(); 
	var len=0,cmp_len=0;
	var binary_str="",cmp_binary_str="";
	new_ipaddr = trans_ipv6_array(ipaddr);
	new_cmp_ipaddr = trans_ipv6_array(cmp_ipaddr);
	for(var i=0; i<8; i++)
	{
		binary_str += trans_16to2(new_ipaddr[i]);
		cmp_binary_str += trans_16to2(new_cmp_ipaddr[i]);
	}
	//alert(binary_str+"\n"+cmp_binary_str);
	for(var i=0; i<prefix_len; i++)
	{
		if ( binary_str.charAt(i) != cmp_binary_str.charAt(i) ) 
		{
			return false;
		}
	}
	return true;
	
		
} 

function trans_ipv6_array(ipaddr)
{
	var ipchar = new Array();
	var sub1ipchar = new Array();
	var sub2ipchar = new Array();
	var full_ipchar = new Array();
	var cnt=0,tmpcnt=0;
	if ( ipaddr.indexOf("::") != -1 ){
		ipchar = ipaddr.split('::');
		if ( ipchar[0].indexOf(":") == -1 && 
		     ipchar[1].indexOf(":") == -1 )
		{
			if ( ipchar[0].indexOf(".") == -1 && ipchar[1].indexOf(".") == -1 ) 
			{ 
				full_ipchar[0]=ipchar[0];	
				for(var j=1; j<7; j++)
					full_ipchar[j]=0;	
				full_ipchar[7]=ipchar[1];	
			}else
			{ //Support ::1.2.3.4
				full_ipchar[0]=ipchar[0];	
				for(var j=1; j<6; j++)
					full_ipchar[j]=0;	
				full_ipchar[6]=ipchar[1];	
				
			}
		}else{
			sub1ipaddr = ipchar[0].split(":");
			sub2ipaddr = ipchar[1].split(":");
			tmpcnt=sub1ipaddr.length+sub2ipaddr.length;
			if ( ipchar[1].indexOf(".") != -1 )
				tmpcnt+=1; //IPv4 format is 2 bytes. 
			for(var i=0; i<sub1ipaddr.length; i++)
			{
				full_ipchar[cnt] = sub1ipaddr[i];
				cnt++;
			}
			for(var i=0; i<(8-tmpcnt); i++)
			{
				full_ipchar[cnt] = "0";
				cnt++;
			}
			for(var i=0; i<sub2ipaddr.length; i++)
			{
				full_ipchar[cnt] = sub2ipaddr[i];
				cnt++;
			}
		}
	}else{
		ipchar = ipaddr.split(':');
		for(var i=0; i<ipchar.length; i++)
			full_ipchar[i] = ipchar[i];
	}
	return full_ipchar;
}

function full_ipv6(addr)
{
	addr = str_replace(" ","",addr);
	var tmp = addr.split("https://www.cisco.com/");
	if ( addr.indexOf("::")==-1 && addr.indexOf(":")==-1 && check_ipv4(addr,VALID_IP_RULE7)<=0 )
	{
		if ( addr == "" || 
		     (tmp.length==2 && valid_ipv6(tmp[0])!="" ) || 
		     (tmp.length==0 && valid_ipv6(addr)!="")) return addr;
	}
	arr = trans_ipv6_array(addr);
	var newaddr="";
	var tmp ="";
	var subnet="";
	for(var i=0; i<arr.length; i++)
	{
		arr[i] = arr[i].toString();
		if ( arr[i].indexOf(".") != -1 )
		{
			tmp = arr[i];
		}else{
			if ( arr[i].indexOf("https://www.cisco.com/")!=-1 ) 
			{
				subnet = arr[i].split("https://www.cisco.com/");
				tmp = subnet[0].toString();
			}else
				tmp = arr[i].toString();
			while( tmp.length < 4 ) 
				tmp = "0"+tmp;
		}
		if ( newaddr != "" ) newaddr+=":";
		newaddr+=tmp.toUpperCase();
	}
	if ( addr.indexOf("https://www.cisco.com/") != -1 && addr.indexOf(".") == -1 ) 
		return newaddr+"/"+subnet[1];
	else
		return newaddr;
}

/*
  error 0 : valid;
  	1 : word error
  	3 : length error
  	5 : empty
*/
function valid_ipv6(ipaddr){
        var ipchar = new Array();
        var ipchar1 = new Array();
        var ipchar2 = new Array();
        var case_ip6 = 0;
	var error=0;
        if (ipaddr == ''){
                return __T(msg.notblank);
        }else{
		if ( ipaddr.split(":") > 7 ) 
			return  __T(msg.ivalidipformat);
                if (ipaddr.indexOf(":::") != -1){
			return __T(msg.ivalidipformat);
		}
                if (ipaddr.indexOf("::") != -1){
			case_ip = 1;
                	ipchar1 = ipaddr.split('::');
                	
		}else{
			case_ip = 2;
                	ipchar = ipaddr.split(':');
		}
		if ( ipaddr.split(":").length > 8 ) 
			return  __T(msg.ivalidipformat);
	
	}
	switch(case_ip){
		case 1:
			/* other case */
			if (ipchar1.length > 2){
				return __T(msg.ivalidipformat);
			}
			for (var i=0;i<2;i++){
				if (ipchar1[i].indexOf(":") != -1){
					ipchar2 = ipchar1[i].split(':');
					for (var j=0; j<ipchar2.length;j++){
						if (ipchar2[j].length > 4) error = 3;
						if (!isValidIPv6addr_Code(ipchar2[j]))
							error = 1;
					}				
				}else{
					if (ipchar1[i].length > 4) error = 3;
					if (!isValidIPv6addr_Code(ipchar1[i])) error = 1;
				}
                	}
			break;
		case 2:
			/* normal case */
			if (ipchar.length != 8) error = 3;
			for (var i=0;i<ipchar.length;i++){
				if (ipchar[i].length > 4) error = 3;
				if (ipchar[i] != ''){
					if (!isValidIPv6addr_Code(ipchar[i])) 
						error=1;
				}
			}
			break;
	}
	if ( error != 0 ) 
		return  __T(msg.ivalidipformat);
	else
		return "";
}

function isValidIPv6addr_Code(word){
	for (var i=0 ; i<word.length ; i++){
		if (!intCheckvalue(word.toUpperCase().charCodeAt(i),10,65,70) && 
		!intCheckvalue(word.toUpperCase().charCodeAt(i),10,48,57))
			return false;
	}
	return true;
}

function intCheckvalue(val, RADIX, minValue, maxValue) {
  var intVal = parseInt(val,RADIX);
  var i = 0, j = val.length-1;
  if (RADIX != 10 && RADIX != 16) {
    return false;
  }
  
  /* range check */
  if (intVal < minValue || intVal > maxValue) {
    return false;
  }
  return true;
}

function test_ipv6(ip)                                                                                                      
{                                                                                                                        
    // Test for empty address                                                                                                   
    if (ip.length<3)                                                                                          
        return ip == "::";

    // Check if part is in IPv4 format                                                                                          
    if (ip.indexOf('.')>0)                                                                                                   
    {    
        lastcolon = ip.lastIndexOf(':');                                                                                            
        if (!(lastcolon && check_ipv4(ip.substr(lastcolon + 1),VALID_IP_RULE7)<=0))
            return false;                                                                                                               
        // replace IPv4 part with dummy
        ip = ip.substr(0, lastcolon) + ':0:0';
    }                                                                                                                       
    
    // Check uncompressed                                                                                                       
    if (ip.indexOf('::')<0)
    {                                                          
        var match = ip.match(/^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}$/i);
        return match != null;
    }                                                                                                                           
    // Check colon-count for compressed format 
    if (substr_count(ip, ':') < 8) 
    { 
        var match = ip.match(/^(?::|(?:[a-f0-9]{1,4}:)+):(?:(?:[a-f0-9]{1,4}:)*[a-f0-9]{1,4})?$/i); 
        return match != null;          
    } 
                                                                                 
    // Not a valid IPv6 address                                                                                             
    return false;                                                                                                         
}

function chk_fqdn(fqdn_val,obj_id)
{
	var ret_val = true;
	if ( fqdn_val.indexOf(".") == -1 ) 
	{
		var ret_msg = valid_hostname(fqdn_val);
	        if ( ret_msg != "" )
	        {
	                my_alert(O_VAR,obj_id,__T(msg.validname),"0","msg_"+obj_id);
	               	ret_val = false;
        	}
	}	
	else
	{
		if ( fqdn_val.indexOf("@") != -1 )
			fqdn_val = fqdn_val.replace("@",".");
		if(check_domain(fqdn_val) == false)
		{
	               	my_alert(O_VAR,obj_id,__T(msg.validname),"0","msg_"+obj_id);
			ret_val = false;
		}
	}
	return ret_val;	
}
// VALID CHECK FUNCTION END ======================================================================================
