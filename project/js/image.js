/* This document handles the image insertion. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var altInput; // The input for the alternative text.
var imageButton; // The "Image" button.
var imageBox; // The clickable zone of the image insertion tool.
var imageBrowser; // The button to choose an image.
var imageDisplayer; // The div that displays or not the image insertion tool.
var imageStatus; // The div to display the image path.
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
	* chooseGalleries (): open a pop-up to let the user chooses his galleries.
	* chromeUpdate (newGalleries): set the galleries to be used in getImages().
	* displayImages (): find the images on the document and display the correct corresponding data.
	* fileNotFound (): what to do if Mado doesn't find the image.
	* galleryAnalysis (theGallery): open a gallery and launch the search.
	* getImage (theCorrectImage): what to do when the image is find on the user's PC.
	* getImages (): search the image in the gallery.
	* loadImage (): let the user choose an image when he clicks on the button.
	* update (): update the list of folders and analyse the files in folders.
*/

function applyImage () {
	if (altInput.value == "") // An alternative input is obligatory
		altInput.focus();
	else if (imageLoaded != undefined){ // An image is obligatory
		if (titleInput.value == "")
			image = "![" + altInput.value + "](" + imageLoaded + ')';
		else 
			image = "![" + altInput.value + "](" + imageLoaded + " \"" + titleInput.value + "\")";

		newStartSelect = (textarea.value.slice(0, startSelect)).length;
		newEndSelect = (textarea.value.slice(0, startSelect) + image).length;
		textarea.value = textarea.value.slice(0, startSelect) + image + textarea.value.slice(endSelect, textarea.length);
		$(textarea).click();
		textarea.focus();
		textarea.setSelectionRange(newStartSelect, newEndSelect);
		conversion();
	}
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
		conversion();
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
					imageBrowser.innerHTML = "Change the image";
					imageStatus.innerHTML = fileName(path.replace(/\\/g, "/"));
					if (imageStatus.innerHTML.length > 35) // Too long to be beautiful.
						imageStatus.innerHTML = imageStatus.innerHTML.substring(0, 15) + "(...)" + imageStatus.innerHTML.substring(imageStatus.innerHTML.length - 15, imageStatus.innerHTML.length);
					imageStatus.innerHTML = imageStatus.innerHTML.substring(0, imageStatus.innerHTML.lastIndexOf('.')) + "<span id=\"extension\">" + imageStatus.innerHTML.substring(imageStatus.innerHTML.lastIndexOf('.'), imageStatus.innerHTML.length) + "</span";
					imageStatus.style.display = "inline-block";
					imageLoaded = path.replace(/\\/g, "/");
					altInput.focus();
				});
			}
		}
	);
}

function update () {	
	chrome.mediaGalleries.getMediaFileSystems({ interactive : 'if_needed' }, chromeUpdate);
}

/*
* Listener.
*/

$(document).click(function(e) {
	if ($(e.target).closest(imageButton).length && imageDisplayer.className == "tool-displayer hidden") { // Click on the "Image" button with the image insertion tool hidden
		/* Reset. */
		imageBrowser.innerHTML = "Choose an image";
		imageStatus.style.display = "none";
		altInput.value = "";
		titleInput.value = "";
		imageLoaded = undefined;

		imageDisplayer.className = "tool-displayer";
		startSelect = textarea.selectionStart;
		endSelect = textarea.selectionEnd;
		if (startSelect != endSelect) {
			textarea.setSelectionRange(startSelect, endSelect);
			titleInput.value = textarea.value.substring(startSelect, endSelect);
		}
	}
	else if (! $(e.target).closest(imageBox).length) // The user doesn't click on the image insertion box.
		imageDisplayer.className = "tool-displayer hidden";
});