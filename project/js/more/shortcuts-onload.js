/* All the things to do when shortcuts.html is loaded. */

window.onload = function() {
	/*
    * Shortcuts.
    */
    head = document.getElementsByTagName("head")[0]; // The "head" section of the option window.
    windowClose = document.getElementById("window-close");

	/*
	* Functions.
	*/
    determineCloseButton(); // Determine the close button style.
	
	if (navigator.appVersion.indexOf("Mac") != -1) // If the user is on a Mac.
		$(".ctrl-cmd-key").html("&#8984;"); // Insert the "Cmd" symbol.
	else
		$(".ctrl-cmd-key").html("Ctrl"); // Insert the "Ctrl" string.

	$(windowClose).on("click", function() {
        chrome.app.window.current().close();
    });
}