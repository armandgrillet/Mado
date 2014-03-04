/* The JS to control the close button's styles according to the user's OS. */

/* HTML shortcuts. */
var head; // The "head" section of the option window.
var stylesheetLink = document.createElement("link"); // Create a "link" node.
var windowClose; // The close button.

/*
* Function.
*
* Resume:
	* determineCloseButton (): choose the button to display for closing the frame.
*/
function determineCloseButton () {
	stylesheetLink.setAttribute("rel", "stylesheet");
	stylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac frame styles.
		stylesheetLink.setAttribute("href", "../css/more/more-frame-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
	}
	else if (navigator.appVersion.indexOf("Win") != -1) { // If the user is on a Windows PC, redirect to the Windows frame styles.
		stylesheetLink.setAttribute("href", "../css/more/more-frame-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
	}
	else { // If the user is on another type of computer, redirect to the generic frame styles.
		stylesheetLink.setAttribute("href", "../css/more/more-frame-others.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
	}

	head.appendChild(stylesheetLink); // Append the link node to the "head" section.
}