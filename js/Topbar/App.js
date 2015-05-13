function App(editor) {
    /* Variables */
    this.editor = editor;
    this.lastBounds = chrome.app.window.current().outerBounds;

    this.dragAndDropManager = new DnDManager(this, "body");
    this.exportManager = new ExportManager(this);
    this.labelManager = new LabelManager();
    this.moreWindowsManager = new MoreWindowsManager();
    this.newFileManager = new NewFileManager(this);
    this.openFileManager = new OpenFileManager(this);
    this.printManager = new PrintManager();
    this.recentFilesManager = new RecentFilesManager(this);
    this.saveFileManager = new SaveFileManager(this);
    this.saveFileAsManager = new SaveFileAsManager(this);
    this.switchManager = new SwitchManager();
}

App.prototype = {
    constructor: App,

    /* Focus in the editor. */
    focusOnEditor: function() {
        this.editor.focus();
    },

    /* Return editor's text as a String. */
    getEditorText: function() {
        return this.editor.getMarkdown();
    },

    /* Return the name of the document edited. */
    getName: function() {
        return this.editor.getName();
    },

    /* Return if the document has a name or not. */
    isDocumentNamed: function() {
        return this.editor.isNamed();
    },

    /* Return if the document is saved or not for the editor (just the icon on top of the window, not a real entry). */
    isDocumentSaved: function() {
        return this.editor.isSaved();
    },

    /* Return if the document is the document is available as an entry (really saved). */
    isEntrySaved: function() {
        return this.saveFileManager.isSaved();
    },

    /* Apply the file manager. */
    newFile: function() {
        this.newFileManager.apply();
    },

    /* Open a file.
     * file: entry to open.
     */
    openFile: function(file) {
        this.openFileManager.open(file);
    },

    /* Empty the editor to start fresh. */
    resetEditor: function() {
        this.editor.setMarkdown("", 0, this.editor.getMarkdown().length);
    },

    /* Set that the document is saved for the editor. */
    setDocumentSaved: function() {
        this.editor.save();
    },

    /* Really save the document.
     * Callback: what to do after the save.
     */
    save: function(callback) {
        this.saveFileManager.apply(callback);
    },

    /* Save the document has a new one.
    * Callback: what to do after the save.
    */
    saveAs: function(callback) {
        this.saveFileAsManager.apply(callback);
    },

    /* Set the entry of the window. Set the document as saved with the name of the entry.
     * entry: the entry used to save the editor.
     */
    setEditorEntry: function(entry) {
        this.saveFileManager.setFileToSave(entry);
        this.editor.saveWithName(entry.fullPath.substring(entry.fullPath.lastIndexOf('/') + 1));
    },

    /* Set the entry + set the text.
     * entry: the entry used to save the editor.
     * content: content of the entry.
     */
    setEditorWithEntry: function(entry, content) {
        this.saveFileManager.setFileToSave(entry);
        this.editor.setMarkdown(content, 0, this.editor.getMarkdown().length);
        this.editor.saveWithName(entry.fullPath.substring(entry.fullPath.lastIndexOf('/') + 1));
    }
};
