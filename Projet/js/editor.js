/* Events linked to the Markdown textarea */

var textarea; // The textarea where the user writes.
var conversionDiv; // The div who contains the HTML conversion.
var saveState; // It's in the footer but I manage it here.
var link;
var tempConversion; // A string used to don't display errors when an image is loaded.
var editorSyntax;

function conversion () { // What to do when something change in the Markdown editor.
	if (textarea.value.length > 0) { // Markdown in HTML.
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
			    	for (var i = 0; i < imagesArray.length; i++) // Reset.
			       		imagesArray[i][2] = false;

			       	tempConversion = content; 
			       	displayImages();      
			    });
			});	    
		}
		else {
			marked.setOptions({ gfm : editorSyntax });
			marked(textarea.value, function (err, content) { // Marked.js makes the conversion.	    	
		    	/* Reset. */
		    	imagePosition = 0;
		    	for (var i = 0; i < imagesArray.length; i++) // Reset.
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

	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		$(this).attr("target", "_blank");
	});

	$("#html-conversion img").each(function() { // Add a link to help the user to choose his folders.
		if($(this).attr("src") == "img/nofile.jpg")
			$(this).attr("class", "nofile");
	});
	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function setEditorSyntax () {
	chrome.storage.local.get("gfm",  function(mado) { 
		editorSyntax = mado["gfm"]; 
		conversion();
	});
}