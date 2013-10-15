/* This document handles the view switch. */

// Getting the main container (workspace).
var workspace;

// Declaring the vars for all the switch buttons.
var switchToMD;
var switchToBoth;
var switchToHTML;

var switchButtons = new Array(); // The array for the switch 

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

$(window).resize(function() { // On window resizing
	if (previousSize != undefined) {
		if (window.innerWidth < 1366 && switchToBoth.className == "switch-button activated")
			switchToMD.click(); // Markdown is set as default view.
		else if (previousSize < 1366 && window.innerWidth > 1365 && (switchToMD.className == "switch-button activated" || switchToHTML.className == "switch-button activated"))
			switchToBoth.click(); // The normal view with both divs is back.

		previousSize = window.innerWidth; // Setting the size of the window for seeing the difference when a new resizing come.
	}
});

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