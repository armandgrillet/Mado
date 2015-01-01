function SaveStateManager(editor) {
    /* Outlets */
    this.saveState = $("#save-state");

    /* Variables */
    this.editor = editor;
    this.savedText = editor.getMarkdown();
}

SaveStateManager.prototype = {
    constructor: SaveStateManager,
    isSaved: function() {
        if (this.editor.getMarkdown() == this.savedText) {
            return true;
        } else {
            return false;
        }
    },
    save: function() {
        this.savedText = this.editor.getMarkdown();
        this.update();
    },
    update: function() {
        if (this.editor.getMarkdown() != this.savedText) {
            this.saveState.html("<span class=\"little-icon-unsaved\"></span>");
        } else {
            this.saveState.html("");
        }
    },
}
