var jxl = jxl || (function() {
"use strict"
var lib = {};
var doc = window.document;
var head = null;
lib.get = function(idOrElement) {
if (typeof idOrElement == 'string' && idOrElement) {
return doc.getElementById(idOrElement);
}
return idOrElement;
};
lib.walkDom = function(idOrElement, tag, func) {
var elem = lib.get(idOrElement);
var result = [];
if (elem) {
tag = tag || "*";
var noFunc = typeof func != 'function';
var args = [""];
if (!noFunc) {
for (var i = 3, len = arguments.length; i < len; i++) {
args.push(arguments[i]);
}
}
var nodes = elem.getElementsByTagName(tag);
for (var i = 0, len = nodes.length; i < len; i++) {
args[0] = nodes[i];
if (noFunc || func.apply(null, args)) {
result.push(nodes[i]);
}
}
}
return result;
};
var reTrim = /^\s+|\s+$/g;
var reWhitespace = /\s+/g;
function normalizeClassName(str) {
str = str.replace(reTrim, "");
str = str.replace(reWhitespace, " ");
return str;
}
var classNameCache = {};
function classNameRegExp(strClass) {
if (!classNameCache[strClass]) {
classNameCache[strClass] = new RegExp('(?:^|\\s+)' + strClass + '(?:\\s+|$)');
}
return classNameCache[strClass];
}
lib.hasClass = function(idOrElement, strClass) {
var elem = lib.get(idOrElement);
if (!elem) {
return false;
}
var re = classNameRegExp(strClass);
return re.test(elem.className);
};
lib.addClass = function(idOrElement, strClasses) {
var elem = lib.get(idOrElement);
if (elem) {
var theClasses = normalizeClassName(strClasses).split(" ");
var re;
var oldClassName = normalizeClassName(elem.className);
var newClassNames;
if (!oldClassName) {
newClassNames = theClasses;
}
else {
newClassNames = [oldClassName];
for (var i = 0, len = theClasses.length; i < len; i++) {
re = classNameRegExp(theClasses[i]);
if (!re.test(oldClassName)) {
newClassNames.push(theClasses[i]);
}
}
}
elem.className = newClassNames.join(' ');
}
};
lib.removeClass = function(idOrElement, strClasses) {
var elem = lib.get(idOrElement);
if (elem) {
var theClasses = normalizeClassName(strClasses).split(" ");
var re;
var newClassName = elem.className;
for (var i = 0, len = theClasses.length; i < len; i++) {
re = classNameRegExp(theClasses[i]);
if (re.test(newClassName)) {
newClassName = newClassName.replace(theClasses[i], '');
}
}
elem.className = normalizeClassName(newClassName);
}
};
lib.removeClassRegExp = function(idOrElement, strClasses) {
var elem = lib.get(idOrElement);
if (elem) {
var newClassName = elem.className;
var re = classNameRegExp(strClasses);
if (re.test(newClassName)) {
newClassName = newClassName.replace(new RegExp(strClasses, 'ig'), '');
}
elem.className = normalizeClassName(newClassName);
}
};
lib.clearClass = function(idOrElement) {
lib.overwriteClass(idOrElement);
};
lib.overwriteClass = function(idOrElement, strClasses) {
var elem = lib.get(idOrElement);
if (elem) {
elem.className = strClasses || "";
}
};
lib.replaceClass = function(idOrElement, strOldClasses, strNewClasses) {
var elem = lib.get(idOrElement);
if (elem) {
lib.removeClass(elem, strOldClasses);
lib.addClass(elem, strNewClasses);
}
};
lib.getByClass = function(strClass, parentIdOrElement, tag) {
return lib.walkDom(
parentIdOrElement || doc,
tag || "",
function(el){return lib.hasClass(el, strClass);}
);
};
var camelCaseCache = {};
function cssStrToCamelCase(str) {
var strArr = str.split("-");
if (strArr.length < 2) {
return str;
}
if (camelCaseCache[str]) {
return camelCaseCache[str];
}
var result = strArr[0];
for (var i = 1, len = strArr.length; i < len; i++) {
result += strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
}
camelCaseCache[str] = result;
return result;
}
var reAlpha = /alpha\(opacity=[^\)]+\)/i;
function setFilterOpacity(elem, val) {
if (elem.currentStyle && !elem.currentStyle.hasLayout) {
elem.style.zoom = 1;
}
val = Math.round(val * 100);
var s = elem.style.filter;
var s2 = 'alpha(opacity=' + val + ')';
if (reAlpha.test(s)) {
elem.style.filter = s.replace(reAlpha, s2);
}
else {
elem.style.filter += ' ' + s2;
}
}
function setStyleOpacity(elem, val) {
elem.style.opacity = val;
}
function setOpacity(elem, val) {
if (typeof elem.style.opacity == 'string') {
setOpacity = setStyleOpacity;
elem.style.opacity = val;
}
else if (typeof elem.style.filter == 'string') {
setOpacity = setFilterOpacity;
setFilterOpacity(elem, val);
}
else {
setOpacity = function() {};
}
}
var strFloat;
function setStyleFloat(elem, val) {
if (!strFloat) {
strFloat = typeof elem.style.cssFloat == 'string' ? 'cssFloat' : 'styleFloat';
}
elem.style[strFloat] = val;
}
lib.setStyle = function(idOrElement, cssName, cssValue) {
var elem = lib.get(idOrElement);
if (elem) {
switch (cssName) {
case 'opacity':
setOpacity(elem, cssValue);
break;
case 'float':
setStyleFloat(elem, cssValue);
break;
default:
elem.style[cssStrToCamelCase(cssName)] = cssValue;
break;
}
}
};
lib.display = function(idOrElement, show) {
lib.setStyle(idOrElement, "display", show ? "" : "none");
};
lib.hide = function(idOrElement) {
lib.display(idOrElement, false);
};
lib.show = function(idOrElement) {
lib.display(idOrElement, true);
};
lib.loadCss = function(cssPath) {
if (null==head) head = document.getElementsByTagName("head");
if (head && head[0] && "string" == typeof cssPath)
{
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = cssPath;
head[0].appendChild(link);
}
};
lib.createStyleTag = function(styles) {
if (null==head) head = document.getElementsByTagName("head");
if (head && head[0] && "string" == typeof styles)
{
var styleTag = document.createElement("style");
styleTag.type = "text/css";
styleTag.innerHTML = styles;
head[0].appendChild(styleTag);
}
};
lib.addEventHandler = function(idOrElement,eventName,handlerFunction) {
var elem = lib.get(idOrElement);
if (elem) {
if (elem.addEventListener) {
elem.addEventListener(eventName, handlerFunction, false);
return true;
}
else if (elem.attachEvent) {
elem.attachEvent("on" + eventName, handlerFunction);
return true;
}
return false;
}
return false;
};
lib.removeEventHandler = function(idOrElement,eventName,handlerFunction) {
var elem = lib.get(idOrElement);
if (elem) {
if (elem.removeEventListener) {
elem.removeEventListener(eventName, handlerFunction, false);
}
else if (elem.detachEvent) {
elem.detachEvent("on" + eventName, handlerFunction);
}
}
};
lib.evtTarget = function(evt, expectedType) {
evt = evt || window.event;
var result = evt.target || evt.srcElement;
if (expectedType) {
while (result && result.type != expectedType) {
result = result.parentNode;
}
}
else {
if (result && result.nodeType == 3) {
result = result.parentNode;
}
}
return result;
};
lib.stopBubbling = function(evt) {
evt = evt || window.event;
if (evt) {
if (evt.stopPropagation) {
evt.stopPropagation();
}
evt.cancelBubble = true;
}
};
lib.cancelEvent = function(evt) {
evt = evt || window.event;
if (evt) {
if (evt.preventDefault) {
evt.preventDefault();
}
evt.cancel = true;
evt.returnValue = false;
}
return false;
};
lib.setDisabled = function(idOrElement, disable)
{
var elem = lib.get(idOrElement);
if (elem) {
elem.disabled = disable;
var p = elem.parentNode;
if (p) p = p.parentNode;
p = p || doc;
if (p) {
var labels = p.getElementsByTagName('label');
for (var i=0, len = labels.length; i < len; i++) {
if (labels[i].htmlFor == elem.id) {
if (disable) {
lib.addClass(labels[i], "disabled");
}
else {
lib.removeClass(labels[i], "disabled");
}
break;
}
}
}
}
};
lib.disableNode = function(idOrNode, disableNode, fogOnly)
{
var setNodeOpacity = disableNode ? lib.addClass : lib.removeClass;
setNodeOpacity(idOrNode, "disableNode");
if (fogOnly) return;
lib.walkDom(idOrNode,"*", disableNodeSpecials, disableNode);
disableNodeSpecials(lib.get(idOrNode), disableNode);
};
function disableNodeSpecials(node, disableNode)
{
if (node)
{
switch((node.nodeName || "").toLowerCase())
{
case "a":
node.onclick = disableNode ? function(){return false;} : null;
break;
case "button":
case "input":
case "select":
node.disabled = disableNode;
break;
default:
break;
}
}
};
lib.enableNode = function(idOrNode, disableNode, fogOnly) {
lib.disableNode(idOrNode, !disableNode, fogOnly);
};
lib.disable = function(idOrElement) {
lib.setDisabled(idOrElement, true);
};
lib.enable = function(idOrElement) {
lib.setDisabled(idOrElement, false);
};
lib.getEnabled = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem) {
return !elem.disabled;
}
return false;
};
lib.enableWithFocus = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem) {
lib.enable(elem);
lib.focus(elem);
}
};
lib.addOption = function(idOrElement, value, text) {
var elem = lib.get(idOrElement);
if (elem && elem.options) {
elem.options[elem.length || 0] = new Option(text, value);
}
};
lib.getOptionTextOf = function(idOrElement, idx) {
var elem = lib.get(idOrElement);
if (elem && elem.options) {
return elem.options[idx].text;
}
return null;
}
lib.lenSelection = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem && elem.options) {
return elem.length;
}
return 0;
};
function findOptionIdx(elem, value) {
var i = elem.options.length || 0;
while (i--) {
if (elem.options[i].value == value) {
return i;
}
}
return -1;
}
lib.updateOptions = function(idOrElement, value, text) {
var elem = lib.get(idOrElement);
if (elem && elem.options) {
var idx = findOptionIdx(elem, value);
if (idx < 0) {
idx = elem.options.length || 0;
elem.options[idx] = new Option(text, value);
}
else {
elem.options[idx].text = text;
}
}
};
lib.deleteOption = function(idOrElement, value) {
var elem = lib.get(idOrElement);
if (elem && elem.options) {
var idx = findOptionIdx(elem, value);
if (idx >= 0) {
elem.options[idx] = null;
if (value == elem.value) {
elem.selectedIndex = 0;
}
}
}
};
lib.clearSelection = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem) {
var disabled = elem.disabled;
elem.disabled = false;
elem.length = 0;
elem.disabled = disabled;
}
};
lib.setSelection = function(idOrElement, text) {
var elem = lib.get(idOrElement);
if (elem == null) {
return;
}
var disabled = elem.disabled;
elem.disabled = false;
var i=0;
var n = -1;
for (i=0; i<elem.length; i++) {
if (elem.options[i].value == text) {
n = i;
break;
}
}
if (n != -1) {
for (i=0; i<elem.length; i++) {
elem.options[i].selected = (n == i);
}
}
elem.disabled = disabled;
};
lib.submitForm = function(name) {
var frm = doc.forms[name];
if (frm) {
frm.submit();
}
};
lib.getFormElements = function(elementName, formNameOrIdx) {
var result = [];
if (elementName) {
var f = doc.forms[formNameOrIdx || 0];
if (f && f.elements) {
var elems = f.elements[elementName];
if (elems) {
result = [elems];
if (typeof elems.length == 'number') {
if (!elems.options || elems[0] != elems.options[0]) {
result = elems;
}
}
}
}
}
return result;
};
lib.getForm = function(idOrElement) {
var elem = jxl.get(idOrElement);
if (elem) {
if (elem.form) {
return jxl.get(elem.form);
}
return lib.findParentByTagName(elem, "form");
}
return null;
};
lib.getByName = function(name, parentIdOrElement) {
var elem = doc;
if (parentIdOrElement) {
elem = lib.get(parentIdOrElement);
}
if (elem && typeof name == 'string') {
return elem.getElementsByName(name);
}
return null;
};
lib.getHtml = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem) {
return elem.innerHTML;
}
return "";
};
lib.setHtml = function(idOrElement, txt) {
var elem = lib.get(idOrElement);
if (elem) {
elem.innerHTML = txt;
}
};
lib.changeImage = function(imageName, newSource, newTitle) {
var image = document.images[imageName] || lib.get(imageName);
if (image) {
if (typeof newSource != 'undefined') {
image.src = newSource;
}
if (typeof newTitle != 'undefined') {
image.title = newTitle;
}
}
};
lib.setText = function(idOrElement, txt) {
var elem = lib.get(idOrElement);
if (elem) {
if (elem.hasChildNodes()) {
elem.innerHTML = "";
}
elem.appendChild(document.createTextNode(txt));
}
};
lib.getText = function(idOrElement)
{
var elem = lib.get(idOrElement);
if (elem) {
return elem.innerHTML
//console.log("1");
//if (elem) {
// console.log("2");
// return elem.wholeText;
//}
}
return "";
}
lib.focus = function(idOrElement, value) {
var elem = lib.get(idOrElement);
if (elem && typeof elem.focus != 'undefined') {
elem.focus();
}
};
lib.select = function(idOrElement, value) {
var elem = lib.get(idOrElement);
if (elem && typeof elem.select != 'undefined') {
elem.select();
}
};
lib.getChecked = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem) {
return elem.checked;
}
return false;
};
lib.setChecked = function(idOrElement, value) {
var elem = lib.get(idOrElement);
if (elem) {
elem.checked = (value !== false);
}
};
lib.getValue = function(idOrElement) {
var elem = lib.get(idOrElement);
if (elem) {
return elem.value;
}
return "";
};
lib.getSelectValue = lib.getValue;
lib.setValue = function(idOrElement, value) {
var elem = lib.get(idOrElement);
if (elem) {
elem.value = value;
}
};
lib.getRadioValue = function(radioName, formNameOrIdx) {
var radios = lib.getFormElements(radioName, formNameOrIdx);
var i = radios.length || 0;
while (i--) {
if (radios[i].checked) {
return radios[i].value;
}
}
return "";
};
lib.getCssText = function(elem) {
if (!elem || !elem.style) {
return "";
}
if (typeof elem.style.cssText == 'string') {
return elem.style.cssText;
}
else {
return elem.getAttribute('style');
}
}
lib.setCssText = function(elem, cssText) {
if (!elem || !elem.style) {
return;
}
if (typeof elem.style.cssText == 'string') {
elem.style.cssText = cssText;
}
else {
elem.setAttribute('style', cssText);
}
}
function changeInputTypeIE(el, newType) {
var el2 = doc.createElement('input');
el2.type = newType;
el2.name = el.name;
el2.value = el.value;
el2.id = el.id;
el2.className = el.className;
var cssText = lib.getCssText(el);
lib.setCssText(el2, cssText);
el.parentNode.replaceChild(el2, el);
}
var changeInputType = (function() {
try {
var tst = doc.createElement('input');
tst.type = "password";
tst.type = "hidden";
}
catch (err) {
return changeInputTypeIE;
}
return function(el, newType) {
el.type = newType;
};
})();
lib.changeInputType = function(idOrElement, newType) {
var elem = lib.get(idOrElement);
if (elem && typeof newType == 'string') {
changeInputType(elem, newType);
}
};
lib.moveElement = function(idOrElement, hookIdOrElement) {
var elem = lib.get(idOrElement);
var hook = lib.get(hookIdOrElement);
if (elem && hook && hook.parentNode) {
hook.parentNode.insertBefore(elem, hook);
}
};
lib.findParentByTagName = function(idOrElement, tagName) {
tagName = (tagName || "").toLowerCase();
var elem = lib.get(idOrElement);
while (elem && elem.parentNode) {
elem = elem.parentNode;
if ((elem.tagName || "").toLowerCase() == tagName) {
return elem;
}
}
return null;
};
lib.sprintf = function(formatstr) {
var i,exp;
for (i=1; i<arguments.length; ++i)
{
exp = new RegExp("(%"+i+")(%[a-zA-Z]+%)?","g");
formatstr = formatstr.replace(exp, "$1");
exp = new RegExp("%"+i,"g");
formatstr = formatstr.replace(exp, arguments[i]);
}
return formatstr;
};
lib.toArray = function(arrayLike) {
var array = [];
var i = arrayLike.length;
while (i--) {
array[i] = arrayLike[i];
}
return array;
};
lib.getArrayPart = function(luaTable, doDelete) {
luaTable = luaTable || {};
var array = [];
var n = 1;
while (typeof luaTable[n] != 'undefined') {
array.push(luaTable[n]);
if (doDelete) {
delete luaTable[n];
}
n++;
}
return array;
};
var entityMap = {
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': '&quot;'
};
lib.htmlEscape = function(str) {
return String(str).replace(/[&<>"]/g, function (s) {
return entityMap[s];
});
return str;
};
lib.htmlUnEscape = function(str) {
for (var i in entityMap) {
str = String(str).replace(new RegExp(entityMap[i], "g"), i);
}
str = String(str).replace(new RegExp("&apos;", "g"), "'");
return str;
};
lib.getParams = function(obj) {
var params = ""
for (var i in obj) {
if (params != "")
params += "&";
params += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
}
return params;
};
return lib;
})();
var avmLog = function(){};
