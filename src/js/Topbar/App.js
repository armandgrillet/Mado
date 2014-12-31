function App(editor) {
    /* Outlets */
    this.moreButton = $("#more-button");
    this.moreDisplayer = $("#more-displayer");
    this.moreBox = $("#more-container");

    /* Variables */
    this.editor = editor;
    this.newFileManager = new NewFileManager(this);
    this.openFileManager = new OpenFileManager(this);
    this.switchManager = new SwitchManager();

    /* Events */
    this.moreButton.on("click", $.proxy(function(e) { this.moreDisplayer.toggleClass("hidden"); }, this));

    chrome.app.window.current().onBoundsChanged.addListener($.proxy(function () {
        if (chrome.app.window.current().getBounds().width < 1600 && lastBounds.width >= 1600) {
            addTopbarLabels();
        } else if (chrome.app.window.current().getBounds().width >= 1600 && lastBounds.width < 1600) {
            removeTopbarLabels();
        }
        lastBounds = chrome.app.window.current().getBounds();
    }, this));
}

App.prototype = {
    constructor: App,
    focusOnEditor: function() {
        this.editor.focus();
    },
    getEditorText: function() {
        return this.editor.getMarkdown();
    },
    newFile: function() {
        this.newFileManager.apply();
    },
    setEditorFile: function(name, content) {
        this.editor.setMarkdown(content);
        this.editor.saveWithName(name);
    }
}
