var buttState = new Array();

js_mbv_ConfirmActions = 0;
showWarningPopup = 0;

imgexpand = new Image();
imgexpand.src = 'images/menu/expand.png';

imgcollapse = new Image();
imgcollapse.src = 'images/menu/collapse.png';

imgarrowrightwhite = new Image();
imgarrowrightwhite.src = 'images/menu/arrowrightwhite.png';

imgarrowrightorange = new Image();
imgarrowrightorange.src = 'images/menu/arrowrightorange.png';


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

function DisplayMenu(menuID)
{
	var i;
	var divobj;
	var imgobj;

	for (i = 1; i <= 3; i++) {
		divobj = document.getElementById('submenu' + i);

		if (!divobj)
			continue;

		imgobj = eval('document.imgmenu' + i);

		if (!imgobj)
			continue;

		if (i == menuID) {
			if (divobj.style.display == 'block') {
				divobj.style.display = 'none';
				imgobj.src = imgexpand.src;
			}
			else {
				divobj.style.display = 'block';
				imgobj.src = imgcollapse.src;
			}
		}
		else {
			divobj.style.display = 'none';
			imgobj.src = imgexpand.src;
		}
	}
}

function MouseOnArrow(row, imgName, cellName) {
	var obj;

	obj = eval('document.' + imgName);

	row.style.background = '#FF6600';
	obj.src = imgarrowrightwhite.src;

	obj = document.getElementById(cellName);

	obj.style.color = '#FFFFFF';
	obj.style.fontWeight = 'bold';
}

function MouseOutArrow(row, imgName, cellName) {
	var obj;

	obj = eval('document.' + imgName);

	row.style.background = '#FFFFFF';
	obj.src = imgarrowrightorange.src;

	obj = document.getElementById(cellName);

	obj.style.color = '#000000';
	obj.style.fontWeight = 'normal';
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

function setClasseNameS(elm, paramClassName) {
	if (elm)
		if (elm.className.indexOf('selected') < 0)
			elm.className = paramClassName;
}

function MouseDownVignette(num) {
	var obj;

	obj = document.getElementById('vignette' + num);

	obj.style.backgroundImage = 'url(/images/hardware/round_bg_clic.gif)';
}

function MouseUpVignette(num) {
	var obj;

	obj = document.getElementById('vignette' + num);

	obj.style.backgroundImage = 'url(/images/hardware/round_bg.gif)';
}

function ButtonChange(type, buttName) {
	if (buttState[buttName] == 1)
		ButtonDisable(type, buttName);
	else
		ButtonEnable(type, buttName);
}

function ButtonEnable(type, buttName) {
	var rowobj;
	var imgobj;
	var linkobj;

	buttState[buttName] = 1;

	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(/images/button/right-normal.gif)';
	imgobj.src = '/images/button/left-' + type + '-normal.gif';
	linkobj.style.color = '#000000';
}

function ButtonDisable(type, buttName) {
	var rowobj;
	var imgobj;
	var linkobj;

	buttState[buttName] = 0;

	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(/images/button/right-disable.gif)';
	imgobj.src = '/images/button/left-' + type + '-disable.gif';
	linkobj.style.color = '#666666';
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

function EnableRadio(name)
{
}

function DisableRadio(name)
{
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
		else
			document.getElementById("PTS").innerHTML = hours + " hr " + minutes + " mn " + seconds + " s";
	 }
	 else {
		if(document.all)
			document.all["PTS"].innerText = minutes + " mn " + seconds + " s"; 
		else
			document.getElementById("PTS").innerHTML = minutes + " mn "+ seconds + " s";
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

//Eject USB Device POPUP
//Added By A. Lamis 
function EjectUSBPopUp(url)
{
	if ((js_mbv_ConfirmActions==1) && (showWarningPopup) && (document.getElementById('modal') != null) && (window.parent.LB_popup)) {
		popupContent1 = "<span style='font-weight: bold; font-family: verdana, arial, sans-serif; font-size: 12px;'>";
		popupContent1 += js_esp_ConfirmDialogText;
		popupContent1 += "</span>"; 

		window.parent.LB_popup(window.parent.document.getElementById ("GUI_master"),
				js_esp_ConfirmDialogTitle,
				300, 200,
				popupContent1,
				function() { EjectConfirm(url); },
				function() { EjectUnConfirm(url); },
				js_esp_ConfirmDialogYes,js_esp_ConfirmDialogNo);
	}
	else 
		GoPageConfirm(url);
}

function EjectConfirm(url)
{
	EjectUnConfirm(url);
  	GetEjectStatus();
}

function EjectUnConfirm(url)
{
	if (window.parent.LB_popup) {
		window.parent.LB_hidePopup();
	}

	FTDialogDisplayed=false;
	doingAConfirmedCancel = false;
	confirmedOK = false;
}

