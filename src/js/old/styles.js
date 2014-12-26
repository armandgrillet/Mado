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
	* setStyleInHTML (newStyleToApply): Disable useless links in HTML and activate the good one.
*/

function getStyle () {
	chrome.storage.local.get("style",  function(mado) {
		if (mado["style"] != undefined) {
			switch (mado["style"]) {
	            case "home":
	                homeRadio.checked = true;
	                break;
	            case "clinic":
	                clinicRadio.checked = true;
	                break;
	            case "tramway":
	                tramwayRadio.checked = true;
	        }
	        setStyleInHTML(mado["style"]);
		}
		else {
			homeRadio.checked = true;
			setStyle("home");
		}
	});
}

function setStyle (newStyle) {
	setStyleInHTML(newStyle);
	chrome.storage.local.set({ "style" : newStyle });
}

function setStyleInHTML (newStyle) {
	for (var i = 0; i < document.styleSheets.length; i++) {
		if (document.styleSheets.item(i).href.indexOf("css/themes/") != -1) {
	    	if (document.styleSheets.item(i).href.indexOf(newStyle) == -1) {
	    		document.styleSheets.item(i).disabled = true;
	    	} else {
	    		document.styleSheets.item(i).disabled = false;
	    	}
		}
	}
}