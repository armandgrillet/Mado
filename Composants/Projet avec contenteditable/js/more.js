/* This document handles the "More" button and his behavior. */

var moreButton; // The "More" button (three square on top of each other).
var moreDisplayer; // The div that displays or not the list of options.
var moreBox; // The clickable zone of the list.
var settingsLink; // Link to the settings.
var QAndALink; // Link to the questions & answers.
var shortcutsLink; // Link to an exhaustive list of the shortcuts.
var aboutLink; // Link to the additional information about Mado.

$(document).click(function(e) { // Set how to display the div.
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") {
		moreDisplayer.className = "";
	}

	else if (! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";
});