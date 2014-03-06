/* All the things to do the user clicks in a Mado's window. */

$(document).click( function(e) {
	/* help.js */
	if ($(e.target).closest(helpButton).length && 
		helpDisplayer.className == "tool-displayer hidden") { // Click on the help button with the help input hide.
		helpDisplayer.className = "tool-displayer";
    	help.focus();
	}
	else if (helpDisplayer.className != "tool-displayer hidden" &&
		! $(e.target).closest(help).length && 
		! $(e.target).closest(resultsContainer).length) { // The user doesn't click on the help input nor help results (with help displayed)
		help.value = ""; // Reset the input of the help
		resetAnswerDiv(1);
		resultsContainer.className = "hidden"; // Hide the results container
		helpDisplayer.className = "tool-displayer hidden";
	}

	/* image.js */
	if ($(e.target).closest(imageButton).length && imageDisplayer.className == "tool-displayer hidden") { 
		/* Reset. */
		imageBrowser.innerHTML = "Choose an image";
		altInput.value = "";
		titleInput.value = "";
		imageLoaded = undefined;

		if ($(markdown).find("#mado-image").length == 0) { // If the focus is not yet on the contenteditable.
			markdown.focus();
			changeContentHighlighted("mado-image");
		}
		imageDisplayer.className = "tool-displayer";
		imageDiv = document.getElementById("mado-image");
		setImageInputs();
	}
	else if (imageDisplayer.className == "tool-displayer" && (! $(e.target).closest(imageBox).length || $(e.target).closest(document.getElementById("insert-image")).length)) {// The user doesn't click on the image insertion box.
		imageDisplayer.className = "tool-displayer hidden";
		selectElementContents(imageDiv);
		restoreSelection("mado-image");
	}

	/* link.js */
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";
		
		if ($(markdown).find("#mado-link").length == 0) { // If the focus is not yet on the contenteditable.
			markdown.focus();
			changeContentHighlighted("mado-link");
		}
		linkDisplayer.className = "tool-displayer";
		linkDiv = document.getElementById("mado-link");
		setLinkInputs();
		urlInput.focus();			
	}
	else if (linkDisplayer.className == "tool-displayer" && (! $(e.target).closest(linkDisplayer).length || $(e.target).closest(document.getElementById("insert-link")).length)) {
		linkDisplayer.className = "tool-displayer hidden";
		selectElementContents(linkDiv);
		restoreSelection("mado-link");
	}

	/* more.js */
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (moreDisplayer.className != "hidden" && ! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";

	/* recentfiles.js */
	if ($(e.target).closest(recentButton).length && recentFilesDisplayer.className == "hidden") {
		displayRecentFiles(); // If the user remove something from another window.
		recentFilesDisplayer.className = "";
	}
	else if (recentFilesDisplayer.className != "hidden" && ! $(e.target).closest(recentFilesContainer).length)
		recentFilesDisplayer.className = "hidden";

	/* styles.js */
	if ($(e.target).closest(stylesButton).length && stylesDisplayer.className == "tool-displayer hidden") {
		stylesDisplayer.className = "tool-displayer";
	}
	else if (stylesDisplayer.className != "tool-displayer hidden" && ! $(e.target).closest(stylesDisplayer).length)
		stylesDisplayer.className = "tool-displayer hidden";

	/* window.js */
	if (closeDisplayer.className == "visible" && ( // The close displayer is visible.
			! $(e.target).closest(windowCloseContainer).length ||  // The click is not on something in the closeDisplayer (closeButton included).
			$(e.target).closest(cancelCloseButton).length // The click is on the "Cancel" button.
			)
		)
		closeDisplayer.className = "hidden";
});
