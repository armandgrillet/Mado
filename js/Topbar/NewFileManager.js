function NewFileManager(app) {
    /* Outlets */
    this.newButton = $("#new");

    /* Variables */
    this.app = app;

    /* Events */
    this.newButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+n", "ctrl+n"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.
}

NewFileManager.prototype = {
    constructor: NewFileManager,
    apply: function() {
        if ((this.app.getEditorText().length > 0 && this.app.getEditorText() != chrome.i18n.getMessage("msgFirstLaunch")) || (this.app.isDocumentNamed())) {
            chrome.app.window.create("mado.html", {
                outerBounds: {
                    left: (window.screenX + 20), // "+ 20" to watch this is a new window.
                    top: (window.screenY + 20),
                    width: window.innerWidth,
                    height: window.innerHeight,
                    minWidth: 750,
                    minHeight: 330
                },
                frame: "none",

            });
        } else if (this.app.getEditorText() == chrome.i18n.getMessage("msgFirstLaunch")) {
            this.app.resetEditor();
            this.app.focusOnEditor();
        }
    }
};
