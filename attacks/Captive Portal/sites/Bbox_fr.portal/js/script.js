/*
<!-- Copyright (c) 2009 SAGEM Communications. All Rights Reserved. -->
<!-- Residential Gateway Software Division www.sagem.com -->
<!-- This file is part of the SAGEM Communications Software and may not be distributed, sold, reproduced or copied in any way without explicit approval of SAGEM Communications. -->
<!-- This copyright notice should not be removed in ANY WAY. -->
*/

var buttState = new Array();

js_mbv_ConfirmActions = 0;
showWarningPopup = 0;

error = 0;
delete_request = 0;
idd = -1;
attribution = 0;
deldeviceid = -1;

imgexpand = new Image();
imgexpand.src = 'images/menu/expand.html';

imgcollapse = new Image();
imgcollapse.src = 'images/menu/collapse.html';

imgarrowrightwhite = new Image();
imgarrowrightwhite.src = 'images/menu/arrowrightwhite.html';

imgarrowrightorange = new Image();
imgarrowrightorange.src = 'images/menu/arrowrightorange.html';


function SwitchMenu(id, sessionid)
{
     if (id == 1)
     	GoPage('index1dab.html?page=home&amp;sessionid=' + sessionid);
     else if (id == 2)
     	GoPage('index5261.html?page=game&amp;sessionid=' + sessionid);
     else if (id == 3)
     	GoPage('indexa762.html?page=network&amp;sessionid=' + sessionid);
     else if (id == 4)
     	GoPage('indexb32c.html?page=do_routeur_firewall&amp;sessionid=' + sessionid);
     else if (id == 5)
     	GoPage('indexb6b8.html?page=do_wifi_general&amp;sessionid=' + sessionid);
     else if (id == 6)
     	GoPage('index6a8b.html?page=do_device_disk&amp;sessionid=' + sessionid);
     else if (id == 7)
     	GoPage('indexd17e.html?page=admin&amp;sessionid=' + sessionid);
     else if (id == 8)
     	GoPage('index426b.html?page=do_assistance&amp;sessionid=' + sessionid);
     else if (id == 9)
     	GoPage('indexfa24.html?page=reinitiate&amp;sessionid=' + sessionid);
	else if (id == 10)
		GoPage('indexdc2b.html?page=do_routeur_dns&amp;sessionid=' + sessionid);
	else if (id == 11)
		GoPage('index2b71.html?page=do_routeur_dhcp&amp;sessionid=' + sessionid);
	else if (id == 12)
		GoPage('index0027.html?page=do_routeur_natpat&amp;sessionid=' + sessionid);
	else if (id == 13)
		GoPage('indexfa0c.html?page=do_routeur_dmz&amp;sessionid=' + sessionid);
	else if (id == 14)
		GoPage('indexb7ce.html?page=do_routeur_upnp&amp;sessionid=' + sessionid);
	else if (id == 15)
		GoPage('indexdc81.html?page=do_wifi_security&amp;sessionid=' + sessionid);
	else if (id == 16)
		GoPage('indexfc77.html?page=do_wifi_mac&amp;sessionid=' + sessionid);
	
}


function OpenHelp(help, sessionid)
{
    var x = 590;
    var y = 650;

	var px = screen.width - x - 10;
	var py = (screen.height - y) / 2;

    if (document.all || document.getElementById)
        options = "scrollbars=yes, resizable=yes, width="+x+", height="+y+", left="+px+", top="+py;
    if (document.layers)
        options = 'scrollbars=yes,resizable=yes,outerWidth='+x+',outerHeight='+y+',screenX='+px+',screenY='+py;

    window.open('indexbd5f.html?page=help&amp;help=' + help + '&sessionid=' + sessionid, 'HelpEmbedded', options);
}


function ButtonGoPage(buttName, url)
{
	if (buttState[buttName] == 0)
		return;

	GoPage(url);
}

function GoPage(url)
{
	//alert("Enter to GoPage(" +url +")");
	if ((js_mbv_ConfirmActions==1) && (showWarningPopup) && (document.getElementById('modal') != null) && (window.parent.LB_popup)) {
		popupContent1 = "<span style='font-weight: bold; font-family: verdana, arial, sans-serif; font-size: 12px;'>";
		popupContent1 += js_esp_ConfirmDialogText;
		popupContent1 += "</span>"; 
	
		window.parent.LB_popup(window.parent.document.getElementById ("GUI_master"),
				js_esp_ConfirmDialogTitle,
				300, 200,
				popupContent1,
				function() { GoPageConfirm(url); },
				function() { GoPageUnConfirm(url); },
				js_esp_ConfirmDialogYes,js_esp_ConfirmDialogNo);
	}
	else 
		GoPageConfirm(url);
}

function ErrorSubmit(url)
{
	//alert("Enter to GoPage(" +url +")");
	if ((js_mbv_ConfirmActions==1) && (showWarningPopup) && (document.getElementById('modal') != null) && (window.parent.LB_popup)) {
		popupContent1 = "<span style='font-weight: bold; font-family: verdana, arial, sans-serif; font-size: 12px;'>";
		popupContent1 += js_esp_ConfirmDialogText;
		popupContent1 += "</span>"; 
	
		window.parent.LB_popup(window.parent.document.getElementById ("GUI_master"),
				js_esp_ConfirmDialogTitle,
				300, 200,
				popupContent1,
				function() { Exit(); },
				function() { Exit(url); },
				js_esp_ConfirmDialogYes,js_esp_ConfirmDialogNo);
	}
	else 
		GoPageConfirm(url);
}

function Exit()
{
	if (window.parent.LB_popup) {
        window.parent.LB_hidePopup();
	}
}
function ButtonGoPageConfirm(buttName, url)
{
	if (buttState[buttName] == 0)
		return;

	GoPageConfirm(url);
}


function GoPageConfirm(url)
{
	document.location.href = url;
}

function GoPageUnConfirm(url)
{
	if (window.parent.LB_popup) {
		window.parent.LB_hidePopup();
	}

	FTDialogDisplayed=false;
	doingAConfirmedCancel = false;
	confirmedOK = false;
}

function ShowObject(liste)
{
	var i;
	var obj;

	for (i=0; i<liste.length; i++) {
		obj = document.getElementById(liste[i]);

		obj.style.display = '';
	}
}

function HideObject(liste)
{
	var i;
	var obj;

	for (i=0; i<liste.length; i++) {
		obj = document.getElementById(liste[i]);

		obj.style.display = 'none';
	}
}


function ButtonOver(type, buttName) {
	var linkobj;
	if (buttState[buttName] == 0)
		return;

	linkobj = document.getElementById('link' + buttName);

	linkobj.style.color = '#FF6600';
}

function ButtonOut(type, buttName) {
	var linkobj;
	if (buttState[buttName] == 0)
		return;

	ButtonUp(type, buttName);

	linkobj = document.getElementById('link' + buttName);

	linkobj.style.color = '#000000';
}

function ButtonDown(type, buttName) {
	var rowobj;
	var imgobj;
	var linkobj;

	if (buttState[buttName] == 0)
		return;
	
	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(/images/button/right-clic.gif)';
	imgobj.src = '/images/button/left-' + type + '-clic.gif';
	linkobj.style.color = '#FFFFFF';
}

function ButtonUp(type, buttName) {
	var rowobj;
	var imgobj;
	var linkobj;

	if (buttState[buttName] == 0)
		return;

	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(/images/button/right-normal.gif)';
	imgobj.src = '/images/button/left-' + type + '-normal.gif';
	linkobj.style.color = '#000000';
}

function ButtonEnable(type, buttName) {

	buttState[buttName] = 1;
}

function ButtonDisable(type, buttName) {

	buttState[buttName] = 0;
}

function AllButtonEnable(liste) {
	var i;

	if (liste.length < 2)
		return;

	if (liste.length % 2)
		return;

	for (i=0; i<liste.length; i=i+2)
		ButtonEnable(liste[i], liste[i+1]);
}

function AllButtonDisable(liste) {
	var i;

	if (liste.length < 2)
		return;

	if (liste.length % 2)
		return;

	for (i=0; i<liste.length; i=i+2)
		ButtonDisable(liste[i], liste[i+1]);
}

function SwitchDisplay(name, l1, l2) {
	var obj1;
	var obj2;
	obj1 = document.getElementById(name + l1).style;
	obj2 = document.getElementById(name + l2).style;

	value1 = obj1.display;
	value2 = obj2.display;

	obj1.display = value2;
	obj2.display = value1;
}


function SwitchFieldText(name, l1, l2) {
	var obj1;
	var obj2;
	obj1 = eval('document.' + name + l1);
	obj2 = eval('document.' + name + l2);

	value1 = obj1.value;
	value2 = obj2.value;

	obj1.value = value2;
	obj2.value = value1;
}

function SwitchFieldSelect(name, l1, l2) {
	var obj1;
	var obj2;

	obj1 = eval('document.' + name + l1);
	obj2 = eval('document.' + name + l2);

	value1 = obj1.selectedIndex;
	value2 = obj2.selectedIndex;

	obj1.selectedIndex = value2;
	obj2.selectedIndex = value1;
}

function SwitchFieldCheckbox(name, l1, l2) {
	var obj1;
	var obj2;

	obj1 = eval('document.' + name + l1);
	obj2 = eval('document.' + name + l2);

	value1 = obj1.checked;
	value2 = obj2.checked;

	obj1.checked = value2;
	obj2.checked = value1;
}


function Update_time_left() {
	var t;
	var hours;
	var minutes;
	var seconds;

	wait = wait + 1;

	t = (wait % 3600);
	
	hours = parseInt(wait / 3600);
	minutes = parseInt( t / 60);
	seconds = (t % 60);

	if( parseInt(seconds) < 10)
		seconds = "0" + seconds;
	
	if( parseInt(minutes) < 10 && parseInt(hours) > 0)
		minutes = "0" + minutes;

	if( parseInt(hours) >0 ) {
		if(document.all)
			document.all["PTS"].innerText = hours + " hr " + minutes + " mn " + seconds + " s";
		//else
		//	document.getElementById("PTS").innerHTML = hours + " hr " + minutes + " mn " + seconds + " s";
	 }
	 else {
		if(document.all)
			document.all["PTS"].innerText = minutes + " mn " + seconds + " s"; 
		//else
		//	document.getElementById("PTS").innerHTML = minutes + " mn "+ seconds + " s";
	}
}


function startPPPTimer() {
	Update_time_left();
	ID = window.setInterval("Update_time_left();" ,1000);
}


function resetObjectSelect(obj) {
	var i;
	var len;
	if (obj) {
		len = obj.length;
		for(i=0; i<len; i++) {
			if (obj.options[i].defaultSelected == true)
				obj.options[i].selected = true;
			else
				obj.options[i].selected = false;
		}
	}
}

function isChangedObjectSelect(obj) {
	var i;
	var len;

	if (obj) {
		len = obj.length;

		for(i=0; i<len; i++) {
			if (obj.options[i].defaultSelected != obj.options[i].selected)
				return true;
		}
	}

	return false;
}

function resetObjectCheckbox(obj) {
	if (obj) {
		obj.checked = obj.defaultChecked;
	}
}

function isChangedObjectCheckbox(obj) {
	var state;
	var dftstate;

	if (!obj)
		return false;

	state = obj.checked;
	dftstate = obj.defaultChecked;

	if (state != dftstate)
		return true;

	return false;
}


function resetObjectRadio(obj) {
	var n;
	var i;

	if (!obj)
		return false;
	
	n = obj.length;
	
	for (i=0; i<n; i++) {
		obj[i].checked = obj[i].defaultChecked;
	}

	return false;
}


function isChangedObjectRadio(obj) {
	var n;
	var i;

	if (!obj)
		return false;
	
	n = obj.length;
	
	for (i=0; i<n; i++) {
		if (obj[i].checked != obj[i].defaultChecked)
			return true;
	}

	return false;
}


function resetObjectText(obj) {
	if (obj) {
		obj.value = obj.defaultValue;
	}
}

function isChangedObjectText(obj) {
	var value;
	var dftvalue;

	if (!obj)
		return false;

	value = obj.value;
	dftvalue = obj.defaultValue;

	if (value != dftvalue)
		return true;

	return false;
}


function isDomainRequestSupported() {
	var http;

	http = createDomainRequestObject();

	if (http == false)
		return false;

	return true;
}


function createDomainRequestObject() {
	var http = false;

	try {
		if (window.XDomainRequest) {
			// Internet Explorer 8
			return false;
		}
		else if (window.XMLHttpRequest) {
			// Mozilla, Safari, ...
			http = new XMLHttpRequest();

			if (http.withCredentials == undefined)
				return false;
		}
	}
	catch (e) {
		http = false;
	}

	return http;
}

function createRequestObject() {
	var http = false;

	try {
		if (window.XMLHttpRequest) {
			// Mozilla, Safari, ...
			http = new XMLHttpRequest();
		}
		else if(window.ActiveXObject) {
			// Internet Explorer
			http = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	catch (e) {
		http = false;
	}

	return http;
}

