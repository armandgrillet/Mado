function App(editor) {
    /* Outlets */
    this.moreButton = $("#more-button");
    this.moreDisplayer = $("#more-displayer");
    this.moreBox = $("#more-container");

    /* Variables */
    this.editor = editor;
    this.exportManager = new ExportManager(this);
    this.newFileManager = new NewFileManager(this);
    this.openFileManager = new OpenFileManager(this);
    this.printManager = new PrintManager();
    this.saveFileManager = new SaveFileManager(this);
    this.saveFileAsManager = new SaveFileAsManager(this);
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
    getName: function() {
        return this.editor.getName();
    },
    isNamed: function() {
        return this.editor.isNamed();
    },
    newFile: function() {
        this.newFileManager.apply();
    },
    save: function() {
        this.editor.save();
    },
    saveAs: function() {
        this.saveFileAsManager.apply();
    },
    setEditorEntry: function(entry) {
        this.saveFileManager.setFileToSave(entry);
        this.editor.saveWithName(entry.fullPath.substring(entry.fullPath.lastIndexOf('/') + 1));
    },
    setEditorWithEntry: function(entry, content) {
        this.saveFileManager.setFileToSave(entry);
        this.editor.setMarkdown(content);
        this.editor.saveWithName(entry.fullPath.substring(entry.fullPath.lastIndexOf('/') + 1));
    }
}
