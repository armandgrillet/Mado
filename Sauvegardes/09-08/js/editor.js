/* Events linked to the Markdown textarea */

var textarea; // The textarea where the user writes.
var conversionDiv; // The div who contains the HTML conversion.
var charsDiv;
var wordsDiv;
var saveState;
var link;

function conversion () {
	Countable.once(textarea, function (counter) { // Count the words in the textarea
		charsDiv.innerHTML = ' ' + counter.characters + " characters&nbsp;";
  		wordsDiv.innerHTML = ' ' + counter.words + " words&nbsp;";
  		if (counter.characters == 1)
  			charsDiv.innerHTML = ' ' + counter.characters + " character&nbsp;";
  		if (counter.words == 1)
			wordsDiv.innerHTML = ' ' + counter.words + " word&nbsp;";
	});

	if (textarea.value.length > 0) {
	    marked(textarea.value, function (err, content) { // Marked.js makes the conversion.
	        conversionDiv.innerHTML = content;
	        if (content.indexOf("<a>" != -1)) {
  				$('a').click(function () { // Link to the internet
  					if (this.href.indexOf('.') != -1) {
	  					link = document.createElement('a');
						link.href = this.href;
						link.target = '_blank';
						link.click();
	        			return false;
	        		}
	        		else { // Link to a not, I don't know what to do
	        			return false;
	        		}
    			});
			}
	        saveState.innerHTML = "Unsaved";
	    });
	}
	else
		conversionDiv.innerHTML = "The HTML view.";
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