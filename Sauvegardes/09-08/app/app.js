/* The JS to control all the scripts for the application (windows, links between the app and the computer) */

/* Generic functions */
function errorHandler(e) {
  	console.error("Problem");
}

function readAsText(fileEntry, callback) {
  	fileEntry.file(
	  	function(file) {
		    var reader = new FileReader();

		    reader.onerror = errorHandler;
		    reader.onload = function(e) {
		      	callback(e.target.result);
		    };
		    reader.readAsText(file);
	  	}
  	);
}

/* Proper functions */
function newWindow () {
	chrome.app.window.create(
		'mado.html', 
		{
		    bounds: {
		      	width: Math.round(screen.width*0.8),
		      	height: Math.round(screen.height*0.8)
		    }, 
		    minWidth:320, 
		    minHeight: 240
	  	}
  	);
}

function openFile () {		
    chrome.fileSystem.chooseEntry(
    	{
	 		type: "openWritableFile", 
	 		accepts:[
	 			{
	 				extensions: ["md"]
	 			}
	 		] 
		}, 
		function(loadedFile) {
			if (loadedFile) {
		 		loadedFile.file(
		 			function(file) {
				 		var reader = new FileReader();
				 		reader.onload = function(e) {
				 			if (textarea.value != "") // Something is already in the textarea, Mado opens a new window 
				 				chrome.storage.sync.set({'loadedText': e.target.result}, function() {newWindow();}); // Save the text in the storageArea
				 			else { // Nothing in the textarea 
						 		textarea.value = e.target.result; // The file is loaded
						 		conversion();
						 		saveState.innerHTML = "Saved";
						 	}
				 		};
						reader.readAsText(file);
			 		},
		 		errorHandler);
	 		}
		}
	);
}

function launchWithText (loadedText) { // What to do if the user has open a file with already text on his previous window
	textarea.value = loadedText; // Set what is in the textarea
	chrome.storage.sync.set({'loadedText': " "}, function() {}); // Reset the text in the storageArea
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
				 	}, 
				errorHandler);
			}
		}
	);
}

function exportFile () { // Export the document in HTML
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
		 						[conversionDiv.innerHTML],
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
}




