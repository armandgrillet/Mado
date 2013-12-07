/* The JS to control the scripts for Mado's window. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variable.
*/

/* HTML shortcuts. */
var cancelCloseButton; // The "Cancel" button.
var closeDisplayer; // The div that contains all the close divs.
var quitCloseButton; // The "No, don't save" button.
var saveQuitCloseButton; // The "Save and exit" button.
var windowClose; // The close button.
var windowMax; // The maximize button.
var windowMin; // The minimize button.

/* Functions variable. */
var bounds; // This is the variable who stores the bounds when the window is maximised.

/*
* Functions (in alphabetical order).
*
* Resume:
	* closeWindow (): what to do when the user clicks on close.
	* maximizeWindow (): what to do when the user clicks on maximize.
	* minimizeWindow (): what to do when the user clicks on minimize. 
	* quitCloseWindow (): what to do when the user clicks on "No, don't save".
	* saveAndQuit (): save an already existing file and quit.
	* saveAsAndQuit (): save a new file and quit.
	* saveQuitCloseWindow (): what to do when the user clicks on "Save and exit".
*/

function closeWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(window.screenX, window.screenY, window.innerWidth, window.innerHeight);
	});
	if (saveState.innerHTML == "| Unsaved <span class=\"little-icon-unsaved\"></span>") // Save not made.
		closeDisplayer.className = "visible";
	else 
		chrome.app.window.current().close();
}

function maximizeWindow () {
	if (! chrome.app.window.current().isMaximized()) { // Save the bounds and maximize.
		bounds = chrome.app.window.current().getBounds();
		chrome.app.window.current().maximize();
	}
	else // Restore the last bounds.
		chrome.app.window.current().setBounds(bounds);
}

function minimizeWindow () {
	chrome.app.window.current().minimize();
}

function quitCloseWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(window.screenX, window.screenY, window.innerWidth, window.innerHeight);
	});
	chrome.app.window.current().close();
}

function saveAndQuit () {
	fileEntry.createWriter(
		function(writer) {
	 		writer.write(
	 			new Blob(
		 			[textarea.value],
					{
						type: "text/plain"
					}
				)
			); 
			quitCloseWindow();
	 	}, 
	errorHandler);
}

function saveAsAndQuit () {
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "document.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(
					function(writer) {
				 		writer.write(
				 			new Blob(
					 			[textarea.value],
								{
									type: "text/plain"
								}
							)
						); 		
						newRecentFile(savedFile, "quit"); // Update the local storage, the file opened is now on top.										
				 	}, 
				errorHandler);
			}
		}
	);
}

function saveQuitCloseWindow () {
	if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;|") // Not saved or not a Markdown file.
		saveAsAndQuit();
	else
		saveAndQuit();
}

