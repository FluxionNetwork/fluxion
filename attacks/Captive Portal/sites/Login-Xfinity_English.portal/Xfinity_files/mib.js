//(c) Copyright 2011-2012, ARRIS Group, Inc., All rights reserved.
//justin add
document.write("<scr" + "ipt language=JavaScript src=mib2.js type=text/javascript><\/scr" + "ipt>");
//justin add end

var walk = { };
var loads = [];
var stores = [];
var table = { };
var container = { };
var oidsRead = [ ];
var mib = { };
var bulkLoading = false;
var bulkList = [ ];


function appendMulti_OID(obj_in)
{
    var oid_array="";
    var i=0;
    for(;i<obj_in.length-1;i++)
    {
	    oid_array+=obj_in[i]["mibobj"].oid+"."+obj_in[i]["index"]+";";
    }
    if (obj_in[i]) oid_array+=obj_in[i]["mibobj"].oid+"."+obj_in[i]["index"]+";";
    return oid_array;
}

function MIB_dumpArray(MIB_Arrays)      //Debug
{
    var p=0;
    if (window.console) console.log("Current Array:");
    for(p=0;p<MIB_Arrays.length-1;p++)
    {
        if (window.console) console.log("\t"+MIB_Arrays[p]["mibobj"].name+"["+MIB_Arrays[p].index+"]"+",");
    }
    if (window.console) console.log("\t"+MIB_Arrays[p]["mibobj"].name+"["+MIB_Arrays[p].index+"]");
    
}

function MIB_objSort(MIB_objs)  //Sequence Array only
{
    /* Sequence Rearrange subroutine (XX=name,[x]=index)
     * AA[1],BB[1],CC[1],AA[2],BB[2],CC[2],AA[3],BB[3],CC[3]
     * become....
     * AA[1],AA[2],AA[3],BB[1],BB[2],BB[3],CC[1],CC[2],CC[3]
    */
    var MIB_Arrays=MIB_objs;
    var MIB_Arrays_sorted=new Array();
    var MIB_len=MIB_Arrays.length;
    for(var i=0;i<MIB_len-1;i++)
    {
        if(MIB_Arrays[i].index>=0)
        {
            var current_pos=MIB_Arrays[i];
            MIB_Arrays_sorted.push(current_pos);
            for(var j=i+1;j<MIB_len;j++)
            {
                try{
                if((MIB_Arrays[j].index>=0)&&(current_pos["mibobj"].name==MIB_Arrays[j]["mibobj"].name))
                {
                    if(MIB_Arrays[j].index>=current_pos.index)
                    {
                        var newobj=MIB_Arrays[j];
                        MIB_Arrays_sorted.push(newobj);
                        if (window.console) console.log("push:"+MIB_Arrays[j]["mibobj"].name+"["+MIB_Arrays[j].index+"] under: "+MIB_Arrays[i]["mibobj"].name+"["+MIB_Arrays[i].index+"]");
                    }
                    else    /* simple sort */
                    {                        
                        var temp_obj=MIB_Arrays_sorted.pop();
                        MIB_Arrays_sorted.push(newobj);
                        MIB_Arrays_sorted.push(temp_obj);
                    }
                    
                    if(MIB_Arrays_sorted.length==MIB_len)
                    {
                        MIB_dumpArray(MIB_Arrays_sorted);
                        return MIB_Arrays_sorted;
                    }
                    else
                    {
                        if(MIB_Arrays_sorted.length==0)
                        {
                            MIB_Arrays_sorted=MIB_objs;
                            return MIB_Arrays_sorted;
                        }
                    }
                }
                else
                {
                    ;//MIB_dumpArray(MIB_Arrays_sorted);      For Console debug
                }
                }catch(e)
                {
                    if (window.console) console.log("Error:"+e);
                    if(MIB_Arrays_sorted.length==0)
                    {
                        MIB_Arrays_sorted=MIB_objs;
                        return MIB_Arrays_sorted;
                    }
                    else
                        return MIB_objs;
                }
            }
        }
    }
    
    return MIB_objs;
}

function MIB_JSON2Str(MIB_objs)
{
    var MIB_size=MIB_objSize(MIB_objs);
    var MIB_Str="";
    var MIB_count=0;
    for(var index_key in MIB_objs)
    {
        if(!isArray(MIB_objs[index_key]))
            MIB_Str+='"'+index_key+'":"'+MIB_objs[index_key]+'"';
        else
        {
            var MIB_subArray=MIB_objs[index_key];
            var tempStr="";
            var i=0;
            for(i=0;i<MIB_subArray.length-1;i++)
            {
                if(MIB_subArray[i]!=undefined)
                    tempStr+='"'+MIB_subArray[i].toString()+'",';
                else
                    tempStr+='"",';
            }
            if(MIB_subArray[i]!=undefined)
                tempStr+='"'+MIB_subArray[i].toString()+'"';
            else
                tempStr+='""';
            MIB_Str+='"'+index_key+'":['+tempStr+']';
        }
        MIB_count++;
        if(MIB_count<MIB_size)
            MIB_Str+=",";
    }
    return MIB_Str;
}
function MIB_reduceArray(MIB_Result)
{
    for (var index_key in MIB_Result)
    {
        if(isArray(MIB_Result[index_key])&&MIB_Result[index_key].length==1)
        {
            MIB_Result[index_key]=MIB_Result[index_key][0];
        }
    }
    return MIB_Result;
}

function alphanumeric(alphane)
{
	var numaric = alphane;
	for(var j=0; j<numaric.length; j++)
		{
		  var alphaa = numaric.charAt(j);
		  var hh = alphaa.charCodeAt(0);
		  if((hh > 47 && hh<58) || (hh > 64 && hh<91) || (hh > 96 && hh<123))
		  {
		  }
		else	{
			 return false;
		  }
 		}
 return true;
}
function MIB_BatchLoad(MIB_objs,force_multi)
{
    var MIB_query=appendMulti_OID(MIB_objs);
    var MIB_Result;//=new Array();;//=[];//
    var MIB_Str="{";
    var MIB_JSON=snmpMultiGet(MIB_query);
    var MIB_len=MIB_objs.length;
    var i=0;
    if (force_multi==undefined)
      force_multi = false;
    for (var index_key in MIB_JSON)
    {
    	//alert("index_key:"+index_key);
        var DataRow ="";
        if(index_key==(MIB_objs[i]["mibobj"].oid+"."+MIB_objs[i]["index"]))
        {
            DataRow='"'+MIB_objs[i]["mibobj"].name+'":[';
            val0=MIB_JSON[index_key];
            if (MIB_objs[i]["mibobj"].type==4)
            {
                //val2=convertHexStringToASCIIString(val0);
                //if ( MIB_objs[i]["mibobj"].compo==1 )
                {
                    val2=val0;
                }
                DATA=val2.escapeChars();
            }
	        else
	        {
	            DATA=val0;	    
            }
            //if(index_key=="1.3.6.1.4.1.4115.1.3.3.1.1.2.1.1.0")
           	 	//	alert("index_key:"+index_key+" DATA:"+DATA);
            
            //luis add
            if(DATA.toUpperCase()=="NO SUCH OBJECT")
            	 DATA="";
            //luis add end
            
            if((i>=1)&&(MIB_objs[i]["mibobj"].name==MIB_objs[i-1]["mibobj"].name))
            {
                MIB_Str=MIB_Str.substring(0,MIB_Str.lastIndexOf("]"));
                MIB_Str+=',"'+  DATA.toString() +'"]'; //More
                MIB_Str+=((i<MIB_len-1)?",":"");
                i++;
                continue;
            }
            else
                DataRow+='"'+ DATA.toString()+'"';
            i++;
            if(DataRow.lastIndexOf("]")<DataRow.length-1)
                DataRow+="]";
            MIB_Str+=(DataRow+((i<MIB_objs.length)?",":""));
        }
        else
        {
            //Exception!
            if (window.console) console.log("Error!OID mismatch:"+index_key+" vs "+MIB_objs[i]["mibobj"].oid+">>\n{"+MIB_objs[i]["mibobj"].name+":"+MIB_JSON[index_key].toString()+"}");
            return undefined;
        }
    }
    MIB_Str+="}";
    MIB_Result=eval('('+MIB_Str+')');
    //Reduce one element Array
    if(!force_multi)
    {
        MIB_Result=MIB_reduceArray(MIB_Result);
    }
//    alert("(mib.js)MIB_BatchLoad str=["+MIB_Str+"].");
    return MIB_Result;
}

function MIB_objSize(MIB_objs)
{
    var count=0;
    for(var index_key in MIB_objs)
    {
        count++;
    }
    return count;
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function MIB_objAppend(MIB_objs,MIB_objs_2,force_multi)
{
    if(force_multi==undefined)
         force_multi=false;
    var MIB_Result;
    var MIB_size=MIB_objSize(MIB_objs);
    var MIB_size_2=MIB_objSize(MIB_objs_2);
    var MIB_Str=MIB_JSON2Str(MIB_objs);
    
    if(MIB_size_2>0)
        MIB_Str+=",";
    MIB_Str+=MIB_JSON2Str(MIB_objs_2);
    MIB_Str="{"+MIB_Str+"}";
    MIB_Result=eval('('+MIB_Str+')');
    if(!force_multi)
    {
        MIB_Result=MIB_reduceArray(MIB_Result);
    }
    return MIB_Result;
}



function bulkLoad(load_func) {
    bulkLoading = true;
    bulkList = [];
    load_func();
    bulkLoading = false;
    if (bulkList.length === 0)
        return;
    var oids = [];
    _.each(bulkList, function (oid, index) {
        oids.push(oid);
        if (oids.length === 20 || index === (bulkList.length-1)) {
            var v = snmpGet(oids);
            _.each(v, function (val, key) {
              walk[key] = val;
            });
            oids = [];
        }
    });
}

function sliceOid(oid, start, end) {
    var oids = oid.split(".");
    if (start < 0) {
        start = oids.length + start;
        end = oids.length;
    } else {
        end = (end === undefined ? oids.length : end);
    }
    if (end < 0) {
        end = oids.length + end;
    }
    return _(oids.slice(start, end)).reduce(function(acc, next) {
        return acc ? acc + "." + next : next;
    });
}

//function getWalkOids(targetOid) {
//    $.each(oidMap, function(oid,def) {
//        if (!oid.startsWith(target))
//            return;
//
//
//    });
//}

if (window["preWalk"])
    walk = window["preWalk"];

function afterLoad(f) {
    {
        f.loaded = true;
        if (f.afterLoad) f.afterLoad();
    }
}
function load1(f, json) {
    if (json === undefined)
        json = snmpWalk([ f.oid ]);
    // json = JSON.parse(json || "{ }");
    _(json).each(function(val, oid) {
        walk[oid] = val;
    });
    {
        f.loaded = true;
        if (f.afterLoad) f.afterLoad();
    }
}

var loadLogData = "";

function loadLogger(l) {
    if (window.console) console.log(l);
    if (debug()&2 && !(l.contains("assword", "TAC","RadiusKey")) )
        loadLogData += (l+"<br/>");
}

function load() {
    loadLogData = "";
    var args = _(_.toArray(arguments));
    if (!window["preWalk"]) {
        var oids = args.map(function(f) {
            return f.oid;
        });
        var json = snmpWalk(oids);
        // json = JSON.parse(json || "{ }");
        _(json).each(function(val, oid) {
            walk[oid] = val;
        });
    }
    args.each(function(f) {
        f.loaded = true;
        if (f.afterLoad) f.afterLoad();
    })
    loadRowStatus();

// mb
//    args.each(function(f) {
//        f.dump(loadLogger);
//    })
//    if (debug()&2)
//        afterBuild( function() {
//            showWalk(loadLogData);
//        });

}

function loadFake() {
    var args = _(_.toArray(arguments));
    args.each(function(f) {
        f.loaded = true;
        if (f.afterLoad) f.afterLoad();
    })
}
function loadOids(oa) {
    function doget(a) {
        var json = snmpWalk(a);
        // json = JSON.parse(json || "{ }");
        _(json).each(function(val, oid) {
            walk[oid] = val;
        });
    }

    var soa = [ ];
    _.each(oa, function(o) {
        soa.push(o);
        if (soa.length > 5) {
            doget(soa);
            soa = [ ];
        }
    });
    if (soa.length)
        doget(soa);
}


function store() {
    MibObjects.ApplyAllSettings.set(1);
    refresh();
}

function listAccessed() {
    _.each(_.extend({}, container, table), function(f) {
        if (f.accessed) if (window.console) console.log(f.name);
    });
}

function decodeOid(oid) {
    var d = "";
    var match = { oid: "" };
    _.each(_.extend({}, container, table), function(f) {
        _.each(f.children, function(e) {
            if (oid.startsWith(e.oid + ".") && e.oid.length > match.oid.length) {
                match = e;
            }
        })
    });
    //d = e.name+oid.substr(e.oid.length);
    return match.oid ? match.name + oid.substr(match.oid.length) : "???" + oid;
}

function decodeOid(oid) {
    var d = "";
    var match = { oid: "" };
    _.each(_.extend({}, container, table), function(f) {
        _.each(f.children, function(e) {
            if (oid.startsWith(e.oid + ".") && e.oid.length > match.oid.length) {
                match = e;
            }
        })
    });
    //d = e.name+oid.substr(e.oid.length);
    return match.oid ? match.name + oid.substr(match.oid.length) : "???" + oid;
}



function dumpOidsRead() {
    _.each(oidsRead, function(o) {
        if (window.console) console.log(o);
    });
}


function oidValuesEqual(a,b) {
    if ((""+a).startsWith("$") && (""+b).startsWith("$")) {
        return a.replace(/ /g,"") === b.replace(/ /g,"")
    }
    return a == b;
}


function Container(name, oid) {
    this.name = name;
    this.oid = oid;
    mib[oid] = this;
    container[oid] = this;
    this.parent = mib[sliceOid(oid, 0, -1)];
    if (this.parent)
        this.parent.children.push(this);
    //$.log("container "+name+" parent "+(this.parent ? this.parent.name : "ROOT"));
    this.children = [ ];
    this.loaded = false;
    this.accessed = false;
    this.dump = function(f) {
        var or = oidsRead.slice(0);
        if (f === undefined)
            f = $.log;
        accessed = this.accessed;
        f(name + " ===============");
        _.each(this.children, function(v) {
            if (v !== undefined && v.scalar)
                f(v.name + ":" + v.get());
        });
        this.accessed = accessed;
        oidsRead = or;
    };
    this.json = function() {
        return { name:this.name,type:"container",oid:this.oid,
            children: _.map(this.children, function(f) {
                return f.json();
            }) };
    }
}

function Table(name, oid) {
    this.oid = oid;
    this.name = name;
    mib[oid] = this;
    table[oid] = this;
    this.parent = mib[sliceOid(oid, 0, -1)];
    if (this.parent)
        this.parent.children.push(this);
    //$.log("table "+name+" parent "+(this.parent ? this.parent.name : "???"));
    this.key = [];
    this.children = [ ];
    this.loaded = false;
    this.accessed = false;
    this.rowStatus = null;
    this.rowVisible = function(key) {
        var vis = true;
        if (this.rowStatus) {
            vis =  this.rowStatus.getOid(key) <= 2;/* 2: not in service 1: active */
            if (!vis)
                if (window.console) console.log(name+"."+key+" not visible: "+this.rowStatus.getOid(key));//
        }
        return vis;
    };
    this.length = function() {
        return this.key.length;
    };
    this.afterLoad = function() {
        var hash = { };
        _.each(walk, function(v, k) {
            if (k.startsWith(oid + ".")) {
                //key = sliceOid(k.substr(oid.length+1),2);
                //var tableoid = sliceOid(k,0,-2);
                var testKey = sliceOid(k.substr(oid.length + 1), 2);
                if (testKey && !hash[testKey]) {
                    hash[testKey] = testKey;
                    this.key.push(testKey);
                }
            }
        }, this);
        this.loaded = true;
        loadRowStatus();
    }
    this.dumpGroupRow = true;
    this.dump = function(f) {
        var or = oidsRead.slice(0);
        if (f === undefined)
            f = $.log;
        accessed = this.accessed;
        var rv = "";
        for (var i = 0; i < this.length(); i++) {
            rv += this.key[i] + ";";
        }
        f("table " + name + " size=" + this.length() + "  " + rv);
        var rv = "";
        for (var i = 0; i < this.length(); i++) {
            $.each(this.children, function(k, v) {
                if (v.get(i)) {
                    rv += (v.name + ":" + v.get(i) + ";");
                    if (!this.dumpGroupRow) {
                        f("===" + this.table.key[i] + "==>" + rv);
                        rv = "";
                    }
                }
            });
            if (rv.length && this.dumpGroupRow)
                f("===" + this.key[i] + "==>" + rv);
        }
        this.accessed = accessed;
        oidsRead = or;
        f("rowStatus: "+ (this.rowStatus ? this.rowStatus.name : ""));
    }
    this.json = function() {
        return { name:this.name,type:"table",oid:this.oid,
            children: _.map(this.children, function(f) {
                return f.json();
            }) };
    }
    this.getTable = function(cola, func) {
        if (walk[this.oid] === undefined) {
            walk[this.oid] = "";
            _.extend(walk, snmpWalk([this.oid]));
            this.afterLoad();
        }
        else if (0 == this.oid.indexOf(MtaDevVqmMetricTable.oid))
        {
            walk[this.oid] = "";
            _.extend(walk, snmpWalk([this.oid]));
            this.key.splice(0,this.key.length);
            this.afterLoad();

        }
        else if (0 == this.oid.indexOf(MtaDevVqmCallNumberTable.oid))
        {
            walk[this.oid] = "";
            _.extend(walk, snmpWalk([this.oid]));
           this.key.splice(0,this.key.length);
           this.afterLoad();
        }
        else if (0 == this.oid.indexOf(MACAccessTable.oid))
        {
            walk[this.oid] = "";
            _.extend(walk, snmpWalk([this.oid]));
           this.key.splice(0,this.key.length);
           this.afterLoad();
        }
        var or = oidsRead.slice(0);
        var table = [ ];
        if (!cola)
            cola = this.children;
        for (var i = 0; i < this.length(); i++) {
            if (!this.rowVisible(this.key[i]))
                continue;
            var row = [];
            _.each(cola, function(c) {
	        val0=c.get(c.table.key[i]);
                if (c.type==4)
		{
		  //val2=convertHexStringToASCIIString(val0);
		  //if (c.compo==1)
		  {
                     val2=val0;
		  }
                }
		else
		  val2=val0;
		        //luis add
            if(val2.toUpperCase()=="NO SUCH OBJECT")
            	 val2="";
            //luis add end

                row.push(val2);
						
            });
            if (func) {
                row = func(i, row, this.key[i]);
                if (row)
                    table.push(row);
            }
            else table.push(row);            	
        }
        oidsRead = or;
        return table;
    }

    this.getTableFromJson = function(json_obj,cola, func) {
        //walk[this.oid]=json_obj[this.name];
	_.extend(walk,json_obj[this.name]);
        this.afterLoad();
        var or = oidsRead.slice(0);
        var table = [ ];
        if (!cola)
            cola = this.children;
        for (var i = 0; i < this.length(); i++) {
            if (!this.rowVisible(this.key[i]))
                continue;
            var row = [];
            _.each(cola, function(c) {
	        val0=c.get(c.table.key[i]);
                if (c.type==4)
		{
		  //val2=convertHexStringToASCIIString(val0);
		  //if (c.compo==1)
		  {
                     val2=val0;
		  }
                }
		else
		  val2=val0;		
                row.push(val2);
            });
            if (func) {
                row = func(i, row, this.key[i]);
                if (row)
                    table.push(row);
            }
            else table.push(row);
        }
        oidsRead = or;
        return table;
    }

    this.getMultiTable = function(tables_oid) {
    var temp_str="";
    var MIB_Result;
    var MultiTable=[ ];
    var tablecount=tables_oid.length,i;
    for(i=0;i<tablecount;i++)
    {
    	try {
          if (tables_oid[i].oid) temp_str+=tables_oid[i].oid+";";
	} catch(e)
	{
	  ;//Do nothing
	}
    }
        temp_str= snmpMultiWalk(temp_str);
    MIB_Result=eval('(['+temp_str+'])');
    for(i=0;i<MIB_Result.length;i++)
    {
        MultiTable[tables_oid[i].name]=MIB_Result[i];
    }
        return MultiTable;
    }

    this.deleteVisible = function(index) {
        for (var i=0;i<this.key.length;i++) {
            if (this.rowVisible(this.key[i])) {
                if (index===0) {
                    this.rowStatus.set(this.key[i],"6"); // delete
                    return;
                } else {
                    index--;
                }
            }
        }
    }
    this.findLowestFree = function(col, max) {
        var or = oidsRead.slice(0);
        var keyMap = { };
        _.each(this.key, function(k, i) {
            keyMap["" + k] = col.get(k);
        });
        var key = _.detect(_.range(1, max + 1), function(i) {
            return keyMap["" + i] === undefined
        });
        if (key == max)
            alert("Table " + this.name + " is full");
        oidsRead = or;
        return key;
    }
    this.addRow = function(rowKey, cva, label) {

       stores = [];

        try {
            this.beforeAddRow(rowKey);
            for (var i = 0; i < cva.length / 2; i++) {
                var col = cva[i * 2];
                var val = cva[i * 2 + 1];
                if (col.table && col.table != this)
                    throw "Wrong table " + this.name + " for " + col.name;
                stores.push({oid:col.oid + "." + rowKey, value:val, type:col.type});

                $.log("addRow " + col.name + "." + rowKey + "=" + val);
            }
            this.afterAddRow(rowKey);
            _.each(stores, function(kvt) {
                try {
                    snmpSet1(kvt.oid, kvt.value, kvt.type);
                } catch (e) {
                    if (e == "unauthorized")
                        refresh();
                    else if (label)
                       throw { oid:kvt.oid, label:label };
                    throw e;
                }
            });
        } finally {
            stores = [];
        }

    }
    this.beforeAddRow = function(key) {
        if (this.rowStatus) {
            if (this.rowStatus.getOid(key) === "")
                stores.push({oid:this.rowStatus.oid + "." + key, value:5, type:this.rowStatus.type}); // createAndWait
        }
    };
    this.afterAddRow = function(key) {
        if (this.rowStatus)
            stores.push({oid:this.rowStatus.oid + "." + key, value:1, type:this.rowStatus.type}); // active
    };
}

function Scalar(name, oid, type, compo) {
    mib[oid] = this;
    this.name = name;
    this.oid = oid;
    this.type = type;
    this.scalar = true;
    this.compo=compo;
    this.parent = container[sliceOid(oid, 0, -1)];
    //$.log("scalar "+name+" parent "+this.parent.name);
    if (!this.parent)
        alert("container for[" + name + ":" + oid + "] not found");
    this.parent.children.push(this);
    this.get = function() {
        if (arguments.length !== 0)
            alert("unexpected index for scalar " + this.name);
        var oid = this.oid+".0";
        if (bulkLoading) {
            bulkList.push(oid);
            return "";
        }
        if (walk[oid] === undefined)
        {
            walk[oid] = snmpGet1(oid) || "";
        }
	else if (oid == arPingPktsSent.oid+".0")
	{
            walk[oid] = snmpGet1(oid) || "";
	}

        if (this.type==4)
	{
	        val0=walk[oid];
		//val2=convertHexStringToASCIIString(walk[oid]);
		//if (this.compo==1)
		{
                  val2=val0;
		}
	        return val2;
	}
	else
          return walk[oid];

        if (!this.parent.loaded)
            alert(this.parent.name + " not loaded");
        this.parent.accessed = true;
        oidsRead.push(oid + ".0");
        return walk[oid + ".0"] || "";
    };
    this.set = function(v, label) {
        try {
            snmpSet1(this.oid + ".0", v, this.type);
        } catch (e) {
            if (e == "unauthorized")
                refresh();
            else if (label)
                throw { oid:this.oid + ".0", label:label };
            throw e;
        }
    };
    this.asyn_set = function(v, label) {
        try {
            snmpSet1Async(this.oid + ".0", v, this.type);
        } catch (e) {
            if (e == "unauthorized")
                refresh();
            else if (label)
                throw { oid:this.oid + ".0", label:label };
            throw e;
        }
    };
    this.defined = function(index) {
        return walk[oid + ".0"] !== undefined;
    }
    this.json = function() {
        return { name:this.name,type:"scalar",oid:this.oid };
    }
}

function Column(name, oid, type, compo) {
    mib[oid] = this;
    this.name = name;
    this.oid = oid;
    this.type = type;
    this.compo=compo;
    this.table = table[sliceOid(oid, 0, -2)];
    //$.log("column "+name+" parent "+this.table.name);
    if (!this.table)
        alert("table for " + name + ":" + oid + " not found");
    this.table.children.push(this);
    this.length = function() {
        return this.table.length();
    };
    this.getKey = function(index) {
        if (!this.table.loaded)
            alert(this.table.name + " not loaded");
        if (index < 0 || index > this.table.key.length)
            if (window.console) console.log("index " + index + " out of range for " + table.name);
        return this.table.key[index] || "";
    }
    this.get = function(index, index2) {
        if (!index || index.asInt() === 0)
           if (window.console) console.log("old style index get "+name+" "+index);
        if (index2 !== undefined)
            index += "."+index2;
        var oid = this.oid+"."+index;

        if (bulkLoading) {
            bulkList.push(oid);
            return;
        }

        if (walk[oid] === undefined)
	{
            walk[oid] = decodeURIComponent(snmpGet1(oid) || "");
            return walk[oid];
	}
	else
	{
            //$.each(walk, function(v, k) {
            //    k=decodeURIComponent(v);
            //});	
            return walk[oid];
	}
        if (arguments.length !== 1)
            alert("expected index for column " + this.name);
        if (!this.table.loaded)
            alert(this.table.name + " not loaded");
        this.table.accessed = true;
        if (index < 0 || index > this.table.key.length) {
            if (window.console) console.log("index " + index + " out of existing range for " + table.name);
            oidsRead.push(oid + "." + (parseInt(index) + 1));
            return walk[oid + "." + (parseInt(index) + 1)] || "";
        }
        oidsRead.push(oid + "." + this.table.key[index]);
        return walk[oid + "." + this.table.key[index]] || "";
    }
    this.getOid = function(index) {
        if (arguments.length !== 1)
            alert("expected index for column " + this.name);
        if (!this.table.loaded)
            alert(this.table.name + " not loaded");
        oidsRead.push(oid + "." + index);
        if (window.console) console.log(this.name+"."+index+" = "+walk[oid + "." + index] || "");
        return walk[oid + "." + index] || "";
    }

    this.set = function(index, value, label) {
        try {
            snmpSet1(this.oid + "."+index, value, this.type);
        } catch (e) {
            if (e == "unauthorized")
                refresh();
            else if (label)
                throw { oid:this.oid + index, label:label };
            throw e;
        }
        return;


        if (v !== undefined)
            throw "this.set v WAS set";

        if (!index || index.asInt() === 0)
           throw  "old style index set "+name+" "+index;
        if (v !== undefined) {
            index += "."+index2;
        } else {
            v = index2;
        }

        if (arguments.length < 2)
            alert("expected index for column " + this.name);

        stores.push({oid: this.oid + "."+index,value:v, type:this.type});
        return;

        if (!this.table.loaded)
            alert(this.table.name + " not loaded");
        var oid = this.oid;
        if (index < 0 || index > this.table.key.length) {
            if (window.console) console.log("index " + index + " out of existing range for " + table.name);
            oid += "." + (parseInt(index) + 1);
        } else {
            oid = this.oid + "." + this.getKey(index);
        }
       // if (!oidValuesEqual(this.get(index), v)) {
            if (window.console) console.log("set " + name + "." + this.getKey(index) + ":" + v);
            stores.push({oid:oid,value:v, type:this.type});
      //  }
      //  else $.log(name + " (" + oid + ") not changed " + v);
    };
    this.asyn_set = function(index, value, label) {
        try {
            snmpSet1Async(this.oid + "."+index, value, this.type);
        } catch (e) {
            if (e == "unauthorized")
                refresh();
            else if (label)
                throw { oid:this.oid + index, label:label };
            throw e;
        }
        return;


        if (v !== undefined)
            throw "this.set v WAS set";

        if (!index || index.asInt() === 0)
           throw  "old style index set "+name+" "+index;
        if (v !== undefined) {
            index += "."+index2;
        } else {
            v = index2;
        }

        if (arguments.length < 2)
            alert("expected index for column " + this.name);

        stores.push({oid: this.oid + "."+index,value:v, type:this.type});
        return;

        if (!this.table.loaded)
            alert(this.table.name + " not loaded");
        var oid = this.oid;
        if (index < 0 || index > this.table.key.length) {
            if (window.console) console.log("index " + index + " out of existing range for " + table.name);
            oid += "." + (parseInt(index) + 1);
        } else {
            oid = this.oid + "." + this.getKey(index);
        }
       // if (!oidValuesEqual(this.get(index), v)) {
            if (window.console) console.log("set " + name + "." + this.getKey(index) + ":" + v);
            stores.push({oid:oid,value:v, type:this.type});
      //  }
      //  else $.log(name + " (" + oid + ") not changed " + v);
    };    
  //  this.setOid = function(index, v) {
   //     if (arguments.length !== 2)
   //         alert("expected index for column " + this.name);
      //  if (!oidValuesEqual(this.get(index), v)) {
  //          $.log("setOid " + name + "." + index + ":" + v);
  //          stores.push({oid:this.oid + "." + index,value:v, type:this.type});
       // }
       // else $.log(name + "." + index + " not changed " + v);
  //  };

    this.defined = function(index) {
        if (index === undefined || index < 0 || index > this.table.key.length)
            return false;
        return walk[oid + "." + this.table.key[index]] !== undefined;
    }
    this.json = function() {
        return { name:this.name,type:"column",oid:this.oid };
    }
}
var Mib = new Container("Mib", "1.3.6.1.4.1.4115.1.20.1");

var MibObjects = new Container("MibObjects", "1.3.6.1.4.1.4115.1.20.1.1");
MibObjects.ApplyAllSettings= new Scalar("ApplyAllSettings","1.3.6.1.4.1.4115.1.20.1.1.9",2);
var arApplyAllSettings=MibObjects.ApplyAllSettings;

var WanConfig = new Container("WanConfig", "1.3.6.1.4.1.4115.1.20.1.1.1");
WanConfig.WanConnType= new Scalar("WanConnType","1.3.6.1.4.1.4115.1.20.1.1.1.1",2);
WanConfig.WanConnHostName= new Scalar("WanConnHostName","1.3.6.1.4.1.4115.1.20.1.1.1.2",4);
WanConfig.WanConnDomainName= new Scalar("WanConnDomainName","1.3.6.1.4.1.4115.1.20.1.1.1.3",4);
WanConfig.WanMTUSize= new Scalar("WanMTUSize","1.3.6.1.4.1.4115.1.20.1.1.1.4",66);
WanConfig.WanApply= new Scalar("WanApply","1.3.6.1.4.1.4115.1.20.1.1.1.5",2);
WanConfig.WanStaticFreeIdx= new Scalar("WanStaticFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.1.8",66);
WanConfig.WanIFMacAddr= new Scalar("WanIFMacAddr","1.3.6.1.4.1.4115.1.20.1.1.1.13",4, 1);
WanConfig.WanInterface= new Scalar("WanInterface","1.3.6.1.4.1.4115.1.20.1.1.1.14",2);
WanConfig.WanConnTypeV6= new Scalar("WanConnTypeV6","1.3.6.1.4.1.4115.1.20.1.1.1.16",2);
WanConfig.WanIPProvMode= new Scalar("WanIPProvMode","1.3.6.1.4.1.4115.1.20.1.1.1.17",2);
var arWanConnType=WanConfig.WanConnType;
var arWanConnHostName=WanConfig.WanConnHostName;
var arWanConnDomainName=WanConfig.WanConnDomainName;
var arWanMTUSize=WanConfig.WanMTUSize;
var arWanApply=WanConfig.WanApply;
var arWanStaticFreeIdx=WanConfig.WanStaticFreeIdx;
var arWanIFMacAddr=WanConfig.WanIFMacAddr;
var arWanInterface=WanConfig.WanInterface;
var arWanConnTypeV6=WanConfig.WanConnTypeV6;
var arWanIPProvMode=WanConfig.WanIPProvMode;

var WanCurrentTable = new Table("WanCurrentTable", "1.3.6.1.4.1.4115.1.20.1.1.1.7");
WanCurrentTable.WanCurrentIPIndex = new Column("WanCurrentIPIndex","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.1",66);
WanCurrentTable.WanCurrentIPAddrType = new Column("WanCurrentIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.2",2);
WanCurrentTable.WanCurrentIPAddr = new Column("WanCurrentIPAddr","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.3",4, 1);
WanCurrentTable.WanCurrentPrefix = new Column("WanCurrentPrefix","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.4",66);
WanCurrentTable.WanCurrentGWType = new Column("WanCurrentGWType","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.5",2);
WanCurrentTable.WanCurrentGW = new Column("WanCurrentGW","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.6",4, 1);
WanCurrentTable.WanCurrentIPType = new Column("WanCurrentIPType","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.7",2);
WanCurrentTable.WanCurrentNetMask = new Column("WanCurrentNetMask","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.8",4, 1);
WanCurrentTable.WanCurrentPrefixDelegationV6 = new Column("WanCurrentPrefixDelegationV6","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.9",4, 1);
WanCurrentTable.WanCurrentPrefixDelegationV6Len = new Column("WanCurrentPrefixDelegationV6Len","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.10",66);
WanCurrentTable.WanCurrentPreferredLifetimeV6 = new Column("WanCurrentPreferredLifetimeV6","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.11",2);
WanCurrentTable.WanCurrentValidLifetimeV6 = new Column("WanCurrentValidLifetimeV6","1.3.6.1.4.1.4115.1.20.1.1.1.7.1.12",2);
var arWanCurrentIPIndex=WanCurrentTable.WanCurrentIPIndex;
var arWanCurrentIPAddrType=WanCurrentTable.WanCurrentIPAddrType;
var arWanCurrentIPAddr=WanCurrentTable.WanCurrentIPAddr;
var arWanCurrentPrefix=WanCurrentTable.WanCurrentPrefix;
var arWanCurrentGWType=WanCurrentTable.WanCurrentGWType;
var arWanCurrentGW=WanCurrentTable.WanCurrentGW;
var arWanCurrentIPType=WanCurrentTable.WanCurrentIPType;
var arWanCurrentNetMask=WanCurrentTable.WanCurrentNetMask;
var arWanCurrentPrefixDelegationV6=WanCurrentTable.WanCurrentPrefixDelegationV6;
var arWanCurrentPrefixDelegationV6Len=WanCurrentTable.WanCurrentPrefixDelegationV6Len;
var arWanCurrentPreferredLifetimeV6=WanCurrentTable.WanCurrentPreferredLifetimeV6;
var arWanCurrentValidLifetimeV6=WanCurrentTable.WanCurrentValidLifetimeV6;

var WanStaticTable = new Table("WanStaticTable", "1.3.6.1.4.1.4115.1.20.1.1.1.9");
WanStaticTable.WanStaticIPIndex = new Column("WanStaticIPIndex","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.1",66);
WanStaticTable.WanStaticIPAddrType = new Column("WanStaticIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.2",2);
WanStaticTable.WanStaticIPAddr = new Column("WanStaticIPAddr","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.3",4, 1);
WanStaticTable.WanStaticPrefix = new Column("WanStaticPrefix","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.4",66);
WanStaticTable.WanStaticGatewayType = new Column("WanStaticGatewayType","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.5",2);
WanStaticTable.WanStaticGateway = new Column("WanStaticGateway","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.6",4, 1);
WanStaticTable.WanStaticRowStatus = new Column("WanStaticRowStatus","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.7",2);
WanStaticTable.WanDelegatedPrefixLength = new Column("WanDelegatedPrefixLength","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.8",66);
WanStaticTable.WanDelegatedPrefix = new Column("WanDelegatedPrefix","1.3.6.1.4.1.4115.1.20.1.1.1.9.1.9",4, 1);
var arWanStaticIPIndex=WanStaticTable.WanStaticIPIndex;
var arWanStaticIPAddrType=WanStaticTable.WanStaticIPAddrType;
var arWanStaticIPAddr=WanStaticTable.WanStaticIPAddr;
var arWanStaticPrefix=WanStaticTable.WanStaticPrefix;
var arWanStaticGatewayType=WanStaticTable.WanStaticGatewayType;
var arWanStaticGateway=WanStaticTable.WanStaticGateway;
var arWanStaticRowStatus=WanStaticTable.WanStaticRowStatus;
var arWanDelegatedPrefixLength=WanStaticTable.WanDelegatedPrefixLength;
var arWanDelegatedPrefix=WanStaticTable.WanDelegatedPrefix;

var WanTunnelObjects = new Container("WanTunnelObjects", "1.3.6.1.4.1.4115.1.20.1.1.1.10");
WanTunnelObjects.WanUserName= new Scalar("WanUserName","1.3.6.1.4.1.4115.1.20.1.1.1.10.1",4);
WanTunnelObjects.WanPassword= new Scalar("WanPassword","1.3.6.1.4.1.4115.1.20.1.1.1.10.2",4);
WanTunnelObjects.WanEnableIdleTimeout= new Scalar("WanEnableIdleTimeout","1.3.6.1.4.1.4115.1.20.1.1.1.10.3",2);
WanTunnelObjects.WanIdleTimeout= new Scalar("WanIdleTimeout","1.3.6.1.4.1.4115.1.20.1.1.1.10.4",66);
WanTunnelObjects.WanTunnelAddrType= new Scalar("WanTunnelAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.10.5",2);
WanTunnelObjects.WanTunnelAddr= new Scalar("WanTunnelAddr","1.3.6.1.4.1.4115.1.20.1.1.1.10.6",4, 1);
WanTunnelObjects.WanTunnelHostName= new Scalar("WanTunnelHostName","1.3.6.1.4.1.4115.1.20.1.1.1.10.7",4);
WanTunnelObjects.WanEnableKeepAlive= new Scalar("WanEnableKeepAlive","1.3.6.1.4.1.4115.1.20.1.1.1.10.8",2);
WanTunnelObjects.WanKeepAliveTimeout= new Scalar("WanKeepAliveTimeout","1.3.6.1.4.1.4115.1.20.1.1.1.10.9",66);
var arWanUserName=WanTunnelObjects.WanUserName;
var arWanPassword=WanTunnelObjects.WanPassword;
var arWanEnableIdleTimeout=WanTunnelObjects.WanEnableIdleTimeout;
var arWanIdleTimeout=WanTunnelObjects.WanIdleTimeout;
var arWanTunnelAddrType=WanTunnelObjects.WanTunnelAddrType;
var arWanTunnelAddr=WanTunnelObjects.WanTunnelAddr;
var arWanTunnelHostName=WanTunnelObjects.WanTunnelHostName;
var arWanEnableKeepAlive=WanTunnelObjects.WanEnableKeepAlive;
var arWanKeepAliveTimeout=WanTunnelObjects.WanKeepAliveTimeout;

var WanDNSObjects = new Container("WanDNSObjects", "1.3.6.1.4.1.4115.1.20.1.1.1.11");
WanDNSObjects.WanUseAutoDNS= new Scalar("WanUseAutoDNS","1.3.6.1.4.1.4115.1.20.1.1.1.11.1",2);
WanDNSObjects.WanStaticDNSFreeIdx= new Scalar("WanStaticDNSFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.1.11.3",66);
var arWanUseAutoDNS=WanDNSObjects.WanUseAutoDNS;
var arWanStaticDNSFreeIdx=WanDNSObjects.WanStaticDNSFreeIdx;

var WanCurrentDNSTable = new Table("WanCurrentDNSTable", "1.3.6.1.4.1.4115.1.20.1.1.1.11.2");
WanCurrentDNSTable.WanCurrentDNSIPIndex = new Column("WanCurrentDNSIPIndex","1.3.6.1.4.1.4115.1.20.1.1.1.11.2.1.1",66);
WanCurrentDNSTable.WanCurrentDNSIPAddrType = new Column("WanCurrentDNSIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.11.2.1.2",2);
WanCurrentDNSTable.WanCurrentDNSIPAddr = new Column("WanCurrentDNSIPAddr","1.3.6.1.4.1.4115.1.20.1.1.1.11.2.1.3",4, 1);
var arWanCurrentDNSIPIndex=WanCurrentDNSTable.WanCurrentDNSIPIndex;
var arWanCurrentDNSIPAddrType=WanCurrentDNSTable.WanCurrentDNSIPAddrType;
var arWanCurrentDNSIPAddr=WanCurrentDNSTable.WanCurrentDNSIPAddr;

var WanStaticDNSTable = new Table("WanStaticDNSTable", "1.3.6.1.4.1.4115.1.20.1.1.1.11.4");
WanStaticDNSTable.WanStaticDNSIPIndex = new Column("WanStaticDNSIPIndex","1.3.6.1.4.1.4115.1.20.1.1.1.11.4.1.1",66);
WanStaticDNSTable.WanStaticDNSIPAddrType = new Column("WanStaticDNSIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.11.4.1.2",2);
WanStaticDNSTable.WanStaticDNSIPAddr = new Column("WanStaticDNSIPAddr","1.3.6.1.4.1.4115.1.20.1.1.1.11.4.1.3",4, 1);
WanStaticDNSTable.WanStaticDNSRowStatus = new Column("WanStaticDNSRowStatus","1.3.6.1.4.1.4115.1.20.1.1.1.11.4.1.4",2);
var arWanStaticDNSIPIndex=WanStaticDNSTable.WanStaticDNSIPIndex;
var arWanStaticDNSIPAddrType=WanStaticDNSTable.WanStaticDNSIPAddrType;
var arWanStaticDNSIPAddr=WanStaticDNSTable.WanStaticDNSIPAddr;
var arWanStaticDNSRowStatus=WanStaticDNSTable.WanStaticDNSRowStatus;

var WanDHCPObjects = new Container("WanDHCPObjects", "1.3.6.1.4.1.4115.1.20.1.1.1.12");
WanDHCPObjects.WanRenewLease= new Scalar("WanRenewLease","1.3.6.1.4.1.4115.1.20.1.1.1.12.1",2);
WanDHCPObjects.WanReleaseLease= new Scalar("WanReleaseLease","1.3.6.1.4.1.4115.1.20.1.1.1.12.2",2);
WanDHCPObjects.WanDHCPDuration= new Scalar("WanDHCPDuration","1.3.6.1.4.1.4115.1.20.1.1.1.12.3",66);
WanDHCPObjects.WanDHCPExpire= new Scalar("WanDHCPExpire","1.3.6.1.4.1.4115.1.20.1.1.1.12.4",4, 1);
WanDHCPObjects.WanRenewLeaseV6= new Scalar("WanRenewLeaseV6","1.3.6.1.4.1.4115.1.20.1.1.1.12.5",2);
WanDHCPObjects.WanReleaseLeaseV6= new Scalar("WanReleaseLeaseV6","1.3.6.1.4.1.4115.1.20.1.1.1.12.6",2);
WanDHCPObjects.WanDHCPDurationV6= new Scalar("WanDHCPDurationV6","1.3.6.1.4.1.4115.1.20.1.1.1.12.7",66);
WanDHCPObjects.WanDHCPExpireV6= new Scalar("WanDHCPExpireV6","1.3.6.1.4.1.4115.1.20.1.1.1.12.8",4, 1);
var arWanRenewLease=WanDHCPObjects.WanRenewLease;
var arWanReleaseLease=WanDHCPObjects.WanReleaseLease;
var arWanDHCPDuration=WanDHCPObjects.WanDHCPDuration;
var arWanDHCPExpire=WanDHCPObjects.WanDHCPExpire;
var arWanRenewLeaseV6=WanDHCPObjects.WanRenewLeaseV6;
var arWanReleaseLeaseV6=WanDHCPObjects.WanReleaseLeaseV6;
var arWanDHCPDurationV6=WanDHCPObjects.WanDHCPDurationV6;
var arWanDHCPExpireV6=WanDHCPObjects.WanDHCPExpireV6;

var PrivateWanObjects = new Container("PrivateWanObjects", "1.3.6.1.4.1.4115.1.20.1.1.1.15");
PrivateWanObjects.PrivateWanRenewLease= new Scalar("PrivateWanRenewLease","1.3.6.1.4.1.4115.1.20.1.1.1.15.1",2);
PrivateWanObjects.PrivateWanReleaseLease= new Scalar("PrivateWanReleaseLease","1.3.6.1.4.1.4115.1.20.1.1.1.15.2",2);
PrivateWanObjects.PrivateWanDHCPDuration= new Scalar("PrivateWanDHCPDuration","1.3.6.1.4.1.4115.1.20.1.1.1.15.3",66);
PrivateWanObjects.PrivateWanDHCPExpire= new Scalar("PrivateWanDHCPExpire","1.3.6.1.4.1.4115.1.20.1.1.1.15.4",4, 1);
PrivateWanObjects.PrivateWanCurrentIPAddrType= new Scalar("PrivateWanCurrentIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.15.5",2);
PrivateWanObjects.PrivateWanCurrentIPAddr= new Scalar("PrivateWanCurrentIPAddr","1.3.6.1.4.1.4115.1.20.1.1.1.15.6",4, 1);
PrivateWanObjects.PrivateWanCurrentPrefix= new Scalar("PrivateWanCurrentPrefix","1.3.6.1.4.1.4115.1.20.1.1.1.15.7",66);
PrivateWanObjects.PrivateWanCurrentGWType= new Scalar("PrivateWanCurrentGWType","1.3.6.1.4.1.4115.1.20.1.1.1.15.8",2);
PrivateWanObjects.PrivateWanCurrentGW= new Scalar("PrivateWanCurrentGW","1.3.6.1.4.1.4115.1.20.1.1.1.15.9",4, 1);
PrivateWanObjects.PrivateWanCurrentNetMask= new Scalar("PrivateWanCurrentNetMask","1.3.6.1.4.1.4115.1.20.1.1.1.15.10",4, 1);
PrivateWanObjects.PrivateWanCurrentDomainName= new Scalar("PrivateWanCurrentDomainName","1.3.6.1.4.1.4115.1.20.1.1.1.15.11",4);
PrivateWanObjects.PrivateWanInterfaceName= new Scalar("PrivateWanInterfaceName","1.3.6.1.4.1.4115.1.20.1.1.1.15.12",4);
PrivateWanObjects.PrivateWanMacAddr= new Scalar("PrivateWanMacAddr","1.3.6.1.4.1.4115.1.20.1.1.1.15.13",4, 1);
var arPrivateWanRenewLease=PrivateWanObjects.PrivateWanRenewLease;
var arPrivateWanReleaseLease=PrivateWanObjects.PrivateWanReleaseLease;
var arPrivateWanDHCPDuration=PrivateWanObjects.PrivateWanDHCPDuration;
var arPrivateWanDHCPExpire=PrivateWanObjects.PrivateWanDHCPExpire;
var arPrivateWanCurrentIPAddrType=PrivateWanObjects.PrivateWanCurrentIPAddrType;
var arPrivateWanCurrentIPAddr=PrivateWanObjects.PrivateWanCurrentIPAddr;
var arPrivateWanCurrentPrefix=PrivateWanObjects.PrivateWanCurrentPrefix;
var arPrivateWanCurrentGWType=PrivateWanObjects.PrivateWanCurrentGWType;
var arPrivateWanCurrentGW=PrivateWanObjects.PrivateWanCurrentGW;
var arPrivateWanCurrentNetMask=PrivateWanObjects.PrivateWanCurrentNetMask;
var arPrivateWanCurrentDomainName=PrivateWanObjects.PrivateWanCurrentDomainName;
var arPrivateWanInterfaceName=PrivateWanObjects.PrivateWanInterfaceName;
var arPrivateWanMacAddr=PrivateWanObjects.PrivateWanMacAddr;

var PrivateWanCurrentDNSTable = new Table("PrivateWanCurrentDNSTable", "1.3.6.1.4.1.4115.1.20.1.1.1.15.14");
PrivateWanCurrentDNSTable.PrivateWanCurrentDNSIPIndex = new Column("PrivateWanCurrentDNSIPIndex","1.3.6.1.4.1.4115.1.20.1.1.1.15.14.1.1",66);
PrivateWanCurrentDNSTable.PrivateWanCurrentDNSIPAddrType = new Column("PrivateWanCurrentDNSIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.15.14.1.2",2);
PrivateWanCurrentDNSTable.PrivateWanCurrentDNSIPAddr = new Column("PrivateWanCurrentDNSIPAddr","1.3.6.1.4.1.4115.1.20.1.1.1.15.14.1.3",4, 1);
var arPrivateWanCurrentDNSIPIndex=PrivateWanCurrentDNSTable.PrivateWanCurrentDNSIPIndex;
var arPrivateWanCurrentDNSIPAddrType=PrivateWanCurrentDNSTable.PrivateWanCurrentDNSIPAddrType;
var arPrivateWanCurrentDNSIPAddr=PrivateWanCurrentDNSTable.PrivateWanCurrentDNSIPAddr;

var DSLiteWanObjects = new Container("DSLiteWanObjects", "1.3.6.1.4.1.4115.1.20.1.1.1.18");
DSLiteWanObjects.DSLiteWanEnable= new Scalar("DSLiteWanEnable","1.3.6.1.4.1.4115.1.20.1.1.1.18.1",2);
DSLiteWanObjects.DSLiteWanLSNATAddrType= new Scalar("DSLiteWanLSNATAddrType","1.3.6.1.4.1.4115.1.20.1.1.1.18.2",2);
DSLiteWanObjects.DSLiteWanLSNATAddr= new Scalar("DSLiteWanLSNATAddr","1.3.6.1.4.1.4115.1.20.1.1.1.18.3",4, 1);
var arDSLiteWanEnable=DSLiteWanObjects.DSLiteWanEnable;
var arDSLiteWanLSNATAddrType=DSLiteWanObjects.DSLiteWanLSNATAddrType;
var arDSLiteWanLSNATAddr=DSLiteWanObjects.DSLiteWanLSNATAddr;



var LanConfig = new Container("LanConfig", "1.3.6.1.4.1.4115.1.20.1.1.2");
LanConfig.LanCount= new Scalar("LanCount","1.3.6.1.4.1.4115.1.20.1.1.2.1",66);
LanConfig.LanSettings= new Scalar("LanSettings","1.3.6.1.4.1.4115.1.20.1.1.2.6",2);
var arLanCount=LanConfig.LanCount;
var arLanSettings=LanConfig.LanSettings;

var LanSrvTable = new Table("LanSrvTable", "1.3.6.1.4.1.4115.1.20.1.1.2.2");
LanSrvTable.LanName = new Column("LanName","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.1",4);
LanSrvTable.LanSubnetMaskType = new Column("LanSubnetMaskType","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.2",2);
LanSrvTable.LanSubnetMask = new Column("LanSubnetMask","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.3",4, 1);
LanSrvTable.LanGatewayIpType = new Column("LanGatewayIpType","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.4",2);
LanSrvTable.LanGatewayIp = new Column("LanGatewayIp","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.5",4, 1);
LanSrvTable.LanGatewayIp2Type = new Column("LanGatewayIp2Type","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.6",2);
LanSrvTable.LanGatewayIp2 = new Column("LanGatewayIp2","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.7",4, 1);
LanSrvTable.LanVLanID = new Column("LanVLanID","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.8",66);
LanSrvTable.LanUseDHCP = new Column("LanUseDHCP","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.9",2);
LanSrvTable.LanStartDHCPType = new Column("LanStartDHCPType","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.10",2);
LanSrvTable.LanStartDHCP = new Column("LanStartDHCP","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.11",4, 1);
LanSrvTable.LanEndDHCPType = new Column("LanEndDHCPType","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.12",2);
LanSrvTable.LanEndDHCP = new Column("LanEndDHCP","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.13",4, 1);
LanSrvTable.LanLeaseTime = new Column("LanLeaseTime","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.14",66);
LanSrvTable.LanDomainName = new Column("LanDomainName","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.15",4, 1);
LanSrvTable.LanRateLimit = new Column("LanRateLimit","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.16",2);
LanSrvTable.LanDownRateLimit = new Column("LanDownRateLimit","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.17",66);
LanSrvTable.LanUpRateLimit = new Column("LanUpRateLimit","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.18",66);
LanSrvTable.LanRelayDNS = new Column("LanRelayDNS","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.19",2);
LanSrvTable.LanIPv6Mode = new Column("LanIPv6Mode","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.20",2);
LanSrvTable.LanPassThru = new Column("LanPassThru","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.21",2);
LanSrvTable.LanFirewallOn = new Column("LanFirewallOn","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.22",2);
LanSrvTable.LanUPnPEnable = new Column("LanUPnPEnable","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.23",2);
LanSrvTable.LanCPEAging = new Column("LanCPEAging","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.24",2);
LanSrvTable.LanOverrideDNS = new Column("LanOverrideDNS","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.25",2);
LanSrvTable.LanNatAlgsEnabled = new Column("LanNatAlgsEnabled","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.26",4, 1);
LanSrvTable.LanMappedInterface = new Column("LanMappedInterface","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.27",66);
LanSrvTable.LanEnvironmentControl = new Column("LanEnvironmentControl","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.28",2);
LanSrvTable.LanPrefixLengthV6 = new Column("LanPrefixLengthV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.29",66);
LanSrvTable.LanUseDHCPV6 = new Column("LanUseDHCPV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.30",2);
LanSrvTable.LanStartDHCPV6 = new Column("LanStartDHCPV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.31",4, 1);
LanSrvTable.LanEndDHCPV6 = new Column("LanEndDHCPV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.32",4, 1);
LanSrvTable.LanLeaseTimeV6 = new Column("LanLeaseTimeV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.33",66);
LanSrvTable.LanLinkLocalAddressV6 = new Column("LanLinkLocalAddressV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.34",4, 1);
LanSrvTable.LanDNSRelayV6 = new Column("LanDNSRelayV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.35",2);
LanSrvTable.LanDNSOverrideV6 = new Column("LanDNSOverrideV6","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.36",2);
LanSrvTable.LanRouterAdminBridgeOptionDisplay = new Column("LanRouterAdminBridgeOptionDisplay","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.38",2);

// scm start
//LanSrvTable.LanQosEnable = new Column("LanQosEnable","1.3.6.1.4.1.4115.1.20.1.1.2.2.1.46",2);
// scm end
var arLanName=LanSrvTable.LanName;
var arLanSubnetMaskType=LanSrvTable.LanSubnetMaskType;
var arLanSubnetMask=LanSrvTable.LanSubnetMask;
var arLanGatewayIpType=LanSrvTable.LanGatewayIpType;
var arLanGatewayIp=LanSrvTable.LanGatewayIp;
var arLanGatewayIp2Type=LanSrvTable.LanGatewayIp2Type;
var arLanGatewayIp2=LanSrvTable.LanGatewayIp2;
var arLanVLanID=LanSrvTable.LanVLanID;
var arLanUseDHCP=LanSrvTable.LanUseDHCP;
var arLanStartDHCPType=LanSrvTable.LanStartDHCPType;
var arLanStartDHCP=LanSrvTable.LanStartDHCP;
var arLanEndDHCPType=LanSrvTable.LanEndDHCPType;
var arLanEndDHCP=LanSrvTable.LanEndDHCP;
var arLanLeaseTime=LanSrvTable.LanLeaseTime;
var arLanDomainName=LanSrvTable.LanDomainName;
var arLanRateLimit=LanSrvTable.LanRateLimit;
var arLanDownRateLimit=LanSrvTable.LanDownRateLimit;
var arLanUpRateLimit=LanSrvTable.LanUpRateLimit;
var arLanRelayDNS=LanSrvTable.LanRelayDNS;
var arLanIPv6Mode=LanSrvTable.LanIPv6Mode;
var arLanPassThru=LanSrvTable.LanPassThru;
var arLanFirewallOn=LanSrvTable.LanFirewallOn;
var arLanUPnPEnable=LanSrvTable.LanUPnPEnable;
var arLanCPEAging=LanSrvTable.LanCPEAging;
var arLanOverrideDNS=LanSrvTable.LanOverrideDNS;
var arLanNatAlgsEnabled=LanSrvTable.LanNatAlgsEnabled;
var arLanMappedInterface=LanSrvTable.LanMappedInterface;
var arLanEnvironmentControl=LanSrvTable.LanEnvironmentControl;
var arLanPrefixLengthV6=LanSrvTable.LanPrefixLengthV6;
var arLanUseDHCPV6=LanSrvTable.LanUseDHCPV6;
var arLanStartDHCPV6=LanSrvTable.LanStartDHCPV6;
var arLanEndDHCPV6=LanSrvTable.LanEndDHCPV6;
var arLanLeaseTimeV6=LanSrvTable.LanLeaseTimeV6;
var arLanLinkLocalAddressV6=LanSrvTable.LanLinkLocalAddressV6;
var arLanDNSRelayV6=LanSrvTable.LanDNSRelayV6;
var arLanDNSOverrideV6=LanSrvTable.LanDNSOverrideV6;
//var arLanQosEnable=LanSrvTable.LanQosEnable;//added
var arLanRouterAdminBridgeOptionDisplay=LanSrvTable.LanRouterAdminBridgeOptionDisplay;

var arrisRouterLanSrvDiscoveryObjs = new Container("arrisRouterLanSrvDiscoveryObjs", "1.3.6.1.4.1.4115.1.20.1.1.2.7");
arrisRouterLanSrvDiscoveryObjs.arrisRouterLanUPnPAdvTime= new Scalar("arrisRouterLanUPnPAdvTime","1.3.6.1.4.1.4115.1.20.1.1.2.7.1", 66);
arrisRouterLanSrvDiscoveryObjs.arrisRouterLanUPnPTtl= new Scalar("arrisRouterLanUPnPTtl","1.3.6.1.4.1.4115.1.20.1.1.2.7.2", 66);
arrisRouterLanSrvDiscoveryObjs.arrisRouterLanZeroConf= new Scalar("arrisRouterLanZeroConf","1.3.6.1.4.1.4115.1.20.1.1.2.7.3", 2);
arrisRouterLanSrvDiscoveryObjs.arrisRouterLanQosUPnP= new Scalar("arrisRouterLanQosUPnP","1.3.6.1.4.1.4115.1.20.1.1.2.7.4", 2);
var arLanUPnPAdvTime=arrisRouterLanSrvDiscoveryObjs.arrisRouterLanUPnPAdvTime;
var arLanUPnPTtl=arrisRouterLanSrvDiscoveryObjs.arrisRouterLanUPnPTtl;
var arLanZeroConf=arrisRouterLanSrvDiscoveryObjs.arrisRouterLanZeroConf;
var arLanQosUPnP=arrisRouterLanSrvDiscoveryObjs.arrisRouterLanQosUPnP;


var LanDNSTable = new Table("LanDNSTable", "1.3.6.1.4.1.4115.1.20.1.1.2.3");
LanDNSTable.LanDNSIdx = new Column("LanDNSIdx","1.3.6.1.4.1.4115.1.20.1.1.2.3.1.1",66);
LanDNSTable.LanDNSIPAddrType = new Column("LanDNSIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.2.3.1.2",2);
LanDNSTable.LanDNSIPAddr = new Column("LanDNSIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.3.1.3",4, 1);
LanDNSTable.LanDNSRowStatus = new Column("LanDNSRowStatus","1.3.6.1.4.1.4115.1.20.1.1.2.3.1.4",2);
var arLanDNSIdx=LanDNSTable.LanDNSIdx;
var arLanDNSIPAddrType=LanDNSTable.LanDNSIPAddrType;
var arLanDNSIPAddr=LanDNSTable.LanDNSIPAddr;
var arLanDNSRowStatus=LanDNSTable.LanDNSRowStatus;

var CmDoc30DhcpLeaseParameters = new Container("CmDoc30DhcpLeaseParameters","1.3.6.1.4.1.4115.1.3.4.1.4.1");
CmDoc30DhcpLeaseParameters.DhcpLeaseTimeRemaining = new Scalar("DhcpLeaseTimeRemaining","1.3.6.1.4.1.4115.1.3.4.1.4.1.4",2);
var arDhcpLeaseTimeRemaining = CmDoc30DhcpLeaseParameters.DhcpLeaseTimeRemaining;
CmDoc30DhcpLeaseParameters.DhcpOfferedLeaseTime = new Scalar("DhcpOfferedLeaseTime","1.3.6.1.4.1.4115.1.3.4.1.4.1.1",2);
CmDoc30DhcpLeaseParameters.DhcpTimeUntilRenew = new Scalar("DhcpTimeUntilRenew","1.3.6.1.4.1.4115.1.3.4.1.4.1.2",2);
CmDoc30DhcpLeaseParameters.DhcpTimeUntilRebind = new Scalar("DhcpTimeUntilRebind","1.3.6.1.4.1.4115.1.3.4.1.4.1.3",2);
var arDhcpOfferedLeaseTime = CmDoc30DhcpLeaseParameters.DhcpOfferedLeaseTime;
var arDhcpTimeUntilRenew = CmDoc30DhcpLeaseParameters.DhcpTimeUntilRenew;
var arDhcpTimeUntilRebind = CmDoc30DhcpLeaseParameters.DhcpTimeUntilRebind;

var ClientObjects = new Container("ClientObjects", "1.3.6.1.4.1.4115.1.20.1.1.2.4");
ClientObjects.LanClientCount= new Scalar("LanClientCount","1.3.6.1.4.1.4115.1.20.1.1.2.4.1",66);
ClientObjects.LanCustomCount= new Scalar("LanCustomCount","1.3.6.1.4.1.4115.1.20.1.1.2.4.4",66);
var arLanClientCount=ClientObjects.LanClientCount;
var arLanCustomCount=ClientObjects.LanCustomCount;

var LanClientTable = new Table("LanClientTable", "1.3.6.1.4.1.4115.1.20.1.1.2.4.2");
LanClientTable.LanClientIPAddrType = new Column("LanClientIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.1",2);
LanClientTable.LanClientIPAddr = new Column("LanClientIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.2",4, 1);
LanClientTable.LanClientHostName = new Column("LanClientHostName","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.3",4);
LanClientTable.LanClientMAC = new Column("LanClientMAC","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.4",4, 1);
LanClientTable.LanClientMACMfg = new Column("LanClientMACMfg","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.5",4);
LanClientTable.LanClientAdapterType = new Column("LanClientAdapterType","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.6",2);
LanClientTable.LanClientType = new Column("LanClientType","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.7",2);
LanClientTable.LanClientLeaseStart = new Column("LanClientLeaseStart","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.8",4, 1);
LanClientTable.LanClientLeaseEnd = new Column("LanClientLeaseEnd","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.9",4, 1);
LanClientTable.LanClientStatus = new Column("LanClientStatus","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.10",2);
LanClientTable.LanClientInfLease = new Column("LanClientInfLease","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.11",2);
LanClientTable.LanClientLeaseState = new Column("LanClientLeaseState","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.12",2);
LanClientTable.LanClientRowStatus = new Column("LanClientRowStatus","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.13",2);
LanClientTable.LanClientOnline = new Column("LanClientOnline","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.14",2);
LanClientTable.LanClientComment = new Column("LanClientComment","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.15",4);
LanClientTable.LanClientCustom = new Column("LanClientCustom","1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.16",2);
// scm start
LanClientTable.LanClientDeviceName  = new Column("LanClientDeviceName", "1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.20", 2);
LanClientTable.LanClientRSSI        = new Column("LanClientRSSI",       "1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.21", 2);
LanClientTable.LanClientLinkLocalAddr= new Column("LanClientLinkLocalAddr",       "1.3.6.1.4.1.4115.1.20.1.1.2.4.2.1.23", 4);

// scm end
var arLanClientIPAddrType=LanClientTable.LanClientIPAddrType;
var arLanClientIPAddr=LanClientTable.LanClientIPAddr;
var arLanClientHostName=LanClientTable.LanClientHostName;
var arLanClientMAC=LanClientTable.LanClientMAC;
var arLanClientMACMfg=LanClientTable.LanClientMACMfg;
var arLanClientAdapterType=LanClientTable.LanClientAdapterType;
var arLanClientType=LanClientTable.LanClientType;
var arLanClientLeaseStart=LanClientTable.LanClientLeaseStart;
var arLanClientLeaseEnd=LanClientTable.LanClientLeaseEnd;
var arLanClientStatus=LanClientTable.LanClientStatus;
var arLanClientInfLease=LanClientTable.LanClientInfLease;
var arLanClientLeaseState=LanClientTable.LanClientLeaseState;
var arLanClientRowStatus=LanClientTable.LanClientRowStatus;
var arLanClientOnline=LanClientTable.LanClientOnline;
var arLanClientComment=LanClientTable.LanClientComment;
var arLanClientCustom=LanClientTable.LanClientCustom;
// scm add
var arLanClientDeviceName =   LanClientTable.LanClientDeviceName;
var arLanClientRSSI       =   LanClientTable.LanClientRSSI;
var arLanClientLinkLocalAddr       =   LanClientTable.LanClientLinkLocalAddr;




var DeviceUpDownTable = new Table("DeviceUpDownTable", "1.3.6.1.4.1.4115.1.20.1.1.2.4.3");
DeviceUpDownTable.DeviceUpDownIndex = new Column("DeviceUpDownIndex","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.1",2);
DeviceUpDownTable.DeviceUpDownMAC = new Column("DeviceUpDownMAC","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.2",4, 1);
DeviceUpDownTable.DeviceUpDownIPType = new Column("DeviceUpDownIPType","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.3",2);
DeviceUpDownTable.DeviceUpDownIPAddr = new Column("DeviceUpDownIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.4",4, 1);
DeviceUpDownTable.DeviceUpDownStart = new Column("DeviceUpDownStart","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.5",4, 1);
DeviceUpDownTable.DeviceUpDownEnd = new Column("DeviceUpDownEnd","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.6",4, 1);
DeviceUpDownTable.DeviceUpDownStatus = new Column("DeviceUpDownStatus","1.3.6.1.4.1.4115.1.20.1.1.2.4.3.1.7",2);
var arDeviceUpDownIndex=DeviceUpDownTable.DeviceUpDownIndex;
var arDeviceUpDownMAC=DeviceUpDownTable.DeviceUpDownMAC;
var arDeviceUpDownIPType=DeviceUpDownTable.DeviceUpDownIPType;
var arDeviceUpDownIPAddr=DeviceUpDownTable.DeviceUpDownIPAddr;
var arDeviceUpDownStart=DeviceUpDownTable.DeviceUpDownStart;
var arDeviceUpDownEnd=DeviceUpDownTable.DeviceUpDownEnd;
var arDeviceUpDownStatus=DeviceUpDownTable.DeviceUpDownStatus;

var LanCustomTable = new Table("LanCustomTable", "1.3.6.1.4.1.4115.1.20.1.1.2.4.5");
LanCustomTable.LanCustomIdx = new Column("LanCustomIdx","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.1",66);
LanCustomTable.LanCustomMAC = new Column("LanCustomMAC","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.2",4, 1);
LanCustomTable.LanCustomIPAddrType = new Column("LanCustomIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.3",2);
LanCustomTable.LanCustomIPAddr = new Column("LanCustomIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.4",4, 1);
LanCustomTable.LanCustomFriendName = new Column("LanCustomFriendName","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.5",4);
LanCustomTable.LanCustomHostName = new Column("LanCustomHostName","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.6",4);
LanCustomTable.LanCustomMACMfg = new Column("LanCustomMACMfg","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.7",4);
LanCustomTable.LanCustomComments = new Column("LanCustomComments","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.8",4);
LanCustomTable.LanCustomRowStatus = new Column("LanCustomRowStatus","1.3.6.1.4.1.4115.1.20.1.1.2.4.5.1.9",2);
var arLanCustomIdx=LanCustomTable.LanCustomIdx;
var arLanCustomMAC=LanCustomTable.LanCustomMAC;
var arLanCustomIPAddrType=LanCustomTable.LanCustomIPAddrType;
var arLanCustomIPAddr=LanCustomTable.LanCustomIPAddr;
var arLanCustomFriendName=LanCustomTable.LanCustomFriendName;
var arLanCustomHostName=LanCustomTable.LanCustomHostName;
var arLanCustomMACMfg=LanCustomTable.LanCustomMACMfg;
var arLanCustomComments=LanCustomTable.LanCustomComments;
var arLanCustomRowStatus=LanCustomTable.LanCustomRowStatus;

var LanCurrentClientTable = new Table("LanCurrentClientTable", "1.3.6.1.4.1.4115.1.20.1.1.2.4.6");
LanCurrentClientTable.LanCurrentClientIndex = new Column("LanCurrentClientIndex","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.1",2);
LanCurrentClientTable.LanCurrentClientIPAddrType = new Column("LanCurrentClientIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.2",2);
LanCurrentClientTable.LanCurrentClientIPAddr = new Column("LanCurrentClientIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.3",4, 1);
LanCurrentClientTable.LanCurrentClientIPAddrTextual = new Column("LanCurrentClientIPAddrTextual","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.4",4);
LanCurrentClientTable.LanCurrentClientHostName = new Column("LanCurrentClientHostName","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.5",4);
LanCurrentClientTable.LanCurrentClientMAC = new Column("LanCurrentClientMAC","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.6",4, 1);
LanCurrentClientTable.LanCurrentClientMACMfg = new Column("LanCurrentClientMACMfg","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.7",4);
LanCurrentClientTable.LanCurrentClientAdapterType = new Column("LanCurrentClientAdapterType","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.8",2);
LanCurrentClientTable.LanCurrentClientType = new Column("LanCurrentClientType","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.9",2);
LanCurrentClientTable.LanCurrentClientLeaseStart = new Column("LanCurrentClientLeaseStart","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.10",4, 1);
LanCurrentClientTable.LanCurrentClientLeaseEnd = new Column("LanCurrentClientLeaseEnd","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.11",4, 1);
LanCurrentClientTable.LanCurrentClientStatus = new Column("LanCurrentClientStatus","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.12",2);
LanCurrentClientTable.LanCurrentClientInfLease = new Column("LanCurrentClientInfLease","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.13",2);
LanCurrentClientTable.LanCurrentClientLeaseState = new Column("LanCurrentClientLeaseState","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.14",2);
LanCurrentClientTable.LanCurrentClientFirstSeen = new Column("LanCurrentClientFirstSeen","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.15",4, 1);
LanCurrentClientTable.LanCurrentClientLastSeen = new Column("LanCurrentClientLastSeen","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.16",4, 1);
LanCurrentClientTable.LanCurrentClientConnectionInfo = new Column("LanCurrentClientConnectionInfo","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.17",4);
LanCurrentClientTable.LanCurrentClientLeaseTime = new Column("LanCurrentClientLeaseTime","1.3.6.1.4.1.4115.1.20.1.1.2.4.6.1.18",2);
var arLanCurrentClientIndex=LanCurrentClientTable.LanCurrentClientIndex;
var arLanCurrentClientIPAddrType=LanCurrentClientTable.LanCurrentClientIPAddrType;
var arLanCurrentClientIPAddr=LanCurrentClientTable.LanCurrentClientIPAddr;
var arLanCurrentClientIPAddrTextual=LanCurrentClientTable.LanCurrentClientIPAddrTextual;
var arLanCurrentClientHostName=LanCurrentClientTable.LanCurrentClientHostName;
var arLanCurrentClientMAC=LanCurrentClientTable.LanCurrentClientMAC;
var arLanCurrentClientMACMfg=LanCurrentClientTable.LanCurrentClientMACMfg;
var arLanCurrentClientAdapterType=LanCurrentClientTable.LanCurrentClientAdapterType;
var arLanCurrentClientType=LanCurrentClientTable.LanCurrentClientType;
var arLanCurrentClientLeaseStart=LanCurrentClientTable.LanCurrentClientLeaseStart;
var arLanCurrentClientLeaseEnd=LanCurrentClientTable.LanCurrentClientLeaseEnd;
var arLanCurrentClientStatus=LanCurrentClientTable.LanCurrentClientStatus;
var arLanCurrentClientInfLease=LanCurrentClientTable.LanCurrentClientInfLease;
var arLanCurrentClientLeaseState=LanCurrentClientTable.LanCurrentClientLeaseState;
var arLanCurrentClientFirstSeen=LanCurrentClientTable.LanCurrentClientFirstSeen;
var arLanCurrentClientLastSeen=LanCurrentClientTable.LanCurrentClientLastSeen;
var arLanCurrentClientConnectionInfo=LanCurrentClientTable.LanCurrentClientConnectionInfo;
var arLanCurrentClientLeaseTime=LanCurrentClientTable.LanCurrentClientLeaseTime;

var LanStaticClientTable = new Table("LanStaticClientTable", "1.3.6.1.4.1.4115.1.20.1.1.2.4.7");
LanStaticClientTable.LanStaticClientIndex = new Column("LanStaticClientIndex","1.3.6.1.4.1.4115.1.20.1.1.2.4.7.1.1",2);
LanStaticClientTable.LanStaticClientIPAddrType = new Column("LanStaticClientIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.2.4.7.1.2",2);
LanStaticClientTable.LanStaticClientIPAddr = new Column("LanStaticClientIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.4.7.1.3",4, 1);
LanStaticClientTable.LanStaticClientHostName = new Column("LanStaticClientHostName","1.3.6.1.4.1.4115.1.20.1.1.2.4.7.1.4",4);
LanStaticClientTable.LanStaticClientMAC = new Column("LanStaticClientMAC","1.3.6.1.4.1.4115.1.20.1.1.2.4.7.1.5",4, 1);
LanStaticClientTable.LanStaticClientRowStatus = new Column("LanStaticClientRowStatus","1.3.6.1.4.1.4115.1.20.1.1.2.4.7.1.6",2);
var arLanStaticClientIndex=LanStaticClientTable.LanStaticClientIndex;
var arLanStaticClientIPAddrType=LanStaticClientTable.LanStaticClientIPAddrType;
var arLanStaticClientIPAddr=LanStaticClientTable.LanStaticClientIPAddr;
var arLanStaticClientHostName=LanStaticClientTable.LanStaticClientHostName;
var arLanStaticClientMAC=LanStaticClientTable.LanStaticClientMAC;
var arLanStaticClientRowStatus=LanStaticClientTable.LanStaticClientRowStatus;

var RIPObjects = new Container("RIPObjects", "1.3.6.1.4.1.4115.1.20.1.1.2.5");
RIPObjects.RIPEnable= new Scalar("RIPEnable","1.3.6.1.4.1.4115.1.20.1.1.2.5.1",2);
RIPObjects.RIPAuthEnable= new Scalar("RIPAuthEnable","1.3.6.1.4.1.4115.1.20.1.1.2.5.2",2);
RIPObjects.RIPReportTime= new Scalar("RIPReportTime","1.3.6.1.4.1.4115.1.20.1.1.2.5.3",66);
RIPObjects.RIPAuthKeyString= new Scalar("RIPAuthKeyString","1.3.6.1.4.1.4115.1.20.1.1.2.5.4",4);
RIPObjects.RIPAuthKeyID= new Scalar("RIPAuthKeyID","1.3.6.1.4.1.4115.1.20.1.1.2.5.5",2);
RIPObjects.RIPIPAddrType= new Scalar("RIPIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.2.5.6",2);
RIPObjects.RIPIPAddr= new Scalar("RIPIPAddr","1.3.6.1.4.1.4115.1.20.1.1.2.5.7",4, 1);
RIPObjects.RIPPrefixLen= new Scalar("RIPPrefixLen","1.3.6.1.4.1.4115.1.20.1.1.2.5.8",66);
RIPObjects.RIPAuthKeyChain= new Scalar("RIPAuthKeyChain","1.3.6.1.4.1.4115.1.20.1.1.2.5.9",4);
RIPObjects.RIPRoutedSubnetIPType= new Scalar("RIPRoutedSubnetIPType","1.3.6.1.4.1.4115.1.20.1.1.2.5.10",2);
RIPObjects.RIPRoutedSubnetIP= new Scalar("RIPRoutedSubnetIP","1.3.6.1.4.1.4115.1.20.1.1.2.5.11",4, 1);
RIPObjects.RIPRoutedSubnetGWNetIPType= new Scalar("RIPRoutedSubnetGWNetIPType","1.3.6.1.4.1.4115.1.20.1.1.2.5.12",2);
RIPObjects.RIPRoutedSubnetGWNetIP= new Scalar("RIPRoutedSubnetGWNetIP","1.3.6.1.4.1.4115.1.20.1.1.2.5.13",4, 1);
RIPObjects.RIPRoutedSubnetMask= new Scalar("RIPRoutedSubnetMask","1.3.6.1.4.1.4115.1.20.1.1.2.5.14",4, 1);
RIPObjects.RIPRoutedSubnetEnabled= new Scalar("RIPRoutedSubnetEnabled","1.3.6.1.4.1.4115.1.20.1.1.2.5.15",2);
RIPObjects.RIPSendCMInterface= new Scalar("RIPSendCMInterface","1.3.6.1.4.1.4115.1.20.1.1.2.5.16",2);
RIPObjects.RIPRoutedSubnetDHCP= new Scalar("RIPRoutedSubnetDHCP","1.3.6.1.4.1.4115.1.20.1.1.2.5.17",2);
RIPObjects.RIPRoutedSubnetNAT= new Scalar("RIPRoutedSubnetNAT","1.3.6.1.4.1.4115.1.20.1.1.2.5.18",2);
// scm {
RIPObjects.RIPInterface= new Scalar("RIPInterface","1.3.6.1.4.1.4115.1.20.1.1.2.5.23",2);
RIPObjects.RIPSendVersion= new Scalar("RIPSendVersion","1.3.6.1.4.1.4115.1.20.1.1.2.5.20",4);
RIPObjects.RIPRecvVersion= new Scalar("RIPRecvVersion","1.3.6.1.4.1.4115.1.20.1.1.2.5.21",2);
RIPObjects.RIPDefaultMetric= new Scalar("RIPDefaultMetric","1.3.6.1.4.1.4115.1.20.1.1.2.5.22",2);
    RIPObjects.RIPNeighbor= new Scalar("RIPNeighbor","1.3.6.1.4.1.4115.1.20.1.1.2.5.23",2);
// scm {
var arRIPEnable=RIPObjects.RIPEnable;
var arRIPAuthEnable=RIPObjects.RIPAuthEnable;
var arRIPReportTime=RIPObjects.RIPReportTime;
var arRIPAuthKeyString=RIPObjects.RIPAuthKeyString;
var arRIPAuthKeyID=RIPObjects.RIPAuthKeyID;
var arRIPIPAddrType=RIPObjects.RIPIPAddrType;
var arRIPIPAddr=RIPObjects.RIPIPAddr;
var arRIPPrefixLen=RIPObjects.RIPPrefixLen;
var arRIPAuthKeyChain=RIPObjects.RIPAuthKeyChain;
var arRIPRoutedSubnetIPType=RIPObjects.RIPRoutedSubnetIPType;
var arRIPRoutedSubnetIP=RIPObjects.RIPRoutedSubnetIP;
var arRIPRoutedSubnetGWNetIPType=RIPObjects.RIPRoutedSubnetGWNetIPType;
var arRIPRoutedSubnetGWNetIP=RIPObjects.RIPRoutedSubnetGWNetIP;
var arRIPRoutedSubnetMask=RIPObjects.RIPRoutedSubnetMask;
var arRIPRoutedSubnetEnabled=RIPObjects.RIPRoutedSubnetEnabled;
var arRIPSendCMInterface=RIPObjects.RIPSendCMInterface;
var arRIPRoutedSubnetDHCP=RIPObjects.RIPRoutedSubnetDHCP;
var arRIPRoutedSubnetNAT=RIPObjects.RIPRoutedSubnetNAT;

var arRIPInterface=RIPObjects.RIPInterface;
var arRIPSendVersion=RIPObjects.RIPSendVersion;
var arRIPRecvVersion=RIPObjects.RIPRecvVersion;
var arRIPDefaultMetric=RIPObjects.RIPDefaultMetric;
var arRIPNeighbor=RIPObjects.RIPNeighbor;


var RIPRoutedSubnetTable = new Table("RIPRoutedSubnetTable", "1.3.6.1.4.1.4115.1.20.1.1.2.5.19");
RIPRoutedSubnetTable.RIPRoutedSubnetTableIndex = new Column("RIPRoutedSubnetTableIndex","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.1",2);
RIPRoutedSubnetTable.RIPRoutedSubnetTableIPType = new Column("RIPRoutedSubnetTableIPType","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.2",2);
RIPRoutedSubnetTable.RIPRoutedSubnetTableIP = new Column("RIPRoutedSubnetTableIP","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.3",4, 1);
RIPRoutedSubnetTable.RIPRoutedSubnetTableGWNetIPType = new Column("RIPRoutedSubnetTableGWNetIPType","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.4",2);
RIPRoutedSubnetTable.RIPRoutedSubnetTableGWNetIP = new Column("RIPRoutedSubnetTableGWNetIP","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.5",4, 1);
RIPRoutedSubnetTable.RIPRoutedSubnetTableMask = new Column("RIPRoutedSubnetTableMask","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.6",4, 1);
RIPRoutedSubnetTable.RIPRoutedSubnetTableEnabled = new Column("RIPRoutedSubnetTableEnabled","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.7",2);
RIPRoutedSubnetTable.RIPTableSendCMInterface = new Column("RIPTableSendCMInterface","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.8",2);
RIPRoutedSubnetTable.RIPRoutedSubnetTableDHCP = new Column("RIPRoutedSubnetTableDHCP","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.9",2);
RIPRoutedSubnetTable.RIPRoutedSubnetTableNAT = new Column("RIPRoutedSubnetTableNAT","1.3.6.1.4.1.4115.1.20.1.1.2.5.19.1.10",2);
var arRIPRoutedSubnetTableIndex=RIPRoutedSubnetTable.RIPRoutedSubnetTableIndex;
var arRIPRoutedSubnetTableIPType=RIPRoutedSubnetTable.RIPRoutedSubnetTableIPType;
var arRIPRoutedSubnetTableIP=RIPRoutedSubnetTable.RIPRoutedSubnetTableIP;
var arRIPRoutedSubnetTableGWNetIPType=RIPRoutedSubnetTable.RIPRoutedSubnetTableGWNetIPType;
var arRIPRoutedSubnetTableGWNetIP=RIPRoutedSubnetTable.RIPRoutedSubnetTableGWNetIP;
var arRIPRoutedSubnetTableMask=RIPRoutedSubnetTable.RIPRoutedSubnetTableMask;
var arRIPRoutedSubnetTableEnabled=RIPRoutedSubnetTable.RIPRoutedSubnetTableEnabled;
var arRIPTableSendCMInterface=RIPRoutedSubnetTable.RIPTableSendCMInterface;
var arRIPRoutedSubnetTableDHCP=RIPRoutedSubnetTable.RIPRoutedSubnetTableDHCP;
var arRIPRoutedSubnetTableNAT=RIPRoutedSubnetTable.RIPRoutedSubnetTableNAT;

var LanEtherPortTable = new Table("LanEtherPortTable",                      "1.3.6.1.4.1.4115.1.20.1.1.2.8");
LanEtherPortTable.LanEtherPortIdx = new Column("LanEtherPortIdx",           "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.1",66);
LanEtherPortTable.LanEtherPortIFIndex = new Column("LanEtherPortIFIndex",   "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.2",2);
LanEtherPortTable.LanEtherPortEnabled = new Column("LanEtherPortEnabled",   "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.3",2);
LanEtherPortTable.LanEtherPortDuplex = new Column("LanEtherPortDuplex",     "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.4",2);
LanEtherPortTable.LanEtherPortSpeed = new Column("LanEtherPortSpeed",       "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.5",2);
LanEtherPortTable.LanEtherPortAuto = new Column("LanEtherPortAuto",         "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.6",2);
LanEtherPortTable.LanEtherPortHasLink = new Column("LanEtherPortHasLink",   "1.3.6.1.4.1.4115.1.20.1.1.2.8.1.7",2);
var arLanEtherPortIdx=LanEtherPortTable.LanEtherPortIdx;
var arLanEtherPortIFIndex=LanEtherPortTable.LanEtherPortIFIndex;
var arLanEtherPortEnabled=LanEtherPortTable.LanEtherPortEnabled;
var arLanEtherPortDuplex=LanEtherPortTable.LanEtherPortDuplex;
var arLanEtherPortSpeed=LanEtherPortTable.LanEtherPortSpeed;
var arLanEtherPortAuto=LanEtherPortTable.LanEtherPortAuto;
var arLanEtherPortHasLink=LanEtherPortTable.LanEtherPortHasLink;

var RIPngObjects = new Container("RIPngObjects", "1.3.6.1.4.1.4115.1.20.1.1.2.9");
RIPngObjects.RIPngEnable= new Scalar("RIPngEnable","1.3.6.1.4.1.4115.1.20.1.1.2.9.1",2);
RIPngObjects.RIPngAddr= new Scalar("RIPngAddr","1.3.6.1.4.1.4115.1.20.1.1.2.9.2",4, 1);
RIPngObjects.RIPngSubnetEnable= new Scalar("RIPngSubnetEnable","1.3.6.1.4.1.4115.1.20.1.1.2.9.3",2);
RIPngObjects.RIPngRoutedSubnetAddr= new Scalar("RIPngRoutedSubnetAddr","1.3.6.1.4.1.4115.1.20.1.1.2.9.4",4, 1);
RIPngObjects.RIPngRoutedSubnetPrefixLength= new Scalar("RIPngRoutedSubnetPrefixLength","1.3.6.1.4.1.4115.1.20.1.1.2.9.5",2);
RIPngObjects.RIPngSendCMInterface= new Scalar("RIPngSendCMInterface","1.3.6.1.4.1.4115.1.20.1.1.2.9.6",2);
var arRIPngEnable=RIPngObjects.RIPngEnable;
var arRIPngAddr=RIPngObjects.RIPngAddr;
var arRIPngSubnetEnable=RIPngObjects.RIPngSubnetEnable;
var arRIPngRoutedSubnetAddr=RIPngObjects.RIPngRoutedSubnetAddr;
var arRIPngRoutedSubnetPrefixLength=RIPngObjects.RIPngRoutedSubnetPrefixLength;
var arRIPngSendCMInterface=RIPngObjects.RIPngSendCMInterface;

var WiFi50RadioSettings = new Container("WiFi50RadioSettings", "1.3.6.1.4.1.4115.1.20.1.1.3.50");
WiFi50RadioSettings.WiFi50Channel= new Scalar("WiFi50Channel","1.3.6.1.4.1.4115.1.20.1.1.3.50.1",66);
WiFi50RadioSettings.WiFi50Mode= new Scalar("WiFi50Mode","1.3.6.1.4.1.4115.1.20.1.1.3.50.2",2);
WiFi50RadioSettings.WiFi50EnableRadio= new Scalar("WiFi50EnableRadio","1.3.6.1.4.1.4115.1.20.1.1.3.50.10",2);
WiFi50RadioSettings.WiFi50OutputPower= new Scalar("WiFi50OutputPower","1.3.6.1.4.1.4115.1.20.1.1.3.50.14",2);
WiFi50RadioSettings.WiFi50HTTxStream= new Scalar("WiFi50HTTxStream","1.3.6.1.4.1.4115.1.20.1.1.3.50.21",66);
WiFi50RadioSettings.WiFi50HTRxStream= new Scalar("WiFi50HTRxStream","1.3.6.1.4.1.4115.1.20.1.1.3.50.22",66);
WiFi50RadioSettings.WiFi50EnableSTBC= new Scalar("WiFi50EnableSTBC","1.3.6.1.4.1.4115.1.20.1.1.3.50.23",2);
WiFi50RadioSettings.WiFi50EnableRDG= new Scalar("WiFi50EnableRDG","1.3.6.1.4.1.4115.1.20.1.1.3.50.24",2);
WiFi50RadioSettings.WiFi50IGMPSnooping= new Scalar("WiFi50IGMPSnooping","1.3.6.1.4.1.4115.1.20.1.1.3.50.25",2);
WiFi50RadioSettings.WiFi50WiFiBlockDFSChan= new Scalar("WiFi50WiFiBlockDFSChan","1.3.6.1.4.1.4115.1.20.1.1.3.50.26",2);
WiFi50RadioSettings.WiFi50PhysicalChannel= new Scalar("WiFi50PhysicalChannel","1.3.6.1.4.1.4115.1.20.1.1.3.50.16",2);   /* kn-mib */
var arWiFi50Channel=WiFi50RadioSettings.WiFi50Channel;
var arWiFi50Mode=WiFi50RadioSettings.WiFi50Mode;
var arWiFi50EnableRadio=WiFi50RadioSettings.WiFi50EnableRadio;
var arWiFi50OutputPower=WiFi50RadioSettings.WiFi50OutputPower;
var arWiFi50HTTxStream=WiFi50RadioSettings.WiFi50HTTxStream;
var arWiFi50HTRxStream=WiFi50RadioSettings.WiFi50HTRxStream;
var arWiFi50EnableSTBC=WiFi50RadioSettings.WiFi50EnableSTBC;
var arWiFi50EnableRDG=WiFi50RadioSettings.WiFi50EnableRDG;
var arWiFi50IGMPSnooping=WiFi50RadioSettings.WiFi50IGMPSnooping;
var arWiFi50BlockDFSChan=WiFi50RadioSettings.WiFi50WiFiBlockDFSChan;
var arWiFi50PhysicalChannel=WiFi50RadioSettings.WiFi50PhysicalChannel;   /* kn-mib */

var WiFi50NSettings = new Container("WiFi50NSettings", "1.3.6.1.4.1.4115.1.20.1.1.3.50.20");
WiFi50NSettings.WiFi50HTMCS= new Scalar("WiFi50HTMCS","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.1",2);
WiFi50NSettings.WiFi50ChannelBW= new Scalar("WiFi50ChannelBW","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.2",2);
WiFi50NSettings.WiFi50NSideBand= new Scalar("WiFi50NSideBand","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.3",2);
WiFi50NSettings.WiFi50HTMode= new Scalar("WiFi50HTMode","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.4",2);
WiFi50NSettings.WiFi50GuardInterval= new Scalar("WiFi50GuardInterval","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.5",2);
WiFi50NSettings.WiFi50AMSDUEnable= new Scalar("WiFi50AMSDUEnable","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.6",2);
WiFi50NSettings.WiFi50DeclinePeerBA= new Scalar("WiFi50DeclinePeerBA","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.7",2);
WiFi50NSettings.WiFi50BlockAck= new Scalar("WiFi50BlockAck","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.8",2);
WiFi50NSettings.WiFi50NProtection= new Scalar("WiFi50NProtection","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.9",2);
WiFi50NSettings.WiFi50Allow40MHzOnlyOperation= new Scalar("WiFi50Allow40MHzOnlyOperation","1.3.6.1.4.1.4115.1.20.1.1.3.50.20.10",2);
var arWiFi50HTMCS=WiFi50NSettings.WiFi50HTMCS;
var arWiFi50ChannelBW=WiFi50NSettings.WiFi50ChannelBW;
var arWiFi50NSideBand=WiFi50NSettings.WiFi50NSideBand;
var arWiFi50HTMode=WiFi50NSettings.WiFi50HTMode;
var arWiFi50GuardInterval=WiFi50NSettings.WiFi50GuardInterval;
var arWiFi50AMSDUEnable=WiFi50NSettings.WiFi50AMSDUEnable;
var arWiFi50DeclinePeerBA=WiFi50NSettings.WiFi50DeclinePeerBA;
var arWiFi50BlockAck=WiFi50NSettings.WiFi50BlockAck;
var arWiFi50NProtection=WiFi50NSettings.WiFi50NProtection;
var arWiFi50Allow40MHzOnlyOperation=WiFi50NSettings.WiFi50Allow40MHzOnlyOperation;

var WirelessCfg = new Container("WirelessCfg", "1.3.6.1.4.1.4115.1.20.1.1.3");
WirelessCfg.WiFiCountry= new Scalar("WiFiCountry","1.3.6.1.4.1.4115.1.20.1.1.3.1",4);
WirelessCfg.WiFiChannel= new Scalar("WiFiChannel","1.3.6.1.4.1.4115.1.20.1.1.3.2",66);
WirelessCfg.WiFiMode= new Scalar("WiFiMode","1.3.6.1.4.1.4115.1.20.1.1.3.3",2);
WirelessCfg.WiFiBGProtect= new Scalar("WiFiBGProtect","1.3.6.1.4.1.4115.1.20.1.1.3.4",2);
WirelessCfg.WiFiBeaconInterval= new Scalar("WiFiBeaconInterval","1.3.6.1.4.1.4115.1.20.1.1.3.5",66);
WirelessCfg.WiFiDTIMInterval= new Scalar("WiFiDTIMInterval","1.3.6.1.4.1.4115.1.20.1.1.3.6",66);
WirelessCfg.WiFiTxPreamble= new Scalar("WiFiTxPreamble","1.3.6.1.4.1.4115.1.20.1.1.3.7",2);
WirelessCfg.WiFiRTSThreshold= new Scalar("WiFiRTSThreshold","1.3.6.1.4.1.4115.1.20.1.1.3.8",66);
WirelessCfg.WiFiFragmentThresh= new Scalar("WiFiFragmentThresh","1.3.6.1.4.1.4115.1.20.1.1.3.9",66);
WirelessCfg.WiFiShortSlot= new Scalar("WiFiShortSlot","1.3.6.1.4.1.4115.1.20.1.1.3.10",2);
WirelessCfg.WiFiFrameBurst= new Scalar("WiFiFrameBurst","1.3.6.1.4.1.4115.1.20.1.1.3.11",2);
WirelessCfg.WiFiEnableRadio= new Scalar("WiFiEnableRadio","1.3.6.1.4.1.4115.1.20.1.1.3.12",2);
WirelessCfg.WiFiTxPower= new Scalar("WiFiTxPower","1.3.6.1.4.1.4115.1.20.1.1.3.13",2);
WirelessCfg.WiFiShortRetryLimit= new Scalar("WiFiShortRetryLimit","1.3.6.1.4.1.4115.1.20.1.1.3.14",2);
WirelessCfg.WiFiLongRetryLimit= new Scalar("WiFiLongRetryLimit","1.3.6.1.4.1.4115.1.20.1.1.3.15",2);
WirelessCfg.WiFiOutputPower= new Scalar("WiFiOutputPower","1.3.6.1.4.1.4115.1.20.1.1.3.16",2);
WirelessCfg.WiFiMulticastA= new Scalar("WiFiMulticastA","1.3.6.1.4.1.4115.1.20.1.1.3.17",2);
WirelessCfg.WiFiMulticastBG= new Scalar("WiFiMulticastBG","1.3.6.1.4.1.4115.1.20.1.1.3.18",2);
WirelessCfg.WiFiBasicRateSet= new Scalar("WiFiBasicRateSet","1.3.6.1.4.1.4115.1.20.1.1.3.19",2);
WirelessCfg.WiFiTxRate= new Scalar("WiFiTxRate","1.3.6.1.4.1.4115.1.20.1.1.3.20",2);
WirelessCfg.WiFiResetDefaults= new Scalar("WiFiResetDefaults","1.3.6.1.4.1.4115.1.20.1.1.3.32",2);
WirelessCfg.WiFiEnableRadioNow= new Scalar("WiFiEnableRadioNow","1.3.6.1.4.1.4115.1.20.1.1.3.33",2);
WirelessCfg.WiFiCustomSSIDStr= new Scalar("WiFiCustomSSIDStr","1.3.6.1.4.1.4115.1.20.1.1.3.34",4);
WirelessCfg.WiFiReset= new Scalar("WiFiReset","1.3.6.1.4.1.4115.1.20.1.1.3.35",2);
WirelessCfg.WiFiUseSNForPSK= new Scalar("WiFiUseSNForPSK","1.3.6.1.4.1.4115.1.20.1.1.3.36",2);
WirelessCfg.WiFiRadioControlMode= new Scalar("WiFiRadioControlMode","1.3.6.1.4.1.4115.1.20.1.1.3.37",2);
WirelessCfg.WiFiAutoChannelTime= new Scalar("WiFiAutoChannelTime","1.3.6.1.4.1.4115.1.20.1.1.3.38",2);
WirelessCfg.WiFiUtilityCommand= new Scalar("WiFiUtilityCommand","1.3.6.1.4.1.4115.1.20.1.1.3.40",4);
WirelessCfg.WiFiUtilityCommandOutput= new Scalar("WiFiUtilityCommandOutput","1.3.6.1.4.1.4115.1.20.1.1.3.41",4);
WirelessCfg.WiFiPhysicalChannel= new Scalar("WiFiPhysicalChannel","1.3.6.1.4.1.4115.1.20.1.1.3.43",2);
WirelessCfg.WiFiTxPowerPhysical= new Scalar("WiFiTxPowerPhysical","1.3.6.1.4.1.4115.1.20.1.1.3.44",2);
WirelessCfg.WiFiShortSlotEnhanced= new Scalar("WiFiShortSlotEnhanced","1.3.6.1.4.1.4115.1.20.1.1.3.45",2);
WirelessCfg.WiFiInterferencePhyLayer= new Scalar("WiFiInterferencePhyLayer","1.3.6.1.4.1.4115.1.20.1.1.3.47",2);
WirelessCfg.WiFiInterferenceDriverLayer= new Scalar("WiFiInterferenceDriverLayer","1.3.6.1.4.1.4115.1.20.1.1.3.48",2);
WirelessCfg.WiFiChannelsInterferenceState= new Scalar("WiFiChannelsInterferenceState","1.3.6.1.4.1.4115.1.20.1.1.3.49",4);
WirelessCfg.WiFiExtensionChannel= new Scalar("WiFiExtensionChannel","1.3.6.1.4.1.4115.1.20.1.1.3.64",66);
WirelessCfg.WiFiHTTxStream= new Scalar("WiFiHTTxStream","1.3.6.1.4.1.4115.1.20.1.1.3.55",66);
WirelessCfg.WiFiHTRxStream= new Scalar("WiFiHTRxStream","1.3.6.1.4.1.4115.1.20.1.1.3.56",66);
WirelessCfg.WiFiEnableSTBC= new Scalar("WiFiEnableSTBC","1.3.6.1.4.1.4115.1.20.1.1.3.57",2);
WirelessCfg.WiFiEnableRDG= new Scalar("WiFiEnableRDG","1.3.6.1.4.1.4115.1.20.1.1.3.58",2);
WirelessCfg.WiFiIGMPSnooping= new Scalar("WiFiIGMPSnooping","1.3.6.1.4.1.4115.1.20.1.1.3.59",2);
var arWiFiCountry=WirelessCfg.WiFiCountry;
var arWiFiChannel=WirelessCfg.WiFiChannel;
var arWiFiMode=WirelessCfg.WiFiMode;
var arWiFiBGProtect=WirelessCfg.WiFiBGProtect;
var arWiFiBeaconInterval=WirelessCfg.WiFiBeaconInterval;
var arWiFiDTIMInterval=WirelessCfg.WiFiDTIMInterval;
var arWiFiTxPreamble=WirelessCfg.WiFiTxPreamble;
var arWiFiRTSThreshold=WirelessCfg.WiFiRTSThreshold;
var arWiFiFragmentThresh=WirelessCfg.WiFiFragmentThresh;
var arWiFiShortSlot=WirelessCfg.WiFiShortSlot;
var arWiFiFrameBurst=WirelessCfg.WiFiFrameBurst;
var arWiFiEnableRadio=WirelessCfg.WiFiEnableRadio;
var arWiFiTxPower=WirelessCfg.WiFiTxPower;
var arWiFiShortRetryLimit=WirelessCfg.WiFiShortRetryLimit;
var arWiFiLongRetryLimit=WirelessCfg.WiFiLongRetryLimit;
var arWiFiOutputPower=WirelessCfg.WiFiOutputPower;
var arWiFiMulticastA=WirelessCfg.WiFiMulticastA;
var arWiFiMulticastBG=WirelessCfg.WiFiMulticastBG;
var arWiFiBasicRateSet=WirelessCfg.WiFiBasicRateSet;
var arWiFiTxRate=WirelessCfg.WiFiTxRate;
var arWiFiResetDefaults=WirelessCfg.WiFiResetDefaults;
var arWiFiEnableRadioNow=WirelessCfg.WiFiEnableRadioNow;
var arWiFiCustomSSIDStr=WirelessCfg.WiFiCustomSSIDStr;
var arWiFiReset=WirelessCfg.WiFiReset;
var arWiFiUseSNForPSK=WirelessCfg.WiFiUseSNForPSK;
var arWiFiRadioControlMode=WirelessCfg.WiFiRadioControlMode;
var arWiFiAutoChannelTime=WirelessCfg.WiFiAutoChannelTime;
var arWiFiUtilityCommand=WirelessCfg.WiFiUtilityCommand;
var arWiFiUtilityCommandOutput=WirelessCfg.WiFiUtilityCommandOutput;
var arWiFiPhysicalChannel=WirelessCfg.WiFiPhysicalChannel;
var arWiFiTxPowerPhysical=WirelessCfg.WiFiTxPowerPhysical;
var arWiFiShortSlotEnhanced=WirelessCfg.WiFiShortSlotEnhanced;
var arWiFiInterferencePhyLayer=WirelessCfg.WiFiInterferencePhyLayer;
var arWiFiInterferenceDriverLayer=WirelessCfg.WiFiInterferenceDriverLayer;
var arWiFiChannelsInterferenceState=WirelessCfg.WiFiChannelsInterferenceState;
var arWiFiExtensionChannel=WirelessCfg.WiFiExtensionChannel;
var arWiFiHTTxStream=WirelessCfg.WiFiHTTxStream;
var arWiFiHTRxStream=WirelessCfg.WiFiHTRxStream;
var arWiFiEnableSTBC=WirelessCfg.WiFiEnableSTBC;
var arWiFiEnableRDG=WirelessCfg.WiFiEnableRDG;
var arWiFiIGMPSnooping=WirelessCfg.WiFiIGMPSnooping;

var WiFi80211NSettings = new Container("WiFi80211NSettings", "1.3.6.1.4.1.4115.1.20.1.1.3.21");
WiFi80211NSettings.WiFi80211NBand= new Scalar("WiFi80211NBand","1.3.6.1.4.1.4115.1.20.1.1.3.21.1",2);
WiFi80211NSettings.WiFiHTMCS= new Scalar("WiFiHTMCS","1.3.6.1.4.1.4115.1.20.1.1.3.21.2",2);
WiFi80211NSettings.WiFiChannelBW= new Scalar("WiFiChannelBW","1.3.6.1.4.1.4115.1.20.1.1.3.21.3",2);
WiFi80211NSettings.WiFi80211NSideBand= new Scalar("WiFi80211NSideBand","1.3.6.1.4.1.4115.1.20.1.1.3.21.4",2);
WiFi80211NSettings.WiFiHTMode= new Scalar("WiFiHTMode","1.3.6.1.4.1.4115.1.20.1.1.3.21.5",2);
WiFi80211NSettings.WiFiGuardInterval= new Scalar("WiFiGuardInterval","1.3.6.1.4.1.4115.1.20.1.1.3.21.6",2);
WiFi80211NSettings.WiFiAMSDUEnable= new Scalar("WiFiAMSDUEnable","1.3.6.1.4.1.4115.1.20.1.1.3.21.7",2);
WiFi80211NSettings.WiFiDeclinePeerBA= new Scalar("WiFiDeclinePeerBA","1.3.6.1.4.1.4115.1.20.1.1.3.21.8",2);
WiFi80211NSettings.WiFiBlockAck= new Scalar("WiFiBlockAck","1.3.6.1.4.1.4115.1.20.1.1.3.21.9",2);
WiFi80211NSettings.WiFiNProtection= new Scalar("WiFiNProtection","1.3.6.1.4.1.4115.1.20.1.1.3.21.10",2);
var arWiFi80211NBand=WiFi80211NSettings.WiFi80211NBand;
var arWiFiHTMCS=WiFi80211NSettings.WiFiHTMCS;
var arWiFiChannelBW=WiFi80211NSettings.WiFiChannelBW;
var arWiFi80211NSideBand=WiFi80211NSettings.WiFi80211NSideBand;
var arWiFiHTMode=WiFi80211NSettings.WiFiHTMode;
var arWiFiGuardInterval=WiFi80211NSettings.WiFiGuardInterval;
var arWiFiAMSDUEnable=WiFi80211NSettings.WiFiAMSDUEnable;
var arWiFiDeclinePeerBA=WiFi80211NSettings.WiFiDeclinePeerBA;
var arWiFiBlockAck=WiFi80211NSettings.WiFiBlockAck;
var arWiFiNProtection=WiFi80211NSettings.WiFiNProtection;


var RouterSoftGreWanTable = new Table("RouterSoftGreWanTable", "1.3.6.1.4.1.4115.1.20.1.1.1.19.1");
RouterSoftGreWanTable.SoftGreWanEnable = new Column("SoftGreWanEnable","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.1",2,1);
RouterSoftGreWanTable.SoftGreMappedInterface =  new Column("SoftGreMappedInterface","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.2",66);
RouterSoftGreWanTable.SoftGreWanDscp = new Column("SoftGreWanDscp","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.19",2,1);
RouterSoftGreWanTable.FailoverPingCount = new Column("FailoverPingCount","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.7",2, 1);
RouterSoftGreWanTable.FailoverPingInterval = new Column("FailoverPingInterval","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.8",2, 1);
RouterSoftGreWanTable.FailoverThreshold = new Column("FailoverThreshold","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.9",2, 1);
//RouterSoftGreWanTable.DNSRetryTimer = new Column("DNSRetryTimer","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.20",2, 1);
RouterSoftGreWanTable.CircuitIdEnabled = new Column("CircuitIdEnabled","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.10",2);
RouterSoftGreWanTable.RemoteIdEnabled = new Column("RemoteIdEnabled","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.11",2);
RouterSoftGreWanTable.MaxSessions = new Column("MaxSessions","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.3",2);
RouterSoftGreWanTable.ControllerFqdn = new Column("ControllerFqdn","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.4",4);
RouterSoftGreWanTable.ControllerProvisionedSecondaryIpAddressType = new Column("ControllerProvisionedSecondaryIpAddressType","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.5",1);
RouterSoftGreWanTable.ControllerProvisionedSecondaryIpAddress = new Column("ControllerProvisionedSecondaryIpAddress","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.6",4);
RouterSoftGreWanTable.ControllerCurrentIpAddressType = new Column("ControllerCurrentIpAddressType","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.21",1);
RouterSoftGreWanTable.ControllerCurrentIpAddress = new Column("ControllerCurrentIpAddress","1.3.6.1.4.1.4115.1.20.1.1.1.19.1.1.22",4);

var arGreWanSoftGreWanEnable=RouterSoftGreWanTable.SoftGreWanEnable;
var arGreWanSoftGreMappedInterface=RouterSoftGreWanTable.SoftGreMappedInterface;
var arGreWanSoftGreWanDscp=RouterSoftGreWanTable.SoftGreWanDscp;
var arGreWanFailoverPingCount=RouterSoftGreWanTable.FailoverPingCount;
var arGreWanFailoverPingInterval=RouterSoftGreWanTable.FailoverPingInterval;
var arGreWanFailoverThreshold=RouterSoftGreWanTable.FailoverThreshold;
//var arGreWanDNSRetryTimer=RouterSoftGreWanTable.DNSRetryTimer;
var arGreWanCircuitIdEnabled=RouterSoftGreWanTable.CircuitIdEnabled;
var arGreWanRemoteIdEnabled=RouterSoftGreWanTable.RemoteIdEnabled;
var arGreMaxSessions=RouterSoftGreWanTable.MaxSessions;
var arGreWanControllerFqdn=RouterSoftGreWanTable.ControllerFqdn;
var arGreWanControllerProvisionedSecondaryIpAddressType=RouterSoftGreWanTable.ControllerProvisionedSecondaryIpAddressType;
var arGreWanControllerProvisionedSecondaryIpAddress=RouterSoftGreWanTable.ControllerProvisionedSecondaryIpAddress;
var arGreWanControllerCurrentIpAddressType=RouterSoftGreWanTable.ControllerCurrentIpAddressType;
var arGreWanControllerControllerCurrentIpAddress=RouterSoftGreWanTable.ControllerCurrentIpAddress;

var RouterSoftGreSSIDTable = new Table("RouterSoftGreSSIDTable", "1.3.6.1.4.1.4115.1.20.1.1.1.19.2");
RouterSoftGreSSIDTable.SoftGreVLanId = new Column("SoftGreVLanId", "1.3.6.1.4.1.4115.1.20.1.1.1.19.2.1.1",66);
RouterSoftGreSSIDTable.SoftGreVLanPriority =  new Column("SoftGreVLanPriority", "1.3.6.1.4.1.4115.1.20.1.1.1.19.2.1.2",66);

var arGreSSIDSoftGreVLanId=RouterSoftGreSSIDTable.SoftGreVLanId;
var arGreSSIDSoftGreVLanPriority=RouterSoftGreSSIDTable.SoftGreVLanPriority;

			
var BSSTable = new Table("BSSTable", "1.3.6.1.4.1.4115.1.20.1.1.3.22");
BSSTable.BssID = new Column("BssID","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.1",4, 1);
BSSTable.BssSSID = new Column("BssSSID","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.2",4);
BSSTable.BssActive = new Column("BssActive","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.3",2);
BSSTable.BssSSIDBroadcast = new Column("BssSSIDBroadcast","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.4",2);
BSSTable.BssSecurityMode = new Column("BssSecurityMode","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.5",2);
BSSTable.BssAccessMode = new Column("BssAccessMode","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.6",2);
BSSTable.BssNetworkIsolate = new Column("BssNetworkIsolate","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.7",2);
BSSTable.BssMACAccessCount = new Column("BssMACAccessCount","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.8",66);
BSSTable.BssMACAccessClear = new Column("BssMACAccessClear","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.9",2);
BSSTable.BssWMMEnable = new Column("BssWMMEnable","1.3.6.1.4.1.4115.1.20.1.1.3.22.1.12",2);
var arBssID=BSSTable.BssID;
var arBssSSID=BSSTable.BssSSID;
var arBssActive=BSSTable.BssActive;
var arBssSSIDBroadcast=BSSTable.BssSSIDBroadcast;
var arBssSecurityMode=BSSTable.BssSecurityMode;
var arBssAccessMode=BSSTable.BssAccessMode;
var arBssNetworkIsolate=BSSTable.BssNetworkIsolate;
var arBssMACAccessCount=BSSTable.BssMACAccessCount;
var arBssMACAccessClear=BSSTable.BssMACAccessClear;
var arBssWMMEnable=BSSTable.BssWMMEnable;

var WEPTable = new Table("WEPTable", "1.3.6.1.4.1.4115.1.20.1.1.3.23");
WEPTable.WEPCurrentKey = new Column("WEPCurrentKey","1.3.6.1.4.1.4115.1.20.1.1.3.23.1.1",66);
WEPTable.WEPEncryptionMode = new Column("WEPEncryptionMode","1.3.6.1.4.1.4115.1.20.1.1.3.23.1.2",2);
WEPTable.WEPPassPhrase = new Column("WEPPassPhrase","1.3.6.1.4.1.4115.1.20.1.1.3.23.1.3",4);
var arWEPCurrentKey=WEPTable.WEPCurrentKey;
var arWEPEncryptionMode=WEPTable.WEPEncryptionMode;
var arWEPPassPhrase=WEPTable.WEPPassPhrase;

var WEP64BitKeyTable = new Table("WEP64BitKeyTable", "1.3.6.1.4.1.4115.1.20.1.1.3.24");
WEP64BitKeyTable.WEP64BitKeyIndex = new Column("WEP64BitKeyIndex","1.3.6.1.4.1.4115.1.20.1.1.3.24.1.1",2);
WEP64BitKeyTable.WEP64BitKeyValue = new Column("WEP64BitKeyValue","1.3.6.1.4.1.4115.1.20.1.1.3.24.1.2",4);
WEP64BitKeyTable.WEP64BitKeyStatus = new Column("WEP64BitKeyStatus","1.3.6.1.4.1.4115.1.20.1.1.3.24.1.3",2);
var arWEP64BitKeyIndex=WEP64BitKeyTable.WEP64BitKeyIndex;
var arWEP64BitKeyValue=WEP64BitKeyTable.WEP64BitKeyValue;
var arWEP64BitKeyStatus=WEP64BitKeyTable.WEP64BitKeyStatus;

var WEP128BitKeyTable = new Table("WEP128BitKeyTable", "1.3.6.1.4.1.4115.1.20.1.1.3.25");
WEP128BitKeyTable.WEP128BitKeyIndex = new Column("WEP128BitKeyIndex","1.3.6.1.4.1.4115.1.20.1.1.3.25.1.1",2);
WEP128BitKeyTable.WEP128BitKeyValue = new Column("WEP128BitKeyValue","1.3.6.1.4.1.4115.1.20.1.1.3.25.1.2",4);
WEP128BitKeyTable.WEP128BitKeyStatus = new Column("WEP128BitKeyStatus","1.3.6.1.4.1.4115.1.20.1.1.3.25.1.3",2);
var arWEP128BitKeyIndex=WEP128BitKeyTable.WEP128BitKeyIndex;
var arWEP128BitKeyValue=WEP128BitKeyTable.WEP128BitKeyValue;
var arWEP128BitKeyStatus=WEP128BitKeyTable.WEP128BitKeyStatus;

var WPATable = new Table("WPATable", "1.3.6.1.4.1.4115.1.20.1.1.3.26");
WPATable.WPAAlgorithm = new Column("WPAAlgorithm","1.3.6.1.4.1.4115.1.20.1.1.3.26.1.1",2);
WPATable.WPAPreSharedKey = new Column("WPAPreSharedKey","1.3.6.1.4.1.4115.1.20.1.1.3.26.1.2",4);
WPATable.WPAGroupRekeyInterval = new Column("WPAGroupRekeyInterval","1.3.6.1.4.1.4115.1.20.1.1.3.26.1.3",66);
WPATable.WPAReAuthInterval = new Column("WPAReAuthInterval","1.3.6.1.4.1.4115.1.20.1.1.3.26.1.4",66);
WPATable.WPAPreAuthEnable = new Column("WPAPreAuthEnable","1.3.6.1.4.1.4115.1.20.1.1.3.26.1.5",2);
var arWPAAlgorithm=WPATable.WPAAlgorithm;
var arWPAPreSharedKey=WPATable.WPAPreSharedKey;
var arWPAGroupRekeyInterval=WPATable.WPAGroupRekeyInterval;
var arWPAReAuthInterval=WPATable.WPAReAuthInterval;
var arWPAPreAuthEnable=WPATable.WPAPreAuthEnable;

var RadiusTable = new Table("RadiusTable", "1.3.6.1.4.1.4115.1.20.1.1.3.27");
RadiusTable.RadiusAddressType = new Column("RadiusAddressType","1.3.6.1.4.1.4115.1.20.1.1.3.27.1.1",2);
RadiusTable.RadiusAddress = new Column("RadiusAddress","1.3.6.1.4.1.4115.1.20.1.1.3.27.1.2",4, 1);
RadiusTable.RadiusPort = new Column("RadiusPort","1.3.6.1.4.1.4115.1.20.1.1.3.27.1.3",66);
RadiusTable.RadiusKey = new Column("RadiusKey","1.3.6.1.4.1.4115.1.20.1.1.3.27.1.4",4);
RadiusTable.RadiusReAuthInterval = new Column("RadiusReAuthInterval","1.3.6.1.4.1.4115.1.20.1.1.3.27.1.5",66);
var arRadiusAddressType=RadiusTable.RadiusAddressType;
var arRadiusAddress=RadiusTable.RadiusAddress;
var arRadiusPort=RadiusTable.RadiusPort;
var arRadiusKey=RadiusTable.RadiusKey;
var arRadiusReAuthInterval=RadiusTable.RadiusReAuthInterval;

var MACAccessTable = new Table("MACAccessTable", "1.3.6.1.4.1.4115.1.20.1.1.3.28");
MACAccessTable.MACAccessIndex = new Column("MACAccessIndex","1.3.6.1.4.1.4115.1.20.1.1.3.28.1.1",2);
MACAccessTable.MACAccessAddr = new Column("MACAccessAddr","1.3.6.1.4.1.4115.1.20.1.1.3.28.1.2",4, 1);
MACAccessTable.MACAccessStatus = new Column("MACAccessStatus","1.3.6.1.4.1.4115.1.20.1.1.3.28.1.3",2);
MACAccessTable.MACAccessDeviceName = new Column("MACAccessDeviceName","1.3.6.1.4.1.4115.1.20.1.1.3.28.1.4",4);
var arMACAccessIndex=MACAccessTable.MACAccessIndex;
var arMACAccessAddr=MACAccessTable.MACAccessAddr;
var arMACAccessStatus=MACAccessTable.MACAccessStatus;
var arMACAccessDeviceName=MACAccessTable.MACAccessDeviceName;

var WMMCfg = new Container("WMMCfg", "1.3.6.1.4.1.4115.1.20.1.1.3.29");
WMMCfg.WMMEnable= new Scalar("WMMEnable","1.3.6.1.4.1.4115.1.20.1.1.3.29.1",2);
WMMCfg.WMMNoAck= new Scalar("WMMNoAck","1.3.6.1.4.1.4115.1.20.1.1.3.29.2",2);
WMMCfg.WMMAPSD= new Scalar("WMMAPSD","1.3.6.1.4.1.4115.1.20.1.1.3.29.3",2);
var arWMMEnable=WMMCfg.WMMEnable;
var arWMMNoAck=WMMCfg.WMMNoAck;
var arWMMAPSD=WMMCfg.WMMAPSD;

var WMM50Cfg = new Container("WMM50Cfg", "1.3.6.1.4.1.4115.1.20.1.1.3.63");
WMM50Cfg.WMM50Enable= new Scalar("WMM50Enable","1.3.6.1.4.1.4115.1.20.1.1.3.63.1",2);
WMM50Cfg.WMM50NoAck= new Scalar("WMM50NoAck","1.3.6.1.4.1.4115.1.20.1.1.3.63.2",2);
WMM50Cfg.WMM50APSD= new Scalar("WMM50APSD","1.3.6.1.4.1.4115.1.20.1.1.3.63.3",2);
var arWMM50Enable=WMM50Cfg.WMM50Enable;
var arWMM50NoAck=WMM50Cfg.WMM50NoAck;
var arWMM50APSD=WMM50Cfg.WMM50APSD;

var WMMEDCAAPTable = new Table("WMMEDCAAPTable", "1.3.6.1.4.1.4115.1.20.1.1.3.29.4");
WMMEDCAAPTable.WMMEDCAAPIndex = new Column("WMMEDCAAPIndex","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.1",2);
WMMEDCAAPTable.WMMEDCAAPCWmin = new Column("WMMEDCAAPCWmin","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.2",66);
WMMEDCAAPTable.WMMEDCAAPCWmax = new Column("WMMEDCAAPCWmax","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.3",66);
WMMEDCAAPTable.WMMEDCAAPAIFSN = new Column("WMMEDCAAPAIFSN","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.4",66);
WMMEDCAAPTable.WMMEDCAAPTxOpBLimit = new Column("WMMEDCAAPTxOpBLimit","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.5",66);
WMMEDCAAPTable.WMMEDCAAPTxOpAGLimit = new Column("WMMEDCAAPTxOpAGLimit","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.6",66);
WMMEDCAAPTable.WMMEDCAAPAdmitCont = new Column("WMMEDCAAPAdmitCont","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.7",2);
WMMEDCAAPTable.WMMEDCAAPDiscardOld = new Column("WMMEDCAAPDiscardOld","1.3.6.1.4.1.4115.1.20.1.1.3.29.4.1.8",2);
var arWMMEDCAAPIndex=WMMEDCAAPTable.WMMEDCAAPIndex;
var arWMMEDCAAPCWmin=WMMEDCAAPTable.WMMEDCAAPCWmin;
var arWMMEDCAAPCWmax=WMMEDCAAPTable.WMMEDCAAPCWmax;
var arWMMEDCAAPAIFSN=WMMEDCAAPTable.WMMEDCAAPAIFSN;
var arWMMEDCAAPTxOpBLimit=WMMEDCAAPTable.WMMEDCAAPTxOpBLimit;
var arWMMEDCAAPTxOpAGLimit=WMMEDCAAPTable.WMMEDCAAPTxOpAGLimit;
var arWMMEDCAAPAdmitCont=WMMEDCAAPTable.WMMEDCAAPAdmitCont;
var arWMMEDCAAPDiscardOld=WMMEDCAAPTable.WMMEDCAAPDiscardOld;

var WMMEDCASTATable = new Table("WMMEDCASTATable", "1.3.6.1.4.1.4115.1.20.1.1.3.29.5");
WMMEDCASTATable.WMMEDCASTAIndex = new Column("WMMEDCASTAIndex","1.3.6.1.4.1.4115.1.20.1.1.3.29.5.1.1",2);
WMMEDCASTATable.WMMEDCASTACWmin = new Column("WMMEDCASTACWmin","1.3.6.1.4.1.4115.1.20.1.1.3.29.5.1.2",66);
WMMEDCASTATable.WMMEDCASTACWmax = new Column("WMMEDCASTACWmax","1.3.6.1.4.1.4115.1.20.1.1.3.29.5.1.3",66);
WMMEDCASTATable.WMMEDCASTAAIFSN = new Column("WMMEDCASTAAIFSN","1.3.6.1.4.1.4115.1.20.1.1.3.29.5.1.4",66);
WMMEDCASTATable.WMMEDCASTATxOpBLimit = new Column("WMMEDCASTATxOpBLimit","1.3.6.1.4.1.4115.1.20.1.1.3.29.5.1.5",66);
WMMEDCASTATable.WMMEDCASTATxAGLimit = new Column("WMMEDCASTATxAGLimit","1.3.6.1.4.1.4115.1.20.1.1.3.29.5.1.6",66);
var arWMMEDCASTAIndex=WMMEDCASTATable.WMMEDCASTAIndex;
var arWMMEDCASTACWmin=WMMEDCASTATable.WMMEDCASTACWmin;
var arWMMEDCASTACWmax=WMMEDCASTATable.WMMEDCASTACWmax;
var arWMMEDCASTAAIFSN=WMMEDCASTATable.WMMEDCASTAAIFSN;
var arWMMEDCASTATxOpBLimit=WMMEDCASTATable.WMMEDCASTATxOpBLimit;
var arWMMEDCASTATxAGLimit=WMMEDCASTATable.WMMEDCASTATxAGLimit;

var WPSCfg = new Container("WPSCfg", "1.3.6.1.4.1.4115.1.20.1.1.3.30");
WPSCfg.WpsMode= new Scalar("WpsMode","1.3.6.1.4.1.4115.1.20.1.1.3.30.1",2);
WPSCfg.WpsConfigState= new Scalar("WpsConfigState","1.3.6.1.4.1.4115.1.20.1.1.3.30.2",2);
WPSCfg.WpsDevicePIN= new Scalar("WpsDevicePIN","1.3.6.1.4.1.4115.1.20.1.1.3.30.3",4);
WPSCfg.WpsDeviceName= new Scalar("WpsDeviceName","1.3.6.1.4.1.4115.1.20.1.1.3.30.4",4);
WPSCfg.WpsModelName= new Scalar("WpsModelName","1.3.6.1.4.1.4115.1.20.1.1.3.30.5",4);
WPSCfg.WpsMfg= new Scalar("WpsMfg","1.3.6.1.4.1.4115.1.20.1.1.3.30.6",4);
WPSCfg.WpsResultStatus= new Scalar("WpsResultStatus","1.3.6.1.4.1.4115.1.20.1.1.3.30.7",2);
WPSCfg.WpsStatus= new Scalar("WpsStatus","1.3.6.1.4.1.4115.1.20.1.1.3.30.8",2);
WPSCfg.WpsConfigTimeout= new Scalar("WpsConfigTimeout","1.3.6.1.4.1.4115.1.20.1.1.3.30.9",2);
WPSCfg.WpsSTAPin= new Scalar("WpsSTAPin","1.3.6.1.4.1.4115.1.20.1.1.3.30.10",4);
WPSCfg.WpsPushButton= new Scalar("WpsPushButton","1.3.6.1.4.1.4115.1.20.1.1.3.30.11",2);
WPSCfg.WpsBoardNum= new Scalar("WpsBoardNum","1.3.6.1.4.1.4115.1.20.1.1.3.30.12",4);
WPSCfg.WpsModelNum= new Scalar("WpsModelNum","1.3.6.1.4.1.4115.1.20.1.1.3.30.13",4);
WPSCfg.WpsUUID= new Scalar("WpsUUID","1.3.6.1.4.1.4115.1.20.1.1.3.30.14",4);
var arWpsMode=WPSCfg.WpsMode;
var arWpsConfigState=WPSCfg.WpsConfigState;
var arWpsDevicePIN=WPSCfg.WpsDevicePIN;
var arWpsDeviceName=WPSCfg.WpsDeviceName;
var arWpsModelName=WPSCfg.WpsModelName;
var arWpsMfg=WPSCfg.WpsMfg;
var arWpsResultStatus=WPSCfg.WpsResultStatus;
var arWpsStatus=WPSCfg.WpsStatus;
var arWpsConfigTimeout=WPSCfg.WpsConfigTimeout;
var arWpsSTAPin=WPSCfg.WpsSTAPin;
var arWpsPushButton=WPSCfg.WpsPushButton;
var arWpsBoardNum=WPSCfg.WpsBoardNum;
var arWpsModelNum=WPSCfg.WpsModelNum;
var arWpsUUID=WPSCfg.WpsUUID;

var WPSCfgEx = new Container("WPSCfgEx", "1.3.6.1.4.1.4115.1.20.1.1.3.30.15");
WPSCfgEx.WpsMethodPin= new Scalar("WpsMethodPin","1.3.6.1.4.1.4115.1.20.1.1.3.30.15.2",2);
var arWpsMethodPin=WPSCfgEx.WpsMethodPin;


var WPS50Cfg = new Container("WPS50Cfg", "1.3.6.1.4.1.4115.1.20.1.1.3.65");
WPS50Cfg.Wps50Mode= new Scalar("Wps50Mode","1.3.6.1.4.1.4115.1.20.1.1.3.65.1",2);
WPS50Cfg.Wps50ConfigState= new Scalar("Wps50ConfigState","1.3.6.1.4.1.4115.1.20.1.1.3.65.2",2);
WPS50Cfg.Wps50DevicePIN= new Scalar("Wps50DevicePIN","1.3.6.1.4.1.4115.1.20.1.1.3.65.3",4,1);
WPS50Cfg.Wps50DeviceName= new Scalar("Wps50DeviceName","1.3.6.1.4.1.4115.1.20.1.1.3.65.4",4);
WPS50Cfg.Wps50ModelName= new Scalar("Wps50ModelName","1.3.6.1.4.1.4115.1.20.1.1.3.65.5",4);
WPS50Cfg.Wps50Mfg= new Scalar("Wps50Mfg","1.3.6.1.4.1.4115.1.20.1.1.3.65.6",4);
WPS50Cfg.Wps50ResultStatus= new Scalar("Wps50ResultStatus","1.3.6.1.4.1.4115.1.20.1.1.3.65.7",2);
WPS50Cfg.Wps50Status= new Scalar("Wps50Status","1.3.6.1.4.1.4115.1.20.1.1.3.65.8",2);
WPS50Cfg.Wps50ConfigTimeout= new Scalar("Wps50ConfigTimeout","1.3.6.1.4.1.4115.1.20.1.1.3.65.9",2);
WPS50Cfg.Wps50STAPin= new Scalar("Wps50STAPin","1.3.6.1.4.1.4115.1.20.1.1.3.65.10",4,1);
WPS50Cfg.Wps50PushButton= new Scalar("Wps50PushButton","1.3.6.1.4.1.4115.1.20.1.1.3.65.11",2);
WPS50Cfg.Wps50UUID= new Scalar("Wps50UUID","1.3.6.1.4.1.4115.1.20.1.1.3.65.14",4,1);
var arWps50Mode=WPS50Cfg.Wps50Mode;
var arWps50ConfigState=WPS50Cfg.Wps50ConfigState;
var arWps50DevicePIN=WPS50Cfg.Wps50DevicePIN;
var arWps50DeviceName=WPS50Cfg.Wps50DeviceName;
var arWps50ModelName=WPS50Cfg.Wps50ModelName;
var arWps50Mfg=WPS50Cfg.Wps50Mfg;
var arWps50ResultStatus=WPS50Cfg.Wps50ResultStatus;
var arWps50Status=WPS50Cfg.Wps50Status;
var arWps50ConfigTimeout=WPS50Cfg.Wps50ConfigTimeout;
var arWps50STAPin=WPS50Cfg.Wps50STAPin;
var arWps50PushButton=WPS50Cfg.Wps50PushButton;
var arWps50UUID=WPS50Cfg.Wps50UUID;

var WPS50CfgEx = new Container("WPSCfg", "1.3.6.1.4.1.4115.1.20.1.1.3.65.15");
WPS50CfgEx.WpsMethodPin= new Scalar("WpsMode","1.3.6.1.4.1.4115.1.20.1.1.3.65.15.2",2);
var arWps50MethodPin=WPS50CfgEx.WpsMethodPin;


var WDSCfg = new Container("WDSCfg", "1.3.6.1.4.1.4115.1.20.1.1.3.31");
WDSCfg.WDSEnable= new Scalar("WDSEnable","1.3.6.1.4.1.4115.1.20.1.1.3.31.1",2);
WDSCfg.WDSTableFreeIdx= new Scalar("WDSTableFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.3.31.2",2);
var arWDSEnable=WDSCfg.WDSEnable;
var arWDSTableFreeIdx=WDSCfg.WDSTableFreeIdx;

var WDSBridgeTable = new Table("WDSBridgeTable", "1.3.6.1.4.1.4115.1.20.1.1.3.31.3");
WDSBridgeTable.WDSBridgeIndex = new Column("WDSBridgeIndex","1.3.6.1.4.1.4115.1.20.1.1.3.31.3.1.1",2);
WDSBridgeTable.WDSBridgeAddr = new Column("WDSBridgeAddr","1.3.6.1.4.1.4115.1.20.1.1.3.31.3.1.2",4,1);
WDSBridgeTable.WDSBridgeStatus = new Column("WDSBridgeStatus","1.3.6.1.4.1.4115.1.20.1.1.3.31.3.1.3",2);
var arWDSBridgeIndex=WDSBridgeTable.WDSBridgeIndex;
var arWDSBridgeAddr=WDSBridgeTable.WDSBridgeAddr;
var arWDSBridgeStatus=WDSBridgeTable.WDSBridgeStatus;

var WiFiScan = new Container("WiFiScan", "1.3.6.1.4.1.4115.1.20.1.1.3.39");
WiFiScan.WiFiStartScan= new Scalar("WiFiStartScan","1.3.6.1.4.1.4115.1.20.1.1.3.39.1",2);
WiFiScan.WiFiScanResult= new Scalar("WiFiScanResult","1.3.6.1.4.1.4115.1.20.1.1.3.39.2",2);
var arWiFiStartScan=WiFiScan.WiFiStartScan;
var arWiFiScanResult=WiFiScan.WiFiScanResult;

var WiFiScanResultTable = new Table("WiFiScanResultTable", "1.3.6.1.4.1.4115.1.20.1.1.3.39.3");
WiFiScanResultTable.WiFiScanIndex = new Column("WiFiScanIndex","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.1",66);
WiFiScanResultTable.WiFiScanSSID = new Column("WiFiScanSSID","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.2",4,1);
WiFiScanResultTable.WiFiScanChannel = new Column("WiFiScanChannel","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.3",66);
WiFiScanResultTable.WiFiScanChannel2 = new Column("WiFiScanChannel2","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.4",66);
WiFiScanResultTable.WiFiScanRSSI = new Column("WiFiScanRSSI","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.5",2);
WiFiScanResultTable.WiFiScanNoise = new Column("WiFiScanNoise","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.6",2);
WiFiScanResultTable.WiFiScanMAC = new Column("WiFiScanMAC","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.7",4,1);
WiFiScanResultTable.WiFiScanMfg = new Column("WiFiScanMfg","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.8",4);
WiFiScanResultTable.WiFiScanSupportedRates = new Column("WiFiScanSupportedRates","1.3.6.1.4.1.4115.1.20.1.1.3.39.3.1.9",4);
var arWiFiScanIndex=WiFiScanResultTable.WiFiScanIndex;
var arWiFiScanSSID=WiFiScanResultTable.WiFiScanSSID;
var arWiFiScanChannel=WiFiScanResultTable.WiFiScanChannel;
var arWiFiScanChannel2=WiFiScanResultTable.WiFiScanChannel2;
var arWiFiScanRSSI=WiFiScanResultTable.WiFiScanRSSI;
var arWiFiScanNoise=WiFiScanResultTable.WiFiScanNoise;
var arWiFiScanMAC=WiFiScanResultTable.WiFiScanMAC;
var arWiFiScanMfg=WiFiScanResultTable.WiFiScanMfg;
var arWiFiScanSupportedRates=WiFiScanResultTable.WiFiScanSupportedRates;

var WiFiClientInfoTable = new Table("WiFiClientInfoTable", "1.3.6.1.4.1.4115.1.20.1.1.3.42");
WiFiClientInfoTable.WiFiClientInfoIndex = new Column("WiFiClientInfoIndex","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.1",2);
WiFiClientInfoTable.WiFiClientInfoIPAddrType = new Column("WiFiClientInfoIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.2",2);
WiFiClientInfoTable.WiFiClientInfoIPAddr = new Column("WiFiClientInfoIPAddr","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.3",4,1);
WiFiClientInfoTable.WiFiClientInfoIPAddrTextual = new Column("WiFiClientInfoIPAddrTextual","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.4",4);
WiFiClientInfoTable.WiFiClientInfoHostName = new Column("WiFiClientInfoHostName","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.5",4);
WiFiClientInfoTable.WiFiClientInfoMAC = new Column("WiFiClientInfoMAC","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.6",4,1);
WiFiClientInfoTable.WiFiClientInfoMACMfg = new Column("WiFiClientInfoMACMfg","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.7",4);
WiFiClientInfoTable.WiFiClientInfoStatus = new Column("WiFiClientInfoStatus","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.8",2);
WiFiClientInfoTable.WiFiClientInfoFirstSeen = new Column("WiFiClientInfoFirstSeen","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.9",4,1);
WiFiClientInfoTable.WiFiClientInfoLastSeen = new Column("WiFiClientInfoLastSeen","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.10",4,1);
WiFiClientInfoTable.WiFiClientInfoIdleTime = new Column("WiFiClientInfoIdleTime","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.11",2);
WiFiClientInfoTable.WiFiClientInfoInNetworkTime = new Column("WiFiClientInfoInNetworkTime","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.12",2);
WiFiClientInfoTable.WiFiClientInfoState = new Column("WiFiClientInfoState","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.13",4);
WiFiClientInfoTable.WiFiClientInfoFlags = new Column("WiFiClientInfoFlags","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.14",4,1);
WiFiClientInfoTable.WiFiClientInfoTxPkts = new Column("WiFiClientInfoTxPkts","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.15",2);
WiFiClientInfoTable.WiFiClientInfoTxFailures = new Column("WiFiClientInfoTxFailures","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.16",2);
WiFiClientInfoTable.WiFiClientInfoRxUnicastPkts = new Column("WiFiClientInfoRxUnicastPkts","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.17",2);
WiFiClientInfoTable.WiFiClientInfoRxMulticastPkts = new Column("WiFiClientInfoRxMulticastPkts","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.18",2);
WiFiClientInfoTable.WiFiClientInfoLastTxPktRate = new Column("WiFiClientInfoLastTxPktRate","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.19",2);
WiFiClientInfoTable.WiFiClientInfoLastRxPktRate = new Column("WiFiClientInfoLastRxPktRate","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.20",2);
WiFiClientInfoTable.WiFiClientInfoRateSet = new Column("WiFiClientInfoRateSet","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.21",4,1);
WiFiClientInfoTable.WiFiClientInfoRSSI = new Column("WiFiClientInfoRSSI","1.3.6.1.4.1.4115.1.20.1.1.3.42.1.22",2);
var arWiFiClientInfoIndex=WiFiClientInfoTable.WiFiClientInfoIndex;
var arWiFiClientInfoIPAddrType=WiFiClientInfoTable.WiFiClientInfoIPAddrType;
var arWiFiClientInfoIPAddr=WiFiClientInfoTable.WiFiClientInfoIPAddr;
var arWiFiClientInfoIPAddrTextual=WiFiClientInfoTable.WiFiClientInfoIPAddrTextual;
var arWiFiClientInfoHostName=WiFiClientInfoTable.WiFiClientInfoHostName;
var arWiFiClientInfoMAC=WiFiClientInfoTable.WiFiClientInfoMAC;
var arWiFiClientInfoMACMfg=WiFiClientInfoTable.WiFiClientInfoMACMfg;
var arWiFiClientInfoStatus=WiFiClientInfoTable.WiFiClientInfoStatus;
var arWiFiClientInfoFirstSeen=WiFiClientInfoTable.WiFiClientInfoFirstSeen;
var arWiFiClientInfoLastSeen=WiFiClientInfoTable.WiFiClientInfoLastSeen;
var arWiFiClientInfoIdleTime=WiFiClientInfoTable.WiFiClientInfoIdleTime;
var arWiFiClientInfoInNetworkTime=WiFiClientInfoTable.WiFiClientInfoInNetworkTime;
var arWiFiClientInfoState=WiFiClientInfoTable.WiFiClientInfoState;
var arWiFiClientInfoFlags=WiFiClientInfoTable.WiFiClientInfoFlags;
var arWiFiClientInfoTxPkts=WiFiClientInfoTable.WiFiClientInfoTxPkts;
var arWiFiClientInfoTxFailures=WiFiClientInfoTable.WiFiClientInfoTxFailures;
var arWiFiClientInfoRxUnicastPkts=WiFiClientInfoTable.WiFiClientInfoRxUnicastPkts;
var arWiFiClientInfoRxMulticastPkts=WiFiClientInfoTable.WiFiClientInfoRxMulticastPkts;
var arWiFiClientInfoLastTxPktRate=WiFiClientInfoTable.WiFiClientInfoLastTxPktRate;
var arWiFiClientInfoLastRxPktRate=WiFiClientInfoTable.WiFiClientInfoLastRxPktRate;
var arWiFiClientInfoRateSet=WiFiClientInfoTable.WiFiClientInfoRateSet;
var arWiFiClientInfoRSSI=WiFiClientInfoTable.WiFiClientInfoRSSI;

var AdvanceWirelessStats = new Container("AdvanceWirelessStats", "1.3.6.1.4.1.4115.1.20.1.1.3.46");
AdvanceWirelessStats.ResetCount= new Scalar("ResetCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.5",2);
AdvanceWirelessStats.TBTTCount= new Scalar("TBTTCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.6",2);
AdvanceWirelessStats.PMQOverflowCount= new Scalar("PMQOverflowCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.7",2);
AdvanceWirelessStats.PRTimeoutDropCount= new Scalar("PRTimeoutDropCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.8",2);
AdvanceWirelessStats.PSMWatchdogCount= new Scalar("PSMWatchdogCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.9",2);
AdvanceWirelessStats.PHYWatchdogCount= new Scalar("PHYWatchdogCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.10",2);
AdvanceWirelessStats.PRQEntriesHandled= new Scalar("PRQEntriesHandled","1.3.6.1.4.1.4115.1.20.1.1.3.46.11",2);
AdvanceWirelessStats.PRQUndirectedEntriesHandled= new Scalar("PRQUndirectedEntriesHandled","1.3.6.1.4.1.4115.1.20.1.1.3.46.12",2);
AdvanceWirelessStats.PRQBadEntriesHandled= new Scalar("PRQBadEntriesHandled","1.3.6.1.4.1.4115.1.20.1.1.3.46.13",2);
AdvanceWirelessStats.ATIMSuppressCount= new Scalar("ATIMSuppressCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.14",2);
AdvanceWirelessStats.BCNTemplateNotReadyCount= new Scalar("BCNTemplateNotReadyCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.15",2);
AdvanceWirelessStats.BCNTemplateNotReadyDoneCount= new Scalar("BCNTemplateNotReadyDoneCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.16",2);
AdvanceWirelessStats.LateTBTTDPCCount= new Scalar("LateTBTTDPCCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.17",2);
AdvanceWirelessStats.PktEngineUnicastRxFramesCount= new Scalar("PktEngineUnicastRxFramesCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.18",2);
AdvanceWirelessStats.PktEngineMulticastRxFramesCount= new Scalar("PktEngineMulticastRxFramesCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.19",2);
AdvanceWirelessStats.RadioDisablesCount= new Scalar("RadioDisablesCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.20",2);
AdvanceWirelessStats.BPHYGlitchCount= new Scalar("BPHYGlitchCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.21",2);
AdvanceWirelessStats.SGITransmitCount= new Scalar("SGITransmitCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.22",2);
AdvanceWirelessStats.SGIReceiveCount= new Scalar("SGIReceiveCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.23",2);
AdvanceWirelessStats.STBCTransmitCount= new Scalar("STBCTransmitCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.24",2);
AdvanceWirelessStats.STBCReceiveCount= new Scalar("STBCReceiveCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.25",2);
var arResetCount=AdvanceWirelessStats.ResetCount;
var arTBTTCount=AdvanceWirelessStats.TBTTCount;
var arPMQOverflowCount=AdvanceWirelessStats.PMQOverflowCount;
var arPRTimeoutDropCount=AdvanceWirelessStats.PRTimeoutDropCount;
var arPSMWatchdogCount=AdvanceWirelessStats.PSMWatchdogCount;
var arPHYWatchdogCount=AdvanceWirelessStats.PHYWatchdogCount;
var arPRQEntriesHandled=AdvanceWirelessStats.PRQEntriesHandled;
var arPRQUndirectedEntriesHandled=AdvanceWirelessStats.PRQUndirectedEntriesHandled;
var arPRQBadEntriesHandled=AdvanceWirelessStats.PRQBadEntriesHandled;
var arATIMSuppressCount=AdvanceWirelessStats.ATIMSuppressCount;
var arBCNTemplateNotReadyCount=AdvanceWirelessStats.BCNTemplateNotReadyCount;
var arBCNTemplateNotReadyDoneCount=AdvanceWirelessStats.BCNTemplateNotReadyDoneCount;
var arLateTBTTDPCCount=AdvanceWirelessStats.LateTBTTDPCCount;
var arPktEngineUnicastRxFramesCount=AdvanceWirelessStats.PktEngineUnicastRxFramesCount;
var arPktEngineMulticastRxFramesCount=AdvanceWirelessStats.PktEngineMulticastRxFramesCount;
var arRadioDisablesCount=AdvanceWirelessStats.RadioDisablesCount;
var arBPHYGlitchCount=AdvanceWirelessStats.BPHYGlitchCount;
var arSGITransmitCount=AdvanceWirelessStats.SGITransmitCount;
var arSGIReceiveCount=AdvanceWirelessStats.SGIReceiveCount;
var arSTBCTransmitCount=AdvanceWirelessStats.STBCTransmitCount;
var arSTBCReceiveCount=AdvanceWirelessStats.STBCReceiveCount;

var AdvanceWirelessStatsXmit = new Container("AdvanceWirelessStatsXmit", "1.3.6.1.4.1.4115.1.20.1.1.3.46.1");
AdvanceWirelessStatsXmit.TxFrameCount= new Scalar("TxFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.1",2);
AdvanceWirelessStatsXmit.TxBytesCount= new Scalar("TxBytesCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.2",2);
AdvanceWirelessStatsXmit.TxRetransmitCount= new Scalar("TxRetransmitCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.3",2);
AdvanceWirelessStatsXmit.TxErrorCount= new Scalar("TxErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.4",2);
AdvanceWirelessStatsXmit.TxMgmtFrames= new Scalar("TxMgmtFrames","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.5",2);
AdvanceWirelessStatsXmit.TxShortPreambleFrames= new Scalar("TxShortPreambleFrames","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.6",2);
AdvanceWirelessStatsXmit.TxStatusErrors= new Scalar("TxStatusErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.7",2);
AdvanceWirelessStatsXmit.TxOutOfBufsErrors= new Scalar("TxOutOfBufsErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.8",2);
AdvanceWirelessStatsXmit.TxNoAssocErrors= new Scalar("TxNoAssocErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.9",2);
AdvanceWirelessStatsXmit.TxRuntCount= new Scalar("TxRuntCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.10",2);
AdvanceWirelessStatsXmit.TxHeaderCacheHit= new Scalar("TxHeaderCacheHit","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.11",2);
AdvanceWirelessStatsXmit.TxHeaderCacheMiss= new Scalar("TxHeaderCacheMiss","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.12",2);
AdvanceWirelessStatsXmit.TxFIFOUnderflows= new Scalar("TxFIFOUnderflows","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.13",2);
AdvanceWirelessStatsXmit.TxPhyErrors= new Scalar("TxPhyErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.14",2);
AdvanceWirelessStatsXmit.TxPhyCRS= new Scalar("TxPhyCRS","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.15",2);
AdvanceWirelessStatsXmit.TxAllFrameCount= new Scalar("TxAllFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.16",2);
AdvanceWirelessStatsXmit.TxDMAWarCount= new Scalar("TxDMAWarCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.17",2);
AdvanceWirelessStatsXmit.TxRTSFrameCount= new Scalar("TxRTSFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.18",2);
AdvanceWirelessStatsXmit.TxCTSFrameCount= new Scalar("TxCTSFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.19",2);
AdvanceWirelessStatsXmit.TxAckFrameCount= new Scalar("TxAckFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.20",2);
AdvanceWirelessStatsXmit.TxDNLFrameCount= new Scalar("TxDNLFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.21",2);
AdvanceWirelessStatsXmit.TxBeaconFrameCount= new Scalar("TxBeaconFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.22",2);
AdvanceWirelessStatsXmit.TxUnderflowCount= new Scalar("TxUnderflowCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.23",4,1);
AdvanceWirelessStatsXmit.TxTemplateUnderflowCount= new Scalar("TxTemplateUnderflowCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.24",2);
AdvanceWirelessStatsXmit.TxBeaconsCanceledCount= new Scalar("TxBeaconsCanceledCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.25",2);
AdvanceWirelessStatsXmit.TxFIFOOverflows= new Scalar("TxFIFOOverflows","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.26",2);
AdvanceWirelessStatsXmit.TxPRFailures= new Scalar("TxPRFailures","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.27",2);
AdvanceWirelessStatsXmit.TxPRSuccess= new Scalar("TxPRSuccess","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.28",2);
AdvanceWirelessStatsXmit.TxAfterburnerNACKCount= new Scalar("TxAfterburnerNACKCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.29",2);
AdvanceWirelessStatsXmit.TxFragmentCount= new Scalar("TxFragmentCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.30",2);
AdvanceWirelessStatsXmit.TxMulticastCount= new Scalar("TxMulticastCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.31",2);
AdvanceWirelessStatsXmit.TxFailureCount= new Scalar("TxFailureCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.32",2);
AdvanceWirelessStatsXmit.TxRetryCount= new Scalar("TxRetryCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.33",2);
AdvanceWirelessStatsXmit.TxMultipleRetryCount= new Scalar("TxMultipleRetryCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.34",2);
AdvanceWirelessStatsXmit.TxRTSSuccessCount= new Scalar("TxRTSSuccessCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.35",2);
AdvanceWirelessStatsXmit.TxRTSFailCount= new Scalar("TxRTSFailCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.36",2);
AdvanceWirelessStatsXmit.TxAckFailCount= new Scalar("TxAckFailCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.37",2);
AdvanceWirelessStatsXmit.TxFrameCountDot11= new Scalar("TxFrameCountDot11","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.38",2);
AdvanceWirelessStatsXmit.TxChannelRejectFrameCount= new Scalar("TxChannelRejectFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.39",2);
AdvanceWirelessStatsXmit.TxTimerExpirationFrameCount= new Scalar("TxTimerExpirationFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.40",2);
AdvanceWirelessStatsXmit.TxGlitchNACKCount= new Scalar("TxGlitchNACKCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.1.41",2);
var arTxFrameCount=AdvanceWirelessStatsXmit.TxFrameCount;
var arTxBytesCount=AdvanceWirelessStatsXmit.TxBytesCount;
var arTxRetransmitCount=AdvanceWirelessStatsXmit.TxRetransmitCount;
var arTxErrorCount=AdvanceWirelessStatsXmit.TxErrorCount;
var arTxMgmtFrames=AdvanceWirelessStatsXmit.TxMgmtFrames;
var arTxShortPreambleFrames=AdvanceWirelessStatsXmit.TxShortPreambleFrames;
var arTxStatusErrors=AdvanceWirelessStatsXmit.TxStatusErrors;
var arTxOutOfBufsErrors=AdvanceWirelessStatsXmit.TxOutOfBufsErrors;
var arTxNoAssocErrors=AdvanceWirelessStatsXmit.TxNoAssocErrors;
var arTxRuntCount=AdvanceWirelessStatsXmit.TxRuntCount;
var arTxHeaderCacheHit=AdvanceWirelessStatsXmit.TxHeaderCacheHit;
var arTxHeaderCacheMiss=AdvanceWirelessStatsXmit.TxHeaderCacheMiss;
var arTxFIFOUnderflows=AdvanceWirelessStatsXmit.TxFIFOUnderflows;
var arTxPhyErrors=AdvanceWirelessStatsXmit.TxPhyErrors;
var arTxPhyCRS=AdvanceWirelessStatsXmit.TxPhyCRS;
var arTxAllFrameCount=AdvanceWirelessStatsXmit.TxAllFrameCount;
var arTxDMAWarCount=AdvanceWirelessStatsXmit.TxDMAWarCount;
var arTxRTSFrameCount=AdvanceWirelessStatsXmit.TxRTSFrameCount;
var arTxCTSFrameCount=AdvanceWirelessStatsXmit.TxCTSFrameCount;
var arTxAckFrameCount=AdvanceWirelessStatsXmit.TxAckFrameCount;
var arTxDNLFrameCount=AdvanceWirelessStatsXmit.TxDNLFrameCount;
var arTxBeaconFrameCount=AdvanceWirelessStatsXmit.TxBeaconFrameCount;
var arTxUnderflowCount=AdvanceWirelessStatsXmit.TxUnderflowCount;
var arTxTemplateUnderflowCount=AdvanceWirelessStatsXmit.TxTemplateUnderflowCount;
var arTxBeaconsCanceledCount=AdvanceWirelessStatsXmit.TxBeaconsCanceledCount;
var arTxFIFOOverflows=AdvanceWirelessStatsXmit.TxFIFOOverflows;
var arTxPRFailures=AdvanceWirelessStatsXmit.TxPRFailures;
var arTxPRSuccess=AdvanceWirelessStatsXmit.TxPRSuccess;
var arTxAfterburnerNACKCount=AdvanceWirelessStatsXmit.TxAfterburnerNACKCount;
var arTxFragmentCount=AdvanceWirelessStatsXmit.TxFragmentCount;
var arTxMulticastCount=AdvanceWirelessStatsXmit.TxMulticastCount;
var arTxFailureCount=AdvanceWirelessStatsXmit.TxFailureCount;
var arTxRetryCount=AdvanceWirelessStatsXmit.TxRetryCount;
var arTxMultipleRetryCount=AdvanceWirelessStatsXmit.TxMultipleRetryCount;
var arTxRTSSuccessCount=AdvanceWirelessStatsXmit.TxRTSSuccessCount;
var arTxRTSFailCount=AdvanceWirelessStatsXmit.TxRTSFailCount;
var arTxAckFailCount=AdvanceWirelessStatsXmit.TxAckFailCount;
var arTxFrameCountDot11=AdvanceWirelessStatsXmit.TxFrameCountDot11;
var arTxChannelRejectFrameCount=AdvanceWirelessStatsXmit.TxChannelRejectFrameCount;
var arTxTimerExpirationFrameCount=AdvanceWirelessStatsXmit.TxTimerExpirationFrameCount;
var arTxGlitchNACKCount=AdvanceWirelessStatsXmit.TxGlitchNACKCount;

var AdvanceWirelessStatsRecv = new Container("AdvanceWirelessStatsRecv", "1.3.6.1.4.1.4115.1.20.1.1.3.46.2");
AdvanceWirelessStatsRecv.RxFrame= new Scalar("RxFrame","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.1",2);
AdvanceWirelessStatsRecv.RxBytes= new Scalar("RxBytes","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.2",2);
AdvanceWirelessStatsRecv.RxError= new Scalar("RxError","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.3",2);
AdvanceWirelessStatsRecv.RxCtl= new Scalar("RxCtl","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.4",2);
AdvanceWirelessStatsRecv.RxNoBufs= new Scalar("RxNoBufs","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.5",2);
AdvanceWirelessStatsRecv.RxNonDataErrors= new Scalar("RxNonDataErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.6",2);
AdvanceWirelessStatsRecv.RxBadDSErrors= new Scalar("RxBadDSErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.7",2);
AdvanceWirelessStatsRecv.RxBadCMErrors= new Scalar("RxBadCMErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.8",2);
AdvanceWirelessStatsRecv.RxFragErrors= new Scalar("RxFragErrors","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.9",2);
AdvanceWirelessStatsRecv.RxRuntCount= new Scalar("RxRuntCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.10",2);
AdvanceWirelessStatsRecv.RxGiantCount= new Scalar("RxGiantCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.11",2);
AdvanceWirelessStatsRecv.RxNoSCBErrorCount= new Scalar("RxNoSCBErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.12",2);
AdvanceWirelessStatsRecv.RxBadProtoErrorCount= new Scalar("RxBadProtoErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.13",2);
AdvanceWirelessStatsRecv.RxBadSrcMACErrorCount= new Scalar("RxBadSrcMACErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.14",2);
AdvanceWirelessStatsRecv.RxBadDAErrorCount= new Scalar("RxBadDAErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.15",2);
AdvanceWirelessStatsRecv.RxFilterCount= new Scalar("RxFilterCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.16",2);
AdvanceWirelessStatsRecv.RxUnderflowCount= new Scalar("RxUnderflowCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.17",4,1);
AdvanceWirelessStatsRecv.RxFrameTooLongCount= new Scalar("RxFrameTooLongCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.18",2);
AdvanceWirelessStatsRecv.RxFrameTooShortCount= new Scalar("RxFrameTooShortCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.19",2);
AdvanceWirelessStatsRecv.RxBadHeaderCount= new Scalar("RxBadHeaderCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.20",2);
AdvanceWirelessStatsRecv.RxBadFCSCount= new Scalar("RxBadFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.21",2);
AdvanceWirelessStatsRecv.RxBadPLCPCount= new Scalar("RxBadPLCPCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.22",2);
AdvanceWirelessStatsRecv.RxRSGlitchCount= new Scalar("RxRSGlitchCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.23",2);
AdvanceWirelessStatsRecv.RxGoodPLCPCount= new Scalar("RxGoodPLCPCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.24",2);
AdvanceWirelessStatsRecv.RxDataGoodFCSCount= new Scalar("RxDataGoodFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.25",2);
AdvanceWirelessStatsRecv.RxMgmtGoodFCSCount= new Scalar("RxMgmtGoodFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.26",2);
AdvanceWirelessStatsRecv.RxControlGoodFCSCount= new Scalar("RxControlGoodFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.27",2);
AdvanceWirelessStatsRecv.RxRTSGoodFCSCount= new Scalar("RxRTSGoodFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.28",2);
AdvanceWirelessStatsRecv.RxCTSGoodFCSCount= new Scalar("RxCTSGoodFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.29",2);
AdvanceWirelessStatsRecv.RxAcksGoodFCSCount= new Scalar("RxAcksGoodFCSCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.30",2);
AdvanceWirelessStatsRecv.RxDataGoodFCSNoRACount= new Scalar("RxDataGoodFCSNoRACount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.31",2);
AdvanceWirelessStatsRecv.RxMgmtGoodFCSNoRACount= new Scalar("RxMgmtGoodFCSNoRACount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.32",2);
AdvanceWirelessStatsRecv.RxCTRLGoodFCSNoRACount= new Scalar("RxCTRLGoodFCSNoRACount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.33",2);
AdvanceWirelessStatsRecv.RxRTSNoMACCount= new Scalar("RxRTSNoMACCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.34",2);
AdvanceWirelessStatsRecv.RxCTSNoMACCount= new Scalar("RxCTSNoMACCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.35",2);
AdvanceWirelessStatsRecv.RxMulticastDataCount= new Scalar("RxMulticastDataCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.36",2);
AdvanceWirelessStatsRecv.RxMulticastMgmtCount= new Scalar("RxMulticastMgmtCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.37",2);
AdvanceWirelessStatsRecv.RxMulticastCtlCount= new Scalar("RxMulticastCtlCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.38",2);
AdvanceWirelessStatsRecv.RxMemberBeaconCount= new Scalar("RxMemberBeaconCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.39",2);
AdvanceWirelessStatsRecv.RxWDSFrameCount= new Scalar("RxWDSFrameCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.40",2);
AdvanceWirelessStatsRecv.RxOtherBeaconCount= new Scalar("RxOtherBeaconCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.41",2);
AdvanceWirelessStatsRecv.RxTimeoutsCount= new Scalar("RxTimeoutsCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.42",2);
AdvanceWirelessStatsRecv.RxFiFoZeroOverflows= new Scalar("RxFiFoZeroOverflows","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.43",2);
AdvanceWirelessStatsRecv.RxFiFoOneOverflows= new Scalar("RxFiFoOneOverflows","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.44",2);
AdvanceWirelessStatsRecv.RxFiFoTwoOverflows= new Scalar("RxFiFoTwoOverflows","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.45",2);
AdvanceWirelessStatsRecv.RxPRQFIFOCount= new Scalar("RxPRQFIFOCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.46",2);
AdvanceWirelessStatsRecv.RxPRQOverflowCount= new Scalar("RxPRQOverflowCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.47",2);
AdvanceWirelessStatsRecv.RxAfterburnerNACKCount= new Scalar("RxAfterburnerNACKCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.48",2);
AdvanceWirelessStatsRecv.RxAfterburnerConsumedCount= new Scalar("RxAfterburnerConsumedCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.49",2);
AdvanceWirelessStatsRecv.RxFrameDuplicateCount= new Scalar("RxFrameDuplicateCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.50",2);
AdvanceWirelessStatsRecv.RxFragmentCount= new Scalar("RxFragmentCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.51",2);
AdvanceWirelessStatsRecv.RxMulticastCount= new Scalar("RxMulticastCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.52",2);
AdvanceWirelessStatsRecv.RxFCSErrorCount= new Scalar("RxFCSErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.2.53",2);
var arRxFrame=AdvanceWirelessStatsRecv.RxFrame;
var arRxBytes=AdvanceWirelessStatsRecv.RxBytes;
var arRxError=AdvanceWirelessStatsRecv.RxError;
var arRxCtl=AdvanceWirelessStatsRecv.RxCtl;
var arRxNoBufs=AdvanceWirelessStatsRecv.RxNoBufs;
var arRxNonDataErrors=AdvanceWirelessStatsRecv.RxNonDataErrors;
var arRxBadDSErrors=AdvanceWirelessStatsRecv.RxBadDSErrors;
var arRxBadCMErrors=AdvanceWirelessStatsRecv.RxBadCMErrors;
var arRxFragErrors=AdvanceWirelessStatsRecv.RxFragErrors;
var arRxRuntCount=AdvanceWirelessStatsRecv.RxRuntCount;
var arRxGiantCount=AdvanceWirelessStatsRecv.RxGiantCount;
var arRxNoSCBErrorCount=AdvanceWirelessStatsRecv.RxNoSCBErrorCount;
var arRxBadProtoErrorCount=AdvanceWirelessStatsRecv.RxBadProtoErrorCount;
var arRxBadSrcMACErrorCount=AdvanceWirelessStatsRecv.RxBadSrcMACErrorCount;
var arRxBadDAErrorCount=AdvanceWirelessStatsRecv.RxBadDAErrorCount;
var arRxFilterCount=AdvanceWirelessStatsRecv.RxFilterCount;
var arRxUnderflowCount=AdvanceWirelessStatsRecv.RxUnderflowCount;
var arRxFrameTooLongCount=AdvanceWirelessStatsRecv.RxFrameTooLongCount;
var arRxFrameTooShortCount=AdvanceWirelessStatsRecv.RxFrameTooShortCount;
var arRxBadHeaderCount=AdvanceWirelessStatsRecv.RxBadHeaderCount;
var arRxBadFCSCount=AdvanceWirelessStatsRecv.RxBadFCSCount;
var arRxBadPLCPCount=AdvanceWirelessStatsRecv.RxBadPLCPCount;
var arRxRSGlitchCount=AdvanceWirelessStatsRecv.RxRSGlitchCount;
var arRxGoodPLCPCount=AdvanceWirelessStatsRecv.RxGoodPLCPCount;
var arRxDataGoodFCSCount=AdvanceWirelessStatsRecv.RxDataGoodFCSCount;
var arRxMgmtGoodFCSCount=AdvanceWirelessStatsRecv.RxMgmtGoodFCSCount;
var arRxControlGoodFCSCount=AdvanceWirelessStatsRecv.RxControlGoodFCSCount;
var arRxRTSGoodFCSCount=AdvanceWirelessStatsRecv.RxRTSGoodFCSCount;
var arRxCTSGoodFCSCount=AdvanceWirelessStatsRecv.RxCTSGoodFCSCount;
var arRxAcksGoodFCSCount=AdvanceWirelessStatsRecv.RxAcksGoodFCSCount;
var arRxDataGoodFCSNoRACount=AdvanceWirelessStatsRecv.RxDataGoodFCSNoRACount;
var arRxMgmtGoodFCSNoRACount=AdvanceWirelessStatsRecv.RxMgmtGoodFCSNoRACount;
var arRxCTRLGoodFCSNoRACount=AdvanceWirelessStatsRecv.RxCTRLGoodFCSNoRACount;
var arRxRTSNoMACCount=AdvanceWirelessStatsRecv.RxRTSNoMACCount;
var arRxCTSNoMACCount=AdvanceWirelessStatsRecv.RxCTSNoMACCount;
var arRxMulticastDataCount=AdvanceWirelessStatsRecv.RxMulticastDataCount;
var arRxMulticastMgmtCount=AdvanceWirelessStatsRecv.RxMulticastMgmtCount;
var arRxMulticastCtlCount=AdvanceWirelessStatsRecv.RxMulticastCtlCount;
var arRxMemberBeaconCount=AdvanceWirelessStatsRecv.RxMemberBeaconCount;
var arRxWDSFrameCount=AdvanceWirelessStatsRecv.RxWDSFrameCount;
var arRxOtherBeaconCount=AdvanceWirelessStatsRecv.RxOtherBeaconCount;
var arRxTimeoutsCount=AdvanceWirelessStatsRecv.RxTimeoutsCount;
var arRxFiFoZeroOverflows=AdvanceWirelessStatsRecv.RxFiFoZeroOverflows;
var arRxFiFoOneOverflows=AdvanceWirelessStatsRecv.RxFiFoOneOverflows;
var arRxFiFoTwoOverflows=AdvanceWirelessStatsRecv.RxFiFoTwoOverflows;
var arRxPRQFIFOCount=AdvanceWirelessStatsRecv.RxPRQFIFOCount;
var arRxPRQOverflowCount=AdvanceWirelessStatsRecv.RxPRQOverflowCount;
var arRxAfterburnerNACKCount=AdvanceWirelessStatsRecv.RxAfterburnerNACKCount;
var arRxAfterburnerConsumedCount=AdvanceWirelessStatsRecv.RxAfterburnerConsumedCount;
var arRxFrameDuplicateCount=AdvanceWirelessStatsRecv.RxFrameDuplicateCount;
var arRxFragmentCount=AdvanceWirelessStatsRecv.RxFragmentCount;
var arRxMulticastCount=AdvanceWirelessStatsRecv.RxMulticastCount;
var arRxFCSErrorCount=AdvanceWirelessStatsRecv.RxFCSErrorCount;

var AdvanceWirelessStatsEncrypt = new Container("AdvanceWirelessStatsEncrypt", "1.3.6.1.4.1.4115.1.20.1.1.3.46.3");
AdvanceWirelessStatsEncrypt.WEPUndecryptableCount= new Scalar("WEPUndecryptableCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.1",2);
AdvanceWirelessStatsEncrypt.TKIPLocalMICFailureCount= new Scalar("TKIPLocalMICFailureCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.2",2);
AdvanceWirelessStatsEncrypt.TKIPCounterMeasuresInvoked= new Scalar("TKIPCounterMeasuresInvoked","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.3",2);
AdvanceWirelessStatsEncrypt.TKIPReplayCount= new Scalar("TKIPReplayCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.4",2);
AdvanceWirelessStatsEncrypt.AESFormatErrorCount= new Scalar("AESFormatErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.5",2);
AdvanceWirelessStatsEncrypt.AESReplaysCount= new Scalar("AESReplaysCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.6",2);
AdvanceWirelessStatsEncrypt.AESDecryptErrorCount= new Scalar("AESDecryptErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.7",2);
AdvanceWirelessStatsEncrypt.FourWayHandshakeFails= new Scalar("FourWayHandshakeFails","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.8",2);
AdvanceWirelessStatsEncrypt.WEPPICVErrorCount= new Scalar("WEPPICVErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.9",2);
AdvanceWirelessStatsEncrypt.DecryptSuccessCount= new Scalar("DecryptSuccessCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.10",2);
AdvanceWirelessStatsEncrypt.TKIPPICVErrorCount= new Scalar("TKIPPICVErrorCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.11",2);
AdvanceWirelessStatsEncrypt.WEPExcludedCount= new Scalar("WEPExcludedCount","1.3.6.1.4.1.4115.1.20.1.1.3.46.3.12",2);
var arWEPUndecryptableCount=AdvanceWirelessStatsEncrypt.WEPUndecryptableCount;
var arTKIPLocalMICFailureCount=AdvanceWirelessStatsEncrypt.TKIPLocalMICFailureCount;
var arTKIPCounterMeasuresInvoked=AdvanceWirelessStatsEncrypt.TKIPCounterMeasuresInvoked;
var arTKIPReplayCount=AdvanceWirelessStatsEncrypt.TKIPReplayCount;
var arAESFormatErrorCount=AdvanceWirelessStatsEncrypt.AESFormatErrorCount;
var arAESReplaysCount=AdvanceWirelessStatsEncrypt.AESReplaysCount;
var arAESDecryptErrorCount=AdvanceWirelessStatsEncrypt.AESDecryptErrorCount;
var arFourWayHandshakeFails=AdvanceWirelessStatsEncrypt.FourWayHandshakeFails;
var arWEPPICVErrorCount=AdvanceWirelessStatsEncrypt.WEPPICVErrorCount;
var arDecryptSuccessCount=AdvanceWirelessStatsEncrypt.DecryptSuccessCount;
var arTKIPPICVErrorCount=AdvanceWirelessStatsEncrypt.TKIPPICVErrorCount;
var arWEPExcludedCount=AdvanceWirelessStatsEncrypt.WEPExcludedCount;

var AdvanceWirelessStatsRateStats = new Container("AdvanceWirelessStatsRateStats", "1.3.6.1.4.1.4115.1.20.1.1.3.46.4");
AdvanceWirelessStatsRateStats.PacketsRcv1Mbps= new Scalar("PacketsRcv1Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.1",2);
AdvanceWirelessStatsRateStats.PacketsRcv2Mbps= new Scalar("PacketsRcv2Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.2",2);
AdvanceWirelessStatsRateStats.PacketsRcv5HalfMbps= new Scalar("PacketsRcv5HalfMbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.3",2);
AdvanceWirelessStatsRateStats.PacketsRcv6Mbps= new Scalar("PacketsRcv6Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.4",2);
AdvanceWirelessStatsRateStats.PacketsRcv9Mbps= new Scalar("PacketsRcv9Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.5",2);
AdvanceWirelessStatsRateStats.PacketsRcv11Mbps= new Scalar("PacketsRcv11Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.6",2);
AdvanceWirelessStatsRateStats.PacketsRcv12Mbps= new Scalar("PacketsRcv12Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.7",2);
AdvanceWirelessStatsRateStats.PacketsRcv18Mbps= new Scalar("PacketsRcv18Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.8",2);
AdvanceWirelessStatsRateStats.PacketsRcv24Mbps= new Scalar("PacketsRcv24Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.9",2);
AdvanceWirelessStatsRateStats.PacketsRcv36Mbps= new Scalar("PacketsRcv36Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.10",2);
AdvanceWirelessStatsRateStats.PacketsRcv48Mbps= new Scalar("PacketsRcv48Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.11",2);
AdvanceWirelessStatsRateStats.PacketsRcv54Mbps= new Scalar("PacketsRcv54Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.12",2);
AdvanceWirelessStatsRateStats.PacketsRcv108Mbps= new Scalar("PacketsRcv108Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.13",2);
AdvanceWirelessStatsRateStats.PacketsRcv162Mbps= new Scalar("PacketsRcv162Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.14",2);
AdvanceWirelessStatsRateStats.PacketsRcv216Mbps= new Scalar("PacketsRcv216Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.15",2);
AdvanceWirelessStatsRateStats.PacketsRcv270Mbps= new Scalar("PacketsRcv270Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.16",2);
AdvanceWirelessStatsRateStats.PacketsRcv324Mbps= new Scalar("PacketsRcv324Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.17",2);
AdvanceWirelessStatsRateStats.PacketsRcv378Mbps= new Scalar("PacketsRcv378Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.18",2);
AdvanceWirelessStatsRateStats.PacketsRcv432Mbps= new Scalar("PacketsRcv432Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.19",2);
AdvanceWirelessStatsRateStats.PacketsRcv486Mbps= new Scalar("PacketsRcv486Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.20",2);
AdvanceWirelessStatsRateStats.PacketsRcv540Mbps= new Scalar("PacketsRcv540Mbps","1.3.6.1.4.1.4115.1.20.1.1.3.46.4.21",2);
var arPacketsRcv1Mbps=AdvanceWirelessStatsRateStats.PacketsRcv1Mbps;
var arPacketsRcv2Mbps=AdvanceWirelessStatsRateStats.PacketsRcv2Mbps;
var arPacketsRcv5HalfMbps=AdvanceWirelessStatsRateStats.PacketsRcv5HalfMbps;
var arPacketsRcv6Mbps=AdvanceWirelessStatsRateStats.PacketsRcv6Mbps;
var arPacketsRcv9Mbps=AdvanceWirelessStatsRateStats.PacketsRcv9Mbps;
var arPacketsRcv11Mbps=AdvanceWirelessStatsRateStats.PacketsRcv11Mbps;
var arPacketsRcv12Mbps=AdvanceWirelessStatsRateStats.PacketsRcv12Mbps;
var arPacketsRcv18Mbps=AdvanceWirelessStatsRateStats.PacketsRcv18Mbps;
var arPacketsRcv24Mbps=AdvanceWirelessStatsRateStats.PacketsRcv24Mbps;
var arPacketsRcv36Mbps=AdvanceWirelessStatsRateStats.PacketsRcv36Mbps;
var arPacketsRcv48Mbps=AdvanceWirelessStatsRateStats.PacketsRcv48Mbps;
var arPacketsRcv54Mbps=AdvanceWirelessStatsRateStats.PacketsRcv54Mbps;
var arPacketsRcv108Mbps=AdvanceWirelessStatsRateStats.PacketsRcv108Mbps;
var arPacketsRcv162Mbps=AdvanceWirelessStatsRateStats.PacketsRcv162Mbps;
var arPacketsRcv216Mbps=AdvanceWirelessStatsRateStats.PacketsRcv216Mbps;
var arPacketsRcv270Mbps=AdvanceWirelessStatsRateStats.PacketsRcv270Mbps;
var arPacketsRcv324Mbps=AdvanceWirelessStatsRateStats.PacketsRcv324Mbps;
var arPacketsRcv378Mbps=AdvanceWirelessStatsRateStats.PacketsRcv378Mbps;
var arPacketsRcv432Mbps=AdvanceWirelessStatsRateStats.PacketsRcv432Mbps;
var arPacketsRcv486Mbps=AdvanceWirelessStatsRateStats.PacketsRcv486Mbps;
var arPacketsRcv540Mbps=AdvanceWirelessStatsRateStats.PacketsRcv540Mbps;

var FWCfg = new Container("FWCfg", "1.3.6.1.4.1.4115.1.20.1.1.4");
FWCfg.FWEnabled= new Scalar("FWEnabled","1.3.6.1.4.1.4115.1.20.1.1.4.1",2);
FWCfg.FWVirtSrvClear= new Scalar("FWVirtSrvClear","1.3.6.1.4.1.4115.1.20.1.1.4.2",2);
FWCfg.FWIPFilterClear= new Scalar("FWIPFilterClear","1.3.6.1.4.1.4115.1.20.1.1.4.3",2);
FWCfg.FWMACFilterClear= new Scalar("FWMACFilterClear","1.3.6.1.4.1.4115.1.20.1.1.4.4",2);
FWCfg.FWPortTrigClear= new Scalar("FWPortTrigClear","1.3.6.1.4.1.4115.1.20.1.1.4.5",2);
FWCfg.FWEnableDMZ= new Scalar("FWEnableDMZ","1.3.6.1.4.1.4115.1.20.1.1.4.6",2);
FWCfg.FWIPAddrTypeDMZ= new Scalar("FWIPAddrTypeDMZ","1.3.6.1.4.1.4115.1.20.1.1.4.7",2);
FWCfg.FWIPAddrDMZ= new Scalar("FWIPAddrDMZ","1.3.6.1.4.1.4115.1.20.1.1.4.8",4, 1);
FWCfg.FWSecurityLevel= new Scalar("FWSecurityLevel","1.3.6.1.4.1.4115.1.20.1.1.4.9",2);
FWCfg.FWApplySettings= new Scalar("FWApplySettings","1.3.6.1.4.1.4115.1.20.1.1.4.10",2);
FWCfg.FWAllowAll= new Scalar("FWAllowAll","1.3.6.1.4.1.4115.1.20.1.1.4.14",2);
FWCfg.FWAllowICMP= new Scalar("FWAllowICMP","1.3.6.1.4.1.4115.1.20.1.1.4.21",2);
FWCfg.FWResetDefaults= new Scalar("FWResetDefaults","1.3.6.1.4.1.4115.1.20.1.1.4.22",2);
FWCfg.FWBlockHTTP= new Scalar("FWBlockHTTP","1.3.6.1.4.1.4115.1.20.1.1.4.23",2);
FWCfg.FWBlockP2P= new Scalar("FWBlockP2P","1.3.6.1.4.1.4115.1.20.1.1.4.24",2);
FWCfg.FWBlockIdent= new Scalar("FWBlockIdent","1.3.6.1.4.1.4115.1.20.1.1.4.25",2);
FWCfg.FWBlockICMP= new Scalar("FWBlockICMP","1.3.6.1.4.1.4115.1.20.1.1.4.26",2);
FWCfg.FWBlockMulticast= new Scalar("FWBlockMulticast","1.3.6.1.4.1.4115.1.20.1.1.4.27",2);
FWCfg.FWVSSrcPortExclude= new Scalar("FWVSSrcPortExclude","1.3.6.1.4.1.4115.1.20.1.1.4.28",4);
FWCfg.FWVSDestPortExclude= new Scalar("FWVSDestPortExclude","1.3.6.1.4.1.4115.1.20.1.1.4.29",4);
FWCfg.FWEnableNow= new Scalar("FWEnableNow","1.3.6.1.4.1.4115.1.20.1.1.4.30",2);
FWCfg.FWAllowDestPorts= new Scalar("FWAllowDestPorts","1.3.6.1.4.1.4115.1.20.1.1.4.31",4);
FWCfg.FWVirtSrvTableEnabled= new Scalar("FWVirtSrvTableEnabled","1.3.6.1.4.1.4115.1.20.1.1.4.32",2);
FWCfg.FWPortTrigTableEnabled= new Scalar("FWPortTrigTableEnabled","1.3.6.1.4.1.4115.1.20.1.1.4.33",2);
// scm {
FWCfg.FWIPv6AddrDMZ= new Scalar("arFWIPv6AddrDMZ","1.3.6.1.4.1.4115.1.20.1.1.4.39",4, 1);
// scm }
var arFWEnabled=FWCfg.FWEnabled;
var arFWVirtSrvClear=FWCfg.FWVirtSrvClear;
var arFWIPFilterClear=FWCfg.FWIPFilterClear;
var arFWMACFilterClear=FWCfg.FWMACFilterClear;
var arFWPortTrigClear=FWCfg.FWPortTrigClear;
var arFWEnableDMZ=FWCfg.FWEnableDMZ;
var arFWIPAddrTypeDMZ=FWCfg.FWIPAddrTypeDMZ;
var arFWIPAddrDMZ=FWCfg.FWIPAddrDMZ;
var arFWSecurityLevel=FWCfg.FWSecurityLevel;
var arFWApplySettings=FWCfg.FWApplySettings;
var arFWAllowAll=FWCfg.FWAllowAll;
var arFWAllowICMP=FWCfg.FWAllowICMP;
var arFWResetDefaults=FWCfg.FWResetDefaults;
var arFWBlockHTTP=FWCfg.FWBlockHTTP;
var arFWBlockP2P=FWCfg.FWBlockP2P;
var arFWBlockIdent=FWCfg.FWBlockIdent;
var arFWBlockICMP=FWCfg.FWBlockICMP;
var arFWBlockMulticast=FWCfg.FWBlockMulticast;
var arFWVSSrcPortExclude=FWCfg.FWVSSrcPortExclude;
var arFWVSDestPortExclude=FWCfg.FWVSDestPortExclude;
var arFWEnableNow=FWCfg.FWEnableNow;
var arFWAllowDestPorts=FWCfg.FWAllowDestPorts;
var arFWVirtSrvTableEnabled=FWCfg.FWVirtSrvTableEnabled;
var arFWPortTrigTableEnabled=FWCfg.FWPortTrigTableEnabled;
// scm start
var arFWIPv6AddrDMZ=FWCfg.FWIPv6AddrDMZ;

var FWVirtSrvTable = new Table("FWVirtSrvTable", "1.3.6.1.4.1.4115.1.20.1.1.4.12");
FWVirtSrvTable.FWVirtSrvIndex = new Column("FWVirtSrvIndex","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.1",66);
FWVirtSrvTable.FWVirtSrvDesc = new Column("FWVirtSrvDesc","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.2",4);
FWVirtSrvTable.FWVirtSrvPortStart = new Column("FWVirtSrvPortStart","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.3",66);
FWVirtSrvTable.FWVirtSrvPortEnd = new Column("FWVirtSrvPortEnd","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.4",66);
FWVirtSrvTable.FWVirtSrvProtoType = new Column("FWVirtSrvProtoType","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.5",2);
FWVirtSrvTable.FWVirtSrvIPAddrType = new Column("FWVirtSrvIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.6",2);
FWVirtSrvTable.FWVirtSrvIPAddr = new Column("FWVirtSrvIPAddr","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.7",4, 1);
FWVirtSrvTable.FWVirtSrvTOD = new Column("FWVirtSrvTOD","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.8",2);
FWVirtSrvTable.FWVirtSrvLocalPortStart = new Column("FWVirtSrvLocalPortStart","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.9",66);
FWVirtSrvTable.FWVirtSrvLocalPortEnd = new Column("FWVirtSrvLocalPortEnd","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.10",66);
FWVirtSrvTable.FWVirtSrvRowStatus = new Column("FWVirtSrvRowStatus","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.11",2);
// scm start
FWVirtSrvTable.FWVirtSrvIPv6AddrType = new Column("arFWVirtSrvActive","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.12",2);
FWVirtSrvTable.FWVirtSrvIPv6Addr = new Column("arFWVirtSrvIPv6Addr","1.3.6.1.4.1.4115.1.20.1.1.4.12.1.13",4);
// scm end
var arFWVirtSrvIndex=FWVirtSrvTable.FWVirtSrvIndex;
var arFWVirtSrvDesc=FWVirtSrvTable.FWVirtSrvDesc;
var arFWVirtSrvPortStart=FWVirtSrvTable.FWVirtSrvPortStart;
var arFWVirtSrvPortEnd=FWVirtSrvTable.FWVirtSrvPortEnd;
var arFWVirtSrvProtoType=FWVirtSrvTable.FWVirtSrvProtoType;
var arFWVirtSrvIPAddrType=FWVirtSrvTable.FWVirtSrvIPAddrType;
var arFWVirtSrvIPAddr=FWVirtSrvTable.FWVirtSrvIPAddr;
var arFWVirtSrvTOD=FWVirtSrvTable.FWVirtSrvTOD;
var arFWVirtSrvLocalPortStart=FWVirtSrvTable.FWVirtSrvLocalPortStart;
var arFWVirtSrvLocalPortEnd=FWVirtSrvTable.FWVirtSrvLocalPortEnd;
var arFWVirtSrvRowStatus=FWVirtSrvTable.FWVirtSrvRowStatus;
var FWVirtSrvIPv6AddrType=FWVirtSrvTable.FWVirtSrvIPv6AddrType;
var arFWVirtSrvIPv6Addr=FWVirtSrvTable.FWVirtSrvIPv6Addr;

var FWIPFilterTable = new Table("FWIPFilterTable", "1.3.6.1.4.1.4115.1.20.1.1.4.13");
FWIPFilterTable.FWIPFilterIndex = new Column("FWIPFilterIndex","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.1",66);
FWIPFilterTable.FWIPFilterDesc = new Column("FWIPFilterDesc","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.2",4);
FWIPFilterTable.FWIPFilterStartType = new Column("FWIPFilterStartType","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.3",2);
FWIPFilterTable.FWIPFilterStartAddr = new Column("FWIPFilterStartAddr","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.4",4, 1);
FWIPFilterTable.FWIPFilterEndType = new Column("FWIPFilterEndType","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.5",2);
FWIPFilterTable.FWIPFilterEndAddr = new Column("FWIPFilterEndAddr","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.6",4, 1);
FWIPFilterTable.FWIPFilterPortStart = new Column("FWIPFilterPortStart","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.7",66);
FWIPFilterTable.FWIPFilterPortEnd = new Column("FWIPFilterPortEnd","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.8",66);
FWIPFilterTable.FWIPFilterProtoType = new Column("FWIPFilterProtoType","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.9",2);
FWIPFilterTable.FWIPFilterTOD = new Column("FWIPFilterTOD","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.10",2);
FWIPFilterTable.FWIPFilterRowStatus = new Column("FWIPFilterRowStatus","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.11",2);
FWIPFilterTable.FWIPFilterAction = new Column("FWIPFilterAction","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.12",2);
FWIPFilterTable.FWIPFilterDirection = new Column("FWIPFilterDirection","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.13",2);
FWIPFilterTable.FWIPFilterStartMin = new Column("FWIPFilterStartMin","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.14",2);
FWIPFilterTable.FWIPFilterEndMin = new Column("FWIPFilterEndMin","1.3.6.1.4.1.4115.1.20.1.1.4.13.1.15",2);

var arFWIPFilterIndex=FWIPFilterTable.FWIPFilterIndex;
var arFWIPFilterDesc=FWIPFilterTable.FWIPFilterDesc;
var arFWIPFilterStartType=FWIPFilterTable.FWIPFilterStartType;
var arFWIPFilterStartAddr=FWIPFilterTable.FWIPFilterStartAddr;
var arFWIPFilterEndType=FWIPFilterTable.FWIPFilterEndType;
var arFWIPFilterEndAddr=FWIPFilterTable.FWIPFilterEndAddr;
var arFWIPFilterPortStart=FWIPFilterTable.FWIPFilterPortStart;
var arFWIPFilterPortEnd=FWIPFilterTable.FWIPFilterPortEnd;
var arFWIPFilterProtoType=FWIPFilterTable.FWIPFilterProtoType;
var arFWIPFilterTOD=FWIPFilterTable.FWIPFilterTOD;
var arFWIPFilterRowStatus=FWIPFilterTable.FWIPFilterRowStatus;
var arFWIPFilterAction=FWIPFilterTable.FWIPFilterAction;
var arFWIPFilterDirection=FWIPFilterTable.FWIPFilterDirection;
var arFWIPFilterStartMin=FWIPFilterTable.FWIPFilterStartMin;
var arFWIPFilterEndMin=FWIPFilterTable.FWIPFilterEndMin;

var FWMACFilterTable = new Table("FWMACFilterTable", "1.3.6.1.4.1.4115.1.20.1.1.4.15");
FWMACFilterTable.FWMACFilterIndex = new Column("FWMACFilterIndex","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.1",66);
FWMACFilterTable.FWMACFilterAddr = new Column("FWMACFilterAddr","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.2",4, 1);
FWMACFilterTable.FWMACFilterTOD = new Column("FWMACFilterTOD","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.3",2);
FWMACFilterTable.FWMACFilterRowStatus = new Column("FWMACFilterRowStatus","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.4",2);
FWMACFilterTable.FWMACFilterHostName = new Column("FWMACFilterHostName","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.5",4);
FWMACFilterTable.FWMACFilterStartMin = new Column("FWMACFilterStartMin","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.6",2);
FWMACFilterTable.FWMACFilterEndMin = new Column("FWMACFilterEndMin","1.3.6.1.4.1.4115.1.20.1.1.4.15.1.7",2);
var arFWMACFilterIndex=FWMACFilterTable.FWMACFilterIndex;
var arFWMACFilterAddr=FWMACFilterTable.FWMACFilterAddr;
var arFWMACFilterTOD=FWMACFilterTable.FWMACFilterTOD;
var arFWMACFilterRowStatus=FWMACFilterTable.FWMACFilterRowStatus;
var arFWMACFilterHostName=FWMACFilterTable.FWMACFilterHostName;
var arFWMACFilterStartMin=FWMACFilterTable.FWMACFilterStartMin;
var arFWMACFilterEndMin=FWMACFilterTable.FWMACFilterEndMin;

var FWPortTrigTable = new Table("FWPortTrigTable",              "1.3.6.1.4.1.4115.1.20.1.1.4.16");
FWPortTrigTable.FWPortTrigIndex = new Column("FWPortTrigIndex", "1.3.6.1.4.1.4115.1.20.1.1.4.16.1.1",66);
FWPortTrigTable.FWPortTrigDesc = new Column("FWPortTrigDesc","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.2",4);
FWPortTrigTable.FWPortTrigPortStart = new Column("FWPortTrigPortStart","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.3",66);
FWPortTrigTable.FWPortTrigPortEnd = new Column("FWPortTrigPortEnd","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.4",66);
FWPortTrigTable.FWPortTargPortStart = new Column("FWPortTargPortStart","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.5",66);
FWPortTrigTable.FWPortTargPortEnd = new Column("FWPortTargPortEnd","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.6",66);
FWPortTrigTable.FWPortTrigProtoType = new Column("FWPortTrigProtoType","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.7",2);
FWPortTrigTable.FWPortTrigTOD = new Column("FWPortTrigTOD","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.8",2);
FWPortTrigTable.FWPortTrigRowStatus = new Column("FWPortTrigRowStatus","1.3.6.1.4.1.4115.1.20.1.1.4.16.1.9",2);
var arFWPortTrigIndex=FWPortTrigTable.FWPortTrigIndex;
var arFWPortTrigDesc=FWPortTrigTable.FWPortTrigDesc;
var arFWPortTrigPortStart=FWPortTrigTable.FWPortTrigPortStart;
var arFWPortTrigPortEnd=FWPortTrigTable.FWPortTrigPortEnd;
var arFWPortTargPortStart=FWPortTrigTable.FWPortTargPortStart;
var arFWPortTargPortEnd=FWPortTrigTable.FWPortTargPortEnd;
var arFWPortTrigProtoType=FWPortTrigTable.FWPortTrigProtoType;
var arFWPortTrigTOD=FWPortTrigTable.FWPortTrigTOD;
var arFWPortTrigRowStatus=FWPortTrigTable.FWPortTrigRowStatus;

var FWFilterRules = new Container("FWFilterRules", "1.3.6.1.4.1.4115.1.20.1.1.4.17");
FWFilterRules.FWFilterProxy= new Scalar("FWFilterProxy","1.3.6.1.4.1.4115.1.20.1.1.4.17.1",2);
FWFilterRules.FWFilterCookies= new Scalar("FWFilterCookies","1.3.6.1.4.1.4115.1.20.1.1.4.17.2",2);
FWFilterRules.FWFilterJavaApplets= new Scalar("FWFilterJavaApplets","1.3.6.1.4.1.4115.1.20.1.1.4.17.3",2);
FWFilterRules.FWFilterActiveX= new Scalar("FWFilterActiveX","1.3.6.1.4.1.4115.1.20.1.1.4.17.4",2);
FWFilterRules.FWFilterPopupWnds= new Scalar("FWFilterPopupWnds","1.3.6.1.4.1.4115.1.20.1.1.4.17.5",2);
FWFilterRules.FWBlockFragIPPkts= new Scalar("FWBlockFragIPPkts","1.3.6.1.4.1.4115.1.20.1.1.4.17.6",2);
FWFilterRules.FWPortScanProtect= new Scalar("FWPortScanProtect","1.3.6.1.4.1.4115.1.20.1.1.4.17.7",2);
FWFilterRules.FWIPFloodDetect= new Scalar("FWIPFloodDetect","1.3.6.1.4.1.4115.1.20.1.1.4.17.8",2);
var arFWFilterProxy=FWFilterRules.FWFilterProxy;
var arFWFilterCookies=FWFilterRules.FWFilterCookies;
var arFWFilterJavaApplets=FWFilterRules.FWFilterJavaApplets;
var arFWFilterActiveX=FWFilterRules.FWFilterActiveX;
var arFWFilterPopupWnds=FWFilterRules.FWFilterPopupWnds;
var arFWBlockFragIPPkts=FWFilterRules.FWBlockFragIPPkts;
var arFWPortScanProtect=FWFilterRules.FWPortScanProtect;
var arFWIPFloodDetect=FWFilterRules.FWIPFloodDetect;

var FWDDNSObjs = new Container("FWDDNSObjs", "1.3.6.1.4.1.4115.1.20.1.1.4.18");
FWDDNSObjs.FWDDNSEnable= new Scalar("FWDDNSEnable","1.3.6.1.4.1.4115.1.20.1.1.4.18.1",2);
FWDDNSObjs.FWDDNSType= new Scalar("FWDDNSType","1.3.6.1.4.1.4115.1.20.1.1.4.18.2",2);
FWDDNSObjs.FWDDNSUserHame= new Scalar("FWDDNSUserHame","1.3.6.1.4.1.4115.1.20.1.1.4.18.3",4);
FWDDNSObjs.FWDDNSPassword= new Scalar("FWDDNSPassword","1.3.6.1.4.1.4115.1.20.1.1.4.18.4",4);
FWDDNSObjs.FWDDNSDomainName= new Scalar("FWDDNSDomainName","1.3.6.1.4.1.4115.1.20.1.1.4.18.5",4);
FWDDNSObjs.FWDDNSIPAddrType= new Scalar("FWDDNSIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.4.18.6",2);
FWDDNSObjs.FWDDNSIPAddr= new Scalar("FWDDNSIPAddr","1.3.6.1.4.1.4115.1.20.1.1.4.18.7",4, 1);
FWDDNSObjs.FWDDNSStatus= new Scalar("FWDDNSStatus","1.3.6.1.4.1.4115.1.20.1.1.4.18.8",4);
var arFWDDNSEnable=FWDDNSObjs.FWDDNSEnable;
var arFWDDNSType=FWDDNSObjs.FWDDNSType;
var arFWDDNSUserHame=FWDDNSObjs.FWDDNSUserHame;
var arFWDDNSPassword=FWDDNSObjs.FWDDNSPassword;
var arFWDDNSDomainName=FWDDNSObjs.FWDDNSDomainName;
var arFWDDNSIPAddrType=FWDDNSObjs.FWDDNSIPAddrType;
var arFWDDNSIPAddr=FWDDNSObjs.FWDDNSIPAddr;
var arFWDDNSStatus=FWDDNSObjs.FWDDNSStatus;



/*var FWDDNSDataTable= new Table("FWDDNSDataTable", "1.3.6.1.4.1.4115.1.20.11.1.5.12");
FWDDNSDataTable.DDNSService= new Column("DDNSService","1.3.6.1.4.1.4115.1.20.11.1.5.12.1.1",4);
FWDDNSDataTable.DDNSUserName=new Column("DDNSUserName","1.3.6.1.4.1.4115.1.20.11.1.5.12.1.2",4);
FWDDNSDataTable.DDNSPassword=new Column("DDNSPassword","1.3.6.1.4.1.4115.1.20.11.1.5.12.1.3",4);
FWDDNSDataTable.DDNSHostNames=new Column("DDNSHostNames","1.3.6.1.4.1.4115.1.20.11.1.5.12.1.4",4);
var arDDNSService=  FWDDNSDataTable.DDNSService; 
var arDDNSUserName= FWDDNSDataTable.DDNSUserName;
var arDDNSPassword= FWDDNSDataTable.DDNSPassword; 
var arDDNSHostNames=FWDDNSDataTable.DDNSHostNames;
*/
var FWDDNSDataTable = new Table("FWDDNSDataTable",                 "1.3.6.1.4.1.4115.1.20.1.1.4.45.1");
FWDDNSDataTable.FWDDNSType =       new Column("FWDDNSType",        "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.1.3", 4);
FWDDNSDataTable.FWDDNSUserHame =   new Column("FWDDNSUserHame",    "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.1.4", 4);
FWDDNSDataTable.FWDDNSPassword =   new Column("FWDDNSPassword",    "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.1.5", 4);
var arDDNSService=  FWDDNSDataTable.FWDDNSType;
var arDDNSUserName= FWDDNSDataTable.FWDDNSUserHame;
var arDDNSPassword= FWDDNSDataTable.FWDDNSPassword;

var FWDDNSHostAccess =                  new Table("FWDDNSHostAccess",   "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.2");
FWDDNSHostAccess.HostnameDDNSIndex =    new Column("HostnameDDNSIndex", "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.2.1.1", 2);
FWDDNSHostAccess.HostnameValue =        new Column("HostnameValue",     "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.2.1.2", 2);
FWDDNSHostAccess.HostnameRowStatus =    new Column("HostnameRowStatus", "1.3.6.1.4.1.4115.1.20.1.1.4.45.1.2.1.3", 2);
var arHostnameDDNSIndex   = FWDDNSHostAccess.HostnameDDNSIndex;
var arHostnameValue       = FWDDNSHostAccess.HostnameValue;
var arHostnameRowStatus   = FWDDNSHostAccess.HostnameRowStatus;



var FWFeatures = new Container("FWFeatures", "1.3.6.1.4.1.4115.1.20.1.1.4.19");
FWFeatures.FWEnableWanBlocking= new Scalar("FWEnableWanBlocking","1.3.6.1.4.1.4115.1.20.1.1.4.19.1",2);
FWFeatures.FWIPSecPassThru= new Scalar("FWIPSecPassThru","1.3.6.1.4.1.4115.1.20.1.1.4.19.2",2);
FWFeatures.FWPPTPPassThru= new Scalar("FWPPTPPassThru","1.3.6.1.4.1.4115.1.20.1.1.4.19.3",2);
FWFeatures.FWEnableMulticast= new Scalar("FWEnableMulticast","1.3.6.1.4.1.4115.1.20.1.1.4.19.4",2);
FWFeatures.FWEnableRemoteMgmt= new Scalar("FWEnableRemoteMgmt","1.3.6.1.4.1.4115.1.20.1.1.4.19.5",2);
FWFeatures.FWL2TPPassThru= new Scalar("FWL2TPPassThru","1.3.6.1.4.1.4115.1.20.1.1.4.19.7",2);
FWFeatures.FWEnableWanSNMP= new Scalar("FWEnableWanSNMP","1.3.6.1.4.1.4115.1.20.1.1.4.19.8",2);
FWFeatures.FWEnableWanSSH= new Scalar("FWEnableWanSSH","1.3.6.1.4.1.4115.1.20.1.1.4.19.9",2);
FWFeatures.FWEnableLanSNMPWireless= new Scalar("FWEnableLanSNMPWireless","1.3.6.1.4.1.4115.1.20.1.1.4.19.10",2);
var arFWEnableWanBlocking=FWFeatures.FWEnableWanBlocking;
var arFWIPSecPassThru=FWFeatures.FWIPSecPassThru;
var arFWPPTPPassThru=FWFeatures.FWPPTPPassThru;
var arFWEnableMulticast=FWFeatures.FWEnableMulticast;
var arFWEnableRemoteMgmt=FWFeatures.FWEnableRemoteMgmt;
var arFWL2TPPassThru=FWFeatures.FWL2TPPassThru;
var arFWEnableWanSNMP=FWFeatures.FWEnableWanSNMP;
var arFWEnableWanSSH=FWFeatures.FWEnableWanSSH;
var arFWEnableLanSNMPWireless=FWFeatures.FWEnableLanSNMPWireless;

// scm add 4

var FWEnableRemoteMgmt = new Container("FWEnableRemoteMgmt", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12");
FWEnableRemoteMgmt.FWRemoteMgmtHttp= new Scalar("FWRemoteMgmtHttp","1.3.6.1.4.1.4115.1.20.1.1.4.19.12.1",2);
FWEnableRemoteMgmt.FWRemoteMgmtHttpPort= new Scalar("FWRemoteMgmtHttpPort","1.3.6.1.4.1.4115.1.20.1.1.4.19.12.3",2);
FWEnableRemoteMgmt.FWRemoteMgmtHttps= new Scalar("FWRemoteMgmtHttps","1.3.6.1.4.1.4115.1.20.1.1.4.19.12.2",2);
FWEnableRemoteMgmt.FWRemoteMgmtHttpsPort= new Scalar("FWRemoteMgmtHttpsPort","1.3.6.1.4.1.4115.1.20.1.1.4.19.12.4",2);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedType      = new Scalar("FWRemoteMgmtAllowedType", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.5", 2);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedIPv4      = new Scalar("FWRemoteMgmtAllowedIPv4", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.6", 4);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedIPv6      = new Scalar("FWRemoteMgmtAllowedIPv6", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.7", 4);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedStartIPv4 = new Scalar("FWRemoteMgmtAllowedStartIPv4", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.8", 4);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedEndIPv4   = new Scalar("FWRemoteMgmtAllowedEndIPv4", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.9", 4);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedStartIPv6 = new Scalar("FWRemoteMgmtAllowedStartIPv6", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.10", 4);
FWEnableRemoteMgmt.FWRemoteMgmtAllowedEndIPv6   = new Scalar("FWRemoteMgmtAllowedEndIPv6", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.11", 4);
FWEnableRemoteMgmt.FWRemoteMgmtTelnet           = new Scalar("FWRemoteMgmtTelnet", "1.3.6.1.4.1.4115.1.20.1.1.4.19.12.12", 4);
var arFWRemoteMgmtHttp = FWEnableRemoteMgmt.FWRemoteMgmtHttp;
var arFWRemoteMgmtHttpPort = FWEnableRemoteMgmt.FWRemoteMgmtHttpPort;
var arFWRemoteMgmtHttps = FWEnableRemoteMgmt.FWRemoteMgmtHttps;
var arFWRemoteMgmtHttpsPort = FWEnableRemoteMgmt.FWRemoteMgmtHttpsPort;
var arFWRemoteMgmtAllowedType      =FWEnableRemoteMgmt.FWRemoteMgmtAllowedType      ;
var arFWRemoteMgmtAllowedIPv4      =FWEnableRemoteMgmt.FWRemoteMgmtAllowedIPv4      ;
var arFWRemoteMgmtAllowedIPv6      =FWEnableRemoteMgmt.FWRemoteMgmtAllowedIPv6      ;
var arFWRemoteMgmtAllowedStartIPv4 =FWEnableRemoteMgmt.FWRemoteMgmtAllowedStartIPv4 ;
var arFWRemoteMgmtAllowedEndIPv4   =FWEnableRemoteMgmt.FWRemoteMgmtAllowedEndIPv4   ;
var arFWRemoteMgmtAllowedStartIPv6 =FWEnableRemoteMgmt.FWRemoteMgmtAllowedStartIPv6 ;
var arFWRemoteMgmtAllowedEndIPv6   =FWEnableRemoteMgmt.FWRemoteMgmtAllowedEndIPv6   ;
var arFWRemoteMgmtTelnet           =FWEnableRemoteMgmt.FWRemoteMgmtTelnet           ;

var CmDoc30Acess = new Container("CmDoc30Acess", "1.3.6.1.4.1.4115.1.3.4.1.2");
CmDoc30Acess.RemoteMgmtTelnet    = new Scalar("RemoteMgmtTelnet", "1.3.6.1.4.1.4115.1.3.4.1.2.2", 2);
CmDoc30Acess.RemoteMgmtSSH       = new Scalar("RemoteMgmtSSH", "1.3.6.1.4.1.4115.1.3.4.1.2.10", 2);
var arRemoteMgmtTelnet           =CmDoc30Acess.RemoteMgmtTelnet          ;
var arRemoteMgmtSSH           =CmDoc30Acess.RemoteMgmtSSH           ;


var FWParentalControls = new Container("FWParentalControls", "1.3.6.1.4.1.4115.1.20.1.1.4.20");
FWParentalControls.KeywordCount= new Scalar("KeywordCount","1.3.6.1.4.1.4115.1.20.1.1.4.20.1",2);
FWParentalControls.KeywordClear= new Scalar("KeywordClear","1.3.6.1.4.1.4115.1.20.1.1.4.20.2",2);
FWParentalControls.BlackListCount= new Scalar("BlackListCount","1.3.6.1.4.1.4115.1.20.1.1.4.20.3",2);
FWParentalControls.BlackListClear= new Scalar("BlackListClear","1.3.6.1.4.1.4115.1.20.1.1.4.20.4",2);
FWParentalControls.WhiteListCount= new Scalar("WhiteListCount","1.3.6.1.4.1.4115.1.20.1.1.4.20.5",2);
FWParentalControls.WhiteListClear= new Scalar("WhiteListClear","1.3.6.1.4.1.4115.1.20.1.1.4.20.6",2);
FWParentalControls.TrustedDeviceCount= new Scalar("TrustedDeviceCount","1.3.6.1.4.1.4115.1.20.1.1.4.20.7",2);
FWParentalControls.TrustedDeviceClear= new Scalar("TrustedDeviceClear","1.3.6.1.4.1.4115.1.20.1.1.4.20.8",2);
FWParentalControls.KeywordTableFreeIdx= new Scalar("KeywordTableFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.4.20.9",2);
FWParentalControls.BlackListFreeIdx= new Scalar("BlackListFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.4.20.11",2);
FWParentalControls.WhiteListFreeIdx= new Scalar("WhiteListFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.4.20.13",2);
FWParentalControls.TrustedDeviceFreeIdx= new Scalar("TrustedDeviceFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.4.20.15",2);
FWParentalControls.EnableParentalCont= new Scalar("EnableParentalCont","1.3.6.1.4.1.4115.1.20.1.1.4.20.17",2);
FWParentalControls.ManagedSitesEnabled= new Scalar("ManagedSitesEnabled","1.3.6.1.4.1.4115.1.20.1.1.4.20.18",2);
FWParentalControls.ManagedServicesEnabled= new Scalar("ManagedServicesEnabled","1.3.6.1.4.1.4115.1.20.1.1.4.20.19",2);
FWParentalControls.ManagedDevicesEnabled= new Scalar("ManagedDevicesEnabled","1.3.6.1.4.1.4115.1.20.1.1.4.20.20",2);
var arKeywordCount=FWParentalControls.KeywordCount;
var arKeywordClear=FWParentalControls.KeywordClear;
var arBlackListCount=FWParentalControls.BlackListCount;
var arBlackListClear=FWParentalControls.BlackListClear;
var arWhiteListCount=FWParentalControls.WhiteListCount;
var arWhiteListClear=FWParentalControls.WhiteListClear;
var arTrustedDeviceCount=FWParentalControls.TrustedDeviceCount;
var arTrustedDeviceClear=FWParentalControls.TrustedDeviceClear;
var arKeywordTableFreeIdx=FWParentalControls.KeywordTableFreeIdx;
var arBlackListFreeIdx=FWParentalControls.BlackListFreeIdx;
var arWhiteListFreeIdx=FWParentalControls.WhiteListFreeIdx;
var arTrustedDeviceFreeIdx=FWParentalControls.TrustedDeviceFreeIdx;
var arEnableParentalCont=FWParentalControls.EnableParentalCont;
var arManagedSitesEnabled=FWParentalControls.ManagedSitesEnabled;
var arManagedServicesEnabled=FWParentalControls.ManagedServicesEnabled;
var arManagedDevicesEnabled=FWParentalControls.ManagedDevicesEnabled;

var KeywordBlkTable = new Table("KeywordBlkTable", "1.3.6.1.4.1.4115.1.20.1.1.4.20.10");
KeywordBlkTable.KeywordBlkIndex = new Column("KeywordBlkIndex","1.3.6.1.4.1.4115.1.20.1.1.4.20.10.1.1",2);
KeywordBlkTable.KeywordBlkWord = new Column("KeywordBlkWord","1.3.6.1.4.1.4115.1.20.1.1.4.20.10.1.2",4);
KeywordBlkTable.KeywordBlkTOD = new Column("KeywordBlkTOD","1.3.6.1.4.1.4115.1.20.1.1.4.20.10.1.3",2);
KeywordBlkTable.KeywordBlkStatus = new Column("KeywordBlkStatus","1.3.6.1.4.1.4115.1.20.1.1.4.20.10.1.4",2);
KeywordBlkTable.KeywordBlkStartMin = new Column("KeywordBlkStartMin","1.3.6.1.4.1.4115.1.20.1.1.4.20.10.1.5",2);
KeywordBlkTable.KeywordBlkEndMin = new Column("KeywordBlkEndMin","1.3.6.1.4.1.4115.1.20.1.1.4.20.10.1.6",2);
var arKeywordBlkIndex=KeywordBlkTable.KeywordBlkIndex;
var arKeywordBlkWord=KeywordBlkTable.KeywordBlkWord;
var arKeywordBlkTOD=KeywordBlkTable.KeywordBlkTOD;
var arKeywordBlkStatus=KeywordBlkTable.KeywordBlkStatus;
var arKeywordBlkStartMin=KeywordBlkTable.KeywordBlkStartMin;
var arKeywordBlkEndMin=KeywordBlkTable.KeywordBlkEndMin;

var BlackListTable = new Table("BlackListTable", "1.3.6.1.4.1.4115.1.20.1.1.4.20.12");
BlackListTable.BlackListIndex = new Column("BlackListIndex","1.3.6.1.4.1.4115.1.20.1.1.4.20.12.1.1",2);
BlackListTable.BlackListDomain = new Column("BlackListDomain","1.3.6.1.4.1.4115.1.20.1.1.4.20.12.1.2",4);
BlackListTable.BlackListTOD = new Column("BlackListTOD","1.3.6.1.4.1.4115.1.20.1.1.4.20.12.1.3",2);
BlackListTable.BlackListStatus = new Column("BlackListStatus","1.3.6.1.4.1.4115.1.20.1.1.4.20.12.1.4",2);
BlackListTable.BlackListStartMin = new Column("BlackListStartMin","1.3.6.1.4.1.4115.1.20.1.1.4.20.12.1.5",2);
BlackListTable.BlackListEndMin = new Column("BlackListEndMin","1.3.6.1.4.1.4115.1.20.1.1.4.20.12.1.6",2);
var arBlackListIndex=BlackListTable.BlackListIndex;
var arBlackListDomain=BlackListTable.BlackListDomain;
var arBlackListTOD=BlackListTable.BlackListTOD;
var arBlackListStatus=BlackListTable.BlackListStatus;
var arBlackListStartMin=BlackListTable.BlackListStartMin;
var arBlackListEndMin=BlackListTable.BlackListEndMin;

var WhiteListTable = new Table("WhiteListTable", "1.3.6.1.4.1.4115.1.20.1.1.4.20.14");
WhiteListTable.WhiteListIndex = new Column("WhiteListIndex","1.3.6.1.4.1.4115.1.20.1.1.4.20.14.1.1",2);
WhiteListTable.WhiteListDomain = new Column("WhiteListDomain","1.3.6.1.4.1.4115.1.20.1.1.4.20.14.1.2",4);
WhiteListTable.WhiteListTOD = new Column("WhiteListTOD","1.3.6.1.4.1.4115.1.20.1.1.4.20.14.1.3",2);
WhiteListTable.WhiteListStatus = new Column("WhiteListStatus","1.3.6.1.4.1.4115.1.20.1.1.4.20.14.1.4",2);
var arWhiteListIndex=WhiteListTable.WhiteListIndex;
var arWhiteListDomain=WhiteListTable.WhiteListDomain;
var arWhiteListTOD=WhiteListTable.WhiteListTOD;
var arWhiteListStatus=WhiteListTable.WhiteListStatus;

var TrustedDeviceTable = new Table("TrustedDeviceTable", "1.3.6.1.4.1.4115.1.20.1.1.4.20.16");
TrustedDeviceTable.TrustedDeviceIndex = new Column("TrustedDeviceIndex","1.3.6.1.4.1.4115.1.20.1.1.4.20.16.1.1",2);
TrustedDeviceTable.TrustedDeviceMAC = new Column("TrustedDeviceMAC","1.3.6.1.4.1.4115.1.20.1.1.4.20.16.1.2",4, 1);
TrustedDeviceTable.TrustedDeviceStatus = new Column("TrustedDeviceStatus","1.3.6.1.4.1.4115.1.20.1.1.4.20.16.1.3",2);
TrustedDeviceTable.TrustedDeviceName = new Column("TrustedDeviceName","1.3.6.1.4.1.4115.1.20.1.1.4.20.16.1.4",4);
TrustedDeviceTable.TrustedDeviceAddrType = new Column("TrustedDeviceAddrType","1.3.6.1.4.1.4115.1.20.1.1.4.20.16.1.5",2);
TrustedDeviceTable.TrustedDeviceAddr = new Column("TrustedDeviceAddr","1.3.6.1.4.1.4115.1.20.1.1.4.20.16.1.6",4, 1);
var arTrustedDeviceIndex=TrustedDeviceTable.TrustedDeviceIndex;
var arTrustedDeviceMAC=TrustedDeviceTable.TrustedDeviceMAC;
var arTrustedDeviceStatus=TrustedDeviceTable.TrustedDeviceStatus;
var arTrustedDeviceName=TrustedDeviceTable.TrustedDeviceName;
var arTrustedDeviceAddrType=TrustedDeviceTable.TrustedDeviceAddrType;
var arTrustedDeviceAddr=TrustedDeviceTable.TrustedDeviceAddr;

var TrustedDeviceManagedServicesTable = new Table("TrustedDeviceManagedServicesTable", "1.3.6.1.4.1.4115.1.20.1.1.4.20.21");
TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesIndex = new Column("TrustedDeviceManagedServicesIndex","1.3.6.1.4.1.4115.1.20.1.1.4.20.21.1.1",2);
TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesMAC = new Column("TrustedDeviceManagedServicesMAC","1.3.6.1.4.1.4115.1.20.1.1.4.20.21.1.2",4, 1);
TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesStatus = new Column("TrustedDeviceManagedServicesStatus","1.3.6.1.4.1.4115.1.20.1.1.4.20.21.1.3",2);
TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesName = new Column("TrustedDeviceManagedServicesName","1.3.6.1.4.1.4115.1.20.1.1.4.20.21.1.4",4);
TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesAddrType = new Column("TrustedDeviceManagedServicesAddrType","1.3.6.1.4.1.4115.1.20.1.1.4.20.21.1.5",2);
TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesAddr = new Column("TrustedDeviceManagedServicesAddr","1.3.6.1.4.1.4115.1.20.1.1.4.20.21.1.6",4, 1);
var arTrustedDeviceManagedServicesIndex=TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesIndex;
var arTrustedDeviceManagedServicesMAC=TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesMAC;
var arTrustedDeviceManagedServicesStatus=TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesStatus;
var arTrustedDeviceManagedServicesName=TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesName;
var arTrustedDeviceManagedServicesAddrType=TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesAddrType;
var arTrustedDeviceManagedServicesAddr=TrustedDeviceManagedServicesTable.TrustedDeviceManagedServicesAddr;

// OG1600 GPS support
var GpsCfg = new Container("GpsCfg", "1.3.6.1.4.1.4115.12");
GpsCfg.GpsScanOnBoot= new Scalar("GpsScanOnBoot","1.3.6.1.4.1.4115.12.1",2);
GpsCfg.GpsScanPeriodically= new Scalar("GpsScanPeriodically","1.3.6.1.4.1.4115.12.2",2);
GpsCfg.GpsPeriodicInterval= new Scalar("GpsPeriodicInterval","1.3.6.1.4.1.4115.12.3",66);
GpsCfg.GpsPeriodicTime= new Scalar("GpsPeriodicTime","1.3.6.1.4.1.4115.12.4",4);
GpsCfg.GpsPowerDownAfterSuccessfulScan= new Scalar("GpsPowerDownAfterSuccessfulScan","1.3.6.1.4.1.4115.12.5",2);
GpsCfg.GpsScanTimeout= new Scalar("GpsScanTimeout","1.3.6.1.4.1.4115.12.6",66);
GpsCfg.GpsScanStatus= new Scalar("GpsScanStatus","1.3.6.1.4.1.4115.12.7",66);
GpsCfg.GpsErrorDetails= new Scalar("GpsErrorDetails","1.3.6.1.4.1.4115.12.8",4);
GpsCfg.GpsLastScanTime= new Scalar("GpsLastScanTime","1.3.6.1.4.1.4115.12.9",4);
GpsCfg.GpsLastSuccessfulScanTime= new Scalar("GpsLastSuccessfulScanTime","1.3.6.1.4.1.4115.12.10",4);
GpsCfg.GpsLockedLatitude= new Scalar("GpsLockedLatitude","1.3.6.1.4.1.4115.12.11",4);
GpsCfg.GpsLockedLongitude= new Scalar("GpsLockedLongitude","1.3.6.1.4.1.4115.12.12",4);
GpsCfg.GpsNumberOfSatellites= new Scalar("GpsNumberOfSatellites","1.3.6.1.4.1.4115.12.13",66);
GpsCfg.GpsReset= new Scalar("GpsReset","1.3.6.1.4.1.4115.12.14",2);
GpsCfg.GpsSuccessfulScanSinceBootup= new Scalar("GpsSuccessfulScanSinceBootup","1.3.6.1.4.1.4115.12.15",2);

var arGpsScanOnBoot=GpsCfg.GpsScanOnBoot;
var arGpsScanPeriodically=GpsCfg.GpsScanPeriodically;
var arGpsPeriodicInterval=GpsCfg.GpsPeriodicInterval;
var arGpsPeriodicTime=GpsCfg.GpsPeriodicTime;
var arGpsPowerDownAfterSuccessfulScan=GpsCfg.GpsPowerDownAfterSuccessfulScan;
var arGpsScanTimeout=GpsCfg.GpsScanTimeout;
var arGpsScanStatus=GpsCfg.GpsScanStatus;
var arGpsErrorDetails=GpsCfg.GpsErrorDetails;
var arGpsLastScanTime=GpsCfg.GpsLastScanTime;
var arGpsLastSuccessfulScanTime=GpsCfg.GpsLastSuccessfulScanTime;
var arGpsLockedLatitude=GpsCfg.GpsLockedLatitude;
var arGpsLockedLongitude=GpsCfg.GpsLockedLongitude;
var arGpsNumberOfSatellites=GpsCfg.GpsNumberOfSatellites;
var arGpsReset=GpsCfg.GpsReset;
var arGpsSuccessfulScanSinceBootup=GpsCfg.GpsSuccessfulScanSinceBootup;

var SysCfg = new Container("SysCfg", "1.3.6.1.4.1.4115.1.20.1.1.5");
SysCfg.AdminPassword= new Scalar("AdminPassword","1.3.6.1.4.1.4115.1.20.1.1.5.1",4);
SysCfg.AdminTimeout= new Scalar("AdminTimeout","1.3.6.1.4.1.4115.1.20.1.1.5.2",66);
SysCfg.TimeZoneUTCOffset= new Scalar("TimeZoneUTCOffset","1.3.6.1.4.1.4115.1.20.1.1.5.3",2);
SysCfg.Reboot= new Scalar("Reboot","1.3.6.1.4.1.4115.1.20.1.1.5.4",2);
SysCfg.Defaults= new Scalar("Defaults","1.3.6.1.4.1.4115.1.20.1.1.5.5",2);
SysCfg.Language= new Scalar("Language","1.3.6.1.4.1.4115.1.20.1.1.5.6",4);
SysCfg.Name= new Scalar("Name","1.3.6.1.4.1.4115.1.20.1.1.5.7",4);
SysCfg.SerialNumber= new Scalar("SerialNumber","1.3.6.1.4.1.4115.1.20.1.1.5.8",4);
SysCfg.BootCodeVersion= new Scalar("BootCodeVersion","1.3.6.1.4.1.4115.1.20.1.1.5.9",4);
SysCfg.HardwareVersion= new Scalar("HardwareVersion","1.3.6.1.4.1.4115.1.20.1.1.5.10",4);
SysCfg.FirmwareVersion= new Scalar("FirmwareVersion","1.3.6.1.4.1.4115.1.20.1.1.5.11",4);
SysCfg.LogLevel= new Scalar("LogLevel","1.3.6.1.4.1.4115.1.20.1.1.5.12",2);
SysCfg.CustomSettings= new Scalar("CustomSettings","1.3.6.1.4.1.4115.1.20.1.1.5.13",4,1);
SysCfg.CustomID= new Scalar("CustomID","1.3.6.1.4.1.4115.1.20.1.1.5.14",2);
SysCfg.CurrentTime= new Scalar("CurrentTime","1.3.6.1.4.1.4115.1.20.1.1.5.15",4,1);
SysCfg.TACACSAddr= new Scalar("TACACSAddr","1.3.6.1.4.1.4115.1.20.1.1.5.20",4,1);
SysCfg.TACACSPort= new Scalar("TACACSPort","1.3.6.1.4.1.4115.1.20.1.1.5.21",2);
SysCfg.TACACSSecretKey= new Scalar("TACACSSecretKey","1.3.6.1.4.1.4115.1.20.1.1.5.22",4,1);
SysCfg.XmlProvisioningFile= new Scalar("XmlProvisioningFile","1.3.6.1.4.1.4115.1.20.1.1.5.23",4);
SysCfg.XmlProvisioningStatus= new Scalar("XmlProvisioningStatus","1.3.6.1.4.1.4115.1.20.1.1.5.24",2);
SysCfg.BlockNonArrisDevices= new Scalar("BlockNonArrisDevices","1.3.6.1.4.1.4115.1.20.1.1.5.26",2);
SysCfg.DHCPLogLevel= new Scalar("DHCPLogLevel","1.3.6.1.4.1.4115.1.20.1.1.5.27",2);
SysCfg.TechnicianName= new Scalar("TechnicianName","1.3.6.1.4.1.4115.1.20.1.1.5.28",4);
SysCfg.EnableLanEtherPrivateWanBlock= new Scalar("EnableLanEtherPrivateWanBlock","1.3.6.1.4.1.4115.1.20.1.1.5.29",2);
SysCfg.TACACSIPAddrType= new Scalar("TACACSIPAddrType","1.3.6.1.4.1.4115.1.20.1.1.5.30",2);
SysCfg.TACACSIPAddr= new Scalar("TACACSIPAddr","1.3.6.1.4.1.4115.1.20.1.1.5.31",4,1);
SysCfg.EnabledInterfaces= new Scalar("EnabledInterfaces","1.3.6.1.4.1.4115.1.20.1.1.5.32",2);
SysCfg.EnabledInterfacesString= new Scalar("EnabledInterfacesString","1.3.6.1.4.1.4115.1.20.1.1.5.33",4);
SysCfg.InboundTrafficLogEnable= new Scalar("InboundTrafficLogEnable","1.3.6.1.4.1.4115.1.20.1.1.5.34",2);
SysCfg.NATPBypassEnable= new Scalar("NATPBypassEnable","1.3.6.1.4.1.4115.1.20.1.1.5.35",2);
SysCfg.NATDebug= new Scalar("NATDebug","1.3.6.1.4.1.4115.1.20.1.1.5.36",2);
SysCfg.DisableResetButton= new Scalar("DisableResetButton","1.3.6.1.4.1.4115.1.20.1.1.5.37",2);
SysCfg.DHCPOption43Sub2= new Scalar("DHCPOption43Sub2","1.3.6.1.4.1.4115.1.20.1.1.5.38",4,1);
SysCfg.DHCPOption43Sub3= new Scalar("DHCPOption43Sub3","1.3.6.1.4.1.4115.1.20.1.1.5.39",4,1);
SysCfg.ESTBDHCPOption43Sub2= new Scalar("ESTBDHCPOption43Sub2","1.3.6.1.4.1.4115.1.20.1.1.5.40",4,1);
SysCfg.ESTBDHCPOption43Sub3= new Scalar("ESTBDHCPOption43Sub3","1.3.6.1.4.1.4115.1.20.1.1.5.41",4,1);
SysCfg.ClientTrackingEnable= new Scalar("ClientTrackingEnable","1.3.6.1.4.1.4115.1.20.1.1.5.43",2);
SysCfg.SystemFlags= new Scalar("SystemFlags","1.3.6.1.4.1.4115.1.20.1.1.5.44",2);
SysCfg.CpuSpeed= new Scalar("CpuSpeed","1.3.6.1.4.1.4115.1.20.1.1.5.64",2);
SysCfg.FlashSize= new Scalar("FlashSize","1.3.6.1.4.1.4115.1.20.1.1.5.52",2);
SysCfg.RamSize= new Scalar("RamSize","1.3.6.1.4.1.4115.1.20.1.1.5.53",2);
SysCfg.SaveCurrentConfigFile= new Scalar("SaveCurrentConfigFile","1.3.6.1.4.1.4115.1.20.1.1.5.57",2);
SysCfg.RestoreCurrentConfigFile= new Scalar("RestoreCurrentConfigFile","1.3.6.1.4.1.4115.1.20.1.1.5.58",2);
SysCfg.FlashAvailSize= new Scalar("FlashAvailSize","1.3.6.1.4.1.4115.1.20.1.1.5.60",2);
SysCfg.RamAvailSize= new Scalar("RamAvailSize","1.3.6.1.4.1.4115.1.20.1.1.5.61",2);
var arAdminPassword=SysCfg.AdminPassword;
var arAdminTimeout=SysCfg.AdminTimeout;
var arTimeZoneUTCOffset=SysCfg.TimeZoneUTCOffset;
var arReboot=SysCfg.Reboot;
var arDefaults=SysCfg.Defaults;
var arLanguage=SysCfg.Language;
var arName=SysCfg.Name;
var arSerialNumber=SysCfg.SerialNumber;
var arBootCodeVersion=SysCfg.BootCodeVersion;
var arHardwareVersion=SysCfg.HardwareVersion;
var arFirmwareVersion=SysCfg.FirmwareVersion;
var arLogLevel=SysCfg.LogLevel;
var arCustomSettings=SysCfg.CustomSettings;
var arCustomID=SysCfg.CustomID;
var arCurrentTime=SysCfg.CurrentTime;
var arTACACSAddr=SysCfg.TACACSAddr;
var arTACACSPort=SysCfg.TACACSPort;
var arTACACSSecretKey=SysCfg.TACACSSecretKey;
var arXmlProvisioningFile=SysCfg.XmlProvisioningFile;
var arXmlProvisioningStatus=SysCfg.XmlProvisioningStatus;
var arBlockNonArrisDevices=SysCfg.BlockNonArrisDevices;
var arDHCPLogLevel=SysCfg.DHCPLogLevel;
var arTechnicianName=SysCfg.TechnicianName;
var arEnableLanEtherPrivateWanBlock=SysCfg.EnableLanEtherPrivateWanBlock;
var arTACACSIPAddrType=SysCfg.TACACSIPAddrType;
var arTACACSIPAddr=SysCfg.TACACSIPAddr;
var arEnabledInterfaces=SysCfg.EnabledInterfaces;
var arEnabledInterfacesString=SysCfg.EnabledInterfacesString;
var arInboundTrafficLogEnable=SysCfg.InboundTrafficLogEnable;
var arNATPBypassEnable=SysCfg.NATPBypassEnable;
var arNATDebug=SysCfg.NATDebug;
var arDisableResetButton=SysCfg.DisableResetButton;
var arDHCPOption43Sub2=SysCfg.DHCPOption43Sub2;
var arDHCPOption43Sub3=SysCfg.DHCPOption43Sub3;
var arESTBDHCPOption43Sub2=SysCfg.ESTBDHCPOption43Sub2;
var arESTBDHCPOption43Sub3=SysCfg.ESTBDHCPOption43Sub3;
var arClientTrackingEnable=SysCfg.ClientTrackingEnable;
var arSystemFlags=SysCfg.SystemFlags;
var arCpuSpeed=SysCfg.CpuSpeed;
var arFlashSize=SysCfg.FlashSize;
var arRamSize=SysCfg.RamSize;
var arSaveCurrentConfigFile=SysCfg.SaveCurrentConfigFile;
var arRestoreCurrentConfigFile=SysCfg.RestoreCurrentConfigFile;
var arFlashAvailSize=SysCfg.FlashAvailSize;
var arRamAvailSize=SysCfg.RamAvailSize;

var AuthTable = new Table("AuthTable", "1.3.6.1.4.1.4115.1.20.1.1.5.16");
AuthTable.AuthIndex = new Column("AuthIndex","1.3.6.1.4.1.4115.1.20.1.1.5.16.1.1",66);
AuthTable.AuthUserName = new Column("AuthUserName","1.3.6.1.4.1.4115.1.20.1.1.5.16.1.2",4);
AuthTable.AuthPassword = new Column("AuthPassword","1.3.6.1.4.1.4115.1.20.1.1.5.16.1.3",4);
AuthTable.AuthType = new Column("AuthType","1.3.6.1.4.1.4115.1.20.1.1.5.16.1.4",4,1);
var arAuthIndex=AuthTable.AuthIndex;
var arAuthUserName=AuthTable.AuthUserName;
var arAuthPassword=AuthTable.AuthPassword;
var arAuthType=AuthTable.AuthType;

var SNTPSettings = new Container("SNTPSettings", "1.3.6.1.4.1.4115.1.20.1.1.5.17");
SNTPSettings.EnableSNTP= new Scalar("EnableSNTP","1.3.6.1.4.1.4115.1.20.1.1.5.17.1",2);
SNTPSettings.ApplySNTPSettings= new Scalar("ApplySNTPSettings","1.3.6.1.4.1.4115.1.20.1.1.5.17.2",2);
SNTPSettings.SNTPTableFreeIdx= new Scalar("SNTPTableFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.5.17.3",2);
var arEnableSNTP=SNTPSettings.EnableSNTP;
var arApplySNTPSettings=SNTPSettings.ApplySNTPSettings;
var arSNTPTableFreeIdx=SNTPSettings.SNTPTableFreeIdx;

var SNTPServerTable = new Table("SNTPServerTable", "1.3.6.1.4.1.4115.1.20.1.1.5.17.4");
SNTPServerTable.SNTPServerIndex = new Column("SNTPServerIndex","1.3.6.1.4.1.4115.1.20.1.1.5.17.4.1.1",2);
SNTPServerTable.SNTPServerAddrType = new Column("SNTPServerAddrType","1.3.6.1.4.1.4115.1.20.1.1.5.17.4.1.2",2);
SNTPServerTable.SNTPServerAddr = new Column("SNTPServerAddr","1.3.6.1.4.1.4115.1.20.1.1.5.17.4.1.3",4,1);
SNTPServerTable.SNTPServerName = new Column("SNTPServerName","1.3.6.1.4.1.4115.1.20.1.1.5.17.4.1.4",4);
SNTPServerTable.SNTPServerStatus = new Column("SNTPServerStatus","1.3.6.1.4.1.4115.1.20.1.1.5.17.4.1.5",2);
var arSNTPServerIndex=SNTPServerTable.SNTPServerIndex;
var arSNTPServerAddrType=SNTPServerTable.SNTPServerAddrType;
var arSNTPServerAddr=SNTPServerTable.SNTPServerAddr;
var arSNTPServerName=SNTPServerTable.SNTPServerName;
var arSNTPServerStatus=SNTPServerTable.SNTPServerStatus;

var EmailSettings = new Container("EmailSettings", "1.3.6.1.4.1.4115.1.20.1.1.5.18");
EmailSettings.EmailServerName= new Scalar("EmailServerName","1.3.6.1.4.1.4115.1.20.1.1.5.18.1",4);
EmailSettings.EmailServerUser= new Scalar("EmailServerUser","1.3.6.1.4.1.4115.1.20.1.1.5.18.2",4);
EmailSettings.EmailServerPW= new Scalar("EmailServerPW","1.3.6.1.4.1.4115.1.20.1.1.5.18.3",4);
EmailSettings.EmailAddress= new Scalar("EmailAddress","1.3.6.1.4.1.4115.1.20.1.1.5.18.4",4,1);
EmailSettings.EnableLogEmail= new Scalar("EnableLogEmail","1.3.6.1.4.1.4115.1.20.1.1.5.18.5",2);
EmailSettings.EmailApplySettings= new Scalar("EmailApplySettings","1.3.6.1.4.1.4115.1.20.1.1.5.18.6",2);
// scm x2 lines
EmailSettings.EmailSenderAddress    = new Scalar("EmailSenderAddress",    "1.3.6.1.4.1.4115.1.20.1.1.5.18.8",4);
var arEmailSenderAddress   =EmailSettings.EmailSenderAddress    ;

var arEmailServerName=EmailSettings.EmailServerName;
var arEmailServerUser=EmailSettings.EmailServerUser;
var arEmailServerPW=EmailSettings.EmailServerPW;
var arEmailAddress=EmailSettings.EmailAddress;
var arEnableLogEmail=EmailSettings.EnableLogEmail;
var arEmailApplySettings=EmailSettings.EmailApplySettings;

// scm new container.
var EmailNotifys = new Container("EmailNotifys",     "1.3.6.1.4.1.4115.1.20.1.1.5.18.7");
EmailNotifys.EmailNotifyTypeFW     = new Scalar("EmailNotifyTypeFW",     "1.3.6.1.4.1.4115.1.20.1.1.5.18.7.1",2);
EmailNotifys.EmailNotifyTypePC     = new Scalar("EmailNotifyTypePC",     "1.3.6.1.4.1.4115.1.20.1.1.5.18.7.2",2);
EmailNotifys.EmailNotifyTypeAlert  = new Scalar("EmailNotifyTypeAlert",  "1.3.6.1.4.1.4115.1.20.1.1.5.18.7.3",2);
EmailNotifys.EmailNotifyTypeWarning  = new Scalar("EmailNotifyTypeWarning",  "1.3.6.1.4.1.4115.1.20.1.1.5.18.7.4",2);
var arEmailNotifyTypeFW    =EmailNotifys.EmailNotifyTypeFW     ;
var arEmailNotifyTypePC    =EmailNotifys.EmailNotifyTypePC     ;
var arEmailNotifyTypeAlert =EmailNotifys.EmailNotifyTypeAlert  ;
var arEmailNotifyTypeWarning =EmailNotifys.EmailNotifyTypeWarning  ;


var LogSettings = new Container("LogSettings", "1.3.6.1.4.1.4115.1.20.1.1.5.19");
LogSettings.ClearLogs= new Scalar("ClearLogs","1.3.6.1.4.1.4115.1.20.1.1.5.19.3",2);
LogSettings.ChangeLogFilter= new Scalar("ChangeLogFilter","1.3.6.1.4.1.4115.1.20.1.1.5.19.4",2);
var arClearLogs=LogSettings.ClearLogs;
var arChangeLogFilter=LogSettings.ChangeLogFilter;

var UserLogs = new Container("UserLogs", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1");

var FirewallLogTable = new Table("FirewallLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1.1");
FirewallLogTable.FWLogIndex = new Column("FWLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.1.1.1",2);
FirewallLogTable.FWLogTime = new Column("FWLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.1.1.2",4, 1);
FirewallLogTable.FWLogInfo = new Column("FWLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.1.1.3",4);
var arFWLogIndex=FirewallLogTable.FWLogIndex;
var arFWLogTime=FirewallLogTable.FWLogTime;
var arFWLogInfo=FirewallLogTable.FWLogInfo;

var ParentalContLogTable = new Table("ParentalContLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1.2");
ParentalContLogTable.PCLogIndex = new Column("PCLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.2.1.1",2);
ParentalContLogTable.PCLogTime = new Column("PCLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.2.1.2",4, 1);
ParentalContLogTable.PCLogInfo = new Column("PCLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.2.1.3",4);
ParentalContLogTable.PCLogType = new Column("PCLogType","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.2.1.4",2);
var arPCLogIndex=ParentalContLogTable.PCLogIndex;
var arPCLogTime=ParentalContLogTable.PCLogTime;
var arPCLogInfo=ParentalContLogTable.PCLogInfo;
var arPCLogType=ParentalContLogTable.PCLogType;

var ChangeLogTable = new Table("ChangeLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1.3");
ChangeLogTable.ChangeLogIndex = new Column("ChangeLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.3.1.1",2);
ChangeLogTable.ChangeLogTime = new Column("ChangeLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.3.1.2",4,1);
ChangeLogTable.ChangeLogInfo = new Column("ChangeLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.3.1.3",4);
var arChangeLogIndex=ChangeLogTable.ChangeLogIndex;
var arChangeLogTime=ChangeLogTable.ChangeLogTime;
var arChangeLogInfo=ChangeLogTable.ChangeLogInfo;

var DebugLogTable = new Table("DebugLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1.4");
DebugLogTable.DebugLogIndex = new Column("DebugLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.4.1.1",2);
DebugLogTable.DebugLogTime = new Column("DebugLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.4.1.2",4,1);
DebugLogTable.DebugLogInfo = new Column("DebugLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.4.1.3",4);
var arDebugLogIndex=DebugLogTable.DebugLogIndex;
var arDebugLogTime=DebugLogTable.DebugLogTime;
var arDebugLogInfo=DebugLogTable.DebugLogInfo;

var DHCPLogTable = new Table("DHCPLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1.5");
DHCPLogTable.DHCPLogIndex = new Column("DHCPLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.5.1.1",2);
DHCPLogTable.DHCPLogTime = new Column("DHCPLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.5.1.2",4,1);
DHCPLogTable.DHCPLogInfo = new Column("DHCPLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.5.1.3",4);
var arDHCPLogIndex=DHCPLogTable.DHCPLogIndex;
var arDHCPLogTime=DHCPLogTable.DHCPLogTime;
var arDHCPLogInfo=DHCPLogTable.DHCPLogInfo;

var LanClientLogTable = new Table("LanClientLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.1.6");
LanClientLogTable.LanClientLogIndex = new Column("LanClientLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.6.1.1",2);
LanClientLogTable.LanClientLogTime = new Column("LanClientLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.6.1.2",4,1);
LanClientLogTable.LanClientLogInfo = new Column("LanClientLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.1.6.1.3",4);
var arLanClientLogIndex=LanClientLogTable.LanClientLogIndex;
var arLanClientLogTime=LanClientLogTable.LanClientLogTime;
var arLanClientLogInfo=LanClientLogTable.LanClientLogInfo;

var MSOLogs = new Container("MSOLogs", "1.3.6.1.4.1.4115.1.20.1.1.5.19.2");
MSOLogs.ClearMSOLogs= new Scalar("ClearMSOLogs","1.3.6.1.4.1.4115.1.20.1.1.5.19.2.2",2);
var arClearMSOLogs=MSOLogs.ClearMSOLogs;

var MSOChgLogTable = new Table("MSOChgLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.19.2.1");
MSOChgLogTable.MSOChgLogIndex = new Column("MSOChgLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.19.2.1.1.1",2);
MSOChgLogTable.MSOChgLogTime = new Column("MSOChgLogTime","1.3.6.1.4.1.4115.1.20.1.1.5.19.2.1.1.2",4,1);
MSOChgLogTable.MSOChgLogInfo = new Column("MSOChgLogInfo","1.3.6.1.4.1.4115.1.20.1.1.5.19.2.1.1.3",4);
var arMSOChgLogIndex=MSOChgLogTable.MSOChgLogIndex;
var arMSOChgLogTime=MSOChgLogTable.MSOChgLogTime;
var arMSOChgLogInfo=MSOChgLogTable.MSOChgLogInfo;

var InboundTrafficLogTable = new Table("InboundTrafficLogTable", "1.3.6.1.4.1.4115.1.20.1.1.5.42");
InboundTrafficLogTable.InboundTrafficLogIndex = new Column("InboundTrafficLogIndex","1.3.6.1.4.1.4115.1.20.1.1.5.42.1.1",66);
InboundTrafficLogTable.InboundTrafficLogData = new Column("InboundTrafficLogData","1.3.6.1.4.1.4115.1.20.1.1.5.42.1.2",4);
var arInboundTrafficLogIndex=InboundTrafficLogTable.InboundTrafficLogIndex;
var arInboundTrafficLogData=InboundTrafficLogTable.InboundTrafficLogData;

var HostAccess = new Container("HostAccess", "1.3.6.1.4.1.4115.1.20.1.1.6");
HostAccess.HostAccessClientSeed= new Scalar("HostAccessClientSeed","1.3.6.1.4.1.4115.1.20.1.1.6.1",4,1);
HostAccess.HostCLITimeout= new Scalar("HostCLITimeout","1.3.6.1.4.1.4115.1.20.1.1.6.2",66);
HostAccess.HostAccessSSHEnable= new Scalar("HostAccessSSHEnable","1.3.6.1.4.1.4115.1.20.1.1.6.3",2);
HostAccess.HostAccessSSHPassword= new Scalar("HostAccessSSHPassword","1.3.6.1.4.1.4115.1.20.1.1.6.4",4);
HostAccess.WebAccessFreeIdx= new Scalar("WebAccessFreeIdx","1.3.6.1.4.1.4115.1.20.1.1.6.5",2);
HostAccess.WebAccessSetting= new Scalar("WebAccessSetting","1.3.6.1.4.1.4115.1.20.1.1.6.6",2);
HostAccess.WebAccessWANACL= new Scalar("WebAccessWANACL","1.3.6.1.4.1.4115.1.20.1.1.6.8",4);
var arHostAccessClientSeed=HostAccess.HostAccessClientSeed;
var arHostCLITimeout=HostAccess.HostCLITimeout;
var arHostAccessSSHEnable=HostAccess.HostAccessSSHEnable;
var arHostAccessSSHPassword=HostAccess.HostAccessSSHPassword;
var arWebAccessFreeIdx=HostAccess.WebAccessFreeIdx;
var arWebAccessSetting=HostAccess.WebAccessSetting;
var arWebAccessWANACL=HostAccess.WebAccessWANACL;

var WebAccessTable = new Table("WebAccessTable", "1.3.6.1.4.1.4115.1.20.1.1.6.7");
WebAccessTable.WebAccessIndex = new Column("WebAccessIndex","1.3.6.1.4.1.4115.1.20.1.1.6.7.1.1",2);
WebAccessTable.WebAccessPage = new Column("WebAccessPage","1.3.6.1.4.1.4115.1.20.1.1.6.7.1.2",4);
WebAccessTable.WebAccessLevel = new Column("WebAccessLevel","1.3.6.1.4.1.4115.1.20.1.1.6.7.1.3",2);
WebAccessTable.WebAccessRowStatus = new Column("WebAccessRowStatus","1.3.6.1.4.1.4115.1.20.1.1.6.7.1.4",2);
var arWebAccessIndex=WebAccessTable.WebAccessIndex;
var arWebAccessPage=WebAccessTable.WebAccessPage;
var arWebAccessLevel=WebAccessTable.WebAccessLevel;
var arWebAccessRowStatus=WebAccessTable.WebAccessRowStatus;

var PingMgmt = new Container("PingMgmt", "1.3.6.1.4.1.4115.1.20.1.1.7");
PingMgmt.PingTargetAddrType= new Scalar("PingTargetAddrType","1.3.6.1.4.1.4115.1.20.1.1.7.1",2);
PingMgmt.PingTargetAddress= new Scalar("PingTargetAddress","1.3.6.1.4.1.4115.1.20.1.1.7.2",4, 1);
PingMgmt.PingNumPkts= new Scalar("PingNumPkts","1.3.6.1.4.1.4115.1.20.1.1.7.3",66);
PingMgmt.PingPktSize= new Scalar("PingPktSize","1.3.6.1.4.1.4115.1.20.1.1.7.4",66);
PingMgmt.PingInterval= new Scalar("PingInterval","1.3.6.1.4.1.4115.1.20.1.1.7.5",66);
PingMgmt.PingTimeout= new Scalar("PingTimeout","1.3.6.1.4.1.4115.1.20.1.1.7.6",2);
PingMgmt.PingVerifyReply= new Scalar("PingVerifyReply","1.3.6.1.4.1.4115.1.20.1.1.7.7",2);
PingMgmt.PingIpStackNumber= new Scalar("PingIpStackNumber","1.3.6.1.4.1.4115.1.20.1.1.7.8",2);
PingMgmt.PingStartStop= new Scalar("PingStartStop","1.3.6.1.4.1.4115.1.20.1.1.7.9",2);
PingMgmt.PingPktsSent= new Scalar("PingPktsSent","1.3.6.1.4.1.4115.1.20.1.1.7.10",65);
PingMgmt.PingRepliesReceived= new Scalar("PingRepliesReceived","1.3.6.1.4.1.4115.1.20.1.1.7.11",65);
PingMgmt.PingRepliesVerified= new Scalar("PingRepliesVerified","1.3.6.1.4.1.4115.1.20.1.1.7.12",65);
PingMgmt.PingOctetsSent= new Scalar("PingOctetsSent","1.3.6.1.4.1.4115.1.20.1.1.7.13",65);
PingMgmt.PingOctetsReceived= new Scalar("PingOctetsReceived","1.3.6.1.4.1.4115.1.20.1.1.7.14",65);
PingMgmt.PingIcmpErrors= new Scalar("PingIcmpErrors","1.3.6.1.4.1.4115.1.20.1.1.7.15",65);
PingMgmt.PingLastIcmpError= new Scalar("PingLastIcmpError","1.3.6.1.4.1.4115.1.20.1.1.7.16",66);
var arPingTargetAddrType=PingMgmt.PingTargetAddrType;
var arPingTargetAddress=PingMgmt.PingTargetAddress;
var arPingNumPkts=PingMgmt.PingNumPkts;
var arPingPktSize=PingMgmt.PingPktSize;
var arPingInterval=PingMgmt.PingInterval;
var arPingTimeout=PingMgmt.PingTimeout;
var arPingVerifyReply=PingMgmt.PingVerifyReply;
var arPingIpStackNumber=PingMgmt.PingIpStackNumber;
var arPingStartStop=PingMgmt.PingStartStop;
var arPingPktsSent=PingMgmt.PingPktsSent;
var arPingRepliesReceived=PingMgmt.PingRepliesReceived;
var arPingRepliesVerified=PingMgmt.PingRepliesVerified;
var arPingOctetsSent=PingMgmt.PingOctetsSent;
var arPingOctetsReceived=PingMgmt.PingOctetsReceived;
var arPingIcmpErrors=PingMgmt.PingIcmpErrors;
var arPingLastIcmpError=PingMgmt.PingLastIcmpError;

var TraceRtMgmt = new Container("TraceRtMgmt", "1.3.6.1.4.1.4115.1.20.1.1.8");
TraceRtMgmt.TraceRtTargAddrType= new Scalar("TraceRtTargAddrType","1.3.6.1.4.1.4115.1.20.1.1.8.1",2);
TraceRtMgmt.TraceRtTargetAddr= new Scalar("TraceRtTargetAddr","1.3.6.1.4.1.4115.1.20.1.1.8.2",4, 1);
TraceRtMgmt.TraceRtMaxHops= new Scalar("TraceRtMaxHops","1.3.6.1.4.1.4115.1.20.1.1.8.3",2);
TraceRtMgmt.TraceRtDataSize= new Scalar("TraceRtDataSize","1.3.6.1.4.1.4115.1.20.1.1.8.4",2);
TraceRtMgmt.TraceRtResolveHosts= new Scalar("TraceRtResolveHosts","1.3.6.1.4.1.4115.1.20.1.1.8.5",2);
TraceRtMgmt.TraceRtBasePort= new Scalar("TraceRtBasePort","1.3.6.1.4.1.4115.1.20.1.1.8.6",2);
TraceRtMgmt.TraceRtStart= new Scalar("TraceRtStart","1.3.6.1.4.1.4115.1.20.1.1.8.7",2);
TraceRtMgmt.TraceRtLog= new Scalar("TraceRtLog","1.3.6.1.4.1.4115.1.20.1.1.8.8",4);
var arTraceRtTargAddrType=TraceRtMgmt.TraceRtTargAddrType;
var arTraceRtTargetAddr=TraceRtMgmt.TraceRtTargetAddr;
var arTraceRtMaxHops=TraceRtMgmt.TraceRtMaxHops;
var arTraceRtDataSize=TraceRtMgmt.TraceRtDataSize;
var arTraceRtResolveHosts=TraceRtMgmt.TraceRtResolveHosts;
var arTraceRtBasePort=TraceRtMgmt.TraceRtBasePort;
var arTraceRtStart=TraceRtMgmt.TraceRtStart;
var arTraceRtLog=TraceRtMgmt.TraceRtLog;

var ICtrl = new Container("ICtrl", "1.3.6.1.4.1.4115.1.20.1.1.10");
ICtrl.ICtrlPortMapCount= new Scalar("ICtrlPortMapCount","1.3.6.1.4.1.4115.1.20.1.1.10.1",2);
var arICtrlPortMapCount=ICtrl.ICtrlPortMapCount;

var ICtrlPortMapTable = new Table("ICtrlPortMapTable", "1.3.6.1.4.1.4115.1.20.1.1.10.2");
ICtrlPortMapTable.ICtrlPortMapIndex = new Column("ICtrlPortMapIndex","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.1",2);
ICtrlPortMapTable.PortMapDescription = new Column("PortMapDescription","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.2",4);
ICtrlPortMapTable.PortMapInternalClientAddrType = new Column("PortMapInternalClientAddrType","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.3",2);
ICtrlPortMapTable.PortMapInternalClientAddr = new Column("PortMapInternalClientAddr","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.4",4,1);
ICtrlPortMapTable.PortMapProtocol = new Column("PortMapProtocol","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.5",2);
ICtrlPortMapTable.PortMapExternalPort = new Column("PortMapExternalPort","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.6",66);
ICtrlPortMapTable.PortMapInternalPort = new Column("PortMapInternalPort","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.7",66);
ICtrlPortMapTable.PortMapRowStatus = new Column("PortMapRowStatus","1.3.6.1.4.1.4115.1.20.1.1.10.2.1.8",2);
// scm add x 4
ICtrlPortMapTable.PortMapInternalStartPort= new Column("PortMapInternalStartPort",	"1.3.6.1.4.1.4115.1.20.1.1.10.2.1.9",66);
ICtrlPortMapTable.PortMapInternalEndPort= new Column("PortMapInternalEndPort",			"1.3.6.1.4.1.4115.1.20.1.1.10.2.1.10",66);
ICtrlPortMapTable.PortMapExternalStartPort = new Column("PortMapExternalStartPort",	"1.3.6.1.4.1.4115.1.20.1.1.10.2.1.11",66);
ICtrlPortMapTable.PortMapExternalEndPort= new Column("PortMapExternalEndPort",			"1.3.6.1.4.1.4115.1.20.1.1.10.2.1.12",66);

var arICtrlPortMapIndex=ICtrlPortMapTable.ICtrlPortMapIndex;
var arPortMapDescription=ICtrlPortMapTable.PortMapDescription;
var arPortMapInternalClientAddrType=ICtrlPortMapTable.PortMapInternalClientAddrType;
var arPortMapInternalClientAddr=ICtrlPortMapTable.PortMapInternalClientAddr;
var arPortMapProtocol=ICtrlPortMapTable.PortMapProtocol;
var arPortMapExternalPort=ICtrlPortMapTable.PortMapExternalPort;
var arPortMapInternalPort=ICtrlPortMapTable.PortMapInternalPort;
var arPortMapRowStatus=ICtrlPortMapTable.PortMapRowStatus;
var arPortMapExternalStartPort = ICtrlPortMapTable.PortMapExternalStartPort;
var arPortMapExternalEndPort= ICtrlPortMapTable.PortMapExternalEndPort;
var arPortMapInternalStartPort= ICtrlPortMapTable.PortMapInternalStartPort;
var arPortMapInternalEndPort= ICtrlPortMapTable.PortMapInternalEndPort;



var ICtrlGetDeviceSettings = new Container("ICtrlGetDeviceSettings", "1.3.6.1.4.1.4115.1.20.1.1.10.3");
ICtrlGetDeviceSettings.ICtrlDeviceSettingsFWversion= new Scalar("ICtrlDeviceSettingsFWversion","1.3.6.1.4.1.4115.1.20.1.1.10.3.1",4);
var arICtrlDeviceSettingsFWversion=ICtrlGetDeviceSettings.ICtrlDeviceSettingsFWversion;

var ICtrlIsDeviceReady = new Container("ICtrlIsDeviceReady", "1.3.6.1.4.1.4115.1.20.1.1.10.4");
ICtrlIsDeviceReady.ICtrlDeviceStatus= new Scalar("ICtrlDeviceStatus","1.3.6.1.4.1.4115.1.20.1.1.10.4.1",2);
var arICtrlDeviceStatus=ICtrlIsDeviceReady.ICtrlDeviceStatus;

var ICtrlReboot = new Container("ICtrlReboot", "1.3.6.1.4.1.4115.1.20.1.1.10.5");
ICtrlReboot.ICtrlInitiateReboot= new Scalar("ICtrlInitiateReboot","1.3.6.1.4.1.4115.1.20.1.1.10.5.1",2);
var arICtrlInitiateReboot=ICtrlReboot.ICtrlInitiateReboot;

var ICtrlSetDeviceSettings = new Container("ICtrlSetDeviceSettings", "1.3.6.1.4.1.4115.1.20.1.1.10.6");
ICtrlSetDeviceSettings.ICtrlSetDeviceName= new Scalar("ICtrlSetDeviceName","1.3.6.1.4.1.4115.1.20.1.1.10.6.1",4);
ICtrlSetDeviceSettings.ICtrlSetAdminPassword= new Scalar("ICtrlSetAdminPassword","1.3.6.1.4.1.4115.1.20.1.1.10.6.2",4);
var arICtrlSetDeviceName=ICtrlSetDeviceSettings.ICtrlSetDeviceName;
var arICtrlSetAdminPassword=ICtrlSetDeviceSettings.ICtrlSetAdminPassword;

var ICtrlRouterSettings = new Container("ICtrlRouterSettings", "1.3.6.1.4.1.4115.1.20.1.1.10.7");
ICtrlRouterSettings.ICtrlRouterManageRemote= new Scalar("ICtrlRouterManageRemote","1.3.6.1.4.1.4115.1.20.1.1.10.7.1",2);
ICtrlRouterSettings.ICtrlRouterRemotePort= new Scalar("ICtrlRouterRemotePort","1.3.6.1.4.1.4115.1.20.1.1.10.7.2",66);
ICtrlRouterSettings.ICtrlRouterRemoteSSL= new Scalar("ICtrlRouterRemoteSSL","1.3.6.1.4.1.4115.1.20.1.1.10.7.3",2);
var arICtrlRouterManageRemote=ICtrlRouterSettings.ICtrlRouterManageRemote;
var arICtrlRouterRemotePort=ICtrlRouterSettings.ICtrlRouterRemotePort;
var arICtrlRouterRemoteSSL=ICtrlRouterSettings.ICtrlRouterRemoteSSL;

var ICtrlWLanRadioSettings = new Container("ICtrlWLanRadioSettings", "1.3.6.1.4.1.4115.1.20.1.1.10.8");
ICtrlWLanRadioSettings.ICtrlWLanRadioMacAddress= new Scalar("ICtrlWLanRadioMacAddress","1.3.6.1.4.1.4115.1.20.1.1.10.8.1",4,1);
ICtrlWLanRadioSettings.ICtrlWLanRadioChannelWidth= new Scalar("ICtrlWLanRadioChannelWidth","1.3.6.1.4.1.4115.1.20.1.1.10.8.2",66);
var arICtrlWLanRadioMacAddress=ICtrlWLanRadioSettings.ICtrlWLanRadioMacAddress;
var arICtrlWLanRadioChannelWidth=ICtrlWLanRadioSettings.ICtrlWLanRadioChannelWidth;

var ICtrlSetBridgeConnect = new Container("ICtrlSetBridgeConnect", "1.3.6.1.4.1.4115.1.20.1.1.10.9");
ICtrlSetBridgeConnect.ICtrlSetBridgeEthernetPort= new Scalar("ICtrlSetBridgeEthernetPort","1.3.6.1.4.1.4115.1.20.1.1.10.9.1",66);
ICtrlSetBridgeConnect.ICtrlSetBridgeMinutes= new Scalar("ICtrlSetBridgeMinutes","1.3.6.1.4.1.4115.1.20.1.1.10.9.2",66);
ICtrlSetBridgeConnect.ICtrlSetBridgePermanentPort4Enable= new Scalar("ICtrlSetBridgePermanentPort4Enable","1.3.6.1.4.1.4115.1.20.1.1.10.9.3",2);
var arICtrlSetBridgeEthernetPort=ICtrlSetBridgeConnect.ICtrlSetBridgeEthernetPort;
var arICtrlSetBridgeMinutes=ICtrlSetBridgeConnect.ICtrlSetBridgeMinutes;
var arRouterICtrlSetBridgePermanentPort4Enable=ICtrlSetBridgeConnect.ICtrlSetBridgePermanentPort4Enable;

var ICtrlGetWanSettings = new Container("ICtrlGetWanSettings", "1.3.6.1.4.1.4115.1.20.1.1.10.10");
ICtrlGetWanSettings.ICtrlGetWanType= new Scalar("ICtrlGetWanType","1.3.6.1.4.1.4115.1.20.1.1.10.10.2",4);
ICtrlGetWanSettings.ICtrlGetWanMTU= new Scalar("ICtrlGetWanMTU","1.3.6.1.4.1.4115.1.20.1.1.10.10.3",66);
ICtrlGetWanSettings.ICtrlGetWanPrefixLen= new Scalar("ICtrlGetWanPrefixLen","1.3.6.1.4.1.4115.1.20.1.1.10.10.4",66);
ICtrlGetWanSettings.ICtrlGetWanGatewayAddrType= new Scalar("ICtrlGetWanGatewayAddrType","1.3.6.1.4.1.4115.1.20.1.1.10.10.5",2);
ICtrlGetWanSettings.ICtrlGetWanGatewayAddr= new Scalar("ICtrlGetWanGatewayAddr","1.3.6.1.4.1.4115.1.20.1.1.10.10.6",4,1);
ICtrlGetWanSettings.ICtrlGetWanDNSPrimaryAddrType= new Scalar("ICtrlGetWanDNSPrimaryAddrType","1.3.6.1.4.1.4115.1.20.1.1.10.10.7",2);
ICtrlGetWanSettings.ICtrlGetWanDNSPrimaryAddr= new Scalar("ICtrlGetWanDNSPrimaryAddr","1.3.6.1.4.1.4115.1.20.1.1.10.10.8",4,1);
ICtrlGetWanSettings.ICtrlGetWanDNSSecondaryAddrType= new Scalar("ICtrlGetWanDNSSecondaryAddrType","1.3.6.1.4.1.4115.1.20.1.1.10.10.9",2);
ICtrlGetWanSettings.ICtrlGetWanDNSSecondaryAddr= new Scalar("ICtrlGetWanDNSSecondaryAddr","1.3.6.1.4.1.4115.1.20.1.1.10.10.10",4,1);
ICtrlGetWanSettings.ICtrlGetWanMacAddress= new Scalar("ICtrlGetWanMacAddress","1.3.6.1.4.1.4115.1.20.1.1.10.10.11",4,1);
var arICtrlGetWanType=ICtrlGetWanSettings.ICtrlGetWanType;
var arICtrlGetWanMTU=ICtrlGetWanSettings.ICtrlGetWanMTU;
var arICtrlGetWanPrefixLen=ICtrlGetWanSettings.ICtrlGetWanPrefixLen;
var arICtrlGetWanGatewayAddrType=ICtrlGetWanSettings.ICtrlGetWanGatewayAddrType;
var arICtrlGetWanGatewayAddr=ICtrlGetWanSettings.ICtrlGetWanGatewayAddr;
var arICtrlGetWanDNSPrimaryAddrType=ICtrlGetWanSettings.ICtrlGetWanDNSPrimaryAddrType;
var arICtrlGetWanDNSPrimaryAddr=ICtrlGetWanSettings.ICtrlGetWanDNSPrimaryAddr;
var arICtrlGetWanDNSSecondaryAddrType=ICtrlGetWanSettings.ICtrlGetWanDNSSecondaryAddrType;
var arICtrlGetWanDNSSecondaryAddr=ICtrlGetWanSettings.ICtrlGetWanDNSSecondaryAddr;
var arICtrlGetWanMacAddress=ICtrlGetWanSettings.ICtrlGetWanMacAddress;

ICtrl.ICtrlPortMapTableEnabled= new Scalar("ICtrlPortMapTableEnabled","1.3.6.1.4.1.4115.1.20.1.1.10.14",2);
var arICtrlPortMapTableEnabled=ICtrl.ICtrlPortMapTableEnabled;

var mib2system = new Container("mib2system", "1.3.6.1.2.1.1");
mib2system.sysName= new Scalar("mib2sysname","1.3.6.1.2.1.1.5",4);
mib2system.sysDescr= new Scalar("mib2sysdescr","1.3.6.1.2.1.1.1",4);
mib2system.sysTime= new Scalar("mib2systime","1.3.6.1.2.1.1.3",0x43);
mib2system.sysContact= new Scalar("mib2syscontact","1.3.6.1.2.1.1.4",4);

var docsdevBase = new Container("docsdevBase", "1.3.6.1.2.1.69.1.1");
docsdevBase.DateTime = new Scalar("DateTime","1.3.6.1.2.1.69.1.1.2",4,1);
docsdevBase.ResetNow = new Scalar("ResetNow","1.3.6.1.2.1.69.1.1.3",2);
docsdevBase.SerialNumber = new Scalar("SerialNumber","1.3.6.1.2.1.69.1.1.4",4);

var docsDevSoftware = new Container("docsDevSoftware", "1.3.6.1.2.1.69.1.3");
docsDevSoftware.CurrentVers = new Scalar("CurrentVers", "1.3.6.1.2.1.69.1.3.5",4);

var mib2interface = new Container("mib2interface", "1.3.6.1.2.1.2");
mib2interface.ifNumber= new Scalar("mib2interfaceNumber","1.3.6.1.2.1.2.1",2);
var mib2iftable = new Table("mib2iftable", "1.3.6.1.2.1.2.2");
mib2iftable.ifIndex = new Column("ifIndex","1.3.6.1.2.1.2.2.1.1",2);
mib2iftable.ifDescr = new Column("ifDescr","1.3.6.1.2.1.2.2.1.2",4);
mib2iftable.ifType = new Column("ifType","1.3.6.1.2.1.2.2.1.3",2);
mib2iftable.ifMtu = new Column("ifMtu","1.3.6.1.2.1.2.2.1.4",2);
mib2iftable.ifSpeed =      new Column("ifSpeed",     "1.3.6.1.2.1.2.2.1.5",0x42);
mib2iftable.ifPhyAddress = new Column("ifPhyAddress","1.3.6.1.2.1.2.2.1.6",4,1);
mib2iftable.ifOperStatus = new Column("ifOperStatus","1.3.6.1.2.1.2.2.1.8",2);
// scm start
mib2iftable.ifUpTime =     new Column("ifUpTime",    "1.3.6.1.2.1.2.2.1.9",4,1);
// scm end

var arrisCmDoc30Software = new Container("arrisCmDoc30Software", "1.3.6.1.4.1.4115.1.3.4.1.5");
arrisCmDoc30Software.RegistrationState = new Scalar("arrisCmDoc30SwRegistrationState","1.3.6.1.4.1.4115.1.3.4.1.5.9",2);
var arrisCmDoc30DhcpSvrParameters = new Container("arrisCmDoc30DhcpSvrParameters", "1.3.6.1.4.1.4115.1.3.4.1.4.2");
arrisCmDoc30DhcpSvrParameters.TimeSvrIpAddr = new Scalar("arrisCmDoc30DhcpTimeSvrIpAddr","1.3.6.1.4.1.4115.1.3.4.1.4.2.4",4,1);
arrisCmDoc30DhcpSvrParameters.PrimaryDhcpServerIpAddr = new Scalar("arrisCmDoc30DhcpPrimaryDhcpServerIpAddr","1.3.6.1.4.1.4115.1.3.4.1.4.2.2",4,1);
arrisCmDoc30DhcpSvrParameters.TftpSvrIpAddr = new Scalar("arrisCmDoc30DhcpTftpSvrIpAddr","1.3.6.1.4.1.4115.1.3.4.1.4.2.3",4,1);
arrisCmDoc30DhcpSvrParameters.TimeOffset = new Scalar("arrisCmDoc30DhcpCmTimeOffset","1.3.6.1.4.1.4115.1.3.4.1.4.2.5",2);
arrisCmDoc30DhcpSvrParameters.PrimaryTeleDhcpSvr = new Scalar("arrisCmDoc30DhcpPrimaryTeleDhcpSvr","1.3.6.1.4.1.4115.1.3.4.1.4.2.6",4,1);
arrisCmDoc30DhcpSvrParameters.SecondaryTeleDhcpSvr = new Scalar("arrisCmDoc30DhcpSecondaryTeleDhcpSvr","1.3.6.1.4.1.4115.1.3.4.1.4.2.7",4,1);
var arCmDoc30DhcpPrimaryDhcpServerIpAddr = arrisCmDoc30DhcpSvrParameters.PrimaryDhcpServerIpAddr;
var arCmDoc30DhcpTftpSvrIpAddr = arrisCmDoc30DhcpSvrParameters.TftpSvrIpAddr;
var arCmDoc30DhcpTimeSvrIpAddr = arrisCmDoc30DhcpSvrParameters.TimeSvrIpAddr;
var arCmDoc30DhcpTimeOffset = arrisCmDoc30DhcpSvrParameters.TimeOffset;
var arCmDoc30DhcpPrimaryTeleDhcpSvr = arrisCmDoc30DhcpSvrParameters.PrimaryTeleDhcpSvr;
var arCmDoc30DhcpSecondaryTeleDhcpSvr = arrisCmDoc30DhcpSvrParameters.SecondaryTeleDhcpSvr;


var arrisCmDoc30DhcpCmParameters = new Container("arrisCmDoc30DhcpCmParameters", "1.3.6.1.4.1.4115.1.3.4.1.4.3");
arrisCmDoc30DhcpCmParameters.CmIpAddr = new Scalar("arrisCmDoc30DhcpCmIpAddr","1.3.6.1.4.1.4115.1.3.4.1.4.3.2",4,1);
arrisCmDoc30DhcpCmParameters.CmSubNetMask = new Scalar("arrisCmDoc30DhcpCmSubNetMask","1.3.6.1.4.1.4115.1.3.4.1.4.3.3",4,1);
arrisCmDoc30DhcpCmParameters.CmGatewayIpAddr = new Scalar("arrisCmDoc30DhcpCmGatewayIpAddr","1.3.6.1.4.1.4115.1.3.4.1.4.3.4",4,1);
arrisCmDoc30DhcpCmParameters.CmConfigFile = new Scalar("arrisCmDoc30DhcpCmConfigFile","1.3.6.1.4.1.4115.1.3.4.1.4.3.5",4);
var arCmDoc30DhcpCmIpAddr = arrisCmDoc30DhcpCmParameters.CmIpAddr;
var arCmDoc30DhcpCmSubNetMask = arrisCmDoc30DhcpCmParameters.CmSubNetMask;
var arCmDoc30DhcpCmGatewayIpAddr = arrisCmDoc30DhcpCmParameters.CmGatewayIpAddr;
var arCmDoc30DhcpCmConfigFile = arrisCmDoc30DhcpCmParameters.CmConfigFile;

var arrisCmDoc30Setup = new Container("arrisCmDoc30Setup", "1.3.6.1.4.1.4115.1.3.4.1.3");
arrisCmDoc30Setup.MddIpModeOverride = new Scalar("arrisCmDoc30SetupMddIpModeOverride","1.3.6.1.4.1.4115.1.3.4.1.3.7",2);
var arCmDoc30SetupMddIpModeOverride = arrisCmDoc30Setup.MddIpModeOverride;

var arrisCmDoc30Base = new Container("arrisCmDoc30Base", "1.3.6.1.4.1.4115.1.3.4.1.1");
arrisCmDoc30Base.TodStatus = new Scalar("arrisCmDoc30BaseTodStatus","1.3.6.1.4.1.4115.1.3.4.1.1.14",2);
var arCmDoc30BaseTodStatus = arrisCmDoc30Base.TodStatus;

var docsIfDownstreamChannelTable = new Table("docsIfDownstreamChannelTable", "1.3.6.1.2.1.10.127.1.1.1");
docsIfDownstreamChannelTable.Frequency = new Column("docsIfDownChannelFrequency","1.3.6.1.2.1.10.127.1.1.1.1.2",2);
docsIfDownstreamChannelTable.Power = new Column("docsIfDownChannelPower","1.3.6.1.2.1.10.127.1.1.1.1.6",2);
docsIfDownstreamChannelTable.Modulation = new Column("docsIfDownChannelModulation","1.3.6.1.2.1.10.127.1.1.1.1.4",2);

var docsIfSignalQualityTable = new Table("docsIfSignalQualityTable", "1.3.6.1.2.1.10.127.1.1.4");
docsIfSignalQualityTable.SignalNoise = new Column("docsIfSigQSignalNoise","1.3.6.1.2.1.10.127.1.1.4.1.5",2);
docsIfSignalQualityTable.Unerroreds = new Column("docsIfSigQUnerroreds","1.3.6.1.2.1.10.127.1.1.4.1.2",0x41);
docsIfSignalQualityTable.Correcteds = new Column("docsIfSigQCorrecteds","1.3.6.1.2.1.10.127.1.1.4.1.3",0x41);
docsIfSignalQualityTable.Uncorrectables = new Column("docsIfSigQUncorrectables","1.3.6.1.2.1.10.127.1.1.4.1.4",0x41);

var docsIfUpstreamChannelTable = new Table("docsIfUpstreamChannelTable", "1.3.6.1.2.1.10.127.1.1.2");
docsIfUpstreamChannelTable.ChannelId = new Column("docsIfUpChannelId","1.3.6.1.2.1.10.127.1.1.2.1.1",2);
docsIfUpstreamChannelTable.Frequency = new Column("docsIfUpChannelFrequency","1.3.6.1.2.1.10.127.1.1.2.1.2",2);
docsIfUpstreamChannelTable.Status = new Column("docsIfUpChannelStatus","1.3.6.1.2.1.10.127.1.1.2.1.18",2);

var arrisCmDoc30IfUpstreamChannelExtendedTable = new Table("arrisCmDoc30IfUpstreamChannelExtendedTable", "1.3.6.1.4.1.4115.1.3.4.1.9.2");
arrisCmDoc30IfUpstreamChannelExtendedTable.SymbolRate = new Column("arrisCmDoc30IfUpChannelExtendedSymbolRate","1.3.6.1.4.1.4115.1.3.4.1.9.2.1.2",2);
/*  kSym/s */
arrisCmDoc30IfUpstreamChannelExtendedTable.Modulation = new Column("arrisCmDoc30IfUpChannelExtendedModulation","1.3.6.1.4.1.4115.1.3.4.1.9.2.1.3",2);
/*  1: qpsk(1)  2: qam8(2)  3: qam16(3)  4: qam32(4)  5: qam64(5)  6: qam128(6)   7: qam256(7)   8: err(-1) */

var docsIf3CmStatusUsTable = new Table("docsIf3CmStatusUsTable", "1.3.6.1.4.1.4491.2.1.20.1.2");
docsIf3CmStatusUsTable.TxPower = new Column("docsIf3CmStatusUsTxPower","1.3.6.1.4.1.4491.2.1.20.1.2.1.1",2);

var docsIf3CmStatusTable = new Table("docsIf3CmStatusTable", "1.3.6.1.4.1.4491.2.1.20.1.1");
docsIf3CmStatusTable.docsIf3CmStatusValue = new Column("docsIf3CmStatusValue","1.3.6.1.4.1.4491.2.1.20.1.1.1.1",2);
var ardocsIf3CmStatusValue=docsIf3CmStatusTable.docsIf3CmStatusValue;


// no need to load trigger
MibObjects.loaded = true;


//
// MoCA
//


var mocaIfConfigTable = new Table("mocaIfConfigTable", "1.3.6.1.4.1.31621.1.1.1.1");
mocaIfConfigTable.mocaIfEnable = new Column("mocaIfEnable", "1.3.6.1.4.1.31621.1.1.1.1.1.1", 2);
mocaIfConfigTable.mocaIfChannelMask = new Column("mocaIfChannelMask", "1.3.6.1.4.1.31621.1.1.1.1.1.2", 66);
mocaIfConfigTable.mocaIfPowerControl = new Column("mocaIfPowerControl", "1.3.6.1.4.1.31621.1.1.1.1.1.3", 2);
mocaIfConfigTable.mocaIfTxPowerLimit = new Column("mocaIfTxPowerLimit", "1.3.6.1.4.1.31621.1.1.1.1.1.4", 66);
mocaIfConfigTable.mocaIfBeaconPowerLimit = new Column("mocaIfBeaconPowerLimit", "1.3.6.1.4.1.31621.1.1.1.1.1.5", 66);
mocaIfConfigTable.mocaIfPowerControlTargetRate = new Column("mocaIfPowerControlTargetRate", "1.3.6.1.4.1.31621.1.1.1.1.1.6", 66);
mocaIfConfigTable.mocaIfPrivacyEnable = new Column("mocaIfPrivacyEnable", "1.3.6.1.4.1.31621.1.1.1.1.1.7", 2);
mocaIfConfigTable.mocaIfPassword = new Column("mocaIfPassword", "1.3.6.1.4.1.31621.1.1.1.1.1.8", 4);
mocaIfConfigTable.mocaIfPreferredNC = new Column("mocaIfPreferredNC", "1.3.6.1.4.1.31621.1.1.1.1.1.9", 2);
mocaIfConfigTable.mocaIfAccessEnable = new Column("mocaIfAccessEnable", "1.3.6.1.4.1.31621.1.1.1.1.1.10", 2);
mocaIfConfigTable.mocaIfPhyThreshold = new Column("mocaIfPhyThreshold", "1.3.6.1.4.1.31621.1.1.1.1.1.11", 66);
mocaIfConfigTable.mocaIfPhyThresholdEnable = new Column("mocaIfPhyThresholdEnable", "1.3.6.1.4.1.31621.1.1.1.1.1.12", 2);
mocaIfConfigTable.mocaIfStatusChangeEnable = new Column("mocaIfStatusChangeEnable", "1.3.6.1.4.1.31621.1.1.1.1.1.13", 2);
mocaIfConfigTable.mocaIfNumNodesChangeEnable = new Column("mocaIfNumNodesChangeEnable", "1.3.6.1.4.1.31621.1.1.1.1.1.14", 2);
var mocaIfEnable = mocaIfConfigTable.mocaIfEnable;
var mocaIfChannelMask = mocaIfConfigTable.mocaIfChannelMask;
var mocaIfPowerControl = mocaIfConfigTable.mocaIfPowerControl;
var mocaIfTxPowerLimit = mocaIfConfigTable.mocaIfTxPowerLimit;
var mocaIfBeaconPowerLimit = mocaIfConfigTable.mocaIfBeaconPowerLimit;
var mocaIfPowerControlTargetRate = mocaIfConfigTable.mocaIfPowerControlTargetRate;
var mocaIfPrivacyEnable = mocaIfConfigTable.mocaIfPrivacyEnable;
var mocaIfPassword = mocaIfConfigTable.mocaIfPassword;
var mocaIfPreferredNC = mocaIfConfigTable.mocaIfPreferredNC;
var mocaIfAccessEnable = mocaIfConfigTable.mocaIfAccessEnable;
var mocaIfPhyThreshold = mocaIfConfigTable.mocaIfPhyThreshold;
var mocaIfPhyThresholdEnable = mocaIfConfigTable.mocaIfPhyThresholdEnable;
var mocaIfStatusChangeEnable = mocaIfConfigTable.mocaIfStatusChangeEnable;
var mocaIfNumNodesChangeEnable = mocaIfConfigTable.mocaIfNumNodesChangeEnable;

var mocaIfAccessTable = new Table("mocaIfAccessTable", "1.3.6.1.4.1.31621.1.1.1.2");
mocaIfAccessTable.mocaIfAccessIndex = new Column("mocaIfAccessIndex", "1.3.6.1.4.1.31621.1.1.1.2.1.1", 2);
mocaIfAccessTable.mocaIfAccessMacAddress = new Column("mocaIfAccessMacAddress", "1.3.6.1.4.1.31621.1.1.1.2.1.2", 4,1);
mocaIfAccessTable.mocaIfAccessStatus = new Column("mocaIfAccessStatus", "1.3.6.1.4.1.31621.1.1.1.2.1.3", 2);
var mocaIfAccessIndex = mocaIfAccessTable.mocaIfAccessIndex;
var mocaIfAccessMacAddress = mocaIfAccessTable.mocaIfAccessMacAddress;
var mocaIfAccessStatus = mocaIfAccessTable.mocaIfAccessStatus;

var mocaIfStatusTable = new Table("mocaIfStatusTable", "1.3.6.1.4.1.31621.1.1.1.3");
mocaIfStatusTable.mocaIfStatus = new Column("mocaIfStatus", "1.3.6.1.4.1.31621.1.1.1.3.1.1", 2);
mocaIfStatusTable.mocaIfLinkUpTime = new Column("mocaIfLinkUpTime", "1.3.6.1.4.1.31621.1.1.1.3.1.2", 66);
mocaIfStatusTable.mocaIfSoftwareVersion = new Column("mocaIfSoftwareVersion", "1.3.6.1.4.1.31621.1.1.1.3.1.3", 4);
mocaIfStatusTable.mocaIfMocaVersion = new Column("mocaIfMocaVersion", "1.3.6.1.4.1.31621.1.1.1.3.1.4", 2);
mocaIfStatusTable.mocaIfNetworkVersion = new Column("mocaIfNetworkVersion", "1.3.6.1.4.1.31621.1.1.1.3.1.5", 2);
mocaIfStatusTable.mocaIfMacAddress = new Column("mocaIfMacAddress", "1.3.6.1.4.1.31621.1.1.1.3.1.6", 4,1);
mocaIfStatusTable.mocaIfNodeID = new Column("mocaIfNodeID", "1.3.6.1.4.1.31621.1.1.1.3.1.7", 66);
mocaIfStatusTable.mocaIfName = new Column("mocaIfName", "1.3.6.1.4.1.31621.1.1.1.3.1.8", 4);
mocaIfStatusTable.mocaIfNumNodes = new Column("mocaIfNumNodes", "1.3.6.1.4.1.31621.1.1.1.3.1.9", 66);
mocaIfStatusTable.mocaIfNC = new Column("mocaIfNC", "1.3.6.1.4.1.31621.1.1.1.3.1.10", 66);
mocaIfStatusTable.mocaIfBackupNC = new Column("mocaIfBackupNC", "1.3.6.1.4.1.31621.1.1.1.3.1.11", 66);
mocaIfStatusTable.mocaIfRFChannel = new Column("mocaIfRFChannel", "1.3.6.1.4.1.31621.1.1.1.3.1.12", 2);
mocaIfStatusTable.mocaIfLOF = new Column("mocaIfLOF", "1.3.6.1.4.1.31621.1.1.1.3.1.13", 2);
mocaIfStatusTable.mocaIfTabooChannelMask = new Column("mocaIfTabooChannelMask", "1.3.6.1.4.1.31621.1.1.1.3.1.14", 66);
mocaIfStatusTable.mocaIfNodeTabooChannelMask = new Column("mocaIfNodeTabooChannelMask", "1.3.6.1.4.1.31621.1.1.1.3.1.15", 66);
mocaIfStatusTable.mocaIfCapabilityMask = new Column("mocaIfCapabilityMask", "1.3.6.1.4.1.31621.1.1.1.3.1.16", 66);
mocaIfStatusTable.mocaIfTxGcdPowerReduction = new Column("mocaIfTxGcdPowerReduction", "1.3.6.1.4.1.31621.1.1.1.3.1.17", 66);
mocaIfStatusTable.mocaIfQAM256Capable = new Column("mocaIfQAM256Capable", "1.3.6.1.4.1.31621.1.1.1.3.1.18", 2);
mocaIfStatusTable.mocaIfPacketsAggrCapability = new Column("mocaIfPacketsAggrCapability", "1.3.6.1.4.1.31621.1.1.1.3.1.19", 2);
mocaIfStatusTable.mocaIfMaxIngressNodeBw = new Column("mocaIfMaxIngressNodeBw", "1.3.6.1.4.1.31621.1.1.1.3.1.20", 66);
mocaIfStatusTable.mocaIfMaxEgressNodeBw = new Column("mocaIfMaxEgressNodeBw", "1.3.6.1.4.1.31621.1.1.1.3.1.21", 66);
mocaIfStatusTable.mocaIfTxGcdRate = new Column("mocaIfTxGcdRate", "1.3.6.1.4.1.31621.1.1.1.3.1.22", 66);
var mocaIfStatus = mocaIfStatusTable.mocaIfStatus;
var mocaIfLinkUpTime = mocaIfStatusTable.mocaIfLinkUpTime;
var mocaIfSoftwareVersion = mocaIfStatusTable.mocaIfSoftwareVersion;
var mocaIfMocaVersion = mocaIfStatusTable.mocaIfMocaVersion;
var mocaIfNetworkVersion = mocaIfStatusTable.mocaIfNetworkVersion;
var mocaIfMacAddress = mocaIfStatusTable.mocaIfMacAddress;
var mocaIfNodeID = mocaIfStatusTable.mocaIfNodeID;
var mocaIfName = mocaIfStatusTable.mocaIfName;
var mocaIfNumNodes = mocaIfStatusTable.mocaIfNumNodes;
var mocaIfNC = mocaIfStatusTable.mocaIfNC;
var mocaIfBackupNC = mocaIfStatusTable.mocaIfBackupNC;
var mocaIfRFChannel = mocaIfStatusTable.mocaIfRFChannel;
var mocaIfLOF = mocaIfStatusTable.mocaIfLOF;
var mocaIfTabooChannelMask = mocaIfStatusTable.mocaIfTabooChannelMask;
var mocaIfNodeTabooChannelMask = mocaIfStatusTable.mocaIfNodeTabooChannelMask;
var mocaIfCapabilityMask = mocaIfStatusTable.mocaIfCapabilityMask;
var mocaIfTxGcdPowerReduction = mocaIfStatusTable.mocaIfTxGcdPowerReduction;
var mocaIfQAM256Capable = mocaIfStatusTable.mocaIfQAM256Capable;
var mocaIfPacketsAggrCapability = mocaIfStatusTable.mocaIfPacketsAggrCapability;
var mocaIfMaxIngressNodeBw = mocaIfStatusTable.mocaIfMaxIngressNodeBw;
var mocaIfMaxEgressNodeBw = mocaIfStatusTable.mocaIfMaxEgressNodeBw;
var mocaIfTxGcdRate = mocaIfStatusTable.mocaIfTxGcdRate;

var mocaIfStatsTable = new Table("mocaIfStatsTable", "1.3.6.1.4.1.31621.1.1.1.4");
mocaIfStatsTable.mocaIfTxPackets = new Column("mocaIfTxPackets", "1.3.6.1.4.1.31621.1.1.1.4.1.1", 65);
mocaIfStatsTable.mocaIfTxDrops = new Column("mocaIfTxDrops", "1.3.6.1.4.1.31621.1.1.1.4.1.2", 65);
mocaIfStatsTable.mocaIfRxPackets = new Column("mocaIfRxPackets", "1.3.6.1.4.1.31621.1.1.1.4.1.3", 65);
mocaIfStatsTable.mocaIfRxCorrectedErrors = new Column("mocaIfRxCorrectedErrors", "1.3.6.1.4.1.31621.1.1.1.4.1.4", 65);
mocaIfStatsTable.mocaIfRxDrops = new Column("mocaIfRxDrops", "1.3.6.1.4.1.31621.1.1.1.4.1.5", 65);
mocaIfStatsTable.mocaIfEgressNodeNumFlows = new Column("mocaIfEgressNodeNumFlows", "1.3.6.1.4.1.31621.1.1.1.4.1.6", 66);
mocaIfStatsTable.mocaIfIngressNodeNumFlows = new Column("mocaIfIngressNodeNumFlows", "1.3.6.1.4.1.31621.1.1.1.4.1.7", 66);
var mocaIfTxPackets = mocaIfStatsTable.mocaIfTxPackets;
var mocaIfTxDrops = mocaIfStatsTable.mocaIfTxDrops;
var mocaIfRxPackets = mocaIfStatsTable.mocaIfRxPackets;
var mocaIfRxCorrectedErrors = mocaIfStatsTable.mocaIfRxCorrectedErrors;
var mocaIfRxDrops = mocaIfStatsTable.mocaIfRxDrops;
var mocaIfEgressNodeNumFlows = mocaIfStatsTable.mocaIfEgressNodeNumFlows;
var mocaIfIngressNodeNumFlows = mocaIfStatsTable.mocaIfIngressNodeNumFlows;

var mocaIfFlowStatsTable = new Table("mocaIfFlowStatsTable", "1.3.6.1.4.1.31621.1.1.1.5");
mocaIfFlowStatsTable.mocaIfFlowIndex = new Column("mocaIfFlowIndex", "1.3.6.1.4.1.31621.1.1.1.5.1.1", 2);
mocaIfFlowStatsTable.mocaIfFlowID = new Column("mocaIfFlowID", "1.3.6.1.4.1.31621.1.1.1.5.1.2", 4);
mocaIfFlowStatsTable.mocaIfPacketDA = new Column("mocaIfPacketDA", "1.3.6.1.4.1.31621.1.1.1.5.1.3", 4,1);
mocaIfFlowStatsTable.mocaIfPeakDataRate = new Column("mocaIfPeakDataRate", "1.3.6.1.4.1.31621.1.1.1.5.1.4", 66);
mocaIfFlowStatsTable.mocaIfBurstSize = new Column("mocaIfBurstSize", "1.3.6.1.4.1.31621.1.1.1.5.1.5", 66);
mocaIfFlowStatsTable.mocaIfLeaseTime = new Column("mocaIfLeaseTime", "1.3.6.1.4.1.31621.1.1.1.5.1.6", 66);
mocaIfFlowStatsTable.mocaIfFlowTag = new Column("mocaIfFlowTag", "1.3.6.1.4.1.31621.1.1.1.5.1.7", 66);
mocaIfFlowStatsTable.mocaIfLeaseTimeLeft = new Column("mocaIfLeaseTimeLeft", "1.3.6.1.4.1.31621.1.1.1.5.1.8", 66);
mocaIfFlowStatsTable.mocaIfTxPacketsOnePacketAggr = new Column("mocaIfTxPacketsOnePacketAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.9", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsTwoPacketsAggr = new Column("mocaIfTxPacketsTwoPacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.10", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsThreePacketsAggr = new Column("mocaIfTxPacketsThreePacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.11", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsFourPacketsAggr = new Column("mocaIfTxPacketsFourPacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.12", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsFivePacketsAggr = new Column("mocaIfTxPacketsFivePacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.13", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsSixPacketsAggr = new Column("mocaIfTxPacketsSixPacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.14", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsSevenPacketsAggr = new Column("mocaIfTxPacketsSevenPacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.15", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsEightPacketsAggr = new Column("mocaIfTxPacketsEightPacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.16", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsNinePacketsAggr = new Column("mocaIfTxPacketsNinePacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.17", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsTenPacketsAggr = new Column("mocaIfTxPacketsTenPacketsAggr", "1.3.6.1.4.1.31621.1.1.1.5.1.18", 65);
mocaIfFlowStatsTable.mocaIfTxPacketsFlow = new Column("mocaIfTxPacketsFlow", "1.3.6.1.4.1.31621.1.1.1.5.1.19", 66);
var mocaIfFlowIndex = mocaIfFlowStatsTable.mocaIfFlowIndex;
var mocaIfFlowID = mocaIfFlowStatsTable.mocaIfFlowID;
var mocaIfPacketDA = mocaIfFlowStatsTable.mocaIfPacketDA;
var mocaIfPeakDataRate = mocaIfFlowStatsTable.mocaIfPeakDataRate;
var mocaIfBurstSize = mocaIfFlowStatsTable.mocaIfBurstSize;
var mocaIfLeaseTime = mocaIfFlowStatsTable.mocaIfLeaseTime;
var mocaIfFlowTag = mocaIfFlowStatsTable.mocaIfFlowTag;
var mocaIfLeaseTimeLeft = mocaIfFlowStatsTable.mocaIfLeaseTimeLeft;
var mocaIfTxPacketsOnePacketAggr = mocaIfFlowStatsTable.mocaIfTxPacketsOnePacketAggr;
var mocaIfTxPacketsTwoPacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsTwoPacketsAggr;
var mocaIfTxPacketsThreePacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsThreePacketsAggr;
var mocaIfTxPacketsFourPacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsFourPacketsAggr;
var mocaIfTxPacketsFivePacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsFivePacketsAggr;
var mocaIfTxPacketsSixPacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsSixPacketsAggr;
var mocaIfTxPacketsSevenPacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsSevenPacketsAggr;
var mocaIfTxPacketsEightPacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsEightPacketsAggr;
var mocaIfTxPacketsNinePacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsNinePacketsAggr;
var mocaIfTxPacketsTenPacketsAggr = mocaIfFlowStatsTable.mocaIfTxPacketsTenPacketsAggr;
var mocaIfTxPacketsFlow = mocaIfFlowStatsTable.mocaIfTxPacketsFlow;

var mocaNodeTable = new Table("mocaNodeTable", "1.3.6.1.4.1.31621.1.1.1.6");
mocaNodeTable.mocaNodeIndex = new Column("mocaNodeIndex", "1.3.6.1.4.1.31621.1.1.1.6.1.1", 66);
mocaNodeTable.mocaNodeMocaVersion = new Column("mocaNodeMocaVersion", "1.3.6.1.4.1.31621.1.1.1.6.1.2", 2);
mocaNodeTable.mocaNodeMacAddress = new Column("mocaNodeMacAddress", "1.3.6.1.4.1.31621.1.1.1.6.1.3", 4,1);
mocaNodeTable.mocaNodeTxGcdRate = new Column("mocaNodeTxGcdRate", "1.3.6.1.4.1.31621.1.1.1.6.1.4", 66);
mocaNodeTable.mocaNodeRxGcdPower = new Column("mocaNodeRxGcdPower", "1.3.6.1.4.1.31621.1.1.1.6.1.5", 2);
mocaNodeTable.mocaNodeTxPowerReduction = new Column("mocaNodeTxPowerReduction", "1.3.6.1.4.1.31621.1.1.1.6.1.6", 66);
mocaNodeTable.mocaNodeRxPower = new Column("mocaNodeRxPower", "1.3.6.1.4.1.31621.1.1.1.6.1.7", 2);
mocaNodeTable.mocaNodePreferredNC = new Column("mocaNodePreferredNC", "1.3.6.1.4.1.31621.1.1.1.6.1.8", 2);
mocaNodeTable.mocaNodeQAM256Capable = new Column("mocaNodeQAM256Capable", "1.3.6.1.4.1.31621.1.1.1.6.1.9", 2);
mocaNodeTable.mocaNodePacketsAggrCapability = new Column("mocaNodePacketsAggrCapability", "1.3.6.1.4.1.31621.1.1.1.6.1.10", 2);
mocaNodeTable.mocaNodeRxPackets = new Column("mocaNodeRxPackets", "1.3.6.1.4.1.31621.1.1.1.6.1.11", 65);
mocaNodeTable.mocaNodeRxCorrected = new Column("mocaNodeRxCorrected", "1.3.6.1.4.1.31621.1.1.1.6.1.12", 65);
mocaNodeTable.mocaNodeRxDrops = new Column("mocaNodeRxDrops", "1.3.6.1.4.1.31621.1.1.1.6.1.13", 65);
mocaNodeTable.mocaNodeSNR = new Column("mocaNodeSNR", "1.3.6.1.4.1.31621.1.1.1.6.1.14", 66);
var mocaNodeIndex = mocaNodeTable.mocaNodeIndex;
var mocaNodeMocaVersion = mocaNodeTable.mocaNodeMocaVersion;
var mocaNodeMacAddress = mocaNodeTable.mocaNodeMacAddress;
var mocaNodeTxGcdRate = mocaNodeTable.mocaNodeTxGcdRate;
var mocaNodeRxGcdPower = mocaNodeTable.mocaNodeRxGcdPower;
var mocaNodeTxPowerReduction = mocaNodeTable.mocaNodeTxPowerReduction;
var mocaNodeRxPower = mocaNodeTable.mocaNodeRxPower;
var mocaNodePreferredNC = mocaNodeTable.mocaNodePreferredNC;
var mocaNodeQAM256Capable = mocaNodeTable.mocaNodeQAM256Capable;
var mocaNodePacketsAggrCapability = mocaNodeTable.mocaNodePacketsAggrCapability;
var mocaNodeRxPackets = mocaNodeTable.mocaNodeRxPackets;
var mocaNodeRxCorrected = mocaNodeTable.mocaNodeRxCorrected;
var mocaNodeRxDrops = mocaNodeTable.mocaNodeRxDrops;
var mocaNodeSNR = mocaNodeTable.mocaNodeSNR;

var mocaMeshTable = new Table("mocaMeshTable", "1.3.6.1.4.1.31621.1.1.1.7");
mocaMeshTable.mocaMeshTxNodeIndex = new Column("mocaMeshTxNodeIndex", "1.3.6.1.4.1.31621.1.1.1.7.1.1", 66);
mocaMeshTable.mocaMeshRxNodeIndex = new Column("mocaMeshRxNodeIndex", "1.3.6.1.4.1.31621.1.1.1.7.1.2", 66);
mocaMeshTable.mocaMeshTxRate = new Column("mocaMeshTxRate", "1.3.6.1.4.1.31621.1.1.1.7.1.3", 66);
var mocaMeshTxNodeIndex = mocaMeshTable.mocaMeshTxNodeIndex;
var mocaMeshRxNodeIndex = mocaMeshTable.mocaMeshRxNodeIndex;
var mocaMeshTxRate = mocaMeshTable.mocaMeshTxRate;

var mocaBridgeTable = new Table("mocaBridgeTable", "1.3.6.1.4.1.31621.1.1.1.8");
mocaBridgeTable.mocaBridgeNodeIndex = new Column("mocaBridgeNodeIndex", "1.3.6.1.4.1.31621.1.1.1.8.1.1", 66);
mocaBridgeTable.mocaBridgeMacIndex = new Column("mocaBridgeMacIndex", "1.3.6.1.4.1.31621.1.1.1.8.1.2", 2);
mocaBridgeTable.mocaBridgeMacAddress = new Column("mocaBridgeMacAddress", "1.3.6.1.4.1.31621.1.1.1.8.1.3", 4,1);
var mocaBridgeNodeIndex = mocaBridgeTable.mocaBridgeNodeIndex;
var mocaBridgeMacIndex = mocaBridgeTable.mocaBridgeMacIndex;
var mocaBridgeMacAddress = mocaBridgeTable.mocaBridgeMacAddress;


var arrisMtaDevLineCardTable = new Table("arrisMtaDevLineCardTable", "1.3.6.1.4.1.4115.1.3.3.1.4.1");
arrisMtaDevLineCardTable.LineNumber = new Column("arrisMtaDevLineCardLineNumber","1.3.6.1.4.1.4115.1.3.3.1.4.1.1.1",2);
arrisMtaDevLineCardTable.State = new Column("arrisMtaDevLineCardState","1.3.6.1.4.1.4115.1.3.3.1.4.1.1.2",2);
var arrisMtaDevLineCardLineNumber=arrisMtaDevLineCardTable.LineNumber;
var arrisMtaDevLineCardState=arrisMtaDevLineCardTable.State;


var arrisMtaDevDhcpMtaParameters = new Container("arrisMtaDevDhcpMtaParameters", "1.3.6.1.4.1.4115.1.3.3.1.1.2.1");
arrisMtaDevDhcpMtaParameters.MtaIpFQDN = new Scalar("arrisMtaDevDhcpMtaIpFQDN","1.3.6.1.4.1.4115.1.3.3.1.1.2.1.1",4);
arrisMtaDevDhcpMtaParameters.MtaIpAddr = new Scalar("arrisMtaDevDhcpMtaIpAddr","1.3.6.1.4.1.4115.1.3.3.1.1.2.1.2",4,1);
arrisMtaDevDhcpMtaParameters.MtaSubNetMask = new Scalar("arrisMtaDevDhcpMtaSubNetMask","1.3.6.1.4.1.4115.1.3.3.1.1.2.1.3",4,1);
arrisMtaDevDhcpMtaParameters.MtaGatewayIpAddr = new Scalar("arrisMtaDevDhcpMtaGatewayIpAddr","1.3.6.1.4.1.4115.1.3.3.1.1.2.1.4",4,1);
arrisMtaDevDhcpMtaParameters.MtaConfigFile = new Scalar("arrisMtaDevDhcpMtaConfigFile","1.3.6.1.4.1.4115.1.3.3.1.1.2.1.5",4);
var arMtaDevDhcpMtaIpFQDN = arrisMtaDevDhcpMtaParameters.MtaIpFQDN;
var arMtaDevDhcpMtaIpAddr = arrisMtaDevDhcpMtaParameters.MtaIpAddr;
var arMtaDevDhcpMtaSubNetMask = arrisMtaDevDhcpMtaParameters.MtaSubNetMask;
var arMtaDevDhcpMtaGatewayIpAddr = arrisMtaDevDhcpMtaParameters.MtaGatewayIpAddr;
var arMtaDevDhcpMtaConfigFile = arrisMtaDevDhcpMtaParameters.MtaConfigFile;


var arrisMtaDevDhcpLeaseParameters = new Container("arrisMtaDevDhcpLeaseParameters", "1.3.6.1.4.1.4115.1.3.3.1.1.2.3");
arrisMtaDevDhcpLeaseParameters.OfferedLeaseTime = new Scalar("arrisMtaDevDhcpOfferedLeaseTime","1.3.6.1.4.1.4115.1.3.3.1.1.2.3.1",4,1);
arrisMtaDevDhcpLeaseParameters.LeaseTimeRemaining = new Scalar("arrisMtaDevDhcpLeaseTimeRemaining","1.3.6.1.4.1.4115.1.3.3.1.1.2.3.2",4,1);
arrisMtaDevDhcpLeaseParameters.TimeUntilRenew = new Scalar("arrisMtaDevDhcpTimeUntilRenew","1.3.6.1.4.1.4115.1.3.3.1.1.2.3.3",4,1);
arrisMtaDevDhcpLeaseParameters.TimeUntilRebind = new Scalar("arrisMtaDevDhcpTimeUntilRebind","1.3.6.1.4.1.4115.1.3.3.1.1.2.3.4",4,1);
var arMtaDevDhcpOfferedLeaseTime = arrisMtaDevDhcpLeaseParameters.OfferedLeaseTime;
var arMtaDevDhcpLeaseTimeRemaining = arrisMtaDevDhcpLeaseParameters.LeaseTimeRemaining;
var arMtaDevDhcpTimeUntilRenew = arrisMtaDevDhcpLeaseParameters.TimeUntilRenew;
var arMtaDevDhcpTimeUntilRebind = arrisMtaDevDhcpLeaseParameters.TimeUntilRebind;

var arrisMtaDevDhcpSvrParameters = new Container("arrisMtaDevDhcpSvrParameters", "1.3.6.1.4.1.4115.1.3.3.1.1.2.2");
arrisMtaDevDhcpSvrParameters.PrimaryDNSSvrIpAddr = new Scalar("arrisMtaDevDhcpPrimaryDNSSvrIpAddr","1.3.6.1.4.1.4115.1.3.3.1.1.2.2.4",4,1);
arrisMtaDevDhcpSvrParameters.SecondaryDNSSvrIpAddr = new Scalar("arrisMtaDevDhcpSecondaryDNSSvrIpAddr","1.3.6.1.4.1.4115.1.3.3.1.1.2.2.5",4,1);
var arMtaDevDhcpPrimaryDNSSvrIpAddr = arrisMtaDevDhcpSvrParameters.PrimaryDNSSvrIpAddr;
var arMtaDevDhcpSecondaryDNSSvrIpAddr = arrisMtaDevDhcpSvrParameters.SecondaryDNSSvrIpAddr;

var arrisMtaDevDhcpPktcOptParameters = new Container("arrisMtaDevDhcpPktcOptParameters", "1.3.6.1.4.1.4115.1.3.3.1.1.2.4");
arrisMtaDevDhcpPktcOptParameters.SvcProviderSnmpEntity = new Scalar("arrisMtaDevDhcpSvcProviderSnmpEntity","1.3.6.1.4.1.4115.1.3.3.1.1.2.4.2",4,1);
arrisMtaDevDhcpPktcOptParameters.KerberosRealmFqdn = new Scalar("arrisMtaDevDhcpKerberosRealmFqdn","1.3.6.1.4.1.4115.1.3.3.1.1.2.4.3",4,1);
arrisMtaDevDhcpPktcOptParameters.RequestTgt = new Scalar("arrisMtaDevDhcpRequestTgt","1.3.6.1.4.1.4115.1.3.3.1.1.2.4.4",4);
arrisMtaDevDhcpPktcOptParameters.ProvTimer = new Scalar("arrisMtaDevDhcpProvTimer","1.3.6.1.4.1.4115.1.3.3.1.1.2.4.5",2);
var arMtaDevDhcpSvcProviderSnmpEntity = arrisMtaDevDhcpPktcOptParameters.SvcProviderSnmpEntity;
var arMtaDevDhcpKerberosRealmFqdn = arrisMtaDevDhcpPktcOptParameters.KerberosRealmFqdn;
var arMtaDevDhcpRequestTgt = arrisMtaDevDhcpPktcOptParameters.RequestTgt;
var arMtaDevDhcpProvTimer = arrisMtaDevDhcpPktcOptParameters.ProvTimer;

var pktcMtaDevBase = new Container("pktcMtaDevBase", "1.3.6.1.4.1.4491.2.2.1.1.1");
pktcMtaDevBase.Enabled = new Scalar("pktcMtaDevEnabled", "1.3.6.1.4.1.4491.2.2.1.1.1.7",2);
var pktcMtaDevEnabled = pktcMtaDevBase.Enabled;

var pktcSigDevConfigObjects = new Container("pktcSigDevConfigObjects", "1.3.6.1.4.1.4491.2.2.2.1.1");
pktcSigDevConfigObjects.DefCallSigTos = new Scalar("pktcSigDefCallSigTos", "1.3.6.1.4.1.4491.2.2.2.1.1.8",2);
pktcSigDevConfigObjects.DefMediaStreamTos = new Scalar("pktcSigDefMediaStreamTos", "1.3.6.1.4.1.4491.2.2.2.1.1.9",2);
var pktcSigDefCallSigTos = pktcSigDevConfigObjects.DefCallSigTos;
var pktcSigDefMediaStreamTos = pktcSigDevConfigObjects.DefMediaStreamTos;

var pktcMtaDevRealmEntry = new Container("pktcMtaDevRealmEntry", "1.3.6.1.4.1.4491.2.2.1.1.3.16.1");
pktcMtaDevRealmEntry.OrgName = new Scalar("pktcMtaDevRealmOrgName", "1.3.6.1.4.1.4491.2.2.1.1.3.16.1.4",4);
pktcMtaDevRealmEntry.PkinitGracePeriod  = new Scalar("pktcMtaDevRealmPkinitGracePeriod ", "1.3.6.1.4.1.4491.2.2.1.1.3.16.1.2",2);
var pktcMtaDevRealmOrgName = pktcMtaDevRealmEntry.OrgName;
var pktcMtaDevRealmPkinitGracePeriod = pktcMtaDevRealmEntry.PkinitGracePeriod;

var pktcMtaDevCmsEntry = new Container("pktcMtaDevCmsEntry", "1.3.6.1.4.1.4491.2.2.1.1.3.17.1");
pktcMtaDevCmsEntry.KerbRealmName = new Scalar("pktcMtaDevCmsKerbRealmName", "1.3.6.1.4.1.4491.2.2.1.1.3.17.1.2",4);
pktcMtaDevCmsEntry.SolicitedKeyTimeout = new Scalar("pktcMtaDevCmsSolicitedKeyTimeout", "1.3.6.1.4.1.4491.2.2.1.1.3.17.1.4",2);
pktcMtaDevCmsEntry.IpsecCtrl = new Scalar("pktcMtaDevCmsIpsecCtrl", "1.3.6.1.4.1.4491.2.2.1.1.3.17.1.10",2);
var pktcMtaDevCmsKerbRealmName = pktcMtaDevCmsEntry.KerbRealmName;
var pktcMtaDevCmsSolicitedKeyTimeout = pktcMtaDevCmsEntry.SolicitedKeyTimeout;
var pktcMtaDevCmsIpsecCtrl = pktcMtaDevCmsEntry.IpsecCtrl;

var pktcNcsEndPntConfigEntry = new Container("pktcNcsEndPntConfigEntry", "1.3.6.1.4.1.4491.2.2.2.1.2.1.1");
pktcNcsEndPntConfigEntry.CallAgentId = new Scalar("pktcNcsEndPntConfigCallAgentId", "1.3.6.1.4.1.4491.2.2.2.1.2.1.1.1",4);
pktcNcsEndPntConfigEntry.CallAgentUdpPort = new Scalar("pktcNcsEndPntConfigCallAgentUdpPort", "1.3.6.1.4.1.4491.2.2.2.1.2.1.1.2",2);
pktcNcsEndPntConfigEntry.MWD = new Scalar("pktcNcsEndPntConfigMWD", "1.3.6.1.4.1.4491.2.2.2.1.2.1.1.18",2);
var pktcNcsEndPntConfigCallAgentId = pktcNcsEndPntConfigEntry.CallAgentId;
var pktcNcsEndPntConfigCallAgentUdpPort = pktcNcsEndPntConfigEntry.CallAgentUdpPort;
var pktcNcsEndPntConfigMWD = pktcNcsEndPntConfigEntry.MWD;


var docsDevEventTable = new Table("docsDevEventTable", "1.3.6.1.2.1.69.1.5.8");
docsDevEventTable.EvFirstTime = new Column("docsDevEvFirstTime","1.3.6.1.2.1.69.1.5.8.1.2",4,1);
docsDevEventTable.EvLastTime = new Column("docsDevEvLastTime","1.3.6.1.2.1.69.1.5.8.1.3",4,1);
docsDevEventTable.EvText = new Column("docsDevEvText","1.3.6.1.2.1.69.1.5.8.1.7",4);
var docsDevEvFirstTime=docsDevEventTable.EvFirstTime;
var docsDevEvLastTime=docsDevEventTable.EvLastTime;
var docsDevEvText=docsDevEventTable.EvText;



//


//battery


//
var upsBattery = new Container("upsBattery", "1.3.6.1.2.1.33.1.2");
upsBattery.upsBatteryStatus = new Scalar("upsBatteryStatus", "1.3.6.1.2.1.33.1.2.1", 2);

var MtaDevBatteryStatusTable = new Table("MtaDevBatteryStatusTable", "1.3.6.1.4.1.4115.1.3.3.1.3.5.3");
MtaDevBatteryStatusTable.MtaDevBatteryOperState = new Column("MtaDevBatteryOperState", "1.3.6.1.4.1.4115.1.3.3.1.3.5.3.1.2", 2);
MtaDevBatteryStatusTable.MtaDevBatteryOperSubState = new Column("MtaDevBatteryOperSubState", "1.3.6.1.4.1.4115.1.3.3.1.3.5.3.1.4", 4,1);
MtaDevBatteryStatusTable.MtaDevBatteryOrderingCode = new Column("MtaDevBatteryOrderingCode", "1.3.6.1.4.1.4115.1.3.3.1.3.5.3.1.5", 4,1);
MtaDevBatteryStatusTable.MtaDevBatteryEprom = new Column("MtaDevBatteryEprom", "1.3.6.1.4.1.4115.1.3.3.1.3.5.3.1.6", 4,1);

var MtaDevPwrSupplyStats = new Container("MtaDevPwrSupplyStats", "1.3.6.1.4.1.4115.1.3.3.1.3.5");
MtaDevPwrSupplyStats.MtaDevPwrSupplyBatRatedMinutes = new Scalar("MtaDevPwrSupplyBatRatedMinutes", "1.3.6.1.4.1.4115.1.3.3.1.3.5.10", 2);
MtaDevPwrSupplyStats.MtaDevPwrSupplyBatAvailableMinutes = new Scalar("MtaDevPwrSupplyBatAvailableMinutes", "1.3.6.1.4.1.4115.1.3.3.1.3.5.11", 2);
// scm ChengTa Lee x2
MtaDevPwrSupplyStats.MtaDevPwrSupplyRatedBatCapacity = new Scalar("MtaDevPwrSupplyRatedBatCapacity", "1.3.6.1.4.1.4115.1.3.3.1.3.5.5", 2);
MtaDevPwrSupplyStats.MtaDevPwrSupplyTestedBatCapacity = new Scalar("MtaDevPwrSupplyTestedBatCapacity", "1.3.6.1.4.1.4115.1.3.3.1.3.5.6", 2);
// scm ChengTa Lee
var MtaDevTrace = new Container("MtaDevTrace", "1.3.6.1.4.1.4115.1.3.3.1.1.1.2");
MtaDevTrace.MtaDevEstimatedMinutesRemaining = new Scalar("MtaDevEstimatedMinutesRemaining", "1.3.6.1.4.1.4115.1.3.3.1.1.1.2.44", 2);
MtaDevTrace.MtaDevEstimatedChargeRemaining = new Scalar("MtaDevEstimatedChargeRemaining", "1.3.6.1.4.1.4115.1.3.3.1.1.1.2.45", 2);
// scm ChengTa Lee x2
var arrisMtaDevPwrSupplyRatedBatCapacity = MtaDevPwrSupplyStats.MtaDevPwrSupplyRatedBatCapacity;
var arrisMtaDevPwrSupplyTestedBatCapacity = MtaDevPwrSupplyStats.MtaDevPwrSupplyTestedBatCapacity;
var upsBatteryStatus = upsBattery.upsBatteryStatus;
var arMtaDevBatteryOperState = MtaDevBatteryStatusTable.MtaDevBatteryOperState;
var arMtaDevBatteryOperSubState = MtaDevBatteryStatusTable.MtaDevBatteryOperSubState;
var arMtaDevBatteryOrderingCode = MtaDevBatteryStatusTable.MtaDevBatteryOrderingCode;
var arMtaDevBatteryEprom = MtaDevBatteryStatusTable.MtaDevBatteryEprom;
var arMtaDevPwrSupplyBatRatedMinutes = MtaDevPwrSupplyStats.MtaDevPwrSupplyBatRatedMinutes;
var arMtaDevPwrSupplyBatAvailableMinutes = MtaDevPwrSupplyStats.MtaDevPwrSupplyBatAvailableMinutes;
var arMtaDevEstimatedMinutesRemaining = MtaDevTrace.MtaDevEstimatedMinutesRemaining;
var arMtaDevEstimatedChargeRemaining = MtaDevTrace.MtaDevEstimatedChargeRemaining;

var DectConfiguration = new Container("arrisDectConfiguration", "1.3.6.1.4.1.4115.1.3.13.1");
DectConfiguration.DectBaseStatus = new Scalar("arrisDectBaseStatus","1.3.6.1.4.1.4115.1.3.13.1.1",4,1);
DectConfiguration.DectBaseDectModuleHwVersion = new Scalar("arrisDectBaseDectModuleHwVersion","1.3.6.1.4.1.4115.1.3.13.1.2",4);
DectConfiguration.DectCfgFwVersion = new Scalar("arrisDectCfgFwVersion","1.3.6.1.4.1.4115.1.3.13.1.7",4);

DectConfiguration.DectBaseRFPI = new Scalar("arrisDectBaseRFPI","1.3.6.1.4.1.4115.1.3.13.1.3",4);
DectConfiguration.DectCfgRegistrationMode = new Scalar("arrisDectCfgRegistrationMode","1.3.6.1.4.1.4115.1.3.13.1.4",2);
DectConfiguration.DectCfgPortInterfaceIndex = new Scalar("arDectCfgPortInterfaceIndex","1.3.6.1.4.1.4115.1.3.13.1.11",2);
// scm add start x2
DectConfiguration.DectCatiqOnOff = new Scalar("arDectCatiqOnOff","1.3.6.1.4.1.4115.1.3.13.1.10",2);
DectConfiguration.DectBasePin = new Scalar("arDectBasePin","1.3.6.1.4.1.4115.1.3.13.1.5",4);
var arDectCatiqOnOff=DectConfiguration.DectCatiqOnOff;
var arDectBasePin=DectConfiguration.DectBasePin;
// scm add end
var arDectBaseStatus=DectConfiguration.DectBaseStatus;
var arDectBaseDectModuleHwVersion=DectConfiguration.DectBaseDectModuleHwVersion;
var arDectCfgFwVersion=DectConfiguration.DectCfgFwVersion;
var arDectBaseRFPI=DectConfiguration.DectBaseRFPI;
var arDectCfgRegistrationMode=DectConfiguration.DectCfgRegistrationMode;
var arDectCfgPortInterfaceIndex=DectConfiguration.DectCfgPortInterfaceIndex;

var pktcMdiMdiTable = new Table("pktcMdiMdiTable", "1.3.6.1.4.1.4491.2.2.8.6.1.1");
pktcMdiMdiTable.MdiMdiName = new Column("pktcMdiMdiName","1.3.6.1.4.1.4491.2.2.8.6.1.1.1.2",4);
var pktcMdiMdiName = pktcMdiMdiTable.MdiMdiName;

// scm table
var pktcMdiNslPortListTable = new Table("pktcMdiNslPortListTable", "1.3.6.1.4.1.4491.2.2.8.6.1.2");
pktcMdiNslPortListTable.pktcMdiNslPortListIn = new Column("pktcMdiNslPortListIn", "1.3.6.1.4.1.4491.2.2.8.6.1.2.1.3", 4);
var arpktcMdiNslPortListIn = pktcMdiNslPortListTable.pktcMdiNslPortListIn;
// scm container
var DectCfgPinBase = new Container("DectCfgPinBase", "1.3.6.1.4.1.4115.1.3.13.1");
DectCfgPinBase.DectCfgPinCode = new Scalar("DectCfgPinCode","1.3.6.1.4.1.4115.1.3.13.1.5",4,1);
var arDectCfgPinCode = DectCfgPinBase.DectCfgPinCode;

var DectCfgHsTable = new Table("arrisDectCfgHsTable", "1.3.6.1.4.1.4115.1.3.13.2");
DectCfgHsTable.CfgHsRegisteredTn = new Column("arrisDectCfgHsRegisteredTn","1.3.6.1.4.1.4115.1.3.13.2.1.1",2);
DectCfgHsTable.CfgHsLastActivity = new Column("arrisDectCfgHsLastActivity","1.3.6.1.4.1.4115.1.3.13.2.1.2",2);
DectCfgHsTable.CfgHsDeregister = new Column("arrisDectCfgHsDeregister","1.3.6.1.4.1.4115.1.3.13.2.1.3",2);
DectCfgHsTable.CfgHsStatus = new Column("arrisDectCfgHsStatus","1.3.6.1.4.1.4115.1.3.13.2.1.4",2);
DectCfgHsTable.CfgHsName = new Column("arrisDectCfgHsName","1.3.6.1.4.1.4115.1.3.13.2.1.5",4);
var arDectCfgHsRegisteredTn = DectCfgHsTable.CfgHsRegisteredTn;
var arDectCfgHsLastActivity = DectCfgHsTable.CfgHsLastActivity;
var arDectCfgHsDeregister = DectCfgHsTable.CfgHsDeregister;
var arDectCfgHsStatus = DectCfgHsTable.CfgHsStatus;
var arDectCfgHsName = DectCfgHsTable.CfgHsName;

var DectCfgMdiTable = new Table("arrisDectCfgHsTable", "1.3.6.1.4.1.4115.1.3.13.3");
DectCfgMdiTable.DectCfgMdiToNsl = new Column("arrisDectCfgMdiToNsl","1.3.6.1.4.1.4115.1.3.13.3.1.1",66);
var arDectCfgMdiToNsl = DectCfgMdiTable.DectCfgMdiToNsl;

var pktcDectPPTable = new Table("pktcDectPPTable", "1.3.6.1.4.1.4491.2.2.8.4.1.8");
pktcDectPPTable.PPStatus = new Column("pktcDectPPStatus","1.3.6.1.4.1.4491.2.2.8.4.1.8.1.4",2);
pktcDectPPTable.PPRegCtrl = new Column("pktcDectPPRegCtrl","1.3.6.1.4.1.4491.2.2.8.4.1.8.1.5",2);
var pktcDectPPStatus = pktcDectPPTable.PPStatus;
var pktcDectPPRegCtrl = pktcDectPPTable.PPRegCtrl;

//
// MTA > Line Diagnostics
//
var MtaDevDiagLoopTable = new Table("MtaDevDiagLoopTable", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1");
MtaDevDiagLoopTable.MtaDevDiagLoopRequest = new Column("MtaDevDiagLoopRequest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.3", 2);
MtaDevDiagLoopTable.MtaDevDiagLoopLastResult = new Column("MtaDevDiagLoopLastResult", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.4", 2);
MtaDevDiagLoopTable.MtaDevDiagLoopHazardousPotentialTest = new Column("MtaDevDiagLoopHazardousPotentialTest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.5", 4);
MtaDevDiagLoopTable.MtaDevDiagLoopForeignEmfTest = new Column("MtaDevDiagLoopForeignEmfTest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.6", 4);
MtaDevDiagLoopTable.MtaDevDiagLoopResistiveFaultsTest = new Column("MtaDevDiagLoopResistiveFaultsTest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.7", 4);
MtaDevDiagLoopTable.MtaDevDiagLoopReceiverOffHookTest = new Column("MtaDevDiagLoopReceiverOffHookTest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.8", 4);
MtaDevDiagLoopTable.MtaDevDiagLoopRingerTest = new Column("MtaDevDiagLoopRingerTest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.9", 4);
MtaDevDiagLoopTable.MtaDevDiagLoopForceRequest = new Column("MtaDevDiagLoopForceRequest", "1.3.6.1.4.1.4115.1.3.3.1.2.3.15.1.1.10", 2);
var arMtaDevDiagLoopRequest = MtaDevDiagLoopTable.MtaDevDiagLoopRequest;
var arMtaDevDiagLoopLastResult = MtaDevDiagLoopTable.MtaDevDiagLoopLastResult;
var arMtaDevDiagLoopHazardousPotentialTest = MtaDevDiagLoopTable.MtaDevDiagLoopHazardousPotentialTest;
var arMtaDevDiagLoopForeignEmfTest = MtaDevDiagLoopTable.MtaDevDiagLoopForeignEmfTest;
var arMtaDevDiagLoopResistiveFaultsTest = MtaDevDiagLoopTable.MtaDevDiagLoopResistiveFaultsTest;
var arMtaDevDiagLoopReceiverOffHookTest = MtaDevDiagLoopTable.MtaDevDiagLoopReceiverOffHookTest;
var arMtaDevDiagLoopRingerTest = MtaDevDiagLoopTable.MtaDevDiagLoopRingerTest;
var arMtaDevDiagLoopForceRequest = MtaDevDiagLoopTable.MtaDevDiagLoopForceRequest;


//
// MTA > Service Flow
//
var docsQosServiceFlowTable = new Table("docsQosServiceFlowTable", "1.3.6.1.4.1.4491.2.1.21.1.3");
//docsQosServiceFlowTable.SID = new Column("docsQosServiceFlowSID", "1.3.6.1.2.1.10.127.7.1.3.1.6", 66);
//docsQosServiceFlowTable.Direction = new Column("docsQosServiceFlowDirection", "1.3.6.1.2.1.10.127.7.1.3.1.7", 2);
docsQosServiceFlowTable.SID = new Column("docsQosServiceFlowSID", "1.3.6.1.4.1.4491.2.1.21.1.3.1.6", 66);
docsQosServiceFlowTable.Direction = new Column("docsQosServiceFlowDirection", "1.3.6.1.4.1.4491.2.1.21.1.3.1.7", 2);
var docsQosServiceFlowSID = docsQosServiceFlowTable.SID;
var docsQosServiceFlowDirection = docsQosServiceFlowTable.Direction;

var docsQosParamSetTable = new Table("docsQosParamSetTable", "1.3.6.1.4.1.4491.2.1.21.1.2");
//docsQosParamSetTable.SchedulingType = new Column("docsQosParamSetSchedulingType", "1.3.6.1.2.1.10.127.7.1.2.1.13", 2);
//docsQosParamSetTable.NomGrantInterval = new Column("docsQosParamSetNomGrantInterval", "1.3.6.1.2.1.10.127.7.1.2.1.18", 66);
//docsQosParamSetTable.UnsolicitGrantSize = new Column("docsQosParamSetUnsolicitGrantSize", "1.3.6.1.2.1.10.127.7.1.2.1.17", 2);
//docsQosParamSetTable.TolGrantJitter = new Column("docsQosParamSetTolGrantJitter", "1.3.6.1.2.1.10.127.7.1.2.1.19", 66);
//docsQosParamSetTable.NomPollInterval = new Column("docsQosParamSetNomPollInterval", "1.3.6.1.2.1.10.127.7.1.2.1.15", 66);
//docsQosParamSetTable.MinReservedPkt = new Column("docsQosParamSetMinReservedPkt", "1.3.6.1.2.1.10.127.7.1.2.1.9", 2);
//docsQosParamSetTable.MaxTrafficRate = new Column("docsQosParamSetMaxTrafficRate", "1.3.6.1.2.1.10.127.7.1.2.1.6", 66);
//docsQosParamSetTable.MinReservedRate = new Column("docsQosParamSetMinReservedRate", "1.3.6.1.2.1.10.127.7.1.2.1.8", 66);
//docsQosParamSetTable.MaxTrafficBurst = new Column("docsQosParamSetMaxTrafficBurst", "1.3.6.1.2.1.10.127.7.1.2.1.7", 66);
docsQosParamSetTable.SchedulingType = new Column("docsQosParamSetSchedulingType", "1.3.6.1.4.1.4491.2.1.21.1.2.1.13", 2);
docsQosParamSetTable.NomGrantInterval = new Column("docsQosParamSetNomGrantInterval", "1.3.6.1.4.1.4491.2.1.21.1.2.1.17", 66);
docsQosParamSetTable.UnsolicitGrantSize = new Column("docsQosParamSetUnsolicitGrantSize", "1.3.6.1.4.1.4491.2.1.21.1.2.1.16", 2);
docsQosParamSetTable.TolGrantJitter = new Column("docsQosParamSetTolGrantJitter", "1.3.6.1.4.1.4491.2.1.21.1.2.1.18", 66);
docsQosParamSetTable.NomPollInterval = new Column("docsQosParamSetNomPollInterval", "1.3.6.1.4.1.4491.2.1.21.1.2.1.14", 66);
docsQosParamSetTable.MinReservedPkt = new Column("docsQosParamSetMinReservedPkt", "1.3.6.1.4.1.4491.2.1.21.1.2.1.9", 2);
docsQosParamSetTable.MaxTrafficRate = new Column("docsQosParamSetMaxTrafficRate", "1.3.6.1.4.1.4491.2.1.21.1.2.1.6", 66);
docsQosParamSetTable.MinReservedRate = new Column("docsQosParamSetMinReservedRate", "1.3.6.1.4.1.4491.2.1.21.1.2.1.8", 66);
docsQosParamSetTable.MaxTrafficBurst = new Column("docsQosParamSetMaxTrafficBurst", "1.3.6.1.4.1.4491.2.1.21.1.2.1.7", 66);
var docsQosParamSetSchedulingType = docsQosParamSetTable.SchedulingType;
var docsQosParamSetNomGrantInterval = docsQosParamSetTable.NomGrantInterval;
var docsQosParamSetUnsolicitGrantSize = docsQosParamSetTable.UnsolicitGrantSize;
var docsQosParamSetTolGrantJitter = docsQosParamSetTable.TolGrantJitter;
var docsQosParamSetNomPollInterval = docsQosParamSetTable.NomPollInterval;
var docsQosParamSetMinReservedPkt = docsQosParamSetTable.MinReservedPkt;
var docsQosParamSetMaxTrafficRate = docsQosParamSetTable.MaxTrafficRate;
var docsQosParamSetMinReservedRate = docsQosParamSetTable.MinReservedRate;
var docsQosParamSetMaxTrafficBurst = docsQosParamSetTable.MaxTrafficBurst;


//
// CallP / QoS
//
var MtaDevLineCardTable = new Table("MtaDevLineCardTable", "1.3.6.1.4.1.4115.1.3.3.1.4.1");
MtaDevLineCardTable.State = new Column("MtaDevLineCardState", "1.3.6.1.4.1.4115.1.3.3.1.4.1.1.2", 2);
var arMtaDevLineCardState = MtaDevLineCardTable.State;

var ppCfgPortTable = new Table("ppCfgPortTable", "1.3.6.1.4.1.4115.10.1.1");
ppCfgPortTable.LoopCurrent = new Column("ppCfgPortLoopCurrent", "1.3.6.1.4.1.4115.10.1.1.1.6", 2);
var ppCfgPortLoopCurrent = ppCfgPortTable.LoopCurrent;

var MtaDevOperationalSetup = new Container("MtaDevOperationalSetup", "1.3.6.1.4.1.4115.1.3.3.1.2.3");
MtaDevOperationalSetup.EnableMGCPLog = new Scalar("MtaDevOperationalSetupEnableMGCPLog", "1.3.6.1.4.1.4115.1.3.3.1.2.3.34", 2);
MtaDevOperationalSetup.ClearMGCPLog = new Scalar("MtaDevOperationalSetupClearMGCPLog", "1.3.6.1.4.1.4115.1.3.3.1.2.3.36", 2);
var arMtaDevOperationalSetupEnableMGCPLog = MtaDevOperationalSetup.EnableMGCPLog;
var arMtaDevOperationalSetupClearMGCPLog = MtaDevOperationalSetup.ClearMGCPLog;

var MtaDevEndPnt = new Table("MtaDevEndPnt", "1.3.6.1.4.1.4115.1.3.3.1.2.4.3");
MtaDevEndPnt.CallPState = new Column("MtaDevEndPntCallPState", "1.3.6.1.4.1.4115.1.3.3.1.2.4.3.1.37", 2);
var arMtaDevEndPntCallPState = MtaDevEndPnt.CallPState;

var MtaDispSignal = new Table("MtaDispSignal", "1.3.6.1.4.1.4115.1.3.3.1.5.1");
MtaDispSignal.Log = new Column("MtaDispSignalLog", "1.3.6.1.4.1.4115.1.3.3.1.5.1.1.2", 4);
var arMtaDispSignalLog = MtaDispSignal.Log;

var MtadocsQosService = new Table("MtadocsQosService", "1.3.6.1.4.1.4115.1.3.3.1.6.1");
MtadocsQosService.FlowID = new Column("MtadocsQosServiceFlowID", "1.3.6.1.4.1.4115.1.3.3.1.6.1.1.2", 2);
MtadocsQosService.ClassName = new Column("MtadocsQosServiceClassName", "1.3.6.1.4.1.4115.1.3.3.1.6.1.1.3", 4);
MtadocsQosService.FlowDirection = new Column("MtadocsQosServiceFlowDirection", "1.3.6.1.4.1.4115.1.3.3.1.6.1.1.4", 4);
MtadocsQosService.PrimaryFlow = new Column("MtadocsQosServicePrimaryFlow", "1.3.6.1.4.1.4115.1.3.3.1.6.1.1.5", 4);
MtadocsQosService.TrafficType = new Column("MtadocsQosServiceTrafficType", "1.3.6.1.4.1.4115.1.3.3.1.6.1.1.6", 4);
MtadocsQosService.ServicePackets = new Column("MtadocsQosServiceServicePackets", "1.3.6.1.4.1.4115.1.3.3.1.6.1.1.7", 2);
var arMtadocsQosServiceFlowID = MtadocsQosService.FlowID;
var arMtadocsQosServiceClassName = MtadocsQosService.ClassName;
var arMtadocsQosServiceFlowDirection = MtadocsQosService.FlowDirection;
var arMtadocsQosServicePrimaryFlow = MtadocsQosService.PrimaryFlow;
var arMtadocsQosServiceTrafficType = MtadocsQosService.TrafficType;
var arMtadocsQosServiceServicePackets = MtadocsQosService.ServicePackets;

var MtadocsQosShowDsxLog = new Table("MtadocsQosShowDsxLog", "1.3.6.1.4.1.4115.1.3.3.1.6.4");
MtadocsQosShowDsxLog.ShowDsxLog = new Column("MtadocsQosShowDsxLogShowDsxLog", "1.3.6.1.4.1.4115.1.3.3.1.6.4.1.2", 4);
var arMtadocsQosShowDsxLogShowDsxLog = MtadocsQosShowDsxLog.ShowDsxLog;

var MtadocsQosServiceContainer = new Container("MtadocsQosServiceContainer", "1.3.6.1.4.1.4115.1.3.3.1.6");
MtadocsQosServiceContainer.DisableLoggin = new Scalar("MtadocsQosServiceContainerDisableLoggin", "1.3.6.1.4.1.4115.1.3.3.1.6.2", 2);
MtadocsQosServiceContainer.LogClear = new Scalar("MtadocsQosServiceContainerLogClear", "1.3.6.1.4.1.4115.1.3.3.1.6.3", 2);
var arMtadocsQosServiceContainerDisableLoggin = MtadocsQosServiceContainer.DisableLoggin;
var arMtadocsQosServiceContainerLogClear = MtadocsQosServiceContainer.LogClear;


//
// VQM
//
var MtaDevVqm = new Container("MtaDevVqm", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4");
MtaDevVqm.Line = new Scalar("MtaDevVqmLine", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.1", 2);
MtaDevVqm.Clear = new Scalar("MtaDevVqmClear", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.2", 2);
MtaDevVqm.CallNumberIdentifier = new Scalar("MtaDevVqmCallNumberIdentifier", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.5", 2);
var arMtaDevVqmLine = MtaDevVqm.Line;
var arMtaDevVqmClear = MtaDevVqm.Clear;
var arMtaDevVqmCallNumberIdentifier = MtaDevVqm.CallNumberIdentifier;

var MtaDevVqmCallNumberTable = new Table("MtaDevVqmCallNumberTable", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.4");
MtaDevVqmCallNumberTable.CallNumberIds = new Column("MtaDevVqmCallNumberIds", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.4.1.2", 4);
var arMtaDevVqmCallNumberIds = MtaDevVqmCallNumberTable.CallNumberIds;

var MtaDevVqmMetricTable = new Table("MtaDevVqmMetricTable", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.6");
MtaDevVqmMetricTable.MtaDevVqmMetricValues = new Column("MtaDevVqmMetricValues", "1.3.6.1.4.1.4115.1.3.3.1.1.1.4.6.1.2", 4);
var arMtaDevVqmMetricValues = MtaDevVqmMetricTable.MtaDevVqmMetricValues;

//software.php
var CmDoc30EsaftFWTable = new Table("CmDoc30EsaftFWTable", "1.3.6.1.4.1.4115.1.3.4.1.6.1.1");
CmDoc30EsaftFWTable.FwCurrentFileName = new Column("FwCurrentFileName","1.3.6.1.4.1.4115.1.3.4.1.6.1.1.1.8",4);
var arFwCurrentFileName=CmDoc30EsaftFWTable.FwCurrentFileName;

																																			
if (window["preWalk"]) {
    var foo = [];
    _.each(container, function(v) {
        foo.push(window[v.name]);
    });
    _.each(table, function(v) {
        foo.push(window[v.name]);
    });
    load.apply(this, foo);
}


function dumpInC() {
    function dumpOneInC(o) {
        $.log("\"" + o.oid + ".\",\"" + o.name + "\",");
    }

    _.each(container, function(v) {
        _.each(v.children, function(v) {
            dumpOneInC(v);
        });
    });
    _.each(table, function(v) {
        _.each(v.children, function(v) {
            dumpOneInC(v);
        });
    });

}

var rowStatusCols = [
    arWanStaticDNSRowStatus,
    arLanDNSRowStatus,
    arLanClientRowStatus,
    arDeviceUpDownStatus,
    arLanCustomRowStatus,
    arWEP64BitKeyStatus,
    arWEP128BitKeyStatus,
    arMACAccessStatus,
    arWDSBridgeStatus,
    arFWVirtSrvRowStatus,
    arFWIPFilterRowStatus,
    arFWMACFilterRowStatus,
    arFWPortTrigRowStatus,
    arKeywordBlkStatus,
    arBlackListStatus,
    arWhiteListStatus,
    arTrustedDeviceStatus,
    arSNTPServerStatus,
    arLanStaticClientRowStatus
    //, arWebAccessRowStatus not needed since we don't create and I have seen some problems
    // arWebAccessRowStatus
];

function oidIsRowStatus(oid) {
    for (var i=0; i<rowStatusCols.length; i++)
        if (oid.startsWith(rowStatusCols[i].oid+"."))
            return true;
    return false;
}

var rowStatusLoaded = false;
function loadRowStatus() {
    if (rowStatusLoaded)
        return;
    rowStatusLoaded = true;
_.each(rowStatusCols,
        function(rs) {
            rs.table.rowStatus = rs;
        });
}

var lans = [ ];
var lanNames = { };
function getLan(index) {
    if (lans.length === 0) {
        if (!getSessionStorage("ar_lans")) {
            var bl = bulkLoading;
            bulkLoading = false;
            setSessionStorage("ar_lans", LanSrvTable.getTable([arLanName], function(i, row, key) {
                                                return key+"@"+row[0];
                                            }).sort().join("&")); // todo: verify sort
            bulkLoading = bl;
        }
        _.each(getSessionStorage("ar_lans").split("&"), function(v) {
             v = v.split("@");
            lans.push(v[0]);
            lanNames[v[0]] = v[1];
        });
    }
    return index === undefined ? lans : lans[index];
}
function getLanName(lan) {
    return lan === undefined ? lanNames : (lanNames[lan] || "");
}

var bsss = [ ];
var bssNames = { };
function getBss(index) {
    if (bsss.length === 0) {
        if (!getSessionStorage("ar_bsss")) {
            var bl = bulkLoading;
            bulkLoading = false;
            var bssString = BSSTable.getTable([arBssSSID], function(i, row, key) {
                                                            return key+"@"+row[0];
                                                         }).sort().join("&");
            if (!bssString)
                bssString = "disabled"; // in case no bss table

            setSessionStorage("ar_bsss", bssString);
            bulkLoading = bl;
        }
        _.each(getSessionStorage("ar_bsss").split("&"), function(v) {
             v = v.split("@");
            bsss.push(v[0]);
            bssNames[v[0]] = v[1];
        });
    }
    return index === undefined ? bsss : bsss[index];
}
function getBssName(bss) {
    return bss === undefined ? bssNames : (bssNames[bss] || "");
}

function flushBss() {
    setSessionStorage("ar_bsss","");
    bsss = [];
    bssNames = { };
}

String.prototype.escapeChars = function() 
{ 
	return this.replace(/([\\"'\[\]\{\}])/g, "\\$1").replace(/\0/g, "\\0"); 
} 

