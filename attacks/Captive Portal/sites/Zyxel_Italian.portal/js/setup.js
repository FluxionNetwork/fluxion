function onResizeWindow()
{
    adjustMyFrameHeight();
}

function adjustMyFrameHeight()
{
  var frame = getElement("myFrame");
  var frameDoc = getIFrameDocument("myFrame");
    var item = getElement("table");
    if (window.innerHeight<400)
        window.innerHeight=400;
    if (document.documentElement.clientWidth>250)
        item.style.width=""+document.documentElement.clientWidth-250+"px";
    item = getElement("menuline_height");
    item.style.height=""+document.documentElement.clientHeight-64+"px";
  if (frameDoc.body.scrollHeight > document.documentElement.clientHeight-200)
      frame.height = document.documentElement.clientHeight-200;
  else
  frame.height = frameDoc.body.scrollHeight;
    item = getElement("message_position");
    item.style.top=""+document.documentElement.clientHeight-93+"px";
    item = getElement("message_len");
    item.style.width=""+document.documentElement.clientWidth-290+"px";
    item = getElement("message_show");
    item.className  = "on" ;
  frameDoc.body.style.backgroundColor="#FFFFFF"; 
}

function getElement(aID)
{
  return (document.getElementById) ? document.getElementById(aID) : document.all[aID];
}

function getIFrameDocument(aID){ 
    var rv = null; 
    var frame=getElement(aID);
  // if contentDocument exists, W3C compliant (e.g. Mozilla) 
    if (frame.contentDocument)
              rv = frame.contentDocument;
    else // bad IE  ;)
              rv = document.frames[aID].document;
    return rv;
  }