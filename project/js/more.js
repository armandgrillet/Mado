/* This document handles the "More" button and his behavior. */

/* 
* Variables (in alphabetical order). 
*/

var moreButton; // The "More" button (three square on top of each other).
var moreDisplayer; // The div that displays or not the list of options.
var moreBox; // The clickable zone of the list.
var settingsLine; // Link to the settings.
var qAndALine; // Link to the questions & answers.
var shortcutsLine; // Link to an exhaustive list of the shortcuts.
var aboutLine; // Link to the additional information about Mado.

/*
* Listener.
*/

$(document).click(function(e) { 
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";
});