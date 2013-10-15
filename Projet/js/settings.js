/* The javascript to set and get Mado's settings. */

var markdownSyntax;
var gfmSyntax;

var viewOnResize;

var smaDisplaySize;
var medDisplaySize;
var bigDisplaySize;

var analytics;


function getSyntax () {
	chrome.storage.local.get("gfm",  function(mado) {
		if (mado["gfm"] != undefined) {
			if (mado["gfm"])
				gfmSyntax.checked = true;			
			else
				markdownSyntax.checked = true;	
		}
		else {
			chrome.storage.local.set({ "gfm" : false });
			markdownSyntax.checked = true;
		}
	});
}

function setSyntax (newValue) {
	chrome.storage.local.set({ "gfm" : newValue });
}

function getResizing () {
	chrome.storage.local.get("resize",  function(mado) {
		if (mado["resize"] != false) {
			viewOnResize.checked = true;
		}
	});
}

function setResizing () {
	if (viewOnResize.checked)
		chrome.storage.local.set({ "resize" : true });
	else 
		chrome.storage.local.set({ "resize" : false });
}


