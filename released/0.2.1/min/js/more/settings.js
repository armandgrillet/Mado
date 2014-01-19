/* The javascript to set and get Mado's settings. */

/* 
* Variables. 
*/

var markdownSyntax, gfmSyntax;
var smaDisplaySize, medDisplaySize, bigDisplaySize;
var viewOnResize;
var analytics;
var head; // The "head" section of the option window.
var stylesheetLink = document.createElement("link"); // Create a "link" node.
var windowClose; // The close button.

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

function getResizing () {
	chrome.storage.local.get("resize",  function(mado) {
		if (mado["resize"] != false) {
			viewOnResize.checked = true;
		}
	});
}

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

function setResizing () {
	if (viewOnResize.checked)
		chrome.storage.local.set({ "resize" : true });
	else 
		chrome.storage.local.set({ "resize" : false });
}

function setSyntax () {
	if (markdownSyntax.checked)
		chrome.storage.local.set({ "gfm" : false });
	else 
		chrome.storage.local.set({ "gfm" : true });
}

/* All the things to do when settings.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
	/*
    * Shortcuts.
    */
    head = document.getElementsByTagName("head")[0]; // The "head" section of the option window.
    windowClose = document.getElementById("window-close"); // Get the close button

	markdownSyntax = document.getElementById("markdown-radio");
	gfmSyntax = document.getElementById("gfm-radio");

	smaDisplaySize = document.getElementById("small-display-radio");
	medDisplaySize = document.getElementById("medium-display-radio");
	bigDisplaySize = document.getElementById("big-display-radio");

	bigInputContainer = document.getElementById("big-display-input-container");
	bigLabelContainer = document.getElementById("big-display-label-container");
	viewOnResize = document.getElementById("global-view-checkbox");

	analytics = document.getElementById("analytics-checkbox");

	/* Functions. */
	if (screen.width < 1366) { // Don't show "Big" if the screen is too small
		bigInputContainer.style.display = "none";
		bigLabelContainer.style.display = "none";
	}

	/*
    * Functions.
    */
    stylesheetLink.setAttribute("rel", "stylesheet");
	stylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac close button styles.
		stylesheetLink.setAttribute("href", "../css/more/close-button-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
	}
	else { // If the user is on another type of computer, redirect to the generic close button styles.
		stylesheetLink.setAttribute("href", "../css/more/close-button-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
	}

	head.appendChild(stylesheetLink); // Append the link node to the "head" section.

	// getDisplaySize();
	getSyntax();
	getResizing();
	getAnalytics();

	$(markdownSyntax).on("click", setSyntax);
	$(gfmSyntax).on("click", setSyntax);

	/*
	$(smaDisplaySize).on("click", function() { setDisplaySize("small"); });
	$(medDisplaySize).on("click", function() { setDisplaySize("medium"); });
	$(bigDisplaySize).on("click", function() { setDisplaySize("big"); });
	*/
	
	$(viewOnResize).on("click", setResizing);

	$(analytics).on("click", setAnalytics);

	$(windowClose).on("click", function() {
        chrome.app.window.current().close();
    });
}
