function updateStatus(response){var wifis=response.getElementsByTagName('wifi');if(wifis.length>0)
{var wlan=wifis[0];var wlan_status_val=getResponseAttrElement(wlan,'link','val');var wlan_status_text=getResponseAttrElement(wlan,'link','text');if(wlan_status_val=="on")$('#wlan_status').attr('class','enabled');else if(wlan_status_val=="off")$('#wlan_status').attr('class','disabled');$('#wlan_status').text(wlan_status_text);}}
$(document).ready(function(){setInterval("sendRequest('/wifi', updateStatus)",1100);});
