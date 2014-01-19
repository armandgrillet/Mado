/* All the things to do when shortcuts.html is loaded. */
var helpShortcut; // The div who contains the help's shortcut.
var head; // The "head" section of the option window.
var stylesheetLink = document.createElement("link"); // Create a "link" node.
var windowClose; // The close button.

window.onload = function() {
	/*
    * Shortcuts.
    */
    head = document.getElementsByTagName("head")[0]; // The "head" section of the option window.
    helpShortcut = document.getElementById("help-shortcut");
    windowClose = document.getElementById("window-close");

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
	
	if (navigator.appVersion.indexOf("Mac") != -1) {// If the user is on a Mac.
		$(".ctrl-cmd-key").html("&#8984;"); // Insert the "Cmd" symbol.
		helpShortcut.style.display = "none"; // Hide the help's shortcut.
	}
	else
		$(".ctrl-cmd-key").html("Ctrl"); // Insert the "Ctrl" string.

	$(windowClose).on("click", function() {
        chrome.app.window.current().close();
    });
}