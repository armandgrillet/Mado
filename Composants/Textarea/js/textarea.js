var caret; // Shortcut for textarea.selectionStart
var start; // Shortcut for textarea.selectionStart when something is selected
var end; // Shortcut for textarea.selectionEnd when something is selected

var boolSelect; // Important boolean on selectionAnalizis()

// markupModification()
var addStart; // Choose if opening tag have to be add when a button is clicked
var addEnd; // Choose if closing tag have to be add when a button is clicked
var weirdSelection;
var beforeSelection;
var afterSelection;
var noMarkupsSelection;

window.onload = function () {
	textarea = document.getElementById("markdown"); // Shortcut to use functions on the textarea
	document.getElementById("bold").addEventListener("click", bold); // Link to bold() when "bold" button clicked
	textarea.addEventListener("mouseup", checkActiveButtons); // Click = check on the buttons
	textarea.addEventListener("keyup", checkActiveButtons); // Key input = check on the buttons
}

function checkActiveButtons () { // Set what buttons have to be active 
	if (textarea.selectionStart == textarea.selectionEnd) { // No text selection
		caret = textarea.selectionStart;

		// Bold
		if (textarea.value.substring(0, caret).match(/\*\*/g) != null && textarea.value.substring(caret, textarea.size).match(/\*\*/g) != null // "**" on left and right
		&& textarea.value.substring(0, caret).match(/\*\*/g).length % 2 == 1) // Iterations of "**" on the left are impairs
			document.getElementById("bold").className = "active";
		else
			document.getElementById("bold").className = "";
	}
	else { // Text selected
		start = textarea.selectionStart;
		end = textarea.selectionEnd;

		// Bold 
		if (textarea.value.substring(0, start).match(/\*\*/g) != null && textarea.value.substring(end, textarea.size).match(/\*\*/g) != null // "**" on left and right
		&& textarea.value.substring(0, start).match(/\*\*/g).length % 2 == 1 // Iterations of "**" on the left are impairs
		&& selectionAnalysis(textarea.value.substring(start, end), "**")) // Nothing in the selection isn't under the style
			document.getElementById("bold").className = "active";
		else
			document.getElementById("bold").className = "";
	}
}

function selectionAnalysis (selection, style) { // Check if all the content on the selection is under a style
	boolSelect = true; // If boolSelect is false and the function find a letter, return false

	for(var i = 0; i < selection.length; i++) {
		if (selection[i] == style[0]) {
			i++;
			for (var j = 1; j < style.length; j++) {
				if (selection[i] == style[j]) {
					if (j == style.length -1) //We find the style in the selection
						boolSelect = !boolSelect; //Inverse the boolean
					else 
						i++; 
				}
				else 
					j == style.length; // Quit the loop
			}
		}
		else if (boolSelect == false && selection[i] != " ") // We find something in the selection who isn't under style's rule
			return false;
	}
	return true;
}

function bold () { //Make a normal selection bold and a bold selection normal
	if (document.getElementById("bold").className == "")
		markupModification("add", "**", textarea.selectionStart, textarea.selectionEnd);
	else
		markupModification("del", "**", textarea.selectionStart, textarea.selectionEnd);
	checkActiveButtons();
}

function markupModification (act, modif, startModif, endModif) { // Add style to the selection
	addStart = true, addEnd = true;

	// Exemple of weird selection : **|Hey,** how are **you?|**, the button is inactive but you have markups on the right and the left
	if (act == "add" 
	&& textarea.value.substring(0, startModif).match(/\*\*/g) != null && textarea.value.substring(endModif, textarea.value.length).match(/\*\*/g) != null
	&& textarea.value.substring(0, startModif).match(/\*\*/g).length % 2 == 1 && textarea.value.substring(endModif, textarea.value.length).match(/\*\*/g).length  % 2 == 1)
		weirdSelection = true;
	else 
		weirdSelection = false;
	console.log("Selection bizarre : "+weirdSelection);

	for (var i = startModif - 1; i >= 0; i--) { // The loop find if the last thing before the selection is what you want to add/delete for a clear textarea content
		if (textarea.value[i] == modif[modif.length - 1]) {
			for (var j = modif.length -1; j >= 0; j--) {
				if (textarea.value[i] != modif[j])
					i = 0;
				else if (j == 0 
					&& (weirdSelection == true
					|| (act == "add" && textarea.value.substring(0, startModif).match(/\*\*/g).length % 2 == 0)
					|| (act == "del" && textarea.value.substring(0, startModif).match(/\*\*/g).length  % 2 == 1))) {
						addStart = false;
						textarea.value = textarea.value.slice(0, i) + textarea.value.slice(startModif, textarea.value.length);
						endModif = i + (endModif - startModif);
						startModif = i;
						i = 0;
					}
				else 
					i--;
			}
		}
		else if (textarea.value[i] != " ")
			i = 0;
	}
	for (var i = endModif; i < textarea.value.length; i++) { // The loop find if the last thing before the selection is what you want to add/delete for a clear textarea content
		if (textarea.value[i] == modif[0]) {
			for (var j = 0; j < modif.length; j++) {
				if (textarea.value[i] != modif[j])
					i = textarea.value.length;
				else if (j == modif.length - 1 
					&& ( weirdSelection == true
					|| (act == "add" && textarea.value.substring(endModif, textarea.value.length).match(/\*\*/g).length  % 2 == 0)
					|| (act == "del" && textarea.value.substring(endModif, textarea.value.length).match(/\*\*/g).length  % 2 == 1))) {
						addEnd = false;
						textarea.value = textarea.value.slice(0, endModif) + textarea.value.slice(i + 2, textarea.value.length);
						i = textarea.value.length;
					}
				else 
					i++;
			}
		}
		else if (textarea.value[i] != " ")
			i = textarea.value.length;
	}	

	if (addStart == true || weirdSelection == true)
		beforeSelection = textarea.value.substring(0, startModif) + modif;
	else
		beforeSelection = textarea.value.substring(0, startModif);
	console.log("Debut de la selection : "+ afterSelection);
	if (addEnd == true || weirdSelection == true) 
		afterSelection = modif + textarea.value.substring(endModif, textarea.value.length);
	else 
		afterSelection = textarea.value.substring(endModif, textarea.value.length);
	console.log("Fin de la selection : "+ afterSelection);
	noMarkupsSelection = textarea.value.slice(startModif, endModif).replace(/\*\*/g, "");
	textarea.value = beforeSelection + noMarkupsSelection + afterSelection;

	if (addStart == true || weirdSelection == true)
		setSelectionRange(startModif + modif.length, startModif + noMarkupsSelection.length + modif.length);
	else
		setSelectionRange(startModif, startModif + noMarkupsSelection.length);
}

function setSelectionRange (selectionStart, selectionEnd) { // Set the focus at the good position
  	if (textarea.setSelectionRange) {
    	textarea.focus();
    	textarea.setSelectionRange(selectionStart, selectionEnd);
  	}
  	else if (textarea.createTextRange) {
	    var range = textarea.createTextRange();
	    range.collapse(true);
	    range.moveEnd('character', selectionEnd);
	    range.moveStart('character', selectionStart);
	    range.select();
  	}
}