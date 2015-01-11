function SettingsManager() {
    /* Outlets */
    this.markdownSyntax = $("#markdown-radio");
    this.gfmSyntax = $("#gfm-radio");

    /* Events */
    this.markdownSyntax.add(this.gfmSyntax).on("click", $.proxy(function() { chrome.storage.local.set({ "gfm": this.gfmSyntax[0].checked }); }, this));

    /* Initialization */
    this.init();
}

SettingsManager.prototype = {
    constructor: SettingsManager,

    /* Get the correct syntax and display it. */
    init: function() {
        chrome.storage.local.get("gfm", $.proxy(function(mado) {
            if (mado.gfm) {
                if (mado.gfm === true) {
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
    }
};
