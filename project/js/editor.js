/* Functions linked to the Markdown markdown. */

/* 
* Variables (in alphabetical order). 
	* Global.
	* For other JS.
*/

var conversionDiv; // The div who contains the HTML conversion.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var markdown; // The contenteditable where the user writes.
var tempConversion; // A string used to don't display errors when an image is loaded.

/* For other JS files. */
var endSelect; // End of the selection
var newStartSelect; // New start of the selection.
var newEndSelect; // New end of the selection.
var startSelect; // Start of the selection.

var fc;
var ec;
var range = document.createRange();
var sel;

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the contenteditable.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if (markdown.innerText.length > 0) { // There is Markdown in the contenteditable.
		if (editorSyntax == undefined) {
			chrome.storage.local.get("gfm",  function(mado) {
				if (mado["gfm"] != undefined)
					marked.setOptions({ gfm : mado["gfm"] });
				else {
					chrome.storage.local.set({ "gfm" : false });
					marked.setOptions({ gfm : false });
				}
				setEditorSyntax();
				marked(markdown.innerText, function (err, content) { // Marked.js makes the conversion.	    	
					/* Reset. */
			    	imagePosition = 0;
			    	for (var i = 0; i < imagesArray.length; i++) // Reset the images array.
			       		imagesArray[i][2] = false;

			       	tempConversion = content; 
			       	displayImages();      
			    });
			});	    
		}
		else {
			marked.setOptions({ gfm : editorSyntax });
			marked(markdown.innerText, function (err, content) {  	
		    	/* Reset. */
		    	imagePosition = 0;
		    	for (var i = 0; i < imagesArray.length; i++)
		       		imagesArray[i][2] = false;

		       	tempConversion = content;
		       	displayImages();      
		    });
		}
	}
	else {// No Markdown here.
		conversionDiv.innerHTML = "The HTML view.";
		// FIXME
		resetCounter();
		checkSaveState();
	}
}

function endOfConversion () {
	/* Reset. */
	imagePath = undefined;
	rightFile = undefined;

	for (var i = 0; i < imagesArray.length; i++) // Remove the images who are not used anymore.
		if (imagesArray[i][2] == false)
			imagesArray = imagesArray.splice(imagesArray[i], 1);

	tempConversion = tempConversion.replace(/<img src=\"img\/nofile.png/g, "<span class=\"nofile-link\"> <span class=\"nofile-visual\">File not found</span>&nbsp;</span><img class=\"nofile\" src=\"img/nofile.png");
	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		$(this).attr("target", "_blank");
	});

	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-link").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-visual").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function newSelection () {
	fc = markdown.firstChild;
	ec = markdown.lastChild;
	markdown.focus();
	range.setStart(fc, newStartSelect);
	range.setEnd(ec, newEndSelect);
	sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

function saveSelection() {
	console.log("Enregistre");
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
}

function setEditorSyntax () {
	chrome.storage.local.get("gfm",  function(mado) { 
		if (mado["gfm"] != undefined)
			editorSyntax = mado["gfm"]; 
		else {
			chrome.storage.local.set({ "gfm" : false });
			editorSyntax = false; 
		}
		conversion();
	});
}
