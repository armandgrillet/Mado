/* This document handles the online image insertion. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var onlineImageButton; // The "Web image" button.
var onlineImageBox; // The clickable zone of the Web image insertion tool.
var onlineImageDisplayer; // The div that displays or not the Web image insertion tool.
var onlineImageUrlInput; // The div that contains the image's url.
var onlineImageAltInput; // The div that contains the image's alt text.

/* Functions variable. */
var onlineImage; // The content that is added.

/*
* Functions (in alphabetical order).
*
* Resume:
	* applyOnlineImage (): what to do when the user press enter after setting the online image.
	* cancelOnlineImage (): what to do if the user press elsewhere the link container when he was adding an online image.
	* modifyOnlineImage (): enables the realtime modification of an online image.
	* loadOnlineImage (): get the external image with a request.
	* setOnlineImageInputs (): recognizes when the selected text is an image and set the inputs in consequence.
	* updateOnline(): apply the new URL of the external image. 
*/

function applyOnlineImage () {
	if (onlineImageUrlInput.value == "") { // An URL is obligatory
		onlineImageUrlInput.setAttribute("class", "tool-first-item flash");
		onlineImageUrlInput.focus();
		onlineImageUrlInput.setAttribute("class", "tool-first-item");
	} else {
		onlineImageDisplayer.className = "tool-displayer hidden";
		markdown.focus();
		$(markdown).setRange(startSelect, newEndSelect);
	}
}

function cancelOnlineImage () {
	markdown.value = markdown.value.substring(0, startSelect) + initialText + markdown.value.substring(newEndSelect, markdown.length);
	contentChanged();
	onlineImageDisplayer.className = "tool-displayer hidden";
	markdown.focus();
	$(markdown).setRange(startSelect, endSelect);
}

function modifyOnlineImage () {
	if (onlineImageAltInput.value == "") {
		onlineImage = "![" + onlineImageUrlInput.value + "](" + onlineImageUrlInput.value + ')';
	} else {
		onlineImage = "![" + onlineImageAltInput.value + "](" + onlineImageUrlInput.value + ')';
	}
	if (newEndSelect == undefined) {
		newEndSelect = endSelect;
	}
	markdown.value = markdown.value.substring(0, startSelect) + onlineImage + markdown.value.substring(newEndSelect, markdown.length);
	newEndSelect = (markdown.value.substring(0, startSelect) + onlineImage).length;
	contentChanged();
}

var loadOnlineImage = function(uri, callback) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		callback(window.URL.createObjectURL(xhr.response), uri);
	}
	xhr.open('GET', uri, true);
	xhr.send();
}

function setOnlineImageInputs () {
	initialText = markdown.value.substring(startSelect, endSelect);
	if (/!\[.*\]\(.*\)/.test(initialText) &&
		initialText[0] == '!' &&
		initialText[initialText.length - 1] == ')') {
		onlineImageAltInput.value = initialText.match(/!\[.*\]/)[0].substring(2, initialText.match(/!\[.*\]/)[0].length - 1);
		onlineImageUrlInput.value = initialText.match(/\(.*\)/)[0].substring(1, initialText.match(/\(.*\)/)[0].length - 1);
	} else {
		onlineImageAltInput.value = initialText;
	}
	$(markdown).setRange(startSelect, newEndSelect);
}

function updateOnline () {
	loadOnlineImage(imagePath, function(blob_uri, requested_uri) {
	  	tempConversion = tempConversion.replace(imagePath, blob_uri); 
	  	imagesArray.push([imagePath, blob_uri, true]); // Add a new line in the array of images.
		if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
	 		displayImages();
		} else { // The end.
	 		endOfConversion();
 		}
	}); 
}