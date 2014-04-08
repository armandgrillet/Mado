/* The JS to get the history of modifications from the user */

var diffArray; // Structure of a row: |array of diffs|int cursorPos|bool isLast
var lastMarkdown = document.createElement("div");
var dmp = new diff_match_patch();
var diff;

function addDiff () {
	if (lastMarkdown.innerText != markdown.innerText) {
		diff = dmp.diff_main(lastMarkdown.innerHTML, markdown.innerHTML);
		for (var i = 0; i < diff.length; i++) {
			if (diff[i][0] == 0) { // Same code.
				console.log("On garde " + diff[i][1]);
				// where += diff[i][1].length;
			}
			else if (diff[i][0] == -1) { // Code removed.
				console.log("On enlève " + diff[i][1]);
				// conversionDiv.innerHTML = conversionDiv.innerHTML.substring(0, where) + conversionDiv.innerHTML.substring(where + diff[i][1].length - 1, conversionDiv.innerHTML.length);
			}
			else { // Code added.
				console.log("On ajoute " + diff[i][1]);
				// conversionDiv.innerHTML = conversionDiv.innerHTML.substring(0, where) + diff[i][1] + conversionDiv.innerHTML.substring(where + diff[i][1].length - 1, conversionDiv.innerHTML.length);
				// where += diff[i][1].length;
			}
		}
		lastMarkdown.innerHTML = markdown.innerHTML; 
	}
}

function goBack () {

}

function goForward () {

}



function removeDiffs() {

}