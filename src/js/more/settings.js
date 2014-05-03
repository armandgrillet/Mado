/* The javascript to set and get Mado's settings. */

/* 
* Variables. 
*/

var markdownSyntax, gfmSyntax;
var smaDisplaySize, medDisplaySize, bigDisplaySize;
var viewOnResize;
var analytics;

/*
* Functions (in alphabetical order).
*
* Resume:
	* getAnalytics (): get the storage variable "analytics".
	* getDisplaySize (): get the storage variable "displaySize".
	* getResizing (): get the storage variable "resize".
	* getSyntax (): get the storage variable "gfm".
	* setAnalytics (): set the storage variable "analytics".
	* setDisplaySize (newDisplaySize): set the storage variable "displaySize".
	* setResizing (): set the storage variable "resize".
	* setSyntax (): set the storage variable "analytics".
*/

function getAnalytics () {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != false) {
			analytics.checked = true;
		}
	});
}

/*
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
*/

/*function getHighlighting () {
	chrome.storage.local.get("highlighting",  function(mado) {
		if (mado["highlighting"] != false) {
			highlightingCheck.checked = true;
		}
	});
}*/

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

function setAnalytics () {
	if (analytics.checked)
		chrome.storage.local.set({ "analytics" : true });
	else 
		chrome.storage.local.set({ "analytics" : false });
}

/*
function setDisplaySize (newValue) {
	chrome.storage.local.set({ "displaySize" : newValue });
}
*/

/*function setHighlighting () {
	if (highlightingCheck.checked)
		chrome.storage.local.set({ "highlighting" : true });
	else 
		chrome.storage.local.set({ "highlighting" : false });
}*/

function setSyntax () {
	if (markdownSyntax.checked)
		chrome.storage.local.set({ "gfm" : false });
	else 
		chrome.storage.local.set({ "gfm" : true });
}