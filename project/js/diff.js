/* The JS to get the history of modifications from the user */

var diffArray = []; // Structure of a row: |array of diffs|int cursorPos|bool isLast
var lastMarkdown = document.createElement("div");
var dmp = new diff_match_patch();
var diff;
var whereInTheDiff; // Position in the diff.

function addDiff () {
	if (lastMarkdown.innerText != markdown.innerText) {
		diff = dmp.diff_main(lastMarkdown.innerHTML, markdown.innerHTML);

		console.log(diff);
		whereInTheDiff = 0;
		for (var i = 0; i < diff.length; i++) {
			if (diff[i][0] == 0) { // Same code.
				console.log("On garde " + diff[i][1]);
				whereInTheDiff += diff[i][1].length;
				diff.splice(i, 1);
				i--;
			}
			else if (diff[i][0] == -1) { // Code removed.
				console.log("On enlève " + diff[i][1]);
				diff[i].push(whereInTheDiff);
			}
			else { // Code added.
				console.log("On ajoute " + diff[i][1]);
				diff[i].push(whereInTheDiff);
				whereInTheDiff += diff[i][1].length;
			}
		}
		console.log(diff);

		while (diffArray[diffArray.length] != undefined && diffArray[diffArray.length - 1][1] == false) // Remove unused lines in the array.
			diffArray.splice(diffArray.length - 1, 1);

		if (diffArray.length > 0) // If the array is not empty.
			diffArray[diffArray.length - 1][1] = false;

		diff.push(true);
		diffArray.push(diff);	// insert the new diff.
		lastMarkdown.innerHTML = markdown.innerHTML; // Set the new version of Markdown.
	}
}

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function goBack () {
	console.log("BACK");
	if (diffArray.length > 0) {
		console.log("le tableau n'est pas vide");
		for (var i = diffArray.length - 1; i >= 0; i--) {
			console.log(diffArray[i]);
			if (diffArray[i][diffArray[i].length - 1] == true) { // This is the line with the diffs.
				diffArray[i][diffArray[i].length - 1] = false;

				for (var j = diffArray[i].length - 2; j >= 0; j--) {
					console.log("Truc à changer");
					console.log(diffArray[i][j]);
					if (diffArray[i][j][0] == 1) { // Something was added.
						console.log("A enlever : " + diffArray[i][0][1]);
						markdown.innerHTML = markdown.innerHTML.slice(0, diffArray[i][j][2]) + markdown.innerHTML.slice(diffArray[i][0][1].length + diffArray[i][j][2]);
					}
					else if (diffArray[i][0][j][0] == -1) {// Something was removed.
						console.log("A ajouter : " + diffArray[i][0][1]);
						markdown.innerHTML = markdown.innerHTML.slice(0, diffArray[i][j][2]) + diffArray[i][j][1] + markdown.innerHTML.slice(diffArray[i][j][2]);
					}
				}

				if (diffArray[i - 1] != undefined) // If the array is not finished
					diffArray[i - 1][diffArray[i - 1].length - 1] = true;
				lastMarkdown.innerHTML = markdown.innerHTML; 
				break;
			}			
			
		}
	}
}

function goForward () {

}



function removeDiffs() {

}