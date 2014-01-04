/* Set how the link div has to work */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
*/

/* HTML shortcuts. */
var hypertextInput; // The div that contains the hypertext.
var link; // The content that is added.
var linkButton; // The "Link" button.
var linkDisplayer; // The div that contains all the link divs.
var urlInput; // The div that contains the url.
var linkDiv;

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
		if (linkDiv != undefined)
			linkDiv.innerText = link;		
		else
			$(markdown).innerText = $(markdown).innerText + link;
		removeDivWithId("mado-link");
		$(markdown).click();	
	}
}

function modifyLink () {
	if (hypertextInput.value == "")
		link = '[' + urlInput.value + "](" + urlInput.value + ')';
	else 
		link = '[' + hypertextInput.value + "](" + urlInput.value + ')';
	if (linkDiv != undefined)
		linkDiv.innerText = link;		
	else
		$(markdown).innerText = $(markdown).innerText + link;
	conversion();
}

function cancelLink () {
	if (linkDiv != undefined)
		linkDiv.innerText = initialText;		
	removeDivWithId("mado-link");
	conversion();
}
