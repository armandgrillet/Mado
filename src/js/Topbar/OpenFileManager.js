function OpenFileManager(app) {
    /* Outlets */
    this.openButton = $("#open");

    /* Variables */
    this.app = app;

    /* Events */
    this.openButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+o", "ctrl+o"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.
}

OpenFileManager.prototype = {
    constructor: OpenFileManager,

    /* Open the standard window to open a file. */
    apply: function() {
        chrome.fileSystem.chooseEntry({ type: "openFile", accepts:[{ extensions: ["markdown", "md", "txt"] }]},
            $.proxy(function(loadedFile) {
                if (loadedFile) {
                    this.open(loadedFile);
                }
            }, this)
        );
    },

    /* Open the loaded file in Mado. */
    open: function(loadedFile) {
        var t = this; // Shortcut.
        if (loadedFile) {
            loadedFile.file(
                function(file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        if ((t.app.getEditorText().length > 0 && t.app.getEditorText() != chrome.i18n.getMessage("msgFirstLaunch")) || (t.app.isDocumentNamed())) { // Something is already in the editor, Mado opens a new window and we set local variables to open it well in the new window.
                            chrome.storage.local.set({ "appInitFileEntry": chrome.fileSystem.retainEntry(loadedFile), "editorInitFileEntry": chrome.fileSystem.retainEntry(loadedFile), "newFile": chrome.fileSystem.retainEntry(loadedFile), "newFilePath": loadedFile.fullPath }, function() {
                                t.app.newFile(); // Open a new window that will have the text.
                            });
                        } else {
                            chrome.storage.local.set({ "newFile": chrome.fileSystem.retainEntry(loadedFile), "newFilePath": loadedFile.fullPath }, function() {
                                t.app.setEditorWithEntry(loadedFile, e.target.result); // Open the file in the current window, set the editor.
                            });
                        }
                    };
                    reader.readAsText(file);
                },
                function(error) { console.log(error); }
            );
        }
    }
};
