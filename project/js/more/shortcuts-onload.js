/* All the things to do when shortcuts.html is loaded. */
var helpShortcut; // The div who contains the help's shortcut.

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
    determineCloseButton(); // Determine the close button style.
	
	if (navigator.appVersion.indexOf("Mac") != -1) {// If the user is on a Mac.
		$(".ctrl-cmd-key").html("&#8984;"); // Insert the "Cmd" symbol.
		$(helpShortcut).css("display", "none"); // Hide the help's shortcut.
	}
	else
		$(".ctrl-cmd-key").html("Ctrl"); // Insert the "Ctrl" string.

	$(windowClose).on("click", function() {
        chrome.app.window.current().close();
    });
}