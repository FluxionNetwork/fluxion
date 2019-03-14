(function(window){var document=window.document,navigator=window.navigator,location=window.location;var netcore={WLANZMODE:'1',TabLen:"",ContentLayer:{},MenuLayer:{},HelpLayer:{},CurrentModule:{},CurrentApp:{},CurrentData:{},MessagePanel:{},Debug:false,Flag:'0',ConntypeOption:{},Refresh:function(){$.load($.CurrentApp);},BrowserVersionArray:[{str:"MSIE 6.0",type:"IE6"},{str:"MSIE 7.0",type:"IE7"},{str:"MSIE 8.0",type:"IE8"},{str:"MSIE 9.0",type:"IE9"},{str:"MSIE 10.0",type:"IE10"},{str:"MSIE 11.0",type:"IE11"},{str:"Firefox",type:"Firefox"},{str:"Chrome",type:"Chrome"},{str:"Safari",type:"Safari"},{str:"Opera",type:"Opera"}],IFLock:{},BrowserVersion:"",Modules:{},Apps:{},Language:"IT",ShowLan:true,PATH:"",FLAG:false,DataMap:{},AllData:{},Log:{},CommonLan:{},Lan_map:{'0':'US','1':'IT'},Lan_opt:"['Select Language','Italiano']",getLan:function(name){return $.Apps[$.CurrentApp].Lan[name];},debug:function(n,o){var ret=true;if(o==undefined){ret=$.showDebug(n);}
return ret;},showDebug:function(s){if($.Debug){alert(s);}
return false;},exec:function(fname,data){if(!fname){return;}
try{return eval(fname+"(data)");}catch(e){$.showDebugErr(fname+' is undefined! 请检查你的action.js中'+fname+'函数是否定义！');}},showDebugErr:function(msg){if($.Debug){alert(msg);$.Debug.showErr(msg);}},post:function(url,param,callback){sendRequest(url,param,callback);},get:function(url,param,callback){sendRequest(url,param,callback);},load:function(name,callback,menu){$.ContentLayer.innerHTML=" ";$.initPage(name,menu);inLogic(name);if(callback){callback();}},ready:function(){},init:function(param,callback){$.Default_ip=param.default_ip;$.Debug=param.debug;$.IFLock=param.lock;$.MaxLockTime=param.maxLockTime;$.PATH=param.cgi_path;$.ContentLayer=param.content;$.MenuLayer=param.menu;$.HelpLayer=param.help;$.ShowLan=param.showlan;initBrowser(navigator.userAgent,$.BrowserVersionArray);if(!$.Language&&param.language=="AUTO"){if(navigator.userAgent.indexOf("IE")!=-1||$.BrowserVersion.indexOf("Opera")!=-1){ $.Language=window.navigator.userLanguage.split("-")[1].toUpperCase();}else{ $.Language=window.navigator.language.split("-")[1];}}
if(!initConfig()){return;};if(location.toString().indexOf('#debug')!=-1){initDebug();}
if(callback){getAppData(function(data){$.Language=($.Debug||!$.ShowLan)?param.language:$.Lan_map[$.DataMap.language];initLanguage($.Language);if($.CurrentApp!="Welcome"){callback(true);}});}},initPage:function(name,menu){if(menu){$.MenuLayer.innerHTML='';$.Language=($.ShowLan)?$.Lan_map[menu]:'US';initLanguage($.Language);var menu=new Menu();}
if($.HelpLayer){initHelp(name);}
var Pans=$.Apps[name].Pans;var tempTag=new Array();for(var i in Pans){if(checknobj(i)){continue;}
var panel=InitAppPanel(Pans[i]);obj2obj(Pans[i],panel);panel.showIn($.ContentLayer);var Tags=Pans[i].Tags;for(var j in Tags){if(checknobj(j)){continue;}
var tag=InitAppTag(Tags[j]);if(!tag){tag=new DefaultTag(Tags[j]);tag.html('<div style="color:red">[ initPage ]tag:'+Tags[j].name+' init error!</div>');tag.showIn(panel.children[1].entity);continue;}
if(!$.debug(Tags[j].name+"初始化失败!--[initPage]",tag)){panel.children[1].html('<div style="color:red">[ initPage ]tag:'+Tags[j].name+' init error!</div>');continue;}
tag.showIn(panel.children[1].entity);if(tag.display=='0'){tag.hide();}
tempTag.push(tag);}}
var Len=getLen($.DataMap);if(Len=='0'){initAllData(function(){initAppFunction(tempTag,name);});return;}
initAppFunction(tempTag,name);},HelpMore:{},Lock:{},LockInterver:{},LockTime:0,MaxLockTime:null,lockWin:function(msg,type,flag){if(!$.IFLock){return;}
if(!$.Lock.bg){var lock_bg=new Element("DIV:df_lock_bg");lock_bg.setID("lock_bg");document.body.appendChild(lock_bg.entity);$.Lock.bg=lock_bg;}
var width=screen.width;var height=document.documentElement.scrollHeight;$.Lock.bg.entity.style.height=height+"px";$.Lock.bg.entity.style.width=width+"px";if(!$.Lock.load){var lock_load=new Element("DIV:df_lock_load");if($.BrowserVersion.indexOf('IE6')!=-1){var lock_ifm=new Element("IFRAME");}
document.body.appendChild(lock_load.entity);$.Lock.load=lock_load;if($.BrowserVersion.indexOf('IE6')!=-1){document.body.appendChild(lock_ifm.entity);$.Lock.ifm=lock_ifm;}}
if(!$.Lock.win){ var lock_win=new Element("DIV:df_lock_load");document.body.appendChild(lock_win.entity);$.Lock.win=lock_win;}
if(type){$.Lock.load.entity.style.width='800px';$.Lock.load.entity.style.left=(parseInt((document.body.offsetWidth),10)/2-400)+'px';}else{if(flag){$.Lock.win.entity.style.top='250px';$.Lock.win.entity.style.width='180px';$.Lock.win.entity.style.minWidth='180px';$.Lock.win.entity.style.left=(parseInt((document.body.offsetWidth),10)/2-100)+'px';}else{$.Lock.load.entity.style.width='180px';$.Lock.load.entity.style.minWidth='180px';$.Lock.load.entity.style.left=(parseInt((document.body.offsetWidth),10)/2-100)+'px';}}
$.Lock.load.entity.style.top='200px';if(flag){$.Lock.win.html(msg);$.Lock.win.show();}else
$.Lock.load.html(msg);$.Lock.bg.show();$.Lock.load.show();if($.BrowserVersion.indexOf('IE6')!=-1){$.Lock.ifm.show();}
if(!type&&msg){$.LockInterval=window.setInterval(function(){if($.LockTime<$.MaxLockTime){$.LockTime+=1;$.Lock.load.html(msg+" ...</br>"+$.CommonLan['use_tip']+":"+$.LockTime+$.CommonLan['seconds']);}else{window.clearInterval($.LockInterval);$.unlockWin($.CommonLan['timeout_err']);}},1000);}else{var close=new Element("DIV:df_h_close");close.entity.onclick=function(){$.unlockWin();$.Refresh();}
$.Lock.load.append(close);}
if(!msg){$.Lock.load.hide();if($.BrowserVersion.indexOf('IE6')!=-1){$.Lock.ifm.hide();}}},unlockWin:function(msg,flag){if(!$.IFLock){return;}
$.LockTime=0;window.clearInterval($.LockInterval);(flag)?$.Lock.win.html(msg):$.Lock.load.html(msg);$.HelpMore={};if(!msg){$.Lock.bg.hide();$.Lock.load.hide();if($.BrowserVersion.indexOf('IE6')!=-1){$.Lock.ifm.hide();}
return;}
window.setTimeout(function(){if(flag){$.Lock.win.hide();}else{$.Lock.bg.hide();$.Lock.load.hide();if($.BrowserVersion.indexOf('IE6')!=-1){$.Lock.ifm.hide();}}
if($.CurrentApp=="update"||$.CurrentApp=="backup"){window.location.reload();}},2000);},Drag:function(obj,e,fun){if($.BrowserVersion.indexOf('IE')!=-1){var e=window.event;}
var l=e.clientX;var t=e.clientY;var e_top=parseInt(obj.style.top);var e_left=parseInt(obj.style.left);document.onmousemove=function(){var e=arguments[0]||window.event;var _l=e.clientX;var _t=e.clientY;var left=_l-l;var top=_t-t;var _top=e_top+top+"px";var _left=e_left+left+"px";obj.style.top=_top;obj.style.left=_left;if(fun!=undefined){fun();}}}};var initAppFunction=function(tempTag,name){try{if($.DataMap){$.CurrentData=$.DataMap;}else{if($.Apps[name].request){for(var i in tempTag){tempTag[i].bindFun();}
$.exec($.Apps[name].init);return;}
getAppData(function(data){$.DataMap=data;for(var i in tempTag){tempTag[i].bindFun();}
$.exec($.Apps[name].init);});}}catch(e){$.CurrentData=null;};for(var i in tempTag){tempTag[i].bindFun();}
$.exec($.Apps[name].init);MOD="save";}
var initBrowser=function(s,br){for(var i=0;i<br.length;i++){if(s.indexOf(br[i].str)!=-1){$.BrowserVersion=br[i].type;break;}}};var initLanguage=function(lan){var Lan=Language[lan];for(var i in Lan){if(i=="common"){obj2obj($.CommonLan,Lan[i]);continue;}
for(var j in Lan[i]){if(!$.Modules[i]){continue;}
if(j=="txt"){$.Modules[i].Lan={};$.Modules[i].Lan.txt=Lan[i][j];}else{if(!$.Apps[j]){continue;}
$.Apps[j].Lan={};obj2obj($.Apps[j].Lan,Lan[i][j]);}}}}
var initHelp=function(app){var layer=$.HelpLayer;layer.innerHTML='';var help=Help[$.Language][app];if(!help){return;}
for(var i=0;i<help.length;i++){var title=help[i].title;var context=help[i].context;var tpanel=new Element("DIV:df_h_tpanel");tpanel.html(title);var cpanel=new Element("DIV:df_h_cpanel");cpanel.html("&nbsp;&nbsp;&nbsp;&nbsp;"+context);layer.appendChild(tpanel.entity);var clear=new Element("DIV:clear");layer.appendChild(clear.entity);layer.appendChild(cpanel.entity);if(!help[i].more){continue;}
var mbtn=new Element("DIV:df_h_mbtn");mbtn.setID(i);mbtn.html($.CommonLan['help_more_btn']);layer.appendChild(mbtn.entity);mbtn.entity.onclick=function(){if(!help[this.id].more){help[this.id].more=$.CommonLan['help_more_null'];}else{$.HelpMore[this.id]=createMoreHelpContent(help[this.id].more);}
$.lockWin($.HelpMore[this.id],true);}}}
var createMoreHelpContent=function(m){var rows=m.split('#');if(rows.length<=1){return m;}
var layer=document.createElement("DIV");var table=document.createElement("TABLE");table.className='more_h_table';table.setAttribute("cellspacing","1");table.setAttribute("cellpadding","3");for(var i=1;i<rows.length;i++){var row=document.createElement("TR");var cells=rows[i].split('-');var head=document.createElement("TD");head.className="more_h_head";head.innerHTML=cells[0];var content=document.createElement("TD");content.className="more_h_content";if(i==rows.length-1){content.className="more_h_content_after";}
content.innerHTML=cells[1];row.appendChild(head);row.appendChild(content);table.appendChild(row);}
layer.appendChild(table);return layer.innerHTML;}
var initConfig=function(){$.Modules.len=0;$.Apps.len=0;for(var i=0;i<Modules.length;i++){initModule(Modules[i]);}
for(var i in Applications){if(!$.Modules[i]){continue;}
if(!Applications[i].length){initApp(i,Applications[i]);continue;}
for(var j=0;j<Applications[i].length;j++){initApp(i,Applications[i][j]);}}
for(var i in Panels){if(!$.Apps[i]){continue;}
for(var j=0;j<Panels[i].length;j++){var pan=initPanel(i,Panels[i][j]);for(var k=0;k<pan.tags.length;k++){initTag(pan,pan.tags[k]);if(pan.tags[k].name=="conntype"&&pan.tags[k].type=="simple_select"){$.ConntypeOption=pan.tags[k].value;}}}}
return true;};function Module(m){this.name=m.name;this.mode=m.mode;this.Apps={};this.Apps.len=0;$.Modules.len+=1;};function App(n,a){this.name=a.name;if(a.request){this.request=a.request;}
if(a.init){this.init=a.init;}
this.parent=$.Modules[n];this.Pans={};this.Pans.len=0;$.Modules[n].Apps.len+=1;$.Apps.len+=1;}
function Panel(n,p){this.name=p.name;this.type=p.type;this.parent=$.Apps[n];this.tags=p.tags;this.Tags={};this.Tags.len=0;if(p.display){this.display=p.display;}
$.Apps[n].Pans.len+=1;}
function Tag(p,t){this.name=t.name;this.type=t.type;this.mode=t.mode;if(t.len){this.len=t.len;}
if(t.key){this.key=eval(t.key);}
if(t.value){this.value=eval(t.value);}
if(t.init){this.init=t.init;}
if(t.action){this.action=t.action;}
if(t.df){this.df=t.df;}
if(t.check){this.ch_key=t.check;}
if(t.display){this.display=t.display;}
if(t.wisp){this.wisp=t.wisp;}
this.parent=p;p.Tags.len+=1;}
var initModule=function(m){var len=$.Modules.len;$.Modules[m.name]=$.Modules[len]=new Module(m);};var initApp=function(n,a){var len=$.Modules[n].Apps.len;$.Modules[n].Apps[a.name]=$.Modules[n].Apps[len]=$.Apps[a.name]=$.Apps[$.Apps.len]=new App(n,a);};var initPanel=function(n,p){var len=$.Apps[n].Pans.len;return $.Apps[n].Pans[p.name]=$.Apps[n].Pans[len]=new Panel(n,p);};var initTag=function(p,t){var len=p.Tags.len;p.Tags[t.name]=p.Tags[len]=new Tag(p,t);};window.$n=(function(selector){var match,quickExpr=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;if(typeof selector==="string"){if(selector.charAt(0)==="<"&&selector.charAt(selector.length-1)===">"&&selector.length>=3){match=[null,selector,null];}else{match=quickExpr.exec(selector);}
if(match){if(match[1]){}else{return document.getElementById(match[2]);}}}});window.netcore=window.$=netcore;})(window);var initAllData=function(callback,tData){if($.Debug){$.AllData=debugData;$.DataMap=parameLogic(debugData);if(callback){callback(tData);}
return;}
$.post("netcore_get",{"noneed":"noneed"},function(data){try{var data=eval("("+data+")");}catch(e){};$.AllData=data;$.DataMap=parameLogic(data);if(callback){callback(tData);}});};var getRequestData=function(url,data,callback){if($.Debug){data=debugData;if(callback){callback(data);}
return;}
$.post(url,data,function(data){try{var data=eval("("+data+")");}catch(e){};$.AllData=data;$.CurrentData=parameLogic(data);$.DataMap=parameLogic(data);if(callback){callback(data);}});}
var getAppData=function(callback){if($.Debug){$.AllData=debugData;$.CurrentData=parameLogic(debugData);$.DataMap=parameLogic(debugData);if(callback){callback(debugData);}
return;}
$.post("netcore_get",{"no":"no"},function(data){try{var data=eval("("+data+")");}catch(e){};$.AllData=data;$.CurrentData=parameLogic(data);$.DataMap=parameLogic(data);if(callback){callback(data);}});}
var setAppData=function(type,obj,callback,backdata){if($.Debug){if(obj.length){var parame=getSubmitData(obj);}else{var parame=obj;}
parame=setLogic(parame);if(callback){callback();}
if(type!==null){$.lockWin($.CommonLan['lock_'+type]);window.setTimeout(function(data){$.unlockWin($.CommonLan['unlock_'+type]);$.Lock.bg.entity.setAttribute('name','true');},3000);}
return;}
if(type!==null){$.lockWin($.CommonLan['lock_'+type]);}
try{if(obj.length){var parame=getSubmitData(obj);}else{var parame=obj;}
parame=setLogic(parame);$.post("netcore_set",parame,function(data){var tData=new Object();try{if(backdata){tData=data;}else{tData=eval("("+data+")");}}catch(e){$.unlockWin($.CommonLan['unlock_err']);$.Lock.bg.entity.setAttribute('name','false');};if(type!=null&&data=='["SUCCESS"]'){$.unlockWin($.CommonLan['unlock_'+type]);$.Lock.bg.entity.setAttribute('name','true');}else if(type!=null&&data!='["SUCCESS"]'){try{$.unlockWin($.CommonLan[get_err_map(eval(data)[0])]);}catch(e){$.unlockWin($.CommonLan['unlock_'+type]);}
$.Lock.bg.entity.setAttribute('name','false');}
if(callback){initAllData(callback,tData);}});MOD="save";}catch(e){if(type!==null){$.unlockWin($.CommonLan['unlock_'+type]);}}}
function get_err_map(str){switch(str){case"The item is already exist !":return"item_exist";default:return"unlock_error";}}
var obj2obj=function(a,b){for(var i in b){a[i]=b[i];}
for(var i in a){b[i]=a[i];}};var checknobj=function(str){if(str=="len"){return true;}
var count=0;var cmp="0123456789";for(var i=0;i<str.length;i++){var num=str.substring(i,i+1);if(cmp.indexOf(num)>=0){count+=1;}}
if(count==str.length){return true;}
return false;};function Element(type,params,t){var _this=this;var st=type.split(':')[1];if(t&&t.type.indexOf('radio')!=-1&&($.BrowserVersion.indexOf("IE7")!=-1||$.BrowserVersion.indexOf("IE6")!=-1)){this.entity=document.createElement('<input type="radio" name="'+t.name+'"/>');}else{this.entity=(type.split(':').length>1)?createByTag(type.split(':')[0]):createByTag(type);}
if($.BrowserVersion.indexOf("IE6")!=-1){if(type=="IFRAME"){this.entity=document.createElement('<IFRAME width=100% height=550px style="position:absolute;z-index:1;left:0;top:0;_filter:alpha(opacity=0);opacity=0;display:block;background-color:transparent;;" frameborder="0"></IFRAME>');}}
this.children=new Array();this.parent={};this.setClass=function(classname){_this.entity.className=classname;}
this.setAttr=function(parame){for(var i in parame){_this.entity.setAttribute(i,parame[i]);}};this.set=function(o){var cs=o.css;var h=o.html;if(cs){for(var i in cs){_this.entity.style[i]=cs[i];}}
if(h){_this.html(h);}}
this.setName=function(name){_this.entity.setAttribute("name",name);_this.Name=name}
this.setID=function(id){_this.entity.setAttribute("id",id);_this.ID=id;}
this.setValue=function(val){this.entity.value=val;this.value=val;}
this.append=function(child){this.entity.appendChild(child.entity);this.children.push(child);child.parent=this;}
this.push=function(){var eles=arguments;for(var i=0;i<eles.length;i++){this.append(eles[i]);}};this.html=function(inner){_this.entity.innerHTML=inner;}
this.show=function(){if(this.display=='0'){return;}
_this.entity.style.display="block";}
this.hide=function(){_this.entity.style.display="none";}
this.showIn=function(dom){dom.appendChild(this.entity);this.parent=parent;}
this.bindFun=function(){initBindFunction(_this);if(_this.init){$.exec(_this.init,_this);}}
if(params){obj2obj(this,params);}
if(st){_this.setClass(st);}};function initBindFunction(ele){if(ele.eleType=="tag"){switch(ele.type){case"simple_context":initSimpleContextFunction(ele);break;case"simple_text":initSimpleTextFunction(ele);break;case"simple_pwd":initSimpleTextFunction(ele);break;case"simple_select":initSimpleSelectFunction(ele);break;case"radio_group":initRadioGroupFunction(ele);break;case"simple_file":initSimpleFileFunction(ele);break;case"simple_time":initSimpleTimeFunction(ele);break;default:break;}}}
function InitAppPanel(pan){switch(pan.type){case 0:return initDefaultPanel(pan);break;default:break;}}
function DefaultSpan(tag){Element.call(this,"SPAN");var _this=this;this.tag=tag;this.setData=function(val){if(val){this.html(val);_this.tag.data=val;}};}
function DefaultLabel(tag){Element.call(this,"LABEL:df_label");var lab=$.getLan(tag.name+"_label");if(!lab){lab="<span style='color:red'>"+tag.name+" - label构造失败</span>"
if($.Debug){alert("请检查你的配置文件中tag的name与Language中的name是否相同！");}}
this.html(lab+" : ");}
function DefaultInput(tag,type,tt){if(!tag){tag=new DefaultTag();tag.type=tt;}
Element.call(this,"INPUT",null,tag);var input=this;input.tag=tag;this.entity.type=type;switch(type){case"hidden":input.setValue=function(val){if(val){input.entity.value=val;input.tag.data=val;}}
break;case"text":input.setClass("df_text");if(input.tag.mode=="nocopy"){input.entity.oncopy=function(){return false;}}
if(input.tag.len){input.entity.maxLength=input.tag.len;}
if(input.tag.ch_key){input.setName(input.tag.ch_key);}else{input.setName("text_common");input.tag.ch_key="text_common";}
input.setID(tag.name);input.getCheck=function(type){if(!type){type=input.tag.ch_key;}
return checkText(input,type);}
input.setValue=function(val){if(val){input.entity.value=val;input.tag.data=val;}}
input.setData=function(val){if(!val&&val!=''&&val!=' '){return;}
input.setValue(val);input.tag.data=val;};input.entity.onkeyup=function(){input.tag.data=this.value;$.CurrentData[tag.name]=this.value;}
input.entity.onfocus=function(){this.style.border="solid 1px #8fc7fa";if(this.value==' '){this.value=this.value.replace(/^\s+|\s+$/g,'');input.tag.data=this.value;}}
input.entity.onblur=function(){this.style.border="solid 1px #d2d2d2";}
break;case"password":input.setClass("df_text");input.entity.oncopy=function(){return false;}
if(input.tag.len){input.entity.maxLength=input.tag.len;}
if(input.tag.ch_key){input.setName(input.tag.ch_key);}else{input.setName("text_common");input.tag.ch_key="text_common";}
input.setID(tag.name);input.getCheck=function(type){if(!type){type=input.tag.ch_key;}
return checkText(input,type);}
input.setValue=function(val){if(val){input.entity.value=val;input.tag.data=val;}}
input.setData=function(val){if(!val&&val!=''&&val!=' '){return;}
input.setValue(val);input.tag.data=val;};input.entity.onkeyup=function(){input.tag.data=this.value;}
input.entity.onfocus=function(){this.style.border="solid 1px #8fc7fa";}
input.entity.onblur=function(){this.style.border="solid 1px #d2d2d2";}
break;case"radio":input.setName(tag.name);input.setClass("df_radio");input.entity.onclick=function(){input.checked();if(tag.action){$.exec(tag.action,tag);}};input.checked=function(){this.entity.checked=true;var co=document.getElementsByName(tag.name);for(var i=0;i<co.length;i++){}
this.entity.setAttribute("checked",true);input.tag.data=this.entity.value;};input.setData=function(val){if(val==this.value){this.checked();}};break;case"checkbox":this.setClass("df_checkbox");this.entity.checked=false;input.setID(tag.name);input.entity.onclick=function(){if(this.checked){this.name='true';}else{this.name='false';}
if(tag.action){$.exec(tag.action,tag);}};break;case"button":this.setClass("df_btn");input.setID(tag.name);this.entity.onclick=function(){if(input.tag.action){$.exec(input.tag.action,input.tag);}};break;default:break;}}
function DefaultAfter(tag,flag){Element.call(this,"SPAN:df_after");var str="_after";if(flag){switch(flag){case 1:str="_after1";break;case 2:str="_after2";break;case 3:str="_after3";break;default:str="_after";break;}}
if($.getLan(tag.name+str)){this.html($.getLan(tag.name+str));}}
function DefaultSelect(tag){if($.BrowserVersion.indexOf('IE')!=-1){Element.call(this,"SELECT:df_select_ie");}else{Element.call(this,"SELECT:df_select");}
var _this=this;this.tag=tag;this.setID(tag.name);var options=eval($.getLan(tag.name+"_options"));for(var i in options){if(!tag.value){this.entity.options.add(new Option(options[i],i));}else{this.entity.options.add(new Option(options[i],tag.value[i]));}}
this.entity.onchange=function(){var ch=false;for(var i=0;i<this.options.length;i++){var opt=this.options[i];if(opt.value==this.value){this.setAttribute("selected",this.value);ch=true;}}
if(!ch&&$.BrowserVersion.indexOf('IE')!=-1){_this.tag.data=this.options[0].value;_this.data=this.options[0].value;_this.checked(_this.data);}
_this.tag.data=this.value;_this.data=this.value;$.CurrentData[_this.tag.name]=this.value;if(tag.action){$.exec(tag.action,tag);}}
this.checked=function(val){this.entity.value=val;this.entity.onchange();}
this.setData=function(val){if(val){this.checked(val);_this.tag.data=val;this.data=val;}};if(!tag.data){_this.tag.data=this.entity.value;this.data=this.entity.value;}}
function DefaultFile(tag){Element.call(this,"IFRAME:df_file");this.entity.setAttribute('frameBorder',0);}
function DefaultPanel(pan){if($.BrowserVersion.indexOf('IE6')!=-1){Element.call(this,"DIV:df_panel_ie");}else{Element.call(this,"DIV:df_panel");}
this.eleType="panel";var title=new DefaultPanelTitle(pan);var content=new DefaultPanelContent(pan);this.push(title,content);this.title=title;this.content=content;if(pan.display=='0'){this.hide();}}
function DefaultPanelTitle(pan){Element.call(this,"DIV:df_panel_title");var title=$.getLan(pan.name+"_panel");if(!title){this.hide();return;}
this.html(title);}
function DefaultPanelContent(pan){Element.call(this,"DIV:df_panel_content");}
function initDefaultPanel(pan){var panel=new DefaultPanel(pan);return panel;}
function InitAppTag(tag){switch(tag.type){case"simple_hidden":return initSimpleHidden(tag);break;case"simple_three":return initSimpleThree(tag);break;case"simple_text":return initSimpleText(tag);break;case"simple_pwd":return initSimpleText(tag,1);break;case"text_limit":return initTextLimit(tag);break;case"text_more":return initTextMore(tag);break;case"text_two":return initTextTwo(tag);break;case"radio_group":return initRadioGroup(tag);break;case"only_check":return initOnlyCheck(tag);break;case"simple_check":return initSimpleCheck(tag);break;case"simple_context":return initSimpleContext(tag);break;case"info_context":return initInfoContext(tag);break;case"simple_btn":return initSimpleButton(tag);break;case"btn_array":return initButtonArray(tag);break;case"simple_select":return initSimpleSelect(tag);break;case"simple_week":return initSimpleWeek(tag);break;case"simple_time":return initSimpleTime(tag);break;case"simple_file":return initSimpleFile(tag);break;case"simple_load":return initSimpleLoad(tag);break;case"simple_table":return initSimpleTable(tag);break;case"simple_flot":return initSimpleFlot(tag);break;default:var t=new DefaultTag(tag);obj2obj(tag,t);return t;break;}}
function DefaultTag(tag){if($.BrowserVersion.indexOf('IE6')!=-1){Element.call(this,"DIV:df_tag_ie");}else{Element.call(this,"DIV:df_tag");}
this.eleType="tag";}
function SimpleHiddenTag(tag){DefaultTag.call(this,tag);var hidden=new DefaultInput(tag,'hidden');}
function initSimpleHidden(t){var tag=new SimpleHiddenTag(t);return tag;}
function SimpleTextTag(tag,sta){DefaultTag.call(this,tag);var label=new DefaultLabel(tag);if(sta){var text=new DefaultInput(tag,"password");}else{var text=new DefaultInput(tag,"text");}
if(tag.df){text.setValue(tag.df);tag.data=tag.df;}
var check=new Element("DIV:df_check_panel");var layer=new Element("DIV:df_check_layer");var info=new Element("DIV:df_check_info");var p=new Element("DIV:df_check_p");layer.push(info,p);check.push(layer);check.info=info;var after=new DefaultAfter(tag);if(tag.mode=='1'){var btn=new DefaultInput(tag,'button');this.push(label,text,btn);}else if(tag.mode=='2'){var btn_a=new DefaultInput(tag,'button');var btn_b=new DefaultInput(tag,'button');btn_a.entity.value=$.CommonLan['current'];btn_b.entity.value=$.CommonLan['device'];after.setClass("df_after_three");this.push(label,text,btn_a,btn_b,check,after);}else if(tag.mode=='3'){label.setClass("df_label_two");after.setClass("df_after_two");this.push(label,text,check,after);}else{if(tag.mode=='4'&&$.BrowserVersion.indexOf('IE')!=-1){after.setClass("df_after_ie");}
this.push(label,text,check,after);}
if(tag.mode=='1'){this.btn=btn;}else if(tag.mode=='2'){this.btn_a=btn_a;this.btn_b=btn_b;}
this.label=label;this.text=text;this.check=check;this.after=after;obj2obj(tag,this);}
function initSimpleText(t,sta){var tag=new SimpleTextTag(t,sta);return tag;}
function initSimpleTextFunction(tag){setTagData(tag.text,tag);}
function SimpleThreeTag(tag){DefaultTag.call(this,tag);var label=new DefaultLabel(tag);this.append(label);var text_a=new DefaultInput(tag,"text");text_a.entity.id=tag.name;text_a.entity.maxLength='4',text_a.setClass("df_time_text");var after_a=new DefaultAfter(tag);var text_b=new DefaultInput(tag,"text");text_b.entity.id=tag.name+"2";text_b.entity.maxLength='2',text_b.setClass("df_time_text");var after_b=new DefaultAfter(tag,2);var text_c=new DefaultInput(tag,"text");text_c.entity.id=tag.name+"3";text_c.entity.maxLength='2',text_c.setClass("df_time_text");var after_c=new DefaultAfter(tag,3);this.push(text_a,after_a,text_b,after_b,text_c,after_c);this.label=label;this.text_a=text_a;this.after_a=after_a;this.text_b=text_b;this.after_b=after_b;this.text_c=text_c;this.after_c=after_c;obj2obj(tag,this);}
function initSimpleThree(tag){var tag=new SimpleThreeTag(tag);return tag;}
function TextLimitTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);this.append(label);if(tag.mode){var select=new DefaultSelect(tag);this.append(select);this.select=select;}
var text_a=new DefaultInput(tag,"text");text_a.entity.id=tag.name+'_start';text_a.entity.style.width='72px'; text_a.entity.maxLength="5";var text_b=new DefaultInput(tag,"text");text_b.entity.id=tag.name+'_end';text_b.entity.style.width='72px';text_b.entity.maxLength="5";var line=new Element("SPAN");line.setClass('df_limit_line');line.html("-");this.push(text_a,line,text_b);this.label=label;this.text_a=text_a;this.text_b=text_b;obj2obj(tag,this);}
function initTextLimit(tag){var tag=new TextLimitTag(tag);return tag;}
function TextMoreTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);this.append(label);if(tag.mode=='2'){var select=new DefaultSelect(tag);this.append(select);}
var label_a=new Element("SPAN:txt_more");label_a.html($.getLan(tag.name+"_label_a"));var text_a=new DefaultInput(tag,"text");text_a.entity.style.width='40px';text_a.entity.id=tag.name+'_start';if(tag.df){text_a.setData(eval("("+tag.df+")")[0].toString());}
var label_b=new Element("SPAN:txt_more");label_b.html($.getLan(tag.name+"_label_b"));var text_b=new DefaultInput(tag,"text");text_b.entity.style.width='40px';text_b.entity.id=tag.name+'_end';if(tag.df){text_b.setData(eval("("+tag.df+")")[1].toString());}
if(tag.mode=='1'){var label_c=new Element("SPAN:txt_more");label_c.html($.getLan(tag.name+"_label_c"));var label_d=new Element("SPAN:text_more");label_d.html($.getLan(tag.name+"_label_d"));this.push(label_a,text_a,label_c,label_b,text_b,label_d);}else{this.push(label_a,text_a,label_b,text_b);}
if(tag.mode=='1'){this.label_c=label_c;this.label_d=label_d;}
this.label=label;this.label_a=label_a;this.text_a=text_a;this.label_b=label_b;this.text_b=text_b;obj2obj(tag,this);}
function initTextMore(tag){var tag=new TextMoreTag(tag);return tag;}
function TextTwoTag(tag){DefaultTag.call(this);var _this=this;this.value=tag.value;this.mode=tag.mode;var label=new DefaultLabel(tag);label.entity.style.height=25*2+"px";label.entity.style.lineHeight=25*2+"px";this.append(label);this.label=label;var panel=new Element("DIV:radio_panel");panel.setClass("two_panel_line");var label_a=new Element("SPAN:txt_two");label_a.html($.getLan(tag.name+"_label_a"));label_a.entity.style.width="118px";var text_a=new DefaultInput(tag,"text");text_a.entity.style.width='43px';text_a.entity.id=tag.name+'_up';if(tag.df){text_a.setData(eval("("+tag.df+")")[0].toString());}
var label_c=new Element("label");label_c.setClass("df_two_after");label_c.html($.getLan(tag.name+"_label_c"));panel.push(label_a,text_a,label_c);this.label_a=label_a;this.text_a=text_a;this.label_c=label_c;var panel_b=new Element("DIV:radio_panel");panel_b.setClass("two_panel_line");var label_b=new Element("SPAN:txt_two");label_b.html($.getLan(tag.name+"_label_b"));label_b.entity.style.width="118px";var text_b=new DefaultInput(tag,"text");text_b.entity.style.width='43px';text_b.entity.id=tag.name+'_down';if(tag.df){text_b.setData(eval("("+tag.df+")")[0].toString());}
var label_d=new Element("label");label_d.setClass("df_two_after");label_d.html($.getLan(tag.name+"_label_d"));panel_b.push(label_b,text_b,label_d);this.label_b=label_b;this.text_b=text_b;this.label_d=label_d;_this.append(panel);_this.append(panel_b);obj2obj(tag,this);}
function initTextTwo(tag){var tag=new TextTwoTag(tag);return tag;}
function RadioGroupTag(tag){DefaultTag.call(this);var _this=this;this.name=tag.name;this.key=tag.key;this.value=tag.value;this.mode=tag.mode;if(this.mode!="1"){var label=new DefaultLabel(tag);if(this.mode=="2"){label.entity.style.height=25*this.key.length+"px";label.entity.style.lineHeight=25*this.key.length+"px";}
this.append(label);this.label=label;}
this.panel=new Array();;for(var i=0;i<_this.key.length;i++){var panel=new Element("DIV:radio_panel");if(_this.mode=="1"){panel.setClass("radio_panel_single");}else if(_this.mode=="2"){panel.setClass("radio_panel_line");}
var radio=new DefaultInput(tag,"radio");radio.setID(_this.name+'_'+_this.key[i]);radio.setValue(_this.value[i]);var txt=new Element("label");txt.setClass("df_radio_txt");if(_this.mode=="2"||_this.mode=="1"){txt.setClass("df_two_after");}
txt.entity.setAttribute("for",radio.id);if($.CommonLan[_this.key[i]]!=undefined){txt.html($.CommonLan[_this.key[i]]);}else{txt.html($.getLan(_this.key[i]+"_r"));}
panel.push(radio,txt);panel.radio=radio;panel.txt=txt;_this.append(panel);_this.panel[i]=panel;}
if(tag.mode=='3'){var after=new DefaultAfter(tag);_this.append(after);var text=new Element("INPUT:text_after");text.setID(tag.name);text.entity.maxLength='4';text.getCheck=function(type){return checkText(text,type);}
_this.append(text);var span=new Element("SPAN");span.html($.CommonLan["text_after"]);_this.append(span);this.after=after;this.text=text;}
_this.panel[0].radio.checked();obj2obj(tag,this);}
function initRadioGroup(tag){var tag=new RadioGroupTag(tag);return tag;}
function initRadioGroupFunction(tag){for(var i=0;i<tag.panel.length;i++){setTagData(tag.panel[i].radio,tag)}}
function OnlyCheckTag(tag){DefaultTag.call(this);var checkbox=new DefaultInput(tag,"checkbox");var after=new DefaultAfter(tag);this.push(checkbox,after);this.checkbox=checkbox;this.after=after;obj2obj(tag,this);}
function initOnlyCheck(tag){var tag=new OnlyCheckTag(tag);return tag;}
function SimpleCheckTag(tag){DefaultTag.call(this,tag);var label=new DefaultLabel(tag);var checkbox=new DefaultInput(tag,"checkbox");var after=new DefaultAfter(tag);this.push(label,checkbox,after);this.checkbox=checkbox;this.after=after;obj2obj(tag,this);}
function initSimpleCheck(tag){var tag=new SimpleCheckTag(tag);return tag;}
function SimpleContextTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);var context=new DefaultSpan(tag);if($.BrowserVersion.indexOf('IE6')!=-1){context.setClass("df_context_ie");}else{context.setClass("df_context");}
var after=new Element("DIV:df_context_after");if(tag.mode=='1'){var con=new DefaultSpan(tag);con.setClass("df_con");var btn=new DefaultInput(tag,'button');context.push(con,btn);}else if(tag.mode=='2'){var con=new DefaultSpan(tag);con.setClass("df_con");var btn_a=new DefaultInput(tag,'button');var btn_b=new DefaultInput(tag,'button');context.push(con,btn_a,btn_b);}else if(tag.mode=='3'){var con=new DefaultSpan(tag);var con_after=new DefaultSpan(tag);con.setClass("df_con");con_after.setClass("df_con_after");context.push(con,con_after);}
this.push(label,context);this.label=label;if(tag.mode=='1'){this.context=con;this.btn=btn;}else if(tag.mode=='2'){this.context=con;this.btn_a=btn_a;this.btn_b=btn_b;}else if(tag.mode=='3'){this.context=con;this.con_after=con_after;}else{this.context=context;this.push(label,context,after);}
this.after=after;obj2obj(tag,this);}
function initSimpleContext(tag){var tag=new SimpleContextTag(tag);return tag;}
function initSimpleContextFunction(tag){var html=tag.context.entity.innerHTML;if(html!=''||html!=' '){setTagData(tag.context,tag);}
}
function InfoContextTag(tag){DefaultTag.call(this);var context=new Element("DIV:df_i_context");context.html($.getLan(tag.name+"_info"));this.push(context);this.context=context;obj2obj(tag,this);}
function initInfoContext(tag){var tag=new InfoContextTag(tag);return tag;}
function SimpleBtnTag(tag){DefaultTag.call(this);var Cl=($.BrowserVersion.indexOf('IE6')!=-1)?"df_btn_tag_ie":"df_btn_tag";this.setClass(Cl);var btn=new DefaultInput(tag,"button");btn.setValue($.CommonLan[tag.mode]);this.push(btn);this.btn=btn;obj2obj(tag,this);}
function initSimpleButton(tag){var tag=new SimpleBtnTag(tag);return tag;}
function ButtonArrayTag(tag){DefaultTag.call(this);this.setClass("df_btn_tag");var _this=this;var ms=eval("("+tag.mode+")");var ac=eval("("+tag.action+")");for(var i=0;i<ms.length;i++){var btn=new DefaultInput(tag,"button");var _btn=btn;btn.setValue($.CommonLan[ms[i]]);btn.setID(ac[i]);btn.setName(ms[i]+"_"+i);btn.entity.onclick=function(){if(tag.action){$.exec(eval("("+tag.action+")")[this.name.substring(this.name.length-1)],tag);}}
if(i==0)
this.btn_a=btn;else
this.btn_b=btn;this.push(btn);}
if(ms[0]=='add'){this.btn_b.entity.style.display="none";}
obj2obj(tag,this);}
function initButtonArray(tag){var tag=new ButtonArrayTag(tag);return tag;}
function SimpleSelectTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);var select=new DefaultSelect(tag);var after=new DefaultAfter(tag);this.push(label,select,after);this.label=label;this.select=select;this.select.wisp=tag.wisp;this.select.opt=tag.value;this.after=after;obj2obj(tag,this);}
function initSimpleSelect(tag){var tag=new SimpleSelectTag(tag);return tag;}
function initSimpleSelectFunction(tag){if(!tag.data){setTagData(tag.select,tag);}}
function SimpleTimeTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);var time_panel=new Element("DIV");time_panel.setClass("df_checkbox_panel");var start=new DefaultSelect(tag);start.entity.id='start';start.entity.style.width="78px";var line=new Element("SPAN");line.html(" - ");line.setClass("df_line");var end=new DefaultSelect(tag);end.entity.id='end';end.entity.style.width="78px";time_panel.push(start,line,end);this.start=start;this.end=end;var chk_all=new DefaultInput(tag,"checkbox");if($.BrowserVersion.indexOf('IE')>=0){chk_all.setClass("df_checkbox_ie");}else{chk_all.setClass("df_checkbox");}
chk_all.entity.onclick=function(){if(this.checked==true){start.entity.disabled=true;end.entity.disabled=true;this.name='true';}else{start.entity.disabled=false;end.entity.disabled=false;this.name='false';}}
var chk_all_label=new Element("SPAN");chk_all_label.setClass("df_checkbox_label");chk_all_label.html($.CommonLan["all_day"]);time_panel.push(chk_all,chk_all_label);time_panel.chk_all=chk_all;this.push(label,time_panel);this.time_panel=time_panel;this.chk_all=chk_all;obj2obj(tag,this);}
function initSimpleTime(tag){var tag=new SimpleTimeTag(tag);return tag;}
var time_map=['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30','23:59'];function initSimpleTimeFunction(tag){tag.start.entity.onchange=function(){for(var i=0;i<time_map.length;i++){tag.end.entity.options.remove(0);}
for(var i=0;i<time_map.length;i++){var opt=new Option(time_map[i],i);tag.end.entity.options.add(opt);}
for(var i=0;i<time_map.length;i++){if(i<parseInt(this.value,10)){tag.end.entity.options.remove(0);}}
tag.end.entity.value=this.value;}
tag.start.entity.onchange();}
var week_arr=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];function SimpleWeekTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);var week_panel=new Element("DIV");week_panel.setClass("df_checkbox_panel");week_panel.chk_arr=new Array();for(var i=0;i<7;i++){var checkbox=new DefaultInput(tag,"checkbox");if($.BrowserVersion.indexOf('IE')>=0){checkbox.setClass("df_checkbox_ie");}else{checkbox.setClass("df_checkbox");}
checkbox.setValue(week_arr[i]);var checkbox_label=new Element("SPAN");checkbox_label.setClass("df_checkbox_label");checkbox_label.html($.CommonLan["week_"+i]);week_panel.push(checkbox,checkbox_label);week_panel.chk_arr.push(checkbox);}
var chk_all=new DefaultInput(tag,"checkbox");if($.BrowserVersion.indexOf('IE')>=0){chk_all.setClass("df_checkbox_ie");}else{chk_all.setClass("df_checkbox");}
chk_all.entity.onclick=function(){for(var i=0;i<week_panel.chk_arr.length;i++){if(this.checked==true){week_panel.chk_arr[i].entity.checked=true;disableDom(week_panel.chk_arr[i],true);}else{week_panel.chk_arr[i].entity.checked=false;disableDom(week_panel.chk_arr[i],false);}}}
var chk_all_label=new Element("SPAN");chk_all_label.setClass("df_checkbox_label");chk_all_label.html($.CommonLan["everday"]);week_panel.push(chk_all,chk_all_label);week_panel.chk_all=chk_all;this.push(label,week_panel);this.label=label;this.week_panel=week_panel;obj2obj(tag,this);}
function initSimpleWeek(tag){var tag=new SimpleWeekTag(tag);return tag;}
function SimpleFileTag(tag){DefaultTag.call(this);var label=new DefaultLabel(tag);var file=new DefaultFile(tag);this.push(label,file);this.label=label;this.file=file;obj2obj(tag,this);}
function initSimpleFile(tag){var tag=new SimpleFileTag(tag);return tag;}
function initSimpleFileFunction(tag){}
var TimesOut=null;function SimpleLoadTag(tag){DefaultTag.call(this);var _this=this;this.setAttr({"style":"padding:0 0 15px 0"});var tip=new Element("DIV:df_load_tip");tip.html($.CommonLan["load_tip"]);var load=new Element("DIV:df_load");var run=new Element("DIV:df_run");var math=new Element("DIV:df_math");load.push(run,math);load.run=run;load.math=math;this.push(tip,load);this.tip=tip;this.load=load;this.setTimeout=function(t,ip,tag){var to=t;TimesOut=window.setInterval(function(){if(t>=0){_this.load.run.entity.style.width=398*((to-t)/to)+"px";_this.load.math.html(Math.ceil((to-t)/to*100)+" %");t-=1;}else{window.clearInterval(TimesOut);if(ip){window.location=ip;}else{if($.CurrentApp=='default'){window.location="http://"+$.Default_ip;}else
window.location.reload();}}},1000);}
obj2obj(tag,this);}
function initSimpleLoad(tag){var tag=new SimpleLoadTag(tag);return tag;}
function SimpleTable(tag){Element.call(this,"TABLE:df_tab");var _this=this;this.setAttr({"cellspacing":"1","cellpadding":"3"});this.size=10;this.page=1;this.max=0;var thead=new SimpleTabHead(tag);this.push(thead);this.thead=thead;var tfoot=new SimpleTabFoot(tag);this.tfoot=tfoot;this.createTable=function(data,size){if(size){_this.size=size;}
_this.data=data;_this.max=Math.ceil(tag.tab.data.length/tag.tab.size);var tbody=new SimpleTabBody(_this);tbody.status=1;tbody.create();_this.append(tbody);_this.tbody=tbody;}}
function SimpleTabHead(tag){Element.call(this,"THEAD:df_thead");var _this=this;_this.arr=eval($.getLan(tag.name+"_thead"));var r1=new Element("TR");var r2=new Element("TR");var htype=0;_this.rowSpan=1;for(var i in _this.arr){if(typeof _this.arr[i]=="object"){_this.rowSpan=2;_this.colSpan=_this.arr[i].con.length;htype=1;break;}}
for(var i=0;i<_this.arr.length;i++){var title=_this.arr[i];if(typeof(title)!="object"){var c=new Element("TD");c.entity.setAttribute("rowSpan",_this.rowSpan);c.html(title);r1.append(c);}else{var h=new Element("TD");h.entity.setAttribute("colSpan",_this.colSpan);h.html(title.head);r1.append(h);for(var j=0;j<title.con.length;j++){var c=new Element("TD");c.html(title.con[j]);r2.append(c);}}}
if(!htype){this.append(r1);}else{this.push(r1,r2);}}
function SimpleTabBody(tab){Element.call(this,"TBODY:df_tbody")
var _this=this;this.status=0;if(!tab.data){return;}
this.create=function(){if(tab.data.length>=tab.size*tab.page){var residue=tab.size;}else{var residue=tab.data.length%tab.size;}
_this.Rows=new Array();for(var i=0;i<residue;i++){var row=new Element("TR");row.setID("row_"+i);row.Cells=new Array();var start=(tab.page-1)*tab.size+i;row.data=tab.data[start];for(var j in tab.data[start]){var cell=new Element("TD");cell.html(tab.data[start][j]);row.append(cell);row.Cells.push(cell);}
if(tab.parent.mode==3||tab.parent.mode==1){var cell=new Element("TD:tab_del_mod");var del=new Element("DIV:tab_del_btn");if(tab.parent.name=="dhcp_client_list"||tab.parent.name=="arp_list"){del.setClass("tab_can_btn");del.entity.title=$.CommonLan['cancel_reserve'];}
del.setID(i)
del.entity.onclick=function(){var action=tab.parent.action;if(action){$.exec(eval("("+action+")").del,_this.Rows[this.id]);}}
var mod=new Element("DIV:tab_mod_btn");if(tab.parent.name=="dhcp_client_list"||tab.parent.name=="arp_list"){mod.setClass("tab_link_btn");var set_v=(tab.parent.name=="arp_list")?"bind":"set_reserve";mod.entity.title=$.CommonLan[set_v];}
mod.setID(i);mod.entity.onclick=function(){var action=tab.parent.action;if(action){$.exec(eval("("+action+")").mod,_this.Rows[this.id]);}}
cell.append(mod);cell.mod=mod;cell.append(del);cell.del=del;row.append(cell);row.Cells.push(cell);}
_this.append(row);_this.Rows.push(row);}
tab.tfoot.num.html(tab.max);tab.tfoot.page_select.html('');if(tab.max=='0'){var o=new Option(0,0);tab.tfoot.page_select.entity.options[0]=o;}
for(var i=0;i<tab.max;i++){var opt=new Option(i+1,i+1);tab.tfoot.page_select.entity.options.add(opt);}
tab.tfoot.page_select.setValue(tab.page);if(tab.tfoot.page_select.entity.value==""){tab.tfoot.page_select.setValue(0);}}
this.clear=function(){for(var i=_this.entity.childNodes.length-1;i>=0;i--){_this.entity.removeChild(_this.entity.childNodes[i]);}}
this.refresh=function(){_this.clear();_this.create();}}
function DefaultPageBtn(tag,key){DefaultInput.call(this,tag,"button");var _this=this;switch(key){case 0:this.setClass('df_page_btn1');break;case 1:this.setClass('df_page_btn2');break;case 2:this.setClass('df_page_btn3');break;case 3:this.setClass('df_page_btn4');break;}
this.key=key;this.entity.onclick=function(){switch(_this.key){case 0:if(tag.tab.page==1){return;};changeTabPage(tag,1);break;case 1:changeTabPage(tag,tag.tab.page-1);break;case 2:changeTabPage(tag,tag.tab.page+1);break;case 3:if(tag.tab.page==tag.tab.max){return;};changeTabPage(tag,tag.tab.max);break;default:break;}}}
function changeTabPage(tag,page){if(page>0&&page<=tag.tab.max){tag.tab.page=page;tag.tab.tbody.refresh();inLogic($.CurrentApp);}}
function SimpleTabFoot(tag){Element.call(this,"DIV:df_tfoot")
var _this=this;var size_label=new DefaultSpan(tag);size_label.setClass('df_page_size_label');size_label.html($.CommonLan["size_label"]);var size_set=new DefaultInput(tag,"text");size_set.setID("page_size");size_set.setClass('df_page_size_set');size_set.setAttr({"maxlength":"3"});size_set.entity.style.width='25px';size_set.setValue(10);var size_btn=new DefaultInput(tag,"button");size_btn.setClass('df_page_size_btn');size_btn.setValue($.CommonLan["size_set_btn"]);this.push(size_label,size_set,size_btn);this.size_set=size_set;this.size_btn=size_btn;var first=new DefaultPageBtn(tag,0);var pre=new DefaultPageBtn(tag,1);var next=new DefaultPageBtn(tag,2);var last=new DefaultPageBtn(tag,3);this.push(first,pre,next,last);var page_select=new DefaultSelect(tag);page_select.entity.style.width='40px';page_select.entity.onchange=function(){resetTabPage(tag,this.value);}
this.push(page_select);this.page_select=page_select;var all=new DefaultSpan(tag);all.html($.CommonLan["max_size_label_a"]);var num=new DefaultSpan(tag);var page=new DefaultSpan(tag);page.html($.CommonLan["max_size_label_b"]);this.push(all,num,page);this.num=num;size_btn.entity.onclick=function(){resetTabSize(tag,_this.size_set.entity.value);}}
function resetTabPage(tag,page){tag.tab.page=parseInt(page);tag.tab.tbody.refresh();inLogic($.CurrentApp);}
function resetTabSize(tag,size){tag.tab.page=1;if(!checkSingleText(tag.tab.tfoot.size_set.entity,'text_page',true)){return;}
tag.tab.size=size;tag.tab.max=Math.ceil(tag.tab.data.length/tag.tab.size);if(size>tag.tab.data.length){tag.tab.tfoot.size_set.setValue(tag.tab.data.length);}
tag.tab.tbody.refresh();inLogic($.CurrentApp);}
function SimpleTableTag(tag){DefaultTag.call(this);this.setClass("df_tab_tag");var _this=this;var tab=new SimpleTable(tag);if(tag.mode=='ap_get'){var pn=($.CurrentApp=="wan")?5:6;var btnArr=new ButtonArrayTag(getTag(pn,1));this.push(tab,tab.tfoot,btnArr);}else if(tag.mode==2||tag.mode==1){this.push(tab);}else{this.push(tab,tab.tfoot);}
this.tab=tab;obj2obj(tag,this);}
function initSimpleTable(tag){var tag=new SimpleTableTag(tag);return tag;}
function SimpleFlotTag(tag){DefaultTag.call(this);}
function initSimpleFlot(tag){var tag=new SimpleFlotTag(tag);return tag;}
function ID(id){return document.getElementById(id);}
function createByTag(t){return document.createElement(t);}
function disableDom(d,bo){d.entity.disabled=bo;}
function getLen(data){var num=0;for(var key in data){num++;}
return num;}
function getPan(pan){return $.Apps[$.CurrentApp].Pans[pan];}
function getTag(pan,tag){return $.Apps[$.CurrentApp].Pans[pan].Tags[tag];}
function getTagDom(pan,tag,dom){return $.Apps[$.CurrentApp].Pans[pan].Tags[tag][dom];}
function setOldData(data){var obj=new Object();if(typeof data=='object'){for(var j in data){obj["old_"+j]=data[j];}}
return obj;}
var time_arr={'00:00':'0','00:30':'1','01:00':'2','01:30':'3','02:00':'4','02:30':'5','03:00':'6','03:30':'7','04:00':'8','04:30':'9','05:00':'10','05:30':'11','06:00':'12','06:30':'13','07:00':'14','07:30':'15','08:00':'16','08:30':'17','09:00':'18','09:30':'19','10:00':'20','10:30':'21','11:00':'22','11:30':'23','12:00':'24','12:30':'25','13:00':'26','13:30':'27','14:00':'28','14:30':'29','15:00':'30','15:30':'31','16:00':'32','16:30':'33','17:00':'34','17:30':'35','18:00':'36','18:30':'37','19:00':'38','19:30':'39','20:00':'40','20:30':'41','21:00':'42','21:30':'43','22:00':'44','22:30':'45','23:00':'46','23:30':'47','23:59':'48'};function setModify(obj){var lens=$.Apps[$.CurrentApp].Pans.len;for(var i in obj){var pan;for(var n=0;n<lens;n++){if($.Apps[$.CurrentApp].Pans[n].name=="ap_get")
pan=getPan(lens-3);else pan=getPan(lens-2);}
for(var j in pan.Tags){var tag=pan.Tags[j];if(tag.type=="simple_btn"){}
if(tag.name==i||tag.type=='text_limit'||tag.type=='text_two'){switch(tag.type){case"simple_select":tag.select.setData(obj[i]);tag.data=obj[i];break;case"simple_text":tag.text.setData(obj[i]);break;case"radio_group":for(var k=0;k<tag.panel.length;k++){tag.panel[k].radio.setData(obj[i]);}
break;case"text_limit":tag.text_a.setData(obj[tag.name+'_start']);tag.text_b.setData(obj[tag.name+'_end']);break;case"text_two":tag.text_a.setData(obj[tag.text_a.entity.id]);tag.text_b.setData(obj[tag.text_b.entity.id]);break;case"simple_week":for(var h=0;h<tag.week_panel.chk_arr.length;h++){tag.week_panel.chk_all.entity.checked=false;disableDom(tag.week_panel.chk_arr[h],false);var arr_week=obj[i].split(' ');tag.week_panel.chk_arr[h].entity.checked=false;for(var w in arr_week){if(arr_week[w]==tag.week_panel.chk_arr[h].value){tag.week_panel.chk_arr[h].entity.checked=true;}}
if(obj[i]=='all'){tag.week_panel.chk_all.entity.checked=true;disableDom(tag.week_panel.chk_arr[h],true);}}
break;case"simple_time":tag.time_panel.chk_all.entity.checked=false;tag.start.entity.disabled=false;tag.end.entity.disabled=false;if(obj[i].indexOf('-')!=-1&&obj[i].indexOf(':')!=-1){var arr=obj[i].split('-');for(var k in time_arr){if(arr[0]==k){tag.start.setData(time_arr[k]);}
if(arr[1]==k){tag.end.setData(time_arr[k]);}}}else if(obj[i]=='all'){tag.time_panel.chk_all.entity.checked=true;tag.start.entity.disabled=true;tag.end.entity.disabled=true;}
break;}}}}}
function getSubmitData(pan){if(pan==null){return $.CurrentData;}
var obj=new Object();for(var i=0;i<pan.length;i++){if(getPan(pan[i]).entity.style.display!='none'){var Pan=getPan(pan[i]);for(var j in Pan.Tags){if(checknobj(j)){continue;}
var tag=Pan.Tags[j];if(tag.type.indexOf('btn')!=-1){tag.mod="save";}
var dis=tag.entity.style.display; if(dis!='none'){var tmp=false;switch(tag.type){case'simple_three':var a=tag.text_a.entity.value;var b=tag.text_b.entity.value;var c=tag.text_c.entity.value;obj[tag.text_a.entity.id]=a;obj[tag.text_b.entity.id]=b;obj[tag.text_c.entity.id]=c;break;case'text_limit':tmp=true;if(tag.select){var sel=tag.select.entity.value;obj[tag.select.entity.id]=sel;}
var a=tag.text_a.entity.value;var b=(tag.text_b.entity.value).replace(/^\s*$/g,"");if(!b){b=a;}
obj[tag.text_a.entity.id]=a;obj[tag.text_b.entity.id]=b;break;case'simple_week':var arr=tag.week_panel.chk_arr;var str='';if(tag.week_panel.chk_all.entity.checked!=true){var chked=false;for(var i=0;i<arr.length;i++){if(arr[i].entity.checked==true){str+=arr[i].entity.value+' ';chked=true;}}
if(!chked){str='all';}}else{str='all';}
tag.data=str;break;case'simple_time':var a=time_map[tag.start.entity.selectedIndex];var b=time_map[tag.end.entity.options[tag.end.entity.selectedIndex].value];var chk=tag.chk_all;if(chk.entity.checked==true){tag.data='all';}else{if(a=="00:00"&&b=="00:00"){tag.data='all';}else{tag.data=a+'-'+b;}}
break;case'text_more':tmp=true;var a=tag.text_a.entity.value;var b=tag.text_b.entity.value;obj[tag.text_a.entity.id]=a;obj[tag.text_b.entity.id]=b;break;case'text_two':var a=tag.text_a.entity.value;var b=tag.text_b.entity.value;obj[tag.text_a.entity.id]=a;obj[tag.text_b.entity.id]=b;break;case'simple_text':if(!tag.text.entity.disabled){var datalen=tag.text.entity.value.length;obj[tag.name]=check_len(tag.text.entity.value,datalen,tag.len);}
break;case'simple_pwd':if(!tag.text.entity.disabled){obj[tag.name]=tag.text.entity.value;}
break;case'radio_group':if(tag.mode=='3'){for(var i=0;i<tag.panel.length;i++){if(tag.panel[i].radio.entity.checked==true){obj[tag.name]=tag.panel[i].radio.entity.value;}}
obj[tag.name+"_v"]=tag.text.entity.value;}else{obj[tag.name]=tag.data;}
break;case'simple_select':obj[tag.name]=tag.select.entity.value;break;}
if(!tmp&&tag.type!="simple_text"&&tag.type!="simple_context"&&tag.type!='simple_pwd'&&tag.type!='info_context'&&tag.type!='simple_three'&&tag.type!='radio_group'&&tag.type!='simple_btn'&&tag.type!='simple_select'&&tag.type!='text_two'){obj[tag.name]=tag.data;}}}}
}
return obj;}
function createSubmitObject(p,d){var obj=new Object();for(var i=0;i<d.length;i++){obj[d[i][0]]=getTag(p,d[i][1]).data;}
return obj;}
function getObjStr(obj){var str='{';for(var i in obj){str+=i+':"'+obj[i]+'",';}
str=str.substring(0,str.length-1);str+='}';return str;}
function testInfo(obj){var str='';for(var i in obj){if(typeof obj[i]=='object'){str+=i+":[";for(var j=0;j<obj[i].length;j++){if(j<obj[i].length-1){str+=getObjStr(obj[i][j])+',';}else{str+=getObjStr(obj[i][j]);}}
str+=']\r\n';}else{str+=i+":"+obj[i]+'\r\n';}}
alert(str);}
function setPanAction(pan,action){for(var i=0;i<pan.length;i++){if(typeof action=='string'){getPan(pan[i])[action]();}else if(typeof action=='function'){action(getPan(pan[i]));}}}
function setPanArr(pan,data){for(var i=0;i<pan.length;i++){getPan(pan[i]).display=data;}}
function setTagDomAction(pan,tag,dom,action){var obj={};obj=new Array();if(tag==null){return;}
var t=tag[0].toString().split('-');if(t.length>1){var len=parseInt(t[1],10)-parseInt(t[0],10)+1;for(var i=0;i<len;i++){if(dom!=null){obj.push($.Apps[$.CurrentApp].Pans[pan].Tags[i+parseInt(t[0],10)][dom]);}else{obj.push($.Apps[$.CurrentApp].Pans[pan].Tags[i+parseInt(t[0],10)]);}}}else{var len=tag.length
for(var i=0;i<len;i++){if(dom!=null){obj.push($.Apps[$.CurrentApp].Pans[pan].Tags[tag[i]][dom]);}else{obj.push($.Apps[$.CurrentApp].Pans[pan].Tags[tag[i]]);}}}
if(typeof action=='string'){for(var i=0;i<obj.length;i++){obj[i][action]();}}else if(typeof action=='function'){for(var i=0;i<obj.length;i++){action(obj[i]);}}}
function setTagData(dom,tag){

if($.DataMap){dom.setData($.DataMap[tag.name]);tag.data=$.DataMap[tag.name];}}
function setCurrentData(data,name){$.CurrentData[name]=data[name];}
function setAppTagData(data){$.CurrentData={};if(!data){return;}
var pans=$.Apps[$.CurrentApp].Pans;for(var i in pans){if(checknobj(i)){continue;}
for(var j in pans[i].Tags){if(checknobj(j)){continue;}
var tag=pans[i].Tags[j];if(data[tag.name]){setCurrentData(data,tag.name);}else{continue;}
switch(tag.type){case"simple_context":tag.context.html(data[tag.name]);break;case"simple_select":tag.select.setData(data[tag.name]);break;case"simple_three":tag.text_a.setData(data[tag.name]);tag.text_b.setData(data[tag.name+2]);tag.text_c.setData(data[tag.name+3]);break;case"text_two":tag.text_a.setData(data[tag.text_a.entity.id]);tag.text_b.setData(data[tag.text_b.entity.id]);case"simple_text": tag.text.setData(data[tag.name]); break;case"simple_pwd": tag.text.setData(data[tag.name]); break;case"radio_group":for(var k=0;k<tag.panel.length;k++){tag.panel[k].radio.setData(data[tag.name]);}
if(tag.mode=="3"){tag.text.entity.value=$.DataMap[tag.name+'_v'];}
break;case"simple_table":if(tag.tab.tbody){tag.tab.data=data[tag.name];tag.tab.tbody.refresh();}else{tag.tab.createTable(data[tag.name]);}
break;}}}}
var xmlhttp=null;function createXmlhttp(){if(window.XMLHttpRequest){
xmlhttp=new XMLHttpRequest(); if(xmlhttp.overrideMimeType){xmlhttp.overrideMimeType("text/xml");}}else if(window.ActiveXObject){
 var activexName=["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];for(var i=0;i<activexName.length;i++){try{ xmlhttp=new ActiveXObject(activexName[i]);break;}catch(e){}}}}
var currentCallBack=null;function sendRequest(url,param,callback){currentCallBack=callback;createXmlhttp();try{xmlhttp.onreadystatechange=processResponse; xmlhttp.open("post",$.PATH+url+".cgi",true); xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");xmlhttp.setRequestHeader("Cache-Control","no-cache");if(!param['mode_name']){var str="mode_name="+url+"&";}else{var str='';}
for(var i in param){str+=i+"="+encodeURIComponent(param[i])+"&";}
str=str.substring(0,str.length-1);xmlhttp.send(str);}catch(e){}}
function processResponse(){if(xmlhttp.readyState==4){if(xmlhttp.status==200||xmlhttp.status==0){var str=xmlhttp.responseText;if(currentCallBack){currentCallBack(str);}}}}
function ltrim(s){return s.replace(/(^\s*)/g,"");}
function rtrim(s){return s.replace(/(\s*$)/g,"");}
function trim(s){return rtrim(ltrim(s));}
var CheckMap={"text_page":"check_page_size","text_pak":"check_pak","text_pass":"check_pass","text_rule":"check_rule","text_num":"check_num","text_num4094":"check_num4094","text_ip":"check_ip","text_dns":"check_dns","text_mac":"check_mac","text_mask":"check_mask","text_port":"check_port","text_port_null":"check_port_null","text_key_time":"check_key_time","text_dhcp_time":"check_dhcp_time","text_string":"check_string","text_string_null":"check_string_null","text_string_spac":"check_string_spac","text_string_ch":"check_string_ch","text_string_rule":"check_string_rule","text_string_ssid":"check_string_ssid","text_az09":"check_az09_string","text_domain":"check_domain","text_url":"check_url","text_pin":"check_pin","text_mtu_dhcp":"check_mtu_dhcp","text_mtu_pppoe":"check_mtu_pppoe","text_mtu_static":"check_mtu_static","text_mtu_l2tp":"check_mtu_l2tp","text_mtu_pptp":"check_mtu_pptp","text_beacon":"check_beacon","text_rts":"check_rts","text_frag":"check_frag","text_router":"check_router_num","text_ip_broad":"check_ip_broad","text_common":"check_common","text_hex":"check_hex","text_ascii":"check_ascii","text_qos_band":"check_qos_bandwidth","text_ipaddr_field":"check_ip_last_addr"};function checkText(text,type){var check=new Object();check.data=text.entity.value;if(text.ID=='ssid'){check.data=trim(text.entity.value);}
check.val=false;check.info=" ";$.exec(CheckMap[type],check);return check;}
function checkSingleText(txt,type,flag){var check=new Object();check.data=txt.value;check.val=false;check.info=" ";$.exec(CheckMap[type],check);if(!check.val){checkShow(txt,check.info,flag);return false;}
return true;}
function checkTag(pa){for(var i=0;i<pa.length;i++){var pan=getPan(pa[i]);var tags=pan.Tags;for(var j in tags){if(checknobj(j)||tags[j].type!='simple_text'&&tags[j].type!='simple_pwd'){continue;}
var ch_text=tags[j].text;var ch=ch_text.getCheck(); if(tags[j].entity.style.display!='none'){if(tags[j].text.entity.disabled){continue;}
if(!ch.val){checkShow(ch_text,ch.info);return false;}}}}
return true;}
function checkDom(text,type){var ch=text.getCheck(type);if(!ch.val){checkShow(text,ch.info);return false;}
return true;}
function checkDomArr(p,t_r,t_c){for(var i=0;i<t_r.length;i++){var txt=getTag(p,t_r[i]).text;if(!checkDom(txt,t_c[i])){return false;}}
return true;}
function checkShow(text,info,flag){$.lockWin(' ',false,flag);if(info==''){$.unlockWin('設定錯誤!');}else{$.unlockWin(info,flag);}
if(text.entity){var ent=text.entity;}else{var ent=text;}
ent.style.border="solid 1px #EA7E12";window.setTimeout(function(){ent.style.border="solid 1px #d2d2d2";},5000);}
function checkCommon(text,info){$.lockWin(' ');$.unlockWin(info);text.style.border="solid 1px #EA7E12";window.setTimeout(function(){text.style.border="solid 1px #d2d2d2";},5000);}
function check_common(ch){ch.val=true;}
var regMap={pass:/^\w+|[,.!:'";\/~`@#$%^&*)(\[\]}{><?]|[\\\'\"]$/,rule:/\s|[,.!:'";\/~`@#$%^&*)(\[\]}{><?]|[\\\'\"]/,num:/^([1-9]\d*)|(0)$/,num4094:/^((\d{1,3})|([1-3]\d\d\d)|(40[0-8]\d)|(409[0-4]))$/,str_null:/[\\\'\"]|\s/,str:/[\\\'\"]/,az09:/^(|[A-Za-z\d]+)$/,che:/[\u4E00-\u9FA5\uF900-\uFA2D]/,domain:/[\u4E00-\u9FA5\uF900-\uFA2D]|[\\\'\"]/,url:/^([A-Za-z\d\.\-]+)$/,hex:/^[A-Fa-f\d]+$/,ip:/^((22[0-3])|(2[0-1]\d)|(1\d\d)|([1-9]\d)|[1-9])(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/,dns:/^(|((22[0-3])|(2[0-1]\d)|(1\d\d)|([1-9]\d)|[1-9])(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3})$/,mac:/^([A-Fa-f\d][02468aceACE]-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2})|([A-Fa-f\d][02468aceACE]:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2})$/,port:/^(\d{1,4}|([1-5]\d{4})|6[0-4]\d{3}|65[0-4]\d\d|655[0-2]\d|6553[0-5])$/,port_null:/^(|\d{1,4}|([1-5]\d{4})|6[0-4]\d{3}|65[0-4]\d\d|655[0-2]\d|6553[0-5])$/,keytime:/^([6-9]\d|\d{3,4}|[1-7]\d\d\d\d|8[0-5]\d\d\d|86[0-3]\d\d|86400)$/,dhcptime:/^([6-9]\d|\d{3,6}|[1-2][0-5][0-8]\d\d\d\d|2591\d\d\d|2592000)$/,limit255:/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/,limit12799:/^(\d{1,4}|1[0-1]\d\d\d|12[0-7]\d\d)$/,year:/^(200[8-9]|2\d[1-2]\d|2\d3[0-5])$/,mon:/^(0[1-9]|[1-9]|1[0-2])$/,hour:/^(0[0-9]|[0-9]|1[0-9]|2[0-3])$/,minsec:/^(0[0-9]|[0-9]|[1-5][0-9])$/,pak:/^([5-9]|[1-9]\d|[1-9]\d\d|[1-2]\d\d\d|3000)$/,pin:/^\d{8}$/,page:/^([1-9]|[1-9]\d|100)$/};function check_pak(ch){var str=ch.data;var reg=new RegExp(regMap.pak);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["pak_err"];return;}
ch.val=true;}
function check_pass(ch){var str=ch.data;var reg=new RegExp(regMap.pass);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["pass_err"];return;}
var regC=new RegExp(regMap.che);flagC=regC.test(str);if(flagC){ch.info=$.CommonLan["pass_err"];return;}
ch.val=true;}
function check_rule(ch){var str=ch.data;var reg=new RegExp(regMap.rule);flag=reg.test(str);if(flag||str==''){ch.info=$.CommonLan["rule_err"];return;}
ch.val=true;}
function check_num(ch){var str=ch.data;var reg=new RegExp(regMap.num);flag=reg.test(str);if(!flag||str==''){ch.info=$.CommonLan["int_number_err"];return;}
ch.val=true;}
function check_num4094(ch){var str=ch.data;var reg=new RegExp(regMap.num4094);flag=reg.test(str);if(!flag||str==''){ch.info=$.CommonLan["int_number_err"];return;}
ch.val=true;}
function check_ip(ch){var str=ch.data;var reg=new RegExp(regMap.ip);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["ip_addr_err"];return;}
var str2=str.split(".");if(str2[0]==127){ch.info=$.CommonLan["ip_addr_err"];return;}
ch.val=true;}
function check_ip_broad(ch){var str=ch.data;if(str=="255.255.255.255"){ch.val=true;return;}
var reg=new RegExp(regMap.ip);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["ip_addr_err"];return;}
var str2=str.split(".");if(str2[0]==127){ch.info=$.CommonLan["ip_addr_err"];return;}
ch.val=true;}
function check_mac(ch){var str=ch.data;var reg=new RegExp(regMap.mac);var flag=reg.test(str);if(!flag||str=='00:00:00:00:00:00'||str=='00-00-00-00-00-00'){ch.info=$.CommonLan["mac_addr_err"];return;}
ch.val=true;}
function check_dns(ch){var str=ch.data;var reg=new RegExp(regMap.dns);flag=reg.test(str);if(!flag){ch.info=$.CommonLan['ip_addr_err'];return;}
var str2=str.split(".");if(str2[0]==127||str2[3]==0){ch.info=$.CommonLan["ip_addr_err"];return;}
ch.val=true;}
function check_mask(ch){var str=ch.data;var strsub=str.split(".");if(str==""||str=="0.0.0.0"||str=="255.255.255.255"||strsub.length!=4){ch.info=$.CommonLan["mask_addr_err"];return;}
for(var j=0;j<strsub.length;j++){if(strsub[j]!="0"&&strsub[j]!="128"&&strsub[j]!="192"&&strsub[j]!="224"&&strsub[j]!="240"&&strsub[j]!="248"&&strsub[j]!="252"&&strsub[j]!="254"&&strsub[j]!="255"||strsub[j]==''||strsub[j]==' '){ch.info=$.CommonLan["mask_addr_err"];return;}
if(strsub[j].length>3){ch.info=$.CommonLan["mask_addr_err"];return;}}
if(strsub[0]!="255"&&strsub[1]!="0"){ch.info=$.CommonLan["mask_addr_err"];return;}
if(strsub[1]!="255"&&strsub[2]!="0"){ch.info=$.CommonLan["mask_addr_err"];return;}
if(strsub[2]!="255"&&strsub[3]!="0"){ch.info=$.CommonLan["mask_addr_err"];return;}
if(strsub[3]==''){ch.info=$.CommonLan["mask_addr_err"];return;}
ch.val=true;}
function IP2Bin(ip)
{var strIP=ip.toString(2);var len=strIP.length;if(len<8)
{for(var i=0;i<8-len;i++){strIP="0"+strIP;}}
return strIP;}
function GetIP(ip_str)
{var ip="";var obj={};var ip_arr=ip_str.split(".");for(var i=0;i<ip_arr.length;i++){obj["ip"+i]=parseInt(ip_arr[i],10);ip+=IP2Bin(obj["ip"+i])}
return ip;}
function GetSubnet(ip,mask){var sub="";for(var i=0;i<4;i++){var arr1=ip.split('.');var arr2=mask.split('.');var sub_str=IP2Bin(parseInt(arr1[i],10).toString(2))&parseInt(arr2[i],10);sub+=IP2Bin(sub_str);}
return sub;}
function check_ip_mask(ip,mask,tag,flag){var index=0;var mask_str=GetIP(mask);var ip_str=GetIP(ip);var subnet=AND(ip_str,mask_str);var bcast=XNOR(subnet,mask_str);var sub_ten=parseInt(subnet,2).toString(10);var bct_ten=parseInt(bcast,2).toString(10);if(ip_str==subnet){if(typeof tag=='string'){checkCommon(ID(tag),$.CommonLan['segment_err']);}else{checkShow(tag.text,$.CommonLan['segment_err']);}
return false;}
if(ip_str==bcast){if(typeof tag=='string'){checkCommon(ID(tag),$.CommonLan['Bcast_err']);}else{checkShow(tag.text,$.CommonLan['Bcast_err']);}
return false;}
if(flag){var ip_ten=parseInt(GetIP(flag),2).toString(10);if(parseInt(ip_ten)<parseInt(sub_ten)||parseInt(ip_ten)>parseInt(bct_ten)){if(typeof tag=='string'){checkCommon(ID(tag),$.CommonLan['segment_len_err']);}else{checkShow(tag.text,$.CommonLan['segment_len_err']);}
return false;}}
return true;}
function check_wan_lan_segment(tag1,tag2,interface,gw){var ip=tag1.text.entity.value;var mask=tag2.text.entity.value;var lan_sn=AND(GetIP($.DataMap.lan_ip),GetIP($.DataMap.lan_mask));if(interface=='wan'){var mk=AND(GetIP(mask),GetIP($.DataMap.lan_mask));var lan_sn=AND(GetIP($.DataMap.lan_ip),mk);var subnet_w=AND(GetIP(ip),mk);var flag_gw=(gw&&(ip==gw.text.entity.value))?true:false;if(subnet_w==lan_sn||flag_gw){checkShow(tag1.text,$.CommonLan['wan_lan_err']);return false;}}else{var mk=AND(GetIP(mask),GetIP($.DataMap.wan_mask));var wan_sn=AND(GetIP($.DataMap.wan_ip),mk);var subnet_l=AND(GetIP(ip),mk);if(subnet_l==wan_sn){checkShow(tag1.text,$.CommonLan['wan_lan_err']);return false;}}
return true;}
function check_lan_segment(tag){var now_ip=tag.text.entity.value;var l_sub=AND(GetIP($.DataMap.lan_ip),GetIP($.DataMap.lan_mask));var n_sub=AND(GetIP(now_ip),GetIP($.DataMap.lan_mask));if(l_sub!=n_sub){checkShow(tag.text,$.CommonLan['ip_err']);return false;}
return true;}
function check_lan_dhcp_segment(ip,mask){}
function check_gw_segment(t_ip,t_mask,t_gw){var ip=t_ip.text.entity.value;var mk=t_mask.text.entity.value;var gw=t_gw.text.entity.value;var subnet_i=AND(GetIP(ip),GetIP(mk));var subnet_g=AND(GetIP(gw),GetIP(mk));if(subnet_i!=subnet_g){checkShow(t_gw.text,$.CommonLan['gw_err']);return false;}
return true;}
function OR(ip,mask){var str='';for(var i=0;i<32;i++){var a=ip.substring(i,i+1);var b=mask.substring(i,i+1);if(a=='1'||b=='1'){str+='1';}else{str+='0';}}
return str;}
function AND(ip,mask){var str='';for(var i=0;i<32;i++){var a=ip.substring(i,i+1);var b=mask.substring(i,i+1);if(a=='0'||b=='0'){str+='0';}else{str+='1';}}
return str;}
function XNOR(ip,mask){var str='';for(var i=0;i<32;i++){var a=ip.substring(i,i+1);var b=mask.substring(i,i+1);if(a==b){str+='1';}else{str+='0';}}
return str;}
function NOT(ip){var str='';for(var i=0;i<32;i++){var a=ip.substring(i,i+1);if(a=='0'){str+='1';}else{str+='0';}}
return str;}
function NtoH(str){var data='';for(var i=0;i<str.length;i++){var st=str.substring(i,i+8);var ten=parseInt(st,2).toString();data+=ten+".";i=i+7;}
data=data.substring(0,data.length-1);return data;}
function TtoB(ten){bin="";while(ten>0){bin=(ten%2!=0)?("1"+bin):("0"+bin);ten=parseInt(ten/2);}
if(bin.length!=32){var len=32-bin.length;for(var i=0;i<len;i++){bin='0'+bin;}}
return bin;}
function get_mask_by_ip(start,end,flag){var s=parseInt(GetIP(start),2);var e=parseInt(GetIP(end),2);var ms=parseInt(e+1-(s-1)).toString(2);var str="";for(var i=0;i<(32-ms.length);i++){str=str+'1';}
if(str.length!=32){for(var j=0;j<ms.length;j++){str=str+'0';}}
return(flag==2)?str:NtoH(str);}
function check_port(ch){var arr=ch.data.split(',');for(var i=0;i<arr.length;i++){var str=arr[i];var reg=new RegExp(regMap.port);flag=reg.test(str);if(!flag||str=='0'){ch.info=$.CommonLan['port_err'];return;}}
ch.val=true;}
function check_port_null(ch){var str=ch.data;if(str==" "){str='';}
var reg=new RegExp(regMap.port_null);flag=reg.test(str);if(!flag||str=='0'){ch.info=$.CommonLan['port_err'];return;}
ch.val=true;}
function check_key_time(ch){var str=ch.data;var reg=new RegExp(regMap.keytime);flag=reg.test(str);if(!flag){ch.info=$.CommonLan['key_time_err'];return;}
ch.val=true;}
function check_dhcp_time(ch){var str=ch.data;var reg=new RegExp(regMap.dhcptime);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["int_number_err"];return;}
ch.val=true;}
function check_string(ch){var str=ch.data;var reg=new RegExp(regMap.str_null);flag=reg.test(str);if(flag){ch.info=$.CommonLan["string_err"];return;}
var reg1=new RegExp(regMap.che);flag1=reg1.test(str);if(flag1||!str){ch.info=$.CommonLan["string_null"];return;}
if(!common_ascii(ch)){return;}
ch.val=true;}
function check_string_spac(ch){var str=ch.data;var reg=new RegExp(regMap.str);flag=reg.test(str);if(flag){ch.info=$.CommonLan["string_null_err"];return;}
var reg1=new RegExp(regMap.che);flag1=reg1.test(str);if(flag1||!str){ch.info=$.CommonLan["string_null"];return;}
ch.val=true;}
function check_string_null(ch){var str=ch.data;var reg=new RegExp(regMap.str_null);flag=reg.test(str);if(flag){ch.info=$.CommonLan["string_err"];return;}
var reg1=new RegExp(regMap.che);flag1=reg1.test(str);if(flag1){ch.info=$.CommonLan["string_null"];return;}
if(str.length){if(!common_ascii(ch)){return;}}
ch.val=true;}
function check_string_ch(ch){var str=ch.data;var reg=new RegExp(regMap.str);flag=reg.test(str);if(flag){ch.info=$.CommonLan["string_null_err"];return;}
ch.val=true;}
function check_string_rule(ch){var str=ch.data;var reg=new RegExp(regMap.str_null);flag=reg.test(str);if(flag){ch.info=$.CommonLan["string_err"];return;}
ch.val=true;}
function check_string_ssid(ch){var str=ch.data;var reg=new RegExp(regMap.str);flag=reg.test(str);if(str==""||flag){ch.info=$.CommonLan["string_null_err"];return;}
ch.val=true;}
function check_az09_string(ch){var str=ch.data;var reg=new RegExp(regMap.az09);flag=reg.test(str);if(!flag||str==''){ch.info=$.CommonLan["az09_string_err"];return;}
ch.val=true;}
function check_domain(ch){var str=ch.data;for(var h=0;h<str.length;h++){var tst=str.substring(h,h+2);if(tst=='..'){ch.info=$.CommonLan["domain_err"];return;}}
var reg=new RegExp(regMap.domain);flag=reg.test(str);if(flag||str==''){ch.info=$.CommonLan["domain_err"];return;}
ch.val=true;}
function check_url(ch){var str=ch.data;var reg=new RegExp(regMap.url);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["string_url_err"];return;}
ch.val=true;}
function check_hex(ch){var str=ch.data;var reg=new RegExp(regMap.hex);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["string_hex_err"];return;}
ch.val=true;}
function check_ascii(ch){str=ch.data;var reg=new RegExp(regMap.str_null);flag=reg.test(str);if(flag){ch.info=$.CommonLan["string_err"];return;}
if(!common_ascii(ch)){return;}
ch.val=true;}
function common_ascii(ch){str=ch.data;if(!str.length){ch.info=$.CommonLan["string_null"];return;}
for(var i=0;i<str.length;i++){var s=str.substring(i,i+1);var a=s.charCodeAt();if(a<0||a>255){ch.info=$.CommonLan["string_null"];return false;}}
return true;}
function check_ip_last_addr(ch){str=ch.data;if(str.length>1&&str.substring(0,1)=='0'){ch.info=$.CommonLan["ip_addr_err"];return;}
var reg=new RegExp(regMap.limit255);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["ip_addr_err"];return;}
ch.val=true;}
function check_qos_bandwidth(ch){var str=ch.data;if(str.length>1&&str.substring(0,1)=='0'){ch.info=$.CommonLan["int_number_err"];return;}
var reg=new RegExp(regMap.limit12799);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["int_number_err"];return;}
ch.val=true;}
function check_pin(ch){var str=ch.data;var reg=new RegExp(regMap.pin);flag=reg.test(str);if(!flag){ch.info=$.CommonLan["pin_number_err"];return;}
ch.val=true;}
function check_page_size(ch){var str=ch.data;var reg=new RegExp(regMap.page);flag=reg.test(str);if(!flag){ch.info=$.CommonLan['page_err'];return;}
ch.val=true;}
function check_mtu_dhcp(ch){check_limit_int(ch,getTag(3,'dhcp_mtu'),576,1500,'dhcp_mtu_err');}
function check_mtu_pppoe(ch){check_limit_int(ch,getTag(3,'pppoe_mtu'),576,1492,'pppoe_mtu_err');}
function check_mtu_static(ch){check_limit_int(ch,getTag(3,'static_mtu'),576,1500,'static_mtu_err');}
function check_mtu_l2tp(ch){check_limit_int(ch,getTag(3,'l2tp_mtu'),576,1460,'l2tp_mtu_err');}
function check_mtu_pptp(ch){check_limit_int(ch,getTag(3,'pptp_mtu'),576,1420,'pptp_mtu_err');}
function check_beacon(ch){check_limit_int(ch,getTag(0,0),20,1000,'beacon_err');}
function check_rts(ch){check_limit_int(ch,getTag(0,1),256,2347,'rts_err');}
function check_frag(ch){check_limit_int(ch,getTag(0,2),256,2346,'frag_err');}
function check_router_num(ch){check_limit_int(ch,getTag(0,0),100,1024,'router_err');}
function check_YMD(year,mon,day){var regY=new RegExp(regMap.year);flagY=regY.test(year);if(!flagY){checkShow(ID("time_date"),$.CommonLan["year_err"]);return;}
var regM=new RegExp(regMap.mon);flagM=regM.test(mon);if(!flagM){checkShow(ID("time_date2"),$.CommonLan["mon_err"]);return;}
var regD=new RegExp(regMap.num);flagD=regD.test(day);if(!flagD){checkShow(ID("time_date3"),$.CommonLan["int_number_err"]);return;}
mon=parseInt(mon,10);day=parseInt(day,10);if(mon=='1'||mon=='3'||mon=='5'||mon=='7'||mon=='8'||mon=='10'||mon=='12'){if(day<1||day>31){checkShow(ID("time_date3"),$.CommonLan["day31_err"]);return;}}
if(mon=='4'||mon=='6'||mon=='9'||mon=='11'){if(day<1||day>30){checkShow(ID("time_date3"),$.CommonLan["day30_err"]);return;}}
if(mon=='2'){if((year%4=='0'&&year%100!='0')||year%400=='0'){ if(day<1||day>29){checkShow(ID("time_date3"),$.CommonLan["day29_err"]);return;}}else if(day<1||day>28){checkShow(ID("time_date3"),$.CommonLan["day28_err"]);return;}}
return true;}
function check_HMS(hour,min,sec){var regH=new RegExp(regMap.hour);flagH=regH.test(hour);if(!flagH){checkShow(ID("time_time"),$.CommonLan['hour_err']);return;}
var regM=new RegExp(regMap.minsec);flagM=regM.test(min);if(!flagM){checkShow(ID("time_time2"),$.CommonLan['min_sec_err']);return;}
var regS=new RegExp(regMap.minsec);flagS=regS.test(sec);if(!flagS){checkShow(ID("time_time3"),$.CommonLan['min_sec_err']);return;}
return true;}
function check_reboot_date(hour,min){var regH=new RegExp(regMap.hour);flagH=regH.test(hour);if(!flagH){checkShow(getTag(1,1).text,$.CommonLan['hour_err']);return;}
var regM=new RegExp(regMap.minsec);flagM=regM.test(min);if(!flagM){checkShow(getTag(1,2).text,$.CommonLan['min_sec_err']);return;}
return true;}
function check_ip_limit(start,end,flag){var s=parseInt(GetIP(start.text.entity.value),2);var e=parseInt(GetIP(end.text.entity.value),2);var len=e-s+1;if(s>e){checkShow(start.text,$.CommonLan['cmp_ip_err']);return false;}
if(flag=='dhcp'){var sub=AND(GetIP($.DataMap.lan_ip),GetIP($.DataMap.lan_mask));var sub_a=AND(GetIP(start.text.entity.value),GetIP($.DataMap.lan_mask));var sub_b=AND(GetIP(end.text.entity.value),GetIP($.DataMap.lan_mask));if(sub!=sub_a){checkShow(start.text,$.CommonLan['lan_ip_err']);return false;}
if(sub!=sub_b){checkShow(end.text,$.CommonLan['lan_ip_err']);return false;}
if(!check_ip_mask(start.text.entity.value,$.DataMap.lan_mask,getTag(1,'dhcp_start_ip'))){return;}
if(!check_ip_mask(end.text.entity.value,$.DataMap.lan_mask,getTag(1,'dhcp_end_ip'))){return;}
if(start.text.entity.value==$.DataMap.lan_ip){checkShow(start.text,$.CommonLan['lan_addr_err']);return false;}
if(end.text.entity.value==$.DataMap.lan_ip){checkShow(end.text,$.CommonLan['lan_addr_err']);return false;}
if(len>253){checkShow(end.text,$.CommonLan['addr_err']);return false;}}
return true;}
function check_limit_int(ch,tag,min,max,err){var str=tag.text.entity.value;var reg=/^\d+$/;flag=reg.test(str);if(!flag){ch.info=$.CommonLan[err];return;}
if(parseInt(tag.text.entity.value)<min||parseInt(tag.text.entity.value)>max){ch.info=$.CommonLan[err];return;}
ch.val=true;}
var special_map={"%":"%25","&":"%26","=":"%3D","+":"%2B"," ":"%20"};function check_special(val){var str=val;if(str==""||str==null){return str;}
var cmp='%&=+ ';var tmp='';for(var i=0;i<str.length;i++){var s=str.substring(i,i+1);if(cmp.indexOf(s)!='-1'){tmp+=special_map[s];continue;}
tmp+=s;}
return tmp;}
function setLabelHeight(p,t,h){getTagDom(p,t,'label').entity.style.height=h;getTagDom(p,t,'label').entity.style.lineHeight=h;}
function initPageStatus(n){if($.CurrentApp=='lan_set'||$.CurrentApp=='reboot'||$.CurrentApp=='default'||$.CurrentApp=='update'||$.CurrentApp=='backup'){return;}
var Pans=$.Apps[$.CurrentApp].Pans;for(var i in Pans){if(checknobj(i)){continue;}
if(Pans[i].display=='0'){Pans[i].hide();}else{Pans[i].show();}
}}
function check_host_ip(sele,p,t){if(sele=="sub_host"){}else if(sele=="ip_host"){if(!check_ip_limit(getTag(p,t),getTag(p,t+1))){return false;}}
return true;}
function check_port_limit(tag,proto){if(proto=='1'||proto=='2'||proto==null){var tag_a=tag.text_a;var tag_b=tag.text_b;if(!checkDom(tag_a,"text_port")){return false;}
if(!checkDom(tag_b,"text_port_null")){return false;}}
if(!port_compare(tag)){return false;}
return true;}
function port_compare(tag){var val_a=tag.text_a.entity.value;var val_b=tag.text_b.entity.value;if(parseInt(val_a)>parseInt(val_b)){checkShow(tag.text_b,$.CommonLan['cmp_port_err']);return false;}
return true;}
function time_compare(p,t){var a=getTagDom(p,t,"start").entity.value;var b=getTagDom(p,t,"end").entity.value;if(a!='0'&&b!='0'){if(a==b){checkShow(getTagDom(p,t,'end'),$.CommonLan['end_time_err']);return false;}}
return true;}
function check_len(data,dlen,tlen){if(data==''){return data;}
var re=/[^\x00-\xff]/;var le=data.replace(/[^\x00-\xff]/g,"***").length; if(le>dlen){var n=0;for(var i in data){n=(re.test(data[i]))?(n+3):(n+1);if(n>=parseInt(tlen)){if(n-parseInt(tlen)>2)
return data.substring(0,parseInt(i)-1);else if(n==parseInt(tlen))
return data.substring(0,parseInt(i)+1);else
return data.substring(0,parseInt(i));}}}
return data;}
function check_lan_ip(tag){var lan=GetIP(tag.text.entity.value);lan_ten=parseInt(lan,2).toString(10);dhcp_s=parseInt(GetIP($.DataMap.dhcp_start_ip),2).toString(10);dhcp_e=parseInt(GetIP($.DataMap.dhcp_end_ip),2).toString(10);if(lan_ten>dhcp_e||lan_ten<dhcp_s){checkShow(tag.text,$.CommonLan['reserver_err']);return false;}
return true;}
var ip_arr=new Array();function get_ip_arr(arr,IP,end){var arr_ip=ip_arr;arr_ip.length='0';for(var i=0;i<arr.length;i++){if(end){var ip_sta=parseInt(GetIP(arr[i][IP]),2);var ip_end=parseInt(GetIP(arr[i][end]),2);var len=ip_end-ip_sta+1;for(var j=0;j<len;j++){arr_ip.push(NtoH(TtoB(ip_sta)));ip_sta++;}}else{var ip=arr[i][IP];arr_ip.push(ip);}}}
var mac_arr=new Array();function get_mac_arr(arr,MAC){var arr_mac=mac_arr;arr_mac.length="0";$.TabLen=arr.length;for(var i=0;i<arr.length;i++){var mac=arr[i][MAC];arr_mac.push(mac);}}
function check_port_list(tag,list,tagp){var data=new Array();obj2obj(data,$.AllData[list]);var pa=(tag.text_a.entity.disabled)?'1':tag.text_a.entity.value;var pb=(tag.text_b.entity.disabled)?'65535':tag.text_b.entity.value;var pr=tagp.data;if(pa==''||pr=='4'){return true;} 
if(MOD=='mod'){data.splice(MODData.id-1,1);}
for(var i=0;i<data.length;i++){var pla=parseInt(data[i][tag.name+'_start']);var plb=parseInt(data[i][tag.name+'_end']);if(pr=='3'){if((pa==pla&&pb==plb)||(pa>=pla&&pa<=plb)||(pb>=pla&&pb<=plb)||(pa<=pla&&pb>=plb)){checkShow(tag.text_a,$.CommonLan['port_occupy_err']);return false;}}else{if((data[i][tagp.name]==pr)&&((pa==pla&&pb==plb)||(pa>=pla&&pa<=plb)||(pb>=pla&&pb<=plb)||(pa<=pla&&pb>=plb))){checkShow(tag.text_a,$.CommonLan['port_occupy_err']);return false;}}}
return true;}
function check_mac_list(tag,data){var temp_arr;if(MOD=="mod"){temp_arr=Remove(mac_arr,MODData[data]);}else{temp_arr=mac_arr;}
for(var i=0;i<temp_arr.length;i++){if(temp_arr[i]==tag.text.entity.value.toLowerCase().replace(/-/g,':')){checkShow(tag.text,$.CommonLan['mac_occupy_err']);return false;}}
return true;}
function check_ip_list(tag,data){var temp_arr;if(MOD=="mod"){temp_arr=Remove(ip_arr,MODData[data]);}else{temp_arr=ip_arr;}
for(var i=0;i<temp_arr.length;i++){if(temp_arr[i]==tag.text.entity.value){ checkShow(tag.text,$.CommonLan['ip_occupy_err']);return false;}}
return true;}
function check_ip_arrs(tag1,tag2,list){var data=new Array();obj2obj(data,$.AllData[list]);var ip_s=parseInt(GetIP(tag1.text.entity.value),2);var ip_e=parseInt(GetIP(tag2.text.entity.value),2);var len=ip_e-ip_s+1;if(MOD=='mod'){data.splice(MODData.id-1,1);}
if(ip_s>ip_e){checkShow(tag1.text,$.CommonLan['cmp_ip_err']);return false;}
for(var i=0;i<data.length;i++){var ipl_s=parseInt(GetIP(data[i][tag1.name]),2);var ipl_e=parseInt(GetIP(data[i][tag2.name]),2);if((ip_s==ipl_s&&ip_e==ipl_e)||(ip_s>=ipl_s&&ip_s<=ipl_e)||(ip_e>=ipl_s&&ip_e<=ipl_e)){checkShow(tag1.text,$.CommonLan['ip_occupy_err']);return false;}}
return true;}
function check_ips_arr(tag1,tag2){var temp_arr;var ip_sta=parseInt(GetIP(tag1.text.entity.value),2).toString(10);var ip_end=parseInt(GetIP(tag2.text.entity.value),2).toString(10);var len=ip_end-ip_sta+1;if(MOD=='mod'){temp_arr=Remove(ip_arr,ip_sta,len);}else{temp_arr=ip_arr;}
if(ip_sta>ip_end){checkShow(tag2.text,$.CommonLan['cmp_ip_err']);return false;}
for(var i=0;i<temp_arr.length;i++){if(temp_arr[i]==ip_sta){checkShow(tag1.text,$.CommonLan['ip_occupy_err']);return false;}
if(temp_arr[i]==ip_end){checkShow(tag2.text,$.CommonLan['ip_occupy_err']);return false;}}
return true;}
function check_ip_arr(tag1,tag2){var ip_sta=parseInt(GetIP(tag1.text.entity.value),2).toString(10);var ip_end=parseInt(GetIP(tag2.text.entity.value),2).toString(10);var tag_len=ip_end-ip_sta+1;var list=$.DataMap.limit_connect_list;if(MOD=="mod"){for(var j in list){if(list[j].con_limit_start==MODData["con_limit_start"]&&list[j].con_limit_end==MODData["con_limit_end"]){var newList=list.splice(j,1);}}}
var ip_lens=0;for(var i=0;i<list.length;i++){var ip_len=parseInt(GetIP(list[i].con_limit_end),2).toString(10)-parseInt(GetIP(list[i].con_limit_start),2).toString(10)+1;if(list[i].con_limit_start==tag1.text.entity.value&&list[i].con_limit_end==tag2.text.entity.value){checkShow(tag1.text,$.CommonLan['ip_occupy_err']);return false;}
if(ip_sta>ip_end){checkShow(tag2.text,$.CommonLan['cmp_ip_err']);return false;}
ip_lens+=ip_len;}
if((ip_lens+tag_len)>256){checkShow(tag2.text,$.CommonLan['ip_len_err']);return false;}
return true;}
function check_cancel_dhcp(row){for(var i=0;i<ip_arr.length;i++){if(ip_arr[i]=row.data.reserve_ip){alert($.CommonLan["del_reserve_err"]);return false;}}
return true;}
function check_port_len(tag1,tag2){var start1=parseInt(tag1.text_a.entity.value,10);var end1=parseInt(tag1.text_b.entity.value,10);var len1=(end1)?(end1-start1+1):(1);var start2=parseInt(tag2.text_a.entity.value,10);var end2=parseInt(tag2.text_b.entity.value,10);var len2=(end2)?(end2-start2+1):(1);if(len1!=len2){checkShow(tag2.text_a,$.CommonLan['port_len_err']);return false;}
return true;}
function Remove(arr,arg,len,arg2){var arrs=new Array();obj2obj(arrs,arr);for(var i in arrs){if(len&&len!=1){for(var j=0;j<len;j++){if(arrs[i]==arg)
var newArr=arrs.splice(i,1);arg++;}}else if(arrs[i]==arg){var newArr=arrs.splice(i,1);}
if(len=='1'&&arg2){if(arrs[i]==arg2)
var newArr=arrs.splice(i,1);}}
return arrs;}
function get_week_time(tag1,tag2){var obj=new Object();var arr=tag1.week_panel.chk_arr;obj.day='';if(tag1.week_panel.chk_all.entity.checked!=true){var chked=false;for(var i=0;i<arr.length;i++){if(arr[i].entity.checked==true){obj.day+=arr[i].entity.value+' ';chked=true;}}
if(!chked){obj.day='Sun Mon Tue Wed Thu Fri Sat';obj.day_a="all";}}else{obj.day='Sun Mon Tue Wed Thu Fri Sat';obj.day_a="all";}
obj.day=rtrim(obj.day);var t=time_map[tag2.start.entity.selectedIndex]+'-'+time_map[tag2.end.entity.options[tag2.end.entity.selectedIndex].value];obj.time='';if(t=="00:00-00:00"||tag2.time_panel.chk_all.entity.checked==true){obj.time="00:00-23:59";obj.time_a="all";}else{obj.time=t;}
return obj;}
function get_port_arr_value(tag){var s_port=tag.text_a.entity.value;var e_port=tag.text_b.entity.value;var port=(e_port==''||s_port==e_port)?s_port:s_port+"-"+e_port;return port;}
function check_virtual_tab(){var List=$.DataMap.virtual_server_list;var list=new Array();obj2obj(list,List);if(MOD=='mod'){list.splice(MODData.id-1,1);}
var ip=getTag(0,1).data;var proto=getTag(0,2).data;var port1=get_port_arr_value(getTag(0,3));var port2=get_port_arr_value(getTag(0,4));for(var i=0;i<list.length;i++){if(ip==list[i].vir_ip&&proto==list[i].vir_proto&&port1==list[i].app_port&&port2==list[i].forward_port){$.lockWin(" ");$.unlockWin($.CommonLan["add_item_err"]);return false;}}
return true;}
var host_map={'qos_sele':{start:'qos_ip_start',end:'qos_ip_end'},'ip_src_sele':{start:'ip_src_start',end:'ip_src_end'},'ip_des_sele':{start:'ip_des_start',end:'ip_des_end'}};function change_start_to_end(param,ip,mask,sele){switch(param[sele]){case"all":param[host_map[sele].start]="1.0.0.1";param[host_map[sele].end]="223.255.255.254";break;case"host":param[host_map[sele].start]=param[ip];param[host_map[sele].end]=param[ip];break;case"sub_host":var subnet=NtoH(AND(GetIP(param[ip]),GetIP(param[mask])));var bcast=NtoH(XNOR(GetIP(subnet),GetIP(param[mask])));param[host_map[sele].start]=subnet.substr(0,subnet.length-subnet.split('.')[3].length)+(parseInt(subnet.split('.')[3])+1).toString();param[host_map[sele].end]=bcast.substr(0,bcast.length-bcast.split('.')[3].length)+(parseInt(bcast.split('.')[3])-1).toString();break;default:break;}
return param;}
function saveTablelist(data,pan){var row=(!pan.length)?pan:getSubmitData(pan);row=change_start_to_end(row,'ip_src_ip','ip_src_mask','ip_src_sele');row=change_start_to_end(row,'ip_des_ip','ip_des_mask','ip_des_sele');row=change_start_to_end(row,'qos_ip','qos_mask','qos_sele');var obj=new Object();if(MOD=="mod"){ var old_id=MODData.id;for(var i=0;i<data.length;i++){if(data[i].id==old_id){obj['id'+old_id]=old_id;for(var j in row){obj[j+old_id]=row[j];}}else{for(var j in data[i]){obj[j+data[i].id]=data[i][j];}}}}
else{ for(var j in row){obj[j+'1']=row[j];}
obj['id1']=1;for(var i=0;i<data.length;i++){var new_id=parseInt(data[i].id)+1;for(var j in data[i]){obj[j+new_id]=data[i][j];}
obj['id'+new_id]=new_id;}}
return obj;}
function delTablelist(data,id){ var obj=new Object();for(var i=0;i<data.length;i++){var old_id=data[i].id;if(old_id!=id){if(parseInt(old_id)>parseInt(id)){data[i].id=parseInt(old_id)-1;}
for(var j in data[i]){obj[j+data[i].id]=data[i][j];}}}
return obj;}
function check_app_tab(){var List=$.DataMap.app_port_list;var list=new Array();obj2obj(list,List);if(MOD=='mod'){list.splice(MODData.id-1,1);}
var port1=get_port_arr_value(getTag(0,3));var port2=get_port_arr_value(getTag(0,5));for(var i=0;i<list.length;i++){if(port1==list[i].app_port&&port2==list[i].forward_port){$.lockWin(" ");$.unlockWin($.CommonLan["add_item_err"]);return false;}}
return true;}
function week_null_check(tag){var arr=tag.week_panel.chk_arr;if(tag.week_panel.chk_all.entity.checked!=true){var chked=false;for(var i=0;i<arr.length;i++){if(arr[i].entity.checked==true){chked=true;}}
if(!chked){checkShow(tag.week_panel,$.CommonLan['week_null_err']);return false;}}
return true;}
function check_ip_filter_tab(pan){var list=new Array();obj2obj(list,$.AllData.ip_filter_list);if(MOD=='mod'){list.splice(MODData.id-1,1);}
var obj=getSubmitData(pan);obj=change_start_to_end(obj,'ip_src_ip','ip_src_mask','ip_src_sele');obj=change_start_to_end(obj,'ip_des_ip','ip_des_mask','ip_des_sele');var src_s=obj.ip_src_start;var src_e=obj.ip_src_end;var des_s=obj.ip_des_start;var des_e=obj.ip_des_end;var proto=obj.ip_proto;var days=obj.ip_day;var time=obj.ip_time;for(var i=0;i<list.length;i++){if(list[i].ip_src_start==src_s&&list[i].ip_src_end==src_e&&list[i].ip_des_start==des_s&&list[i].ip_des_end==des_e&&list[i].ip_proto==proto&&rtrim(list[i].ip_day)==rtrim(days)&&list[i].ip_time==time){if(proto!='3'&&proto!='4'){if(!check_port_list(getTag(1,'ip_port'),'ip_filter_list',getTag(1,'ip_proto'))){return false;}}else{$.lockWin(" ");$.unlockWin($.CommonLan["add_item_err"]);return false;}}}
return true;}
function check_mac_filter_tab(){var List=$.DataMap.mac_filter_list;var list=new Array();obj2obj(list,List);if(MOD=='mod'){list.splice(MODData.id-1,1);}
var mac_filter=getTag(1,2).text.entity.value.replace(/-/g,':').toLowerCase();var day_time=get_week_time(getTag(1,3),getTag(1,4));var mac_day=day_time.day;var mac_time=day_time.time;var mac_day_a=day_time.day_a;var mac_time_a=day_time.time_a;for(var i=0;i<list.length;i++){if(mac_filter==list[i].mac_filter){var arrd1=mac_day.split(' ');var arrd2=rtrim((list[i].mac_day=='all')?"Sun Mon Tue Wed Thu Fri Sat":list[i].mac_day).split(' ');var len=(arrd1.length-arrd2.length>0)?arrd1.length:arrd2.length;for(var j=0;j<len;j++){if(arrd1.toString().indexOf(arrd2[j])!=-1){var mtl=getTimeArr(list[i].mac_time);var mt=getTimeArr(mac_time);if(mac_time_a=='all'||(mt[0]>=mtl[0]&&mt[0]<mtl[1])||(mt[1]>mtl[0]&&mt[1]<=mtl[1])||(mt[0]==mtl[0]&&mt[1]==mtl[1])||(mt[0]<mtl[0]&&mt[1]>mtl[1])){$.lockWin(" ");$.unlockWin($.CommonLan["add_item_err"]);return false;}}}}}
return true;}
function getTimeArr(data){if(data=='all'||data=='00:00-23:59'){return['0','24'];}
var arrs=new Array();var arr=data.split('-');for(var i=0;i<arr.length;i++){var arrn=arr[i].split(':');var num=(arrn[1]=='00')?parseInt((arrn[0]=='00')?'0':arrn[0],10):(parseInt((arrn[0]=='00')?'0':arrn[0],10)+0.5);arrs.push(num);}
return arrs;}
function check_dns_filter_tab(){var List=$.DataMap.dns_filter_list;var list=new Array();obj2obj(list,List);if(MOD=='mod'){list.splice(MODData.id-1,1);}
var dns_key=getTag(1,'dns_key').text.entity.value;var day_time=get_week_time(getTag(1,'dns_day'),getTag(1,'dns_time'));var dns_day=day_time.day;var dns_time=day_time.time;var dns_day_a=day_time.day_a;var dns_time_a=day_time.time_a;for(var i=0;i<list.length;i++){if(dns_key==list[i].dns_key){var arrd1=dns_day.split(' ');var arrd2=rtrim((list[i].dns_day=='all')?"Sun Mon Tue Wed Thu Fri Sat":list[i].dns_day).split(' ');var len=(arrd1.length-arrd2.length>0)?arrd1.length:arrd2.length;for(var j=0;j<len;j++){if(arrd1.toString().indexOf(arrd2[j])!=-1){var mtl=getTimeArr(list[i].dns_time);var mt=getTimeArr(dns_time);if(dns_time_a=='all'||(mt[0]>=mtl[0]&&mt[0]<mtl[1])||(mt[1]>mtl[0]&&mt[1]<=mtl[1])||(mt[0]==mtl[0]&&mt[1]==mtl[1])||(mt[0]<mtl[0]&&mt[1]>mtl[1])){$.lockWin(" ");$.unlockWin($.CommonLan["add_item_err"]);return false;}}}}}
return true;}
function check_ppp_time(tag,val){var id=tag.name.split('_')[0]+'_time';var con=getTag(3,'conntype').select.entity.value;if((con==val)&&tag.data=='1'){var t_v=ID(id).value;if(!checkSingleText(ID(id),'text_num')){return false;}
if(t_v<1||t_v>30){checkShow(ID(id),$.CommonLan['time_err']);return false;}}
return true;}
function SetCancelBtn(tag,data){var val=(data=='0')?"none":"";tag.btn_b.entity.style.display=val;}
function cancel_modfiy(){$.Refresh();}