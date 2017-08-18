function initSsoDropdown() {
var head = jxl.get("sso_dropdown");
var list = jxl.get("sso_dropdown_list");
function getPosition(elem) {
elem = elem || {};
var left = elem.offsetLeft || 0;
var top = elem.offsetTop || 0;
while(elem.offsetParent) {
elem = elem.offsetParent;
left += elem.offsetLeft || 0;
top += elem.offsetTop || 0;
}
return {left: left, top: top};
}
function positionList() {
var pos = getPosition(head);
var listTopOffset = 21;
if (typeof gMediumScreen == "boolean" && gMediumScreen) listTopOffset = -30;
jxl.setStyle(list, "left", pos.left + "px");
jxl.setStyle(list, "top", (pos.top + listTopOffset) + "px");
}
function onHeadClick(evt) {
if (jxl.hasClass(head, "showlist")) {
jxl.removeClass(head, "showlist");
jxl.addClass(head, "hidelist");
jxl.hide(list);
}
else {
jxl.removeClass(head, "hidelist");
jxl.addClass(head, "showlist");
jxl.show(list);
positionList();
}
}
function isOutside(elem) {
while (elem && elem != head && elem != list) {
elem = elem.parentNode;
}
return !elem;
}
function onOutside(evt) {
if (jxl.hasClass(head, "showlist")) {
if (isOutside(jxl.evtTarget(evt))) {
jxl.removeClass(head, "showlist");
jxl.addClass(head, "hidelist");
jxl.hide(list);
}
}
}
jxl.addEventHandler(head, "click", onHeadClick);
jxl.addEventHandler(document, "click", onOutside);
jxl.addEventHandler(document, "keydown", onOutside);
}
ready.onReady(initSsoDropdown);
