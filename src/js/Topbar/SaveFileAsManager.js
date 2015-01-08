function SaveFileAsManager(app) {
    /* Outlets */
    this.saveAsButton = $("#save-as");

    /* Variables */
    this.app = app;

    /* Events */
    this.saveAsButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+shift+s", "ctrl+shift+s"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.
}

SaveFileAsManager.prototype = {
    constructor: SaveFileAsManager,
    apply: function(callback) {
        var t = this;
        chrome.fileSystem.chooseEntry( { type: "saveFile", suggestedName: chrome.i18n.getMessage("msgDocument") + ".md" }, function(savedFile) {
            if (savedFile) {
                savedFile.createWriter(function(fileWriter) {
                    var truncated = false; // Variable used to do a good save even if the new file is shorter than the old one.
                    fileWriter.onwriteend = function(e) {
                        if (!truncated) {
                            truncated = true
                            this.truncate(this.position);
                            return;
                        }
                        chrome.storage.local.set({ "newFile": chrome.fileSystem.retainEntry(savedFile), "newFilePath": savedFile.fullPath }, function() { // For RecentFilesManager.
                            t.app.setEditorEntry(savedFile); // The editor know that the document is saved.
                            if (callback != undefined) {
                                callback();
                            }
                        });
                    };
                    fileWriter.write(new Blob([t.app.getEditorText()], {type: 'plain/text'}));
                }, function(error) { console.log(error); });
            }
        });
    }
}
