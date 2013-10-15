var galleriesChoice;
var imageChoice;
var galleries;
var choosedPath;
var images;

var listeGalleries = []; 
var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp'];

var imagePath;
var rightFile = false;

function chooseGalleries () {
	chrome.mediaGalleries.getMediaFileSystems({ interactive : 'yes' }, update); // Let the user chooses his folders.
}

function chooseAnImage () {
	chrome.fileSystem.chooseEntry(
		{
	 		type: "openFile",
	 		accepts:[
	 			{
	 				mimeTypes: ["image/*"]
	 			}
	 		] 
		}, 
		function(loadedImage) {
			if (loadedImage != "") {			    
				chrome.fileSystem.getDisplayPath(loadedImage, function(path) {
					choosedPath.innerHTML = path;
					imagePath = path.replace(/\\/g, "/");
					update();
				});
			}
		}
	);
}

function update () {	
	chrome.mediaGalleries.getMediaFileSystems({ interactive : 'if_needed' }, chromeUpdate); // Update the list of folders and analyse the files in folders.
}

function chromeUpdate (results) { // Update everything.
	/* Reset */
	galleries.innerHTML = "";
	rightFile = false;

	listeGalleries = results; // Set the galleries to be used in getImages().
	results.forEach(function(item, indx, arr) { // For each gallery.
     	galleries.innerHTML += chrome.mediaGalleries.getMediaFileSystemMetadata(item).name + " "; // Display the galleries.
     	if (imagePath != undefined && rightFile == false)
     		item.root.createReader().readEntries(getImages); // Get the images of the folder.
  	});
}


function getImages (entries) { // Get all the images, even in sub-directories.
	for (var i = 0; i < entries.length && rightFile == false; i++) { // All the files in the repository, the correct file is not found yet.
		if (entries[i].isDirectory) // If the file it's a directory.
			entries[i].createReader().readEntries(getImages); // Recursivity.
		else if ( // It's a file.
			imgFormats.indexOf(entries[i].fullPath.substr(entries[i].fullPath.lastIndexOf('.') + 1).toLowerCase()) != -1 // And it's an image.
			&& imagePath.indexOf(entries[i].fullPath) != -1 // And it's the correct image!
			){ 
			listeGalleries[listeGalleries.length - 1].root.getFile(entries[i].fullPath, {create: false}, function(fileEntry) { // Time to get the ID of the file.
				fileEntry.file(function(theFile) {
					var reader = new FileReader();
                  	reader.onloadend = function(e) { // We have the file (.result).
                     	images.innerHTML = "<img src=\"" + this.result + "\">";
                  	};
                  	reader.readAsDataURL(theFile);                 	
				});
     		}); 
			rightFile = true;
		}
	}
}