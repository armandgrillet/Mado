function LabelManager() {
    /* Variables. */
    this.bigWidth = undefined; // We can display labels above this width.
    this.topbarButtons = [["#export", "msgExport"], ["#new", "msgNew"], ["#open", "msgOpen"], ["#print", "msgPrint"], ["#recent-button", "msgRecent"], ["#save", "msgSave"], ["#save-as", "msgSaveAs"]]; // Targets and labels linked.
    this.lastWidth = undefined; // Used to remove and add titles only when it is useful.

    /* Events */
    chrome.app.window.current().onBoundsChanged.addListener($.proxy(function () { this.update(); }, this));

    /* Initialization */
    this.init();
}

LabelManager.prototype = {
    constructor: LabelManager,

    /* Display labels in the topbar */
    displayLabels: function() {
        $(".nav-label").each(function() {
            $(this).removeClass("hidden");
            $(this).removeAttr("title");
        });

        for (var j = 0; j < this.topbarButtons.length; j++) {
            $(this.topbarButtons[j][0]).removeAttr("title"); // Removes the titles because we are displaying them entirely.
        }
    },

    /* Hide labels in the topbar and add a title to each button */
    hideLabels: function() {
        $(".nav-label").each(function() {
            $(this).addClass("hidden");
        });

        for (var i = 0; i < this.topbarButtons.length; i++) {
            $(this.topbarButtons[i][0]).attr("title", chrome.i18n.getMessage(this.topbarButtons[i][1])); // We set the localized title.
        }
    },

    init: function() {
        switch (chrome.i18n.getUILanguage()) {
            case "fr":
                this.hideLabels(); // French words are too long thus we're not showing labels, only titles.
                break;
            default:
                this.bigWidth = 1600;
                this.lastWidth = chrome.app.window.current().outerBounds.width;
                if (chrome.app.window.current().outerBounds.width < this.bigWidth) {
                    this.hideLabels();
                }
        }
    },

    update: function() {
        if (chrome.app.window.current().outerBounds.width < this.bigWidth && this.lastWidth >= this.bigWidth) {
            this.hideLabels();
        } else if (chrome.app.window.current().outerBounds.width >= this.bigWidth && this.lastWidth < this.bigWidth) {
            this.displayLabels();
        }
        this.lastWidth = chrome.app.window.current().outerBounds.width;
    }
};
