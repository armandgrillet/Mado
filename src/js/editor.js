/* Functions linked to the Markdown editor. */

/*
* Variables (in alphabetical order).
	* Shortcuts.
	* Global.
*/

/* HTML shortcuts. */
var centerLine; // The line that separates Markdown and HTML views.
var conversionDiv; // The div who contains the HTML conversion.
var markdown; // The textarea where the user writes.
var pasteZone; // The textarea used when the user pastes content.

/* Global. */
var closeDiv; // The end of the div.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var firstMessage = "# Dear user,\n\nThanks for installing **Mado**. For your first launch, here is some information:\n\n* Mado handles .md, .markdown and .txt files, can save these files as .md (the official extension for MarkDown files) and offers an export in .html.\n* You can click the number of words in the bottom-right corner to see the number of characters in your document (and *vice versa*). Click the eye icon next to it to change the style of the HTML view.\n* Mado uses Google Analytics to know in real time how many users are currently running the app, for statistical analysis only. You can deactivate it anytime in the settings (top-right button, “Settings” section).\n* See the keyboard shortcuts (top-right button, “Shortcuts” section) to use Mado in depth.\n\nWe hope you will enjoy Mado,\n\n**[A+A](https://twitter.com/AplusA_io)**\n\n***\n\nP.S. This message will not appear anymore. Click “New” in the navbar to start using Mado."
var initialText; // A save used when the user cancel a link/image.
var newCE; // The new textarea content (temporary).
var openDiv; // The beginning of the div.
var optiMarkdown; // The new Markdown, without useless div.
var tempConversion; // A string used to don't display errors when an image is loaded.
var tempMarkdown; // String used to modify the markdown innerHTML.

var starSelect;
var endSelect;
var newEndSelect;
var newRange;

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the textarea.
	* changeContentHighlighted (id): Add a div with id @param id around the selection.
	* checkDiv (divCount, content, pos, id): Remove a div from content, @return if it has working and the new content.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* removeDivWithId (id): Remove a div from content via chechDiv (divCount, content, pos, id), use RegExp for strength.
	* restoreSelection (id): Restore the previous elements selected by the user.
	* selectElementContents(el) : Do weird things with HTML to re-set the selection.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if (markdown.value.length > 0) { // There is Markdown in the textarea.
		if (editorSyntax == undefined) {
			chrome.storage.local.get("gfm",  function(mado) {
				if (mado["gfm"] != undefined)
					marked.setOptions({ gfm : mado["gfm"] });
				else {
					chrome.storage.local.set({ "gfm" : true });
					marked.setOptions({ gfm : true });
				}
				setEditorSyntax();
			});
		} else {
			marked.setOptions({ gfm : editorSyntax });
		}

		marked(markdown.value, function (err, content) {
	    	/* Reset. */
	    	imagePosition = 0;
	    	for (var i = 0; i < imagesArray.length; i++)
	       		imagesArray[i][2] = false;

	       	tempConversion = content;
	       	displayImages();
	    });
	}
	else { // No Markdown here.
		conversionDiv.innerHTML = "See the result here";
		resetCounter();
		checkSaveState();
	}
}

function checkDiv (divCount, content, pos, id) {
	openDiv = content.indexOf("<div", pos);
	closeDiv = content.indexOf("</div>", pos);

	if (closeDiv != -1) { // If we find a "<div>" or a "</div>".
		if (openDiv != -1 && openDiv < closeDiv) { // If <div is here first.
			return (checkDiv(divCount + 1, content, openDiv + 5, id)); // Recursivity.
		} else { // If </div> is here first.
			if (divCount == 1) { // If we have the same ammount of "<div>" and "</div>".
				newCE = content.substring(0, content.indexOf("<div id=\"" + id + "\">"));
				newCE += content.substring(content.indexOf("<div id=\"" + id + "\">") + ("<div id=\"" + id + "\">").length, closeDiv);
				newCE += content.substring(closeDiv + 6); // Return the text without the useless "<div>" and "</div".
				return [0, newCE];
			} else {
				return(checkDiv(divCount - 1, content, closeDiv + 6, id)); // Recursivity.
			}
		}
	} else {
		return [-1]; // Don't remove the brackets.
	}
}

function endOfConversion () {
	/* Reset. */
	imagePath = undefined;
	rightFile = undefined;

	for (var i = 0; i < imagesArray.length; i++) {// Remove the images that are not used anymore.
		if (imagesArray[i][2] == false) {
			imagesArray = imagesArray.splice(imagesArray[i], 1);
		}
	}

	conversionDiv.innerHTML = tempConversion; // Display the conversion.

	$("#html-conversion a").each(function() { // Add target="_blank" to make links work.
		if ($(this).attr("href").substring(0,1) != '#' && $(this).attr("href").substring(0,4) != "http") { // External link without correct syntax.
			$(this).attr("href", "http://" + $(this).attr("href"));
		}
		$(this).attr("target", "_blank");
	});

	$("#html-conversion .nofile, #html-conversion .nofile-link, #html-conversion .nofile-visual").on("click", chooseGalleries); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function setEditorSyntax () {
    chrome.storage.local.get("gfm",  function(mado) {
        if (mado["gfm"] != undefined) {
                editorSyntax = mado["gfm"];
        } else {
                chrome.storage.local.set({ "gfm" : true });
                editorSyntax = true;
        }
        contentChanged();
    });
}

$.fn.setRange = function (start, end) {
    if (!end) {
    	end = start;
	}
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            newRange = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};
