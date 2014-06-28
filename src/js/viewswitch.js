/* This document handles the view switch on the topbar. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var madoFooter; // Mado's footer.
var switchCursor; // Mado's switch cursor.
var switchToBoth; // Both switch.
var switchToHTML; // HTML switch.
var switchToMD; // Markdown switch.
var workspace; // Getting the main container (workspace).

/* Functions variables. */
var previousSize; // The previous size of the window.
var switchButtons = []; // The array for the switch.

/*
* Functions (in alphabetical order).
*
* Resume:
	* activate (buttonClicked, stateOfTheClass): handles the behavior of a switch button when it is clicked. The function sets the main container's class name according to the button.
	* initActivation (): initalize the switch's look on Mado's launch.
	* switchShortcuts (theDirection): change the switch when the user uses a keyboard shortcut.
*/

function activate (clickedBtn, classState) {
	for (var i = 0; i < switchButtons.length; i++) {
		if (switchButtons[i].id != clickedBtn) { // Deactivating the switch buttons that are not clicked.
			switchButtons[i].className = "switch-button";
		} else { // Activating the clicked button.
			switchButtons[i].className = "switch-button activated";
		}
	}	

	workspace.className = classState; // Setting the workspace's class name according to the clicked button.
	switchCursor.className = classState; // Setting the cursor's class name according to the clicked button.

	if (classState == "markdown-view") {
		madoFooter.className = classState;
	} else {
		madoFooter.removeAttribute("class");
	}
}

function initActivation () { 
	if (chrome.app.window.current().getBounds().width > 1159) { // Big window
		switchToBoth.className = "switch-button activated";
	} else {
		switchToMD.className = "switch-button activated";
		workspace.className = "markdown-view";
	}

	previousSize = chrome.app.window.current().getBounds().width; // Setting the size of the window, forbid the resize() function to be launched before the complete loading.
}

function switchShortcuts (direction) {
	if (window.innerWidth > 1159) { // Normal window
		for (var i = 0; i < switchButtons.length; i++) {
			if (switchButtons[i].className == "switch-button activated") { // We found what button is activated.
				if (direction == "left" && i > 0) {
					switchButtons[i - 1].click(); // The previous button is now activated.
				} else if (direction == "right" && i < switchButtons.length -1) {
					switchButtons[i + 1].click(); // The next button is now activated.
				}
				i = switchButtons.length; // End of the loop.
			}
		}
	}
	else { // Small window, only Markdown and HTML views are available.
		if (direction == "left") {
			switchToMD.click();
		} else {
			switchToHTML.click();
		}
	}	
}