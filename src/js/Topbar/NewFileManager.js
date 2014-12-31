function NewFileManager(editor) {
    /* Outlets */
    this.newButton = $("#new");

    /* Variables */
    this.editor = editor;

    /* Events */
    this.newButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+n", "ctrl+n"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.
}

NewFileManager.prototype = {
    apply: function() {
        if (this.editor.getMarkdown().length > 0 && this.editor.getMarkdown() != chrome.i18n.getMessage("msgFirstLaunch")) {
            chrome.app.window.create("mado.html", {
                bounds: {
                    left: (window.screenX + 20), // "+ 20" to watch this is a new window.
                    top: (window.screenY + 20),
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                frame: "none",
                minWidth: 750,
                minHeight: 330
            });
        } else if (this.editor.getMarkdown() == chrome.i18n.getMessage("msgFirstLaunch")) {
            this.editor.setMarkdown("");
            this.editor.focus();
        }
    }
}
