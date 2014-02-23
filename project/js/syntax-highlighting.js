/* Functions linked to the Markdown syntax highlighting. */

/* 
* Variables (in alphabetical order). 
	* Shortcuts.
	* Global.
*/

/* Global. */
var highlightingWanted; // Boolean used to highlight or not the text.

/*
* Functions (in alphabetical order).
*
* Resume:
	* removeHighlighting (): remove all the code in the contenteditable used to highlight the text.
	* setMarkdownHighlighting (): Change the variable highlightingWanted. 
	* syntaxHighlighting (): do the highlighting.
*/

function removeHighlighting () {
	console.log("Highlighting removed.");
}

function setMarkdownHighlighting () {
	chrome.storage.local.get("highlighting",  function(mado) { 
        if (mado["highlighting"] != undefined) {
            highlightingWanted = mado["highlighting"]; 
            if (mado["highlighting"] == false)
            	removeHighlighting();
        }
        else {
            chrome.storage.local.set({ "highlighting" : true });
            highlightingWanted = true; 
        }
        syntaxHighlighting();
    });
}

function syntaxHighlighting () {
	if (highlightingWanted == undefined) {
		setMarkdownHighlighting();
	}
	else if (highlightingWanted == true) {
		console.log("Highlighting!");
	}
}