/*
<!-- Copyright (c) 2009 SAGEM Communications. All Rights Reserved. -->
<!-- Residential Gateway Software Division www.sagem.com -->
<!-- This file is part of the SAGEM Communications Software and may not be distributed, sold, reproduced or copied in any way without explicit approval of SAGEM Communications. -->
<!-- This copyright notice should not be removed in ANY WAY. -->
*/

function checkMAC(mac) {
    var i;
    var amac = mac.split(":");

	if (amac.length != 6)
		return false;

    for (i=0; i<6; i++) {
		 if (amac[i].length == 0)
		    return false;
		
		if (!isKeyValid(amac[i], /[^0-9a-fA-F]/))
			return false;

		amac[i] = parseInt(amac[i], 16);

		if ((amac[i] < 0) || (amac[i] > 255))
		   return false;
		}
																								  

	return true;
}

function checkMAC1(mac) {

	   if (mac[i].length == 0)
	      return false;
       mac[i] = parseInt(mac[i], 16);
       if ((mac[i] < 0) || (mac[i] > 255))
          return false;

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


function checkMASK(mask0, mask1, mask2, mask3, bool) {
	var bit;
	/*	var i;
		var ival;
		var aip = ip.split(".");

		if (aip.length != 4)
		return false;

		for (i=0; i<4; i++) {
		if (aip[i].length == 0)
		return false;

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
	 */

	if ((mask0 < 0) || (mask0 > 255))
		return false;

	if ((mask1 < 0) || (mask1 > 255))
		return false;

	if ((mask2 < 0) || (mask2 > 255))
		return false;

	if ((mask3 < 0) || (mask3 > 255))
		return false;

	bit = 0x80000000;
	ival = (mask0 << 24) + (mask1 << 16) + (mask2 << 8) + (mask3);

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
	var len;
	var cpt;

	if (code.length != 8)
		return false;

	if (code != parseInt(code, 10))
		return false;

	for (len=0, cpt=0; code[cpt]; cpt++)
		len += ((cpt % 2) ? 1 : 3) * (code[cpt] - '0');

	if (len = (len % 10))
		return false;

	return true;
}


function checkLANIP(ip0, ip1, ip2, ip3) {
	var error1 = false;
	var error2 = false;
	var error3 = false;
	var error4 = false;
	var error5 = false;
	var error6 = false;
	/*	var i;
		var aip = ip.split(".");

		if (aip.length != 4)
		return false;

		for (i=0; i<4; i++) {
		if (aip[i].length == 0)
		return false;

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
	 */

	if(isNaN(ip0) || isNaN(ip1) || isNaN(ip2) || isNaN(ip3)){
		document.getElementById("invalid_choice1").style.display = "";
		return false;
	}

	// les champs d'adresses obligatoire:
	// - 10.0.0.0 et 10.191.255.255; 
	// - 172.16.0.0 et 172.31.255.255; 
	// - 192.168.0.0 et 192.168.42.255;
	// - 192.168.44.0 et 192.168.46.255;
	// - 192.168.48.0 et 192.168.99.255; 
	// Adresses en 192.168.100.XXX interdites car subnet du Cable modem
	// - 192.168.101.0 et 192.168.255.255;
	if ((ip0 == 10) && ((ip1 >= 0 ) && (ip1 <= 191)) && ((ip2 >= 0) && (ip2 <= 255)) && ((ip3 >= 1) && (ip3 <= 254)))
		error1 = true;
	if ((ip0 == 172) && ((ip1 >= 16 ) && (ip1 <= 31)) && ((ip2 >= 0) && (ip2 <= 255)) && ((ip3 >= 1) && (ip3 <= 254)))
		error2 = true;
	if ((ip0 == 192) && (ip1 == 168) && ((ip2 >= 0) && (ip2 <= 42)) && ((ip3 >= 1) && (ip3 <= 254)))
		error3 = true;
	if ((ip0 == 192) && (ip1 == 168) && ((ip2 >= 44) && (ip2 <= 46)) && ((ip3 >= 1) && (ip3 <= 254)))
		error4 = true;
	if ((ip0 == 192) && (ip1 == 168) && ((ip2 >= 48) && (ip2 <= 99)) && ((ip3 >= 1) && (ip3 <= 254)))
		error5 = true;
	if ((ip0 == 192) && (ip1 == 168) && ((ip2 >= 101) && (ip2 <= 255)) && ((ip3 >= 1) && (ip3 <= 254)))
		error6 = true
//	if ((ip0 == 192) && (ip1 == 168) && ((ip2 >= 148) && (ip2 <= 255)) && ((ip3 >= 1) && (ip3 <= 254)))
//		error6 = true;

	if (!((error1 || error2) || (error3 || error4) || (error5 || error6))) {
		document.getElementById("dhcp_rangeip_address").style.display = "";
        document.getElementById("dhcp_rangeipvalue_address").style.display = "";
		return false;
	}

	if((ip3 >= 248) && (ip3 <= 253)){
		document.getElementById("alert3").style.display = "";
        return false;
	}

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


function checkBboxPort(port_start, port_end, plage, is_PortSrc) {
	var error = false;	

	port_start = parseInt(port_start);
	port_end = parseInt(port_end);
	plage = parseInt(plage);
	is_PortSrc = parseInt(is_PortSrc);

	if (plage == 1){
		if(is_PortSrc){
			if((port_start == 32000) || (port_start == 51023)){
				error = true;
				document.getElementById("invalid_choice4").style.display = "";
			}
		}
		if ((port_start < 1) || (port_start > 65535)){
			error = true;
			document.getElementById("invalid_choice5").style.display = "";
		}
		if (error)
			return false;
	}
	else if(plage == 2){
		if(port_start == port_end){
			error = true;
			document.getElementById("invalid_choice6").style.display = "";
		}
		else if(port_start > port_end){
			error = true;
			document.getElementById("invalid_choice7").style.display = "";
		}
		if (error)
			return false;

		if(is_PortSrc){
			if(((port_start <= 32000) && (port_end >= 32000)) || ((port_start <= 51023) && (port_end >= 51023))){
				error = true;
				document.getElementById("invalid_choice4").style.display = "";
			}
		}
		if ((port_start < 0) || (port_end > 65535)){
			error = true;
			document.getElementById("invalid_choice5").style.display = "";
		}
		if (error)
			return false;

	}	

	return true;
}


function checkiplan() {
	var ip1, ip2, ip3, ip4;
	var ret1;
	var ret2;

	ip1 = parseInt(document.formu.iplan1.value);
	ip2 = parseInt(document.formu.iplan2.value);
	ip3 = parseInt(document.formu.iplan3.value);
	ip4 = parseInt(document.formu.iplan4.value);

	ret1 = checkLANIP(ip1, ip2, ip3, ip4);
	ret2 = checkrangeiplan();

	if (!ret1)	
		document.getElementById("dhcp_rangeip_address").style.display = "";
	else
		document.getElementById("dhcp_rangeip_address").style.display = "none";
	if (!ret2)
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

//	iplan0 = document.formu.iplan1.value;
//	iplan1 = document.formu.iplan2.value;
//	iplan2 = document.formu.iplan3.value;
//	iplan3 = document.formu.iplan4.value;
	iplan0 = parseInt(document.formu.iplan1.value);
	iplan1 = parseInt(document.formu.iplan2.value);
	iplan2 = parseInt(document.formu.iplan3.value);    
	iplan3 = parseInt(document.formu.iplan4.value);
	
	
	start0 = parseInt(document.formu.startip1.value);
	start1 = parseInt(document.formu.startip2.value);
	start2 = parseInt(document.formu.startip3.value);
	start3 = parseInt(document.formu.startip4.value);
	
	
	end0 = parseInt(document.formu.endip1.value);
	end1 = parseInt(document.formu.endip2.value);
	end2 = parseInt(document.formu.endip3.value);
	end3 = parseInt(document.formu.endip4.value);

	
//	if (!checkLANIP(iplan0, iplan1, iplan2, iplan3))
//		return false;

	if (!checkLANIP(start0, start1, start2, start3))
		return true;

	if (!checkLANIP(end0, end1, end2, end3))
		return true;

	// Split IP
//	aip = iplan.split(".");
//	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
//	iplan0 = aip[0]; iplan1 = aip[1]; iplan2 = aip[2]; iplan3 = aip[3];
//
//	aip = startip.split(".");
//	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
//	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];
//
//	aip = endip.split(".");
//	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
//	end0 = aip[0]; end1 = aip[1]; end2 = aip[2]; end3 = aip[3];


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
	var mask0, mask1, mask2, mask3;

	mask0 = document.formu.mask0.value;
    mask1 = document.formu.mask1.value;
    mask2 = document.formu.mask2.value;
    mask3 = document.formu.mask3.value;

	ret = checkMASK(mask0, mask1, mask2, mask3, false);

	/*if (!ret)
		document.getElementById("dhcp_mask_address").style.display = "";
	else
		document.getElementById("dhcp_mask_address").style.display = "none";
*/
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

	ip0 = document.formu.iplan0.value;
	ip1 = document.formu.iplan1.value;
	ip2 = document.formu.iplan2.value;
	ip3 = document.formu.iplan3.value;

	mask0 = document.formu.mask0.value;
    mask1 = document.formu.mask1.value;
    mask2 = document.formu.mask2.value;
    mask3 = document.formu.mask3.value;
	
	start0 = document.formu.startip0.value;
	start1 = document.formu.startip1.value;
	start2 = document.formu.startip2.value;
	start3 = document.formu.startip3.value;

	ret = checkLANIP(startip0, startip1, startip2, startip3);
/*
	if (!ret)
		document.getElementById("dhcp_startip_address").style.display = "";
	else
		document.getElementById("dhcp_startip_address").style.display = "none";
*/
	if (!ret)
		return true;

	// Split IP
/*	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = startip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];
*/
	// Check IP start in function of Mask
	val0 = (ip0 ^ start0) & mask0;
	val1 = (ip1 ^ start1) & mask1;
	val2 = (ip2 ^ start2) & mask2;
	val3 = (ip3 ^ start3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
		//document.getElementById("dhcp_startip_address").style.display = "";
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

      ip0 = document.formu.iplan0.value;
      ip1 = document.formu.iplan1.value;
      ip2 = document.formu.iplan2.value;
      ip3 = document.formu.iplan3.value;

      mask0 = document.formu.mask0.value;
      mask1 = document.formu.mask1.value;
      mask2 = document.formu.mask2.value;
      mask3 = document.formu.mask3.value;

      end0 = document.formu.endip0.value;
      end1 = document.formu.endip1.value;
      end2 = document.formu.endip2.value;
      end3 = document.formu.endip3.value;

	ret = checkLANIP(endip);

/*	if (!ret)
		document.getElementById("dhcp_endip_address").style.display = "";
	else
		document.getElementById("dhcp_endip_address").style.display = "none";
*/
	if (!ret)
		return true;

	// Split IP
/*	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = endip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	end0 = aip[0]; end1 = aip[1]; end2 = aip[2]; end3 = aip[3];
*/
	// Check IP end in function of Mask
	val0 = (ip0 ^ end0) & mask0;
	val1 = (ip1 ^ end1) & mask1;
	val2 = (ip2 ^ end2) & mask2;
	val3 = (ip3 ^ end3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
//		document.getElementById("dhcp_endip_address").style.display = "";
		return true;
	}

	return false;
}

function checkrangeip() {
	var ip0, ip1, ip2, ip3;
	var start0, start1, start2, start3;
	var end0, end1, end2, end3;
	var error = false;
	var error1 = false;
	
	ip0 = parseInt(document.formu.iplan1.value);
	ip1 = parseInt(document.formu.iplan2.value);
	ip2 = parseInt(document.formu.iplan3.value);
	ip3 = parseInt(document.formu.iplan4.value);

	start0 = parseInt(document.formu.startip1.value);
	start1 = parseInt(document.formu.startip2.value);
	start2 = parseInt(document.formu.startip3.value);
	start3 = parseInt(document.formu.startip4.value);

	end0 = parseInt(document.formu.endip1.value);
	end1 = parseInt(document.formu.endip2.value);
	end2 = parseInt(document.formu.endip3.value);
	end3 = parseInt(document.formu.endip4.value);

	if (!checkLANIP(start0, start1, start2, start3)){
		document.getElementById("etoile2").style.display = "";
		error = true;
	}

	if (!checkLANIP(end0, end1, end2, end3)){
		document.getElementById("etoile3").style.display = "";
		error1 = true;
	}

	if (error || error1)
		return false;

	// Split IP
	/*aip = startip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	start0 = aip[0]; start1 = aip[1]; start2 = aip[2]; start3 = aip[3];

	aip = endip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	end0 = aip[0]; end1 = aip[1]; end2 = aip[2]; end3 = aip[3];
*/

	// Check IP start < IP end
	if ((start0 < end0) || (start1 < end1) || (start2 < end2) || (start3 <= end3)) {
		document.getElementById("dhcp_cmp_address").style.display = "none";
	}
	else {
		document.getElementById("dhcp_cmp_address").style.display = "";
		error = true;
	}

    if ((start0 != end0) || (start1 != end1) || (start2 != end2) || (start3 != end3)) {
        document.getElementById("dhcp_same_address").style.display = "none";
    }
    else {
        document.getElementById("dhcp_same_address").style.display = "";
        error = true;
    }
    
    // Check IP LAN < IP start and Check IP LAN > IP stop
    if (((start0 < ip0) || (start1 < ip1) || (start2 < ip2) || (start3 <= ip3)) && ((end0 > ip0) || (end1 > ip1) || (end2 > ip2) || (end3 >= ip3))){
        error1 = true;
		document.getElementById("dhcp_rangeip_address").style.display = "";
	}

    if (error || error1) {
        document.getElementById("etoile2").style.display = "";
        document.getElementById("etoile3").style.display = "";
        return false;
    }

	return true;
}

function checkipstatic(stat0, stat1, stat2, stat3) {
	var ret;
	var error = false;
	var ip0, ip1, ip2, ip3;
	var mask0, mask1, mask2, mask3;
	var val0, val1, val2, val3;

	ip0 = parseInt(document.formu.iplan1.value);
	ip1 = parseInt(document.formu.iplan2.value);
	ip2 = parseInt(document.formu.iplan3.value);
	ip3 = parseInt(document.formu.iplan4.value);

	mask0 = parseInt(document.formu.mask1.value);
	mask1 = parseInt(document.formu.mask2.value);
	mask2 = parseInt(document.formu.mask3.value);
	mask3 = parseInt(document.formu.mask4.value);

	// Check IP end in function of Mask
	val0 = (ip0 ^ stat0) & mask0;
	val1 = (ip1 ^ stat1) & mask1;
	val2 = (ip2 ^ stat2) & mask2;
	val3 = (ip3 ^ stat3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0)
		error = true;

	if (error){
		document.getElementById("dhcp_rangeip_address").style.display = "";
		return true;
	}

	return false;
}

function checkipstaticmodify(stat0, stat1, stat2, stat3) {
	var ret;
	var error = false;
//	var aip;
//	var ip, mask;
	var ip0, ip1, ip2, ip3;
	var mask0, mask1, mask2, mask3;
//	var stat0, stat1, stat2, stat3;
	var val0, val1, val2, val3;

	ip0 = parseInt(document.formu.iplan1.value);
	ip1 = parseInt(document.formu.iplan2.value);
	ip2 = parseInt(document.formu.iplan3.value);
	ip3 = parseInt(document.formu.iplan4.value);

	mask0 = parseInt(document.formu.mask1.value);
	mask1 = parseInt(document.formu.mask2.value);
	mask2 = parseInt(document.formu.mask3.value);
	mask3 = parseInt(document.formu.mask4.value);

	ret = checkLANIP(stat0, stat1, stat2, stat3);

	if (!ret)
		return true;


	// Split IP
/*	aip = ip.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	ip0 = aip[0]; ip1 = aip[1]; ip2 = aip[2]; ip3 = aip[3];

	aip = mask.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	mask0 = aip[0]; mask1 = aip[1]; mask2 = aip[2]; mask3 = aip[3];

	aip = ipstatic.split(".");
	for (i=0; i<4; i++, aip[i] = parseInt(aip[i]));
	stat0 = aip[0]; stat1 = aip[1]; stat2 = aip[2]; stat3 = aip[3];*/

	// Check IP end in function of Mask
	val0 = (ip0 ^ stat0) & mask0;
	val1 = (ip1 ^ stat1) & mask1;
	val2 = (ip2 ^ stat2) & mask2;
	val3 = (ip3 ^ stat3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0)
		error = true;

	if (error){
		document.getElementById("dhcp_ipstatic_address").style.display = "";
		return true;
	}

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
	var ip1, ip2, ip3, ip4;
	var ip1, ip2, ip3, ip4;

	ip1 = document.formu.iplan1.value;
	dftip1 = document.formu.iplan1.defaultValue;
	ip2 = document.formu.iplan2.value;
	dftip2 = document.formu.iplan2.defaultValue;
	ip3 = document.formu.iplan3.value;
	dftip3 = document.formu.iplan3.defaultValue;
	ip4 = document.formu.iplan4.value;
	dftip4 = document.formu.iplan4.defaultValue;

	if ((ip1 != dftip1) || (ip2 != dftip2) || (ip3 != dftip3) || (ip4 != dftip4))
		return true;

	return false;
}

function changemask() {
      var ip1, ip2, ip3, ip4;
      var ip1, ip2, ip3, ip4;

      ip1 = document.formu.mask1.value;
      dftip1 = document.formu.mask1.defaultValue;
      ip2 = document.formu.mask2.value;
      dftip2 = document.formu.mask2.defaultValue;
      ip3 = document.formu.mask3.value;
      dftip3 = document.formu.mask3.defaultValue;
      ip4 = document.formu.mask4.value;
      dftip4 = document.formu.mask4.defaultValue;

      if ((ip1 != dftip1) || (ip2 != dftip2) || (ip3 != dftip3) || (ip4 != dftip4))
          return true;

	return false;
}

function changestartip() { 
	var ip1, ip2, ip3, ip4;
	var ip1, ip2, ip3, ip4;

	ip1 = document.formu.startip1.value;
	dftip1 = document.formu.startip1.defaultValue;
	ip2 = document.formu.startip2.value;
	dftip2 = document.formu.startip2.defaultValue;
	ip3 = document.formu.startip3.value;
	dftip3 = document.formu.startip3.defaultValue;
	ip4 = document.formu.startip4.value;
	dftip4 = document.formu.startip4.defaultValue;

	if ((ip1 != dftip1) || (ip2 != dftip2) || (ip3 != dftip3) || (ip4 != dftip4))
		return true;

	return false;
}

function changeendip() {
	var ip1, ip2, ip3, ip4;
	var ip1, ip2, ip3, ip4;

	ip1 = document.formu.endip1.value;
	dftip1 = document.formu.endip1.defaultValue;
	ip2 = document.formu.endip2.value;
	dftip2 = document.formu.endip2.defaultValue;
	ip3 = document.formu.endip3.value;
	dftip3 = document.formu.endip3.defaultValue;
	ip4 = document.formu.endip4.value;
	dftip4 = document.formu.endip4.defaultValue;

	if ((ip1 != dftip1) || (ip2 != dftip2) || (ip3 != dftip3) || (ip4 != dftip4))
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


function checkBail() {
	var bail = document.formu.bail.value;

	if (parseInt(bail) == 0){
		document.getElementById("alert1").style.display = "";
		return false;
	}
	if (parseInt(bail) >= 30000){
		document.getElementById("alert2").style.display = "";
		return false;
	}
	if (!isKeyValid(bail, /[^0-9]/)) {
		document.getElementById("alert4").style.display = "";
		return false;
	}
	return true;
}


function isKeyValid(str, match) {

	var t;

	t = str.search(match);

	if (t > -1)
		return 0;

	return 1;

}

function isPasswordValid(str) {

	var t;

	t = str.search(/[^0-9a-zA-Z\.\;\,\:\!\?\-\_\(\)\[\]\{\}\/\@\#\&\"\'\|\ \\]/);

	if (t > -1)
		return 0;

	return 1;

}

function wait(millis){
	var start = new Date().getTime();
	var cur = start;

	while((cur - start) < millis){
		cur = new Date().getTime();
	}
}

