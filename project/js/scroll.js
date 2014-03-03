var markdownContainer;
var	preventWeirdScroll;

function asyncScroll (zone) {
	if (zone == "markdown" && preventWeirdScroll != "markdown") {
		$(conversionDiv).scrollTop(conversionDiv.scrollHeight * $(markdownContainer).scrollTop() / markdown.scrollHeight);
		preventWeirdScroll = "HTML";
		scrollManager();
	}
	else if (zone == "HTML" && preventWeirdScroll != "HTML") {
		$(markdownContainer).scrollTop(markdownContainer.scrollHeight * $(conversionDiv).scrollTop() / conversionDiv.scrollHeight);
		preventWeirdScroll = "markdown";
		scrollManager();
	}
}

function scrollManager() {
	setTimeout(function () {
		console.log("meuh");
        preventWeirdScroll = "";
    }, 10);
}