function MoreWindowsManager() {
    /* Outlets */
    this.moreButton = $("#more-button");
    this.moreDisplayer = $("#more-displayer");
    this.moreBox = $("#more-container");

    this.settingsLine = $("#settings");
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

    this.settingsLine.add(this.shortcutsLine).add(this.aboutLine).on("click", $.proxy(function(e) {
        switch (e.currentTarget.id) {
        case "settings":
            this.apply("more/settings.html");
            break;
        case "shortcuts":
            this.apply("more/shortcuts.html");
            break;
        case "about":
            this.apply("more/about.html");
            break;
        }
    }, this));
}

MoreWindowsManager.prototype = {
    constructor: MoreWindowsManager,

    /* Open the correct window with a good size. */
    apply: function(url) {
        chrome.app.window.create(url,
            {
                bounds: {
                    left: Math.round((window.screenX + (($(window).width() - 498) / 2))), // Perfect left position.
                    top: Math.round((window.screenY + (($(window).height() - 664) / 2))), // Perfect top position.
                    width: 498,
                    height: 664
                },
                frame : "none",
                /* The window can't be resized. */
                minWidth: 498,
                minHeight: 664,
                maxWidth: 498,
                maxHeight: 664
            }
        );
        this.moreDisplayer.toggleClass("hidden"); // Hide the more displayer once a more window has been opened.
    }
};
