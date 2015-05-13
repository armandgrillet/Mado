function ExportManager(app) {
    /* Outlets */
    this.exportButton = $("#export");

    /* Variables */
    this.app = app;

    /* Events */
    this.exportButton.on("click", $.proxy(function () { this.apply(); }, this));
}

ExportManager.prototype = {
    constructor: ExportManager,

    /* Exportation of the document edited. */
    apply: function() {
        var textToEport = marked(this.app.getEditorText()); // Get the text.
        var displayedName = chrome.i18n.getMessage("msgDocument") + ".html"; // If the document is not saved we use something standard.
        if (this.app.getName()) { // We have a real name so we use it.
            displayedName = this.app.getName().replace(/\.[^/.]+$/, "") + ".html";
        }
        chrome.fileSystem.chooseEntry({ type: "saveFile", suggestedName: displayedName }, function(exportedFile) { // Save the file but it is in HTML.
            if (exportedFile) {
                exportedFile.createWriter( function(writer) {
                    writer.write(new Blob([textToEport], { type: "text/HTML" }));
                }, function(error) { console.log(error); });
            }
        });
    }
};
