function App(editor) {
    /* Variables */
    this.editor = editor;
    this.lastBounds = chrome.app.window.current().getBounds();

    this.exportManager = new ExportManager(this);
    this.moreWindowsManager = new MoreWindowsManager();
    this.newFileManager = new NewFileManager(this);
    this.openFileManager = new OpenFileManager(this);
    this.printManager = new PrintManager();
    this.recentFilesManager = new RecentFilesManager(this);
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
    isDocumentNamed: function() {
        return this.editor.isNamed();
    },
    isDocumentSaved: function() {
        return this.editor.isSaved();
    },
    isEntrySaved: function() {
        return this.saveFileManager.isSaved();
    },
    newFile: function() {
        this.newFileManager.apply();
    },
    setDocumentSaved: function() {
        this.editor.save();
    },
    save: function(callback) {
        this.saveFileManager.apply(callback);
    },
    saveAs: function(callback) {
        this.saveFileAsManager.apply(callback);
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
