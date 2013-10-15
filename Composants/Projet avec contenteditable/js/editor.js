/* Events linked to the Markdown textarea */

var textarea; // The textarea where the user writes.
var conversionDiv; // The div who contains the HTML conversion.
var saveState; // It's in the footer but I mange it here.
var link;
var tempConversion; // A string used to don't display errors when an image is loaded.

function conversion () { // What to do when something change in the Markdown editor.
	Countable.once(textarea,  function (counter) { displayCounter(counter) }); // Count the words in the textarea.

	if (textarea.value.length > 0) { // Markdown in HTML.
	    marked(textarea.value, function (err, content) { // Marked.js makes the conversion.
	    	// Reset.
	    	imagePosition = 0;

	        // Replace the links.
	       	tempConversion = content.replace(/<a href=/g,"<a target=\"_blank\" href=");

	       	for (var i = 0; i < imagesArray.length; i++) // Reset.
	       		imagesArray[i][2] = false;

	       	displayImages();      
	    });
	}
	else // No Markdown here.
		conversionDiv.innerHTML = "The HTML view.";
}

function endOfConversion () {
	/* Reset. */
	imagePath = undefined;
	rightFile = undefined;

	for (var i = 0; i < imagesArray.length; i++) // Remove the images who are not used anymore.
		if (imagesArray[i][2] == false)
			imagesArray = imagesArray.splice(imagesArray[i], 1);

	conversionDiv.innerHTML = tempConversion; // Display the conversion.
	
	$('#html-conversion img').each(function() { // Add a link to help the user to choose his folders.
		if($(this).attr('src') == "img/nofile.jpg")
			 $(this).attr('class', 'nofile');
	});
	$('.nofile').on("click", function() { chooseGalleries(); });

	saveState.innerHTML = "Unsaved";
}