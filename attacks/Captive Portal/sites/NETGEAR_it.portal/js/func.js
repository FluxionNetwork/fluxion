var HelpOptionsVar = "width=480,height=420,scrollbars,toolbar,resizable,dependent=yes";
var GlossOptionsVar = "width=420,height=180,scrollbars,toolbar,resizable,dependent=yes";
var bigsub   = "width=540,height=440,scrollbars,menubar,resizable,status,dependent=yes";
var smallsub = "width=440,height=320,scrollbars,resizable,dependent=yes";
var sersub   = "width=500,height=380,scrollbars,resizable,status,dependent=yes";
var memsub   = "width=630,height=320,scrollbars,menubar,resizable,status,dependent=yes";
var helpWinVar = null;
var glossWinVar = null;
var datSubWinVar = null;
var ValidStr = 'abcdefghijklmnopqrstuvwxyz-';
var ValidStr_ddns = 'abcdefghijklmnopqrstuvwxyz-1234567890';
var hex_str = "ABCDEFabcdef0123456789";

function showMsg()
{
	var msgVar=document.forms[0].message.value;
	if (msgVar.length > 1) 
		alert(msgVar);
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

function openDataSubWin(filename,win_type)
{
	datSubWinVar = window.open(filename,'datasub_win',win_type);
	if (datSubWinVar.focus)
		setTimeout('datSubWinVar.focus()',200); 
}

function closeSubWins()
{
	closeWin(helpWinVar);
	closeWin(glossWinVar);
	closeWin(datSubWinVar);
}

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
			return msg_space;
	else return "";
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
function checkInt(text_input_field, field_name, min_value, max_value, required)
{
	var str = text_input_field.value;
	var error_msg= "";
	
	if (text_input_field.value.length==0)
	{
		if (required)
			error_msg = addstr(msg_blank,field_name);
	}
	else
	{
		for (var i=0; i < str.length; i++)
		{
			if ((str.charAt(i) < '0') || (str.charAt(i) > '9'))
				error_msg = addstr(msg_check_invalid,field_name);
		}
		if (error_msg.length < 2)
		{
			var int_value = parseInt(str);
			if (int_value < min_value)
				error_msg = addstr(msg_greater,field_name,(min_value - 1));
			if (int_value > max_value)
				error_msg = addstr(msg_less,field_name,(max_value + 1));
		}
	}
	if (error_msg.length > 1)
		error_msg = error_msg + "\n";
	return(error_msg);
}
function chkMacLen(mac){
	if((mac.value.length != 12) || (mac.value=="000000000000")){
		alert("Invalid MAC Address");
		mac.value =MacAddress;
		return false;
	}else
	{
	  return true;
	}
}
function sumvalue(F)
{    
	if (F.MACAssign[2].checked)
	{
		if ((F.Spoofmac.value.indexOf(':')!=-1)||(F.Spoofmac.value.indexOf('-')!=-1))
		{
			if (MACAddressBlur(F.Spoofmac))
			{
				return true;
			}
			else
				return false;
		} 
		else    
		{
			if (chkMacLen(F.Spoofmac))
			{
				return true;
			}
			else
				return false;
		}
	}
	return true;
}
function MACAddressBlur(address)
{
	var MAC = address.value;
	MAC = MAC.replace(/:/g,"");
	MAC = MAC.replace(/-/g,"");
	address.value = MAC;
	if ((address.value.length != 12) || (address.value=="000000000000"))
	{
		alert("Invalid MAC  Address");
		return false;
	}
	else
	{
		return true;
	}
}
function loadhelp(fname,anchname)
{
	if ((loadhelp.arguments.length == 1 ) || (anchname == "" ))
		top.helpframe.location.href=fname+"_h.htm";
	else
		top.helpframe.location.href=fname+"_h.htm#" + anchname;
}
