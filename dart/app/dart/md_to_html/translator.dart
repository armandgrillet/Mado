library md_translator;

import "dart:html";
import "package:markdown/markdown.dart";
import "images_help.dart";
import "images_manager.dart";

class Translator {
	// HTML shortcuts.
	DivElement conversionDiv = querySelector("#html-conversion");
	InputElement textarea = querySelector("#markdown"); 
	
	// Variables.
	ImagesManager imageManager;
	String tempConversion;
	
	 
	Translator () {
		imageManager = new ImagesManager(this);
		textarea.onInput.listen((e) { conversion(); });
		
	}
	
	void conversion () {
		if (textarea.value.length > 0) {
			conversionDiv.setInnerHtml(markdownToHtml(textarea.value));
			imageManager.imagePosition = 0;
			for (int i = 0; i < imageManager.imagesArray.length; i++)
			imageManager.imagesArray[i][2] = false;				
			tempConversion = markdownToHtml(textarea.value);
			imageManager.displayImages();
		}
		else { // No Markdown here.
			conversionDiv.setInnerHtml("The HTML view.");
		}
	}
	
	void endOfConversion () {
		/* Reset. */
		imageManager.imagePath = null;
		imageManager.rightFile = null;

		for (var i = 0; i < imageManager.imagesArray.length; i++) // Remove the images who are not used anymore.
			if (imageManager.imagesArray[i][2] == false)
				imageManager.imagesArray = imageManager.imagesArray.splice(imageManager.imagesArray[i], 1);

		tempConversion = tempConversion.replaceAll("<img src=\"img\/nofile.png", "<span class=\"nofile-link\"> <span class=\"nofile-visual\">File not found</span>&nbsp;</span><img class=\"nofile\" src=\"img/nofile.png");
		conversionDiv.setInnerHtml(tempConversion); // Display the conversion.

		querySelectorAll("#html-conversion a").forEach((e) { e.attr("target", "_blank"); }); // Add target="_blank" to make links work.

		if (querySelector(".nofile") != null) {
			querySelector(".nofile").onClick.listen((e) { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
			querySelector(".nofile-link").onClick.listen((e) { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
			querySelector(".nofile-visual").onClick.listen((e) { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
		}
			// Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
		// checkSaveState();
	}
	
	void checkSaveState () {
	
	}
	
	void chooseGalleries () {
	
	}
}