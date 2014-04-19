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
var lastBounds; // This is the last size of the window.
var markdownSaved; // The last Markdown text saved.
var quitCloseButton; // The "No, don't save" button.
var saveQuitCloseButton; // The "Save and exit" button.
var saveState; // The div who displays if the document is saved or not.
var frameStylesheetLink = document.createElement("link"); // Create a "link" node.
var windowCloseContainer; // The close container.
var windowClose; // The close button.
var windowMax; // The maximize button.
var windowMin; // The minimize button.

/* Functions variables. */
var boundsBeforeMaximized;

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
	if (markdown.value != "") {
		if ((markdownSaved == undefined) || (markdown.value != markdownSaved))
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
	else {
		sendClosing(); // stats.js
		chrome.app.window.current().close();
	}
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
	else if (navigator.appVersion.indexOf("Win") != -1) { // If the user is on a Windows PC, redirect to the Windows window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
		windowMax.setAttribute("class", "cta little-icon-win-maximize");
		windowMin.setAttribute("class", "cta little-icon-win-minimize");
	}
	else if (navigator.appVersion.indexOf("Linux") != -1) { // If the user is on a Linux computer, redirect to the Linux Ubuntu window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-linux.css");
		windowClose.setAttribute("class", "cta little-icon-lin-close");
		windowMax.setAttribute("class", "cta little-icon-lin-maximize");
		windowMin.setAttribute("class", "cta little-icon-lin-minimize");
	}
	else { // If the user is on another type of computer, redirect to the generic window frame styles (which are primarily Chrome OS's styles).
		frameStylesheetLink.setAttribute("href", "css/window-frame-chromeos.css");
		windowClose.setAttribute("class", "cta little-icon-chr-close");
		windowMax.setAttribute("class", "cta little-icon-chr-maximize");
		windowMin.setAttribute("class", "cta little-icon-chr-minimize");
	}

	head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
}

function maximizeWindow () {
	if (navigator.appVersion.indexOf("Win") == -1) {
		if (! chrome.app.window.current().isMaximized()) // Maximize.
			chrome.app.window.current().maximize();
		else // Restore the last bounds.
			chrome.app.window.current().restore();
	}
	else {
		if (chrome.app.window.current().getBounds().width < screen.availWidth || 
			chrome.app.window.current().getBounds().height < screen.availHeight) {
			boundsBeforeMaximized = chrome.app.window.current().getBounds();
			chrome.app.window.current().setBounds({
				left: screen.availLeft, 
				top: screen.availTop, 
			 	width: screen.availWidth, 
			 	height: screen.availHeight 
			});
		}
		else { // Restore the last bounds.
			if (boundsBeforeMaximized != undefined)
				chrome.app.window.current().setBounds(boundsBeforeMaximized);
			else
				chrome.app.window.current().setBounds({ 
					left: ((screen.availWidth - Math.round(screen.width * 0.85)) / 2), 
					top: ((screen.availHeight - Math.round(screen.height * 0.85)) / 2), 
					width: Math.round(screen.width * 0.85), 
					height: Math.round(screen.height * 0.85) 
				});
		}
	}
}

function minimizeWindow () {
	chrome.app.window.current().minimize();
}

function quitCloseWindow () {
	sendClosing(); // stats.js
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
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
		    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
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
				    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
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

/*
* Chrome methods.
*
* Resume:
	* chrome.app.window.current().onBoundsChanged.addListener (): what to do when the window is resized or moved.
*/

chrome.app.window.current().onBoundsChanged.addListener(function () {
	if (chrome.app.window.current().getBounds().width < 1160 && switchToBoth.className == "switch-button activated")
		switchToMD.click(); // Markdown is set as default view.
	else if (chrome.app.window.current().getBounds().width >= 1160 && lastBounds.width < 1160) 
		switchToBoth.click(); // viewswitch.js

	if (chrome.app.window.current().getBounds().width < 1600 && lastBounds.width >= 1600)
		addTopbarLabels();
	else if (chrome.app.window.current().getBounds().width >= 1600 && lastBounds.width < 1600)
		removeTopbarLabels();
	lastBounds = chrome.app.window.current().getBounds();
});