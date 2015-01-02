function SaveFileManager(app) {
    /* Outlets */
    this.saveButton = $("#save");

    /* Variables */
    this.app = app;
    this.fileToSave;

    /* Events */
    this.saveButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+s", "ctrl+s"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.

    /* Initialization */
    this.init();
}

SaveFileManager.prototype = {
    constructor: SaveFileManager,
    apply: function(callback) {
        var t = this;
        if (this.fileToSave) { // The document already exists.
            this.fileToSave.createWriter(function(fileWriter) {
                var truncated = false;
                fileWriter.onwriteend = function(e) {
                    if (!truncated) {
                        truncated = true;
                        this.truncate(this.position);
                        return;
                    }
                    // newRecentFile(fileEntry); // Update the position of the file saved.‡
                    t.app.setDocumentSaved();
                    if (callback != undefined) {
                        callback();
                    }
                };
                fileWriter.write(new Blob([t.app.getEditorText()], {type: 'plain/text'}));
            }, function(error) { console.log(error); });
        } else {
            this.app.saveAs();
        }
    },
    init: function() {
        var t = this;
        chrome.storage.local.get("appInitFileEntry", function(mado) {  // If a file is loading.
            if (mado["appInitFileEntry"] != undefined) {
                chrome.fileSystem.restoreEntry(
                    mado["appInitFileEntry"],
                    function (entry) {
                        t.fileToSave = entry;
                        chrome.storage.local.remove("appInitFileEntry");
                    }
                );
            }
        });
    },
    isSaved: function() {
        if (this.fileToSave) {
            return true;
        } else {
            return false;
        }
    },
    setFileToSave: function(fileEntry) {
        this.fileToSave = fileEntry;
    }
}
