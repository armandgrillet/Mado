/* The JS to control the close button's styles according to the user's OS. */

/* HTML shortcuts. */
var stylesheetLink = document.createElement("link"); // Create a "link" node.
var windowClose; // The close button.

/*
* Function.
*/
function determineCloseButton () {
	stylesheetLink.setAttribute("rel", "stylesheet");
	stylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac close button styles.
		stylesheetLink.setAttribute("href", "css/more/close-button-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
	}
	else { // If the user is on another type of computer, redirect to the generic close button styles.
		stylesheetLink.setAttribute("href", "css/more/close-button-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
	}

	head.appendChild(stylesheetLink); // Append the link node to the "head" section.
}