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
		lastMarkdownHeight = markdownContainer.scrollHeight;
	else if(lastMarkdownHeight < markdownContainer.scrollHeight) {
		toTheBottom(); // scroll.js
	}

	conversion();
	if (markdownContainer.scrollHeight > $(markdownContainer).height())
        $(centerLine).css("display", "none");
    else
        $(centerLine).css("display", "block");
    syntaxHighlighting();
}
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
	if (markdown.innerText.length > 0 && (markdown.innerText.length != 916 || markdown.innerHTML != firstMessage)) {
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
  	else if (markdown.innerHTML == firstMessage) {
  		markdown.innerHTML = "";
  		contentChanged();
  		$(markdown).focus();
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
						markdownSaved = markdown.innerText;
						checkSaveState();
						nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;-";
		 				windowTitle.innerHTML = fileName(fileToOpen.fullPath) + " - Mado";
				    };
				    fileWriter.write(new Blob([markdown.innerText], {type: 'plain/text'}));
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
				markdownSaved = markdown.innerText;
				checkSaveState();
		    };
		    fileWriter.write(new Blob([markdown.innerText], {type: 'plain/text'}));
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
	return 683;
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
        else if (key == "highlighting")
            setMarkdownHighlighting(); // syntax-highlighting.js   
    }
});