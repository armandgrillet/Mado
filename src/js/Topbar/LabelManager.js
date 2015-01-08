function LabelManager() {
    /* Variables. */
    this.labels = [["#export", "msgExport"], ["#new", "msgNew"], ["#open", "msgOpen"], ["#print", "msgPrint"], ["#recent-button", "msgRecent"], ["#save", "msgSave"], ["#save-as", "msgSaveAs"]]; // Targets and labels linked.
    this.bigWidth = 1600;
    this.lastWidth = this.bigWidth; // Used to remove and add titles only when it is useful.

    /* Events */
    chrome.app.window.current().onBoundsChanged.addListener($.proxy(function () { this.update(); }, this));

    /* Initialization */
    this.update();
}

LabelManager.prototype = {
    constructor: LabelManager,

    update: function() {
        if (chrome.app.window.current().getBounds().width < this.bigWidth && this.lastWidth >= this.bigWidth) {
            for (var i = 0; i < this.labels.length; i++) {
                $(this.labels[i][0]).attr("title", chrome.i18n.getMessage(this.labels[i][1])); // We set the localized title.
            }
        } else if (chrome.app.window.current().getBounds().width >= this.bigWidth && this.lastWidth < this.bigWidth) {
            for (var i = 0; i < this.labels.length; i++) {
                $(this.labels[i][0]).removeAttr("title"); // Removes the titles because we are displaying them entirely.
            }
        }
        this.lastWidth = chrome.app.window.current().getBounds().width;
    }
}
