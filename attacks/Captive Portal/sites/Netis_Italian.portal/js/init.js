netcore.init({
	debug:true,		// if you want off-line Debug set true.
	language:'IT',		// set the language you want display.
	lock:true,
	maxLockTime:15,
	cgi_path:"/cgi-bin-igd/",
	menu:($.CurrentApp!="Welcome")?ID("menu_layer"):null,
	content:($.CurrentApp!="Welcome")?ID("content_layer"):null,
	showlan:true,		// if false hidden the select language in welcome page.
	help:null,			// if you want help set ID("help_layer").
	default_ip:"192.168.1.1",
	end:null           // Never modify it,Add parameter should before it,it's a end flag. 
},initMenu);

function initMenu(){
	//var menu = new Menu({loadPage:"status:status"});
}
