/* The JS to control Mado's styles. */

/* 
* Variables (in alphabetical order). 
	* HTML div shortcuts.
	* HTML radio shortcuts.
*/

/* HTML div shortcuts. */
var stylesButton; // The "Styles" button.
var stylesDisplayer; // The div that contains and displays the style selection tool.

/* HTML radio shortcuts. */
var clinicRadio; // Clinic style.
var homeRadio; // Home style.
var tramwayRadio; // Tramway style.

/*
* Functions (in alphabetical order).
*
* Resume:
	* getStyle (): get the storage variable style.
	* setStyle (newStyleToApply): set the storage variable "style".
*/

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

/*
* Listener.
*/

$(document).click(function(e) {
	if ($(e.target).closest(stylesButton).length && stylesDisplayer.className == "tool-displayer hidden") {
		stylesDisplayer.className = "tool-displayer";
	}
	else if (! $(e.target).closest(stylesDisplayer).length)		
		stylesDisplayer.className = "tool-displayer hidden";
});