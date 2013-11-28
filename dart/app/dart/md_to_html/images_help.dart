library images_help;

import "dart:html";
import "package:chrome/app.dart" as chrome;

import "images_manager.dart";

class ImagesHelp {

	InputElement altInput = querySelector("#alt-input"); // The input for the alternative text.
	DivElement galleriesButton = querySelector("#galleries-button"); // The "Galleries" button.
	DivElement imageButton = querySelector("#image-button"); // The "Image" button.
	DivElement imageBox = querySelector("#image-insertion-box"); // The clickable zone of the image insertion tool.
	DivElement imageBrowser = querySelector("#browse-image"); // The button to choose an image.
	DivElement imageDisplayer = querySelector("#image-insertion-displayer"); // The div that displays or not the image insertion tool.
	DivElement imageStatus = querySelector("#image-status"); // The div to display the image path.
	InputElement titleInput = querySelector("#title-input"); // The input for the title of the image
	
	ImagesManager imgManager;
	
	ImagesHelp (imagesManager) {
		imgManager = imagesManager;
		galleriesButton.onClick.listen((e) { imgManager.chooseGalleries(); });
	}
	
	void show () {
		/* Reset. */
		imageBrowser.setInnerHtml("Choose an image");
		imageStatus.style.display = "none";
		altInput.value = "";
		titleInput.value = "";
		// imageLoaded = undefined;
	
		imageDisplayer.className = "tool-displayer";
		/*
		startSelect = textarea.selectionStart;
		endSelect = textarea.selectionEnd;
		if (startSelect != endSelect) {
		textarea.setSelectionRange(startSelect, endSelect);
		titleInput.value = textarea.value.substring(startSelect, endSelect);
		}
		*/
	}
	
	void hide () {
		imageDisplayer.className = "tool-displayer hidden";
	}
	
	void chooseGalleries () {
		chrome.mediaGalleries.getMediaFileSystems({ interactive : 'yes' }, update); // Let the user chooses his folders.
}
}