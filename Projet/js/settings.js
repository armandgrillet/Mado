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


function getDisplaySize () {
	chrome.storage.local.get("displaySize",  function(mado) {
		if (mado["displaySize"] != undefined) {
			if (mado["displaySize"] == "small")
				smaDisplaySize.checked = true;			
			else {
				if (mado["displaySize"] == "medium")
					medDisplaySize.checked = true;	
				else
					bigDisplaySize.checked = true;
			}		
		}
		else {
			chrome.storage.local.set({ "displaySize" : "medium" });
			medDisplaySize.checked = true;
		}
	});
} 

function setDisplaySize (newValue) {
	chrome.storage.local.set({ "displaySize" : newValue });
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



