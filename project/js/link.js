/* Set how the link div has to work */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
*/

/* HTML shortcuts. */
var cancelLinkButton; // The "Cancel" button.
var hypertextInput; // The div that contains the hypertext.
var link; // The content that is added.
var linkButton; // The "Link" button.
var linkDisplayer; // The div that contains all the link divs.
var urlInput; // The div that contains the url.
var linkDiv; // The div with id="mado-link".

/*
* Function.
*
* Resume:
	* applyLink (): what to do when the user press enter after setting the link.
	* cancelLink (): what to do if the user press elsewhere the link container when he was adding a link.
	* modifyLink (): enables the realtime modification of a link.
*/

function applyLink () {
	if (urlInput.value == "")
		urlInput.focus();	
	else {
		modifyLink();
		linkDisplayer.className = "tool-displayer hidden";
		selectElementContents(linkDiv);
		restoreSelection("mado-link");
	}
}

function cancelLink () {
	if (linkDiv != undefined)
		linkDiv.innerText = initialText;	

	linkDisplayer.className = "tool-displayer hidden";	
	selectElementContents(linkDiv);
	restoreSelection("mado-link");
	conversion();
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