/*
<!-- Copyright (c) 2009 SAGEM Communications. All Rights Reserved. -->
<!-- Residential Gateway Software Division www.sagem.com -->
<!-- This file is part of the SAGEM Communications Software and may not be distributed, sold, reproduced or copied in any way without explicit approval of SAGEM Communications. -->
<!-- This copyright notice should not be removed in ANY WAY. -->
*/


// drag_resize.js
function getWindowHeight() {
			var windowHeight = 0;
			if (typeof(window.innerHeight) == 'number') {
				windowHeight = window.innerHeight;
			}
			else {
				if (document.documentElement && document.documentElement.clientHeight) {
					windowHeight = document.documentElement.clientHeight;
				}
				else {
					if (document.body && document.body.clientHeight) {
						windowHeight = document.body.clientHeight;
					}
				}
			}
			return windowHeight;
}
function getWindowWidth() {
			var windowWidth = 0;
			if (typeof(window.innerWidth) == 'number') {
				windowWidth = window.innerWidth;
			}
			else {
				if (document.documentElement && document.documentElement.clientWidth) {
					windowWidth = document.documentElement.clientWidth;
				}
				else {
					if (document.body && document.body.clientWidth) {
						windowWidth = document.body.clientWidth;
					}
				}
			}
			return windowWidth;
}

function getHeight(o){
		if(isNaN(parseInt(o.style.height))){
			return o.offsetHeight;
		}
		return parseInt(o.style.height);
	}
	
	function getWidth(o){
		if(isNaN(parseInt(o.style.width))){
			return o.offsetWidth;
		}
		return parseInt(o.style.width);
	}
	function getLeft(o){
		if(isNaN(parseInt(o.style.left))){
			return o.offsetLeft;
		}
		return parseInt(o.style.left);
	}
	
	function getTop(o){
		if(isNaN(parseInt(o.style.top))){
			return o.offsetTop;
		}
		return parseInt(o.style.top);
	}

var Drag = {

	obj : null,

	init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
	{
		o.onmousedown	= Drag.start;

		o.hmode			= bSwapHorzRef ? false : true ;
		o.vmode			= bSwapVertRef ? false : true ;

		o.root = oRoot && oRoot != null ? oRoot : o ;


		o.root.style.left   = isNaN(parseInt(o.root.style.left)) ? o.root.offsetLeft+'px' : parseInt(o.root.style.left)+'px';
		o.root.style.top   = isNaN(parseInt(o.root.style.top)) ? o.root.offsetTop+'px' : parseInt(o.root.style.top)+'px';
		if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
		if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";
		

		o.minX	= typeof minX != 'undefined' ? minX : null;
		o.minY	= typeof minY != 'undefined' ? minY : null;
		o.maxX	= typeof maxX != 'undefined' ? maxX : null;
		o.maxY	= typeof maxY != 'undefined' ? maxY : null;

		o.xMapper = fXMapper ? fXMapper : null;
		o.yMapper = fYMapper ? fYMapper : null;

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	},

	start : function(e)
	{
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		o.root.onDragStart(x, y);

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		if (o.hmode) {
			if (o.minX != null)	o.minMouseX	= e.clientX - x + o.minX;
			if (o.maxX != null)	o.maxMouseX	= o.minMouseX + o.maxX - o.minX;
		} else {
			if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
			if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
		}

		if (o.vmode) {
			if (o.minY != null)	o.minMouseY	= e.clientY - y + o.minY;
			if (o.maxY != null)	o.maxMouseY	= o.minMouseY + o.maxY - o.minY;
		} else {
			if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
			if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
		}

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;

		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
		var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
		var nx, ny;

		if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
		if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
		if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
		if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

		nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
		ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

		if (o.xMapper)		nx = o.xMapper(y)
		else if (o.yMapper)	ny = o.yMapper(x)

		Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
		Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
		//Drag.obj.root.onDragEnd(	parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"]), 
								//	parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"]));
		Drag.obj = null;
	},

	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};

/********************************************************************/
var Redim = {
	defaultX: null,
	defaultY: null,
	theMaster: null,
	theMasterBody: null,
	theMasterHead: null,
	theMasterFoot:null,
	theHead: null,
	theFoot: null,
	theFrame: null,
	theMain: null,
	theMasterBodyL: null,
	theMasterBodyR: null,
	lastX: 0,
	lastY: 0,

	init : function (bt){
		Redim.theMaster = document.getElementById('master');
		Redim.theMasterBody = document.getElementById('masterBody');
		Redim.theMasterHead = document.getElementById('masterHead');
		Redim.theMasterFoot = document.getElementById('masterFoot');
		Redim.theFrame = document.getElementById('theFrame');
		Redim.theMain = document.getElementById('main');
		Redim.theMasterBodyL = document.getElementById('masterBodyL');
		Redim.theMasterBodyR = document.getElementById('masterBodyR');
		Redim.defaultX = theMaster.offsetWidth;
		Redim.defaultY = theMaster.offsetHeight;
		bt.onmousedown = Redim.start;
	},
	start : function(e){
		e = Drag.fixE(e);
		Redim.lastX=e.clientX;
		Redim.lastY=e.clientY;
		document.onmousemove	= Redim.redim;
		document.onmouseup		= Redim.end;
	},
	redim : function(e){
		e = Drag.fixE(e);
		deplX=e.clientX-Redim.lastX;
		deplY=e.clientY-Redim.lastY;
	
		if(((Redim.theMaster.offsetWidth+deplX) < getWindowWidth()) && ((Redim.theMaster.offsetWidth+deplX) >= Redim.defaultX)){
			Redim.theMaster.style.width=(Redim.theMaster.offsetWidth+deplX)+'px';
			Redim.theMasterBody.style.width=(Redim.theMasterBody.offsetWidth+deplX)+'px';
			Redim.theMain.style.width=(Redim.theMain.offsetWidth+deplX)+'px';
			Redim.theMasterHead.style.width=(Redim.theMasterHead.offsetWidth+deplX)+'px';
			Redim.theMasterFoot.style.width=(Redim.theMasterFoot.offsetWidth+deplX)+'px';
			Redim.lastX=e.clientX;
		}
		
		if(((Redim.theMaster.offsetHeight+deplX) < getWindowHeight()) && ((Redim.theMaster.offsetHeight+deplY) >= Redim.defaultY)){
			Redim.theMaster.style.height=(Redim.theMaster.offsetHeight+deplY)+'px';
			Redim.theMasterBody.style.height=(Redim.theMasterBody.offsetHeight+deplY)+'px';
			Redim.theFrame.style.height=((Redim.theFrame.offsetHeight-1)+deplY)+'px'; //border
			Redim.theMain.style.height=(Redim.theMain.offsetHeight+deplY)+'px';
			Redim.theMasterBodyL.style.height=(Redim.theMasterBodyL.offsetHeight+deplY)+'px';
			Redim.theMasterBodyR.style.height=(Redim.theMasterBodyR.offsetHeight+deplY)+'px';
			Redim.lastY=e.clientY;
		}
	
	},
	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
	},
	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};
