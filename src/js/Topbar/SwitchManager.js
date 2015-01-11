function SwitchManager() {
    /* Outlets */
    this.madoFooter = $("#mado-footer");
    this.switchCursor = $("#switch-cursor");
    this.switchToMD = $("#switch-md");
    this.switchToBoth = $("#switch-both");
    this.switchToHTML = $("#switch-html");
    this.workspace = $("#workspace");

    /* Variables */
    this.switchButtons = [this.switchToMD, this.switchToBoth, this.switchToHTML]; // Wrapping the switch buttons in an array.
    this.previousSize = chrome.app.window.current().getBounds().width; // Setting the size of the window, forbid the resize() function to be launched before the complete loading.

    /* Events */
    chrome.app.window.current().onBoundsChanged.addListener($.proxy(function () {
        if (chrome.app.window.current().getBounds().width < 1160 && this.switchToBoth.hasClass("activated")) {
            this.switchToMD.click(); // Markdown set as default view.
        } else if (chrome.app.window.current().getBounds().width >= 1160 && this.previousSize < 1160) {
            this.switchToBoth.click();
        }
        this.previousSize = chrome.app.window.current().getBounds().width;
    }, this));

    this.switchToMD.add(this.switchToBoth).add(this.switchToHTML).on("click", $.proxy(function(e) { this.activate(e.currentTarget.id); }, this));

    Mousetrap.bind(["command+alt+left", "ctrl+alt+left"], $.proxy(function(e) { // Ctrl + -> = to the left.
        this.switch("left");
        return false;
    }, this));
    Mousetrap.bind(["command+alt+right", "ctrl+alt+right"], $.proxy(function(e) { // Ctrl + <- = to the right.
        this.switch("right");
        return false;
    }, this));

    /* Initialization */
    if (chrome.app.window.current().getBounds().width > 1159) { // Big window, both sides are displayed.
        this.activate("switch-both");
    } else { // Small window, we only show the Markdown side.
        this.activate("switch-md");
    }
}

SwitchManager.prototype = {
    constructor: SwitchManager,

    /* Do the switch. */
    activate: function(button) {
        for (var i = 0; i < this.switchButtons.length; i++) {
            if (this.switchButtons[i].attr("id") != button) { // Deactivating the switch buttons that are not selected.
                this.switchButtons[i].removeClass("activated");
            } else { // Activating the clicked button.
                this.switchButtons[i].addClass("activated");
            }
        }

        switch (button) {
            case this.switchButtons[0].attr("id"): // Markdown.
                this.workspace.add(this.switchCursor).add(this.madoFooter).attr("class", "markdown-view");
                break;
            case this.switchButtons[1].attr("id"): // Normal.
                this.workspace.add(this.switchCursor).attr("class", "normal");
                this.madoFooter.attr("class", "");
                break;
            case this.switchButtons[2].attr("id"): // HTML.
                this.workspace.add(this.switchCursor).attr("class", "conversion-view");
                this.madoFooter.attr("class", "");
                break;
        }
    },

    /* Shortcut used to switch in a specific direction. */
    switch: function(direction) {
        if (window.innerWidth > 1159) { // Normal window
            for (var i = 0; i < this.switchButtons.length; i++) {
                if (this.switchButtons[i].hasClass("activated")) { // We found which button is activated.
                    if (direction == "left" && i > 0) { // Left.
                        this.switchButtons[i - 1].click(); // The previous button is now activated.
                    } else if (direction == "right" && i < this.switchButtons.length -1) { // Right.
                        this.switchButtons[i + 1].click(); // The next button is now activated.
                    }
                    i = this.switchButtons.length; // End of the loop.
                }
            }
        } else { // Small window, only Markdown and HTML views are available so the code is easier.
            if (direction == "left") {
                this.switchToMD.click();
            } else {
                this.switchToHTML.click();
            }
        }
    }
};
