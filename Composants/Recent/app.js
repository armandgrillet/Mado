var buttonFichier;

var buttonRemove1;
var buttonRemove2;
var buttonRemove3;

var buttonDisplay1;
var buttonDisplay2;
var buttonDisplay3;

var inputDef1;
var inputDef2;
var inputDef3;

var inputExi1;
var inputExi2;
var inputExi3;

var affichage; 

var exist; 

var nameContainer = {};
var chromeLocalFile = "";

function errorHandler() {
	console.log("The key.");
}

function displayFiles () {
	chrome.storage.local.get(
		["recentFile1", "recentFileId1", "recentFile2", "recentFileId2", "recentFile3", "recentFileId3"],
		function(recent) {
			for (var i = 1; i <= 3; i++) { // Find how many files are set.
				if (recent["recentFile" + i] != undefined) { // Found the beginning of the end. 
					window["inputDef" + i].innerHTML = recent["recentFile" + i];
					
					if (i == 1)
						chrome.fileSystem.isRestorable(recent["recentFileId1"], function (isRestorable){
							console.log(recent["recentFileId1"]);
							document.getElementById("fichier1-present").innerHTML = isRestorable;
						});
					if (i == 2)
						chrome.fileSystem.isRestorable(recent["recentFileId2"], function (isRestorable){
							document.getElementById("fichier2-present").innerHTML = isRestorable;
						});
					if (i == 3)
						chrome.fileSystem.isRestorable(recent["recentFileId3"], function (isRestorable){
							document.getElementById("fichier3-present").innerHTML = isRestorable;
						});
				}
				else {
					for (var j = i; j <= 3; j++) {
						window["inputDef" + j].innerHTML = "";
					}
					i = 3; // End of the loop
				}
			}
		}
	);	
}

// RESET = chrome.storage.local.clear(function() {});

function devDisplay () {
	chrome.storage.local.get(
		["recentFile1", "recentFileId1", "recentFile2", "recentFileId2", "recentFile3", "recentFileId3"],
		function(recent) {
			for (var i = 1; i <= 3; i++) { // Find how many files are set.
				console.log("recentFile" + i + " = " + recent["recentFile" + i]);
				console.log("recentFileId" + i + " = " + recent["recentFileId" + i]);
			}
		}
	);	
}

function devCreate () {
	chrome.storage.local.set({test : "info du test"}, function() {});
	chrome.storage.local.get(["test"], function(a) {console.log(a.test);}); // verif
}

function openFile (fileNumber) { // Display the file on affichage div
	chromeLocalFile = ("recentFileId" + fileNumber).toString();
	console.log("chromeLocalFile ressemble à " + chromeLocalFile);
	chrome.storage.local.get(chromeLocalFile, function(recent) { 
		chrome.fileSystem.restoreEntry(recent[chromeLocalFile], displayFile)
	});
}

function displayFile (entry) {
	entry.file(function(file) {
    	var reader = new FileReader(); 
    	reader.onloadend = function(e) {
      		console.log(e.target.result);      
    	}; 
    	reader.readAsText(file); 
  	});
}

function loadFile () { // If file 1 set with same file on file 3 and another file on file 1, file 3 becomes file 1 and file 1 becomes file 3.		
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
			if (loadedFile) {
				chrome.storage.local.get(
					["recentFile1", "recentFileId1", "recentFile2", "recentFileId2", "recentFile3", "recentFileId3"],
					function(recent) {
						for (var i = 1; i <= 3; i++) { // Find how many files are set.
							console.log(recent["recentFile" + i]);
							if (recent["recentFile" + i] == undefined || recent["recentFile" + i] == loadedFile.fullPath || i == 3) { // Found the beginning of the end. 
								for (var j = i; j > 1; j--) { // Move file[i] in file[i+1].

									chromeLocalFile = ("recentFileId" + j).toString();
									nameContainer[chromeLocalFile] = recent["recentFileId" + (j - 1)];
									chrome.storage.local.set(nameContainer);
									nameContainer = {};

									chromeLocalFile = ("recentFile" + j).toString();
									nameContainer[chromeLocalFile] = recent["recentFile" + (j - 1)];
									chrome.storage.local.set(nameContainer);		
									nameContainer = {};																
								}
								i = 3; // End of the loop
							}
						}
						chrome.storage.local.set({"recentFileId1" : chrome.fileSystem.retainEntry(loadedFile)}, function() {});	
						chrome.storage.local.set({"recentFile1" : loadedFile.fullPath}, function() {});
						displayFiles();
					}
				);		 		
	 		}
		}
	);
}

function deleteFile (fileNumber) { // If file 1 deleted with file 2 set, the file 1 becomes the file 2.
	chrome.storage.local.get(
		["recentFile1", "recentFileId1", "recentFile2", "recentFileId2", "recentFile3", "recentFileId3"],
		function(recent) {
			if (recent["recentFile" + fileNumber] != undefined) {
				for (var i = fileNumber; i <= 3; i++) {
					if (recent["recentFile" + (i + 1)] != undefined) { // File i -> File i-1
						console.log("On ne doit pas supprimer le fichier présent en " + i);
						chromeLocalFile = ("recentFileId" + i).toString();
						nameContainer[chromeLocalFile] = recent["recentFileId" + (i + 1)];
						chrome.storage.local.set(nameContainer);
						nameContainer = {};

						chromeLocalFile = ("recentFile" + i).toString();
						nameContainer[chromeLocalFile] = recent["recentFile" + (i + 1)];
						chrome.storage.local.set(nameContainer);		
						nameContainer = {};	
					}
					else {
						chromeLocalFile = ("recentFileId" + i).toString();
						chrome.storage.local.remove(chromeLocalFile);

						chromeLocalFile = ("recentFile" + i).toString();
						chrome.storage.local.remove(chromeLocalFile);

						chromeLocalFile = "";
						i = 3; // End of the loop
					}
				}
			}
			displayFiles();
		}	
	);
}