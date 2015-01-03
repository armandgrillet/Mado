/* Functions that handle D&D. */

/*
* Variables (in alphabetical order).
*/



/*
* Functions (in alphabetical order).
*
* Resume:
* counterSelection (): what counter to display.
* displayCounter (): change charsDiv and wordsDiv.
* resetCounter (): what to display if there is nothing in the contenteditable.
*/

function DnDManager(app, selector) {
    /* Outlets */
    this.documentSection = $("#document"); // The section named "document" in the HTML.

    /* Variables */
    this.app = app;
    this.dragAndDropManager; // The manager launched onload.
    this.dragMessageAlreadyVisible = false; // True if the message about Drag and Drop is already visible.
    this.selector = document.querySelector(selector);
    this.extensionsAllowed = [".markdown", ".md", ".txt"]; // Extensions allowed by Mado.
    this.filePath; // The path of the dragged file.
    this.overCount = 0;

    /* Events */
    this.selector.addEventListener("dragenter", $.proxy(function(e) { this.dragenter(e); }, this));
    this.selector.addEventListener("dragover", $.proxy(function(e) { this.dragover(e); }, this));
    this.selector.addEventListener("dragleave", $.proxy(function(e) { this.dragleave(e); }, this));
    this.selector.addEventListener("drop", $.proxy(function(e) { this.drop(e); }, this));
};

DnDManager.prototype = {
    constructor: DnDManager,
    dragenter: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.overCount++;
        this.selector.classList.add('dropping');
    },

    dragover: function(e) {
        if (! this.dragMessageAlreadyVisible) {
            this.documentSection.attr("class", "dragging");
            this.dragMessageAlreadyVisible = true;
        }
        e.stopPropagation();
        e.preventDefault();
    },

    dragleave: function(e) {
        this.documentSection.attr("class", "");
        this.dragMessageAlreadyVisible = false;
        e.stopPropagation();
        e.preventDefault();
        if (--this.overCount <= 0) {
            this.selector.classList.remove('dropping');
            this.overCount = 0;
        }
    },

    drop: function(e) {
        this.documentSection.attr("class", "");
        this.dragMessageAlreadyVisible = false;
        e.stopPropagation();
        e.preventDefault();
        
        this.selector.classList.remove('dropping');

        var filePath = e.dataTransfer.items[0].webkitGetAsEntry().fullPath;
        if (this.extensionsAllowed.indexOf(filePath.substring(filePath.lastIndexOf("."), filePath.length)) != -1) {
            this.app.openFile(e.dataTransfer.items[0].webkitGetAsEntry());
        }
    }
}
