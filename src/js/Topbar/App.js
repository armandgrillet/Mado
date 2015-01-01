function App(editor) {
    /* Variables */
    this.editor = editor;
    this.lastBounds = chrome.app.window.current().getBounds();

    this.exportManager = new ExportManager(this);
    this.moreWindowsManager = new MoreWindowsManager();
    this.newFileManager = new NewFileManager(this);
    this.openFileManager = new OpenFileManager(this);
    this.printManager = new PrintManager();
    this.saveFileManager = new SaveFileManager(this);
    this.saveFileAsManager = new SaveFileAsManager(this);
    this.switchManager = new SwitchManager();

    /* Events */
    chrome.app.window.current().onBoundsChanged.addListener($.proxy(function () {
        if (chrome.app.window.current().getBounds().width < 1600 && lastBounds.width >= 1600) {
            this.addLabels();
        } else if (chrome.app.window.current().getBounds().width >= 1600 && lastBounds.width < 1600) {
            this.removeLabels();
        }
        this.lastBounds = chrome.app.window.current().getBounds();
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
