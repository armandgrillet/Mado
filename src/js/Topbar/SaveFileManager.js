function SaveFileManager(app) {
    /* Outlets */
    this.saveButton = $("#save");

    /* Variables */
    this.app = app;
    this.fileToSave = undefined; // The file saved.

    /* Events */
    this.saveButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+s", "ctrl+s"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.

    /* Initialization */
    this.init();
}

SaveFileManager.prototype = {
    constructor: SaveFileManager,

    /* Save the document. */
    apply: function(callback) {
        var t = this;
        if (this.fileToSave) { // The document already exists, we can directly saved.
            this.fileToSave.createWriter(function(fileWriter) {
                var truncated = false; // Variable used to do a good save even if the new file is shorter than the old one.
                fileWriter.onwriteend = function(e) {
                    if (!truncated) {
                        truncated = true;
                        this.truncate(this.position);
                        return;
                    }
                    chrome.storage.local.set({ "newFile": chrome.fileSystem.retainEntry(t.fileToSave), "newFilePath": t.fileToSave.fullPath }, function() { // For RecentFilesManager.
                        t.app.setDocumentSaved(); // The editor know that the document is saved.
                        if (callback) {
                            callback();
                        }
                    });

                };
                fileWriter.write(new Blob([t.app.getEditorText()], {type: 'plain/text'}));
            }, function(error) { console.log(error); });
        } else {
            this.app.saveAs();
        }
    },

    /* At initialization we directly have the fileToSave if a file has been loaded. */
    init: function() {
        var t = this;
        chrome.storage.local.get("appInitFileEntry", function(mado) {
            if (mado.appInitFileEntry) {
                chrome.fileSystem.restoreEntry(
                    mado.appInitFileEntry,
                    function (entry) {
                        t.fileToSave = entry; // Set fileToSave to allow direct saves.
                        chrome.storage.local.remove("appInitFileEntry");
                    }
                );
            }
        });
    },

    /* Returns if we have fileToSave. */
    isSaved: function() {
        if (this.fileToSave) {
            return true;
        } else {
            return false;
        }
    },

    /* Sets the file to save with an entry. */
    setFileToSave: function(fileEntry) {
        this.fileToSave = fileEntry;
    }
};
