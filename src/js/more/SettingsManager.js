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
    setSyntax: function() {
        if (this.markdownSyntax[0].checked) {
            chrome.storage.local.set({ "gfm": false });
        } else {
            chrome.storage.local.set({ "gfm": true });
        }
    }
}
