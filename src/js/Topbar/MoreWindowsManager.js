function MoreWindowsManager() {
    /* Outlets */
    this.moreButton = $("#more-button");
    this.moreDisplayer = $("#more-displayer");
    this.moreBox = $("#more-container");

    this.settingsLine = $("#settings");
    this.qAndALine = $("#q-and-a");
    this.shortcutsLine = $("#shortcuts");
    this.aboutLine = $("#about");

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#more-button").length) {
            this.moreDisplayer.toggleClass("hidden");
        } else if (!this.moreDisplayer.hasClass("hidden") && !$(e.target).closest("#more-container").length) {
            this.moreDisplayer.addClass("hidden"); // This is not a cancellation.
        }
    }, this));

    this.settingsLine.add(this.qAndALine).add(this.shortcutsLine).add(this.aboutLine).on("click", $.proxy(function(e) {
        console.log(e.currentTarget.id);
        switch (e.currentTarget.id) {
        case "settings": // The user press enter.
            this.apply("more/settings.html");
            break;
        case "q-and-a": // The user press echap.
            this.apply("more/qanda.html");
            break;
        case "shortcuts": // The user press enter.
            this.apply("more/shortcuts.html");
            break;
        case "about": // The user press enter.
            this.apply("more/about.html");
            break;
        }
    }, this));
}

MoreWindowsManager.prototype = {
    constructor: MoreWindowsManager,
    apply: function(url) {
        chrome.app.window.create(url,
            {
                bounds: {
                    left: Math.round((window.screenX + (($(window).width() - 498) / 2))), // Perfect alignement.
                    top: Math.round((window.screenY + (($(window).height() - 664) / 2))), // Always perfect.
                    width: 498,
                    height: 664
                },
                frame : "none",
                // The window can't be resized.
                minWidth: 498,
                minHeight: 664,
                maxWidth: 498,
                maxHeight: 664
            }
        );
        this.moreDisplayer.toggleClass("hidden");
    }
}
