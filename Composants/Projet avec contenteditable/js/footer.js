var charsDiv;
var wordsDiv;

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