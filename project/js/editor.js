/* Functions linked to the Markdown textarea. */

/* 
* Variables (in alphabetical order). 
*/

var conversionDiv; // The div who contains the HTML conversion.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var tempConversion; // A string used to don't display errors when an image is loaded.
var textarea; // The textarea where the user writes.

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the textarea.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if (textarea.value.length > 0) { // There is Markdown in the textarea.
		if (editorSyntax == undefined) {
			chrome.storage.local.get("gfm",  function(mado) {
				if (mado["gfm"] != undefined)
					marked.setOptions({ gfm : mado["gfm"] });
				else {
					chrome.storage.local.set({ "gfm" : false });
					marked.setOptions({ gfm : false });
				}
				setEditorSyntax();
				marked(textarea.value, function (err, content) { // Marked.js makes the conversion.	    	
					/* Reset. */
			    	imagePosition = 0;
			    	for (var i = 0; i < imagesArray.length; i++) // Reset the images array.
			       		imagesArray[i][2] = false;

			       	tempConversion = content; 
			       	displayImages();      
			    });
			});	    
		}
		else {
			marked.setOptions({ gfm : editorSyntax });
			marked(textarea.value, function (err, content) {  	
		    	/* Reset. */
		    	imagePosition = 0;
		    	for (var i = 0; i < imagesArray.length; i++)
		       		imagesArray[i][2] = false;

		       	tempConversion = content;
		       	displayImages();      
		    });
		}
	}
	else {// No Markdown here.
		conversionDiv.innerHTML = "The HTML view.";
		Countable.once(textarea, function (counter) { displayCounter(counter); }); // Count the words in the textarea.
		checkSaveState();
	}
}

function endOfConversion () {
	/* Reset. */
	imagePath = undefined;
	rightFile = undefined;

	for (var i = 0; i < imagesArray.length; i++) // Remove the images who are not used anymore.
		if (imagesArray[i][2] == false)
			imagesArray = imagesArray.splice(imagesArray[i], 1);

	tempConversion = tempConversion.replace(/<img src=\"img\/nofile.png/g, "<span class=\"nofile-link\"> <span class=\"nofile-visual\">File not found</span>&nbsp;</span><img class=\"nofile\" src=\"img/nofile.png");
	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		$(this).attr("target", "_blank");
	});

	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-link").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-visual").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function setEditorSyntax () {
	chrome.storage.local.get("gfm",  function(mado) { 
		if (mado["gfm"] != undefined)
			editorSyntax = mado["gfm"]; 
		else {
			chrome.storage.local.set({ "gfm" : false });
			editorSyntax = false; 
		}
		conversion();
	});
}
