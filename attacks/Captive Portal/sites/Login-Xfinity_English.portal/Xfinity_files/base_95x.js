//Copyright 2011-2012, ARRIS Group, Inc., All rights reserved.
var attrs = {
    //Model:"GW",
    Family:"950",
    //Model:"852",
    CLASSICCM:true,
    MOCA:false,
    IPV6:true,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
}
    // todo: put in snmp check for no data returned

var attrs_TG852G = {
    Model:"TG852G",
    Family:"950",
    CLASSICCM:true,
    MOCA:false,
    IPV6:true,
    Battery: true,
    Wifi: 1,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_TG862G = {
    Model:"TG862G",
    Family:"950",
    CLASSICCM:true,
    MOCA:false,
    IPV6:true,
    Battery: true,
    Wifi: 1,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_TG1642 = {
    Model:"TG1642",
    Family:"950",
    CLASSICCM:true,
    MOCA:false,
    IPV6:true,
    Battery: true,
    Wifi: 1,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_DG1670 = {
    Model:"DG1670",
    Family:"950",
    CLASSICCM:true,
    MOCA:true,
    IPV6:true,
    Battery: false,
    Wifi: 2,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_TG1672 = {
    Model:"TG1672",
    Family:"950",
    CLASSICCM:true,
    MOCA:true,
    IPV6:true,
    Battery: false,
    Wifi: 2,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_TG1682 = {
    Model:"TG1682",
    Family:"950",
    CLASSICCM:true,
    MOCA:true,
    IPV6:true,
    Battery: true,
    Wifi: 2,
    Dect: true,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_MG2402 = {
    Model:"MG2402",
    Family:"950",
    CLASSICCM:true,
    MOCA:true,
    IPV6:true,
    Battery: true,
    Wifi: 2,
    Dect: true,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_OG1600 = {
    Model:"OG1600A",
    Family:"950",
    CLASSICCM:true,
    MOCA:false,
    IPV6:true,
    Battery: false,
    Wifi: 2,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};

var attrs_Default = {
    Model:"unknown",
    Family:"unknown",
    CLASSICCM:false,
    MOCA:true,
    IPV6:true,
    Battery: true,
    Wifi: 2,
    Dect: false,
    Languages:["English:English", "Spanish:Spanish", "French:French", "German:German","Portuguese:Portuguese"]
};


var g_ModelName = "";
var g_UserName = "";
var g_attrTable = {};
// UNIHAN ADD START
var CAN_NOT_SET_CRED = "can_not_login";
// UNIHAN ADD END
function uh_attrTable_init()
{
	//g_ModelName = mib2system.sysName.get();
	//reduce loading time
        g_ModelName=readCookie("sysDescrModelName");
	g_UserName = userName();

	/*switch (g_ModelName)
	{
		case "TG862G": g_attrTable = attrs_TG862G; break;
		case "TG1642": g_attrTable = attrs_TG1642; break;
		case "DG1670": g_attrTable = attrs_DG1670; break;
		case "TG1672": g_attrTable = attrs_TG1672; break;
		case "TG1682": g_attrTable = attrs_TG1682; break;
		case "MG2402": g_attrTable = attrs_MG2402; break;
		default: g_attrTable = attrs_Default; break;
	}*/
	if (g_ModelName.search("TG862")!=-1)
	{
	         g_attrTable = attrs_TG862G;
	}
        else if (g_ModelName.search("TG852")!=-1)
        {
                 g_attrTable = attrs_TG852G;
        }
	else if (g_ModelName.search("TG1642")!=-1)
	{
	         g_attrTable = attrs_TG1642;
	}
	else if (g_ModelName.search("DG1670")!=-1)
	{
	         g_attrTable = attrs_DG1670;
	}
	else if (g_ModelName.search("TG1672")!=-1)
	{
	         g_attrTable = attrs_TG1672;
	}
	else if (g_ModelName.search("TG1682")!=-1)
	{
	         g_attrTable = attrs_TG1682;
	}
	else if (g_ModelName.search("MG2402")!=-1)
	{
	         g_attrTable = attrs_MG2402;
	}
    else if (g_ModelName.search("OG1600A")!=-1)
    {
             g_attrTable = attrs_OG1600;
    }
	else
	{
	         g_attrTable = attrs_Default;
	}	
}
function uh_getModel()
{
	return g_attrTable["Model"];
}
function uh_hasBattery()
{
	return true==g_attrTable["Battery"];
}
function uh_hasWifi()
{
	if (g_attrTable["Wifi"]>0)
	{
	        return g_attrTable["Wifi"];
	}
	else
	{	 
		return false;
	}
}
function uh_hasMoca()
{
	return true==g_attrTable["MOCA"];
}
function uh_hasDect()
{
	return true==g_attrTable["Dect"];
}

function encode(o) {
    o = "" + o;
    /* encode "%" was switched "%2525"  */	
    //o = o.replace(/%/g, "%25");
    o = encodeURIComponent(o);
    o = o.replace(/;/g, "%3B");
    o = o.replace(/,/g, "%2C");
    return o;
}
function getAttr(name) {
    return attrs[name] || "";
}
function isMG() {
    return attrs["Family"] == "MG";
}
function is852() {
    return attrs["Family"] == "852";
}
function is95x() {
    return attrs["Family"] == "950";
}
function isIPV6() {
    return attrs["IPV6"];
}
function getLanguages() {
    return attrs["Languages"];
}
function userName() {
    return attrs["Name"] || "";
}
function isTechnician() {
    return isLoggedIn() && (isMG() || attrs["Technician"]);
}
function isLoggedIn() {
    if (!attrs["Credential"]) {
        attrs["Credential"] = readCookie("credential");
        if (attrs["Credential"]) {
            var o = Base64.decode(attrs["Credential"]);
            o = JSON.parse(o);
            attrs["Family"] = o["family"];
            attrs["Technician"] = o["tech"];
            attrs["Name"] = o["name"];
        }
    }
    return attrs["Credential"];
}
var hooks = {
    buildSetURL:function (oid, value, type) {
        var url = "snmpSet?oid=" + oid + "=" + encode(value) + ";" + type + ";";
        return url;
    },
    buildGetURL:function (oida) {
        var url = "snmpGet?oids=" + _.reduce(oida, function (acc, oid) {
            return acc + encode(oid) + ";";
        }, "");
        return url;
    },
    buildMultiGetURL:function (oida) {
            var url = "snmpGet?oids=" +oida+";"; //Get Data typeless
        return url;
    },
    buildWalkURL:function (oida) {
        var url = "walk?oids=" + _.reduce(oida, function (acc, oid) {
            return acc + encode(oid) + ";";
        }, "");
        return url;
    },
    buildMultiWalkURL:function (oida) {
        var url = "walk?oids=" + oida;
        return url;
    },
    postProcess:function (json) {
        return json;
    }
};

function snmpSet1(oid, value, type) {
/*
//ASN.1 basic types, all in UNIVERSAL scope 
#define A_NO_ID             0x00
#define A_BOOLEAN           0x01
#define A_INTEGER           0x02
#define A_BITSTRING         0x03
#define A_OCTETSTRING       0x04
#define A_NULL              0x05
#define A_OBJECTID	    		0x06
#define A_SEQUENCE          0x10
#define A_SET               0x11
#define A_APPLICATION       0x40

#define	VT_NUMBER			A_INTEGER
#define	VT_STRING			A_OCTETSTRING
#define VT_BITS				A_OCTETSTRING		// same as a string
#define	VT_OBJECT			A_OBJECTID
#define	VT_EMPTY			A_NULL
#define	VT_IPADDRESS	(A_APPLICATION | 0)
#define	VT_COUNTER		(A_APPLICATION | 1)
#define	VT_GAUGE			(A_APPLICATION | 2)
#define	VT_UNSIGNED32	(A_APPLICATION | 2)	// same as a guage
#define	VT_TIMETICKS	(A_APPLICATION | 3)
#define	VT_OPAQUE			(A_APPLICATION | 4)
#define	VT_COUNTER64	(A_APPLICATION | 6)
#define VT_UINTEGER32	(A_APPLICATION | 7)
*/
    //  value = encodeHack(value);
    var url = hooks.buildSetURL(oid, value, type); //"snmpSet?oid=" + oid + "=" + encode(value) + ";" + type + ";";
    //$.log("set " + decodeOid(oid) + "=" + value);
    if (window.console) console.log("set " + decodeOid(oid) + "=" + value);
    //$.log(url);
    if (window.console) console.log(url);
    var rv = "fail";
    baseAjax({
        url:url,
	timeout:9000,
        success:function (result) {
            rv = result;
        },
        error:function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                logout(false);
                rv = "unauthorized";
    window.location.href="index.php";
    return;
            }
        },
        //           dataType : "json",
        async:false,
        cache:false
    });

    if (rv == "unauthorized")
        throw "unauthorized";
    if (rv == "fail" && shouldVerify(oid, value))
        throw "Unexpected Error";//xlate("Unexpected Error");
    //$.log(">>" + JSON.stringify(rv));
    if (window.console) console.log(">>" + JSON.stringify(rv));
    return rv;
}


function shouldVerify(oid, val) {
   // if (isMG())
   //     return false;  // GW snmp is a little screwy so skip for now

    if (oid.startsWith(arLanClientType.oid + ".")) // 950 bug
        return false;

    if (oid.startsWith(arApplyAllSettings.oid + "."))
        return true; //was false;
    if (oid.startsWith(arWpsSTAPin.oid + "."))
        return false;
    if (oid.startsWith(arWpsPushButton.oid + "."))
        return false;
    if (oid.startsWith(arCurrentTime.oid + "."))
        return false;
    if (oid.startsWith(arEmailApplySettings.oid + "."))
        return false;
    if (oid.startsWith(arClearLogs.oid + "."))
        return false;
    if (oid.startsWith(arReboot.oid + "."))
        return false;
    if (oid.startsWith(arClearMSOLogs.oid + "."))
        return false;
    if (oid.startsWith(arEmailApplySettings.oid + "."))
        return false;
    if (oid.startsWith(arApplySNTPSettings.oid + "."))
        return false;
    if (oid.startsWith(arDefaults.oid + "."))
        return false;
    if (oid.startsWith(SNTPServerTable.oid + "."))
        return false;
    if (oidIsRowStatus(oid) && val != 1)
        return false;
    return true;
}


function snmpSet1Async(oid, value, type, func) {
    //  value = encodeHack(value);
    var url = hooks.buildSetURL(oid, value, type); //"snmpSet?oid=" + oid + "=" + encode(value) + ";" + type + ";";
    //$.log("setasync " + decodeOid(oid) + "=" + value);
    if (window.console) console.log("setasync " + decodeOid(oid) + "=" + value);
    //$.log(url);
    if (window.console) console.log(url);

    baseAjax({
        url:url,
        success:function (result) {
            if (func) func(true);
        },
        error:function (jqXHR, textStatus, errorThrown) {
            if (func) func(false);
        },
//        error: function(jqXHR, textStatus, errorThrown) {
//            alert("text:{An error has occured.  Your changes may have not been applied.  Please refresh this page and verify the changes you expect.}");
//            throw "";
//        },
        //           dataType : "json",
        async:true,
        cache:false
    });
}


function snmpGet1(oid) {
    try {
        var url = hooks.buildGetURL([oid]); //"snmpGet?oids=" + encode(oid) + ";";
        //var url = "walk?oids=" + encodeURI(oid + ";");
        //$.log(url);
        var rv = "";
        baseAjax({
            url:url,
	timeout:9000,
            success:function (result) {
                //$.log("get result " + result);
                if (window.console) console.log("get result " + result);
                rv = result;
            },
            error:function (jqXHR, textStatus, errorThrown) {
                logout(false);
                rv = "unauthorized";
    window.location.href="index.php";
    return;
            },
            dataType:"text",
            async:false,
            cache:false
        });
        // strip of any crap on front for sercomm bug
        //  if (rv && (typeof rv == 'string')) {
        //      while (rv.length !== 0 && rv.charAt(0) != '{' && rv.charAt(0) != '[') {
        //         rv = rv.substr(1);
        //     }
        //     rv = rv.replace(",", "");
        // }

        //$.log("pre-parse" + rv);
        if (window.console) console.log("pre-parse" + rv);
        var rrv = JSON.parse(rv);
        //$.log("" + rrv);
        if (window.console) console.log("" + rrv);
        rrv = hooks.postProcess(rrv);
        //$.log(">>" + JSON.stringify(rrv));
        if (window.console) console.log(">>" + JSON.stringify(rrv));
        if (rrv && rrv[oid])
            rrv = rrv[oid];
        else rrv = "";
        //return decodeHack(rv);
        return rrv;
    } catch (e) {
        //$.log("snmp get error " + e);
        if (window.console) console.log("snmp get error " + e);
        return "";
    }
}


function xxxcompare(a, b) {
    a = "" + a;
    b = "" + b;
    if (a.startsWith("$"))
        a = a.replace(/ /g, "");
    if (b.startsWith("$"))
        b = b.replace(/ /g, "");
    if (a.startsWith("$") && !b.startsWith("$")) {
        if (canConvertToASCII(a))
            a = convertHexStringToASCIIString(a)
    } else if (b.startsWith("$") && !a.startsWith("$")) {
        if (canConvertToASCII(b))
            b = convertHexStringToASCIIString(b)
    }
    if (a.length === 0 && b === "$00000000") {
        return true;
    }
    if (a.startsWith("$") && b.startsWith("$")) {
        return a.toUpperCase() == b.toUpperCase();
    }
    return a == b;
}

var canCloseWaitDialog = false;
function openWaitDialog() {
    canCloseWaitDialog = false;
    $("#wait-dialog").dialog(
        { autoOpen:false,
            height:80,
            width:250,
            resizable:false,
            title:"Please Wait",
            beforeClose:function () {
                return canCloseWaitDialog;
            }
        });
    prepareDialog("wait-dialog");
    $("#wait-dialog").dialog("open");
}

function closeWaitDialog() {
    canCloseWaitDialog = true;
    $("#wait-dialog").dialog("close");
}


function doApplyAndRebootAsync(applyNeeded, rebootNeeded, refreshNeeded) {
    var canCloseWaitDialog = false;
    var busyDialogNeeded = true;

    function openWaitDialog() {
        if (!busyDialogNeeded)
            return;
        canCloseWaitDialog = false;
        $("#wait-dialog").dialog(
            { autoOpen:false,
                height:80,
                width:250,
                resizable:false,
                title:"Please Wait",
                beforeClose:function () {
                    return canCloseWaitDialog;
                }
            });
        prepareDialog("wait-dialog");
        $("#wait-dialog").dialog("open");
    }

    function closeWaitDialog() {
        busyDialogNeeded = false;
        canCloseWaitDialog = true;
        $("#wait-dialog").dialog("close");
    }

    function start() {
        if (applyNeeded)
            snmpSet1Async(arApplyAllSettings.oid + ".0", "1", "2", applyDone);
        else applyDone(true);
    }

    function applyDone(ok) {
        if (rebootNeeded)
            snmpSet1Async(arReboot.oid + ".0", "1", "2", rebootDone);
        else rebootDone(true);
    }

    function rebootDone(ok) {
        closeWaitDialog();
        if (refreshNeeded)
            refresh();
    }

    setTimeout(openWaitDialog, 2);
    start();
}


// sa [ string... ]
function snmpGet(sa) {
    try {
        var url = hooks.buildGetURL(sa);
        var rv = "";
        baseAjax({
            url:url,
	timeout:9000, 
            success:function (result) {
                rv = result;
            },
            error:function (jqXHR, textStatus, errorThrown) {
                logout(false);
                rv = "unauthorized";
    window.location.href="index.php";
    return;
            },
            dataType:"json",
            async:false,
            cache:false

        });
        rv = hooks.postProcess(rv);
        //$.log(rv);
        if (window.console) console.log(rv);
        return rv;
    } catch (e) {
        //$.log("snmpGet caught " + e);
        if (window.console) console.log("snmpGet caught " + e);
        return { };
    }
}

// sa [ string... ]
function snmpMultiGet(sa) {
    try {
        var url = hooks.buildMultiGetURL(sa);
        var rv = "";
        baseAjax({
            url:url,
	timeout:9000, 
            success:function (result) {
                rv = result;
            },
            error:function (jqXHR, textStatus, errorThrown) {
                logout(false);
                rv = "unauthorized";
    window.location.href="index.php";
    return;
            },
            dataType:"json",
            async:false,
            cache:false

        });
        rv = hooks.postProcess(rv);
        //$.log(rv);
        if (window.console) console.log(rv);
        return rv;
    } catch (e) {
        //$.log("snmpGet caught " + e);
        if (window.console) console.log("snmpGet caught " + e);
        return { };
    }
}

// sa [ string... ]

function snmpWalk(sa) {
    try {
        var url = hooks.buildWalkURL(sa);
        var rv = "";
        baseAjax({
            url:url,
	timeout:9000, 
            success:function (result) {
                rv = result;
                //                _.each(_.keys(rv), function(k) {
                //                    var dv = encodeHack(rv[k]);
                //                   rv[k] = dv;
                //                });
            },
            error:function (jqXHR, textStatus, errorThrown) {
                logout(false);
                rv = "unauthorized";
    window.location.href="index.php";
    return;
            },
            dataType:"json",
            async:false,
            cache:false

        });
        //$.log(rv);
        if (window.console) console.log(rv);
        rv = hooks.postProcess(rv);
        return rv;
    } catch (e) {
        //$.log("snmpWalk caught " + e);
        if (window.console) console.log("snmpWalk caught " + e);
        return { };
    }
} 


// sa [ string... ]

function snmpMultiWalk(sa) {
    try {
        var url = hooks.buildMultiWalkURL(sa);
        var rv = "";
        baseAjax({
            url:url,
            success:function (result) {
                rv = result;
                //                _.each(_.keys(rv), function(k) {
                //                    var dv = encodeHack(rv[k]);
                //                   rv[k] = dv;
                //                });
            },
            error:function (jqXHR, textStatus, errorThrown) {
                logout(false);
                rv = textStatus;//"unauthorized";
            },
            dataType:"text",
            async:false,
            cache:false

        });
        //$.log(rv);
        if (window.console) console.log(rv);
        rv = hooks.postProcess(rv);
        return rv;
    } catch (e) {
        //$.log("snmpWalk caught " + e);
        if (window.console) console.log("snmpWalk caught " + e);
        return { };
    }
}

function login(name, password) {
    var up = Base64.encode(name + ":" + password);
    var limit_flag = false;
    attrs["Credential"] = "";
    if (window.console) console.log("create credential=" + up);
    eraseCookie("credential");setSessionStorage("ar_nonce","");
    baseAjax({
        url:"login?arg=" + up,
        success:function (result) 
        {
            if( result == CAN_NOT_SET_CRED )
            {
                limit_flag = true;
            }
            else
            {
            	createCookie("credential", result);
            }
        },
        dataType:"text",
        async:false,
        cache:false
    });
    if( limit_flag == true )
    {
        return CAN_NOT_SET_CRED; 
    }
    return isLoggedIn();
}


function logout(sendMsg) {
    attrs["Credential"] = "";
    eraseCookie("credential");
    setSessionStorage("ar_nonce","");
    if (sendMsg) {
        baseAjax({
            url:"logout",
            dataType:"text",
            async:false,
            cache:false
        });
    }
    refresh();
}
function changePassword( name ,OldPassword, NewPassword ) {
    var cred = Base64.encode( name + ":" + OldPassword + ":" + NewPassword );
    var rv = "";
    baseAjax({
        url:"setPassword?arg=" + cred,
        success:function (result) {
            rv = result;
        },
        dataType:"text",
        async:false,
        cache:false
    });
    var ok = rv === "ok" || rv === "true";

    //   if (ok) {
    //      logout();
    //      login(loginData.name, NewPassword);
    //  }

    return ok;
}

function logfilestore(logtype, idxStr) {

    baseAjax({
        url:"storelog?arg=" + logtype + idxStr,
        dataType:"text",
        async:false,
        cache:false
    });
	
    if (window.console) console.log("storelog");
}

function checkPassword(name, password ) {
    var up = Base64.encode(name + ":" + password );
    var ret = "";
    baseAjax({
        url:"checkPassword?arg=" + up,
        success:function (result) {
            ret = result;
        },
        dataType:"text",
        async:false,
        cache:false
    });

    if( ret == "true" )
    {
        return true;
    }
    else
    {
        return false;
    }
}

//BEGIN PROD00219791 CSRF issue.
function getNonce() {
    var n = getSessionStorage("ar_nonce");
    if (!n) {
        n = "_n="+(""+Math.random()).substr(2,5);
        setSessionStorage("ar_nonce", n);
    }
    return n;
}

function wrapNonce(url){
	if (!url) return url;
	var startChar = url.indexOf('?') === -1 ? '?' : '&';
    url += startChar + getNonce();
    return url;
}
// Notice that all new added function that call jQuery.ajax, should use baseAjax to instead it.
function baseAjax(options){
	options.url = wrapNonce(options.url);
	jQuery.ajax(options);
}
// END PROD00219791 CSRF issue.


