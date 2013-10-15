/* This document handles the view switch. */

// Getting the main container (workspace).
var workspace;

// Declaring the vars for all the switch buttons.
var switchToMD;
var switchToBoth;
var switchToHTML;

// The array for the switch 
var switchButtons = new Array();

function initActivation() {

	if (window.innerWidth > 1365)
		switchToBoth.className = 'switch-button activated';
	else {
		switchToMD.className = 'switch-button activated';
		workspace.className = 'markdown-view';
	}
}

/* This function handles the behavior of a switch button when it is clicked.
At the end, the function sets the main container's class name according to the button. */
function activate(clickedBtn, classState) {

	for (var i = 0; i < switchButtons.length; i++) {

		// Deactivating the switch buttons that are not clicked.
		if (switchButtons[i].id != clickedBtn)
			switchButtons[i].className = 'switch-button';
		// Activating the clicked button.
		else
			switchButtons[i].className = 'switch-button activated';
	}

	// Setting the workspace's class name according to the clicked button.
	workspace.className = classState;
}