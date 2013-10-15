/* The JS to control all the scripts for the application (windows, links between the app and the computer) */

/* Used when I have to use storage.local.set. */
var nameContainer = {};
var chromeLocalFile = "";


function errorHandler() {
	console.log("Oups.");
}

function newWindow () {
	if (textarea.value.length > 0) {
		chrome.app.window.create(
			'mado.html', 
			{
			    bounds: {
			    	left: (window.screenX + 20), // To watch this is a new window.
			    	top: (window.screenY + 20), // To watch this is a new window.
			      	width: Math.round(screen.width * 0.85),
			      	height: Math.round(screen.height * 0.85)
			    }, 
			    minWidth:320, 
			    minHeight: 240
		  	}
	  	);
  	}
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

function openFile(fileToOpen) {
	fileToOpen.file(
		function(file) {
	 		var reader = new FileReader();
	 		reader.onload = function(e) {
	 			// To have a working website for Mado, this option is disabled for the moment
	 			if (textarea.value != "") // Something is already in the textarea, Mado opens a new window 
	 				chrome.storage.local.set({'loadedText': e.target.result}, function() { newWindow(); }); // Save the text in the storageArea
	 			else { // Nothing in the textarea. 
		 			textarea.value = e.target.result; // The file is loaded.
		 			conversion();
		 			saveState.innerHTML = "Saved";
		 			document.getElementById("doc-name").innerHTML = fileName(fileToOpen.fullPath);
	 			}
		 		newRecentFile(fileToOpen); // Update the storage, the file opened is now on top.						 	
	 		};
			reader.readAsText(file);
		},
		errorHandler
	);
}

function fileName (path) { // if path is ".../folder/documents/document.md", returns "document".
	return path.substring(path.lastIndexOf('/') + 1); 
}

function launchWithText (loadedText) { // What to do if the user has open a file with already text on his previous window.
	textarea.value = loadedText; // Set what is in the textarea.
	chrome.storage.local.set({"loadedText": " "}, function() {}); // Reset the text in the storageArea.
	conversion();
	saveState.innerHTML = "Saved";
}


function saveFile () { // Waiting fixes by Google
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
						saveState.innerHTML = "Saved";
    					document.getElementById("doc-name").innerHTML = fileName(savedFile.fullPath);

						newRecentFile(savedFile); // Add the file to the "Recent" div.
				 	}, 
				errorHandler);
			}
		}
	);
}

function saveAsFile () { // Save the document in a new file 
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
						saveState.innerHTML = "Saved";
						document.getElementById("doc-name").innerHTML = fileName(savedFile.fullPath);

						newRecentFile(savedFile);
				 	}, 
				errorHandler);
			}
		}
	);
}

function exportFile () { // Export the document in HTML
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




