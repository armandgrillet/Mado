function SaveStateManager(editor) {
    /* Outlets */
    this.saveState = $("#save-state");

    /* Variables */
    this.editor = editor;
    this.savedText = editor.getMarkdown(); // The text as the last save.
}

SaveStateManager.prototype = {
    constructor: SaveStateManager,

    /* Return if the file is saved. */
    isSaved: function() {
        if (this.editor.getMarkdown() == this.savedText) { // The text in the textarea is the same as the text saved. */
            return true;
        } else {
            return false;
        }
    },

    /* Save the file. */
    save: function() {
        this.savedText = this.editor.getMarkdown(); // Set the saved text with the current text.
        this.update();
    },

    /* Display if the file has unseaved changes or not. */
    update: function() {
        if (this.editor.getMarkdown() != this.savedText) {
            this.saveState.html("<span class=\"little-icon-unsaved\"></span>");
        } else {
            this.saveState.html("");
        }
    },
};
