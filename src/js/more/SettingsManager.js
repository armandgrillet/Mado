function SettingsManager() {
    /* Outlets */
    this.markdownSyntax = $("#markdown-radio");
    this.gfmSyntax = $("#gfm-radio");

    /* Events */
    this.markdownSyntax.add(this.gfmSyntax).on("click", $.proxy(function() { this.setSyntax(); }, this));

    /* Initialization */
    this.init();
}

SettingsManager.prototype = {
    constructor: SettingsManager,

    /* Get the correct syntax and display it. */
    init: function() {
        chrome.storage.local.get("gfm", $.proxy(function(mado) {
            if (mado["gfm"] != undefined) {
                if (mado["gfm"]) {
                    this.gfmSyntax.prop("checked", true);
                } else {
                    this.markdownSyntax.prop("checked", true);
                }
            }
            else {
                chrome.storage.local.set({ "gfm": true });
                this.gfmSyntax.prop("checked", true);
            }
        }, this));
    },

    /* Set the syntax in chrome.storage.local. */
    setSyntax: function() {
        if (this.markdownSyntax[0].checked) { // The div markdownSyntax has been checked.
            chrome.storage.local.set({ "gfm": false });
        } else { // The div gfmSyntax has been checked.
            chrome.storage.local.set({ "gfm": true });
        }
    }
}
