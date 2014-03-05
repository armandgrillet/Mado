var markdownContainer;
var atTheBottom;
var newHeight;

// Si on est tout à la fin et qu'on voit que la hauteur est aggrandie alors on le remet à la fin. 

function asyncScroll (zone, scroll) {
	if (zone == "markdown") {
		newHeight = $(markdownContainer).scrollTop() + scroll;
		$(conversionDiv).scrollTop((newHeight / (markdownContainer.scrollHeight  - markdownContainer.offsetHeight)) * (conversionDiv.scrollHeight - conversionDiv.offsetHeight));
	}
	else {
		newHeight = $(conversionDiv).scrollTop() + scroll;
		$(markdownContainer).scrollTop((newHeight / (conversionDiv.scrollHeight  - conversionDiv.offsetHeight)) * (markdownContainer.scrollHeight - markdownContainer.offsetHeight));
	}

	if ($(markdownContainer).scrollTop() + markdownContainer.offsetHeight == markdownContainer.scrollHeight)
		atTheBottom = true;
	else
		atTheBottom = false;
}

function toTheBottom () {
	if (atTheBottom == true) {
		$(markdownContainer).scrollTop(markdownContainer.scrollHeight - markdownContainer.offsetHeight);
		$(conversionDiv).scrollTop(conversionDiv.scrollHeight - conversionDiv.offsetHeight);
	}
}