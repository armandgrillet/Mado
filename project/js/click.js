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
		initialText = markdown.value;
		newEndSelect = undefined;
		imageLoaded = undefined;

		imageDisplayer.className = "tool-displayer";
		if (markdown.selectionStart != markdown.selectionEnd
			|| $(markdown).is(':focus')) {
			startSelect = markdown.selectionStart;
			endSelect = markdown.selectionEnd;
		}
		else {
			startSelect = markdown.value.length;
			endSelect = markdown.value.length;
		}
		if (startSelect != endSelect)
			markdown.setSelectionRange(startSelect, endSelect);
		setImageInputs();
	}
	else if (imageDisplayer.className == "tool-displayer" && (! $(e.target).closest(imageBox).length || $(e.target).closest(document.getElementById("insert-image")).length)) {// The user doesn't click on the image insertion box.
		if ($(e.target).closest(document.getElementById("insert-image")).length)
			applyImage();
		else
			imageDisplayer.className = "tool-displayer hidden";
	}

	/* link.js */
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";
		initialText = markdown.value;
		newEndSelect = undefined;
		
		linkDisplayer.className = "tool-displayer";
		if (markdown.selectionStart != markdown.selectionEnd
			|| $(markdown).is(':focus')) {
			startSelect = markdown.selectionStart;
			endSelect = markdown.selectionEnd;
		}
		else {
			startSelect = markdown.value.length;
			endSelect = markdown.value.length;
		}
		if (startSelect != endSelect)
			markdown.setSelectionRange(startSelect, endSelect);
		setLinkInputs();
		urlInput.focus();		
	}
	else if (linkDisplayer.className == "tool-displayer" && (! $(e.target).closest(linkDisplayer).length || $(e.target).closest(document.getElementById("insert-link")).length)) {	
		if ($(e.target).closest(document.getElementById("insert-link")).length)
			applyLink();
		else
			linkDisplayer.className = "tool-displayer hidden";
	}

	/* more.js */
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (moreDisplayer.className != "hidden" && ! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";

	/* online-image.js */
	if ($(e.target).closest(onlineImageButton).length && onlineImageDisplayer.className == "tool-displayer hidden") {
		onlineImageDisplayer.className = "tool-displayer";
		/* Reset. */
		onlineImageUrlInput.value = "";
		onlineImageAltInput.value = "";
		initialText = markdown.value;
		newEndSelect = undefined;
		
		onlineImageDisplayer.className = "tool-displayer";
		if (markdown.selectionStart != markdown.selectionEnd
			|| $(markdown).is(':focus')) {
			startSelect = markdown.selectionStart;
			endSelect = markdown.selectionEnd;
		}
		else {
			startSelect = markdown.value.length;
			endSelect = markdown.value.length;
		}
		if (startSelect != endSelect)
			markdown.setSelectionRange(startSelect, endSelect);
		setOnlineImageInputs();
		onlineImageUrlInput.focus();
	}
	else if (onlineImageDisplayer.className == "tool-displayer" && (! $(e.target).closest(onlineImageDisplayer).length || $(e.target).closest(document.getElementById("insert-webimage")).length)) {// The user doesn't click on the image insertion box.
		if ($(e.target).closest(document.getElementById("insert-webimage")).length)
			applyOnlineImage();
		else
			onlineImageDisplayer.className = "tool-displayer hidden";
	}
	
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
