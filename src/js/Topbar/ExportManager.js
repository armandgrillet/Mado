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
    apply: function() {
        var textToEport = marked(this.app.getEditorText());
        var displayedName = "document.html";
        if (this.app.getName() != undefined) {
            displayedName = this.app.getName().replace(/\.[^/.]+$/, "") + ".html";
        }
        chrome.fileSystem.chooseEntry({ type: "saveFile", suggestedName: displayedName }, function(exportedFile) {
            if (exportedFile) {
                exportedFile.createWriter( function(writer) {
                    writer.write(new Blob([textToEport], { type: "text/HTML" }));
                }, function(error) { console.log(error); });
            }
        });
    }
}
