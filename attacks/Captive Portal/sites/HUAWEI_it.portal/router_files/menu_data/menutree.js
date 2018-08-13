var MAX_MENU_COUNT = 20;
var SHOW_MENU_LEVEL = 2;
function MenuItem(MenuText, link, visiable)
{
this.text = MenuText;
this.children = new Array();
this.link = link;
this.nChildCount = 0;
this.id = "";
this.MENU_IMAGE = "ok.gif";
this.level = -1;
this.right = '';
this.target = '';
this.tree = null;
this.parent = null; 
this.visibility = true;
if (visiable != null)
this.visibility = visiable;
this.addChild = function ()
{
var child;
for(var i = 0;i < arguments.length; i++)
{
child = arguments[i];
child.id = this.id + "_" + this.nChildCount;
child.level = this.level + 1;   
child.parent = this;
this.children[this.nChildCount++] = child;
}
}
}
function clickMenuImage(imgID)
{
var menuID = imgID.substr(imgID.indexOf('_') + 1);
g_firstmenu = menuID;
g_secmenu = g_firstmenu + '_0';
top.g_secondmenu = g_secmenu;
g_thirdmenu = g_secmenu + '_0';
top.g_thirdmenu = g_thirdmenu;
refreshMenu(g_firstmenu,g_secmenu,g_thirdmenu);
expandMenuById(menuID);
}
function refreshMenu(firmenu,secmenu,thirdmenu)
{
var cookie = "FirstMenu=" + firmenu + "; path=/";
document.cookie = cookie;
var cookie = "SecondMenu=" + secmenu + "; path=/";
document.cookie = cookie;
var cookie = "ThirdMenu=" + thirdmenu + "; path=/";
document.cookie = cookie;
}
function expandMenuByLevel(menuItem, level, flag)
{
if (flag == 0)
{
style = 'none';
}
else
{
style = '';
}
for (var i = 0; i < menuItem.nChildCount; i++)
{
child = menuItem.children[i];
if (child.level > level)
{
menuItemTab = document.getElementById(child.id);
menuItemTab.style.display = style; 
}
if (child.level <= SHOW_MENU_LEVEL - 1 && child.nChildCount > 0)
expandMenuByLevel(child, level,flag);
}
}
function collapseAllMenu()
{
expandMenuByLevel(top.g_oMenuTree.root,1,0);
}
function mouseOverLink(link)
{
}
function mouseOutLink()
{
}
function selectMenuLvl_1(menuID)
{
var menuItem = g_oMenuTree.getMenuById(menuID);
}
function selectMenuLvl_2(menuID)
{
}
function writeFile(str)
{
var fso, ctf;
try
{
}
catch (e)
{
}
}
function MenuTree(TreeName, level)
{
this.VERSIONS = 1.0;
this.name = TreeName;
this.html = "";
this.indent=20;
this.root = new MenuItem(this.name);
this.root.id = this.name;
this.root.level = 0;
this.level = level;
this.curMenuItem = null;
this.previousMenuItem = null;
this.init = function ()
{
initMenuTree(this.root);
}
this.getMenuById = function (id)
{
try
{
return eval(id);
}
catch (e)
{
return null;
}
}
this.searchMenuByName = function (menuItem, name)
{
var temp = null;
for (var i = 0; i < menuItem.nChildCount; i++)
{
var child = menuItem.children[i];
if (name == child.text)
{
return child;
}
temp = this.searchMenuByName(child,name);
if (temp != null)
{
return temp;
}
}
return null;
}
this.getMenuByName = function (name)
{
return this.searchMenuByName(this.root,name);
}
this.makeHTML = function ()
{
this.html += '<table cellspacing=0 cellpadding=0 style="border-width:2;" height="100%" width="100%">' + '<tr><td>';
this.html +=   '<table cellspacing=0 cellpadding=0 width="162">';
this.makeMenuHTML(this.root);
this.html += '</table>';
this.html += '</td></tr>' + '<tr><td height="100%">&nbsp;</td></tr>'
+ '</table>';
return  this.html;
}
this.makeMenuHTML = function (menuRoot)
{
var startHTML = '';
var endHTML = '</td></tr>';
var menuItemHTML = '';
var indentHTML = '';
var contentHTML = '';
var menuTDClass = '';
var classEndfix = '';
var child;
for (var i = 0; i < menuRoot.nChildCount; i++)
{
child = menuRoot.children[i];
startHTML = '<tr id="' + child.id  + '" class="trMenuItem">' + '<td>';
if (child.visibility == false)
{
startHTML = '<tr id="' + child.id + '" style="display:none;"'
+ '>' + '<td>';
}
else
{
startHTML = '<tr id="' + child.id  + '" class="trMenuItem">'
+ '<td>';
}
if (child.level == 1)
{
classPrefix = 'Lvl_1';
menuItemHTML = '<table background="/images/firstmenu.gif" cellspacing=0 cellpadding=0 width="100%" height="45">'+  '<tr>';
}
else if (child.level == 2)
{
classPrefix = 'Lvl_2';
menuItemHTML = '<table cellspacing=0 cellpadding=0 width="100%">'
+  '<tr>';
}
for (var j = 0; j < child.level; j++)
{
indentHTML += '<td width=' + this.indent + '>&nbsp;</td>';
}
if (child.level == 1)
{
contentHTML = '<td width="45" nowrap class="MenuTD_' + classPrefix + '">'
if (child.id == 'Admin_0' || child.id == 'User_0')
{
contentHTML += '<img border=0 src="/images/info.gif" class="Menu_IMG" id="img_'
+ child.id + '" onclick="clickMenuImage(this.id);"></img> '
}
if (child.id == 'Admin_1'|| child.id == 'User_1')
{
contentHTML += '<img border=0 src="/images/basic.gif" class="Menu_IMG" id="img_'
+ child.id + '" onclick="clickMenuImage(this.id);"></img> '
}
if (child.id == 'Admin_2' || child.id == 'User_2')
{
contentHTML += '<img border=0 src="/images/advance.gif" class="Menu_IMG" id="img_'
+ child.id + '" onclick="clickMenuImage(this.id);"></img> '
}
if (child.id == 'Admin_3'|| child.id == 'User_3')
{
contentHTML += '<img border=0 src="/images/maintain.gif" class="Menu_IMG" id="img_'
+ child.id + '" onclick="clickMenuImage(this.id);"></img> '
}
contentHTML +='</td>'+ '<td width="100%" align="left" nowrap class="MenuTD_' + classPrefix + '">'
contentHTML += '<a  hidefocus="hidefocus" href="' + '#' + '"class="MenuLink_' + classPrefix + '" id="link_'
+ child.id +'" onmouseover="mouseOverLink(this.id);" onmouseout="mouseOutLink1(this.id);" onclick="clickMenuLink(this.id);">' +  child.text + '</a>'
+ '</td>';
}
else if (child.level == 2)
{
contentHTML = '<td nowrap class="MenuTD_' + classPrefix + '">'
contentHTML += '&nbsp;';
contentHTML += '<a  hidefocus="hidefocus" href="' + '#' + '"class="MenuLink_' + classPrefix + '" id="link_'
+ child.id +'" onmouseover="mouseOverLink(this.id);" onmouseout="mouseOutLink(this.id);" onclick="clickMenuLink(this.id);">'                        +  child.text + '</a>'
+ '</td>';
}
menuItemHTML += indentHTML + contentHTML;
menuItemHTML += '</tr></table>';
this.html += startHTML + menuItemHTML + endHTML;
indentHTML = '';
contentHTML = '';
if (child.level <= SHOW_MENU_LEVEL - 1 && child.nChildCount > 0)
this.makeMenuHTML(child);
}
}
}
function initMenuTree(parentMenu)
{
var menuItem = null;
for (var index = 0; index < MAX_MENU_COUNT; index++)
{
try
{
menuID = parentMenu.id + '_' + index;
menuItem = eval(menuID);
parentMenu.addChild(menuItem); 
}
catch (e)
{
return;
}
initMenuTree(menuItem);
}
}
