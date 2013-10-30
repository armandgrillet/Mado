/* Set how the link div has to work */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var hypertextInput; // The div that contains the hypertext.
var link; // The content that is added.
var linkButton; // The "Link" button.
var linkDisplayer; // The div that contains all the link divs.
var urlInput; // The div that contains the url.

/* Functions variables. */
var endSelect; // End of the selection
var newStartSelect; // New start of the selection.
var newEndSelect; // New end of the selection.
var startSelect; // Start of the selection.

/*
* Function.
*
* Resume:
	* applyLink (): what to do when the user press enter after setting the link.
*/

function applyLink () {
	if (urlInput.value == "")
		urlInput.focus();	
	else {
		if (hypertextInput.value == "")
			link = '[' + urlInput.value + "](" + urlInput.value + ')';
		else 
			link = '[' + hypertextInput.value + "](" + urlInput.value + ')';
		newStartSelect = (textarea.value.slice(0, startSelect)).length;
		newEndSelect = (textarea.value.slice(0, startSelect) + link).length;
		textarea.value = textarea.value.slice(0, startSelect) + link + textarea.value.slice(endSelect, textarea.length);
		$(textarea).click();
		textarea.focus();
		textarea.setSelectionRange(newStartSelect, newEndSelect);
		conversion();
	}
}

/*
* Listener.
*/

$(document).click(function(e) {
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";

		linkDisplayer.className = "tool-displayer";
		startSelect = textarea.selectionStart;
		endSelect = textarea.selectionEnd;
		if (startSelect != endSelect) {
			textarea.setSelectionRange(startSelect, endSelect);
			hypertextInput.value = textarea.value.substring(startSelect, endSelect);
		}
		urlInput.focus();
	}
	else if (! $(e.target).closest(linkDisplayer).length)		
		linkDisplayer.className = "tool-displayer hidden";
});