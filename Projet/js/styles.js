var stylesButton; // The "Styles" button
var stylesDisplayer; // The div that contains and displays the style selection tool

var homeRadio;
var clinicRadio;
var tramwayRadio;

function getStyle () {
	chrome.storage.local.get("style",  function(mado) {
		if (mado["style"] != undefined) {
			if (mado["style"] == "home") 
				homeRadio.checked = true;	
			else if (mado["style"] == "clinic") 
				clinicRadio.checked = true;	
			else 
				tramwayRadio.checked = true;

			$(conversionDiv).attr("class", mado["style"]);			
		}
		else {
			homeRadio.checked = true;
			setStyle ("home");
		}
	});
}

function setStyle (newStyle) {
	chrome.storage.local.set({ "style" : newStyle }, function () {
		$(conversionDiv).attr("class", newStyle);
	});
}

$(document).click(function(e) {
	if ($(e.target).closest(stylesButton).length && stylesDisplayer.className == "tool-displayer hidden") {
		stylesDisplayer.className = "tool-displayer";
	}
	else if (! $(e.target).closest(stylesDisplayer).length)		
		stylesDisplayer.className = "tool-displayer hidden";
});