var sizeOfTimeBar;
var timerOfTimeBar;
var actionOfTimeBar;

function createIncreaseTimeBar(speed, elapsed, action) {
	actionOfTimeBar = action;

	sizeOfTimeBar = ((410-12) * elapsed) / speed;
	sizeOfTimeBar = parseInt(sizeOfTimeBar);

	speed = speed * 2.5;

	resizeTimeBar(sizeOfTimeBar);

	timerOfTimeBar = setInterval('resizeIncreaseTimeBar()', speed);
}

function resizeIncreaseTimeBar() {
	var newsize;

	newsize = sizeOfTimeBar + 1;

	resizeTimeBar(newsize);

	sizeOfTimeBar = newsize;
}


function createDecreaseTimeBar(speed, remaining, action) {
	actionOfTimeBar = action;

	sizeOfTimeBar = ((410-12) * remaining) / speed;
	sizeOfTimeBar = parseInt(sizeOfTimeBar);

	speed = speed * 2.5;

	resizeTimeBar(sizeOfTimeBar);

	timerOfTimeBar = setInterval('resizeDecreaseTimeBar()', speed);
}

function resizeDecreaseTimeBar() {
	var newsize;

	newsize = sizeOfTimeBar - 1;

	resizeTimeBar(newsize);

	sizeOfTimeBar = newsize;
}

function resizeTimeBar(newsize) {
	var objtable;
	var objcell;
	var objimg;

	newsize = parseInt(newsize);

	if ((newsize < 0) || (newsize > (410-12))) {
		clearInterval(timerOfTimeBar);
		eval(actionOfTimeBar);
		return;
	}
	
	objtable = document.getElementById('tableprogressbar');
	objcell = document.getElementById('cellprogressbar');
	objimg = document.getElementById('imgprogressbar');

	if (navigator.appVersion.match(/MSIE/)) {
		objtable.style.setAttribute('width', parseInt(12 + newsize));
		objcell.style.setAttribute('width', parseInt(newsize));
		objimg.style.setAttribute('width', parseInt(newsize));
	}
	else {
		objtable.style.width = parseInt(12 + newsize);
		objcell.style.width = (newsize)+'px';
		objimg.style.width = (newsize)+'px';
	}
}


var sizeOfProgressBar;
var timerOfProgressBar;
var actionOfProgressBar;

function createIncreaseProgressBar(percent, action, speed, refresh) {
	actionOfProgressBar = action;

	sizeOfProgressBar = ((410-12) * percent) / 100;
	sizeOfProgressBar = parseInt(sizeOfProgressBar);

	speed = speed * 1000;

	resizeProgressBar(sizeOfProgressBar);

	timerOfProgressBar = setInterval(refresh, speed);
}

function resizeIncreaseProgressBar(percent) {
	var newsize;

	newsize = ((410-12) * percent) / 100;

	resizeProgressBar(newsize);

	sizeOfProgressBar = newsize;

	if (percent == 100) {
		clearInterval(timerOfProgressBar);
		eval(actionOfProgressBar);
	}
}


function createDecreaseProgressBar(percent, action, speed, refresh) {
	actionOfProgressBar = action;

	sizeOfProgressBar = ((410-12) * (100 - percent)) / 100;
	sizeOfProgressBar = parseInt(sizeOfProgressBar);

	speed = speed * 1000;

	resizeProgressBar(sizeOfProgressBar);

	timerOfProgressBar = setInterval(refresh, speed);
}

function resizeDecreaseProgressBar(percent) {
	var newsize;

	newsize = ((410-12) * (100 - percent)) / 100;

	resizeProgressBar(newsize);

	sizeOfProgressBar = newsize;

	if (percent == 0) {
		clearInterval(timerOfProgressBar);
		eval(actionOfProgressBar);
	}
}

function resizeProgressBar(newsize) {
	var objtable;
	var objcell;
	var objimg;

	newsize = parseInt(newsize);

	objtable = document.getElementById('tableprogressbar');
	objcell = document.getElementById('cellprogressbar');
	objimg = document.getElementById('imgprogressbar');

	if (navigator.appVersion.match(/MSIE/)) {
		objtable.style.setAttribute('width', parseInt(12 + newsize));
		objcell.style.setAttribute('width', parseInt(newsize));
		objimg.style.setAttribute('width', parseInt(newsize));
	}
	else {
		objtable.style.width = parseInt(12 + newsize);
		objcell.style.width = (newsize)+'px';
		objimg.style.width = (newsize)+'px';
	}
}

function stopProgressBar() {
	clearInterval(timerOfProgressBar);
}

