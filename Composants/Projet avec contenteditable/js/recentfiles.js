var recentButton; // The button that shows the recent files.
var recentFilesDisplayer; // The div that contains the displayer of the recent files.
var recentFilesContainer; // The div that contains the recent files.
var recentFiles = ["recentFile1", "recentFileId1", "recentFile2", "recentFileId2", "recentFile3", "recentFileId3", "recentFile4", "recentFileId4", "recentFile5", "recentFileId5", "recentFile6", "recentFileId6", "recentFile7", "recentFileId7"];
var footerHelp = document.createElement("li");

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

function checkRecentFiles () { // Appends on load.
	chrome.storage.local.get(
		recentFiles,  
		function(mado) { 
			for (var i = 1; i <= 7; i++) { // Max of recent files : 7, we check everything.
				if (mado["recentFile" + i] != undefined) { // A file is at this position.					
					chrome.fileSystem.isRestorable(mado["recentFileId" + i], function (isRestorable){ // We checked if it's still restorable.
						if (! isRestorable) { // If it's not restorable.
							removeFileInStorage(i); // We remove this file.
							i--; // If i is removed and i + 1 is now i, we have to checked i.
						}
			    	});
			    }
			    else
			    	break; // End of the loop.
		    }
	    }        
    ); 	
}

function displayRecentFiles () { // It just display, no animation.
	recentFilesContainer.innerHTML = " "; // Reset.
	chrome.storage.local.get(
		recentFiles,  
		function(mado) { 
			for (var i = 1; i <= 7; i++) {
				if (mado["recentFile" + i] != undefined) // There's a file at this position, time to create a div for the file.
					recentFilesContainer.innerHTML += "<li class=\"recent-file\" id=\"recent-" + i + "\"><div class=\"recent-file-wrapped\"><p>" + fileName(mado["recentFile" + i].toString()) + "</p><div class=\"delete-recent-button little-icon-delete\" id=\"delete-button-" + i + "\"></div></div></li>"; // create the button remove     
	    		else
	    			break; // End of the loop.    		
		 	}
		 	$(".recent-file").on("click", function(e) { // The user clicks on a recent file.
		 		if (! $(e.target).closest("#delete-button-" + this.id.charAt(this.id.length-1)).length) { 
			 		chromeLocalFile = "recentFileId" + this.id.charAt(this.id.length-1); // Get a var with the name of the file clicked.
			 		chrome.storage.local.get(
			 			chromeLocalFile, // We get the file.
			 			function(mado) {
			 				chrome.fileSystem.restoreEntry(mado[chromeLocalFile], function (recentFile) {
			 					openFile(recentFile); // We open the file.
			 					recentFilesDisplayer.className = "hidden";
			 				});
		 				}
			 		);
		 		}
		 	});
		 	$(".delete-recent-button").on("click", function() { removeFile(this.id.charAt(this.id.length-1)); }); // Add the event listeners for the remove buttons.

		 	/* Footer */
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

function removeFileInStorage (fileNumber) {
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
			}				
		}	
	);
}

function removeFile (fileNumber) { // Remove a file with animation, animation -> remove in the storage -> displayRecentFiles().
	document.getElementById("recent-" + fileNumber).setAttribute("class", "recent-file deleted"); // Change the class to do the visual effect.
	removeFileInStorage(fileNumber);
	setTimeout(function() { // After the visual effect.		
		displayRecentFiles();
	}, 100);
}

function removeAllFiles () { // Remove all the files with a smooth animation.
	chrome.storage.local.get(
		recentFiles,  
		function(mado) {
			for (var i = 1; i <= 7; i++)
				if (mado["recentFile" + (i + 1)] == undefined) {// File i -> File i-1 
					for (var j = i; j > 0; j--) {
						removeAllFilesTimeout(j); // We have to do it in an external function to have a <orking timeout.
					}
					break;
				}
			displayRecentFiles();	
		}	
	);
}

function removeAllFilesTimeout (j) { // The function to have a smooth animation even on a for loop.
	if (j > 0 && j <= 7) {
		setTimeout(function() { // After the visual effect.		
			document.getElementById("recent-" + j).setAttribute("class", "recent-file deleted"); // Change the class to do the visual effect.
			removeFileInStorage(j);
		}, 50);
	}
}

$(document).click(function(e) { // Set how to display the div.
	if ($(e.target).closest(recentButton).length && recentFilesDisplayer.className == "hidden") {
		displayRecentFiles(); // If the user remove something from another window.
		recentFilesDisplayer.className = "";
	}

	else if (! $(e.target).closest(recentFilesContainer).length)
		recentFilesDisplayer.className = "hidden";
});