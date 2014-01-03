/* Functions linked to the Markdown markdown. */

/* 
* Variables (in alphabetical order). 
	* Global.
	* For other JS.
*/

var conversionDiv; // The div who contains the HTML conversion.
var editorSyntax; // false if the syntax is Markdown, true if it's GFM.
var markdown; // The contenteditable where the user writes.
var tempConversion; // A string used to don't display errors when an image is loaded.

/* For other JS files. */
var endSelect; // End of the selection
var newStartSelect; // New start of the selection.
var newEndSelect; // New end of the selection.
var startSelect; // Start of the selection.

var contentHighlighted;
var tempMarkdown;
var optiMarkdown;
var openDiv;
var closeDiv;
var newCE;

/*
* Functions (in alphabetical order).
*
* Resume:
	* conversion (): what to do when the user change something on the contenteditable.
	* endOfConversion (): what to do on the end of the conversion. It's a particular function to handle asynchronous image loadings.
	* setEditorSyntax (): change editorSyntax when the user chane the syntax on the Settings window.
*/

function conversion () {
	if (markdown.innerText.length > 0) { // There is Markdown in the contenteditable.
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
	else {// No Markdown here.
		conversionDiv.innerHTML = "The HTML view.";
		// FIXME
		resetCounter();
		checkSaveState();
	}
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
		$(this).attr("target", "_blank");
	});

	$(".nofile").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-link").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.
	$(".nofile-visual").on("click", function() { chooseGalleries(); }); // If an image isn't loaded, a default image appeared and, if the user clicks, the galleries choice appeared.

	Countable.once(conversionDiv, function (counter) { displayCounter(counter); }, { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
	checkSaveState();
}

function saveContentHighlighted () {
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0; i < sel.rangeCount; ++i)
                container.appendChild(sel.getRangeAt(i).cloneContents());
            contentHighlighted = container.innerHTML;
        }
    } 
    else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            contentHighlighted = document.selection.createRange().htmlText;
        }
    }
}

function changeContentHighlighted () {
    contentHighlighted = "<div id=\"mado-link\">" + contentHighlighted + "</div>";
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var div = document.createElement("div");
        div.innerHTML = contentHighlighted;
        var frag = document.createDocumentFragment(), child;
        while ( (child = div.firstChild) ) {
            frag.appendChild(child);
        }
        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        contentHighlighted = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(contentHighlighted);
    }
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

function checkDiv (divCount, content, pos, id) {
	openDiv = content.indexOf("<div", pos);
	closeDiv = content.indexOf("</div>", pos);

	if (closeDiv != -1) { // If we find a "<div>" or a "</div>".
		if (openDiv != -1 && openDiv < closeDiv) // If <div is here first.
			return (checkDiv(divCount + 1, content, openDiv + 5, id)); // Recursivity.
		else { // If </div> is here first.
			if (divCount == 1) { // If we have the same ammount of "<div>" and "</div>".
				newCE = content.substring(0, content.indexOf("<div id=\"" + id + "\">")); 
				newCE += content.substring(content.indexOf("<div id=\"" + id + "\">") + 20, closeDiv); 
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
