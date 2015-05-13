function DnDManager(app, selector) {
    /* Outlets */
    this.documentSection = $("#document"); // The section named "document" in the HTML.

    /* Variables */
    this.app = app;
    this.dragMessageAlreadyVisible = false; // True if the message about Drag and Drop is already visible.
    this.selector = document.querySelector(selector); // The fiel handled by the Drag and Drop manager.
    this.extensionsAllowed = [".markdown", ".md", ".txt"]; // Extensions allowed by Mado.
    this.filePath = undefined; // The path of the dragged file.
    this.overCount = 0; // Use to only display once the animation of drag.

    /* Events */
    this.selector.addEventListener("dragenter", $.proxy(function(e) { this.dragenter(e); }, this));
    this.selector.addEventListener("dragover", $.proxy(function(e) { this.dragover(e); }, this));
    this.selector.addEventListener("dragleave", $.proxy(function(e) { this.dragleave(e); }, this));
    this.selector.addEventListener("drop", $.proxy(function(e) { this.drop(e); }, this));
}

DnDManager.prototype = {
    constructor: DnDManager,

    /* What to do when a document start to be dragged in the selector. */
    dragenter: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.overCount++;
        this.selector.classList.add('dropping');
    },

    /* What to do when a document is over the selector. */
    dragover: function(e) {
        if (! this.dragMessageAlreadyVisible) {
            this.documentSection.attr("class", "dragging");
            this.dragMessageAlreadyVisible = true;
        }
        e.stopPropagation();
        e.preventDefault();
    },

    /* What to do when a document leave the selector. */
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

    /* What to do when a document is droped on the selector. */
    drop: function(e) {
        this.documentSection.attr("class", "");
        this.dragMessageAlreadyVisible = false;
        e.stopPropagation();
        e.preventDefault();

        this.selector.classList.remove('dropping');

        var filePath = e.dataTransfer.items[0].webkitGetAsEntry().fullPath;
        if (this.extensionsAllowed.indexOf(filePath.substring(filePath.lastIndexOf("."), filePath.length)) != -1) { // It is a file that Mado can handled.
            this.app.openFile(e.dataTransfer.items[0].webkitGetAsEntry()); // We open the file dropped.
        }
    }
};
