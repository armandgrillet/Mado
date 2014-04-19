/* The JS to control the scripts between Mado and the computer. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var exportButton; // "Export" button.
var newButton; // "New" button.
var openButton; // "Open" button.
var printButton; // "Print" button.
var recentButton; // "Recent Files" button.
var saveButton; // "Save" button.
var saveAsButton; // "Save As" button.
var windowTitle; // Mado's active window's title attribute.

/* Functions variables. */
var fileEntry; // This is the variable who stores the file opened.
var lastMarkdownHeight = 0;
var truncated; // To know the size when something is saved.


/*
* Functions (in alphabetical order).
*
* Resume:
	* contentChanged(): what to do when the user changes something in Markdown div.
	* closeWindow(): what to do when the window is closed.
	* errorHandler (): what to do if the users tries to open a removed file.
	* exportFileHtml (): let the user export its file in HTML.
	* string fileName (entirePath): return a string who is just the name of the file manipulated (with the extension).
	* string minFileName (entirePath): return a string who is just the name of the file manipulated (without the extension).
	* moreWindow (moreChoice): open the correct window when the user clicks on an element of the "More" dropdown.
	* newDisplaySize (): what to do when the user changes the display size on the options.
	* newWindow (): open an empty new window, useful for many things (e.g. open a document when you have already something on the first windows's markdown).
	* openFile (theFile): all the scripts to open correctly a file, used when the user clicks on "Open" or when he clicks on a recent file.
	* openFileButton (): open a window to choose a file when the user clicks on "Open".
	* saveAsFile (): what to do when the user clicks on "Save As".
	* saveFile (): what to do when the user clicks on "Save", if the user haven't save its document yet, the function who's working is saveAsFile ().
	* int theMinWidth (): return the min width of a new window, it depends on the user's screen width.
*/

function contentChanged () {
	if (lastMarkdownHeight == 0)
		lastMarkdownHeight = markdown.scrollHeight;
	else if(lastMarkdownHeight < markdown.scrollHeight) {
		toTheBottom(); // scroll.js
	}

	conversion();
	if (markdown.clientHeight < markdown.scrollHeight)
        $(centerLine).css("display", "none");
    else
        $(centerLine).css("display", "block");
}

function errorHandler() {
	if (fileInLoading != undefined) {
		removeFile(fileInLoading);
		fileInLoading = undefined;
	}
}

function exportFileHTML () {
	marked(markdown.value, function (err, content) {
		chrome.fileSystem.chooseEntry(
			{
				type: "saveFile", 
				suggestedName: minFileName(nameDiv.innerHTML) + ".html"
			}, 
			function(exportedFile) {
				if (exportedFile) {
			 		exportedFile.createWriter(
			 			function(writer) {
			 				writer.write(
			 					new Blob(
			 						[content],
									{
										type: "text/HTML"
									}
								)
							); 	 	
			 			}, 
			 		errorHandler);
		 		}
			}
		);
	});
}

function fileName (path) {
	return path.substring(path.lastIndexOf('/') + 1); 
}

function minFileName (path) {
	if (path == "") // If there's nothing it returns the basic "document".
		return "document";
	else
		return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.')); 
}

function moreWindow (choice) {
	sendEvent("Window '" + choice + "' opened");
	chrome.app.window.create(
		choice, 
		{
		    bounds: {
		    	left: Math.round((window.screenX + (($(window).width() - 498) / 2))), // Perfect alignement.
		    	top: Math.round((window.screenY + (($(window).height() - 664) / 2))), // Always perfect.
		      	width: 498,
		      	height: 664
		    }, 
		    frame : "none",
		    // The window can't be resized.
		    minWidth: 498, 
		    minHeight: 664,
		    maxWidth: 498,
		    maxHeight: 664
	  	}
  	);
  	moreButton.click(); // Close the more dropdown.
}

function newDisplaySize () {
	chrome.storage.local.get("displaySize",  function(mado) {
		if (mado["displaySize"] != undefined) {
			if (mado["displaySize"] == "small")
				$("body").attr("class", "small");
			else {
				if (mado["displaySize"] == "medium")
					$("body").attr("class", " ");
				else
					$("body").attr("class", "big");	
			}
		}
		else {
			chrome.storage.local.set({ "displaySize" : "medium" });
			$("body").attr("class", " ");
		}
	});
}

function newWindow () {
	sendEvent("New file");
	if (markdown.value.length > 0 && markdown.value != firstMessage) {
		chrome.app.window.create(
			"mado.html", 
			{
			    bounds: {
			    	left: (window.screenX + 20), // "+ 20" to watch this is a new window.
			    	top: (window.screenY + 20), 
			      	width: window.innerWidth,
			      	height: window.innerHeight
			    }, 
			    frame: "none",
			    minWidth: theMinWidth(), 
				minHeight: 330
		  	}
	  	);
  	}
  	else if (markdown.value == firstMessage) {
  		markdown.value = "";
  		contentChanged();
  		$(markdown).focus();
  	}
}

function openFile(fileToOpen) {
	sendEvent("File opened");
	fileToOpen.file(
		function(file) {
	 		var reader = new FileReader();
	 		reader.onload = function(e) {
	 			if (markdown.value != "") {// Something is already in the markdown, Mado opens a new window. 
	 				chrome.storage.local.set(
		 				{
		 					"tempFileEntry" : chrome.fileSystem.retainEntry(fileToOpen)
		 				}, 
		 				newWindow
	 				);
 				}
	 			else {
		 			markdown.value = e.target.result; // Display the file content.	
	 			 			
		 			fileEntry = fileToOpen; // For save.

		 			// For the footer.
		 			markdownSaved = markdown.value;
		 			contentChanged();
		 			nameDiv.innerHTML = fileName(fileToOpen.fullPath) + "&nbsp;-";
		 			windowTitle.innerHTML = fileName(fileToOpen.fullPath) + " - Mado";
	 			}
		 		newRecentFile(fileToOpen); // Update the local storage, the file opened is now on top.						 	
	 		};
			reader.readAsText(file);
		},
		errorHandler
	);
}

function openFileButton () {		
    chrome.fileSystem.chooseEntry(
    	{
	 		type: "openFile",
	 		accepts:[
	 			{
	 				extensions: ["markdown", "md", "txt"]
	 			}
	 		] 
		}, 
		function(loadedFile) {
			if (loadedFile) 
				openFile(loadedFile);
		}
	);
}

function saveAsFile () {
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "document.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(function(fileWriter) {
				    truncated = false;
				    fileWriter.onwriteend = function(e) {
				        if (!truncated) {
				            truncated = true;
				            this.truncate(this.position);
				            return;
				        }
				        fileEntry = savedFile; // Save without asking the file.
				        newRecentFile(fileEntry); // Update the position of the file saved.

						// Footer
						markdownSaved = markdown.value;
						checkSaveState();
						nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;-";
		 				windowTitle.innerHTML = fileName(fileToOpen.fullPath) + " - Mado";
				    };
				    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
				}, errorHandler);
			}
		}
	);
}

function saveFile () {
	if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;-") // Not saved or not a Markdown file.
		saveAsFile();
	else { // If we have already loaded the file.
		fileEntry.createWriter(function(fileWriter) {
		    truncated = false;
		    fileWriter.onwriteend = function(e) {
		        if (!truncated) {
		            truncated = true;
		            this.truncate(this.position);
		            return;
		        }
		        newRecentFile(fileEntry); // Update the position of the file saved.

				// Footer
				markdownSaved = markdown.value;
				checkSaveState();
		    };
		    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
		}, errorHandler);
	}
}

function theMinWidth () {
	/* For the 0.2
	if (screen.width < 1600)
		return 683;
	else
		return 800;
	*/
	return 750;
}

/*
* Chrome methods.
*
* Resume:
	* chrome.storage.onChanged.addListener (): what to do when a chrome.storage.local variable is changed. 
*/

chrome.storage.onChanged.addListener(function (changes, namespace) { // What to do when a storage value is changed.
   	for (key in changes) {
   		if (key == "analytics")
            setTrackingPermission(); // stats.js 
        else if (key == "displaySize")
            newDisplaySize(); // app.js 
        else if (key == "gfm")
            setEditorSyntax(); // editor.js
    }
});
/* All the things to do the user clicks in a Mado's window. */

$(document).click( function(e) {
	/* help.js */
	if ($(e.target).closest(helpButton).length && 
		helpDisplayer.className == "tool-displayer hidden") { // Click on the help button with the help input hide.
		helpDisplayer.className = "tool-displayer";
    	help.focus();
	}
	else if (helpDisplayer.className != "tool-displayer hidden" &&
		! $(e.target).closest(help).length && 
		! $(e.target).closest(resultsContainer).length) { // The user doesn't click on the help input nor help results (with help displayed)
		help.value = ""; // Reset the input of the help
		resetAnswerDiv(1);
		resultsContainer.className = "hidden"; // Hide the results container
		helpDisplayer.className = "tool-displayer hidden";
	}

	/* image.js */
	if ($(e.target).closest(imageButton).length && imageDisplayer.className == "tool-displayer hidden") {
		/* Reset. */
		imageBrowser.innerHTML = "Choose an image";
		altInput.value = "";
		initialText = markdown.value;
		imageLoaded = undefined;

		imageDisplayer.className = "tool-displayer";
		if (markdown.selectionStart != markdown.selectionEnd
			|| $(markdown).is(':focus')) {
			startSelect = markdown.selectionStart;
			endSelect = markdown.selectionEnd;
		}
		else {
			startSelect = markdown.value.length;
			endSelect = markdown.value.length;
		}
		if (startSelect != endSelect)
			markdown.setSelectionRange(startSelect, endSelect);
		newEndSelect = endSelect;
		setImageInputs();
	}
	else if (imageDisplayer.className == "tool-displayer" && (! $(e.target).closest(imageBox).length || $(e.target).closest(document.getElementById("insert-image")).length)) {// The user doesn't click on the image insertion box.
		if ($(e.target).closest(document.getElementById("insert-image")).length)
			applyImage();
		else
			imageDisplayer.className = "tool-displayer hidden";
	}

	/* link.js */
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";
		initialText = markdown.value;
		
		linkDisplayer.className = "tool-displayer";
		if (markdown.selectionStart != markdown.selectionEnd
			|| $(markdown).is(':focus')) {
			startSelect = markdown.selectionStart;
			endSelect = markdown.selectionEnd;
		}
		else {
			startSelect = markdown.value.length;
			endSelect = markdown.value.length;
		}
		if (startSelect != endSelect)
			markdown.setSelectionRange(startSelect, endSelect);
		newEndSelect = endSelect;
		setLinkInputs();
		urlInput.focus();		
	}
	else if (linkDisplayer.className == "tool-displayer" && (! $(e.target).closest(linkDisplayer).length || $(e.target).closest(document.getElementById("insert-link")).length)) {	
		if ($(e.target).closest(document.getElementById("insert-link")).length)
			applyLink();
		else
			linkDisplayer.className = "tool-displayer hidden";
	}

	/* more.js */
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (moreDisplayer.className != "hidden" && ! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";

	/* online-image.js */
	if ($(e.target).closest(onlineImageButton).length && onlineImageDisplayer.className == "tool-displayer hidden") {
		onlineImageDisplayer.className = "tool-displayer";
		/* Reset. */
		onlineImageUrlInput.value = "";
		onlineImageAltInput.value = "";
		initialText = markdown.value;
		
		onlineImageDisplayer.className = "tool-displayer";
		if (markdown.selectionStart != markdown.selectionEnd
			|| $(markdown).is(':focus')) {
			startSelect = markdown.selectionStart;
			endSelect = markdown.selectionEnd;
		}
		else {
			startSelect = markdown.value.length;
			endSelect = markdown.value.length;
		}
		if (startSelect != endSelect)
			markdown.setSelectionRange(startSelect, endSelect);
		newEndSelect = endSelect;
		setOnlineImageInputs();
		onlineImageUrlInput.focus();
	}
	else if (onlineImageDisplayer.className == "tool-displayer" && (! $(e.target).closest(onlineImageDisplayer).length || $(e.target).closest(document.getElementById("insert-webimage")).length)) {// The user doesn't click on the image insertion box.
		if ($(e.target).closest(document.getElementById("insert-webimage")).length)
			applyOnlineImage();
		else
			onlineImageDisplayer.className = "tool-displayer hidden";
	}
	
	/* recentfiles.js */
	if ($(e.target).closest(recentButton).length && recentFilesDisplayer.className == "hidden") {
		displayRecentFiles(); // If the user remove something from another window.
		recentFilesDisplayer.className = "";
	}
	else if (recentFilesDisplayer.className != "hidden" && ! $(e.target).closest(recentFilesContainer).length)
		recentFilesDisplayer.className = "hidden";

	/* styles.js */
	if ($(e.target).closest(stylesButton).length && stylesDisplayer.className == "tool-displayer hidden") {
		stylesDisplayer.className = "tool-displayer";
	}
	else if (stylesDisplayer.className != "tool-displayer hidden" && ! $(e.target).closest(stylesDisplayer).length)
		stylesDisplayer.className = "tool-displayer hidden";

	/* window.js */
	if (closeDisplayer.className == "visible" && ( // The close displayer is visible.
			! $(e.target).closest(windowCloseContainer).length ||  // The click is not on something in the closeDisplayer (closeButton included).
			$(e.target).closest(cancelCloseButton).length // The click is on the "Cancel" button.
			)
		)
		closeDisplayer.className = "hidden";
});

/* Functions that handle D&D. */

/*
* Variables (in alphabetical order).
*/

var documentSection; // The section named "document" in the HTML.
var dragAndDropManager; // The manager launched onload.
var dragMessageAlreadyVisible = false; // True if the message about Drag and Drop is already visible.
var extensionsAllowed = [".markdown", ".md", ".txt"]; // Extensions allowed by Mado.
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
			documentSection.className = "dragging";
			dragMessageAlreadyVisible = 1;
		}
		e.stopPropagation();
		e.preventDefault();
	};

	this.dragleave = function(e) {
		documentSection.removeAttribute("class");
		dragMessageAlreadyVisible = 0;
		e.stopPropagation();
		e.preventDefault();
		if (--overCount <= 0) {
			el_.classList.remove('dropping');
			overCount = 0;
		}
	};

	this.drop = function(e) {
		documentSection.removeAttribute("class");
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
/* Functions linked to the Markdown editor. */

/* 
* Variables (in alphabetical order). 
	* Shortcuts.
	* Global.
*/

/* HTML shortcuts. */
var centerLine; // The line that separates Markdown and HTML views.
var conversionDiv; // The div who contains the HTML conversion.
var markdown; // The textarea where the user writes.
var pasteZone; // The textarea used when the user pastes content.

/* Global. */
var closeDiv; // The end of the div.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var firstMessage = "# Dear user,\n\nThanks for installing **Mado**. For your first launch, here is some information:\n\n* Mado handles .md, .markdown and .txt files, can save these files as .md (the official extension for MarkDown files) and offers an export in .html.\n* You can click the number of words in the bottom-right corner to see the number of characters in your document (and *vice versa*). Click the eye icon next to it to change the style of the HTML view.\n* Mado uses Google Analytics to know in real time how many users are currently running the app, for statistical analysis only. You can deactivate it anytime in the settings (top-right button, “Settings” section).\n* See the keyboard shortcuts (top-right button, “Shortcuts” section) to use Mado in depth.\n\nWe hope you will enjoy Mado,\n\n**[A+A](https://twitter.com/AplusA_io)**\n\n***\n\nP.S. This message will not appear anymore. Click “New” in the navbar to start using Mado."
var initialText; // A save used when the user cancel a link/image.
var newCE; // The new textarea content (temporary).
var openDiv; // The beginning of the div.
var optiMarkdown; // The new Markdown, without useless div.
var tempConversion; // A string used to don't display errors when an image is loaded.
var tempMarkdown; // String used to modify the markdown innerHTML.

var starSelect;
var endSelect;
var newEndSelect;
var newRange;

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the textarea.
	* changeContentHighlighted (id): Add a div with id @param id around the selection. 
	* checkDiv (divCount, content, pos, id): Remove a div from content, @return if it has working and the new content.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* removeDivWithId (id): Remove a div from content via chechDiv (divCount, content, pos, id), use RegExp for strength.
	* restoreSelection (id): Restore the previous elements selected by the user.	
	* selectElementContents(el) : Do weird things with HTML to re-set the selection.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if (markdown.value.length > 0) { // There is Markdown in the textarea.
		if (editorSyntax == undefined) {
			chrome.storage.local.get("gfm",  function(mado) {
				if (mado["gfm"] != undefined)
					marked.setOptions({ gfm : mado["gfm"] });
				else {
					chrome.storage.local.set({ "gfm" : true });
					marked.setOptions({ gfm : true });
				}
				setEditorSyntax();
			});	    
		}
		else
			marked.setOptions({ gfm : editorSyntax });

		marked(markdown.value, function (err, content) {  
	    	/* Reset. */
	    	imagePosition = 0;
	    	for (var i = 0; i < imagesArray.length; i++)
	       		imagesArray[i][2] = false;

	       	tempConversion = content;
	       	displayImages();    
	    });
	}
	else { // No Markdown here.
		conversionDiv.innerHTML = "See the result here";
		resetCounter();
		checkSaveState();
	}
}

function checkDiv (divCount, content, pos, id) {
	openDiv = content.indexOf("<div", pos);
	closeDiv = content.indexOf("</div>", pos);

	if (closeDiv != -1) { // If we find a "<div>" or a "</div>".
		if (openDiv != -1 && openDiv < closeDiv) // If <div is here first.
			return (checkDiv(divCount + 1, content, openDiv + 5, id)); // Recursivity.
		else { // If </div> is here first.
			if (divCount == 1) { // If we have the same ammount of "<div>" and "</div>".
				newCE = content.substring(0, content.indexOf("<div id=\"" + id + "\">")); 
				newCE += content.substring(content.indexOf("<div id=\"" + id + "\">") + ("<div id=\"" + id + "\">").length, closeDiv); 
				newCE += content.substring(closeDiv + 6); // Return the text without the useless "<div>" and "</div".
				return [0, newCE];
			}
			else
				return(checkDiv(divCount - 1, content, closeDiv + 6, id)); // Recursivity.
		}
	}
	else
		return [-1]; // Don't remove the brackets.
}

function endOfConversion () {
	/* Reset. */
	imagePath = undefined;
	rightFile = undefined;

	for (var i = 0; i < imagesArray.length; i++) // Remove the images that are not used anymore.
		if (imagesArray[i][2] == false)
			imagesArray = imagesArray.splice(imagesArray[i], 1);

	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		if ($(this).attr("href").substring(0,1) != '#' && $(this).attr("href").substring(0,4) != "http") // External link without correct syntax.
			$(this).attr("href", "http://" + $(this).attr("href"));
		$(this).attr("target", "_blank");
	});

	$("#html-conversion .nofile, #html-conversion .nofile-link, #html-conversion .nofile-visual").on("click", chooseGalleries); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function setEditorSyntax () {
    chrome.storage.local.get("gfm",  function(mado) { 
        if (mado["gfm"] != undefined)
                editorSyntax = mado["gfm"]; 
        else {
                chrome.storage.local.set({ "gfm" : true });
                editorSyntax = true; 
        }
        contentChanged();
    });
}

$.fn.setRange = function (start, end) { 
    if (!end) 
    	end = start; 
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            newRange = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

/* Functions that handle Mado's footer. */

/*
* Variables (in alphabetical order).
*/

var charsDiv; // The div that contains the document's chars number.
var linkUrlSpan; // The div that displays the href when a user is overing a link.
var nameDiv; // The div that contains the name of the opened document.
var wordsDiv; // The div that contains the document's words number.

/*
* Functions (in alphabetical order).
*
* Resume:
	* counterSelection (): what counter to display.
	* displayCounter (): change charsDiv and wordsDiv.
	* resetCounter (): what to display if there is nothing in the contenteditable.
*/


function counterSelection () {
	if (charsDiv.style.display == "none") {
		$(charsDiv).css("display", "inline");
		$(wordsDiv).css("display", "none");
		sendEvent("Number of chars diplayed");
	}
	else {
		$(charsDiv).css("display", "none");
		$(wordsDiv).css("display", "inline");
		sendEvent("Number of words diplayed");
	}
}

function displayCounter (counter) {
	charsDiv.innerHTML = "&nbsp;" + counter.characters + " characters&nbsp;";
  	wordsDiv.innerHTML = "&nbsp;" + counter.words + " words&nbsp;";
  	if (counter.characters == 1)
  		charsDiv.innerHTML = "&nbsp;" + counter.characters + " character&nbsp;";
  	if (counter.words == 1)
		wordsDiv.innerHTML = "&nbsp;" + counter.words + " word&nbsp;";
}

function resetCounter () {
	charsDiv.innerHTML = "&nbsp;0 characters&nbsp;";
  	wordsDiv.innerHTML = "&nbsp;0 words&nbsp;";
}
/* The JS to help the user when he types something on the help input. */

/*
* Variables (in alphabetical order):
	* Everything except arrays.
	* Arrays.
*/

var answersContainer; // The div who contains the answers displayed.
var help; // The input where the user writes what he wants.
var helpButton; // The help button.
var helpDisplayer; // The div who contains all the help divs.
var maxAnswers; // Check the number of answers displayed, max = 3.
var resultsContainer; // Will contain the HTML results container.
var wordPos; // Shortcut for "words[i][j].toLowerCase().indexOf(help.value.toLowerCase());".

var helpArray = [
	[
		["Headers", "Titles"],
		"Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6).",
		"Six sizes available, the size depends on the numbers of #.<h1 id=\"big-title-size-1-the-biggest-\">Big title (size 1, the biggest).</h1><h4 id=\"a-less-impresive-title-size-4-on-6-br-\">A less impresive title (size 4 on 6).</h4>"
	],
	[
		["Bold", "Strong emphasis"],
		"<span class=\"help-code\">**bold**</span> or <span class=\"help-code\">__bold__</span>",
		"<strong>Bold</strong>"
	],
	[
		["Italic", "Emphasis"],
		"<span class=\"help-code\">*italic*</span> or <span class=\"help-code\">_italic_</span>",
		"<em>Italic</em>"
	],
	[
		["Bold italic", "Combined emphasis"],
		"<span class=\"help-code\">**_ bold italic_**</span> or <span class=\"help-code\">*__bold italic__*</span> or <span class=\"help-code\">***this***</span> or <span class=\"help-code\">___this___</span>",
		"<strong><em>Bold italic</em></strong>"
	],
	[
		["Ordered lists"],
		"1. First ordered list item. <br>2. Another item.",
		"<ol><li>First ordered list item</li><li>Another item.</li></ol>"
	],
	[
		["Unordered lists"],
		"* An item. <br>* A second item (you can also use + or -).",
		"<ul><li>An item. </li><li>A second item (you can also use + or -).</li></ul>"
	],
	[
		["Inline-style links"],
		"<span class=\"help-code\">[Hypertext](http://aplusa.io/mado)</span><br>(Can be used to create an anchor.)",
		"<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"
	],
	[
		["Reference-style links"],
		"<span class=\"help-code\">[Hypertext][1]<br>[1]: http://aplusa.io/mado</span>",
		"<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"
	],
	[
		["Images (inline)", "Pictures (inline)"],
		"<span class=\"help-code\">![alt text](path/to/image.jpg \"Title\")</span>",
		"<div class=\"example-image\"></div>"
	],
	[
		["Images (reference-style)", "Pictures (reference-style)"],
		"<span class=\"help-code\">![alt text][image Id] <br> [image Id]: path/to/image.jpg \"Title\"</span>",
		"<div class=\"example-image\"></div>"
	],
	[
		["Blocks of code"],
		"<span class=\"help-code\">```Text between three back-ticks is a block of code.```<br>&nbsp;&nbsp;&nbsp;&nbsp;Text after four spaces is also a block of code.</span>",
		"<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"
	],
	[
		["Blockquotes"],
		"> Blockquotes only need <span class=\"help-code\">></span> to work. <br><br> <span class=\"help-code\">> Two blockquotes without a break (a line who isn't a blockquote)  are a single quote.</span>",
		"<blockquote>Blockquotes only need &gt; to work. To separate two blockquotes, insert a blank line between them.</blockquote>"
	],
	[
		["Inline HTML", "HTML in Markdown"],
		"<span class=\"help-code\">It &lt;strong>works&lt;/strong>.</span>",
		"It <strong>works<strong>"
	],
	[
		["Horizontal rules"],
		"<span class=\"help-code\">*** <br> You can use Hyphens, asterisks or underscores. <br> ---</span>",
		"<hr> You can use Hyphens, asterisks or underscores.<hr>"
	],
	[
		["Line breaks"],
		"To separate two paragraphs, press <span class=\"help-code\">Enter</span> twice.<br><br>And you have a new paragraph.",
		"<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"
	],
	[
		["Tables", "Arrays"],
		"| Tables&nbsp; | Are&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Cool&nbsp;&nbsp;|<br>| -------- |:----------------:| ------:|<br>| col 3 is | right-aligned | $13 &nbsp;&nbsp; |<br>| col 2 is | centered&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | $37 &nbsp;&nbsp; |",
		"<table> <thead><tr> <th>Tables</th> <th align=\"center\">Are</th> <th align=\"right\">Cool</th> </tr></thead> <tbody> <tr> <td>col 3 is</td> <td align=\"center\">right-aligned</td> <td align=\"right\">$13</td> </tr> <tr> <td>col 2 is</td> <td align=\"center\">centered</td> <td align=\"right\">$37</td> </tr> </tbody> </table>"
	],
	[
		["Question"],
		"Seriously?",
		"Life's most persistent and urgent question is, 'What are you doing for others?'."
	]
];

/*
* Functions (in alphabetical order).
*
* Resume:
	* answer (): find the answers and the examples for the question.
	* displayAnswers (): display the answers.
	* resetAnswerDiv (): clear the Help divs.
	* setResultsHeight (number of results): set the help container's height, depending on the number of results.
	* switchResult (result number): show the answer or the example when the user click on a switch.
*/

function answer () {
	maxAnswers = 0; // Reset the number of answers that can be diplayed (max: 3)
	for (var i = 0; i < helpArray.length && maxAnswers < 3; i++) // A line = a syntax, this loop runs through each line.
		for (var j = 0; j < helpArray[i][0].length; j++) // A line can have many columns (different ways to say the same thing), this loop run through each column.
			if (helpArray[i][0][j].toLowerCase().indexOf(help.value.toLowerCase()) > -1) { // Everything in lower case to help the condition.
				wordPos = helpArray[i][0][j].toLowerCase().indexOf(help.value.toLowerCase());
				document.getElementById("answer-" + (maxAnswers + 1)).innerHTML = "<h1 class=\"help-title\">" + helpArray[i][0][j].substring(0, wordPos) + "<span class=\"match\">" + helpArray[i][0][j].substr(wordPos, help.value.length) + "</span>" + helpArray[i][0][j].substring(wordPos + help.value.length) + "</h1>" + helpArray[i][1]; // Put the answer in the appropriate div.
				document.getElementById("example-" + (maxAnswers + 1)).innerHTML = helpArray[i][2]; // Put the answer in the appropriate div.
				maxAnswers++; // You can't have more than 3 answers.
				j = helpArray[i][0].length; // Change the line (to don't have 2 times the same answer).
			}
	switch (maxAnswers) {
		case 0: // Nothing found.
			document.getElementById("answer-1").innerHTML = "No help found.";
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2); // This is 2 and not 1 to display the result "No help found."
			break;
		case 1: // One answer found.
			resultsContainer.className = "one-result";
			resetAnswerDiv(2);
			break;
		case 2: // Two answers found.
			resultsContainer.className = "two-results";
			resetAnswerDiv(3);
			break;
		case 3: // Three answers found, maximum number possible at the same time.
			resultsContainer.className = "three-results";
			break;
	}
}

function displayAnswers () {
	for (var i = 1; i <= 3; i++) // Reset the results' position.
		if (document.getElementById("result-" + i).className == "result switched")
			document.getElementById("result-" + i).className = "result";

	if (help.value.length == 0) {
		resultsContainer.className = "hidden"; // Hide the results container, there is nothing in it if there is nothing written in the help input.
		resetAnswerDiv(3);
		setResultsHeight();	
	}
	else {
		if (help.value.length < 3) {
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2);
			if (help.value.length == 1)
				document.getElementById("answer-1").innerHTML = "Add two more characters"; // The input has to have 3 characters minimum to launch the function.
			else if (help.value.length == 2)
				document.getElementById("answer-1").innerHTML = "Add one more character"; // The input has to have 3 characters minimum to launch the function.

			setResultsHeight();
		}
		else
			answer(); // Find the answers.
	}
}

function resetAnswerDiv(begin) {
	for (var i = begin; i <= 3; i++) { 
		if (document.getElementById("answer-" + i).innerHTML == "")
			i = 3;
		else {
			document.getElementById("answer-" + i).innerHTML = "";
			document.getElementById("result-" + i).className = "result";
			document.getElementById("example-" + i).innerHTML = "";
		}
	}
}

function setResultsHeight() {
	var totalHeight = 0;
	for (var i = 1; i <= 3; i++) {// Check all the results, depending on the number of results
		if ($("#answer-" + i).html() != "") {
			$("#result-" + i).css("display", "block");
			if ($("#answer-" + i).outerHeight() >= $("#example-" + i).outerHeight()) 
				$("#result-" + i).css("height", $("#answer-" + i).outerHeight() + "px");
			else
				$("#result-" + i).css("height", $("#example-" + i).outerHeight() + "px");
			totalHeight += $("#result-" + i).outerHeight(); // Add the height of the current result to the total height
		}
		else {
			$("#result-" + i).css("height", 0);
			$("#result-" + i).css("display", "none");
		}
		
	}
	$(resultsContainer).css("height", totalHeight + "px");

}

function switchResult (numResult) {
	if (document.getElementById("result-" + numResult).className == "result") // If Markdown style displayed
		document.getElementById("result-" + numResult).className = "result switched";
	else // If corresponding example displayed
		document.getElementById("result-" + numResult).className = "result";
	help.focus();
}
/* This document handles the image insertion. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var altInput; // The input for the alternative text.
var cancelImageButton; // The "Cancel" button.
var galleriesButton; // The "Galleries" button.
var imageButton; // The "Image" button.
var imageBox; // The clickable zone of the image insertion tool.
var imageBrowser; // The button to choose an image.
var imageDisplayer; // The div that displays or not the image insertion tool.
var imageDiv; // The div with id="mado-image".

/* Functions variables. 
* startSelect, endSelect, newStarSelect, newEndSelect are created in link.js.
*/

var currentGallery; // Used when the code is searching an image to know where it is.
var galleriesList = []; // List who contains the galleries.
var image; // The content who is added.
var imageLoaded; // The path of the image selected.
var imagePath; // The path of the image.
var imagePosition = 0; // Used to don't keep on the same part of the document.
var imagesArray = []; // All the images on the file.
var imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
var rightFile; // If false the JS is looking for an image.
var researching; // If we're searching an image.
var imagePathsArray = [];
var imagePositionInArray;

/*
* Functions (in alphabetical order).
*
* Resume:
	* applyImage (): what to do when the user press enter after choosing an image.
	* cancelImage (): what to do if the user press elsewhere the image container when he was adding an image.
	* chooseGalleries (): open a pop-up to let the user chooses his galleries.
	* chromeUpdate (newGalleries): set the galleries to be used in getImages().
	* displayImages (): find the images on the document and display the correct corresponding data.
	* fileNotFound (): what to do if Mado doesn't find the image.
	* galleryAnalysis (theGallery): open a gallery and launch the search.
	* getImage (theCorrectImage): what to do when the image is find on the user's PC.
	* getImages (): search the image in the gallery.
	* loadImage (): let the user choose an image when he clicks on the button.
	* loadOnlineImage (): get the external image with a request.
	* modifyImage (): enables the realtime modification of an image.
	* setBrowserText (imagePath): set the text in the button with the image's path.
	* setImageInputs (): recognizes when the selected text is an image and set the inputs in consequence.
	* update (): update the list of folders and analyse the files in folders.
	* updateOnline(): apply the new URL of the external image. 
*/

function applyImage () {
	if (altInput.value == "") { // An alternative input is obligatory
		altInput.setAttribute("class", "flash");
		altInput.focus();
		altInput.removeAttribute("class");
	}
	else if (imageLoaded != undefined){ // An image is obligatory
		imageDisplayer.className = "tool-displayer hidden";
		markdown.focus();
		$(markdown).setRange(startSelect, newEndSelect);
	}
}

function cancelImage () {
	markdown.value = markdown.value.substring(0, startSelect) + initialText + markdown.value.substring(newEndSelect, markdown.length);
	contentChanged();
	imageDisplayer.className = "tool-displayer hidden";	
	markdown.focus();
	$(markdown).setRange(startSelect, endSelect);
}

function chooseGalleries () {
	chrome.mediaGalleries.getMediaFileSystems({ interactive : 'yes' }, update); // Let the user chooses his folders.
}

function chromeUpdate (results) { 
	galleriesList = results; 
	galleryAnalysis(0);
}

function displayImages () {
	if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
		imagePosition = tempConversion.indexOf("<img src=\"", imagePosition) + 10;
		researching = false;
		imagePath = tempConversion.substring(imagePosition, tempConversion.indexOf("\"", imagePosition));
		imagePathsArray.length = 0; // Reset
	   	for(var i = 0; i < imagesArray.length; i++) { // Put all the names 
	      	imagePathsArray.push(imagesArray[i][0]);
	   	}
	   	imagePositionInArray = imagePathsArray.indexOf(imagePath);

		if (imgFormats.indexOf(imagePath.substr(imagePath.lastIndexOf('.') + 1).toLowerCase()) > -1) {		
			if (imagePath.substring(0, 7) == "http://" || imagePath.substring(0, 8) == "https://") {
				if (navigator.onLine) {
					if (imagePositionInArray > -1) { // Image is already stored.
						tempConversion = tempConversion.substring(0, imagePosition) + imagesArray[imagePositionInArray][1] + tempConversion.substring(imagePosition + imagePath.length); // Replace the path.	
		    			imagesArray[imagePositionInArray][2] = true; // The file has been used.	
					}
					else { // The array doesn't exist yet.
						researching	= true;
						updateOnline(imagePath); // Get the ID of the file.   	
					}
				}
				else
					tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">Internet not available</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nointernet.png 1x, img/nointernet@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);			
	        }
	        else if (imagePath.substring(0, 5) != "data:" && imagePath.substring(0, 5) != "blob:") { // Not already translated
				if (imagePositionInArray > -1) { // Image is already stored.
					tempConversion = tempConversion.substring(0, imagePosition) + imagesArray[imagePositionInArray][1] + tempConversion.substring(imagePosition + imagePath.length); // Replace the path.	
	    			imagesArray[imagePositionInArray][2] = true; // The file has been used.
	        	}
				else { // The image is not in the array.
					researching	= true;
					rightFile = false;
					update(); // Get the ID of the file.
				}
			}
			if (! researching) // We're not searching an image in the PC or the web.
				displayImages();
		}
		else if (imagePath.substring(0, 5) != "data:" && imagePath.substring(0, 5) != "blob:") {
			tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">This is not an image</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/notimage.png 1x, img/notimage@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);;
			displayImages();
		}
	}
	else
		endOfConversion();
}

function fileNotFound () {
	tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + fileName(imagePath.replace(/\\/g, "/")) +" not found</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nofile.png 1x, img/nofile@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);
	if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) 
 		displayImages();
 	else // The end.
 		endOfConversion();
}

function galleryAnalysis (index) {
	if (rightFile == false) {
		if (index < galleriesList.length) {
			currentGallery = index;
			galleriesList.forEach(
				function(item, indx, arr) { // For each gallery.
		     		if (indx == index && imagePath != undefined && rightFile == false) // If we're looking for a file.  
		     			item.root.createReader().readEntries(getImages); // Get the images of the folder.
		  		}
			)
		}
		else
			fileNotFound();
	}
	else {
		imagesArray.length = 0;
		modifyImage();
	}
}

function getImage (entryPath) {
	galleriesList[currentGallery].root.getFile(entryPath, {create: false}, function(fileEntry) { // Time to get the ID of the file.
		fileEntry.file(function(theFile) {
			var reader = new FileReader();
          	reader.onloadend = function(e) { // We have the file (.result).
          		imagesArray.push([imagePath, this.result, true]); // Add a new line.
          		tempConversion = tempConversion.substring(0, imagePosition) + this.result + tempConversion.substring(imagePosition + imagePath.length); // Replace the path.	
             	rightFile = true;
             	if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) 
             		displayImages();
             	else // The end.
             		endOfConversion();       	
          	};
          	reader.readAsDataURL(theFile);                 	
		});
	}); 	
}

function getImages (entries) {
	for (var i = 0; i < entries.length && rightFile == false; i++) { // All the files in the repository, the correct file is not found yet.
		if (entries[i].isDirectory && imagePath.indexOf(entries[i].fullPath) != -1) {// If the file is a directory and the right directory.
			entries[i].createReader().readEntries(getImages); // Recursivity.
			break;
		}
		else if (imagePath.indexOf(entries[i].fullPath) != -1) {// It's the correct image!
			getImage(entries[i].fullPath);
			break; 			
		}
		else if (i == (entries.length - 1)) // End of the gallery.
			galleryAnalysis(currentGallery + 1);
	}
}

function loadImage () {	
    chrome.fileSystem.chooseEntry(
		{
	 		type: "openFile",
	 		accepts:[{ mimeTypes: ["image/*"] }] 
		}, 
		function(loadedImage) {
			if (loadedImage) {			    
				chrome.fileSystem.getDisplayPath(loadedImage, function(path) {
					setImageBrowserText(fileName(path.replace(/\\/g, "/")));				
					imageLoaded = path.replace(/\\/g, "/");
					modifyImage();
					altInput.focus();
				});
			}
		}
	);
}

function modifyImage () {
	image = "![" + altInput.value + "](" + imageLoaded + ')';
	if (imageDiv != undefined)
		imageDiv.innerText = image;		
	else
		$(markdown).innerText = $(markdown).innerText + image;	
	if (newEndSelect == undefined)
		newEndSelect = endSelect;	
	markdown.value = markdown.value.substring(0, startSelect) + image + markdown.value.substring(newEndSelect, markdown.length);
	newEndSelect = (markdown.value.substring(0, startSelect) + image).length;
	contentChanged();
}

function setImageBrowserText (path) {
	imageBrowser.innerHTML = path;
	if (imageBrowser.innerHTML.length > 15) // Too long to be beautiful.
		imageBrowser.innerHTML = imageBrowser.innerHTML.substring(0, 6) + "(…)" + imageBrowser.innerHTML.substring(imageBrowser.innerHTML.length - 6, imageBrowser.innerHTML.length);
}

function setImageInputs () {
	initialText = markdown.value.substring(startSelect, endSelect);
	if (/!\[.*\]\(.*\)/.test(initialText) &&
		initialText[0] == '!' &&
		initialText[initialText.length - 1] == ')') {
		if (/!\[.*\]\(.*\s+".*"\)/.test(initialText)) // Optional title is here.
			imageLoaded = initialText.match(/\(.*\)/)[0].substring(2, initialText.match(/\(.*\s+"/)[0].length - 2).replace(/\\/g, "/");
		else
			imageLoaded = initialText.match(/\(.*\)/)[0].substring(2, initialText.match(/\(.*\)/)[0].length - 1).replace(/\\/g, "/");
		setImageBrowserText(fileName(imageLoaded));
		altInput.value = initialText.match(/!\[.+\]/)[0].substring(2, initialText.match(/!\[.+\]/)[0].length - 1); 
	}
	else
		altInput.value = initialText;
	$(markdown).setRange(startSelect, newEndSelect);
}

function update () {	
	chrome.mediaGalleries.getMediaFileSystems({ interactive : "no" }, chromeUpdate);
}
/* Set how the link div has to work */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
*/

/* HTML shortcuts. */
var cancelLinkButton; // The "Cancel" button.
var hypertextInput; // The div that contains the hypertext.
var link; // The content that is added.
var linkButton; // The "Link" button.
var linkDisplayer; // The div that contains all the link divs.
var urlInput; // The div that contains the url.
var linkDiv; // The div with id="mado-link".

/*
* Function.
*
* Resume:
	* applyLink (): what to do when the user press enter after setting the link.
	* cancelLink (): what to do if the user press elsewhere the link container when he was adding a link.
	* modifyLink (): enables the realtime modification of a link.
	* setLinkInputs (): recognizes when the selected text is a link and set the inputs in consequence.
*/

function applyLink () {
	if (urlInput.value == "") {
		urlInput.setAttribute("class", "tool-first-item flash");
		urlInput.focus();
		urlInput.setAttribute("class", "tool-first-item");
	}
	else {
		linkDisplayer.className = "tool-displayer hidden";
		markdown.focus();
		$(markdown).setRange(startSelect, newEndSelect);
	}
}

function cancelLink () {
	markdown.value = markdown.value.substring(0, startSelect) + initialText + markdown.value.substring(newEndSelect, markdown.length);
	contentChanged();
	linkDisplayer.className = "tool-displayer hidden";	
	markdown.focus();
	$(markdown).setRange(startSelect, endSelect);
}

function modifyLink () {
	if (hypertextInput.value == "")
		link = '[' + urlInput.value + "](" + urlInput.value + ')';
	else 
		link = '[' + hypertextInput.value + "](" + urlInput.value + ')';
	if (newEndSelect == undefined)
		newEndSelect = endSelect;
	markdown.value = markdown.value.substring(0, startSelect) + link + markdown.value.substring(newEndSelect, markdown.length);
	newEndSelect = (markdown.value.substring(0, startSelect) + link).length;
	contentChanged();
}

function setLinkInputs () {
	initialText = markdown.value.substring(startSelect, endSelect);
	if (/\[.*\]\(.*\)/.test(initialText) &&
		initialText[0] == '[' &&
		initialText[initialText.length - 1] == ')') {
		hypertextInput.value = initialText.match(/\[.*\]/)[0].substring(1, initialText.match(/\[.*\]/)[0].length - 1);
		urlInput.value = initialText.match(/\(.*\)/)[0].substring(1, initialText.match(/\(.*\)/)[0].length - 1);
	}
	else
		hypertextInput.value = initialText;
	$(markdown).setRange(startSelect, newEndSelect);
}
/* This document handles the "More" button and his behavior. */

/* 
* Variables (in alphabetical order). 
*/

var moreButton; // The "More" button (three square on top of each other).
var moreDisplayer; // The div that displays or not the list of options.
var moreBox; // The clickable zone of the list.
var settingsLine; // Link to the settings.
var qAndALine; // Link to the questions & answers.
var shortcutsLine; // Link to an exhaustive list of the shortcuts.
var aboutLine; // Link to the additional information about Mado.
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
	}
	else {
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
	if (onlineImageAltInput.value == "")
		onlineImage = "![" + onlineImageUrlInput.value + "](" + onlineImageUrlInput.value + ')';
	else 
		onlineImage = "![" + onlineImageAltInput.value + "](" + onlineImageUrlInput.value + ')';
	if (newEndSelect == undefined)
		newEndSelect = endSelect;
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
	}
	else
		onlineImageAltInput.value = initialText;
	$(markdown).setRange(startSelect, newEndSelect);
}

function updateOnline () {
	loadOnlineImage(imagePath, function(blob_uri, requested_uri) {
	  	tempConversion = tempConversion.replace(imagePath, blob_uri); 
	  	imagesArray.push([imagePath, blob_uri, true]); // Add a new line in the array of images.
		if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) 
	 		displayImages();
	 	else // The end.
	 		endOfConversion();
	}); 
}
/* All the things to do when mado.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
    /*
    * Shortcuts (JS files in alphabetical order).
    */

    /* app.js */
    exportButton = document.getElementById("export");
    newButton = document.getElementById("new");
    openButton = document.getElementById("open");
    printButton = document.getElementById("print");
    recentButton = document.getElementById("recent");
    saveButton = document.getElementById("save");
    saveAsButton = document.getElementById("save-as");
    windowTitle = document.getElementsByTagName("title")[0];

    /* drag-and-drop.js */
    documentSection = document.getElementById("document");
    
    /* editor.js */
    centerLine = document.getElementById("center-line-container");
    conversionDiv = document.getElementById("html-conversion");
    markdown = document.getElementById("markdown");   
    pasteZone = document.getElementById("paste-zone");
    
    /* footer.js */
    charsDiv = document.getElementById("character-nb");
    linkUrlSpan = document.getElementById("link-url");
    nameDiv = document.getElementById("doc-name");
    wordsDiv = document.getElementById("word-nb");
    
    /* help.js */ 
    help = document.getElementById("help-input");
    helpButton = document.getElementById("help-button");
    helpDisplayer = document.getElementById("help-input-displayer");
    resultsContainer = document.getElementById("help-results-container");

    /* image.js */
    cancelImageButton = document.getElementById("cancel-image");
    galleriesButton = document.getElementById("galleries-button");
    imageButton = document.getElementById("image-button");
    imageDisplayer = document.getElementById("image-insertion-displayer");
    imageBox = document.getElementById("image-insertion-box");
    imageBrowser = document.getElementById("browse-image");
    altInput = document.getElementById("alt-input");  

    /* link.js */
    cancelLinkButton = document.getElementById("cancel-link");
    linkButton = document.getElementById("link-button");
    linkDisplayer = document.getElementById("link-insertion-displayer");
    urlInput = document.getElementById("url-input");
    hypertextInput = document.getElementById("hypertext-input");

    /* more.js */
    moreButton = document.getElementById("more-button");
    moreDisplayer = document.getElementById("more-displayer");
    moreBox = document.getElementById("more-container");
    settingsLine = document.getElementById("settings");
    qAndALine = document.getElementById("q-and-a");
    shortcutsLine = document.getElementById("shortcuts");
    aboutLine = document.getElementById("about");

    /* online-image.js */
    cancelOnlineImageButton = document.getElementById("cancel-webimage");
    onlineImageButton = document.getElementById("webimage-button");
    onlineImageUrlInput = document.getElementById("webimage-url");
    onlineImageAltInput = document.getElementById("webimage-alt-input");
    onlineImageDisplayer = document.getElementById("webimage-insertion-displayer");
    onlineImageBox = document.getElementById("webimage-insertion-box");

    /* recentfiles.js */
    recentButton = document.getElementById("recent-button");
    recentFilesDisplayer = document.getElementById("recent-files-displayer");
    recentFilesContainer = document.getElementById("recent-files-container");

    /* styles.js */
    stylesButton = document.getElementById("style-tool");
    stylesDisplayer = document.getElementById("style-tool-displayer");
    homeRadio = document.getElementById("home-style");
    clinicRadio = document.getElementById("clinic-style");
    tramwayRadio = document.getElementById("tramway-style");

    /* viewswitch.js */
    madoFooter = document.getElementById("mado-footer");
    workspace = document.getElementById("workspace");
    switchCursor = document.getElementById("switch-cursor");
    switchToMD = document.getElementById("switch-md");
    switchToBoth = document.getElementById("switch-both");
    switchToHTML = document.getElementById("switch-html");
    switchButtons.push(switchToMD, switchToBoth, switchToHTML); // Wrapping the switch buttons in an array.

    /* window.js */
    cancelCloseButton = document.getElementById("cancel"); 
    closeDisplayer = document.getElementById("close-alert-displayer"); // The div that contains all the close divs.
    head = document.getElementsByTagName("head")[0]; // The "head" section of the main app.
    quitCloseButton = document.getElementById("quit");
    saveQuitCloseButton = document.getElementById("save-quit");
    saveState = document.getElementById("save-state");
    windowCloseContainer = document.getElementById("window-close");
    windowClose = document.getElementById("window-close-button");
    windowMax = document.getElementById("window-maximize");
    windowMin = document.getElementById("window-minimize");

    /*
    * Functions (JS files in alphabetical order).
    */

    /* app.js (with Mousetrap functions) */
    chrome.storage.local.get("tempFileEntry", function(mado) {  // If you're loading a file.
        if (mado["tempFileEntry"] != undefined) {
            chrome.fileSystem.restoreEntry(
                mado["tempFileEntry"],
                function (theFileEntry) {
                    fileEntry = theFileEntry;
                    chrome.storage.local.remove("tempFileEntry");
    
                    fileEntry.file(
                        function(file) {
                            var reader = new FileReader();
                            reader.onload = function(e) { 
                                markdown.value = e.target.result;
                                markdownSaved = markdown.value;
                                contentChanged();  
                                nameDiv.innerHTML = fileName(fileEntry.fullPath) + "&nbsp;-";     
                                windowTitle.innerHTML = fileName(fileEntry.fullPath) + " - Mado";                
                            };
                            reader.readAsText(file);
                        },
                        errorHandler
                    );
                }
            );          
        }
        else
            markdownSaved = undefined;
    });

    newDisplaySize(); // Set the class of the body.

    $(newButton).on("click", newWindow);
    Mousetrap.bind(["command+n", "ctrl+n"], function(e) { newWindow(); return false; }); // Ctrl+n = new window.
    
    $(openButton).on("click", openFileButton);
    Mousetrap.bind(["command+o", "ctrl+o"], function(e) { openFileButton(); return false; }); // Ctrl+o = open.
    
    $(saveButton).on("click", saveFile);
    Mousetrap.bind(["command+s", "ctrl+s"], function(e) { saveFile(); return false; }); // Ctrl+s = save.
    
    $(saveAsButton).on("click", saveAsFile);
    Mousetrap.bind(["command+shift+s", "ctrl+shift+s"], function(e) { saveAsFile(); return false; }); // Ctrl+shift+s = save as.
    
    $(exportButton).on("click", exportFileHTML);

    $(printButton).on("click", function() {
        window.print();
    });

    Mousetrap.bind(["command+p", "ctrl+p"], function(e) { window.print(); return false; }); // Ctrl+p = print.

    /* drag-and-drop.js */
    dragAndDropManager = new DnDManager("body", function(data) {
        openDraggedFile(data.items[0].webkitGetAsEntry());
    });

    /* editor.js */    
    setEditorSyntax(); // A conversion is made when the window is opened.
    $(charsDiv).css("display", "none"); // On launch we just display the number of words.

    chrome.storage.local.get("firstLaunch", function(mado) { // Set text if it's the first launch.
        if (mado["firstLaunch"] == undefined) {
            if (markdownSaved == undefined) { // User has not open a file.
                markdown.value = firstMessage;
                contentChanged();
            }
            chrome.storage.local.set({ "firstLaunch" : false });
        }
    });
    $(markdown).focus();
    $(markdown).on("input propertychange", function() {
    	contentChanged();
        newInputForStats();
    });
    $(markdown).on("paste", newInputForStats);
    $(markdown).keydown(function(e){
        if (e.keyCode == 9) // The user press tab        
            e.preventDefault();
    });  

    $("#html-conversion").on("click", "a", function(e) {
        if (e.currentTarget.href.indexOf("chrome-extension://") != -1) { // Click on an inner link.
            e.preventDefault();
            if (e.currentTarget.hash != "" && $(e.currentTarget.hash).length != 0)
                $("#html-conversion").scrollTop($(e.currentTarget.hash).position().top);
        }
    });

    /* footer.js */
    $(charsDiv).on("click", counterSelection);
    $(wordsDiv).on("click", counterSelection);

    $("#html-conversion").on("mouseenter", "a", function(e) {
        if (e.currentTarget.href.indexOf("chrome-extension://") == -1)
            linkUrlSpan.innerHTML = e.currentTarget.href;
        else
            linkUrlSpan.innerHTML = e.currentTarget.hash;
        linkUrlSpan.className = "show";
    });

    $("#html-conversion").on("mouseleave", "a", function() {
        linkUrlSpan.className = "";
    });

    /* help.js */ 
    Mousetrap.bind(["command+h", "ctrl+h"], function(e) { $(helpButton).click(); return false; }); // Ctrl+h = display the help.
    $(help).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(helpButton).click();
    });
    $(help).on("input propertychange", displayAnswers); // Launch the help when something is typed on the input.

    $("#result-switch-1, #result-switch-2, #result-switch-3").on("click", function(e) {
        switchResult(e.target.id.substr(e.target.id.length - 1));
    });
    $("#answer-1, #answer-2, #answer-3, #example-1, #example-2, #example-3").mutate('height', setResultsHeight);  

    /* image.js */

    $(imageBrowser).on("click", loadImage);
    $(galleriesButton).on("click", chooseGalleries);   

    $(altInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
           applyImage();
        else if (e.keyCode == 27) // The user press echap
            cancelImage();
        else
            modifyImage();
    });

    $(cancelImageButton).on("click", cancelImage);
    
    /* link.js */
    Mousetrap.bind(["command+k", "ctrl+k"], function(e) { // Ctrl+k = link.
        $(linkButton).click(); 
        return false; 
    }); 

    $(urlInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
           applyLink();
        else if (e.keyCode == 27) // The user press echap
            cancelLink();       
        else
            modifyLink();
    });

    $(hypertextInput).keydown(function(e){
        if (e.keyCode == 9)  {
            e.preventDefault();
            $(urlInput).select();
        }
    })
    $(hypertextInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
            applyLink();
        else if (e.keyCode == 27) // The user press echap
            cancelLink();        
        else
            modifyLink();        
    });

    $(cancelLinkButton).on("click", cancelLink);

    /* more.js */
    $(settingsLine).on("click", function() { moreWindow("more/settings.html"); });
    $(qAndALine).on("click", function() { moreWindow("more/qanda.html"); });
    $(shortcutsLine).on("click", function() { moreWindow("more/shortcuts.html"); });
    $(aboutLine).on("click", function() { moreWindow("more/about.html"); });
    
    /* online-image.js */
    $(onlineImageUrlInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
           applyOnlineImage();
        else if (e.keyCode == 27) // The user press echap
            cancelOnlineImage();       
        else
            modifyOnlineImage();
    });

    $(onlineImageAltInput).keydown(function(e){
        if (e.keyCode == 9)  {
            e.preventDefault();
            $(onlineImageUrlInput).select();
        }
    })
    $(onlineImageAltInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
            applyOnlineImage();
        else if (e.keyCode == 27) // The user press echap
            cancelOnlineImage();        
        else
            modifyOnlineImage();        
    });

    $(cancelOnlineImageButton).on("click", cancelOnlineImage);
    
    /* recentfiles.js */
    displayRecentFiles();

    /* responsive.js */
    if (chrome.app.window.current().getBounds().width < 1600)
        addTopbarLabels();

    /* scroll.js */
    $(markdown).on ("scroll", function (e) {
        if ($(markdown).is(":hover"))
            asyncScroll("markdown");
    });

    $(conversionDiv).on ("scroll", function (e) {
        if ($(conversionDiv).is(":hover"))
            asyncScroll("HTML");
    });

    /* stats.js */
    if (navigator.onLine)
        initStats();
    
    /* styles.js */
    getStyle();

    $(homeRadio).on("click", function() { setStyle("home"); });
    $(clinicRadio).on("click", function() { setStyle("clinic"); });
    $(tramwayRadio).on("click", function() { setStyle("tramway"); });

    /* viewswitch.js */
    initActivation(); // Initializing the workspace and the switch.

    // Getting and setting the click event on each of the switch buttons.
    $(switchToMD).on("click", function() { activate(this.id, "markdown-view"); });
    $(switchToBoth).on("click", function() { activate(this.id, "normal"); });
    $(switchToHTML).on("click", function() { activate(this.id, "conversion-view"); });
    Mousetrap.bind(["command+alt+left", "ctrl+alt+left"], function(e) { switchShortcuts("left"); return false; }); // Ctrl + -> = to the left.
    Mousetrap.bind(["command+alt+right", "ctrl+alt+right"], function(e) { switchShortcuts("right"); return false; }); // Ctrl + <- = to the right.

    /* window.js */
    determineFrame();
    lastBounds = chrome.app.window.current().getBounds(); // Set the bounds at launch.

    $(quitCloseButton).on("click", quitCloseWindow);
    $(saveQuitCloseButton).on("click", saveQuitCloseWindow);

    $(windowClose).on("click", closeWindow);
    Mousetrap.bind(["command+w", "ctrl+w"], function(e) { closeWindow(); return false; }); // Ctrl+w = close.

    $(windowMax).on("click", maximizeWindow);

    $(windowMin).on("click", minimizeWindow);    
}
/* This document handles how to manage the recent files: what to do if a document is deleted, what to do if a user clik on a recent file etc. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var recentButton; // The button that shows the recent files.
var recentFilesDisplayer; // The div that contains the displayer of the recent files.
var recentFilesContainer; // The div that contains the recent files.
var footerHelp; // The footer of the recent files' div.

/* Functions variables. */
var chromeLocalFile = ""; // Used when I have to use storage.local.set with variables as parameters.
var fileInLoading; // The file who is loading, manipulated in app.js.
var nameContainer = {}; // Used when I have to use storage.local.set with variables as parameters.
var recentFiles = [ // Name of the recent files and the corresponding ids on the local storage.
"recentFile1",  "recentFile2", "recentFile3", "recentFile4", "recentFile5", "recentFile6", "recentFile7",
"recentFileId1", "recentFileId2", "recentFileId3", "recentFileId4", "recentFileId5", "recentFileId6", "recentFileId7"];

/*
* Functions (in alphabetical order).
*
* Resume:
	* checkRecentFile (numberOfTheFile): check if the recent files are available for Mado.
	* displayRecentFiles (): it just displays the recent files, no animation.
	* newRecentFile (theFile): add a recent file.
	* removeFile (numberOfTheFile): remove a file with an animation, removeFile(numberOfTheFile) -> removefileInStorage() -> displayRecentFiles().
	* removefileInStorage (numberOfTheFile, OPTION whatToDoAfter): remove a file in the local storage.
	* removeAllFiles (): remove all the recent files in the div and calls removeAllFilesInStorage().
	* removeAllFilesInStorage (): remove all the files in the local storage.
*/

function checkRecentFile (fileNumber) { 
	if (fileNumber <= 7) {
		chrome.storage.local.get(
			recentFiles,  
			function(mado) { 
				if (mado["recentFile" + fileNumber] != undefined) {
					chrome.fileSystem.isRestorable(mado["recentFileId" + fileNumber], function (isRestorable){ // We checked if it's still restorable.
						if (! isRestorable) { // If it's not restorable.
							document.getElementById("recent-" + fileNumber).setAttribute("class", "recent-file deleted"); // Change the class to do the visual effect.
							removeFileInStorage(fileNumber, "check");
						}
						else {
							chrome.fileSystem.restoreEntry(
								mado["recentFileId" + fileNumber],
								function (fileToOpen) {
									if (fileToOpen) // The file still exists.
										checkRecentFile(fileNumber + 1);				
									else { // The file is empty or deleted.
										document.getElementById("recent-" + fileNumber).setAttribute("class", "recent-file deleted"); // Change the class to do the visual effect.
										removeFileInStorage(fileNumber, "check");
									}
		 						}
	 						);
						}
			    	});
				}
		    }        
	    ); 	
	}
}

function displayRecentFiles () {
	checkRecentFile(1);
	recentFilesContainer.innerHTML = " "; // Reset.

	chrome.storage.local.get(
		recentFiles,  
		function(mado) { 	
			for (var i = 1; i <= 7; i++) {
				if (mado["recentFile" + i] != undefined) // There's a file at this position, time to create a div for the file.
					recentFilesContainer.innerHTML += "<li class=\"recent-file\" id=\"recent-" + i + "\"><div class=\"recent-file-wrapped\"><p>" + fileName(mado["recentFile" + i].toString()) + "</p><div class=\"delete-recent-button little-icon-delete\" id=\"delete-button-" + i + "\"></div></div></li>";   
	    		else
	    			break; // End of the loop.    		
		 	}	
		 	$(".recent-file").on("click", function(e) { // The user clicks on a recent file.
		 		if (! $(e.target).closest("#delete-button-" + this.id.charAt(this.id.length-1)).length) { 
		 			fileInLoading = this.id.charAt(this.id.length-1).valueOf();
			 		chromeLocalFile = "recentFileId" + this.id.charAt(this.id.length-1); // Get a var with the name of the file clicked.
			 		chrome.storage.local.get(
			 			chromeLocalFile, // We get the file.
			 			function(mado) {
			 				chrome.fileSystem.restoreEntry(
								mado[chromeLocalFile],
								function (fileToOpen) {
									openFile(fileToOpen); // We open the file.
									recentFilesDisplayer.className = "hidden";
		 						}
	 						);
		 				}
			 		);
		 		}
		 	});
		 	$(".delete-recent-button").on("click", function() { removeFile(this.id.charAt(this.id.length-1)); }); // Add the event listeners for the remove buttons.		
		 	/* Footer */
		 	footerHelp = document.createElement("li");
		    footerHelp.setAttribute("id", "recent-files-info");
		    if (recentFilesContainer.innerHTML != " ") {// Something in the div for recent files.
		    	footerHelp.setAttribute("class", "clear-all");
		    	footerHelp.innerHTML = "<div class=\"icon-recent-clear\"></div><span class=\"clear-all-text\">Clear all</span>";
	    	}
		    else {
		    	footerHelp.setAttribute("class", " "); // Nothing in the div for recent files.
				footerHelp.innerHTML = "No recent document.";
			}			
			recentFilesContainer.appendChild(footerHelp); // Add the footer to the container.
			$(".clear-all").on("click", function() {removeAllFiles();});
	    }        
    ); 
}

function newRecentFile (file, after) {
	chrome.storage.local.get( // We have to affect the local storage
		recentFiles, // Get all the recent files.
		function(mado) { 
			for (var i = 1; i <= 7; i++) { // Max : 7
				if (mado["recentFile" + i] == undefined || mado["recentFile" + i] == file.fullPath || i == 7) { // If there's no file here or the file at this position is the file who is set, or it's just the end.
					for (var j = i; j > 0; j--) { // The second loop begins, j -> j - 1.
						if (j > 1) {
							/* Two things in local storage to change, the name of the file and its id.
							First : The id */
							chromeLocalFile = ("recentFileId" + j).toString(); // This is j.
							nameContainer[chromeLocalFile] = mado["recentFileId" + (j - 1)]; // This is j - 1.
							chrome.storage.local.set(nameContainer); // j is now j - 1.
							nameContainer = {}; // Reset.

							// Secondly : the file name. (Same functions than for the id).
							chromeLocalFile = ("recentFile" + j).toString();
							nameContainer[chromeLocalFile] = mado["recentFile" + (j - 1)];
							chrome.storage.local.set(nameContainer);
							nameContainer = {};	
						}
						else { // The end.
							// Now the first recent file is empty, we set the ID and the name.
							chrome.storage.local.set({"recentFileId1" : chrome.fileSystem.retainEntry(file)}); 	 	
							chrome.storage.local.set({"recentFile1" : file.fullPath});

							displayRecentFiles(); // Update the div.

							if (after != undefined && after == "quit")
								quitCloseWindow();
						}							
					}
					break; // End of the loop
				}
			}
			
		}
	);
}

function removeFile (fileNumber) { 
	document.getElementById("recent-" + fileNumber).setAttribute("class", "recent-file deleted"); // Change the class to do the visual effect.	
	setTimeout(function() { // After the visual effect.		
		removeFileInStorage(fileNumber, "display");
	}, 100);
}

function removeFileInStorage (fileNumber, after) { 
	chrome.storage.local.get(
		recentFiles,  
		function(mado) {
			if (mado["recentFile" + fileNumber] != undefined) {
				for (var i = parseInt(fileNumber); i <= 7; i++) {
					if (mado["recentFile" + (i + 1)] != undefined) { // File i -> File i-1
						chromeLocalFile = ("recentFileId" + i).toString();
						nameContainer[chromeLocalFile] = mado["recentFileId" + (i + 1)];
						chrome.storage.local.set(nameContainer);
						nameContainer = {};

						chromeLocalFile = ("recentFile" + i).toString();
						nameContainer[chromeLocalFile] = mado["recentFile" + (i + 1)];
						chrome.storage.local.set(nameContainer);		
						nameContainer = {};	
					}
					else { // The last one is deleted.
						chromeLocalFile = ("recentFileId" + i).toString();
						chrome.storage.local.remove(chromeLocalFile);

						chromeLocalFile = ("recentFile" + i).toString();
						chrome.storage.local.remove(chromeLocalFile);

						chromeLocalFile = "";
						break; // End of the loop
					}
				}
				if (after == "display")
					displayRecentFiles();
				else if (after == "check")
					checkRecentFile(fileNumber);			
			}	
		}
	);
}

function removeAllFiles () { 
	chrome.storage.local.get(
		recentFiles,  
		function(mado) {
			for (var i = 1; i <= 7; i++)
				if (mado["recentFile" + (i + 1)] == undefined) {
					removeAllFilesInStorage(i);
					break;
				}
		}	
	);
}

function removeAllFilesInStorage (fileNumber) {
	chrome.storage.local.get(
		recentFiles,  
		function(mado) {
			chromeLocalFile = ("recentFileId" + fileNumber).toString();
			chrome.storage.local.remove(chromeLocalFile);

			chromeLocalFile = ("recentFile" + fileNumber).toString();
			chrome.storage.local.remove(chromeLocalFile);

			chromeLocalFile = ""; // Reset.

			if (fileNumber > 1)
				removeAllFilesInStorage(fileNumber - 1);
			else {
				recentFilesContainer.innerHTML = "<li id=\"recent-files-info\" class=\" \">No recent document.</li>";
			}
		}	
	);
}
function addTopbarLabels () {
	$(exportButton).attr("title", "Export");
	$(newButton).attr("title", "New");
    $(openButton).attr("title", "Open");
    $(printButton).attr("title", "Print");
    $(recentButton).attr("title", "Recent");
    $(saveButton).attr("title", "Save");
    $(saveAsButton).attr("title", "Save as");
}

function removeTopbarLabels () {
	$(exportButton).removeAttr("title");
	$(newButton).removeAttr("title");
	$(openButton).attr("title");
    $(printButton).attr("title");
    $(recentButton).attr("title");
    $(saveButton).attr("title");
    $(saveAsButton).attr("title");
}
var atTheBottom;

// Si on est tout à la fin et qu'on voit que la hauteur est aggrandie alors on le remet à la fin. 

function asyncScroll (zone, scroll) {
	if (zone == "markdown")
		$(conversionDiv).scrollTop(($(markdown).scrollTop() / (markdown.scrollHeight  - markdown.offsetHeight)) * (conversionDiv.scrollHeight - conversionDiv.offsetHeight));
	else
		$(markdown).scrollTop(($(conversionDiv).scrollTop() / (conversionDiv.scrollHeight  - conversionDiv.offsetHeight)) * (markdown.scrollHeight - markdown.offsetHeight));

	if ($(markdown).scrollTop() + markdown.offsetHeight == markdown.scrollHeight)
		atTheBottom = true;
	else
		atTheBottom = false;
}

function toTheBottom () {
	if (atTheBottom == true) {
		$(markdown).scrollTop(markdown.scrollHeight - markdown.offsetHeight);
		$(conversionDiv).scrollTop(conversionDiv.scrollHeight - conversionDiv.offsetHeight);
	}
}
/* The JS to send data to Analytics. */

/* 
* Variables (in alphabetical order). 
*/

var service;
var tracker;
var markdownInputs = 0;
var launchDate = new Date();

/*
* Functions (in alphabetical order).
*
* Resume:
	* initStats (): create a new service for Analytics.
	* newInputForStats (): send a message when the user has put 50 things in the textarea.
	* sendClosing (): calculate how long the user used this window.
	* sendEvent (): send an event to analytics.
	* setTrackingPermission (analyticsService): set the tracking permission.
*/


function initStats () {
    service = analytics.getService("Mado"); // Initialize the Analytics service object with the name of your app.

    setTrackingPermission();

    /* Get a Tracker using your Google Analytics app Tracking ID. */
    tracker = service.getTracker("UA-45134408-1"); // Need to change for the real ID.

    /* Record an "appView" each time the user launches your app or goes to a new screen within the app. */
    tracker.sendAppView("mainWindow");
}

function newInputForStats () {
	markdownInputs++;
	if (markdownInputs % 50 == 0)
		sendEvent("50 inputs in the textarea");
}

function sendClosing () {
	if (service != undefined && tracker != undefined && navigator.onLine)
		chrome.storage.local.get("analytics",  function(mado) {
			if (mado["analytics"] != false) 
				tracker.sendEvent("Window lifetime", "Window has been closed", (parseInt(((new Date()).getTime() - launchDate.getTime()) / 1000 / 60) + ":" + parseInt(((new Date()).getTime() - launchDate.getTime()) / 1000 % 60)).toString());
		});
}

function sendEvent (eventName) {
	if (service != undefined && tracker != undefined && navigator.onLine)
		chrome.storage.local.get("analytics",  function(mado) {
			if (mado["analytics"] != false) 
				tracker.sendEvent(eventName);
		});
}

function setTrackingPermission () {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != undefined) 
			service.t.setTrackingPermitted(mado["analytics"]);
		else {
			chrome.storage.local.set({ "analytics" : true });
			service.t.setTrackingPermitted(true);
		}
	});
}
/* The JS to control Mado's styles. */

/* 
* Variables (in alphabetical order). 
	* HTML div shortcuts.
	* HTML radio shortcuts.
*/

/* HTML div shortcuts. */
var stylesButton; // The "Styles" button.
var stylesDisplayer; // The div that contains and displays the style selection tool.

/* HTML radio shortcuts. */
var clinicRadio; // Clinic style.
var homeRadio; // Home style.
var tramwayRadio; // Tramway style.

/*
* Functions (in alphabetical order).
*
* Resume:
	* getStyle (): get the storage variable style.
	* setStyle (newStyleToApply): set the storage variable "style".
	* setStyleInHTML (newStyleToApply): Disable useless links in HTML and activate the good one.
*/

function getStyle () {
	chrome.storage.local.get("style",  function(mado) {
		if (mado["style"] != undefined) {
			if (mado["style"] == "home")
				homeRadio.checked = true;
			else if (mado["style"] == "clinic")
				clinicRadio.checked = true;
			else
				tramwayRadio.checked = true;
			setStyleInHTML(mado["style"]);
		}
		else {
			homeRadio.checked = true;
			setStyle("home");
		}
	});
}

function setStyle (newStyle) {
	setStyleInHTML(newStyle);
	chrome.storage.local.set({ "style" : newStyle });
}

function setStyleInHTML (newStyle) {
	for (var i = 0; i < document.styleSheets.length; i++)
		if (document.styleSheets.item(i).href.indexOf("css/themes/") != -1) {
	    	if (document.styleSheets.item(i).href.indexOf(newStyle) == -1) 
	    		document.styleSheets.item(i).disabled = true;
	    	else
	    		document.styleSheets.item(i).disabled = false;
		}
}
/* This document handles the view switch on the topbar. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var madoFooter; // Mado's footer.
var switchCursor; // Mado's switch cursor.
var switchToBoth; // Both switch.
var switchToHTML; // HTML switch.
var switchToMD; // Markdown switch.
var workspace; // Getting the main container (workspace).

/* Functions variables. */
var previousSize; // The previous size of the window.
var switchButtons = []; // The array for the switch.

/*
* Functions (in alphabetical order).
*
* Resume:
	* activate (buttonClicked, stateOfTheClass): handles the behavior of a switch button when it is clicked. The function sets the main container's class name according to the button.
	* initActivation (): initalize the switch's look on Mado's launch.
	* switchShortcuts (theDirection): change the switch when the user uses a keyboard shortcut.
*/

function activate (clickedBtn, classState) {
	for (var i = 0; i < switchButtons.length; i++) {
		if (switchButtons[i].id != clickedBtn) // Deactivating the switch buttons that are not clicked.
			switchButtons[i].className = "switch-button";
		else // Activating the clicked button.
			switchButtons[i].className = "switch-button activated";
	}	

	workspace.className = classState; // Setting the workspace's class name according to the clicked button.
	switchCursor.className = classState; // Setting the cursor's class name according to the clicked button.

	if (classState == "markdown-view")
		madoFooter.className = classState;
	else
		madoFooter.removeAttribute("class");
}

function initActivation () { 
	if (chrome.app.window.current().getBounds().width > 1159) // Big window
		switchToBoth.className = "switch-button activated";
	else {
		switchToMD.className = "switch-button activated";
		workspace.className = "markdown-view";
	}

	previousSize = chrome.app.window.current().getBounds().width; // Setting the size of the window, forbid the resize() function to be launched before the complete loading.
}

function switchShortcuts (direction) {
	if (window.innerWidth > 1159) { // Normal window
		for (var i = 0; i < switchButtons.length; i++) {
			if (switchButtons[i].className == "switch-button activated") { // We found what button is activated.
				if (direction == "left" && i > 0) 
					switchButtons[i - 1].click(); // The previous button is now activated.
				else if (direction == "right" && i < switchButtons.length -1)
					switchButtons[i + 1].click(); // The next button is now activated.
				i = switchButtons.length; // End of the loop.
			}
		}
	}
	else { // Small window, only Markdown and HTML views are available.
		if (direction == "left")
			switchToMD.click();
		else
			switchToHTML.click();
	}	
}
/* The JS to control the scripts for Mado's window. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variable.
*/

/* HTML shortcuts. */
var cancelCloseButton; // The "Cancel" button.
var closeDisplayer; // The div that contains all the close divs.
var head; // The "head" section of the main app.
var lastBounds; // This is the last size of the window.
var markdownSaved; // The last Markdown text saved.
var quitCloseButton; // The "No, don't save" button.
var saveQuitCloseButton; // The "Save and exit" button.
var saveState; // The div who displays if the document is saved or not.
var frameStylesheetLink = document.createElement("link"); // Create a "link" node.
var windowCloseContainer; // The close container.
var windowClose; // The close button.
var windowMax; // The maximize button.
var windowMin; // The minimize button.

/* Functions variables. */
var boundsBeforeMaximized;

/*
* Functions (in alphabetical order).
*
* Resume:
	* checkSaveState (): change saveState's innerHTML.
	* closeWindow (): what to do when the user clicks on close.
	* determineFrame (): which window bar style to display on launch, according to the OS.
	* maximizeWindow (): what to do when the user clicks on maximize.
	* minimizeWindow (): what to do when the user clicks on minimize. 
	* quitCloseWindow (): what to do when the user clicks on "No, don't save".
	* saveAndQuit (): save an already existing file and quit.
	* saveAsAndQuit (): save a new file and quit.
	* saveQuitCloseWindow (): what to do when the user clicks on "Save and exit".
*/

function checkSaveState () {
	if (markdown.value != "") {
		if ((markdownSaved == undefined) || (markdown.value != markdownSaved))
			saveState.innerHTML = "<span class=\"little-icon-unsaved\"></span>";
		else
			saveState.innerHTML = "";
	}
	else {
		if (markdownSaved != undefined)
			saveState.innerHTML = "<span class=\"little-icon-unsaved\"></span>";
		else
			saveState.innerHTML = "";
	}
}

function closeWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
	if (saveState.innerHTML == "<span class=\"little-icon-unsaved\"></span>") // Save not made.
		closeDisplayer.className = "visible";
	else {
		sendClosing(); // stats.js
		chrome.app.window.current().close();
	}
}

function determineFrame () {
	frameStylesheetLink.setAttribute("rel", "stylesheet");
	frameStylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
		windowMax.setAttribute("class", "cta little-icon-mac-maximize");
		windowMin.setAttribute("class", "cta little-icon-mac-minimize");
	}
	else if (navigator.appVersion.indexOf("Win") != -1) { // If the user is on a Windows PC, redirect to the Windows window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
		windowMax.setAttribute("class", "cta little-icon-win-maximize");
		windowMin.setAttribute("class", "cta little-icon-win-minimize");
	}
	else if (navigator.appVersion.indexOf("Linux") != -1) { // If the user is on a Linux computer, redirect to the Linux Ubuntu window frame styles.
		frameStylesheetLink.setAttribute("href", "css/window-frame-linux.css");
		windowClose.setAttribute("class", "cta little-icon-lin-close");
		windowMax.setAttribute("class", "cta little-icon-lin-maximize");
		windowMin.setAttribute("class", "cta little-icon-lin-minimize");
	}
	else { // If the user is on another type of computer, redirect to the generic window frame styles (which are primarily Chrome OS's styles).
		frameStylesheetLink.setAttribute("href", "css/window-frame-chromeos.css");
		windowClose.setAttribute("class", "cta little-icon-chr-close");
		windowMax.setAttribute("class", "cta little-icon-chr-maximize");
		windowMin.setAttribute("class", "cta little-icon-chr-minimize");
	}

	head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
}

function maximizeWindow () {
	if (navigator.appVersion.indexOf("Win") == -1) {
		if (! chrome.app.window.current().isMaximized()) // Maximize.
			chrome.app.window.current().maximize();
		else // Restore the last bounds.
			chrome.app.window.current().restore();
	}
	else {
		if (chrome.app.window.current().getBounds().width < screen.availWidth || 
			chrome.app.window.current().getBounds().height < screen.availHeight) {
			boundsBeforeMaximized = chrome.app.window.current().getBounds();
			chrome.app.window.current().setBounds({
				left: screen.availLeft, 
				top: screen.availTop, 
			 	width: screen.availWidth, 
			 	height: screen.availHeight 
			});
		}
		else { // Restore the last bounds.
			if (boundsBeforeMaximized != undefined)
				chrome.app.window.current().setBounds(boundsBeforeMaximized);
			else
				chrome.app.window.current().setBounds({ 
					left: ((screen.availWidth - Math.round(screen.width * 0.85)) / 2), 
					top: ((screen.availHeight - Math.round(screen.height * 0.85)) / 2), 
					width: Math.round(screen.width * 0.85), 
					height: Math.round(screen.height * 0.85) 
				});
		}
	}
}

function minimizeWindow () {
	chrome.app.window.current().minimize();
}

function quitCloseWindow () {
	sendClosing(); // stats.js
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
}

function saveAndQuit () {
	fileEntry.createWriter(function(fileWriter) {
		    truncated = false;
		    fileWriter.onwriteend = function(e) {
		        if (!truncated) {
		            truncated = true;
		            this.truncate(this.position);
		            return;
		        }
		        newRecentFile(fileEntry, "quit");
		    };
		    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
		}, errorHandler);
}

function saveAsAndQuit () {
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "document.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(function(fileWriter) {
				    truncated = false;
				    fileWriter.onwriteend = function(e) {
				        if (!truncated) {
				            truncated = true;
				            this.truncate(this.position);
				            return;
				        }
				        newRecentFile(savedFile, "quit"); // Update the local storage, the file opened is now on top.	
				    };
				    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
				}, errorHandler);
			}
		}
	);
}

function saveQuitCloseWindow () {
	if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;-") // Not saved pr the document is not in Markdown.
		saveAsAndQuit();
	else
		saveAndQuit();
}

/*
* Chrome methods.
*
* Resume:
	* chrome.app.window.current().onBoundsChanged.addListener (): what to do when the window is resized or moved.
*/

chrome.app.window.current().onBoundsChanged.addListener(function () {
	if (chrome.app.window.current().getBounds().width < 1160 && switchToBoth.className == "switch-button activated")
		switchToMD.click(); // Markdown is set as default view.
	else if (chrome.app.window.current().getBounds().width >= 1160 && lastBounds.width < 1160) 
		switchToBoth.click(); // viewswitch.js

	if (chrome.app.window.current().getBounds().width < 1600 && lastBounds.width >= 1600)
		addTopbarLabels();
	else if (chrome.app.window.current().getBounds().width >= 1600 && lastBounds.width < 1600)
		removeTopbarLabels();
	lastBounds = chrome.app.window.current().getBounds();
});