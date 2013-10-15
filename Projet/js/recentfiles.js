var recentButton; // The button that shows the recent files.
var recentFilesDisplayer; // The div that contains the displayer of the recent files.
var recentFilesContainer; // The div that contains the recent files.
var recentFiles = [ // Name of the variables on the local storage.
"recentFile1",  "recentFile2", "recentFile3", "recentFile4", "recentFile5", "recentFile6", "recentFile7",
"recentFileId1", "recentFileId2", "recentFileId3", "recentFileId4", "recentFileId5", "recentFileId6", "recentFileId7"];
var footerHelp;

var fileInLoading;

function newRecentFile (file) { // Add a recent file.
	chrome.storage.local.get( // We have to affect the local storage
		recentFiles, // Get all the recent files.
		function(mado) { 
			for (var i = 1; i <= 7; i++) { // Max : 7
				if (mado["recentFile" + i] == undefined || mado["recentFile" + i] == file.fullPath || i == 7) { // If there's no file here or the file at this position is the file who is set, or it's just the end.
					for (var j = i; j > 1; j--) { // The second loop begins, j -> j - 1.
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
					break; // End of the loop
				}
			}
			// Now the first recent file is empty, we set the ID and the name.
			chrome.storage.local.set({"recentFileId1" : chrome.fileSystem.retainEntry(file)}, function() {}); 	
			chrome.storage.local.set({"recentFile1" : file.fullPath}, function() {});

			displayRecentFiles(); // Update the div.
		}
	);
}

function checkRecentFile (fileNumber) { // Check if the recent files are available for Mado.
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

function displayRecentFiles () { // It just display, no animation.
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

function removeFileInStorage (fileNumber, after) { // Remove a file in the local storage.
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

function removeFile (fileNumber) { // Remove a file with animation, animation -> remove in the storage -> displayRecentFiles().
	document.getElementById("recent-" + fileNumber).setAttribute("class", "recent-file deleted"); // Change the class to do the visual effect.	
	setTimeout(function() { // After the visual effect.		
		removeFileInStorage(fileNumber, "display");
	}, 100);
}

function removeAllFiles () { // Remove all the recent files.
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

function removeAllFilesInStorage (fileNumber) { // Remove all the files in the local storage.
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

$(document).click(function(e) { // Set how to display the div.
	if ($(e.target).closest(recentButton).length && recentFilesDisplayer.className == "hidden") {
		displayRecentFiles(); // If the user remove something from another window.
		recentFilesDisplayer.className = "";
	}

	else if (! $(e.target).closest(recentFilesContainer).length && recentFilesDisplayer.className == "")
		recentFilesDisplayer.className = "hidden";
});