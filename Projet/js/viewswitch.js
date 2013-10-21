/* This document handles the view switch. */

// Getting the main container (workspace).
var workspace;

// Declaring the vars for all the switch buttons.
var switchToMD;
var switchToBoth;
var switchToHTML;

var switchButtons = new Array(); // The array for the switch 

var windowResizing;

var centerLine;
var previousSize; // The previous size of the window.

function initActivation () { // Initalize the switch's look on Mado's launch.
	if (window.innerWidth > 1365) // Big window
		switchToBoth.className = "switch-button activated";
	else {
		switchToMD.className = "switch-button activated";
		workspace.className = "markdown-view";
	}

	previousSize = window.innerWidth; // Setting the size of the window, forbid the resize() function to be launched before the complete loading.
}

/* This function handles the behavior of a switch button when it is clicked.
At the end, the function sets the main container"s class name according to the button. */
function activate (clickedBtn, classState) {
	for (var i = 0; i < switchButtons.length; i++) {
		if (switchButtons[i].id != clickedBtn) // Deactivating the switch buttons that are not clicked.
			switchButtons[i].className = "switch-button";
		else // Activating the clicked button.
			switchButtons[i].className = "switch-button activated";
	}	

	workspace.className = classState; // Setting the workspace's class name according to the clicked button.
}

function switchShortcuts (direction) {
	if (window.innerWidth > 1365) { // Normal window
		for (var i = 0; i < switchButtons.length; i++) {
			if (switchButtons[i].className == "switch-button activated") { // We found what button is activated.
				if (direction == "left" && i > 0) 
					switchButtons[i - 1].click(); // The previous button is now activated.
				else if (direction == "right" && i < switchButtons.length -1)
					switchButtons[i + 1].click(); // The next button is now activated.
				i = switchButtons.length; // End of the loop.
			}
		}
	}
	else { // Small window, only Markdown and HTML views are available.
		if (direction == "left")
			switchToMD.click();
		else
			switchToHTML.click();
	}	
}

function setWindowResizing () {
	chrome.storage.local.get("resize",  function(mado) {
		if (mado["resize"] != undefined)			
			windowResizing = mado["resize"];
		else {
			chrome.storage.local.set({ "resize" : true });
			windowResizing = true;
		}
	});
}

chrome.app.window.current().onBoundsChanged.addListener(function () {
	if (window.innerWidth < 1366 && switchToBoth.className == "switch-button activated")
		switchToMD.click(); // Markdown is set as default view.
	else 
		chrome.storage.local.get("lastWidth", function (mado) {
			if (window.innerWidth >= 1366 && mado["lastWidth"] < 1366) 
				if (windowResizing)
					switchToBoth.click();
		});
	chrome.storage.local.set({"lastX" : window.screenX, "lastY" : window.screenY, "lastWidth" : window.innerWidth, "lastHeight" : window.innerHeight });
});