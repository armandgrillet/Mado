library images_manager;

import "translator.dart";
import "package:chrome/app.dart" as chrome;

import "images_help.dart";

class ImagesManager {
	String currentGallery; // Used when the code is searching an image to know where it is.
	var galleriesList = []; // List who contains the galleries.
	String image; // The content who is added.
	String imageLoaded; // The path of the image selected.
	String imagePath; // The path of the image.
	int imagePosition = 0; // Used to don't keep on the same part of the document.
	var imagesArray = []; // All the images on the file.
	ImagesHelp imgHelp;
	var imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
	bool rightFile; // If false the JS is looking for an image.
	Translator translator;

	ImagesManager(linkedTranslator) {
		imgHelp = new ImagesHelp(this);
		translator = linkedTranslator;
	}

	void chooseGalleries () {
		print("It's working but chrome is really hard to manage.");
		// chrome.chromeMediaGalleries.getMediaFileSystems({interactive : 'yes'});
	}
	
	void displayImages () {
		if (translator.tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
			imagePosition = translator.tempConversion.indexOf("<img src=\"", imagePosition) + 10;
			rightFile = false;
			imagePath = translator.tempConversion.substring(imagePosition, translator.tempConversion.indexOf("\"", imagePosition));

			if(imagePath.substring(0, 4) != "data") { // The path is not already translated (if the same image is in the file twice).
				if (imagesArray.length > 0){ // Files are already stored.
					for (int i = 0; i < imagesArray.length; i++) { // Search if the image is in the array.
						if(imagesArray[i][0] == imagePath) { // The file is already here.
							translator.tempConversion = translator.tempConversion.replaceAll(imagePath, imagesArray[i][1]); // Replace the path.		
			    			imagesArray[i][2] = true; // The file has been used.
			    			if (translator.tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
			    				displayImages();
			    				break;
			    			}
			    			else
		                     	translator.endOfConversion();
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
			translator.endOfConversion();
	}
	
	void update () {
		print("a");
		//chrome.media_galleries.getMediaFileSystems({ interactive : "no" }, chromeUpdate);
	}
}