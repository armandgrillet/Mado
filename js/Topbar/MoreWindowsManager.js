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
        this.apply(e.currentTarget.id);
    }, this));
}

MoreWindowsManager.prototype = {
    constructor: MoreWindowsManager,

    /* Open the correct window with a good size. */
    apply: function(windowId) {
        var newWindowConfig = {
            outerBounds: {
                left: Math.round((window.screenX + (($(window).width() - 498) / 2))), // Perfect left position.
                top: Math.round((window.screenY + (($(window).height() - 664) / 2))), // Perfect top position.
                width: 498,
                height: 664
            },
            frame : "none",
            id: windowId,
            resizable: false
        };

        if (windowId == "settings") {
            newWindowConfig.alwaysOnTop = true;
        }

        chrome.app.window.create("more/" + windowId + ".html", newWindowConfig, function(newWindow) {
            newWindow.outerBounds.setPosition(
                Math.round((window.screenX + (($(window).width() - 498) / 2))),
                Math.round((window.screenY + (($(window).height() - 664) / 2)))
            );
        });
        this.moreDisplayer.toggleClass("hidden"); // Hide the more displayer once a more window has been opened.
    }
};
