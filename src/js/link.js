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
	* setLinkInputs (): recognizes when the selected text is a link and set the inputs in consequence.
*/

function applyLink () {
	if (urlInput.value == "") {
		urlInput.setAttribute("class", "tool-first-item flash");
		urlInput.focus();
		urlInput.setAttribute("class", "tool-first-item");
	}
	else {
		linkDisplayer.className = "tool-displayer hidden";
		markdown.focus();
		$(markdown).setRange(startSelect, newEndSelect);
	}
}

function cancelLink () {
	markdown.value = markdown.value.substring(0, startSelect) + initialText + markdown.value.substring(newEndSelect, markdown.length);
	contentChanged();
	linkDisplayer.className = "tool-displayer hidden";	
	markdown.focus();
	$(markdown).setRange(startSelect, endSelect);
}

function modifyLink () {
	if (hypertextInput.value == "")
		link = '[' + urlInput.value + "](" + urlInput.value + ')';
	else 
		link = '[' + hypertextInput.value + "](" + urlInput.value + ')';
	if (newEndSelect == undefined)
		newEndSelect = endSelect;
	markdown.value = markdown.value.substring(0, startSelect) + link + markdown.value.substring(newEndSelect, markdown.length);
	newEndSelect = (markdown.value.substring(0, startSelect) + link).length;
	contentChanged();
}

function setLinkInputs () {
	initialText = markdown.value.substring(startSelect, endSelect);
	if (/\[.*\]\(.*\)/.test(initialText) &&
		initialText[0] == '[' &&
		initialText[initialText.length - 1] == ')') {
		hypertextInput.value = initialText.match(/\[.*\]/)[0].substring(1, initialText.match(/\[.*\]/)[0].length - 1);
		urlInput.value = initialText.match(/\(.*\)/)[0].substring(1, initialText.match(/\(.*\)/)[0].length - 1);
	}
	else
		hypertextInput.value = initialText;
	$(markdown).setRange(startSelect, newEndSelect);
}