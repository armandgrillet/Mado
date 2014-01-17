/* Functions linked to the Markdown markdown. */

/* 
* Variables (in alphabetical order). 
	* Shortcuts.
	* Global.
*/

/* HTML shortcuts. */
var conversionDiv; // The div who contains the HTML conversion.
var markdown; // The contenteditable where the user writes.
var pasteZone; // The textarea used when the user pastes content.

/* Global. */
var closeDiv; // The end of the div.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var initialText; // A save used when the user cancel a link/image.
var newCE; // The new contenteditable content (temporary).
var openDiv; // The beginning of the div.
var optiMarkdown; // The new Markdown, without useless div.
var pasteDiv; // The div used when the user pastes content.
var range; // Get the user's selection.
var rangeSelection; // Set the user's new range selection.
var savedSel; // The selection is saved here.
var selection; // Set the user's new selection.
var surroundDiv = document.createElement("div"); // Used to add the div to the contenteditable.
var tempTextarea = document.createElement("textarea"); // Used to add the div to the contenteditable.
var tempConversion; // A string used to don't display errors when an image is loaded.
var tempMarkdown; // String used to modify the markdown innerHTML.

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the contenteditable.
	* changeContentHighlighted (id): Add a div with id @param id around the selection. 
	* checkDiv (divCount, content, pos, id): Remove a div from content, @return if it has working and the new content.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* removeDivWithId (id): Remove a div from content via chechDiv (divCount, content, pos, id), use RegExp for strength.
	* restoreSelection (id): Restore the previous elements selected by the user.	
	* selectElementContents(el) : Do weird things with HTML to re-set the selection.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if ((markdown.innerHTML > 4) || (markdown.innerText.length > 0 && markdown.innerHTML != "<br>")) { // There is Markdown in the contenteditable.
		if (editorSyntax == undefined) {
			chrome.storage.local.get("gfm",  function(mado) {
				if (mado["gfm"] != undefined)
					marked.setOptions({ gfm : mado["gfm"] });
				else {
					chrome.storage.local.set({ "gfm" : false });
					marked.setOptions({ gfm : false });
				}
				setEditorSyntax();
				marked(markdown.innerText, function (err, content) { // Marked.js makes the conversion.	    	
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
			marked(markdown.innerText, function (err, content) {  	
		    	/* Reset. */
		    	imagePosition = 0;
		    	for (var i = 0; i < imagesArray.length; i++)
		       		imagesArray[i][2] = false;

		       	tempConversion = content;
		       	displayImages();      
		    });
		}
	}
	else { // No Markdown here.
		markdown.innerHTML = ""; // If the innerHTML is "<br>".
		conversionDiv.innerHTML = "See the result here";
		resetCounter();
		checkSaveState();
	}
}

function changeContentHighlighted (id) {
    range = rangy.getSelection().rangeCount ? rangy.getSelection().getRangeAt(0) : null;
    if (range) {    
        surroundDiv.id = id;
        try {
            range.surroundContents(surroundDiv);
        }
        catch(ex) {
        }
    }
}

function checkDiv (divCount, content, pos, id) {
	openDiv = content.indexOf("<div", pos);
	closeDiv = content.indexOf("</div>", pos);

	if (closeDiv != -1) { // If we find a "<div>" or a "</div>".
		if (openDiv != -1 && openDiv < closeDiv) // If <div is here first.
			return (checkDiv(divCount + 1, content, openDiv + 5, id)); // Recursivity.
		else { // If </div> is here first.
			if (divCount == 1) { // If we have the same ammount of "<div>" and "</div>".
				newCE = content.substring(0, content.indexOf("<div id=\"" + id + "\">")); 
				newCE += content.substring(content.indexOf("<div id=\"" + id + "\">") + ("<div id=\"" + id + "\">").length, closeDiv); 
				newCE += content.substring(closeDiv + 6); // Return the text without the useless "<div>" and "</div".
				return [0, newCE];
			}
			else
				return(checkDiv(divCount - 1, content, closeDiv + 6, id)); // Recursivity.
		}
	}
	else
		return [-1]; // Don't remove the brackets.
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
		if ($(this).attr("href").substring(0,1) != '#' && $(this).attr("href").substring(0,4) != "http") // External link without correct syntax.
			$(this).attr("href", "http://" + $(this).attr("href"));
		$(this).attr("target", "_blank");
	});

	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-link").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-visual").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function pasteContent () {
	changeContentHighlighted("mado-paste");  
	pasteDiv = document.getElementById("mado-paste");      
    pasteZone.focus();

    setTimeout(function(){
        if (pasteDiv != undefined)
            pasteDiv.innerText = pasteZone.value;       
        else
            $(markdown).innerText = $(markdown).innerText + pasteZone.value;
        selectElementContents(pasteDiv);
        restoreSelection("mado-paste");
        conversion();
    }, 20);
}

function removeDivWithId (id) {
	tempMarkdown = markdown.innerHTML;
	tempMarkdown = tempMarkdown.replace(/< *div/g, "<div"); // <div
	tempMarkdown = tempMarkdown.replace(/<div *>/g, "<div>"); // <div>
	tempMarkdown = tempMarkdown.replace(/< *\/ *div *>/g, "</div>"); // </div>

	if (tempMarkdown.indexOf("<div id=\"" + id + "\">") != -1) { // Remove the useless div.
		optiMarkdown = checkDiv(0, tempMarkdown, tempMarkdown.indexOf("<div id=\"" + id + "\">"), id);
		if (optiMarkdown[0] != -1) {
			tempMarkdown = optiMarkdown[1];
		}
	}
	markdown.innerHTML = tempMarkdown;
}

function restoreSelection (id) {
	savedSel = rangy.saveSelection();
	removeDivWithId(id);		
	rangy.restoreSelection(savedSel);
	rangy.removeMarkers(savedSel);
}

function selectElementContents(el) {
    if (document.createRange && window.getSelection) {
        rangeSelection = document.createRange();
        selection = window.getSelection();
        selection.removeAllRanges();
        try {
            rangeSelection.seleectNodeContents(el);
            selection.addRange(rangeSelection);
        } catch (e) {
            rangeSelection.selectNode(el);
            selection.addRange(rangeSelection);
        }
    } else if (document.body.createTextRange) {
        rangeSelection = document.body.createTextRange();
        rangeSelection.moveToElementText(el);
        rangeSelection.select();
    }
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
