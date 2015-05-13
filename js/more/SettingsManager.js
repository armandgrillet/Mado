function SettingsManager() {
    /* Outlets */
    this.markdownSyntax = $("#markdown-radio");
    this.gfmSyntax = $("#gfm-radio");
    this.reset = $("#reset");

    /* Events */
    this.markdownSyntax.add(this.gfmSyntax).on("click", $.proxy(function() { chrome.storage.local.set({ "gfm": this.gfmSyntax[0].checked }); }, this));
    this.reset.on("click", $.proxy(function() { this.clean(); }, this));

    /* Initialization */
    this.init();
}

SettingsManager.prototype = {
    constructor: SettingsManager,

    /* Reset Mado and restart it. */
    clean: function() {
        chrome.storage.local.clear(function() {
            chrome.runtime.reload();
        });
    },

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
