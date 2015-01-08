function StyleManager() {
    /* Outlets */
    this.styleButton = $("#style-tool");
    this.styleDisplayer = $("#style-tool-displayer");
    this.homeRadio = $("#home-style");
    this.clinicRadio = $("#clinic-style");
    this.tramwayRadio = $("#tramway-style");

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest(this.styleButton).length && this.styleDisplayer.hasClass("hidden")) {
            this.styleDisplayer.removeClass("hidden");
        } else if (!this.styleDisplayer.hasClass("hidden") && ! $(e.target).closest(this.styleDisplayer).length) {
            this.styleDisplayer.addClass("hidden");
        }
    }, this));

    this.homeRadio.add(this.clinicRadio).add(this.tramwayRadio).on("click", $.proxy(function(e) {
        this.setStyle(e.target.id.slice(0, -6)); // Remove the part of the id with "-style".
    }, this));

    /* Initialization */
    this.getStyle();
}

StyleManager.prototype = {
    constructor: StyleManager,

    /* Gets the style in chrome.storage.local and applies it. */
    getStyle: function() {
        chrome.storage.local.get("style",  $.proxy(function(mado) {
            if (mado["style"]) {
                switch (mado["style"]) {
                case "home":
                    this.homeRadio[0].checked = true;
                    break;
                case "clinic":
                    this.clinicRadio[0].checked = true;
                    break;
                case "tramway":
                    this.tramwayRadio[0].checked = true;
                }
                this.setStyle(mado["style"]);
            } else { // Not settled yet, we choose Home.
                this.homeRadio[0].checked = true;
                this.setStyle("home");
            }
        }, this));
    },

    setStyle: function(newStyle) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets.item(i).href.indexOf("css/themes/") != -1) {
                if (document.styleSheets.item(i).href.indexOf(newStyle) == -1) {
                    document.styleSheets.item(i).disabled = true;
                } else {
                    document.styleSheets.item(i).disabled = false;
                }
            }
        }
        chrome.storage.local.set({ "style" : newStyle });
    }
}
