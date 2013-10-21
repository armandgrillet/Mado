/* The JS to control the scripts between Mado and the computer. */

/* 
* Variable. 
*/

var fileEntry; // This is the variable who stores the file opened.

/*
* Functions (alphabetical order).
*
* Resume:
	* errorHandler (): what to do if something wents wrong when I tried to open a removed file.
	* exportFileHtml (): let the user export its file in HTML.
	* string fileName (entirePath): return a string who is just the name of the file manipulated (with the extension).
	* moreWindow (moreChoice): open the correct window when the user clicks on an element of the "More" dropdown.
	* newDisplaySize: what to do when the user changes the display size on the options.
	* newWindow: open an empty new window, useful for many things (e.g. open a document when you have already something on the first windows's textarea).
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
	marked(textarea.value, function (err, content) {
		chrome.fileSystem.chooseEntry(
			{
				type: "saveFile", 
				suggestedName: "document.html"
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


function moreWindow(choice) {
	chrome.app.window.create(
		choice, 
		{
		    bounds: {
		    	left: Math.round((window.screenX + (($(window).width() - 498) / 2))), // Perfect alignement.
		    	top: Math.round((window.screenY + (($(window).height() - 664) / 2))), // Always perfect.
		      	width: 498,
		      	height: 664
		    }, 
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
	if (textarea.value.length > 0) {
		chrome.app.window.create(
			"mado.html", 
			{
			    bounds: {
			    	left: (window.screenX + 20), // "+ 20" to watch this is a new window.
			    	top: (window.screenY + 20), 
			      	width: window.innerWidth,
			      	height: window.innerHeight
			    }, 
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
	 			if (textarea.value != "") {// Something is already in the textarea, Mado opens a new window. 
	 				chrome.storage.local.set(
		 				{
		 					"tempFileEntry" : chrome.fileSystem.retainEntry(fileToOpen)
		 				}, 
		 				newWindow
	 				);
 				}
	 			else {
		 			textarea.value = e.target.result; // Display the file content.	
	 			 			
		 			fileEntry = fileToOpen; // For save.

		 			// For the footer.
		 			markdownSaved = e.target.result;
		 			conversion();
		 			nameDiv.innerHTML = fileName(fileToOpen.fullPath) + "&nbsp;|";
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
					 			[textarea.value],
								{
									type: "text/plain"
								}
							)
						); 						
						fileEntry = savedFile; // Save without asking the file.

						// Footer
						markdownSaved = textarea.value;
						checkSaveState();
						nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;|";

						newRecentFile(savedFile); // Update the local storage, the file opened is now on top.
				 	}, 
				errorHandler);
			}
		}
	);
}

function saveFile () {
	if (fileEntry == undefined) // Nothing saved yet, we have to ask where the user wants to save the document.
		saveAsFile();
	else { // If we have already loaded the file.
		fileEntry.createWriter(
			function(writer) {
		 		writer.write(
		 			new Blob(
			 			[textarea.value],
						{
							type: "text/plain"
						}
					)
				); 
				// Footer
				markdownSaved = textarea.value;
				checkSaveState();
				nameDiv.innerHTML = fileName(savedFile.fullPath) + "&nbsp;|";
		 	}, 
		errorHandler);
	}
}

function theMinWidth () {
	if (screen.width < 1600)
		return 683;
	else
		return 800;
}

/*
Chrome method.
*/

chrome.storage.onChanged.addListener(function(changes, namespace) { // What to do when a storage value is changed.
   	for (key in changes) {
        if (key == "gfm")
            setEditorSyntax(); // editor.js
        else if (key == "resize")
            setWindowResizing(); // viewswitch.js 
        else if (key == "displaySize")
            newDisplaySize(); // app.js 
    }
});



