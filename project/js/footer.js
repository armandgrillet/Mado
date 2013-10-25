/* Functions who handle Mado's footer. */

/*
* Variables (in alphabetical order).
*/

var charsDiv; // The div who contains the document's chars number.
var markdownSaved; // The last Markdown text saved.
var nameDiv; // The div who contains the name of the opened document.
var saveState; // The div who displays if the document is saved or not.
var wordsDiv; // The div who contains the document's words number.

/*
* Functions (in alphabetical order).
*
* Resume:
	* checkSaveState (): change saveState's innerHTML.
	* counterSelection (): what counter to display.
	* displayCounter (): change charsDiv and wordsDiv.
*/

function checkSaveState () {
	if (textarea.value != "") {
		if (markdownSaved == undefined || (textarea.value != markdownSaved))
			saveState.innerHTML = "| Unsaved <span class=\"little-icon-unsaved\"></span>";
		else
			saveState.innerHTML = "| Saved <span class=\"little-icon-saved\"></span>";
	}
	else {
		if (markdownSaved != undefined)
			saveState.innerHTML = "| Unsaved <span class=\"little-icon-unsaved\"></span>";
		else
			saveState.innerHTML = "";
	}
}

function counterSelection () {
	if (charsDiv.style.display == "none") {
		charsDiv.style.display = "inline";
		wordsDiv.style.display = "none";
	}
	else {
		charsDiv.style.display = "none";
		wordsDiv.style.display = "inline";
	}
}

function displayCounter (counter) {
	charsDiv.innerHTML = ' ' + counter.characters + " characters&nbsp;";
  	wordsDiv.innerHTML = ' ' + counter.words + " words&nbsp;";
  	if (counter.characters == 1)
  		charsDiv.innerHTML = ' ' + counter.characters + " character&nbsp;";
  	if (counter.words == 1)
		wordsDiv.innerHTML = ' ' + counter.words + " word&nbsp;";
}