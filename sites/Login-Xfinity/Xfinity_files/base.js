//Copyright 2011-2012, ARRIS Group, Inc., All rights reserved.
var _afterBuild = new Array();
var _afterApply = new Array();
var ag = null;
var _technician = { };
var base = "";
var basePath = "";
var _lastEvent;

function supports_html5_storage() {
    try {
        return 'sessionStorage' in window && window['sessionStorage'] !== null;
    } catch (e) {
        return false;
    }
}
var _sessionStorage = supports_html5_storage() ? sessionStorage : null ;
function getSessionStorage(key) {
    if (_sessionStorage)
        return _sessionStorage[key];
    return Base64.decode(readCookie(key));
}
function setSessionStorage(key,value) {
    if (_sessionStorage)
        _sessionStorage[key] = value;
    else createCookie(key, Base64.encode(value));
}

// 1 - log, 2-show,4-verify,8-notrans, 64-set1 128-setmult
function debug(value) {
    if (value !== undefined)
        setSessionStorage("ar_debug_state",value);
    return getSessionStorage("ar_debug_state") || 0;
}
function hardwareVersion(substring) {
    if (getSessionStorage("ar_hw_version") === undefined || getSessionStorage("ar_hw_version")===null)
      setSessionStorage("ar_hw_version", snmpGet1(arHardwareVersion.oid+".0") || "???");
    var hv = getSessionStorage("ar_hw_version");
    if (substring !== undefined)
        return hv.indexOf(substring) != -1;
    return hv;
}
function customerId() {
    if (getSessionStorage("ar_cust_id") === undefined || getSessionStorage("ar_cust_id") === null) {
        setSessionStorage("ar_cust_id",  snmpGet1(arCustomID.oid+".0") || "0");
    }
    return getSessionStorage("ar_cust_id").asInt();
}

function userRadioControl() {
    if (getSessionStorage("ar_user_rc") === undefined || getSessionStorage("ar_user_rc") === null) {
        setSessionStorage("ar_user_rc", snmpGet1(arWiFiRadioControlMode.oid+".0").asInt(0) === 0 ? 1 : 0);
    }
    return getSessionStorage("ar_user_rc") == "1";
}

function language() {
    if (getSessionStorage("ar_language") === undefined || !getSessionStorage("ar_language")) {
        setSessionStorage("ar_language",  snmpGet1(arLanguage.oid+".0") || "English");
    }
    return getSessionStorage("ar_language");
}
function clearLanguage() {
    setSessionStorage("ar_language", "");
}


function isTwc() {
    return customerId() === 3;
}
function isSuddenlink() {
    return customerId() === 12;
}

var menuStateLoaded = false;
function loadMenus() {
    if (!menuStateLoaded && (getSessionStorage("ar_hide") === undefined || !getSessionStorage("ar_hide"))) {
        menuStateLoaded = true;

        var table = [ ] ; // table stopped working WebAccessTable.getTable([arWebAccessPage]);
        for (var i=1; i<20; i++) {
            var s = snmpGet1(arWebAccessPage.oid+"."+i);
            if (s)
                table.push([s]);
            else break;
        }

        var hides = ";";
        var disables = ";";
        function loadRow(row) {
            var ss = row[0].split(";");
            _.each(ss, function(sss) {
               var ssss = sss.split(":");
                if (ssss[0] === "hide")
                    hides += ssss[1]+";";
                if (ssss[0] === "disable")
                    disables += ssss[1]+";";
            });
        }
        _.each(table, loadRow);
        setSessionStorage("ar_hide",  hides);
        setSessionStorage("ar_disable",  disables);
    }
}

// todo: verify twc here
function menuVisible(s) {
    loadMenus();
    return (isTechnician() && !isTwc()) || !s || !(getSessionStorage("ar_hide").contains(s+";"));
}
function submenuVisible(s) {
    loadMenus();
    return (isTechnician() && !isTwc()) || !s || !(getSessionStorage("ar_hide").contains(s+";"));
}
function pageEnabled(s) {
    loadMenus();
    return (isTechnician() && !isTwc()) || !s || !(getSessionStorage("ar_disable").contains(s+";"));
}
function fieldsetVisible(s) { 
    loadMenus();
    return isTechnician() || !s || !(getSessionStorage("ar_hide").contains(base+"_"+s+";"));
}

jQuery.fn.valOrChecked = function(v) {
    var vals = [];
    this.each(function() {
        var a = $(this);
        if (v !== undefined) {
            if (a.is(':checkbox'))
                a.attr("checked", !(v == "0"));
            else a.val(v);
            vals[0] = this;
        } else {
            vals.push(a.is(':checkbox') ? (a.is(":checked") ? 1 : 0) : a.val());
        }
    });
    return vals[0];
};

$.fn.truncateTextToFit = function() {
    this.each(function() {
    if ($(this).textWidth() <= $(this).width())
        return;
    var t = $(this).text();
    $(this).attr("title",t);
    while ($(this).textWidth() > $(this).width()) {
        $(this).text(t.substr(0, t.length-1));
        t = $(this).text();
    }
    $(this).html(t.substr(0, t.length-2)+" &hellip;");
    })
};


jQuery.log = function(message) {
    if (debug()&1 && window.console && window.console.debug) {
        window.console.debug(message);
    }
};
jQuery.fn.textWidth = function(){
 var calc = '<span style="display:none">' + $(this).text() + '</span>';
 $('body').append(calc);
 var width = $('body').find('span:last').width();
 $('body').find('span:last').remove();
 return width;
};

Boolean.prototype.asInt = function() {
    return this.valueOf() ? 1 : 0;
}
Number.prototype.asInt = function() {
    return Math.floor(this);
}

Number.prototype.asString = function(len) {
    var s = this.toString();
    if (s.length < len)
        return "00000000000000000000000000000000".substr(0, len - s.length) + s;
    return s;
}
Number.prototype.asHexString = function(len) {
    var s = this.toString(16);
    if (s.length < len)
        return "00000000000000000000000000000000".substr(0, len - s.length) + s;
    return s;
}
String.prototype.asInt = function(nanVal) {
    var v = parseInt(this,10);
    return isNaN(v) ? nanVal : v;
}
String.prototype.fmt = function () {
    var args = arguments;
    var pattern = new RegExp("%([0-" + arguments.length + "])", "g");
    return this.replace(pattern, function(match, index) {
        return args[index];
    });
}

String.prototype.varsub = function(subfunc) {
    var ss = this;
    if (this.indexOf('{{') !== -1)
        _.each(this.match(/{{[^}]*}}/g) || [], function(s) {
           ss = ss.replace(s,subfunc(s.substr(2,s.length-4)));
        });
    return ss.valueOf();
}

String.prototype.startsWith = function(str) {
    return (this.indexOf(str) === 0);
}
String.prototype.endsWith = function (str) {
    var lastIndex = this.lastIndexOf(str);
    return (lastIndex != -1) && (lastIndex + str.length == this.length);
}
String.prototype.grow = function(i) {
    var len = this.length + i;
    if (len < 0)
        len = 0;
    if (len <= this.length) {
        return this.substr(0, len);
    } else {
        var s = this;
        while (len-- > this.length)
            s += " ";
        return s;
    }
}
String.prototype.contains = function () {
    for (var i=0; i<arguments.length; i++)
        if (this.indexOf(arguments[i]) !== -1)
            return true;
    return false;
}
String.prototype.padLeft = function(ch,len) {
    var l = len - this.length;
    var s = ""+this;
    while (l-->0) {
        s = ch+s;
    }
    return s;
};
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

Array.prototype.unique = function unique(keyfunc) {
    if (!keyfunc) keyfunc = function(a) { return a; };
    var o = { };
    _.each(this, function(e) { o[keyfunc(e)]=true; })
    var ua = [  ];
    _.each(this, function(e) { if (o[keyfunc(e)]) ua.push(e); o[keyfunc(e)]=false; });
    return ua;
}

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    isBase64 : function(input) {
        for (var i=0; i<input.length; i++) {
            if (_keyStr.indexOf(input.charAt(i) === -1))
                return false;
        }
        return true;
    },
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}
		return output;
	},
	// public method for decoding
	decode : function (input) {
        if (input === null)
            return "";
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = Base64._utf8_decode(output);
		return output;
	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}





function createCookie(name, value, seconds) {
    var expires = "";
    if (seconds) {
        var date = new Date();
        date.setTime(date.getTime() + (seconds * 1000 + 15));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function updateCookieExpiration(name, seconds) {
    var cookie = readCookie(name);
    if (!cookie)
        return;
    eraseCookie(cookie);
    createCookie(name, cookie, seconds);
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function htmlEscape(s) {
    s = ""+s; // make sure a string
    return  s.replace(/&/g,'&amp;').
                replace(/>/g,'&gt;').
                replace(/</g,'&lt;').
                replace(/"/g,'&quot;');
}
var _nextName = 0;
function getNextName(base) {
    return "_" + base + "_" + (_nextName++);
}

function buildTag(thetag) {
    return function () {
        var def = { tag: thetag };
        var contents = [];
        def.toHTML = function () {
            var str = "";
            if (def.constructor == Array) {
                for (var i = 0; i < def.length; i++)
                    str += def[i].toHTML();
                return str;
            }
            str += "<" + def.tag + " ";
            $.each(def, function (key, value) {
                if (!key || key.charAt(0) == '_' || key == "tag" || key == "contents" || key == "text" || typeof value !== "string")
                    return key;
                str += key + "=\"" + value + "\" ";
            });
            str += ">";
            if (def.text)
                str += def.text;
            if (def.contents) {
                if (def.contents.constructor == Array) {
                    for (i = 0; i < def.contents.length; i++)
                        str += def.contents[i].toHTML();
                } else {
                    str += def.contents.toHTML();
                }
            }
            str += "</" + def.tag + ">";
            return str;
        };
        var add = function () {
            for (var i = 0; i < arguments.length; i++) {
                var a = arguments[i];
                if (!a)
                    continue;
                if (typeof a === "string") {
                    var index = a.indexOf(":");
                    var key = a.substr(0, index);
                    var val = a.substr(index + 1);
                    val = val.varsub(function(s) { return s.startsWith("=") ?  eval(s.substring(1)) : xlate(s); });
                    def[key] = val;
                } else if (typeof a == "function") {
                    var fname = a.toString();
                    fname = fname.substring(fname.indexOf(" ") + 1, fname.indexOf("("));
                    var uniquefname = getNextName(fname);
                    window[uniquefname] = function (e) {
                        _lastEvent = window["event"] ? event : e;
                        a(_lastEvent);
                    };
                    def[fname] = "{ " + uniquefname + "(arguments[0]);}";
                } else if (_.isArray(a)) {
                    for (var j = 0; j < a.length; j++)
                        add(a[j]);
                } else {
                    contents.push(a);
                }
            }
        };
        add.apply(this, arguments);
        if (contents.length)
            def["contents"] = contents;
        return def;
    };
}


$.each([ "a","abbr","acronym","address","applet","area","b","base","basefont","bdo","big","blockquote","body","br","button","caption","center","cite","code","col","colgroup","dd","del",
    "dfn","dir","div","dl","dt","em","fieldset","font","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","hr","html","i","iframe","img","input","ins","isindex","kbd","label",
    "legend","li","link","map","menu","meta","noframes","noscript","object","ol","optgroup","option","p","param","pre","q","s","samp","script",
    "select","small","span","strike","strong","style","sub","sup","table","tbody","td","textarea","tfoot","th","thead","title","tr","tt","u","ul","var" ]
        , function(i, t) {
    if (window["_" + t])
        throw("error _" + t + " already defined.");
    window["_" + t] = buildTag(t);

});

function parseLabel(label) {
    var index = label.indexOf(":");
    if (index == -1) {
        return { label: label, oid: "" };
    } else {
        var key = label.substr(0, index);
        var val = label.substr(index + 1);
        //OIDs.push(val);
        return { label: key, oid: val };
    }
}

// $("body").width()

function helpTag(label1, text) {
    var t = text || helpText(label1);
    afterBuild(function() {
        $("#"+label1+"_image_tt").mouseenter(function(e) {
            $("body").append("<div id='ttip' class=toolTip></div>");
            $("#ttip").text(t);
            $("#ttip").css('z-index',"11000");
            $("#ttip").css('top', $(this).offset().top);
            $("#ttip").css('left',$(this).offset().left+32);
            $("#ttip").show();
        });
        $("#"+label1+"_image_tt").mouseleave(function(e) {
           $("#ttip").remove();
        });
    });
    return  _div("style:display:inline;",  _img("id:"+label1+"_image_tt", "src:" + basePath + "i/help.png", "height:16px", "width:16px", "style:padding-left:10px;padding-right:10px;"
        ));
}
//    return  _img("class:tipped", "src:" + basePath + "i/help.png", "height:16px", "width:16px", "style:padding-left:10px;padding-right:10px;", "title:" + helpText(label1));


function inlineButton(label1, onclick) {
    return _tr(_td("width:35%", "text:" + xlate(label1)), _td(_input("type:button", "id:" + label1, "value:{{"+label1+"}}", onclick), helpTag(label1)));
}
function inlineButtonRaw(label1, onclick) {
    return _tr(_td(_input("type:button", "id:" + label1, "value:{{"+label1+"}}", onclick)));
}
function inlineButtonRaw2(label1, onclick,label2, onclick2) {
    return _tr(_td(_input("type:button", "id:" + label1, "value:{{"+label1+"}}", onclick),_input("type:button", "id:" + label2, "value:{{"+label2+"}}", onclick2)));
}
function inlineButtonImage(label1, image, onclick) {
    return _tr(_td("width:35%", "text:{{"+label1+"}}"), _td(_input("type:image", "id:" + label1, "src:" + image, onclick), helpTag(label1)));
}


function formatter(args) {
    var f = { };
    f.load = function(v) {
        return v === undefined || v === null ? "" : v;
    };
    f.store = function(v) {
        return v === undefined || v === null ? "" : v;
    };
    f.validate = function(v) {
        if (this.notEmpty && (""+v).length == 0)
            throw xlate("%s: must have a value", f.label);
        if (this.notZero && v.asInt() === 0)
            throw xlate("%s: must be a positive number", f.label);
        return v;
    };
    f.storeAndValidate = function(v) {
        return f.store(f.validate(v));
    };
    if (args) {
        _.each(args, function(v, k) {
            f[k] = v;
        });
    }
    return f;
}

function textFormatter(args) {
    var o = formatter(args);
    o.load = function(v) {
        v = ( v === undefined || v === null) ? "" : v;
        if (v && isHexString(v) && v.endsWith(" 00")) { // strip improper null term
            v = v.substr(0, v.length-3);
            v = hexToString(v);
        }
        return v;
    };
    return o;
}





function text(label1, fmt, helpText) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    var f = fmt ? fmt : formatter();
    //    afterBuild(function() {
    //        $("#"+label1).bind("change", function() {
    //            adirty[label1] = $("#"+label1).valOrCheckd();
    //        });
    //    });
    if (f.store)
        afterApply(function() {
            if (ag[label1] !== undefined) {
                if (!$("#"+label1).attr("disabled")) {
                    var v =(f.validate($("#" + label1).valOrChecked()));
                    ag.dirty[label1] = ag[label1] !== v;
                    if (ag.dirty[label1])
                        $.log("dirty "+label1+" "+ag[label1]+" "+v);
                    ag[label1] = f.store(v);
                    }
            } else ag.dirty[label1] = true;

        });
    var type = label1.indexOf("Password") != -1 ? "password" : "text";
    if (label1 == "Keystring")
        type = "password";

    if (f.password)
        type = "password";
    f.label = xlate(label1);
    ag[label1] = f.load ? f.load(ag[label1]) : ag[label1];
    return _tr(_td("width:35%", "text:{{"+label1+"}}"), _td(_input("type:" + type, "id:" + label1, "value:" + htmlEscape(""+ag[label1]),
            (f.size ? "size:" + f.size : null)), helpTag(label1, helpText)));
}
function text2(label1, fmt, sepText, helpText) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    var f = fmt ? fmt : formatter();
    var l = parseLabel(label1);
    if (f.store)
        afterApply(function() {
            if (ag[label1] !== undefined) {
                var v1 = (f.validate($("#" + label1).valOrChecked()));
                ag.dirty[label1] = ag[label1] !== v1;
                ag[label1]  = f.store(v1);
            } else ag.dirty[label1] = true;
            if (ag[label1 + "_1"] !== undefined) {
                var v2 = (f.validate($("#" + label1 + "_1").valOrChecked()));
                ag.dirty[label1 + "_1"] = ag[label1 + "_1"] !== v2;
                ag[label1 + "_1"]  = f.store(v2);
            } else ag.dirty[label1 + "_1"] = true;
        });
    ag[label1] = f.load(ag[label1]);
    ag[label1 + "_1"] = f.load(ag[label1 + "_1"]);
    f.label = xlate(label1);

    return _tr(_td("width:35%", "text:{{" + label1 + "}}"),
            _td(_input("type:text", "id:" + l.label, (f.size ? "size:" + f.size : null), "value:" + htmlEscape(""+ag[label1])), _b("text:" + (sepText !== undefined ? "&nbsp;" + sepText + "&nbsp;" : "")), _input("type:text", (f.size ? "size:" + f.size : null), "id:" + l.label + "_1", "value:" + htmlEscape(""+ag[label1 + "_1"])), helpTag(label1, helpText)));
}
function rotext(label1, fmt) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    var f = fmt ? fmt : formatter();
    var l = parseLabel(label1);
    ag[label1] = f.load ? f.load(ag[label1]) : ag[label1];

    return _tr(_td("width:35%", "text:{{" + label1 + "}}"), _td(_input("type:text", "id:" + l.label, (f.size ? "size:" + f.size : null), "class:read_only", "disabled:disabled", "value:" + htmlEscape(ag[label1])), helpTag(label1)));
}
function snmpText(label1, val, size) {
    return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_input("type:text", "class:read_only", "disabled:disabled", "value:" + val,
            (size !== undefined ? "size:" + size : null))));

}
var snmpTextEditId = 0;
function snmpTextEdit(label1, val, size) {
    return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_input("id:snmpTextEdit"+(snmpTextEditId++),"type:text","value:" + val,
            (size !== undefined ? "size:" + size : null))));
}
function snmpTextArea(label1, val) {
    return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_textarea("rows:6", "cols:50", "class:read_only", "disabled:disabled", "text:" + val
            )));

}


function snmpFieldset(label1, contents) {
    return _div("id:" + label1, _h4("text:{{" + label1+"}}"), _table("class:common_table", _tbody($.makeArray(arguments).slice(1))));
}

function form(label1, label2, contents) {
    return _div(_div("class:description", _h3("text:{{" + label1+"}}"), _div("text:{{" + label2+"}}")),
        //_div("id:loading_distractor" , "style:display: none;",
        //"style:position:absolute;left:300px;top:350px;z-index:9;",
        //_span(_img("src:i/distractor.gif"))),
            $.makeArray(arguments).slice(2), _br(), _br());
}

function fieldset(label1, contents) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    if (!fieldsetVisible(label1))
        afterBuild(function() { $("#" + label1).hide(); });
    return _div("id:" + label1, _h4("text:{{" + label1+"}}"), _table("class:common_table", _tbody($.makeArray(arguments).slice(1))));
}
function checkbox(label1, onchange, helpText) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    afterApply(function() {
        if (ag[label1] !== undefined) {
            var v = $("#" + label1).valOrChecked();
            ag.dirty[label1] = ag[label1] != v;
            ag[label1] = v;
        } else  ag.dirty[label1] = true;
    });

    //checkboxItem(label1);
    var l = parseLabel(label1);
    var checked = ag[label1];

    if (checked)
        return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_input("type:checkbox", "id:" + l.label, "checked:true", onchange), helpTag(label1, helpText)));
    else return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_input("type:checkbox", "id:" + l.label, onchange), helpTag(label1, helpText)));
}

// nb: values must be get set explicitly
function checkbox4(label1, label2,label3, label4) {
    if (technicianOnly(label1) && !isTechnician())
        return null;

    function buildCheck(name) {
        var al = [ ];
        if (name) {
            al.push(_input("type:checkbox", "name:"+name, "id:"+name));
            al.push(_label("for:"+name, "text:&nbsp; &nbsp; &nbsp;"+name));
        }
        return al;
    }

   return _tr(_td("width:25%", buildCheck(label1)), _td("width:25%", buildCheck(label2)),_td("width:25%", buildCheck(label3)), _td("width:25%", buildCheck(label4)));
}


function select(label1, vals, onchangefunc, selectedValue, helpText) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    vals = _.without(vals, null);
    var dirty = false;
    // selectItem(label1);
    var l = parseLabel(label1);
    var options = [];
    var value = selectedValue || ag[label1];
    var haveSelected =  _.any(vals, function(v) { return v.split(":")[0] == value; });
    var options = _.map(vals, function f(v, index) {
        v = v.split(":");
        if (v[0] == value || (!haveSelected && index ===0))
            return  _option("value:" + v[0], "text:" + htmlEscape(v[1]), "selected:selected");
        else return  _option("value:" + v[0], "text:" + htmlEscape(v[1]));
    });
    afterApply(function() {
        if (ag[label1] !== undefined) {
            var v = $("#" + label1).valOrChecked();
            ag.dirty[label1] = ag[label1] !== v;
            ag[label1] = v;
        } else  ag.dirty[label1] = true;
    });
    return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_select("id:" + l.label, options, function onchange() {
        dirty = true;
        if (onchangefunc)
            onchangefunc();
    }), helpTag(label1, helpText)));
}
function select2(label1, vals, onchange, sepText) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    afterApply(function() {
        if (ag[label1] !== undefined) {
            var v1 = $("#" + label1).valOrChecked();
            ag.dirty[label1] = ag[label1] !== v1;
            ag[label1] = v1;
        }  ag.dirty[label1] = true;
        if (ag[label1 + "_1"] !== undefined) {
            var v2 = $("#" + label1 + "_1").valOrChecked();
            ag.dirty[label1+ "_1" ] = ag[label1 + "_1"] !== v2;
            ag[label1+ "_1"] = v2;
        }  ag.dirty[label1+"_1"] = true;
    });
    vals = _.without(vals, null);
    var l = parseLabel(label1);
    var options = [];
    for (var i = 0; i < vals.length; i++) {
        var index = vals[i].indexOf(":");
        options[i] = _option("value:" + vals[i].substr(0, index), "text:" + vals[i].substr(index + 1));
    }
    return _tr(_td("width:35%", "text:{{" + label1+"}}"), _td(_select("id:" + l.label, options, onchange),
            _b("text:" + (sepText !== undefined ? "&nbsp;" + sepText + "&nbsp;" : "")),
            _select("id:" + l.label + "_1", options, onchange), helpTag(label1)));
}

function select2Optional(label1, vals, onchange, sepText, optionalCheckText) {
    if (technicianOnly(label1) && !isTechnician())
        return null;
    afterBuild(function() {
        $("#" + l.label + "div").hide();
    });
    afterApply(function() {
        if (ag[label1] !== undefined) {
            ag[label1 + "_Checked"] = $("#" + label1 + "check").valOrChecked();
        }
        if (ag[label1] !== undefined) {
            ag[label1] = $("#" + label1).valOrChecked();
        }
        if (ag[label1 + "_1"] !== undefined) {
            ag[label1 + "_1"] = $("#" + label1 + "_1").valOrChecked();
        }
    });
    vals = _.without(vals, null);
    var l = parseLabel(label1);
    var options = [];
    for (var i = 0; i < vals.length; i++) {
        var index = vals[i].indexOf(":");
        options[i] = _option("value:" + vals[i].substr(0, index), "text:" + vals[i].substr(index + 1));
    }
    return _tr(_td("width:35%", "text:{{" + label1+"}}"),
            _td(_div("style:height:24px;width:100px;", _input("id:" + l.label + "_Checked", "type:checkbox", "checked:checked",
                  function onclick() {
                if (!$("#" + l.label + "_Checked").valOrChecked()) {
                    $("#" + l.label + "div").show();
                } else {
                    $("#" + l.label + "div").hide();
                }
            }

//                    function onchange() {
//                if (!$("#" + l.label + "_Checked").valOrChecked()) {
//                    alert("show "+("#" + l.label + "div"));
//                    $("#" + l.label + "div").show();
//                } else {
//                    alert("hide "+("#" + l.label + "div"));
//                    $("#" + l.label + "div").hide();
//                }
//            }
                    ), _b("text:" + optionalCheckText)),
                //   <label for="check3">U</label>
                    _div("id:" + l.label + "div",
                            _select("id:" + l.label, options, onchange),
                            _b("text:" + (sepText !== undefined ? "&nbsp;" + sepText + "&nbsp;" : "")),
                            _select("id:" + l.label + "_1", options, onchange), helpTag(label1))));
}
function ApplyButton() {
    return buttons("{{Apply}}", function onclick(event) {
        Apply();
    });
}

function buttons() {
    var buttons = [];
    for (var i = 0; i < 4; i++)
        if (arguments[i * 2]) {
            buttons.push(_input("type:button", "value:" + arguments[i * 2], "class:submitBtn", arguments[i * 2 + 1]));
        }

    return _div(_br(), buttons);
}
function dialog(id, title, elements, okName, okAction) {
    var buttonsDef = { };
    buttonsDef[xlate("Cancel")] = function() {
        $(this).dialog("close");
    };
    buttonsDef[xlate(okName)] = function() {
        try {
            okAction.apply(this);
        } catch (e) {
            handleError(e);
        }
    };
    window["dialog_" + id] = {
        autoOpen: false, width:500, modal: true,
        dialogClass: "fieldgrp",
        buttons: buttonsDef
    };

    return _div("id:" + id, "title:" + xlate(title), _table("class:common_table", _tbody(elements)));
}
function prepareDialog(id) {
    $("#" + id).dialog(window["dialog_" + id]);
}

function getURLArgs() {
    var pos = location.href.lastIndexOf('?');
    if (pos == -1)
        return "";
    var s = decodeURI(location.href.substr(pos + 1)).split("&");
    var page = s[0];
    _.each(s, function(a) {
       if (a.startsWith("debug")) {
           debug(a.substr(5));
       }
    });
    return page;
}

function getPage() {
    var v = window.location.pathname;
    if (v.startsWith("/"))
        v = v.slice(1);
    return v;
}


function goRebuild(tag) {
    window.event.preventDefault();
    rebuild(tag);
    // window.open(getPage()+'?'+tag, "_self");
}
function go(tag) {
    window.open(getPage() + '?' + tag, "_self");
}

function buildShell() {
    $.log("buildShell");

    if (typeof noMenus !== "undefined" && noMenus) {
        var shell = _div("id:wrapper",
                _div("id:content",
                        _div("id:tabs",
                                _div("id:first",
                                        _div("id:placeholder",
                                                _table(_tbody(_tr(
                                                        _td(_div("id:mainpage"))))))
                                        ))),
                _div("id:walk-dialog", "title:", "style:display: none;"),
                 _div("id:action-dialog", "title:", "style:display: none;"),
                    _div("id:error-dialog", "title:", "style:display: none;"),
                     _div("id:wait-dialog", "title:", "style:display: none;", "text:Applying Changes...")
                );
        $(shell.toHTML()).appendTo("body");


        $("body").css("background", "transparent");
        $("#wrapper").css("background", "transparent");
        $("#footer").css("background", "transparent");
        $("#wrapper").css("width", "650");


        return;
    }

    //id page children
    var m = menu();
    if (!isLoggedIn()) {
        m = [
            { id: "Login", page: "login", children: [
                { id: "Login", page:"login" }
            ] }
        ];
    }

    var hash = isLoggedIn() ? (getURLArgs() || m[0].page) : "login";

    var index = 0;

    function sel(p) {
        return getPage() == p ? "class:selected" : null;
    }

    //    var topNav = _ul("id:nav",
    //            _li(_a(sel("router.html"), "href:router.html", "text:Wireless")), // "href:router.html",
    //            _li(_a(sel("cm.html"), "href:cm.html", "text:HSD" )), // "href:router.html",
    //           // _li(_a("href:voice.html", "text:Voice")), // "class:end"
    //            //_li(_a("href:phy.htm", "class:end", "text:Voice")),
    //            _li(_a("href:"+getPage(),  "text:Logout", function onclick() {
    //                logout();
    //                refresh();
    //            }))
    //            );
    var hsd = menuVisible("HSD"); 
    var topNav = getAttr("CLASSICCM") ? _ul("id:nav",
            _li(_a("class:selected", "href:#", "text:{{Wireless}}")), // "href:router.html",

           hsd ?  _li(_a(getAttr("CLASSICCM") ? ("href:"+ "phy.htm") : ("href:cm.html"), "text:{{HSD}}", "class:end")) : null, // "href:router.html",
        // _li(_a("href:voice.html", "text:Voice")),
        //_li(_a("href:phy.htm", "class:end", "text:Voice")),
            _li(_a("href:router.html", "text:{{Logout}}", function onclick() {
                logout(true);
                refresh();
            }))
            ) : _ul("id:nav",
            _li(_a(sel("router.html"), "href:router.html", "text:{{Wireless}}")), // "href:router.html",
            hsd ? _li(_a(sel("cm.html"), "href:cm.html", "text:{{HSD}}")) : null, // "href:router.html",
        // _li(_a("href:voice.html", "text:Voice")), // "class:end"
        //_li(_a("href:phy.htm", "class:end", "text:Voice")),
            _li(_a("href:" + getPage(), "text:{{Logout}}", function onclick() {
                logout(true);
                refresh();
            }))
            );

    var mainMenu = [ ];
    var subMenu = [ ];
    $.each(m, function(k, v) {
        if (!v)
            return;
        if (v.page == hash) {
            mainMenu = v;
            subMenu = v;
        } else {
            $.each(v.children, function(k, vv) {
                if (vv && vv.page == hash) {
                    mainMenu = v;
                    subMenu = vv;
                }
            });
        }
    });

    $.log(mainMenu.id);
    $.log(subMenu.id);


    var sideNav = _div("id:navigation_bar",
            _h1("text:{{" + mainMenu.id+"}}"),
            _ul("class:sidenav",
                    $.map(mainMenu.children ? mainMenu.children : [], function(m) {  // "class:current" class:selected
                        if (!m || !m.page)
                           return null;
                        if (m == subMenu)
                            return _li(_a("href:" + getPage() + "?" + m.page, "text:{{" + m.id+"}}", "class:current", "onclick: go('" + m.page + "');"));
                        else return _li(_a("href:" + getPage() + "?" + m.page, "text:{{" + m.id+"}}", "onclick: go('" + m.page + "');"));
                    }),
                    _div("style:VISIBILITY: hidden", "id:version", "text:1.0")
                    ),
            _div("id:sidenav_bottom"));


    var shell = _div("id:wrapper",
            _div("id:header", _img("src:i/logo.gif", "id:logo"), topNav),
        //    _div("id:header", _img("src:logo_MSO.png", "id:logo", "width:150px"), topNav),
            _div("id:content",
                    _div("id:tabs",
                            _ul("class:tabNavigation",
                                    $.map(m, function(m) {  // "class:current"
                                        if (!m)
                                            return null;
                                        var selected = _.include(_.pluck(m.children, "page"),base) ? "class:selected" : "";
                                        return _li(_a(selected, "href:" + getPage() + "?" + m.page, "text:{{" + m.id+"}}", "onclick: go('" + m.page + "');"));
                                    })
                                    ),
                            _div("id:first",
                                    _div("id:placeholder",
                                            _table(_tbody(_tr(
                                                    _td("width:200px", sideNav),
                                                    _td(_div("id:mainpage"))))))
                                    ))),
            _img("src:i/content_bottom.jpg", "width:973", "height:6", "complete:complete"),
            _div("id:footer"),
            _div("id:walk-dialog", "title:", "style:display: none;"),
             _div("id:action-dialog", "title:", "style:display: none;"),
                _div("id:error-dialog", "title:", "style:display: none;"),
           _div("id:wait-dialog", "title:", "style:display: none;", "text:Applying Changes...")

            )
            ;
    $(shell.toHTML()).appendTo("body");
    //  $(header.toHTML()).appendTo("#header");
    //  $(new Menu().build().toHTML()).appendTo($("#sidebar"));

    // make sure menus fit
    $(".sidenav a").truncateTextToFit();
}


function afterBuild(func) {
    _afterBuild.push(func);
}
function afterBuildOnce(func) {
    if (!_.include(_afterBuild, func))
        _afterBuild.push(func);
}

function afterApply(func) {
    _afterApply.push(func);
}

// alog
function addCustomSetting(s) {
    var ud = snmpGet1(arCustomSettings.oid+".0") || "";
    if (!ud.contains(s+"!")) {
        ud += s+"!";
        snmpSet1(arCustomSettings.oid+".0", ud, "4");
    }
}


function handleError(e) {
    if (e === "unauthorized") {
        refresh();
        return;
    }
    if (e["label"])
        alert(xlate("Could not set ") + "\"" +xlate(e["label"])+"\""); // todo: tranlaset
    else if (canXlate(e))
        alert(xlate(e));
    else if (_.isString(e))
        alert(e);
    else alert(xlate("Error")); // todo: tranlaset
}

function DoApply() {
    try {
        $.each(_afterApply, function (k, v) {
            v();
        });
        if (typeof storeData === "undefined")
            return;
        storeData();
        store();
        refresh();
    } catch (e) {
        if (e == "cancel")
            ; // nothing
        else handleError(e);
    } finally {
        closeWaitDialog()
    }
}

function Apply() {
    openWaitDialog();
    setTimeout(DoApply, 10);
}



function loginbuild() {
    ag = { };
    ag.UserName = isSuddenlink() ? "" : "admin";
    ag.Password = "";
    doLogin = function() {
        login($("#UserName").val(), $("#Password").val())
        if (!isLoggedIn()) {
            alert(xlate("Invalid Username or Password!"));
        }
        refresh();
    };
    afterBuild(function() {
        $(document).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                doLogin();
            }
        });
    });
    return form("Login", "LoginText",
            fieldset("Login",
                    [text("UserName"),
                        text("Password")
                    ]),
            buttons("{{Apply}}", function onclick() {
                doLogin();
            }));
}

function disablePage() {
    $('#mainpage *').attr('disabled', true);
    $('.submitBtn').hide();
    if ($("#LAN")) { // make sure we can see lan change
        $("#LAN").parents().removeAttr('disabled');
        $("#LAN ").removeAttr('disabled');
        $("#LAN").children().removeAttr('disabled');
        $("#LAN").show();
    }
    if ($("#BSS")) { // make sure we can see lan change
        $("#BSS").parents().removeAttr('disabled');
        $("#BSS").removeAttr('disabled');
        $("#BSS").children().removeAttr('disabled');
        $("#BSS").show();
    }
}



function enableItem(id) {
    $('.submitBtn').show(); // make sure we can see
     $('.submitBtn').removeAttr('disabled'); // make sure we can see
    $('.submitBtn').parent().removeAttr('disabled');
    if ($(id)) {
        $(id).parents().removeAttr('disabled');
        $(id).removeAttr('disabled');
        $(id).children().removeAttr('disabled');
        $(id).show();
    }
}



function render2() {
    $.each(_afterBuild, function(k, v) {
        v();
    });

    if ($("#dialog"))
        prepareDialog("dialog");
    if ($("#dialog1"))
        prepareDialog("dialog1");
    if ($("#dialog2"))
        prepareDialog("dialog2");

    $("body").ajaxError(function(event, request, settings) {
        // alert("Error Requesting Data");
       // refresh();
    });

    if (!pageEnabled(base)) {
        disablePage();
    }
    if (isLoggedIn() && (!submenuVisible(base) || !menuMap[base])) {
        $('#mainpage').hide();
    }

}

function render() {

    buildShell();
    var def = isLoggedIn() ? build() : loginbuild();
    $(def.toHTML()).appendTo($("#mainpage"));


    if (ag)
        ag.dirty = { };

    $(render2());
}


function getSelectedLAN() {
    if (!isTechnician() || isMG())
        return getLan()[0];
    return getSessionStorage("ar_selected_lan") || getLan()[0] ;
}
function selectLan() {
    if (!isTechnician() || isMG())
        return null;
    ag.LAN = getSelectedLAN();
    var slans = _.map(getLan(), function (v) {
        return "" + v + ":" + getLanName(v)
    });
    return fieldset("LANSegment", select("LAN", slans, function onChange() {
        $.log("selected lan set " + $("#LAN").val());
        setSessionStorage("ar_selected_lan", $("#LAN").val());
        refresh();
    }));
}

function getSelectedBss() {
    if (!isTechnician() || isMG())
        return getBss()[0];
    return getSessionStorage("ar_selected_bss") || getBss()[0] ;
}

function selectBss() {
    if (!isTechnician() || isMG())
        return null;
    ag.BSS = getSelectedBss();
    var slans = _.map(getBss(), function (v) {
        return "" + v + ":" + getBssName(v)
    });
    return fieldset("Wireless", select("BSS", slans, function onChange() {
        $.log("selected bss set " + $("#BSS").val());
        setSessionStorage("ar_selected_bss", $("#BSS").val());
        refresh();
    }));
}


function sectionIndex() {
    var a = new Array();
    for (var i = 0; i < 99; i++) {
        if (arguments[i * 3]) {
            var li;
            (function(id1, id2, url) {
                li = _li(_a("href:" + url, _label("class:item", "text:{{" + id1 +"}}"),
                        _br(), _label("text:{{" + id2+"}}"), _br()
                        ), _br());
            })(arguments[i * 3], arguments[i * 3 + 1], arguments[i * 3 + 2]);
            a.push(li);
        } else break;
    }
    return _ul(a);
}

function canXlate(id) {
    return _xlate [id];
}
function xlate(id, arg1, arg2, arg3) {
//    if (debug()&8)
//        return "{{"+id+"}}";
    var o = _xlate [id];

    if ((debug()&8) && !o)
      o = "@@"+id;

    if (!o) {
        o = id.replace("_tt","");
        if (_xlate[o])
            o = _xlate[o];
    }
//    if (!o)
//        alert("no def for "+o);
    if (arg1 !== undefined)
        o = o.replace("%s",arg1);
    if (arg2 !== undefined)
        o = o.replace("%s",arg2);
    if (arg3 !== undefined)
        o = o.replace("%s",arg3);
    return o;
}

function helpText(id) {
    return xlate(id+"_tt");
}

function technicianOnly(id, value) {
    if (value !== undefined)
        _technician[id] = value;
    return _technician[id] === undefined ? false : _technician[id];
}


function updateDisabledState(checkboxsel, inputsel, invert) {
    var on = $(checkboxsel).attr("checked") && !$(checkboxsel).attr("disabled");
    if (invert)
        on = !on;
    var id = $(checkboxsel).attr("id");
    $(inputsel).each(function() {
        if ($(this).attr("id") != id && !$(this).hasClass(".read_only")) {
            if (on) {
                $(this).removeClass("input_disabled");
                $(this).removeAttr("disabled");
            } else {
                $(this).addClass("input_disabled");
                $(this).attr("disabled", "disabled");
            }
        }
    });
    $(inputsel).each(function() {
        if ($(this).attr("id") != id && !$(this).hasClass(".read_only")) {
            if ($(this).is(':checkbox')) {
                $(this).trigger("change");
            }
        }
    });
}

function setupCheck(checkboxsel, inputsel, invert) {
    function updater() {
        if (invert)
            updateDisabledState(checkboxsel, inputsel, true);
        else updateDisabledState(checkboxsel, inputsel);
    }
    afterBuild(function() {
        $(checkboxsel).bind("click", updater);
        updater();
    });
}


function todToInt(day1, day2, hour1, hour2) {
    day1 = day1.asInt();
    day2 = day2.asInt();
    hour1 = hour1.asInt();
    hour2 = hour2.asInt();

    if (hour1 >= hour2)
        throw xlate("No hours of the day selected. Second hour must be after the first.");
    var todDay = 0;
    var todTime = 0;
    var i = 0;
    if (day1 > day2) {
        for (i = day1; i <= 6; i++)
            todDay |= (1 << i);
        for (i = 0; i <= day2; i++)
            todDay |= (1 << i);
    } else {
        for (i = day1; i <= day2; i++)
            todDay |= (1 << i);
    }
    todDay &= 0x7F;
    if (hour1 > hour2) {
        for (i = hour1; i <= 23; i++)
            todTime |= 1 << i;
        for (i = 0; i <= hour2; i++)
            todTime |= 1 << i;
    } else {
        for (i = hour1; i < hour2; i++) {
            var shift = (i === 0) ? (1 << 0) : (1 << (i));
            todTime |= shift;
        }
    }
    return (todTime << 7) | todDay;
}
function lowestBitSet(tod, l, h) {
    tod = parseInt(tod,10);
    l = parseInt(l,10);
    h = parseInt(h,10);
    for (var i = l; i <= h; i++)
        if (tod & (1 << i))
            return i;
    return l;
}
function highestBitSet(tod, l, h) {
    for (var i = h; i >= l; i--)
        if (tod & (1 << i))
            return i;
    return h;
}

function todToTimeString(tod, s_min, e_min) {
    tod = parseInt(tod,10);
    var l = (lowestBitSet(tod, 7, 30) - 7);
    var h = (highestBitSet(tod, 7, 30) - 7);
    var l_min = (s_min==undefined? ":00" : s_min)
    var h_min = (e_min==undefined? ":00" : e_min)

    var s = l.asString(2) + ":"+l_min +"-" + (h + 0).asString(2) + ":"+h_min;
    if (s == "00:00-24:00")
        s = "All Day";
    return s;
}
function todToDayString(tod) {
    var day = "";
    tod = parseInt(tod,10);
    if ((tod & 0x07F) === 0x07F)
        return "Every Day";
    tod = tod & 0x7F;
    for (var i = 0; i <= 6; i++)
        if (tod & (1 << i))
            day += days[i].substr(2) + ",";
    if (day.endsWith(","))
        day = day.substr(0, day.length - 1);
    return day;
}


function refresh() {
    location.reload(true);
    window.open(location.href, "_self");

    //   location.reload(true);
    //    window.open(location.href, "_self");

}



function isHexString(s) {
    if (s.length === 0)
        return false;
    var pos = 0;
    if (s.charAt(pos) == '$')
        pos++;
    while (pos < s.length) {
        if ("01234567789ABCDEFabcdef ".indexOf(s.charAt(pos)) == -1)
            return false;
        else pos++;
    }
    return true;
}

function parseHexString(hs) {
    if (!isHexString(hs))
        return [ ];
    var a = [ ];
    var pos = 0;
    if (hs.charAt(pos) == '$')
        pos++;

    while (pos < hs.length) {
        if (hs.charAt(pos) == ' ') {
            pos++;
            continue;
        }
        if (hs.length < 2)
            return [ ];
        var num = parseInt(hs.charAt(pos), 16) * 16 + parseInt(hs.charAt(pos + 1), 16);
        if (isNaN(num))
            return [ ];
        pos += 2;
        a.push(num);
    }
    return a;
}
function toHexString(a) {
    var s = "$";
    _.each(a, function(d) {
        if (d < 16) s += "0";
        s += Number(d).toString(16).toUpperCase()
    });
    return s;
}

function stringToHex(s) {
    var v = "";
    for (var i = 0; i < s.length; i++)
        v += toHexDig(s.charCodeAt(i), 2);
    return v;
}
function hexToString(s) {
    return String.fromCharCode.apply(this, parseHexString(s));
}
function toHexDig(s, len) {
    s = Number(s).toString(16).toUpperCase();
    if (s.length < len)
        s = "00000000000000000000000000".substr(0, len - s.length) + s;
    return s;
}


function ipToHex(v, sep) {
    if (sep === undefined)
        sep = "";
    sep = "";
    var reg = /^[0-9]+.[0-9]+.[0-9]+.[0-9]+$/;
    if (!reg.test(v))
        return "$" + "00" + sep + "00" + sep + "00" + sep + "00";
    var a = v.split(".");
    return "$" + toHexDig(a[0], 2) + sep + toHexDig(a[1], 2) +
            sep + toHexDig(a[2], 2) + sep + toHexDig(a[3], 2);
}
function hexToIp(v) {
    if (!v)
        return "0.0.0.0";
    if (!v.startsWith("$") && v.length === 4)
        v = convertASCIIStringToHexString(v);
    else if (!v.startsWith("$"))
        return v;
    var reg = /\$?([0-9A-Fa-f][0-9A-Fa-f]) ?([0-9A-Fa-f][0-9A-Fa-f]) ?([0-9A-Fa-f][0-9A-Fa-f]) ?([0-9A-Fa-f][0-9A-Fa-f]) ?/;
    if (!reg.test(v))
        return "0.0.0.0";
    var s = "";
    s += parseInt(RegExp.$1, 16) + ".";
    s += parseInt(RegExp.$2, 16) + ".";
    s += parseInt(RegExp.$3, 16) + ".";
    s += parseInt(RegExp.$4, 16);
    return s;
}

function macToHex(v) {
    v = v.toUpperCase();
    var reg = /^[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]$/;
    if (!reg.test(v))
        return "$" + "000000000000";
    //var a = v.split(":");
    return "$" + v.replace(/:/g, "");
}
function hexToMac(v) {
    if (!v)
        return "";
    if (!v.startsWith("$") && v.length === 6)
        v = convertASCIIStringToHexString(v);
    if (v.startsWith("$"))
        v = v.substr(1);

    v = v.replace(/ /g, "");
    var reg = /^[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]$/;
    if (!reg.test(v))
        return "00:00:00:00:00:00";
    var s = "";
    for (var i = 0; i < 6; i++) {
        s += v.charAt(i * 2);
        s += v.charAt(i * 2 + 1);
        if (i < 6 - 1)
            s += ":";
    }
    return s;
}


function ipv4ToHex(s) {
  var reg = /^[0-9]+.[0-9]+.[0-9]+.[0-9]+$/;
  if (!reg.test(s))
      return null;
  var hex = "";
  s = s.split(".");
  for (var i=0; i<4; i++) {
      if (s[i].asInt() > 255)
          return null;
      hex += toHexDig(s[i], 2)
  }
  return hex;
}

  function hexToIpv4(v) {
  if (!v)
      return null;
  if (!v.startsWith("$") && v.length === 4)
      v = convertASCIIStringToHexString(v);
  else if (!v.startsWith("$"))
        return v;      
  v = v.replace("$","").replace(/ /g,"");
  if (!/^[0-9A-Fa-f]{8}$/.test(v))
      return null;
  v = v.match(/([0-9A-Fa-f]{2})/g);
  var s = "";
  for (var i=0;i<4;i++)
    s += parseInt(v[i], 16) + (i!=3 ? "." : "");
  return s;
  }


function hexToIpv6(v) {
    if (!v)
        return "";
    if (!v.startsWith("$") && v.length === 16)
        v = convertASCIIStringToHexString(v);
    else if (!v.startsWith("$"))
        return v;	
    v = v.replace("$","").replace(/ /g,"");
    if (!/^[0-9A-Fa-f]{32}$/.test(v))
      return "";
    v = v.match(/([0-9A-Fa-f]{4})/g);
    var s = "";
    for (var i=0;i<8;i++) {
        //alert(s);
       s += ""+v[i].replace(/^[0]{1,3}/,"")+":";
        //alert(s);
    }
    s = ":"+s;
/*
    // does it need to replace 0: to ::???
    for (i=8; i>=2; i--) {
        var rg = new RegExp(":(0:){"+i+"}");
        if (rg.test(s)) {
            s = s.replace(rg,"::");
            break;
        }
    }
*/	
    s = s.substr(1,s.length-2);
    if (s == "")
        return "::";
    if (s.startsWith(":"))
        return ":"+s;
    if (s.endsWith(":"))
        return s+":";
    return s;
}


function hexToIpv6x(v) {
    if (!v)
        return null;
    if (!v.startsWith("$") && v.length === 16)
        v = convertASCIIStringToHexString(v);
    v = v.replace("$","").replace(/ /g,"");
    if (!/^[0-9A-Fa-f]{32}$/.test(v))
      return null;
    v = v.match(/([0-9A-Fa-f]{4})/g);
    var s = "";
    for (var i=0;i<8;i++)
       s += ""+v[i].replace(/^[0]{1,3}/,"")+":";
    for (i=8; i>=2; i--) {
        var rg = new RegExp("(0:){"+i+"}");
        if (rg.test(s)) {
            s = s.replace(rg,":");
            break;
        }
    }
    s = s.substr(0,s.length-1);
    if (s == "")
        return "::";
    if (s.startsWith(":"))
        return ":"+s;
    if (s.endsWith(":"))
        return s+":";
    return s;
}

function ipv6ToHex(s) {
    var v = ipv6ToHexOrNull(s);
    return v===null || v===undefined ? "$00000000000000000000000000000000": v;
}
 function ipv6ToHexOrNull(s) {
     if (s=="::")
       return "$"+"".padLeft("0",32);
     if (s.startsWith("::"))
       s = "0::"+s.substr(2);
     if (s.endsWith("::"))
       s = s.substr(0, s.length-2)+"::0";
     var foundColonColon=false;
     var hex = "";
     var fail = false;
     var parts = s.split(":");
     if (parts.length == 1 || parts.length > 8) return null;
     for (var i=0;i<parts.length;i++) {
          if (parts[i] == "") {
              if (foundColonColon)
                  return null;
              foundColonColon=true;
              hex += "X";
          } else if (i == parts.length-1 && parts[i].indexOf(".") !== -1) {
              var v4Hex = ipv4ToHex(parts[i]);
              if (v4Hex === null)
                  return null;
              hex  += v4Hex;
          } else {
                  parts[i] = parts[i].toUpperCase().padLeft("0",4);
                  if (!/^[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]$/.test(parts[i]))
                      return null;
                  hex += parts[i];
              }
          }
     hex = hex.replace(/X/,"".padLeft("0",32-hex.length+1));
     return hex.length == 32 ? "$"+hex : null;
 }


function test(v) {
    var s = "$";
    if (!v)
        v = 0;
    var pos = 0;
    for (var i = 0; i < 4; i++) {
        var bits = 0;
        if (v > pos) {
            bits = v - pos;
            if (bits > 8)
                bits = 8;
        }
        pos += 8;
        s += toHexDig((1 << bits) - 1, 2) + (i < 3 ? " " : "");
    }
    return hexToIp(s);
}



function prefix() {
    var o = formatter();
    o.load = function(v) {
        var s = "$";
        if (!v)
            v = 0;
        var pos = 0;
        for (var i = 0; i < 4; i++) {
            var bits = 0;
            if (v > pos) {
                bits = v - pos;
                if (bits > 8)
                    bits = 8;
            }
            pos += 8;
            s += toHexDig( (((1<<bits)-1)<<(8-bits)) ,2)+(i<3 ? " " : "");
        }
        return hexToIp(s);
    };
    o.store = function(v) {
        var msg = xlate("Invalid subnet mask.");
        var reg = /^[0-9]+.[0-9]+.[0-9]+.[0-9]+$/;
        if (!reg.test(v))
            return 0;
        var a = v.split("\.");
        var prefix = 0;
        var done = false;
        for (var i = 0; i < 4; i++) {
            var d = Number(a[i]);
            for (var j = 7; j >= 0; j--) {
                var on = (d & (1 << j));
                if (!done && on)
                    prefix++;
                else done = true;
                if (done && on)
                    throw msg;
            }
        }
        return prefix;
    };
    o.validate = function(v) {
        if (this.notEmpty && (""+v).length === 0)
            throw xlate("Subnet Mask Address cannot be empty");
        if (!v)
            return v;
        var reg = /^([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)$/;
        if (!reg.test(v))
            throw xlate("Invalid Subnet Mask: Must be 4 numbers separated by '.' e.g. 123.44.5.245");
        var allZero = true;
        _.each(v.split(/\./), function f(i) {
            if (i.asInt() > 255)
                throw xlate("'%s' is not a valid part of a Subnet Mask.  Must be less than 256.",i);;
            if (allZero)
                allZero = i.asInt() === 0;
        });

        if (this.notZero && allZero)
            throw xlate("Subnet Mask cannot be all zero");
        return v;
    }
    return o;
}

function nullIp(ip) {
    return ip.length === 0 || ip == "0.0.0.0" || ip == "$00000000";
}

function hexIp() {
    var o = formatter();
    o.load = function(v) {
        return hexToIp(v);
    };
    o.store = function(v) {
        //alert("store "+v+" "+ipToHex(v));
        return ipToHex(v, " ");
    };
    o.validate = function(v) {
        if (this.notEmpty && (""+v).length === 0)
            throw xlate("IP Address cannot be empty");
        if (!v)
            return v;
        var reg = /^([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)$/;
        if (!reg.test(v))
            throw xlate("Invalid IP Address: Must be 4 numbers separated by '.' e.g. 123.44.5.245");
        var allZero = true;
        var index = 0;
        _.each(v.split(/\./), function f(i) {
            if (i.asInt() > 255)
                throw xlate("'%s' is not a valid part of an IP Address.  Must be less than 256.", i);
            if (index==0 && i.asInt() == 127)
                throw xlate("Invalid IP Address");
            if (allZero)
                allZero = i.asInt() === 0;
            index++;
        });

        if (this.notZero && allZero)
            throw xlate("IP Address cannot be all zero");
        return v;
    }
    return o;
}
function hexIpNotNull() {
    var o = hexIp();
    o.notEmpty = true;
    o.notZero = true;
    return o;
}





function TypedAddr(type,addr) {
    this.type = type;
    this.addr = addr;
    this.toString = function() {
        return addr;
    }
}

function typedAddr() {
    var o = formatter();
    o.notEmpty = true;
    function hasName(v) {
        return /[a-z]/i.test(v);
    }
    o.hexIp = new hexIp();
    o.load = function(v) {
        if (v.type == "16")
            return v.addr;
        else return this.hexIp.load(v.addr);
    };
    o.store = function(v) {
        var oo = {
            type:hasName(v) ? "16" : "1", // mod for ipv6
            addr:hasName(v) ? v : o.hexIp.store(v, " ")
        };
        return oo;
    };
    o.validate = function(v) {
        if (this.notEmpty && (""+v).length === 0)
            throw xlate("IP Address cannot be empty");
        if (!v)
            return v;
        if (hasName(v))
            return v;
        return o.hexIp.validate(v);
    }
    return o;
}


function hexIpV6() {
    var o = formatter();
    o.notEmpty = true;
    //o.notZero = true; leave this until heavy qa
    o.load = function(v) {
        if (!v)
            v = "::";
        else v = hexToIpv6(v) || "::";
        if (!o.notEmpty && (!v || v=="::" || /^.?null.?$/.test(v)))
            v = "";
        return v;
    }
    o.store = function(v) {
        return ipv6ToHex(v);
    }
    o.validate = function(v) {
        if (!o.notEmpty && v == "")
            return v;
        if(!o.notEmpty && /^.?null.?$/.test(v))
            return "";
        var hex = ipv6ToHexOrNull(v);
        if (hex !== null) {
            if (o.notZero && hex == "$00000000000000000000000000000000")
             throw xlate("IP Address cannot be empty");
          return v;
        }
        throw xlate("Invalid IPV6 Address");
    }
    o.normalize = function(v) {
        return o.load(o.store(v));
    }


    o.size = 40;
    return o;
}



function hexIpV6OrNull() {
    o = hexIpV6();
    o.notEmpty = false;
    o.notZero = false;
    return o;
}

function hexIpV6orFQDN() {
    var o = formatter();
    o.load = function(v) {
        if (v.startsWith("$")) {
            if (v.replace("$","").replace(/ /g,"") == "00000000000000000000000000000000")
                return "";
            return hexToIpv6(v) || "::";
        }
        else return v;
    }
    o.store = function(v) {
        return !v ? "" : (v.contains(":") ? ipv6ToHex(v) : v);
    }
    o.validate = function(v) {
        if (!v)
             return ""; //throw xlate("Must specify domain name or IP address");
         if (v.contains(":") && ipv6ToHexOrNull(v) !== null)
            return v;
        else {
            return v;
        }
        throw xlate("Invalid IPV6 Address");
    }
    o.size = 40;
    return o;
}



function macAddr() {
    var o = formatter();
    o.load = function(v) {
        return hexToMac(v);
    };
    o.store = function(v) {
        //alert("store "+v+" "+ipToHex(v));
        return macToHex(v);
    };
    o.validate = function(v) {
        if (!v)
            return v;
        var reg = /^[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]$/;
        if (!reg.test(v) || v == "00:00:00:00:00:00")
            throw xlate("Invalid Mac Address: Must be 6 pairs of hexdecimals separated by ':' e.g. 12:34:56:78:9A:BC");
        return v;
    }
    return o;
}

function intField() {
    var o = formatter();
    o.validate = function(v) {
        var reg = /^[0-9]+$/;
        if (!reg.test(v))
            throw xlate("%s must be a number.",this.label);
        return v;
    }
    return o;
}

function intRangeField(lo, hi) {
    var o = formatter();
    o.validate = function(v) {
        var reg = /^[0-9]+$/;
        if (!reg.test(v))
            throw xlate("%s must be a number.",this.label);
        if (v.asInt()<lo || v.asInt()>hi)
            throw xlate("%s must be between %s and %s.",this.label,lo,hi);
        return v;
    }
    return o;
}

function intRangeFieldOrZero(lo, hi) {
    var o = formatter();
    o.validate = function(v) {
        var reg = /^[0-9]+$/;
        if (!reg.test(v))
            throw xlate("%s must be a number.",this.label);
        if (v.asInt()!==0 && (v.asInt()<lo || v.asInt()>hi))
             throw xlate("%s must be between %s and %s or 0.",v,lo,hi);
        return v;
    }
    return o;
}

function rangeCheck (msg, v, lo, hi) {
    if (v > hi || v <lo)
        throw xlate("%s must be between %s and %s.",v,lo,hi);
}


function nullBugHack() {
    var o = formatter();
    o.load = function(v) {
        if (v == "%20")
            return "";
        return v;
    };
    o.store = function(v) {
        if (v.length === 0)
            return " ";
        return v;
    };
    return o;
}
function ssid() {
    var o = formatter();
    o.validate = function(s) {
        if (s.length < 1 || s.length > 32)
            throw xlate("Invalid SSID: Must be between 1 and 32 characters.");
        _.each(s.split(""), function(c, i) {
            if (i === 0 && "!#;".indexOf(c) != -1)
                throw xlate("Invalid SSID: Cannot start with !, # or ;");
            if ("?\"$[\\]".indexOf(c) != -1)
                throw xlate("Invalid SSID: Cannot contain  ?, \", $, [, \\, ] or +");
        });
        return s;
    }
    return o;
}

function canConvertToASCII(s) {
    return _.all(parseHexString(s), function(d) {
        return d >= 32 && d <= 126
    });
}
function convertHexStringToASCIIString(hexString) {
    return String.fromCharCode.apply(this, parseHexString(hexString));
}
function convertASCIIStringToHexString(asciiString) {
    var s="$";
    for (var i=0; i<asciiString.length; i++) {
        s += asciiString.charCodeAt(i).asHexString(2);
    }
    return s;
}
// stringToHex -- sdsd
// hexToASCII

var wepHelper;
function wepPassword() {
    var o = formatter();
    wepHelper = o;
    o.size = 26;
    o.load = function(v) {
        if (!v)
            v = "";

        if (v.startsWith("$"))
            return v.substr(1).replace(/ /g, "");
        else if (v.startsWith("0x"))
            return v.substr(2).replace(/ /g, "");
        else return v;
//        if (v.startsWith("$")) {
//            v = v.substr(1).replace(/ /g, "");
//            if (canConvertToASCII(v))
//                v = convertHexStringToASCIIString(v);
//        }
//        return v;
    };
    o.store = function(v) {
        if (ag.SecurityMode != 1) // only check in wep mode
            return v;

        var keyLength = $("#KeyLength").valOrChecked();
        var isHex = isHexString(v) && !v.contains(" ");
        if (v.startsWith("$"))
            v = v.substr(1);

        if (keyLength == 1) {
            if (v.length === 5)
               return v;
            if (v.length === 10 && isHex) {
                return "0x" + v;
            }
            throw xlate("WEP 64-bit Passwords must be 5 ASCII or 10 hexadecimal digits.");
        }
        if (keyLength == 2) {
            if (v.length === 13)
                return v;
            if (v.length === 26 && isHex) {
                return "0x" + v;
            }
            throw xlate("WEP 128-bit Passwords must be 13 ASCII or 26 hexadecimal digits.");
        }
        return "";
    };
    return o;
}



function stringToSnmpDate(v) {
    if (!/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9]$/.test(v)) {
        throw xlate("date/time must be of the form yyyy-MM-dd HH:mm:ss.ff");
    }
    var y = v.substr(0,4).asInt();
    var m = v.substr(5,2).asInt();
    var d = v.substr(8,2).asInt();
    var h = v.substr(11,2).asInt();
    var mi = v.substr(14,2).asInt();
    var s = v.substr(17,2).asInt();
    var ms = v.substr(20,2).asInt();

    return toHexString([
            (y/256).asInt(),(y%256).asInt(),m,d,h,mi,s,ms
            ]);
}
function snmpDateToString(v) {
    var ha = parseHexString(v);
    if (ha.length != 8)
        return "????-??-?? ??:??:??.??";
    function get1(index) {
        var v = ha[index];
        if (v < 10)
            return "0" + v;
        return "" + v;
    }

    var s = "" + (ha[0] * 256 + ha[1]) + "-" + get1(2) + "-" + get1(3) + " " + get1(4) + ":" + get1(5) + ":" + get1(6) + "." + get1(7);
    return s;
}

function tunnelOid(k) {
  var s =  "1.3.6.1.4.1.4115.1.3.4.1.1.7.0";
 return s + "." +
         _.map(k.split(""),function f(c) { return c.charCodeAt(0); }).
                 join(".");
}

//  var v = snmpGet1("1.3.6.1.4.1.4115.1.3.4.1.1.7.0");
function getFromTunnel(name) {
  function getWhenReady(oid) {
        for (;;) {
          var v = snmpGet1(oid);
          if (v !== "BUSY")
            return v;
          $.log("BUSY: "+oid);
          var start = new Date().getTime();
          while (new Date().getTime() - start < 100)
               ;// crude timer hack to give snmp time to settle down
        }
  }
  // prime
  $.log("getFromTunnel "+name);
  getWhenReady(tunnelOid(name)+".0");
  var index = 1;
  var rv = "";
  for (;;) {
      var v = getWhenReady(tunnelOid(name)+"."+index);
      if (v === "")
        break;
      rv += v;
      index++;
  }
    return rv;
}

function tunnelTest() {
    //parseTunnelData(getFromTunnel("AdvConfig"));
    //parseTunnelData(getFromTunnel("AdvProduct"));
    //parseTunnelData(getFromTunnel("CMState"));
    //parseTunnelData(getFromTunnel("EventLog"));
    //parseTunnelData(getFromTunnel("TouchstoneStatus"));
    parseTunnelData(getFromTunnel("HWFWVersions"));
}

function parseTunnelData(d) {
    $.log("parseTunnelData "+d);
    var o = {};
    if (d) {
        _.each(d.split("^"), function(l) {
            if (l) {
                l = l.split("|");
                $.log("->" + JSON.stringify(l));
                if (l.length) {
                    var tag = l[0];
                    var value = l.length > 1 ? l.splice(1, l.length-1) : "";
                    if (value) {
                        if (o[tag]) {
                            o[tag].push(value)
                        } else {
                            o[tag] = [value];
                        }
                    }
                }
            }
        });
    }
    $.log(JSON.stringify(o));
    o.get = function(s) {
        try {
            if (this[s])
                return this[s][0];
        } catch(e) {
            return "";
        }
    }
    o.getTable = function(s) {
        try {
            if (this[s])
                return this[s];
            else return [];
        } catch(e) {
            return [];
        }
    }
    o.eachRow = function(s, f) {
        try {
            if (this[s])
                _.each(this[s],f);
        } catch(e) {
            return "";
        }
    }
    return o;
}



function validateIpOnSubnet(ip) {
    var IPAddress = arLanGatewayIp.get(getLan()[0]).replace(/[$ ]/g,"");
    var SubnetMask = arLanSubnetMask.get(getLan()[0]).replace(/[$ ]/g,"");
    var f = hexIp();
    if (ip.contains(".")) {
        f.validate(ip);
        ip = f.store(ip).replace(/[$ ]/g,"");
    } else {
        ip = ip.replace(/[$ ]/g,"");
    }
    if ((parseInt(ip, 16) & parseInt(SubnetMask,16)) != (parseInt(IPAddress, 16) & parseInt(SubnetMask,16))) {
        throw xlate("Invalid IP Address. Invalid network address.");
    }
}

function convertToSnmpHex(s) {
    var t = s;
    if (!t.endsWith(" "))
        t += " ";
    var reg = /^([0-9A-Fa-f][0-9A-Fa-f] )+$/;
    if (reg.test(t)) {
        return "$"+t.replace(/ /g,"");
    }
    return s;
}


function IPV6ToOid(v6) {
    hexIpV6().validate(v6);
    var hd = hexIpV6().store(v6);
    if (!hd)
        throw xlate("Invalid IPV6 Address");
    hd = hd.replace("$", '');
    var s = "";
    while (hd.length >= 4) {
        s = s + parseInt(hd.substr(0, 4),16)+".";
        hd = hd.substr(4);
    }
    s = s.substr(0, s.length-1);
    return s;
}

function oidToIPV6(oid) {
    var v6 = "";

    var grouphasValue = false;
    if (is852()) {
        var flag = 0;
       _.each(oid.split("."), function(s) { 
    	if (flag == 1) {
    		var tmp = parseInt(s).toString(16);
    		if(tmp.length==1 && parseInt(tmp)!=0){
    			tmp="0"+tmp;
    		}

            if( grouphasValue == true && parseInt( tmp ) == 0 )
            {
                tmp += "0";
                grouphasValue = false;
            }

    		v6 += tmp +":"; 
    		flag = 0;
    	} else {
    		var tmp = parseInt(s).toString(16);
    		if(tmp.length==1 && parseInt(tmp)!=0){
    			tmp="0"+tmp;
    		}	

            if( parseInt( tmp ) != 0 )
            {
                grouphasValue = true;
            }

    		v6 += tmp; 
    		flag+=1;
    	}
       });
    } else {
       _.each(oid.split("."), function(s) { v6 += parseInt(s).toString(16)+":"; });
    }

    var v = v6.substr(0, v6.length-1).toUpperCase();
    return hexIpV6().normalize(v);
}

function getChannelList() {
    var country = (snmpGet1(arWiFiCountry.oid+".0") || "").toLowerCase();
    var isEurope =  country ? "eu,at,be,ch,cz,de,dk,ee,ie,el,fr,es,it,cy,lv,lt,lu,hu,mt,nl,pl,pt,ro,gb,gr,hu,ie,si,sk,fi,se,uk".contains(country) : false;
    var isJapan = country ==  "jp"; 
    if (isJapan)
        return  ["0:Auto", "1:1", "2:2", "3:3", "4:4", "5:5", "6:6", "7:7", "8:8", "9:9", "10:10", "11:11", "12:12", "13:13","14:14"];
    if (isEurope)
       return ["0:Auto", "1:1", "2:2", "3:3", "4:4", "5:5", "6:6", "7:7", "8:8", "9:9", "10:10", "11:11", "12:12", "13:13"];
    return  ["0:Auto", "1:1", "2:2", "3:3", "4:4", "5:5", "6:6", "7:7", "8:8", "9:9", "10:10", "11:11"];
}

function security_encryption(mode, WEPencryptionmode, WPAalgorithm)
{
    if(mode == "0")
    {
        return "Open";
    }
    else if(mode == "1")
    {
        if(WEPencryptionmode == "1")
        {
            return "WEP64";
        }
        if(WEPencryptionmode == "2")
        {
            return "WEP128";
        }
    }
    else if(mode == "2")
    {
        if(WPAalgorithm == "1")
        {
            return "WPA-PSK(TKIP)";
        }
        else if(WPAalgorithm == "2")
        {
            return "WPA-PSK(AES)";
        }
    }
    else if(mode == "3")
    {
        if(WPAalgorithm == "1")
        {
            return "WPA2-PSK(TKIP)";
        }
        else if(WPAalgorithm == "2")
        {
            return "WPA2-PSK(AES)";
        }
        else if(WPAalgorithm == "3")
        {
            return "WPA2-PSK(TKIP/AES)";
        }
    }
    else if(mode == "7")
    {
        return "WPAWPA2-PSK(TKIP/AES)";
    	  /*
        if(WPAalgorithm == "1")
        {
            return "WPAWPA2-PSK(TKIP)";
        }
        else if(WPAalgorithm == "2")
        {
            return "WPAWPA2-PSK(AES)";
        }
        else if(WPAalgorithm == "3")
        {
            return "WPAWPA2-PSK(TKIP/AES)";
        }*/
    }
    else
    {
        return "NONE";
    }
}

function wirelessmode(i) {
    if (i == "0")
    {
        return "Mixed BG";
    }
    else if (i == "1")
    {
        return "B Only";
    }
    else if (i == "4")
    {
        return "G Only";
    }
    else if (i == "6")
    {
        return "N Only";
    }
    else if (i == "7")
    {
        return "Mixed GN";
    }
    else if (i == "9")
    {
        return "Mixed BGN";
    }
    else
    {
        return "unknown -- " + i;
    }
}

function wifi50mode(i) {
    if(i == "0")
    {
        return "Mixed AN";
    }
    else if(i == "1")
    {
        return "A Only";
    }
    else if(i == "4")
    {
        return "N Only";
    }
    else if(i == "5")
    {
        return "Only AC";
    }
    else if(i == "6")
    {
        return "Mixed ACN";
    }
    else if(i == "7")
    {
        return "Mixed ACNA";
    }
    else
    {
        return "unknown -- " + i;
    }
}

function getWiFiIndex(band, SSID)
{
    if(band == "24")
    {
        if(SSID == "HOME" || SSID == "BSS_1")
        {
            return "10001";
        }
        else if(SSID == "BSS_2")
        {
            return "10002";
        }
        else if(SSID == "BSS_3")
        {
            return "10003";
        }
        else if(SSID == "BSS_4")
        {
            return "10004";
        }
        else if(SSID == "BSS_5")
        {
            return "10005";
        }
        else if(SSID == "BSS_6")
        {
            return "10006";
        }
        else if(SSID == "BSS_7")
        {
            return "10007";
        }
        else if(SSID == "BSS_8")
        {
            return "10008";
        }
        else if(SSID == "BSS_9")
        {
            return "10009";
        }
        else if(SSID == "BSS_10")
        {
            return "10010";
        }
        else if(SSID == "BSS_11")
        {
            return "10011";
        }
        else if(SSID == "BSS_12")
        {
            return "10012";
        }
        else if(SSID == "BSS_13")
        {
            return "10013";
        }
        else if(SSID == "BSS_14")
        {
            return "10014";
        }
        else if(SSID == "BSS_15")
        {
            return "10015";
        }
        else if(SSID == "BSS_16")
        {
            return "10016";
        }
    }
    else if(band == "50")
    {
        if(SSID == "HOME" || SSID == "BSS_1")
        {
            return "10101";
        }
        else if(SSID == "BSS_2")
        {
            return "10102";
        }
        else if(SSID == "BSS_3")
        {
            return "10103";
        }
        else if(SSID == "BSS_4")
        {
            return "10104";
        }
        else if(SSID == "BSS_5")
        {
            return "10105";
        }
        else if(SSID == "BSS_6")
        {
            return "10106";
        }
        else if(SSID == "BSS_7")
        {
            return "10107";
        }
        else if(SSID == "BSS_8")
        {
            return "10108";
        }
        else if(SSID == "BSS_9")
        {
            return "10109";
        }
        else if(SSID == "BSS_10")
        {
            return "10110";
        }
        else if(SSID == "BSS_11")
        {
            return "10111";
        }
        else if(SSID == "BSS_12")
        {
            return "10112";
        }
        else if(SSID == "BSS_13")
        {
            return "10113";
        }
        else if(SSID == "BSS_14")
        {
            return "10114";
        }
        else if(SSID == "BSS_15")
        {
            return "10115";
        }
        else if(SSID == "BSS_16")
        {
            return "10116";
        }
    }
}

function Parse_Page_Name( org_url )
{
    return org_url.substring(org_url.lastIndexOf('/')+1);
}

function Waiting_Setting_And_Redirect( url )
{
    window.location = "waiting_loading.php?" + url;
}


/*
function convertCmtStr(str)
{
	var ret;
	var str_new ="";
	var i = 0;	

	var num = 0;

	for(i = 0; i<str.length; i++)
	{
		if((str.charAt(i) == '%') && (str.length >= (i+3)))
		{
			num = parseInt((str.charAt(i+1)), 16) * 16 + parseInt((str.charAt(i+2)), 16);
			if(isNaN(num))
			{
				str_new += str.charAt(i);
			}
			else
			{
				ret = String.fromCharCode(num);
				i = i+2;
				str_new += ret;
			}
		}
		else
		{
			str_new += str.charAt(i);
		}
	}

	return str_new;
}
*/
// todo: add change password for suddenlink
// todo: make sure tabs from mg gets moved over?