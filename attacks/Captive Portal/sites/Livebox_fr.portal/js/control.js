function checkMAC(mac) {
	var i;
	var amac = mac.split(":");

	if (amac.length != 6)
		return false;

	for (i=0; i<6; i++) {
		if (amac[i].length == 0)
			return false;

		amac[i] = parseInt(amac[i], 16);

		if ((amac[i] < 0) || (amac[i] > 255))
			return false;
	}

	return true;
}


function checkIP(ip) {
	var i;
	var aip = ip.split(".");

	if (aip.length != 4)
		return false;

	for (i=0; i<4; i++) {
		if (aip[i].length == 0)
			return false;

		if(aip[i] != parseInt(aip[i]))
	 		return false;
		else
			 aip[i] = parseInt(aip[i]);
	}
	
	if ((aip[0] < 0) || (aip[0] > 255))
 		return false;
 
	if ((aip[1] < 0) || (aip[1] > 255))
 		return false;
 
	if ((aip[2] < 0) || (aip[2] > 255))
 		return false;
 
	if ((aip[3] < 0) || (aip[3] > 255))
 		return false;
 
	return true;
}


function checkMASK(ip, bool) {
	var i;
	var bit;
	var ival;
	var aip = ip.split(".");

	if (aip.length != 4)
		return false;

	for (i=0; i<4; i++) {
		if (aip[i].length == 0)
			return false;

		if(aip[i] != parseInt(aip[i]))
			return false;
 		else
 			aip[i] = parseInt(aip[i]);
	}

	if ((aip[0] < 0) || (aip[0] > 255))
 		return false;
 
	if ((aip[1] < 0) || (aip[1] > 255))
 		return false;
 
	if ((aip[2] < 0) || (aip[2] > 255))
 		return false;
 
	if ((aip[3] < 0) || (aip[3] > 255))
 		return false;
	
	bit = 0x80000000;
	ival = (aip[0] << 24) + (aip[1] << 16) + (aip[2] << 8) + (aip[3]);

	for (; ival & bit; bit = ((bit >> 1) & 0x7FFFFFFF));

	if (!bool && (bit == 0x80000000))
		return false;

	for (; bit && !(ival & bit); bit = ((bit >> 1) & 0x7FFFFFFF));

	if (bit > 0)
		return false;

	return true;
}


function checkHSDPAPinCode(code) {
	if (code.length != 4)
		return false;

	if (code != parseInt(code, 10))
		return false;

	return true;
}


function checkWPSPinCode(code) {
	var len = 0 ;
	var cpt;

	if (code.length != 8)
		return false;

	if (code != parseInt(code, 10))
		return false;

	if (code == "00000000")
          return false;

	for (cpt=0; cpt<8 ; cpt++) 
		len += ((cpt % 2) ? 1 : 3) * (parseInt(code.charAt(cpt), 10));

	if (len = (len % 10))
		return false;

	return true;
}


function checkLANIP(ip) {
	var i;
	var aip = ip.split(".");

	if (aip.length != 4)
		return false;

	for (i=0; i<4; i++) {
		if (aip[i].length == 0)
			return false;

		if(aip[i] != parseInt(aip[i]))
			return false;
 		else
 			aip[i] = parseInt(aip[i]);
	}

	if ((aip[0] < 1) || (aip[0] > 254))
 		return false;
 
	if ((aip[1] < 0) || (aip[1] > 255))
 		return false;
 
	if ((aip[2] < 0) || (aip[2] > 255))
 		return false;
 
	if ((aip[3] < 1) || (aip[3] > 254))
 		return false;


	return true;
}


function checkPort(port) {
	if (port != parseInt(port, 10))
		return false;

	port = parseInt(port);

	if ((port < 0) || (port > 65535))
		return false;

	return true;
}


function checkRangePort(port) {
	var aport = port.split("-");

	if ((aport.length != 1) && (aport.length != 2))
		return false;

	if (!checkPort(aport[0]))
		return false;

	if (aport.length == 2) {
		if (!checkPort(aport[1]))
			return false;

		if (parseInt(aport[0]) > parseInt(aport[1]))
			return false;
	}

	return true;
}


function checkiplan() {
	var ip;
	var ret1;
	var ret2;

	ip = document.formu.iplan.value;

	ret1 = checkLANIP(ip);
	ret2 = checkrangeiplan();

	if (!ret1 || !ret2)
		document.getElementById("dhcp_ip_address").style.display = "";
	else
		document.getElementById("dhcp_ip_address").style.display = "none";


	if (!ret1 || !ret2)
		return true;

	return false;
}

function checksipserverip() {
	var ip;
	var ret;

	ip = document.formu.sip_address.value;

	ret = checkIP(ip);

	if (!ret)
		document.getElementById("sip_ip_address").style.display = "";
	else
		document.getElementById("sip_ip_address").style.display = "none";

	if (!ret)
		return true;
	
	return false;
}


function checkregisterserver() {
	var ip;
	var ret;

	ip = document.formu.register_server_address.value;
	
	ret = checkIP(ip);

	if (!ret)
		document.getElementById("sip_register_ip_address").style.display = "";
	else
		document.getElementById("sip_register_ip_address").style.display = "none";

	if (!ret)
		return true;
	
	return false;
}

function checkrangeiplan() {
	var aip;
	var iplan;
	var startip, endip;
	var iplan0, iplan1, iplan2, iplan3;
	var start0, start1, start2, start3;
	var end0, end1, end2, end3;

	var error1 = false;
	var error2 = false;

	iplan = document.formu.iplan.value;
	startip = document.formu.startip.value;
	endip = document.formu.endip.value;
	
	if (!checkLANIP(iplan))
		return false;

	if (!checkLANIP(startip))
		return true;

	if (!checkLANIP(endip))
		return true;

	// Split IP
	aip = iplan.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	iplan0 = aip[0]; iplan1 = aip[1]; iplan2 = aip[2]; iplan3 = aip[3];

	aip = startip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];

	aip = endip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	end0 = aip[0]; end1 = aip[1]; end2 = aip[2]; end3 = aip[3];


	// Check IP LAN < IP start
	if ((start0 > iplan0) || (start1 > iplan1) || (start2 > iplan2) || (start3 > iplan3)) {
		error1 = false;
	}
	else {
		error1 = true;
	}

	// Check IP LAN > IP stop
	if ((end0 < iplan0) || (end1 < iplan1) || (end2 < iplan2) || (end3 < iplan3)) {
		error2 = false;
	}
	else {
		error2 = true;
	}

	if (error1 && error2) {
		return false;
	}

	return true;
}


function checkmask() {
	ip = document.formu.mask.value;

	ret = checkMASK(ip, false);

	if (!ret)
		document.getElementById("dhcp_mask_address").style.display = "";
	else
		document.getElementById("dhcp_mask_address").style.display = "none";

	if (!ret)
		return true;

	return false;
}

function checkstartip() {
	var ret;
	var aip;
	var ip, mask, startip;
	var ip0, ip1, ip2, ip3;
	var mask0, mask1, mask2, mask3;
	var start0, start1, start2, start3;
	var val0, val1, val2, val3;

	ip = document.formu.iplan.value;
	mask = document.formu.mask.value;
	startip = document.formu.startip.value;

	ret = checkLANIP(startip);

	if (!ret)
		document.getElementById("dhcp_startip_address").style.display = "";
	else
		document.getElementById("dhcp_startip_address").style.display = "none";

	if (!ret)
		return true;

	// Split IP
	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = startip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];

	// Check IP start in function of Mask
	val0 = (ip0 ^ start0) & mask0;
	val1 = (ip1 ^ start1) & mask1;
	val2 = (ip2 ^ start2) & mask2;
	val3 = (ip3 ^ start3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
		document.getElementById("dhcp_startip_address").style.display = "";
		return true;
	}

	return false;
}

function checkendip() {
	var ret;
	var aip;
	var ip, mask, endip;
	var ip0, ip1, ip2, ip3;
	var mask0, mask1, mask2, mask3;
	var end0, end1, end2, end3;
	var val0, val1, val2, val3;

	ip = document.formu.iplan.value;
	mask = document.formu.mask.value;
	endip = document.formu.endip.value;

	ret = checkLANIP(endip);

	if (!ret)
		document.getElementById("dhcp_endip_address").style.display = "";
	else
		document.getElementById("dhcp_endip_address").style.display = "none";

	if (!ret)
		return true;

	// Split IP
	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = endip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	end0 = aip[0]; end1 = aip[1]; end2 = aip[2]; end3 = aip[3];

	// Check IP end in function of Mask
	val0 = (ip0 ^ end0) & mask0;
	val1 = (ip1 ^ end1) & mask1;
	val2 = (ip2 ^ end2) & mask2;
	val3 = (ip3 ^ end3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
		document.getElementById("dhcp_endip_address").style.display = "";
		return true;
	}

	return false;
}

function checkrangeip() {
	var aip;
	var startip, endip;
	var start0, start1, start2, start3;
	var end0, end1, end2, end3;

	startip = document.formu.startip.value;
	endip = document.formu.endip.value;

	if (!checkLANIP(startip))
		return true;

	if (!checkLANIP(endip))
		return true;

	// Split IP
	aip = startip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];

	aip = endip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	end0 = aip[0]; end1 = aip[1]; end2 = aip[2]; end3 = aip[3];


	// Check IP start < IP end
	if ((start0 < end0) || (start1 < end1) || (start2 < end2) || (start3 < end3)) {
		document.getElementById("dhcp_cmp_address").style.display = "none";
	}
	else {
		document.getElementById("dhcp_cmp_address").style.display = "";
		return true;
	}

	return false;
}

function checkipstatic(ipstatic) {
	var ret;
	var aip;
	var ip, mask;
	var ip0, ip1, ip2, ip3;
	var mask0, mask1, mask2, mask3;
	var stat0, stat1, stat2, stat3;
	var val0, val1, val2, val3;

	ip = document.formu.iplan.value;
	mask = document.formu.mask.value;

	ret = checkLANIP(ipstatic);

	if (!ret)
		return true;

	if (ipstatic == ip)
		return true;

	// Split IP
	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = ipstatic.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	stat0 = aip[0]; stat1 = aip[1]; stat2 = aip[2]; stat3 = aip[3];

	// Check IP end in function of Mask
	val0 = (ip0 ^ stat0) & mask0;
	val1 = (ip1 ^ stat1) & mask1;
	val2 = (ip2 ^ stat2) & mask2;
	val3 = (ip3 ^ stat3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0)
		return true;

	return false;
}

function checkvpnstartip() {
	var ret;
	var aip;
	var ip, mask, vpnstartip;
	var ip0, ip1, ip2, ip3;
	var mask0, mask1, mask2, mask3;
	var start0, start1, start2, start3;
	var val0, val1, val2, val3;

	if (!document.formu.vpnstartip)
		return false;

	ip = document.formu.iplan.value;
	mask = document.formu.mask.value;
	vpnstartip = document.formu.vpnstartip.value;

	ret = checkLANIP(vpnstartip);

	document.getElementById("vpn_dhcp_slot_address").style.display = "none";

	if (!ret)
		document.getElementById("vpn_dhcp_ip_address").style.display = "";
	else
		document.getElementById("vpn_dhcp_ip_address").style.display = "none";

	if (!ret)
		return true;

	// Split IP
	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = vpnstartip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];

	// Check IP start in function of Mask
	val0 = (ip0 ^ start0) & mask0;
	val1 = (ip1 ^ start1) & mask1;
	val2 = (ip2 ^ start2) & mask2;
	val3 = (ip3 ^ start3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
		document.getElementById("vpn_dhcp_slot_address").style.display = "none";
		return false;
	}

	document.getElementById("vpn_dhcp_slot_address").style.display = "";

	return true;
}


function changeiplan() {
	ip = document.formu.iplan.value;
	dftip = document.formu.iplan.defaultValue;

	if (ip != dftip)
		return true;

	return false;
}

function changemask() {
	ip = document.formu.mask.value;
	dftip = document.formu.mask.defaultValue;

	if (ip != dftip)
		return true;

	return false;
}

function changestartip() {
	ip = document.formu.startip.value;
	dftip = document.formu.startip.defaultValue;

	if (ip != dftip)
		return true;

	return false;
}

function changeendip() {
	ip = document.formu.endip.value;
	dftip = document.formu.endip.defaultValue;

	if (ip != dftip)
		return true;

	return false;
}

function changevpnstartip() {
	if (!document.formu.vpnstartip)
		return false;

	ip = document.formu.vpnstartip.value;
	dftip = document.formu.vpnstartip.defaultValue;

	if (ip != dftip)
		return true;

	return false;
}

function checkrangesip() {
	var sipip;

	sipip = document.formu.sip_address.value;
		
	if (!checkLANIP(sipip))
		return false;

	return true;
}


function checkrangeregister() {
	var sipip_register;

	sipip_register = document.formu.register_server_address.value;
		
	if (!checkLANIP(sipip_register))
		return false;

	return true;
}

