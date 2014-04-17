/* This document handles the image insertion. */

/* 
* Variables (in alphabetical order). 
	* HTML shortcuts.
	* Functions variables.
*/

/* HTML shortcuts. */
var altInput; // The input for the alternative text.
var cancelImageButton; // The "Cancel" button.
var galleriesButton; // The "Galleries" button.
var imageButton; // The "Image" button.
var imageBox; // The clickable zone of the image insertion tool.
var imageBrowser; // The button to choose an image.
var imageDisplayer; // The div that displays or not the image insertion tool.
var imageDiv; // The div with id="mado-image".
var webimageButton; // The "Web image" button.
var webimageBox; // The clickable zone of the Web image insertion tool.
var webimageDisplayer; // The div that displays or not the Web image insertion tool.

/* Functions variables. 
* startSelect, endSelect, newStarSelect, newEndSelect are created in link.js.
*/

var currentGallery; // Used when the code is searching an image to know where it is.
var galleriesList = []; // List who contains the galleries.
var image; // The content who is added.
var imageLoaded; // The path of the image selected.
var imagePath; // The path of the image.
var imagePosition = 0; // Used to don't keep on the same part of the document.
var imagesArray = []; // All the images on the file.
var imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
var rightFile; // If false the JS is looking for an image.
var researching; // If we're searching an image.
var imagePathsArray = [];
var imagePositionInArray;

/*
* Functions (in alphabetical order).
*
* Resume:
	* applyImage (): what to do when the user press enter after choosing an image.
	* cancelImage (): what to do if the user press elsewhere the image container when he was adding an image.
	* chooseGalleries (): open a pop-up to let the user chooses his galleries.
	* chromeUpdate (newGalleries): set the galleries to be used in getImages().
	* displayImages (): find the images on the document and display the correct corresponding data.
	* fileNotFound (): what to do if Mado doesn't find the image.
	* galleryAnalysis (theGallery): open a gallery and launch the search.
	* getImage (theCorrectImage): what to do when the image is find on the user's PC.
	* getImages (): search the image in the gallery.
	* loadImage (): let the user choose an image when he clicks on the button.
	* loadOnlineImage (): get the external image with a request.
	* modifyImage (): enables the realtime modification of an image.
	* setBrowserText (imagePath): set the text in the button with the image's path.
	* setImageInputs (): recognizes when the selected text is an image and set the inputs in consequence.
	* update (): update the list of folders and analyse the files in folders.
	* updateOnline(): apply the new URL of the external image. 
*/

function applyImage () {
	if (altInput.value == "") { // An alternative input is obligatory
		altInput.setAttribute("class", "flash");
		altInput.focus();
		altInput.removeAttribute("class");
	}
	else if (imageLoaded != undefined){ // An image is obligatory
		modifyImage();	
		imageDisplayer.className = "tool-displayer hidden";
		selectElementContents(imageDiv);
		restoreSelection("mado-image");
	}
}

function cancelImage () {
	if (imageDiv != undefined)
		imageDiv.innerText = initialText;		
	imageDisplayer.className = "tool-displayer hidden";
	selectElementContents(imageDiv);
	restoreSelection("mado-image");
	contentChanged();
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
		researching = false;
		imagePath = tempConversion.substring(imagePosition, tempConversion.indexOf("\"", imagePosition));
		imagePathsArray.length = 0; // Reset
	   	for(var i = 0; i < imagesArray.length; i++) { // Put all the names 
	      	imagePathsArray.push(imagesArray[i][0]);
	   	}
	   	imagePositionInArray = imagePathsArray.indexOf(imagePath);

		if (imgFormats.indexOf(imagePath.substr(imagePath.lastIndexOf('.') + 1).toLowerCase()) > -1) {		
			if (imagePath.substring(0, 7) == "http://" || imagePath.substring(0, 8) == "https://") {
				if (navigator.onLine) {
					if (imagePositionInArray > -1) { // Image is already stored.
						tempConversion = tempConversion.substring(0, imagePosition) + imagesArray[imagePositionInArray][1] + tempConversion.substring(imagePosition + imagePath.length); // Replace the path.	
		    			imagesArray[imagePositionInArray][2] = true; // The file has been used.	
					}
					else {// The array doesn't exist yet.
						researching	= true;
						updateOnline(imagePath); // Get the ID of the file.   	
					}
				}
				else
					tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-visual\">Internet not available</span>&nbsp;<img class=\"nofile\" srcset=\"img/nointernet.png 1x, img/nointernet@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);			
	        }
	        else if (imagePath.substring(0, 5) != "data:" && imagePath.substring(0, 5) != "blob:") { // Not already translated
				if (imagePositionInArray > -1) { // Image is already stored.
					tempConversion = tempConversion.substring(0, imagePosition) + imagesArray[imagePositionInArray][1] + tempConversion.substring(imagePosition + imagePath.length); // Replace the path.	
	    			imagesArray[imagePositionInArray][2] = true; // The file has been used.
	        	}
				else { // The image is not in the array.
					researching	= true;
					rightFile = false;
					update(); // Get the ID of the file.   	
				}
			}		
			if (! researching) // We're not searching an image in the PC or the web.
				displayImages();
		}
		else if (imagePath.substring(0, 5) != "data:" && imagePath.substring(0, 5) != "blob:") {
			tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-visual\">This is not an image</span>&nbsp;<img class=\"nofile\" srcset=\"img/notimage.png 1x, img/notimage@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);;
			displayImages();
		}
	}
	else
		endOfConversion();
}

function fileNotFound () {
	tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + fileName(imagePath.replace(/\\/g, "/")) +" not found</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nofile.png 1x, img/nofile@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);
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
		     		if (indx == index && imagePath != undefined && rightFile == false) // If we're looking for a file.  
		     			item.root.createReader().readEntries(getImages); // Get the images of the folder.
		  		}
			)
		}
		else
			fileNotFound();
	}
	else {
		imagesArray.length = 0;
		modifyImage();
	}
}

function getImage (entryPath) {
	galleriesList[currentGallery].root.getFile(entryPath, {create: false}, function(fileEntry) { // Time to get the ID of the file.
		fileEntry.file(function(theFile) {
			var reader = new FileReader();
          	reader.onloadend = function(e) { // We have the file (.result).
          		imagesArray.push([imagePath, this.result, true]); // Add a new line.
          		tempConversion = tempConversion.substring(0, imagePosition) + this.result + tempConversion.substring(imagePosition + imagePath.length); // Replace the path.	
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
					setImageBrowserText(fileName(path.replace(/\\/g, "/")));				
					imageLoaded = path.replace(/\\/g, "/");
					modifyImage();
					altInput.focus();
				});
			}
		}
	);
}

var loadOnlineImage = function(uri, callback) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		callback(window.URL.createObjectURL(xhr.response), uri);
	}
	xhr.open('GET', uri, true);
	xhr.send();
}

function modifyImage () {
	image = "![" + altInput.value + "](" + imageLoaded + ')';
	if (imageDiv != undefined)
		imageDiv.innerText = image;		
	else
		$(markdown).innerText = $(markdown).innerText + image;		
	contentChanged();
}

function setImageBrowserText (path) {
	imageBrowser.innerHTML = path;
	if (imageBrowser.innerHTML.length > 15) // Too long to be beautiful.
		imageBrowser.innerHTML = imageBrowser.innerHTML.substring(0, 6) + "(…)" + imageBrowser.innerHTML.substring(imageBrowser.innerHTML.length - 6, imageBrowser.innerHTML.length);
}

function setImageInputs () {
	initialText = imageDiv.innerText;
	if (/!\[.*\]\(.*\)/.test(initialText)) { // An image
		if (/!\[.*\]\(.*\s+".*"\)/.test(initialText)) // Optional title is here.
			imageLoaded = initialText.match(/\(.*\)/)[0].substring(2, initialText.match(/\(.*\s+"/)[0].length - 2).replace(/\\/g, "/");
		else
			imageLoaded = initialText.match(/\(.*\)/)[0].substring(2, initialText.match(/\(.*\)/)[0].length - 1).replace(/\\/g, "/");
		setImageBrowserText(fileName(imageLoaded));
		altInput.value = initialText.match(/!\[.+\]/)[0].substring(2, initialText.match(/!\[.+\]/)[0].length - 1); 
	}
	else
		altInput.value = initialText;
	
}

function update () {	
	chrome.mediaGalleries.getMediaFileSystems({ interactive : "no" }, chromeUpdate);
}

function updateOnline () {
	loadOnlineImage(imagePath, function(blob_uri, requested_uri) {
	  	tempConversion = tempConversion.replace(imagePath, blob_uri); 
	  	imagesArray.push([imagePath, blob_uri, true]); // Add a new line in the array of images.
		if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) 
	 		displayImages();
	 	else // The end.
	 		endOfConversion();
	}); 
}