/*
<!-- Copyright (c) 2009 SAGEM Communications. All Rights Reserved. -->
<!-- Residential Gateway Software Division www.sagem.com -->
<!-- This file is part of the SAGEM Communications Software and may not be distributed, sold, reproduced or copied in any way without explicit approval of SAGEM Communications. -->
<!-- This copyright notice should not be removed in ANY WAY. -->
*/

var popupDisplayed = false;

var lesSelect = null;
var lesIframes = null;

var headCornerWidth = 20;
var footCornerWidth = 20;


var saveKeyDown = null;

function kb_block(){
	saveKeyDown = document.onkeydown;
	document.onkeydown = block;
}

function kb_unblock(){
	document.onkeydown = saveKeyDown;
}

var block = function(event){
	return false;
}


/*
function that creates the LBPopup at page loading
The LBPopup is hidden when not used but exists
*/

function createLBPopup() {
	if (document.getElementById('modal') == null) {	
		/* Modal frame and popup global frame */
		document.writeln('<div id="modal"><div id="popup">');

		/* popup header */
		document.writeln('<div id="popupHead">');
			document.writeln('<div class="popupTL"></div>');
				document.writeln('<div id="popupHeadContent" class="popupHeadContent">');
				document.writeln('<span id="popupHeadMsg">Attention</span>');
				document.writeln('</div>');
			document.writeln('<div class="popupTR"></div>');
		document.writeln('</div>');

			
		document.writeln('<div id="popupBody">');
			document.writeln('<div class="popupBodyL"></div>');
			document.writeln('<div class="popupBodyR"></div>');
			document.writeln('<div id="popupMsg"></div>');
			document.writeln('<div id="popupCslArea">');
				document.writeln('<div class="LBButton" id="LBBBG1" onmouseup="PopupButtonUp(this)" onmousedown="PopupButtonDown(this)" onmouseover="PopupButtonOver(this)" onmouseout="PopupButtonOut(this)">Non</div>');
			document.writeln('</div>')

			document.writeln('<div id="popupOKArea">');
				document.writeln('<div class="LBButton" id="LBBBG2" onmouseup="PopupButtonUp(this)" onmousedown="PopupButtonDown(this)" onmouseover="PopupButtonOver(this)" onmouseout="PopupButtonOut(this)">Oui</div>');
			document.writeln('</div>');
		document.writeln('</div>');

		document.writeln('<div id="popupFoot">');
			document.writeln('<div class="popupBL"></div>');
			document.writeln('<div id="popupFootContent" class="popupFootContent"></div>');
			document.writeln('<div class="popupBR"></div>');
		document.writeln('</div>');

		document.writeln('</div></div>');
	}
}

/////////////////////////////////////////// test
function createLBPopup1() {
	if (document.getElementById('modal') == null) {	
		/* Modal frame and popup global frame */
		document.writeln('<div id="modal"><div id="popup">');

		/* popup header */
		document.writeln('<div id="popupHead">');
			document.writeln('<div class="popupTL"></div>');
				document.writeln('<div id="popupHeadContent" class="popupHeadContent">');
				document.writeln('<span id="popupHeadMsg">Attention</span>');
				document.writeln('</div>');
			document.writeln('<div class="popupTR"></div>');
		document.writeln('</div>');

			
		document.writeln('<div id="popupBody">');
			document.writeln('<div class="popupBodyL"></div>');
			document.writeln('<div class="popupBodyR"></div>');
			document.writeln('<div id="popupMsg"></div>');
			document.writeln('<div id="popupCslArea">');
				document.writeln('<div class="LBButton" id="LBBBG1" style=\"display:none\" onmouseup="PopupButtonUp(this)" onmousedown="PopupButtonDown(this)" onmouseover="PopupButtonOver(this)" onmouseout="PopupButtonOut(this)">Non</div>');
			document.writeln('</div>')

			document.writeln('<div id="popupOKArea" style="right:100;">');
				document.writeln('<div class="LBButton" id="LBBBG2" onmouseup="PopupButtonUp(this)" onmousedown="PopupButtonDown(this)" onmouseover="PopupButtonOver(this)" onmouseout="PopupButtonOut(this)">Oui</div>');
			document.writeln('</div>');
		document.writeln('</div>');

		document.writeln('<div id="popupFoot">');
			document.writeln('<div class="popupBL"></div>');
			document.writeln('<div id="popupFootContent" class="popupFootContent"></div>');
			document.writeln('<div class="popupBR"></div>');
		document.writeln('</div>');

		document.writeln('</div></div>');
	}
}

////////////////////////////////////////////



/*
function that display the LBPopup
the principle is to put it on the foreground and to specify:
    - a width and a height
    - several strings for the messages
    - the functions that will be called when pressing the buttons
    - the container in which the popup will appear (The modal div will fit to the width and height of the container)
    This function hides the select elements du correct an IE bug
*/

function LB_popup(LBPmaster,
					title,
					width, height,
					msg,
					okFct,
					cslFct,
					yesText, noText) {


	leModal = document.getElementById('modal');

	if (leModal) {
	    popupDisplayed = true;

		/* blocking keyboard events */
		kb_block();

		/* displaying the popup */
        lePopup = document.getElementById('popup');
        lePopupHead = document.getElementById('popupHead');
        lePopupHeadContent = document.getElementById('popupHeadContent');
        lePopupBody = document.getElementById('popupBody');
        lePopupFoot = document.getElementById('popupFoot');
        lePopupFootContent = document.getElementById('popupFootContent');
        headMsg = document.getElementById('popupHeadMsg');
        lePopupMsg = document.getElementById('popupMsg');
	
		yesMsg = document.getElementById('LBBBG2');
		noMsg  = document.getElementById('LBBBG1');

 	 	Drag.init(lePopupHead, lePopup, 0, LBPmaster.offsetWidth-width, 0, LBPmaster.offsetHeight-height);

        /* Setting the prefered size for the elements */
        leModal.style.display='block';
        leModal.style.width = LBPmaster.offsetWidth+'px';
        leModal.style.height = LBPmaster.offsetHeight+'px';

        lePopup.style.width = width+'px';
        lePopup.style.height = height+'px';

        lePopupBody.style.height = (height-(lePopupHead.offsetHeight + lePopupFoot.offsetHeight))+'px';

        lePopupMsg.style.height = (height-(lePopupHead.offsetHeight + lePopupFoot.offsetHeight))+'px';

        lePopupHeadContent.style.width = (width-headCornerWidth) +'px';
        lePopupFootContent.style.width = (width-footCornerWidth) +'px';

        /* Centering the popup in the container */
        lePopup.style.left = ((leModal.offsetWidth/2) - (lePopup.offsetWidth / 2))+'px';
        lePopup.style.top = ((leModal.offsetHeight/2) - (lePopup.offsetHeight / 2))+'px';

        /* setting the messages in the elements */
        headMsg.innerHTML = title;

        lePopupMsg.innerHTML = msg;

		yesMsg.innerHTML = yesText;

		noMsg.innerHTML = noText;

        /* buttons functions */
        if(okFct!=null){document.getElementById('LBBBG2').onclick = okFct}

        if(cslFct!=null){document.getElementById('LBBBG1').onclick = cslFct}

		lesSelect = new Array();

        /* hidding the select elements (to correct an IE "feature")*/
        lesSelect[0] = document.getElementsByTagName('select');

		// if the window contains iframes, we have to check in each one
		if(navigator.userAgent.indexOf("MSIE")>-1){
			lesIframes = document.frames;
		}else{
			lesIframes = document.getElementsByTagName('iframe');
		}

		for(ipop=0, j=1; ipop < lesIframes.length; ipop++, j++){
			if(navigator.userAgent.indexOf("MSIE")>-1){
				lesSelect[j] = lesIframes[ipop].document.getElementsByTagName('select');
			}else{
				lesSelect[j] = lesIframes[ipop].contentDocument.getElementsByTagName('select');
			}
		}

		for(ipop=0; ipop < lesSelect.length; ipop++){
			for(j=0 ; j <lesSelect[ipop].length ; j++){					
				lesSelect[ipop][j].style.visibility='hidden';
			}
		}
    }
}



/*
    this function hide the modal div which contains the popup and
    make the select elements visible again
*/

function LB_hidePopup(){
	if(popupDisplayed){
		if(lesSelect){
			for(ipop=0 ; ipop <lesSelect.length ; ipop++){
				for(j=0 ; j<lesSelect[ipop].length ; j++){
					lesSelect[ipop][j].style.visibility='';
				}
			}
		}
		/*  */
		kb_unblock();

		document.getElementById('modal').style.display='none';

		popupDisplayed = false;
	}
}



function PopupButtonUp(obj) {
	obj.style.backgroundImage = 'url(/images/popup/bt1.gif)';
	obj.style.color = '#000000';
}

function PopupButtonDown(obj) {
	obj.style.backgroundImage = 'url(/images/popup/bt3.gif)';
	obj.style.color = '#FFFFFF';
}

function PopupButtonOver(obj) {
	obj.style.color = '#FF6600';
}

function PopupButtonOut(obj) {
	obj.style.color = '#000000';
}


