/* Functions that handle D&D. */

/*
* Variables (in alphabetical order).
*/

var dragAndDropManager; // The manager launched onload.
var dragMessageAlreadyVisible = false; // True if the message about Drag and Drop is already visible.
var extensionsAllowed = new Array(".markdown", ".md", ".txt"); // Extensions allowed by Mado.
var filePath; // The path of the dragged file.

/*
* Functions (in alphabetical order).
*
* Resume:
	* counterSelection (): what counter to display.
	* displayCounter (): change charsDiv and wordsDiv.
	* resetCounter (): what to display if there is nothing in the contenteditable.
*/

function DnDManager(selector, onDropCallback) {
	var el_ = document.querySelector(selector);
	var overCount = 0;

	this.dragenter = function(e) {
		e.stopPropagation();
		e.preventDefault();
		overCount++;
		el_.classList.add('dropping');
	};

	this.dragover = function(e) {  
		if (! dragMessageAlreadyVisible) {
			console.log("Something is over me!");
			dragMessageAlreadyVisible = 1;
		}
		e.stopPropagation();
		e.preventDefault();
	};

	this.dragleave = function(e) {
		console.log("The sky is now blue.");
		dragMessageAlreadyVisible = 0;
		e.stopPropagation();
		e.preventDefault();
		if (--overCount <= 0) {
			el_.classList.remove('dropping');
			overCount = 0;
		}
	};

	this.drop = function(e) {
		console.log("The sky is now blue.");
		dragMessageAlreadyVisible = 0;
		e.stopPropagation();
		e.preventDefault();

		el_.classList.remove('dropping');

		onDropCallback(e.dataTransfer)
	};

	el_.addEventListener('dragenter', this.dragenter, false);
	el_.addEventListener('dragover', this.dragover, false);
	el_.addEventListener('dragleave', this.dragleave, false);
	el_.addEventListener('drop', this.drop, false);
};

function openDraggedFile (fileEntry) {
	filePath = fileEntry.fullPath;
	if (extensionsAllowed.indexOf(filePath.substring(filePath.lastIndexOf("."), filePath.length)) != -1)
		openFile(fileEntry); // app.js
}