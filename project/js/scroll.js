var atTheBottom;

// Si on est tout à la fin et qu'on voit que la hauteur est aggrandie alors on le remet à la fin. 

function asyncScroll (zone, scroll) {
	if (zone == "markdown")
		$(conversionDiv).scrollTop(($(markdown).scrollTop() / (markdown.scrollHeight  - markdown.offsetHeight)) * (conversionDiv.scrollHeight - conversionDiv.offsetHeight));
	else
		$(markdown).scrollTop(($(conversionDiv).scrollTop() / (conversionDiv.scrollHeight  - conversionDiv.offsetHeight)) * (markdown.scrollHeight - markdown.offsetHeight));

	if ($(markdown).scrollTop() + markdown.offsetHeight == markdown.scrollHeight)
		atTheBottom = true;
	else
		atTheBottom = false;
}

function toTheBottom () {
	if (atTheBottom == true) {
		$(markdown).scrollTop(markdown.scrollHeight - markdown.offsetHeight);
		$(conversionDiv).scrollTop(conversionDiv.scrollHeight - conversionDiv.offsetHeight);
	}
}