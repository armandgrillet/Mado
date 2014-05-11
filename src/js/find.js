/* HTML Shortcuts */
/*var search;
var iterations;
var buttons;*/

var searchPosition = -1;
var searchPositions = [];
var searchPositionCase;
var searchedWord;

/*window.onload = function() {
	iterations = document.getElementById("iterations");
	buttons = document.getElementById("moves");
	$(search).on("input propertychange", searchWord);
	$(prev).on("click", function() {
		searchOther(0);
	});
	$(next).on("click", function() {
		searchOther(1);
	});
}*/

function searchOther (prevOrNext) {
	if (! prevOrNext)
		searchPositionCase--;
	else
		searchPositionCase++;

	if (searchPositionCase < 0)
		searchPositionCase = searchPositions.length - 1;
	else if (searchPositionCase >= searchPositions.length)
		searchPositionCase = 0;

	$(markdown).setRange(searchPositions[searchPositionCase], searchPositions[searchPositionCase] + searchedWord.length);
}

function searchWord (word) {
	searchedWord = word;
	searchPosition = -1;
	searchPositions = [];
	if (searchedWord != '') {
		while (markdown.value.indexOf(searchedWord, searchPosition + 1) > -1) {
			searchPosition = markdown.value.indexOf(searchedWord, searchPosition + 1);
			searchPositions.push(searchPosition);
		}
		// iterations.innerHTML = searchPositions.length;

		if (searchPositions.length > 0) {
			searchPositionCase = 0;
			// $(buttons).css("display", "block");
			$(markdown).setRange(searchPositions[searchPositionCase], searchPositions[searchPositionCase] + searchedWord.length);
		}
		else {
			// $(buttons).css("display", "none");
		}
	}
	else {
		// $(buttons).css("display", "none");
		// iterations.innerHTML = 0;
	}
}