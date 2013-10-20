var nameDiv;
var charsDiv;
var wordsDiv;
var markdownSaved;

function displayCounter (counter) {
	charsDiv.innerHTML = ' ' + counter.characters + " characters&nbsp;";
  	wordsDiv.innerHTML = ' ' + counter.words + " words&nbsp;";
  	if (counter.characters == 1)
  		charsDiv.innerHTML = ' ' + counter.characters + " character&nbsp;";
  	if (counter.words == 1)
		wordsDiv.innerHTML = ' ' + counter.words + " word&nbsp;";
}

function counterSelection () { // What counter to display.
	if (charsDiv.style.display == "none") {
		charsDiv.style.display = "inline";
		wordsDiv.style.display = "none";
	}
	else {
		charsDiv.style.display = "none";
		wordsDiv.style.display = "inline";
	}
}

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