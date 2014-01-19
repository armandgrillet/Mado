/* The JS to control the scripts between Mado and the computer. */

/* 
* Variables (in alphabetical order). 
*/

var fileEntry; // This is the variable who stores the file opened.
var lastWidth; // This is the last zier of the window.

/*
* Functions (in alphabetical order).
*
* Resume:
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

function errorHandler() {
	if (fileInLoading != undefined) {
		removeFile(fileInLoading);
		fileInLoading = undefined;
	}
}

function exportFileHTML () {
	marked(markdown.innerText, function (err, content) {
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
	if (markdown.innerText.length > 0) {
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
				minHeight: 240
		  	}
	  	);
  	}
}

function openFile(fileToOpen) {
	fileToOpen.file(
		function(file) {
	 		var reader = new FileReader();
	 		reader.onload = function(e) {
	 			if (markdown.innerText != "") {// Something is already in the markdown, Mado opens a new window. 
	 				chrome.storage.local.set(
		 				{
		 					"tempFileEntry" : chrome.fileSystem.retainEntry(fileToOpen)
		 				}, 
		 				newWindow
	 				);
 				}
	 			else {
		 			markdown.innerText = e.target.result; // Display the file content.	
	 			 			
		 			fileEntry = fileToOpen; // For save.

		 			// For the footer.
		 			markdownSaved = markdown.innerText;
		 			conversion();
		 			nameDiv.innerHTML = fileName(fileToOpen.fullPath) + "&nbsp;-";
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
	 				extensions: ["md", "txt"]
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
				savedFile.createWriter(
					function(writer) {
				 		writer.write(
				 			new Blob(
					 			[markdown.innerText],
								{
									type: "text/plain"
								}
							)
						); 						
						fileEntry = savedFile; // Save without asking the file.
						newRecentFile(fileEntry); // Update the local storage, the file opened is now on top.

						// Footer
						markdownSaved = markdown.innerText;
						checkSaveState();
						nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;-";

						
				 	}, 
				errorHandler);
			}
		}
	);
}

function saveFile () {
	if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;-") // Not saved or not a Markdown file.
		saveAsFile();
	else { // If we have already loaded the file.
		fileEntry.createWriter(
			function(writer) {
		 		writer.write(
		 			new Blob(
			 			[markdown.innerText],
						{
							type: "text/plain"
						}
					)
				); 
				newRecentFile(fileEntry); // Update the position of the file saved.

				// Footer
				markdownSaved = markdown.innerText;
				checkSaveState();
				nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;-";
		 	}, 
		errorHandler);
	}
}

function theMinWidth () {
	/* For the 0.2
	if (screen.width < 1600)
		return 683;
	else
		return 800;
	*/
	return 683;
}

/*
* Chrome methods.
*
* Resume:
	* chrome.app.window.current().onBoundsChanged.addListener (): what to do when the window is resized or moved.
	* chrome.storage.onChanged.addListener (): what to do when a chrome.storage.local variable is changed. 
*/

chrome.app.window.current().onBoundsChanged.addListener(function () {
	if (window.innerWidth < 1366 && switchToBoth.className == "switch-button activated")
		switchToMD.click(); // Markdown is set as default view.
	else if (window.innerWidth >= 1366 && lastWidth < 1366 && windowResizing) 
		switchToBoth.click(); // viewswitch.js

	lastWidth = window.innerWidth;
});

chrome.storage.onChanged.addListener(function (changes, namespace) { // What to do when a storage value is changed.
   	for (key in changes) {
   		if (key == "analytics")
            setTrackingPermission(); // stats.js 
        else if (key == "displaySize")
            newDisplaySize(); // app.js 
        else if (key == "gfm")
            setEditorSyntax(); // editor.js
        else if (key == "resize")
            setWindowResizing(); // viewswitch.js         
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
		titleInput.value = "";
		imageLoaded = undefined;

		if ($(markdown).find("#mado-image").length == 0) { // If the focus is not yet on the contenteditable.
			markdown.focus();
			changeContentHighlighted("mado-image");
		}
		imageDisplayer.className = "tool-displayer";
		imageDiv = document.getElementById("mado-image");
		setImageInputs();
	}
	else if (imageDisplayer.className == "tool-displayer" && 
		! $(e.target).closest(imageBox).length) {// The user doesn't click on the image insertion box.
		imageDisplayer.className = "tool-displayer hidden";
		selectElementContents(imageDiv);
		restoreSelection("mado-image");
	}

	/* link.js */
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";
		
		if ($(markdown).find("#mado-link").length == 0) { // If the focus is not yet on the contenteditable.
			markdown.focus();
			changeContentHighlighted("mado-link");
		}
		linkDisplayer.className = "tool-displayer";
		linkDiv = document.getElementById("mado-link");
		setLinkInputs();
		urlInput.focus();			
	}
	else if (linkDisplayer.className == "tool-displayer" && ! $(e.target).closest(linkDisplayer).length) {
		linkDisplayer.className = "tool-displayer hidden";
		selectElementContents(linkDiv);
		restoreSelection("mado-link");
	}

	/* more.js */
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (moreDisplayer.className != "hidden" && ! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";

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

/* Functions linked to the Markdown markdown. */

/* 
* Variables (in alphabetical order). 
	* Shortcuts.
	* Global.
*/

/* HTML shortcuts. */
var conversionDiv; // The div who contains the HTML conversion.
var markdown; // The contenteditable where the user writes.
var pasteZone; // The textarea used when the user pastes content.

/* Global. */
var closeDiv; // The end of the div.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var initialText; // A save used when the user cancel a link/image.
var newCE; // The new contenteditable content (temporary).
var openDiv; // The beginning of the div.
var optiMarkdown; // The new Markdown, without useless div.
var pasteDiv; // The div used when the user pastes content.
var range; // Get the user's selection.
var rangeSelection; // Set the user's new range selection.
var savedSel; // The selection is saved here.
var selection; // Set the user's new selection.
var surroundDiv = document.createElement("div"); // Used to add the div to the contenteditable.
var tempTextarea = document.createElement("textarea"); // Used to add the div to the contenteditable.
var tempConversion; // A string used to don't display errors when an image is loaded.
var tempMarkdown; // String used to modify the markdown innerHTML.

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the contenteditable.
	* changeContentHighlighted (id): Add a div with id @param id around the selection. 
	* checkDiv (divCount, content, pos, id): Remove a div from content, @return if it has working and the new content.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* removeDivWithId (id): Remove a div from content via chechDiv (divCount, content, pos, id), use RegExp for strength.
	* restoreSelection (id): Restore the previous elements selected by the user.	
	* selectElementContents(el) : Do weird things with HTML to re-set the selection.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if ((markdown.innerHTML > 4) || (markdown.innerText.length > 0 && markdown.innerHTML != "<br>")) { // There is Markdown in the contenteditable.
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
	else { // No Markdown here.
		markdown.innerHTML = ""; // If the innerHTML is "<br>".
		conversionDiv.innerHTML = "See the result here";
		resetCounter();
		checkSaveState();
	}
}

function changeContentHighlighted (id) {
    range = rangy.getSelection().rangeCount ? rangy.getSelection().getRangeAt(0) : null;
    if (range) {    
        surroundDiv.id = id;
        try {
            range.surroundContents(surroundDiv);
        }
        catch(ex) {
        }
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

	for (var i = 0; i < imagesArray.length; i++) // Remove the images who are not used anymore.
		if (imagesArray[i][2] == false)
			imagesArray = imagesArray.splice(imagesArray[i], 1);

	tempConversion = tempConversion.replace(/<img src=\"img\/nofile.png/g, "<span class=\"nofile-link\"> <span class=\"nofile-visual\">File not found</span>&nbsp;</span><img class=\"nofile\" src=\"img/nofile.png");
	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		if ($(this).attr("href").substring(0,1) != '#' && $(this).attr("href").substring(0,4) != "http") // External link without correct syntax.
			$(this).attr("href", "http://" + $(this).attr("href"));
		$(this).attr("target", "_blank");
	});

	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-link").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-visual").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function pasteContent () {
	changeContentHighlighted("mado-paste");  
	pasteDiv = document.getElementById("mado-paste");      
    pasteZone.focus();

    setTimeout(function(){
        if (pasteDiv != undefined)
            pasteDiv.innerText = pasteZone.value;       
        else
            $(markdown).innerText = $(markdown).innerText + pasteZone.value;
        pasteZone.value = ""; // Reset the hidden textarea content.
        selectElementContents(pasteDiv);
        restoreSelection("mado-paste");
        conversion();
    }, 20);
}

function removeDivWithId (id) {
	tempMarkdown = markdown.innerHTML;
	tempMarkdown = tempMarkdown.replace(/< *div/g, "<div"); // <div
	tempMarkdown = tempMarkdown.replace(/<div *>/g, "<div>"); // <div>
	tempMarkdown = tempMarkdown.replace(/< *\/ *div *>/g, "</div>"); // </div>

	if (tempMarkdown.indexOf("<div id=\"" + id + "\">") != -1) { // Remove the useless div.
		optiMarkdown = checkDiv(0, tempMarkdown, tempMarkdown.indexOf("<div id=\"" + id + "\">"), id);
		if (optiMarkdown[0] != -1) {
			tempMarkdown = optiMarkdown[1];
		}
	}
	markdown.innerHTML = tempMarkdown;
}

function restoreSelection (id) {
	savedSel = rangy.saveSelection();
	removeDivWithId(id);		
	rangy.restoreSelection(savedSel);
	rangy.removeMarkers(savedSel);
}

function selectElementContents(el) {
    if (document.createRange && window.getSelection) {
        rangeSelection = document.createRange();
        selection = window.getSelection();
        selection.removeAllRanges();
        try {
            rangeSelection.seleectNodeContents(el);
            selection.addRange(rangeSelection);
        } catch (e) {
            rangeSelection.selectNode(el);
            selection.addRange(rangeSelection);
        }
    } else if (document.body.createTextRange) {
        rangeSelection = document.body.createTextRange();
        rangeSelection.moveToElementText(el);
        rangeSelection.select();
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

/* Functions who handle Mado's footer. */

/*
* Variables (in alphabetical order).
*/

var charsDiv; // The div who contains the document's chars number.
var nameDiv; // The div who contains the name of the opened document.
var wordsDiv; // The div who contains the document's words number.

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
		charsDiv.style.display = "inline";
		wordsDiv.style.display = "none";
	}
	else {
		charsDiv.style.display = "none";
		wordsDiv.style.display = "inline";
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

var answer1, answer2, answer3; // The divs who contain the answers.
var answersContainer; // The div who contains the answers displayed.
var example1, example2, example3; // The divs who contain the examples.
var help; // The input where the user writes what he wants.
var helpButton; // The help button.
var helpDisplayer; // The div who contains all the help divs.
var maxAnswers; // Check the number of answers displayed, max = 3.
var result1, result2, result3; // The divs who contain the results.
var resultsContainer; // Will contain the HTML results container.
var resultSwitch1, resultSwitch2, resultSwitch3; // The divs who contain the result switchs.
var wordPos; // Shortcut for "words[i][j].toLowerCase().indexOf(help.value.toLowerCase());".

var words = [ // All the words that can be used on the help input, each line corresponding to the same line in 'answers'.
	// Headers
	["Headers", "Titles"],

	// Emphasys
	["Bold", "Strong emphasis"],
	["Italic", "Emphasis"],
	["Bold italic", "Combined emphasis"],

	// Lists 
	["Ordered lists"],
	["Unordered lists"],

	// Links 
	["Inline-style links"],
	["Reference-style links"],

	// Images 
	["Images (inline)", "Pictures (inline)"],
	["Images (reference-style)", "Pictures (reference-style)"],

	// Code and Syntax Highlighting
	["Blocks of code"],

	// Tables

	// Blockquotes
	["Blockquotes"],

	// Inline HTML
	["Inline HTML", "HTML in Markdown"],

	// Horizontal Rules
	["Horizontal rules"],

	// Line Breaks
	["Line breaks"],

	// Joke
	["Question"]
];

var answers = [ // The answers displayed.
	// Headers
	["Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6)."],

	// Emphasys
	["<span class=\"help-code\">**bold**</span> or <span class=\"help-code\">__bold__</span>"],
	["<span class=\"help-code\">*italic*</span> or <span class=\"help-code\">_italic_</span>"],
	["<span class=\"help-code\">**_ bold italic_**</span> or <span class=\"help-code\">*__bold italic__*</span> or <span class=\"help-code\">***this***</span> or <span class=\"help-code\">___this___</span>"],

	// Lists 
	["1. First ordered list item. <br>2. Another item."],
	["* An item. <br>* A second item (you can also use + or -)."],

	// Links 
	["<span class=\"help-code\">[Hypertext](http://url.com)</span><br>(Also works with a local path.)"], // TODO : Change the link
	["<span class=\"help-code\">[Hypertext][1]<br>[1]: http://url.com</span>"],

	// Images
	['<span class=\"help-code\">![alt text](path/to/image.jpg "Title")</span>'], 
	['<span class=\"help-code\">![alt text][image Id] <br> [image Id]: path/to/image.jpg "Title"</span>'],

	// Code and Syntax Highlighting
	["<span class=\"help-code\">```Text between three back-ticks is a block of code.```<br>&nbsp;&nbsp;&nbsp;&nbsp;Text after four spaces is also a block of code.</span>"],

	// Tables

	// Blockquotes
	["> Blockquotes only need <span class=\"help-code\">></span> to work. <br><br> <span class=\"help-code\">> Two blockquotes without a break (a line who isn't a blockquote)  are a single quote.</span>"],

	// Inline HTML
	["<span class=\"help-code\">It &lt;strong>works&lt;/strong>.</span>"],

	// Horizontal Rules
	["<span class=\"help-code\">*** <br> You can use Hyphens, asterisks or underscores. <br> ---</span>"],

	// Line Breaks
	["To separate two paragraphs, press <span class=\"help-code\">Enter</span> twice.<br><br>And you have a new paragraph."],

	// Joke
	["Seriously?"]
];

var examples = [
	// Headers
	["Six sizes available, the size depends on the numbers of #.<h1 id=\"big-title-size-1-the-biggest-\">Big title (size 1, the biggest).</h1><h4 id=\"a-less-impresive-title-size-4-on-6-br-\">A less impresive title (size 4 on 6).</h4>"],

	// Emphasys
	["<strong>Bold</strong>"],
	["<em>Italic</em>"],
	["<strong><em>Bold italic</em></strong>"],

	// Lists TODO
	["<ol><li>First ordered list item</li><li>Another item.</li></ol>"],
	["<ul><li>An item. </li><li>A second item (you can also use + or -).</li></ul>"],

	// Links 
	["<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"], // TODO : Change the link
	["<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"],

	// Images
	["<div class=\"example-image\"></div>"],
	["<div class=\"example-image\"></div>"],

	// Code and Syntax Highlighting
	["<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"],

	// Tables

	// Blockquotes
	["<blockquote>Blockquotes only need &gt; to work. To separate two blockquotes, insert a blank line between them.</blockquote>"],

	// Inline HTML
	["It <strong>works<strong>"],

	// Horizontal Rules
	["<hr> You can use Hyphens, asterisks or underscores.<hr>"],

	// Line Breaks
	["<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"],

	// Joke
	["Life's most persistent and urgent question is, 'What are you doing for others?'."]
];

/*
* Functions (in alphabetical order).
*
* Resume:
	* activateHelp (): show the help input and focus when the help button is clicked.
	* answer (): find the answers and the examples for the question.
	* displayAnswers (): display the answers.
	* resetAnswerDiv (): clear the Help divs.
	* switchResult (result number): show the answer or the example when the user click on a switch.
*/

function activateHelp () { // Show the help input and focus when the help button is clicked. MAYBE USELESS
	if (helpDisplayer.className == "hidden") {
		helpDisplayer.className = " ";
    	help.focus();
	}	
}

function answer () {
	maxAnswers = 1; // Reset the number of answers that can be diplayed (max: 4)
	for (var i = 0; i < words.length && maxAnswers < 4; i++) // A line = a syntax, this loop runs through each line.
		for (var j = 0; j < words[i].length; j++) // A line can have many columns (different ways to say the same thing), this loop run through each column.
			if (words[i][j].toLowerCase().indexOf(help.value.toLowerCase()) != -1) { // Everything in lower case to help the condition.
				wordPos = words[i][j].toLowerCase().indexOf(help.value.toLowerCase());
				window["answer" + maxAnswers].innerHTML = "<span class=\"help-title\">" + words[i][j].substring(0, wordPos) + "<span class=\"match\">" + words[i][j].substr(wordPos, help.value.length) + "</span>" + words[i][j].substring(wordPos + help.value.length) + "</span>: " + answers[i]; // Put the answer in the appropriate div.
				window["example" + maxAnswers].innerHTML = examples[i]; // Put the answer in the appropriate div.
				maxAnswers++; // You can't have more than 3 answers.
				j = words[i].length; // Change the line (to don't have 2 times the same answer).
			}
	switch (maxAnswers) {
		case 1: // Nothing found.
			answer1.innerHTML = "No help found.";
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2); // This is 2 and not 1 to display the result "No help found."
			break;
		case 2: // One answer found.
			resultsContainer.className = "one-result";
			resetAnswerDiv(2);
			break;
		case 3: // Two answers found.
			resultsContainer.className = "two-results";
			resetAnswerDiv(3);
			break;
		case 4: // Three answers found, maximum number possible at the same time.
			resultsContainer.className = "three-results";
			break;
	}
}

function displayAnswers () {
	for (var i = 1; i <= 3; i++) // Reset the results' position.
		if (window["result" + i].className == "result switched")
			window["result" + i].className = "result";

	if (help.value.length == 0)
		resultsContainer.className = "hidden"; // Hide the results container, there is nothing in it if there is nothing written in the help input.
	else {
		if (help.value.length < 3) {
			resultsContainer.className = "one-result no-result";
			if (help.value.length == 1)
				answer1.innerHTML = "Add two more characters"; // The input has to have 3 characters minimum to launch the function.
			else if (help.value.length == 2)
				answer1.innerHTML = "Add one more character"; // The input has to have 3 characters minimum to launch the function.
		}
		else
			answer(); // Find the answers.
	}
}

function resetAnswerDiv(begin) {
	for (var i = begin; i <= 3; i++) { 
		if (window["answer" + i].innerHTML == "")
			i = 3;
		else {
			window["answer" + i].innerHTML = "";
			window["result" + i].className = "result";
			window["example" + i].innerHTML = "";
		}
	}
}

function switchResult (numResult) {
	if (window["result" + numResult].className == "result") // If Markdown style displayed
		window["result" + numResult].className = "result switched";
	else // If corresponding example displayed
		window["result" + numResult].className = "result";
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
var titleInput; // The input for the title of the image

/* Functions variables. 
* startSelect, endSelect, newStarSelect, newEndSelect are created in link.js.
*/

var currentGallery; // Used when the code is searching an image to know where it is.
var galleriesList = []; // List who contains the galleries.
var image; // The content who is added.
var imageLoaded; // The path of the image selected.
var imagePath; // The path of the image.
var imagePosition = 0; // Used to don't keep on the same part of the document.
var imagesArray = new Array(); // All the images on the file.
var imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
var rightFile; // If false the JS is looking for an image.

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
	* modifyImage (): enables the realtime modification of an image.
	* update (): update the list of folders and analyse the files in folders.
	* setBrowserText (imagePath): set the text in the button with the image's path.
	* setImageInputs (): recognizes when the selected text is an image and set the inputs in consequence.
*/

function applyImage () {
	if (altInput.value == "") { // An alternative input is obligatory
		altInput.setAttribute("class", "flash");
		altInput.focus();
		altInput.removeAttribute("class");
	}
	else if (imageLoaded != undefined){ // An image is obligatory
		modifyImage();	
		imageDisplayer.className = "tool-displayer hidden";
		selectElementContents(imageDiv);
		restoreSelection("mado-image");
	}
}

function cancelImage () {
	if (imageDiv != undefined)
		imageDiv.innerText = initialText;		
	imageDisplayer.className = "tool-displayer hidden";
	selectElementContents(imageDiv);
	restoreSelection("mado-image");
	conversion();
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
		rightFile = false;
		imagePath = tempConversion.substring(imagePosition, tempConversion.indexOf("\"", imagePosition));

		if(imagePath.substring(0, 4) != "data") { // The path is not already translated (if the same image is in the file twice).
			if (imagesArray.length > 0){ // Files are already stored.
				for (var i = 0; i < imagesArray.length; i++) { // Search if the image is in the array.
					if(imagesArray[i][0] == imagePath) { // The file is already here.
						tempConversion = tempConversion.replace(new RegExp(imagePath, "g"), imagesArray[i][1]); // Replace the path.		
		    			imagesArray[i][2] = true; // The file has been used.
		    			if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
		    				displayImages();
		    				break;
		    			}
		    			else
	                     	endOfConversion();
		        	}
		        	else if (i == imagesArray.length - 1) // The file isn't here.   	
		    			update(); // Get the ID of the file.
				}       			
			}
			else // The array doesn't exist yet.
				update(); // Get the ID of the file.   	
		}
		else
			displayImages();
	}
	else
		endOfConversion();
}

function fileNotFound () {
	tempConversion = tempConversion.replace(new RegExp(imagePath, "g"), "img/nofile.png"); 
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
		     		if (indx == index && imagePath != undefined && rightFile == false) {// If we're looking for a file.  
		     			item.root.createReader().readEntries(getImages); // Get the images of the folder.
		     		}
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
             	tempConversion = tempConversion.replace(new RegExp(imagePath, "g"), this.result);  
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
	if (titleInput.value == "")
		image = "![" + altInput.value + "](" + imageLoaded + ')';
	else 
		image = "![" + altInput.value + "](" + imageLoaded + " \"" + titleInput.value + "\")";
	if (imageDiv != undefined)
		imageDiv.innerText = image;		
	else
		$(markdown).innerText = $(markdown).innerText + image;		
	conversion();
}

function setImageBrowserText (path) {
	imageBrowser.innerHTML = path;
	if (imageBrowser.innerHTML.length > 15) // Too long to be beautiful.
		imageBrowser.innerHTML = imageBrowser.innerHTML.substring(0, 6) + "(…)" + imageBrowser.innerHTML.substring(imageBrowser.innerHTML.length - 6, imageBrowser.innerHTML.length);
}

function setImageInputs () {
	initialText = imageDiv.innerText;
	if (/!\[.*\]\(.*\)/.test(imageDiv.innerText)) { // An image
		if (/!\[.*\]\(.*\s".*"\)/.test(imageDiv.innerText)) {// Optional title is here.
			titleInput.value = imageDiv.innerText.match(/".*"\)/)[0].substring(1, imageDiv.innerText.match(/".*"\)/)[0].length - 2); 
			imageLoaded = imageDiv.innerText.match(/.*\s"/)[0].substring(2, imageDiv.innerText.match(/.*\s"/)[0].length - 2).replace(/\\/g, "/");
			setImageBrowserText(fileName(imageLoaded));
		}
		else {
			imageLoaded = imageDiv.innerText.match(/\]\(\S+\)/)[0].substring(2, imageDiv.innerText.match(/\]\(\S+\)/)[0].length - 1).replace(/\\/g, "/");
			setImageBrowserText(fileName(imageLoaded));
		}
		altInput.value = imageDiv.innerText.match(/!\[.+\]/)[0].substring(2, imageDiv.innerText.match(/!\[.+\]/)[0].length - 1); 
	}
	
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
		urlInput.setAttribute("class", "flash");
		urlInput.focus();
		urlInput.removeAttribute("class");
	}
	else {
		modifyLink();
		linkDisplayer.className = "tool-displayer hidden";
		selectElementContents(linkDiv);
		restoreSelection("mado-link");
	}
}

function cancelLink () {
	if (linkDiv != undefined)
		linkDiv.innerText = initialText;	

	linkDisplayer.className = "tool-displayer hidden";	
	selectElementContents(linkDiv);
	restoreSelection("mado-link");
	conversion();
}

function modifyLink () {
	if (hypertextInput.value == "")
		link = '[' + urlInput.value + "](" + urlInput.value + ')';
	else 
		link = '[' + hypertextInput.value + "](" + urlInput.value + ')';
	if (linkDiv != undefined)
		linkDiv.innerText = link;		
	else
		$(markdown).innerText = $(markdown).innerText + link;
	conversion();
}

function setLinkInputs () {
	initialText = linkDiv.innerText;
	if (/\[\w*\]\(.*\)/.test(linkDiv.innerText)) {
		urlInput.value = linkDiv.innerText.match(/\(.*\)/)[0].substring(1, linkDiv.innerText.match(/\(.*\)/)[0].length - 1); 
		hypertextInput.value = linkDiv.innerText.match(/\[\w*\]/)[0].substring(1, linkDiv.innerText.match(/\[\w*\]/)[0].length - 1);
	}
	else
		hypertextInput.value = linkDiv.innerText;
}
/* The JS to control the scripts between Mado and the computer. */

/* 
* Variables (in alphabetical order). 
*/

var fileEntry; // This is the variable who stores the file opened.
var lastWidth; // This is the last zier of the window.

/*
* Functions (in alphabetical order).
*
* Resume:
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

function errorHandler() {
	if (fileInLoading != undefined) {
		removeFile(fileInLoading);
		fileInLoading = undefined;
	}
}

function exportFileHTML () {
	marked(markdown.innerText, function (err, content) {
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
	if (markdown.innerText.length > 0) {
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
				minHeight: 240
		  	}
	  	);
  	}
}

function openFile(fileToOpen) {
	fileToOpen.file(
		function(file) {
	 		var reader = new FileReader();
	 		reader.onload = function(e) {
	 			if (markdown.innerText != "") {// Something is already in the markdown, Mado opens a new window. 
	 				chrome.storage.local.set(
		 				{
		 					"tempFileEntry" : chrome.fileSystem.retainEntry(fileToOpen)
		 				}, 
		 				newWindow
	 				);
 				}
	 			else {
		 			markdown.innerText = e.target.result; // Display the file content.	
	 			 			
		 			fileEntry = fileToOpen; // For save.

		 			// For the footer.
		 			markdownSaved = markdown.innerText;
		 			conversion();
		 			nameDiv.innerHTML = fileName(fileToOpen.fullPath) + "&nbsp;-";
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
	 				extensions: ["md", "txt"]
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
				savedFile.createWriter(
					function(writer) {
				 		writer.write(
				 			new Blob(
					 			[markdown.innerText],
								{
									type: "text/plain"
								}
							)
						); 						
						fileEntry = savedFile; // Save without asking the file.
						newRecentFile(fileEntry); // Update the local storage, the file opened is now on top.

						// Footer
						markdownSaved = markdown.innerText;
						checkSaveState();
						nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;-";

						
				 	}, 
				errorHandler);
			}
		}
	);
}

function saveFile () {
	if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;-") // Not saved or not a Markdown file.
		saveAsFile();
	else { // If we have already loaded the file.
		fileEntry.createWriter(
			function(writer) {
		 		writer.write(
		 			new Blob(
			 			[markdown.innerText],
						{
							type: "text/plain"
						}
					)
				); 
				newRecentFile(fileEntry); // Update the position of the file saved.

				// Footer
				markdownSaved = markdown.innerText;
				checkSaveState();
				nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;-";
		 	}, 
		errorHandler);
	}
}

function theMinWidth () {
	/* For the 0.2
	if (screen.width < 1600)
		return 683;
	else
		return 800;
	*/
	return 683;
}

/*
* Chrome methods.
*
* Resume:
	* chrome.app.window.current().onBoundsChanged.addListener (): what to do when the window is resized or moved.
	* chrome.storage.onChanged.addListener (): what to do when a chrome.storage.local variable is changed. 
*/

chrome.app.window.current().onBoundsChanged.addListener(function () {
	if (window.innerWidth < 1366 && switchToBoth.className == "switch-button activated")
		switchToMD.click(); // Markdown is set as default view.
	else if (window.innerWidth >= 1366 && lastWidth < 1366 && windowResizing) 
		switchToBoth.click(); // viewswitch.js

	lastWidth = window.innerWidth;
});

chrome.storage.onChanged.addListener(function (changes, namespace) { // What to do when a storage value is changed.
   	for (key in changes) {
   		if (key == "analytics")
            setTrackingPermission(); // stats.js 
        else if (key == "displaySize")
            newDisplaySize(); // app.js 
        else if (key == "gfm")
            setEditorSyntax(); // editor.js
        else if (key == "resize")
            setWindowResizing(); // viewswitch.js         
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
		titleInput.value = "";
		imageLoaded = undefined;

		if ($(markdown).find("#mado-image").length == 0) { // If the focus is not yet on the contenteditable.
			markdown.focus();
			changeContentHighlighted("mado-image");
		}
		imageDisplayer.className = "tool-displayer";
		imageDiv = document.getElementById("mado-image");
		setImageInputs();
		initialText = titleInput.value;
	}
	else if (imageDisplayer.className == "tool-displayer" && 
		! $(e.target).closest(imageBox).length) {// The user doesn't click on the image insertion box.
		imageDisplayer.className = "tool-displayer hidden";
		selectElementContents(imageDiv);
		restoreSelection("mado-image");
	}

	/* link.js */
	if ($(e.target).closest(linkButton).length && linkDisplayer.className == "tool-displayer hidden") {	
		/* Reset. */
		urlInput.value = "";
		hypertextInput.value = "";
		
		if ($(markdown).find("#mado-link").length == 0) { // If the focus is not yet on the contenteditable.
			markdown.focus();
			changeContentHighlighted("mado-link");
		}
		linkDisplayer.className = "tool-displayer";
		linkDiv = document.getElementById("mado-link");
		setLinkInputs();
		initialText = hypertextInput.value;
		urlInput.focus();			
	}
	else if (linkDisplayer.className == "tool-displayer" && ! $(e.target).closest(linkDisplayer).length) {
		linkDisplayer.className = "tool-displayer hidden";
		selectElementContents(linkDiv);
		restoreSelection("mado-link");
	}

	/* more.js */
	if ($(e.target).closest(moreButton).length && moreDisplayer.className == "hidden") { // Click on moreButton with moreButton hidden.
		moreDisplayer.className = " ";
	}
	else if (moreDisplayer.className != "hidden" && ! $(e.target).closest(moreBox).length)
		moreDisplayer.className = "hidden";

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

/* Functions linked to the Markdown markdown. */

/* 
* Variables (in alphabetical order). 
	* Shortcuts.
	* Global.
*/

/* HTML shortcuts. */
var conversionDiv; // The div who contains the HTML conversion.
var markdown; // The contenteditable where the user writes.
var pasteZone; // The textarea used when the user pastes content.

/* Global. */
var closeDiv; // The end of the div.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var initialText; // A save used when the user cancel a link/image.
var newCE; // The new contenteditable content (temporary).
var openDiv; // The beginning of the div.
var optiMarkdown; // The new Markdown, without useless div.
var pasteDiv; // The div used when the user pastes content.
var range; // Get the user's selection.
var rangeSelection; // Set the user's new range selection.
var savedSel; // The selection is saved here.
var selection; // Set the user's new selection.
var surroundDiv = document.createElement("div"); // Used to add the div to the contenteditable.
var tempTextarea = document.createElement("textarea"); // Used to add the div to the contenteditable.
var tempConversion; // A string used to don't display errors when an image is loaded.
var tempMarkdown; // String used to modify the markdown innerHTML.

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the contenteditable.
	* changeContentHighlighted (id): Add a div with id @param id around the selection. 
	* checkDiv (divCount, content, pos, id): Remove a div from content, @return if it has working and the new content.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* removeDivWithId (id): Remove a div from content via chechDiv (divCount, content, pos, id), use RegExp for strength.
	* restoreSelection (id): Restore the previous elements selected by the user.	
	* selectElementContents(el) : Do weird things with HTML to re-set the selection.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if ((markdown.innerHTML > 4) || (markdown.innerText.length > 0 && markdown.innerHTML != "<br>")) { // There is Markdown in the contenteditable.
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
	else { // No Markdown here.
		markdown.innerHTML = ""; // If the innerHTML is "<br>".
		conversionDiv.innerHTML = "See the result here";
		resetCounter();
		checkSaveState();
	}
}

function changeContentHighlighted (id) {
    range = rangy.getSelection().rangeCount ? rangy.getSelection().getRangeAt(0) : null;
    if (range) {    
        surroundDiv.id = id;
        try {
            range.surroundContents(surroundDiv);
        }
        catch(ex) {
        }
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

	for (var i = 0; i < imagesArray.length; i++) // Remove the images who are not used anymore.
		if (imagesArray[i][2] == false)
			imagesArray = imagesArray.splice(imagesArray[i], 1);

	tempConversion = tempConversion.replace(/<img src=\"img\/nofile.png/g, "<span class=\"nofile-link\"> <span class=\"nofile-visual\">File not found</span>&nbsp;</span><img class=\"nofile\" src=\"img/nofile.png");
	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		if ($(this).attr("href").substring(0,1) != '#' && $(this).attr("href").substring(0,4) != "http") // External link without correct syntax.
			$(this).attr("href", "http://" + $(this).attr("href"));
		$(this).attr("target", "_blank");
	});

	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-link").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-visual").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function pasteContent () {
	changeContentHighlighted("mado-paste");  
	pasteDiv = document.getElementById("mado-paste");      
    pasteZone.focus();

    setTimeout(function(){
        if (pasteDiv != undefined)
            pasteDiv.innerText = pasteZone.value;       
        else
            $(markdown).innerText = $(markdown).innerText + pasteZone.value;
        pasteZone.value = ""; // Reset the hidden textarea content.
        selectElementContents(pasteDiv);
        restoreSelection("mado-paste");
        conversion();
    }, 20);
}

function removeDivWithId (id) {
	tempMarkdown = markdown.innerHTML;
	tempMarkdown = tempMarkdown.replace(/< *div/g, "<div"); // <div
	tempMarkdown = tempMarkdown.replace(/<div *>/g, "<div>"); // <div>
	tempMarkdown = tempMarkdown.replace(/< *\/ *div *>/g, "</div>"); // </div>

	if (tempMarkdown.indexOf("<div id=\"" + id + "\">") != -1) { // Remove the useless div.
		optiMarkdown = checkDiv(0, tempMarkdown, tempMarkdown.indexOf("<div id=\"" + id + "\">"), id);
		if (optiMarkdown[0] != -1) {
			tempMarkdown = optiMarkdown[1];
		}
	}
	markdown.innerHTML = tempMarkdown;
}

function restoreSelection (id) {
	savedSel = rangy.saveSelection();
	removeDivWithId(id);		
	rangy.restoreSelection(savedSel);
	rangy.removeMarkers(savedSel);
}

function selectElementContents(el) {
    if (document.createRange && window.getSelection) {
        rangeSelection = document.createRange();
        selection = window.getSelection();
        selection.removeAllRanges();
        try {
            rangeSelection.seleectNodeContents(el);
            selection.addRange(rangeSelection);
        } catch (e) {
            rangeSelection.selectNode(el);
            selection.addRange(rangeSelection);
        }
    } else if (document.body.createTextRange) {
        rangeSelection = document.body.createTextRange();
        rangeSelection.moveToElementText(el);
        rangeSelection.select();
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

/* Functions who handle Mado's footer. */

/*
* Variables (in alphabetical order).
*/

var charsDiv; // The div who contains the document's chars number.
var nameDiv; // The div who contains the name of the opened document.
var wordsDiv; // The div who contains the document's words number.

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
		charsDiv.style.display = "inline";
		wordsDiv.style.display = "none";
	}
	else {
		charsDiv.style.display = "none";
		wordsDiv.style.display = "inline";
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

var answer1, answer2, answer3; // The divs who contain the answers.
var answersContainer; // The div who contains the answers displayed.
var example1, example2, example3; // The divs who contain the examples.
var help; // The input where the user writes what he wants.
var helpButton; // The help button.
var helpDisplayer; // The div who contains all the help divs.
var maxAnswers; // Check the number of answers displayed, max = 3.
var result1, result2, result3; // The divs who contain the results.
var resultsContainer; // Will contain the HTML results container.
var resultSwitch1, resultSwitch2, resultSwitch3; // The divs who contain the result switchs.
var wordPos; // Shortcut for "words[i][j].toLowerCase().indexOf(help.value.toLowerCase());".

var words = [ // All the words that can be used on the help input, each line corresponding to the same line in 'answers'.
	// Headers
	["Headers", "Titles"],

	// Emphasys
	["Bold", "Strong emphasis"],
	["Italic", "Emphasis"],
	["Bold italic", "Combined emphasis"],

	// Lists 
	["Ordered lists"],
	["Unordered lists"],

	// Links 
	["Inline-style links"],
	["Reference-style links"],

	// Images 
	["Images (inline)", "Pictures (inline)"],
	["Images (reference-style)", "Pictures (reference-style)"],

	// Code and Syntax Highlighting
	["Blocks of code"],

	// Tables

	// Blockquotes
	["Blockquotes"],

	// Inline HTML
	["Inline HTML", "HTML in Markdown"],

	// Horizontal Rules
	["Horizontal rules"],

	// Line Breaks
	["Line breaks"],

	// Joke
	["Question"]
];

var answers = [ // The answers displayed.
	// Headers
	["Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6)."],

	// Emphasys
	["<span class=\"help-code\">**bold**</span> or <span class=\"help-code\">__bold__</span>"],
	["<span class=\"help-code\">*italic*</span> or <span class=\"help-code\">_italic_</span>"],
	["<span class=\"help-code\">**_ bold italic_**</span> or <span class=\"help-code\">*__bold italic__*</span> or <span class=\"help-code\">***this***</span> or <span class=\"help-code\">___this___</span>"],

	// Lists 
	["1. First ordered list item. <br>2. Another item."],
	["* An item. <br>* A second item (you can also use + or -)."],

	// Links 
	["<span class=\"help-code\">[Hypertext](http://url.com)</span><br>(Also works with a local path.)"], // TODO : Change the link
	["<span class=\"help-code\">[Hypertext][1]<br>[1]: http://url.com</span>"],

	// Images
	['<span class=\"help-code\">![alt text](path/to/image.jpg "Title")</span>'], 
	['<span class=\"help-code\">![alt text][image Id] <br> [image Id]: path/to/image.jpg "Title"</span>'],

	// Code and Syntax Highlighting
	["<span class=\"help-code\">```Text between three back-ticks is a block of code.```<br>&nbsp;&nbsp;&nbsp;&nbsp;Text after four spaces is also a block of code.</span>"],

	// Tables

	// Blockquotes
	["> Blockquotes only need <span class=\"help-code\">></span> to work. <br><br> <span class=\"help-code\">> Two blockquotes without a break (a line who isn't a blockquote)  are a single quote.</span>"],

	// Inline HTML
	["<span class=\"help-code\">It &lt;strong>works&lt;/strong>.</span>"],

	// Horizontal Rules
	["<span class=\"help-code\">*** <br> You can use Hyphens, asterisks or underscores. <br> ---</span>"],

	// Line Breaks
	["To separate two paragraphs, press <span class=\"help-code\">Enter</span> twice.<br><br>And you have a new paragraph."],

	// Joke
	["Seriously?"]
];

var examples = [
	// Headers
	["Six sizes available, the size depends on the numbers of #.<h1 id=\"big-title-size-1-the-biggest-\">Big title (size 1, the biggest).</h1><h4 id=\"a-less-impresive-title-size-4-on-6-br-\">A less impresive title (size 4 on 6).</h4>"],

	// Emphasys
	["<strong>Bold</strong>"],
	["<em>Italic</em>"],
	["<strong><em>Bold italic</em></strong>"],

	// Lists TODO
	["<ol><li>First ordered list item</li><li>Another item.</li></ol>"],
	["<ul><li>An item. </li><li>A second item (you can also use + or -).</li></ul>"],

	// Links 
	["<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"], // TODO : Change the link
	["<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"],

	// Images
	["<div class=\"example-image\"></div>"],
	["<div class=\"example-image\"></div>"],

	// Code and Syntax Highlighting
	["<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"],

	// Tables

	// Blockquotes
	["<blockquote>Blockquotes only need &gt; to work. To separate two blockquotes, insert a blank line between them.</blockquote>"],

	// Inline HTML
	["It <strong>works<strong>"],

	// Horizontal Rules
	["<hr> You can use Hyphens, asterisks or underscores.<hr>"],

	// Line Breaks
	["<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"],

	// Joke
	["Life's most persistent and urgent question is, 'What are you doing for others?'."]
];

/*
* Functions (in alphabetical order).
*
* Resume:
	* activateHelp (): show the help input and focus when the help button is clicked.
	* answer (): find the answers and the examples for the question.
	* displayAnswers (): display the answers.
	* resetAnswerDiv (): clear the Help divs.
	* switchResult (result number): show the answer or the example when the user click on a switch.
*/

function activateHelp () { // Show the help input and focus when the help button is clicked. MAYBE USELESS
	if (helpDisplayer.className == "hidden") {
		helpDisplayer.className = " ";
    	help.focus();
	}	
}

function answer () {
	maxAnswers = 1; // Reset the number of answers that can be diplayed (max: 4)
	for (var i = 0; i < words.length && maxAnswers < 4; i++) // A line = a syntax, this loop runs through each line.
		for (var j = 0; j < words[i].length; j++) // A line can have many columns (different ways to say the same thing), this loop run through each column.
			if (words[i][j].toLowerCase().indexOf(help.value.toLowerCase()) != -1) { // Everything in lower case to help the condition.
				wordPos = words[i][j].toLowerCase().indexOf(help.value.toLowerCase());
				window["answer" + maxAnswers].innerHTML = "<span class=\"help-title\">" + words[i][j].substring(0, wordPos) + "<span class=\"match\">" + words[i][j].substr(wordPos, help.value.length) + "</span>" + words[i][j].substring(wordPos + help.value.length) + "</span>: " + answers[i]; // Put the answer in the appropriate div.
				window["example" + maxAnswers].innerHTML = examples[i]; // Put the answer in the appropriate div.
				maxAnswers++; // You can't have more than 3 answers.
				j = words[i].length; // Change the line (to don't have 2 times the same answer).
			}
	switch (maxAnswers) {
		case 1: // Nothing found.
			answer1.innerHTML = "No help found.";
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2); // This is 2 and not 1 to display the result "No help found."
			break;
		case 2: // One answer found.
			resultsContainer.className = "one-result";
			resetAnswerDiv(2);
			break;
		case 3: // Two answers found.
			resultsContainer.className = "two-results";
			resetAnswerDiv(3);
			break;
		case 4: // Three answers found, maximum number possible at the same time.
			resultsContainer.className = "three-results";
			break;
	}
}

function displayAnswers () {
	for (var i = 1; i <= 3; i++) // Reset the results' position.
		if (window["result" + i].className == "result switched")
			window["result" + i].className = "result";

	if (help.value.length == 0)
		resultsContainer.className = "hidden"; // Hide the results container, there is nothing in it if there is nothing written in the help input.
	else {
		if (help.value.length < 3) {
			resultsContainer.className = "one-result no-result";
			if (help.value.length == 1)
				answer1.innerHTML = "Add two more characters"; // The input has to have 3 characters minimum to launch the function.
			else if (help.value.length == 2)
				answer1.innerHTML = "Add one more character"; // The input has to have 3 characters minimum to launch the function.
		}
		else
			answer(); // Find the answers.
	}
}

function resetAnswerDiv(begin) {
	for (var i = begin; i <= 3; i++) { 
		if (window["answer" + i].innerHTML == "")
			i = 3;
		else {
			window["answer" + i].innerHTML = "";
			window["result" + i].className = "result";
			window["example" + i].innerHTML = "";
		}
	}
}

function switchResult (numResult) {
	if (window["result" + numResult].className == "result") // If Markdown style displayed
		window["result" + numResult].className = "result switched";
	else // If corresponding example displayed
		window["result" + numResult].className = "result";
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
var titleInput; // The input for the title of the image

/* Functions variables. 
* startSelect, endSelect, newStarSelect, newEndSelect are created in link.js.
*/

var currentGallery; // Used when the code is searching an image to know where it is.
var galleriesList = []; // List who contains the galleries.
var image; // The content who is added.
var imageLoaded; // The path of the image selected.
var imagePath; // The path of the image.
var imagePosition = 0; // Used to don't keep on the same part of the document.
var imagesArray = new Array(); // All the images on the file.
var imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
var rightFile; // If false the JS is looking for an image.

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
	* modifyImage (): enables the realtime modification of an image.
	* update (): update the list of folders and analyse the files in folders.
	* setBrowserText (imagePath): set the text in the button with the image's path.
	* setImageInputs (): recognizes when the selected text is an image and set the inputs in consequence.
*/

function applyImage () {
	if (altInput.value == "") { // An alternative input is obligatory
		altInput.setAttribute("class", "flash");
		altInput.focus();
		altInput.removeAttribute("class");
	}
	else if (imageLoaded != undefined){ // An image is obligatory
		modifyImage();	
		imageDisplayer.className = "tool-displayer hidden";
		selectElementContents(imageDiv);
		restoreSelection("mado-image");
	}
}

function cancelImage () {
	if (imageDiv != undefined)
		imageDiv.innerText = initialText;		
	imageDisplayer.className = "tool-displayer hidden";
	selectElementContents(imageDiv);
	restoreSelection("mado-image");
	conversion();
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
		rightFile = false;
		imagePath = tempConversion.substring(imagePosition, tempConversion.indexOf("\"", imagePosition));

		if(imagePath.substring(0, 4) != "data") { // The path is not already translated (if the same image is in the file twice).
			if (imagesArray.length > 0){ // Files are already stored.
				for (var i = 0; i < imagesArray.length; i++) { // Search if the image is in the array.
					if(imagesArray[i][0] == imagePath) { // The file is already here.
						tempConversion = tempConversion.replace(new RegExp(imagePath, "g"), imagesArray[i][1]); // Replace the path.		
		    			imagesArray[i][2] = true; // The file has been used.
		    			if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
		    				displayImages();
		    				break;
		    			}
		    			else
	                     	endOfConversion();
		        	}
		        	else if (i == imagesArray.length - 1) // The file isn't here.   	
		    			update(); // Get the ID of the file.
				}       			
			}
			else // The array doesn't exist yet.
				update(); // Get the ID of the file.   	
		}
		else
			displayImages();
	}
	else
		endOfConversion();
}

function fileNotFound () {
	tempConversion = tempConversion.replace(new RegExp(imagePath, "g"), "img/nofile.png"); 
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
		     		if (indx == index && imagePath != undefined && rightFile == false) {// If we're looking for a file.  
		     			item.root.createReader().readEntries(getImages); // Get the images of the folder.
		     		}
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
             	tempConversion = tempConversion.replace(new RegExp(imagePath, "g"), this.result);  
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
	if (titleInput.value == "")
		image = "![" + altInput.value + "](" + imageLoaded + ')';
	else 
		image = "![" + altInput.value + "](" + imageLoaded + " \"" + titleInput.value + "\")";
	if (imageDiv != undefined)
		imageDiv.innerText = image;		
	else
		$(markdown).innerText = $(markdown).innerText + image;		
	conversion();
}

function setImageBrowserText (path) {
	imageBrowser.innerHTML = path;
	if (imageBrowser.innerHTML.length > 15) // Too long to be beautiful.
		imageBrowser.innerHTML = imageBrowser.innerHTML.substring(0, 6) + "(…)" + imageBrowser.innerHTML.substring(imageBrowser.innerHTML.length - 6, imageBrowser.innerHTML.length);
}

function setImageInputs () {
	if (/!\[.*\]\(.*\)/.test(imageDiv.innerText)) { // An image
		if (/!\[.*\]\(.*\s".*"\)/.test(imageDiv.innerText)) {// Optional title is here.
			titleInput.value = imageDiv.innerText.match(/".*"\)/)[0].substring(1, imageDiv.innerText.match(/".*"\)/)[0].length - 2); 
			imageLoaded = imageDiv.innerText.match(/.*\s"/)[0].substring(2, imageDiv.innerText.match(/.*\s"/)[0].length - 2).replace(/\\/g, "/");
			setImageBrowserText(fileName(imageLoaded));
		}
		else {
			imageLoaded = imageDiv.innerText.match(/\]\(\S+\)/)[0].substring(2, imageDiv.innerText.match(/\]\(\S+\)/)[0].length - 1).replace(/\\/g, "/");
			setImageBrowserText(fileName(imageLoaded));
		}
		altInput.value = imageDiv.innerText.match(/!\[.+\]/)[0].substring(2, imageDiv.innerText.match(/!\[.+\]/)[0].length - 1); 
	}
	
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
		urlInput.setAttribute("class", "flash");
		urlInput.focus();
		urlInput.removeAttribute("class");
	}
	else {
		modifyLink();
		linkDisplayer.className = "tool-displayer hidden";
		selectElementContents(linkDiv);
		restoreSelection("mado-link");
	}
}

function cancelLink () {
	if (linkDiv != undefined)
		linkDiv.innerText = initialText;	

	linkDisplayer.className = "tool-displayer hidden";	
	selectElementContents(linkDiv);
	restoreSelection("mado-link");
	conversion();
}

function modifyLink () {
	if (hypertextInput.value == "")
		link = '[' + urlInput.value + "](" + urlInput.value + ')';
	else 
		link = '[' + hypertextInput.value + "](" + urlInput.value + ')';
	if (linkDiv != undefined)
		linkDiv.innerText = link;		
	else
		$(markdown).innerText = $(markdown).innerText + link;
	conversion();
}

function setLinkInputs () {
	if (/\[\w*\]\(.*\)/.test(linkDiv.innerText)) {
		urlInput.value = linkDiv.innerText.match(/\(.*\)/)[0].substring(1, linkDiv.innerText.match(/\(.*\)/)[0].length - 1); 
		hypertextInput.value = linkDiv.innerText.match(/\[\w*\]/)[0].substring(1, linkDiv.innerText.match(/\[\w*\]/)[0].length - 1);
	}
	else
		hypertextInput.value = linkDiv.innerText;
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
/* All the things to do when mado.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
    /*
    * Shortcuts (JS files in alphabetical order).
    */

    /* app.js */
    exportButton = document.getElementById("export");
    newButton = document.getElementById("new");
    openButton = document.getElementById("open");
    recentButton = document.getElementById("recent");
    saveButton = document.getElementById("save");
    saveAsButton = document.getElementById("save-as");
    
    /* editor.js */
    conversionDiv = document.getElementById("html-conversion");
    markdown = document.getElementById("markdown");   
    pasteZone = document.getElementById("paste-zone");
    
    /* footer.js */
    charsDiv = document.getElementById("character-nb");
    nameDiv = document.getElementById("doc-name");   
    wordsDiv = document.getElementById("word-nb");
    
    /* help.js */ 
    help = document.getElementById("help-input");
    helpButton = document.getElementById("help-button");
    helpDisplayer = document.getElementById("help-input-displayer");
    for (var i = 1; i <= 3; i++) {
        window["answer" + i] = document.getElementById("answer-" + i);
        window["example" + i] = document.getElementById("example-" + i);
        window["result" + i] = document.getElementById("result-" + i);
        window["resultSwitch" + i] = document.getElementById("result-switch-" + i);
    }
    resultsContainer = document.getElementById("help-results-container");

    /* image.js */
    cancelImageButton = document.getElementById("cancel-image");
    galleriesButton = document.getElementById("galleries-button");
    imageButton = document.getElementById("image-button");
    imageDisplayer = document.getElementById("image-insertion-displayer");
    imageBox = document.getElementById("image-insertion-box");
    imageBrowser = document.getElementById("browse-image");
    altInput = document.getElementById("alt-input");
    titleInput = document.getElementById("title-input");

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
    workspace = document.getElementById("workspace");
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
                                markdown.innerText = e.target.result;
                                markdownSaved = markdown.innerText;
                                conversion();  
                                nameDiv.innerHTML = fileName(fileEntry.fullPath) + "&nbsp;-";                     
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
    Mousetrap.bind(['command+n', 'ctrl+n'], function(e) { newWindow(); return false; }); // Ctrl+n = new window.
    
    $(openButton).on("click", openFileButton);
    Mousetrap.bind(['command+o', 'ctrl+o'], function(e) { openFileButton(); return false; }); // Ctrl+o = open.
    
    $(saveButton).on("click", saveFile);
    Mousetrap.bind(['command+s', 'ctrl+s'], function(e) { saveFile(); return false; }); // Ctrl+s = save.
    
    $(saveAsButton).on("click", saveAsFile);
    Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], function(e) { saveAsFile(); return false; }); // Ctrl+shift+s = save as.
    
    $(exportButton).on("click", exportFileHTML);

    /* editor.js */    
    setEditorSyntax(); // A conversion is made when the window is opened.
    charsDiv.style.display = "none"; // On launch we just display the number of words.

    $(markdown).focus();
    $(markdown).on("input propertychange", conversion);
    $(markdown).bind('paste', function(){ // What to do if the user pastes something.
        pasteContent();   
    });
    $(markdown).keydown(function(e){
        if (e.keyCode == 9) // The user press tab        
            e.preventDefault();
    });  

    /* footer.js */
    $(charsDiv).on("click", counterSelection);
    $(wordsDiv).on("click", counterSelection);

    /* help.js */ 
    Mousetrap.bind(['command+h', 'ctrl+h'], function(e) { $(helpButton).click(); return false; }); // Ctrl+h = display the help.
    $(help).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(helpButton).click();
    });
    $(help).on("input propertychange", displayAnswers); // Launch the help when something is typed on the input.

    $(resultSwitch1).on("click", function() { switchResult("1"); });
    $(resultSwitch2).on("click", function() { switchResult("2"); });
    $(resultSwitch3).on("click", function() { switchResult("3"); });

    /* image.js */
    $(imageButton).on("mousedown", function() {
        changeContentHighlighted("mado-image");
    });

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

    $(titleInput).keydown(function(e){
        if (e.keyCode == 9) { // The user press tab
            e.preventDefault();
            $(altInput).select();
        }
    })
    $(titleInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
            applyImage();
        else if (e.keyCode == 27) // The user press echap
            cancelImage();
        else
            modifyImage();
    });

    $(cancelImageButton).on("click", cancelImage);

    /* link.js */
    $(linkButton).on("mousedown", function() {
        changeContentHighlighted("mado-link");
    });
    
    Mousetrap.bind(['command+k', 'ctrl+k'], function(e) { // Ctrl+k = link.
        changeContentHighlighted("mado-link");
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

    /* More.js */
    $(settingsLine).on("click", function() { moreWindow("more/settings.html"); });
    $(qAndALine).on("click", function() { moreWindow("more/qanda.html"); });
    $(shortcutsLine).on("click", function() { moreWindow("more/shortcuts.html"); });
    $(aboutLine).on("click", function() { moreWindow("more/about.html"); });

    /* recentfiles.js */
    displayRecentFiles();
    
    /* stats.js 
    * Waiting for the prod.
    
    if (navigator.onLine)
        initStats();
    */

    /* styles.js */
    getStyle();

    $(homeRadio).on("click", function() { setStyle("home"); });
    $(clinicRadio).on("click", function() { setStyle("clinic"); });
    $(tramwayRadio).on("click", function() { setStyle("tramway"); });

    /* viewswitch.js */
    initActivation(); // Initializing the workspace and the switch.
    setWindowResizing();

    // Getting and setting the click event on each of the switch buttons.
    $(switchToMD).on("click", function() { activate(this.id, "markdown-view"); });
    $(switchToBoth).on("click", function() { activate(this.id, "normal"); });
    $(switchToHTML).on("click", function() { activate(this.id, "conversion-view"); });
    Mousetrap.bind(['command+alt+left', 'ctrl+alt+left'], function(e) { switchShortcuts("left"); return false; }); // Ctrl+k = link.
    Mousetrap.bind(['command+alt+right', 'ctrl+alt+right'], function(e) { switchShortcuts("right"); return false; }); // Ctrl+k = link.

    /* window.js */
    determineFrame();

    $(quitCloseButton).on("click", quitCloseWindow);
    $(saveQuitCloseButton).on("click", saveQuitCloseWindow);

    $(windowClose).on("click", closeWindow);
    Mousetrap.bind(['command+w', 'ctrl+w'], function(e) { closeWindow(); return false; }); // Ctrl+w = close.

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
									if (fileToOpen) // The file is real.
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
		    	footerHelp.setAttribute("class", "clear-all"); // 
		    	footerHelp.innerHTML = "Clear all";
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
/* The JS to send data to Analytics. */

/* 
* Variables (in alphabetical order). 
*/

var service;
var tracker;

/*
* Functions (in alphabetical order).
*
* Resume:
	* initStats (): create a new service for Analytics.
	* setTrackingPermission (analyticsService): set the tracking permission.
*/


function initStats () {
    // Initialize the Analytics service object with the name of your app.
    service = analytics.getService("Mado");

    setTrackingPermission();

    // Get a Tracker using your Google Analytics app Tracking ID.
    tracker = service.getTracker("UA-45134408-1"); // Need to change for the real ID.

    // Record an "appView" each time the user launches your app or goes to a new
    // screen within the app.
    tracker.sendAppView("mainWindow");
}

function setTrackingPermission () {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != undefined) 
			service.n.setTrackingPermitted(mado["analytics"]);
		else {
			chrome.storage.local.set({ "analytics" : true });
			service.n.setTrackingPermitted(true);
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

			$(conversionDiv).attr("class", mado["style"]);			
		}
		else {
			homeRadio.checked = true;
			setStyle ("home");
		}
	});
}

function setStyle (newStyle) {
	chrome.storage.local.set({ "style" : newStyle }, function () {
		$(conversionDiv).attr("class", newStyle);
	});
}
/* This document handles the view switch on the topbar. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var switchToBoth; // Both switch.
var switchToHTML; // HTML switch.
var switchToMD; // Markdown switch.
var workspace; // Getting the main container (workspace).

/* Functions variables. */
var previousSize; // The previous size of the window.
var switchButtons = new Array(); // The array for the switch. 
var windowResizing; // Get the storage variable "resize".

/*
* Functions (in alphabetical order).
*
* Resume:
	* activate (buttonClicked, stateOfTheClass): handles the behavior of a switch button when it is clicked. The function sets the main container's class name according to the button.
	* initActivation (): initalize the switch's look on Mado's launch.
	* setWindowResizing (): set the storage variable "resize".
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
}

function initActivation () { 
	if (chrome.app.window.current().getBounds().width > 1365) // Big window
		switchToBoth.className = "switch-button activated";
	else {
		switchToMD.className = "switch-button activated";
		workspace.className = "markdown-view";
	}

	previousSize = chrome.app.window.current().getBounds().width; // Setting the size of the window, forbid the resize() function to be launched before the complete loading.
}

function setWindowResizing () {
	chrome.storage.local.get("resize",  function(mado) {
		if (mado["resize"] != undefined)			
			windowResizing = mado["resize"];
		else {
			chrome.storage.local.set({ "resize" : true });
			windowResizing = true;
		}
	});
}

function switchShortcuts (direction) {
	if (window.innerWidth > 1365) { // Normal window
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
var markdownSaved; // The last Markdown text saved.
var quitCloseButton; // The "No, don't save" button.
var saveQuitCloseButton; // The "Save and exit" button.
var saveState; // The div who displays if the document is saved or not.
var stylesheetLink = document.createElement("link"); // Create a "link" node.
var windowCloseContainer; // The close container.
var windowClose; // The close button.
var windowMax; // The maximize button.
var windowMin; // The minimize button.

/* Functions variable. */
var bounds; // This is the variable who stores the bounds when the window is maximised.

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
	if (markdown.innerText != "") {
		if ((markdownSaved == undefined) || (markdown.innerText != markdownSaved))
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
	else 
		chrome.app.window.current().close();
}

function determineFrame () {
	stylesheetLink.setAttribute("rel", "stylesheet");
	stylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac window bar styles.
		stylesheetLink.setAttribute("href", "css/window-bar-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
		windowMax.setAttribute("class", "cta little-icon-mac-maximize");
		windowMin.setAttribute("class", "cta little-icon-mac-minimize");
	}
	else { // If the user is on another type of computer, redirect to the generic window bar styles.
		stylesheetLink.setAttribute("href", "css/window-bar-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
		windowMax.setAttribute("class", "cta little-icon-win-maximize");
		windowMin.setAttribute("class", "cta little-icon-win-minimize");
	}

	head.appendChild(stylesheetLink); // Append the link node to the "head" section.
}

function maximizeWindow () {
	if (! chrome.app.window.current().isMaximized()) { // Save the bounds and maximize.
		bounds = chrome.app.window.current().getBounds();
		chrome.app.window.current().maximize();
	}
	else // Restore the last bounds.
		chrome.app.window.current().setBounds(bounds);
}

function minimizeWindow () {
	chrome.app.window.current().minimize();
}

function quitCloseWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
	chrome.app.window.current().close();
}

function saveAndQuit () {
	fileEntry.createWriter(
		function(writer) {
	 		writer.write(
	 			new Blob(
		 			[markdown.innerText],
					{
						type: "text/plain"
					}
				)
			); 
			newRecentFile(fileEntry, "quit"); // Update the position of the file saved.
	 	}, 
	errorHandler);
}

function saveAsAndQuit () {
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "document.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(
					function(writer) {
				 		writer.write(
				 			new Blob(
					 			[markdown.innerText],
								{
									type: "text/plain"
								}
							)
						); 		
						newRecentFile(savedFile, "quit"); // Update the local storage, the file opened is now on top.										
				 	}, 
				errorHandler);
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
/* All the things to do when mado.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
    /*
    * Shortcuts (JS files in alphabetical order).
    */

    /* app.js */
    exportButton = document.getElementById("export");
    newButton = document.getElementById("new");
    openButton = document.getElementById("open");
    recentButton = document.getElementById("recent");
    saveButton = document.getElementById("save");
    saveAsButton = document.getElementById("save-as");
    
    /* editor.js */
    conversionDiv = document.getElementById("html-conversion");
    markdown = document.getElementById("markdown");   
    pasteZone = document.getElementById("paste-zone");
    
    /* footer.js */
    charsDiv = document.getElementById("character-nb");
    nameDiv = document.getElementById("doc-name");   
    wordsDiv = document.getElementById("word-nb");
    
    /* help.js */ 
    help = document.getElementById("help-input");
    helpButton = document.getElementById("help-button");
    helpDisplayer = document.getElementById("help-input-displayer");
    for (var i = 1; i <= 3; i++) {
        window["answer" + i] = document.getElementById("answer-" + i);
        window["example" + i] = document.getElementById("example-" + i);
        window["result" + i] = document.getElementById("result-" + i);
        window["resultSwitch" + i] = document.getElementById("result-switch-" + i);
    }
    resultsContainer = document.getElementById("help-results-container");

    /* image.js */
    cancelImageButton = document.getElementById("cancel-image");
    galleriesButton = document.getElementById("galleries-button");
    imageButton = document.getElementById("image-button");
    imageDisplayer = document.getElementById("image-insertion-displayer");
    imageBox = document.getElementById("image-insertion-box");
    imageBrowser = document.getElementById("browse-image");
    altInput = document.getElementById("alt-input");
    titleInput = document.getElementById("title-input");

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
    workspace = document.getElementById("workspace");
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
                                markdown.innerText = e.target.result;
                                markdownSaved = markdown.innerText;
                                conversion();  
                                nameDiv.innerHTML = fileName(fileEntry.fullPath) + "&nbsp;-";                     
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
    Mousetrap.bind(['command+n', 'ctrl+n'], function(e) { newWindow(); return false; }); // Ctrl+n = new window.
    
    $(openButton).on("click", openFileButton);
    Mousetrap.bind(['command+o', 'ctrl+o'], function(e) { openFileButton(); return false; }); // Ctrl+o = open.
    
    $(saveButton).on("click", saveFile);
    Mousetrap.bind(['command+s', 'ctrl+s'], function(e) { saveFile(); return false; }); // Ctrl+s = save.
    
    $(saveAsButton).on("click", saveAsFile);
    Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], function(e) { saveAsFile(); return false; }); // Ctrl+shift+s = save as.
    
    $(exportButton).on("click", exportFileHTML);

    /* editor.js */    
    setEditorSyntax(); // A conversion is made when the window is opened.
    charsDiv.style.display = "none"; // On launch we just display the number of words.

    $(markdown).focus();
    $(markdown).on("input propertychange", conversion);
    $(markdown).bind('paste', function(){ // What to do if the user pastes something.
        pasteContent();   
    });
    $(markdown).keydown(function(e){
        if (e.keyCode == 9) // The user press tab        
            e.preventDefault();
    });  

    /* footer.js */
    $(charsDiv).on("click", counterSelection);
    $(wordsDiv).on("click", counterSelection);

    /* help.js */ 
    Mousetrap.bind(['command+h', 'ctrl+h'], function(e) { $(helpButton).click(); return false; }); // Ctrl+h = display the help.
    $(help).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(helpButton).click();
    });
    $(help).on("input propertychange", displayAnswers); // Launch the help when something is typed on the input.

    $(resultSwitch1).on("click", function() { switchResult("1"); });
    $(resultSwitch2).on("click", function() { switchResult("2"); });
    $(resultSwitch3).on("click", function() { switchResult("3"); });

    /* image.js */
    $(imageButton).on("mousedown", function() {
        changeContentHighlighted("mado-image");
    });

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

    $(titleInput).keydown(function(e){
        if (e.keyCode == 9) { // The user press tab
            e.preventDefault();
            $(altInput).select();
        }
    })
    $(titleInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
            applyImage();
        else if (e.keyCode == 27) // The user press echap
            cancelImage();
        else
            modifyImage();
    });

    $(cancelImageButton).on("click", cancelImage);

    /* link.js */
    $(linkButton).on("mousedown", function() {
        changeContentHighlighted("mado-link");
    });
    
    Mousetrap.bind(['command+k', 'ctrl+k'], function(e) { // Ctrl+k = link.
        changeContentHighlighted("mado-link");
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

    /* More.js */
    $(settingsLine).on("click", function() { moreWindow("more/settings.html"); });
    $(qAndALine).on("click", function() { moreWindow("more/qanda.html"); });
    $(shortcutsLine).on("click", function() { moreWindow("more/shortcuts.html"); });
    $(aboutLine).on("click", function() { moreWindow("more/about.html"); });

    /* recentfiles.js */
    displayRecentFiles();
    
    /* stats.js 
    * Waiting for the prod.
    
    if (navigator.onLine)
        initStats();
    */

    /* styles.js */
    getStyle();

    $(homeRadio).on("click", function() { setStyle("home"); });
    $(clinicRadio).on("click", function() { setStyle("clinic"); });
    $(tramwayRadio).on("click", function() { setStyle("tramway"); });

    /* viewswitch.js */
    initActivation(); // Initializing the workspace and the switch.
    setWindowResizing();

    // Getting and setting the click event on each of the switch buttons.
    $(switchToMD).on("click", function() { activate(this.id, "markdown-view"); });
    $(switchToBoth).on("click", function() { activate(this.id, "normal"); });
    $(switchToHTML).on("click", function() { activate(this.id, "conversion-view"); });
    Mousetrap.bind(['command+alt+left', 'ctrl+alt+left'], function(e) { switchShortcuts("left"); return false; }); // Ctrl+k = link.
    Mousetrap.bind(['command+alt+right', 'ctrl+alt+right'], function(e) { switchShortcuts("right"); return false; }); // Ctrl+k = link.

    /* window.js */
    determineFrame();

    $(quitCloseButton).on("click", quitCloseWindow);
    $(saveQuitCloseButton).on("click", saveQuitCloseWindow);

    $(windowClose).on("click", closeWindow);
    Mousetrap.bind(['command+w', 'ctrl+w'], function(e) { closeWindow(); return false; }); // Ctrl+w = close.

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
									if (fileToOpen) // The file is real.
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
		    	footerHelp.setAttribute("class", "clear-all"); // 
		    	footerHelp.innerHTML = "Clear all";
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
/* The JS to send data to Analytics. */

/* 
* Variables (in alphabetical order). 
*/

var service;
var tracker;

/*
* Functions (in alphabetical order).
*
* Resume:
	* initStats (): create a new service for Analytics.
	* setTrackingPermission (analyticsService): set the tracking permission.
*/


function initStats () {
    // Initialize the Analytics service object with the name of your app.
    service = analytics.getService("Mado");

    setTrackingPermission();

    // Get a Tracker using your Google Analytics app Tracking ID.
    tracker = service.getTracker("UA-45134408-1"); // Need to change for the real ID.

    // Record an "appView" each time the user launches your app or goes to a new
    // screen within the app.
    tracker.sendAppView("mainWindow");
}

function setTrackingPermission () {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != undefined) 
			service.n.setTrackingPermitted(mado["analytics"]);
		else {
			chrome.storage.local.set({ "analytics" : true });
			service.n.setTrackingPermitted(true);
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

			$(conversionDiv).attr("class", mado["style"]);			
		}
		else {
			homeRadio.checked = true;
			setStyle ("home");
		}
	});
}

function setStyle (newStyle) {
	chrome.storage.local.set({ "style" : newStyle }, function () {
		$(conversionDiv).attr("class", newStyle);
	});
}
/* This document handles the view switch on the topbar. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var switchToBoth; // Both switch.
var switchToHTML; // HTML switch.
var switchToMD; // Markdown switch.
var workspace; // Getting the main container (workspace).

/* Functions variables. */
var previousSize; // The previous size of the window.
var switchButtons = new Array(); // The array for the switch. 
var windowResizing; // Get the storage variable "resize".

/*
* Functions (in alphabetical order).
*
* Resume:
	* activate (buttonClicked, stateOfTheClass): handles the behavior of a switch button when it is clicked. The function sets the main container's class name according to the button.
	* initActivation (): initalize the switch's look on Mado's launch.
	* setWindowResizing (): set the storage variable "resize".
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
}

function initActivation () { 
	if (chrome.app.window.current().getBounds().width > 1365) // Big window
		switchToBoth.className = "switch-button activated";
	else {
		switchToMD.className = "switch-button activated";
		workspace.className = "markdown-view";
	}

	previousSize = chrome.app.window.current().getBounds().width; // Setting the size of the window, forbid the resize() function to be launched before the complete loading.
}

function setWindowResizing () {
	chrome.storage.local.get("resize",  function(mado) {
		if (mado["resize"] != undefined)			
			windowResizing = mado["resize"];
		else {
			chrome.storage.local.set({ "resize" : true });
			windowResizing = true;
		}
	});
}

function switchShortcuts (direction) {
	if (window.innerWidth > 1365) { // Normal window
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
var markdownSaved; // The last Markdown text saved.
var quitCloseButton; // The "No, don't save" button.
var saveQuitCloseButton; // The "Save and exit" button.
var saveState; // The div who displays if the document is saved or not.
var stylesheetLink = document.createElement("link"); // Create a "link" node.
var windowCloseContainer; // The close container.
var windowClose; // The close button.
var windowMax; // The maximize button.
var windowMin; // The minimize button.

/* Functions variable. */
var bounds; // This is the variable who stores the bounds when the window is maximised.

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
	if (markdown.innerText != "") {
		if ((markdownSaved == undefined) || (markdown.innerText != markdownSaved))
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
	else 
		chrome.app.window.current().close();
}

function determineFrame () {
	stylesheetLink.setAttribute("rel", "stylesheet");
	stylesheetLink.setAttribute("type", "text/css");

	if (navigator.appVersion.indexOf("Mac") != -1) { // If the user is on a Mac, redirect to the Mac window bar styles.
		stylesheetLink.setAttribute("href", "css/window-bar-mac.css");
		windowClose.setAttribute("class", "cta little-icon-mac-close");
		windowMax.setAttribute("class", "cta little-icon-mac-maximize");
		windowMin.setAttribute("class", "cta little-icon-mac-minimize");
	}
	else { // If the user is on another type of computer, redirect to the generic window bar styles.
		stylesheetLink.setAttribute("href", "css/window-bar-windows.css");
		windowClose.setAttribute("class", "cta little-icon-win-close");
		windowMax.setAttribute("class", "cta little-icon-win-maximize");
		windowMin.setAttribute("class", "cta little-icon-win-minimize");
	}

	head.appendChild(stylesheetLink); // Append the link node to the "head" section.
}

function maximizeWindow () {
	if (! chrome.app.window.current().isMaximized()) { // Save the bounds and maximize.
		bounds = chrome.app.window.current().getBounds();
		chrome.app.window.current().maximize();
	}
	else // Restore the last bounds.
		chrome.app.window.current().setBounds(bounds);
}

function minimizeWindow () {
	chrome.app.window.current().minimize();
}

function quitCloseWindow () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
	    backgroundPage.newBounds(chrome.app.window.current().getBounds());
	});
	chrome.app.window.current().close();
}

function saveAndQuit () {
	fileEntry.createWriter(
		function(writer) {
	 		writer.write(
	 			new Blob(
		 			[markdown.innerText],
					{
						type: "text/plain"
					}
				)
			); 
			newRecentFile(fileEntry, "quit"); // Update the position of the file saved.
	 	}, 
	errorHandler);
}

function saveAsAndQuit () {
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "document.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(
					function(writer) {
				 		writer.write(
				 			new Blob(
					 			[markdown.innerText],
								{
									type: "text/plain"
								}
							)
						); 		
						newRecentFile(savedFile, "quit"); // Update the local storage, the file opened is now on top.										
				 	}, 
				errorHandler);
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