function SaveFileManager(app) {
    /* Outlets */
    this.saveButton = $("#save");

    /* Variables */
    this.app = app;
    this.fileToSave;

    /* Events */
    this.saveButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+s", "ctrl+s"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.
}

SaveFileManager.prototype = {
    constructor: SaveFileManager,
    apply: function() {
        var t = this;
        if (this.app.isNamed()) { // The document already exists.
            this.fileToSave.createWriter(function(fileWriter) {
                var truncated = false;
                fileWriter.onwriteend = function(e) {
                    if (!truncated) {
                        truncated = true;
                        this.truncate(this.position);
                        return;
                    }
                    // newRecentFile(fileEntry); // Update the position of the file saved.‡
                    t.app.save();
                };
                fileWriter.write(new Blob([t.app.getEditorText()], {type: 'plain/text'}));
            }, function(error) { console.log(error); });
        } else {
            this.app.saveAs();
        }
    },
    setFileToSave: function(fileEntry) {
        this.fileToSave = fileEntry;
    }
}
