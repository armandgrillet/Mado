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
        var t = this;
        chrome.fileSystem.chooseEntry({ type: "openFile", accepts:[{ extensions: ["markdown", "md", "txt"] }]},
            function(loadedFile) {
                if (loadedFile) {
                    loadedFile.file(
                        function(file) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                if (t.app.getEditorText().length > 0 && t.app.getEditorText() != chrome.i18n.getMessage("msgFirstLaunch")) { // Something is already in the markdown, Mado opens a new window.
                                    chrome.storage.local.set({ "tempFileEntry" : chrome.fileSystem.retainEntry(loadedFile) }, function() {
                                        t.app.newFile();
                                    });
                                } else {
                                    t.app.setEditorWithEntry(loadedFile, e.target.result);
                                }
                                // newRecentFile(file); // Update the local storage, the file opened is now on top.
                            };
                        reader.readAsText(file);
                    },
                    function(error) { console.log(error); }
                );
                }
            }
        );
    }
}
