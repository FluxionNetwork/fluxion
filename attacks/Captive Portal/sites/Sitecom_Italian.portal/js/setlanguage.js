function setlanguage(){
var vervaldatum = new Date()
vervaldatum.setDate(vervaldatum.getDate()+365);
var setlang = document.form.site.options[document.form.site.selectedIndex].value;
//document.cookie="language="+setlang+";expires="+vervaldatum+"; path=/";
//window.location.href = location.href;
document.cookie="language="+setlang+"; expires="+vervaldatum.toGMTString()+"; path=/";	//Felix fix for safari
parent.window.location.href = "/cgi-bin/index.asp";
}

