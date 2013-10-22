var stylesButton; // The "Styles" button
var stylesDisplayer; // The div that contains and displays the style selection tool

$(document).click(function(e) {
	if ($(e.target).closest(stylesButton).length && stylesDisplayer.className == "tool-displayer hidden") {
		stylesDisplayer.className = "tool-displayer";
	}
	else if (! $(e.target).closest(stylesDisplayer).length)		
		stylesDisplayer.className = "tool-displayer hidden";
});