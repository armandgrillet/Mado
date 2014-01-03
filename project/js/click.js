/* All the things to do the user clicks in a Mado's window. */

$(document).click( function(e) {
	/* help.js */
	if ($(e.target).closest(helpButton).length && 
		helpDisplayer.className == "tool-displayer hidden") { // Click on the help button with the help input hide.
		helpDisplayer.className = "tool-displayer";
    	help.focus();
	}
	else if (! $(e.target).closest(help).length && 
		! $(e.target).closest(resultsContainer).length) { // The user doesn't click on the help input nor help results (with help displayed)
		help.value = ""; // Reset the input of the help
		resetAnswerDiv(1);
		resultsContainer.className = "hidden"; // Hide the results container
		helpDisplayer.className = "tool-displayer hidden";
	}

	/* image.js */
	if ($(e.target).closest(imageButton).length && // Click on the "Image" button with the image insertion tool hidden
		imageDisplayer.className == "tool-displayer hidden") { 
		/* Reset. */
		imageBrowser.innerHTML = "Choose an image";
		imageStatus.style.display = "none";
		altInput.value = "";
		titleInput.value = "";
		imageLoaded = undefined;

		imageDisplayer.className = "tool-displayer";
		if (startSelect != endSelect)
			titleInput.value = markdown.innerText.substring(startSelect, endSelect);
	}
	else if (! $(e.target).closest(imageBox).length) // The user doesn't click on the image insertion box.
		imageDisplayer.className = "tool-displayer hidden";

	/* link.js */
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";

		linkDisplayer.className = "tool-displayer";
		if ($(markdown).children('#mado-link')[0] != undefined) {
			hypertextInput.value = $(markdown).children('#mado-link')[0].innerText;
			initialLinkText = hypertextInput.value;
		}
		urlInput.focus();
	}
	else if (linkDisplayer.className == "tool-displayer" && ! $(e.target).closest(linkDisplayer).length) {	
		cancelLink();
		linkDisplayer.className = "tool-displayer hidden";
	}

	/* more.js */
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";

	/* recentfiles.js */
	if ($(e.target).closest(recentButton).length && recentFilesDisplayer.className == "hidden") {
		displayRecentFiles(); // If the user remove something from another window.
		recentFilesDisplayer.className = "";
	}
	else if (! $(e.target).closest(recentFilesContainer).length && recentFilesDisplayer.className == "")
		recentFilesDisplayer.className = "hidden";

	/* styles.js */
	if ($(e.target).closest(stylesButton).length && stylesDisplayer.className == "tool-displayer hidden") {
		stylesDisplayer.className = "tool-displayer";
	}
	else if (! $(e.target).closest(stylesDisplayer).length)		
		stylesDisplayer.className = "tool-displayer hidden";

	/* window.js */
	if (closeDisplayer.className == "visible" && ( // The close displayer is visible.
			! $(e.target).closest(windowCloseContainer).length ||  // The click is not on something in the closeDisplayer (closeButton included).
			$(e.target).closest(cancelCloseButton).length // The click is on the "Cancel" button.
			)
		)		
		closeDisplayer.className = "hidden";
});
