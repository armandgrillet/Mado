// Thanks to be here, this is the js for Restore.

// Shortcuts variables, see the onload function to learn more.
var createButton;
var fileRestorable;
var fileContent;


function errorHandler() {
	console.log("Meow.");
}

function display () {
	chrome.storage.local.get(
		["recentFile", "recentFileId"],
		function (restore) { // If 
			chrome.fileSystem.isRestorable(
				restore.recentFileId, 
				function (isRestorable){ 
					fileRestorable.innerHTML = isRestorable; // If the file is removed, it heeps to say yes. This is the bug!
					chrome.fileSystem.restoreEntry(
						restore["recentFileId"],
						function (fileToOpen) {
 							openFile(fileToOpen); // We open the file, if the file is deleted it returns nothing, not even an error.
 						}
 					);
				}
			);
		}
	);
}

function openFile(fileToOpen) { // Basic stuff, the bug isn't here.
	fileToOpen.file(
		function(file) {
	 		var reader = new FileReader();
	 		reader.onload = function(e) {
	 			fileContent.innerHTML = e.target.result; // The file is loaded.					 	
	 		};
			reader.readAsText(file);
		},
		errorHandler
	);
}

function fileCreation () { // Basic stuff, the bug isn't here.
	chrome.fileSystem.chooseEntry(
		{
			type: "saveFile", 
			suggestedName: "fileToRemove.md"
		}, 
		function(savedFile) {
			if (savedFile) {
				savedFile.createWriter(
					function(writer) {
				 		writer.write(
				 			new Blob(
					 			["I have to be deleted"],
								{
									type: "text/plain"
								}
							)
						); 
						chrome.storage.local.set({"recentFileId" : chrome.fileSystem.retainEntry(savedFile)}, function() {}); 	
						chrome.storage.local.set({"recentFile" : savedFile.fullPath}, function() {});
						display();
				 	}, 
				errorHandler);
			}
		}
	);
}

window.onload = function() {
	// Shortcuts to have a cleaner code.
	createButton = document.getElementById("create-button");
	fileRestorable = document.getElementById("the-problem-is-here");
	fileContent = document.getElementById("file-content");
	removeButton = document.getElementById("remove-button");

	display(); // If the file is on the local storage it show the file when you launch the app.

	createButton.addEventListener("click", function() { fileCreation(); }, false); // Basic event listener to create a file when you click on the button.
}