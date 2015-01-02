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
    apply: function() {
        chrome.fileSystem.chooseEntry({ type: "openFile", accepts:[{ extensions: ["markdown", "md", "txt"] }]},
            $.proxy(function(loadedFile) {
                if (loadedFile) {
                    this.open(loadedFile);
                }
            }, this)
        );
    },
    open: function(loadedFile) {
        var t = this;
        if (loadedFile) {
            loadedFile.file(
                function(file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        if ((t.app.getEditorText().length > 0 && t.app.getEditorText() != chrome.i18n.getMessage("msgFirstLaunch")) || (t.app.isDocumentNamed())) { // Something is already in the markdown, Mado opens a new window.
                            chrome.storage.local.set({ "appInitFileEntry": chrome.fileSystem.retainEntry(loadedFile), "editorInitFileEntry": chrome.fileSystem.retainEntry(loadedFile) }, function() {
                                t.app.newFile();
                            });
                        } else {
                            chrome.storage.local.set({ "newFile": chrome.fileSystem.retainEntry(loadedFile), "newFilePath": loadedFile.fullPath }, function() {
                                t.app.setEditorWithEntry(loadedFile, e.target.result);
                            });
                        }
                    };
                    reader.readAsText(file);
                },
                function(error) { console.log(error); }
            );
        }
    }
}
