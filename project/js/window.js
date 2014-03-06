/* The JS to control the scripts for Mado's window. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variable.
*/

/* HTML shortcuts. */
var cancelCloseButton; // The "Cancel" button.
var closeDisplayer; // The div that contains all the close divs.
var head; // The "head" section of the main app.
var markdownSaved; // The last Markdown text saved.
var quitCloseButton; // The "No, don't save" button.
var saveQuitCloseButton; // The "Save and exit" button.
var saveState; // The div who displays if the document is saved or not.
var frameStylesheetLink = document.createElement("link"); // Create a "link" node.
var windowCloseContainer; // The close container.
var windowClose; // The close button.
var windowMax; // The maximize button.
var windowMin; // The minimize button.

/* Functions variable. */
var bounds; // This is the variable who stores the bounds when the window is maximised.

/*
* Functions (in alphabetical order).
*
* Resume:
	* checkSaveState (): change saveState's innerHTML.
	* closeWindow (): what to do when the user clicks on close.
	* determineFrame (): which window bar style to display on launch, according to the OS.
	* maximizeWindow (): what to do when the user clicks on maximize.
	* minimizeWindow (): what to do when the user clicks on minimize. 
	* quitCloseWindow (): what to do when the user clicks on "No, don't save".
	* saveAndQuit (): save an already existing file and quit.
	* saveAsAndQuit (): save a new file and quit.
	* saveQuitCloseWindow (): what to do when the user clicks on "Save and exit".
*/

function checkSaveState () {
	if (markdown.innerText != "") {
		if ((markdownSaved == undefined) || (markdown.innerText != markdownSaved))
			saveState.innerHTML = "<span class=\"little-icon-unsaved\"></span>";
		else
			saveState.innerHTML = "";
	}
	else {
		if (markdownSaved != undefined)
			saveState.innerHTML = "<span class=\"little-icon-unsaved\"></span>";
		else
			saveState.innerHTML = "";
	}
}

function closeWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
	if (saveState.innerHTML == "<span class=\"little-icon-unsaved\"></span>") // Save not made.
		closeDisplayer.className = "visible";
	else
		chrome.app.window.current().close();
}

function determineFrame () {
	frameStylesheetLink.setAttribute("rel", "stylesheet");
	frameStylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
		windowMax.setAttribute("class", "cta little-icon-mac-maximize");
		windowMin.setAttribute("class", "cta little-icon-mac-minimize");
	}
	else if (navigator.appVersion.indexOf("Win") != -1) { // If the user is on a Mac, redirect to the Mac window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
		windowMax.setAttribute("class", "cta little-icon-win-maximize");
		windowMin.setAttribute("class", "cta little-icon-win-minimize");
	}
	else { // If the user is on another type of computer, redirect to the generic window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-others.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
		windowMax.setAttribute("class", "cta little-icon-win-maximize");
		windowMin.setAttribute("class", "cta little-icon-win-minimize");
	}

	head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
}

function maximizeWindow () {
	if (navigator.appVersion.indexOf("Win") != -1) { // Windows + Google = bad things.
		if (! (chrome.app.window.current().getBounds().left == 0  
			&& chrome.app.window.current().getBounds().top == 0
			&& chrome.app.window.current().getBounds().width == screen.availWidth
			&& chrome.app.window.current().getBounds().height == screen.availHeight)
			&& ! chrome.app.window.current().isMaximized()) {
			bounds = chrome.app.window.current().getBounds();
			chrome.app.window.current().setBounds({ left: 0, top: 0, width: screen.availWidth, height: screen.availHeight });
		}
		else // Restore the last bounds.
			chrome.app.window.current().setBounds(bounds);
	}
	else {
		if (! chrome.app.window.current().isMaximized()) { // Maximize.
			chrome.app.window.current().maximize();
		}
		else // Restore the last bounds.
			chrome.app.window.current().restore();
	}
}

function minimizeWindow () {
	chrome.app.window.current().minimize();
}

function quitCloseWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
	chrome.app.window.current().close();
}

function saveAndQuit () {
	fileEntry.createWriter(function(fileWriter) {
		    truncated = false;
		    fileWriter.onwriteend = function(e) {
		        if (!truncated) {
		            truncated = true;
		            this.truncate(this.position);
		            return;
		        }
		        newRecentFile(fileEntry, "quit");
		    };
		    fileWriter.write(new Blob([markdown.innerText], {type: 'plain/text'}));
		}, errorHandler);
}

function saveAsAndQuit () {
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "document.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(function(fileWriter) {
				    truncated = false;
				    fileWriter.onwriteend = function(e) {
				        if (!truncated) {
				            truncated = true;
				            this.truncate(this.position);
				            return;
				        }
				        newRecentFile(savedFile, "quit"); // Update the local storage, the file opened is now on top.	
				    };
				    fileWriter.write(new Blob([markdown.innerText], {type: 'plain/text'}));
				}, errorHandler);
			}
		}
	);
}

function saveQuitCloseWindow () {
	if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;-") // Not saved pr the document is not in Markdown.
		saveAsAndQuit();
	else
		saveAndQuit();
}