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
		newStartSelect = (markdown.innerText.slice(0, startSelect)).length;
		newEndSelect = (markdown.innerText.slice(0, startSelect) + link).length;
		markdown.innerText = markdown.innerText.slice(0, startSelect) + link + markdown.innerText.slice(endSelect, markdown.length);
		$(markdown).click();
		markdown.focus();
		markdown.setSelectionRange(newStartSelect, newEndSelect);
		conversion();
	}
}
