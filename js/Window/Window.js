function Window(app) {
    /* Outlets */
    this.cancelCloseButton = $("#cancel"); // Close div to cancel closing.
    this.closeDisplayer = $("#close-alert-displayer"); // The div that contains all the close divs.
    this.head = $("head")[0]; // The "head" section of the main app.
    this.quitCloseButton = $("#quit"); // Quit button.
    this.saveAndQuitCloseButton = $("#save-quit"); // "Save and exit" div.
    this.close = $("#window-close-button"); // Close button.
    this.maximize = $("#window-maximize"); // Maximize button.
    this.minimize = $("#window-minimize"); // Minimize buton.

    /* Variables */
    this.app = app; // The application that is contained in the window.

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest(this.close).length) { // Click on the close button.
            this.closeWindow(); // Display the close div's container.
        } else if (this.closeDisplayer.hasClass("visible") && !$(e.target).closest(this.closeDisplayer).length) {
            this.closeDisplayer.attr("class", "hidden");
        }
    }, this));

    Mousetrap.bind(["command+w", "ctrl+w"], $.proxy(function(e) { // Ctrl + w = close.
        this.closeWindow();
        return false;
    }, this));

    this.maximize.on("click", function(e) {
        if (! chrome.app.window.current().isMaximized()) {
            chrome.app.window.current().maximize();
        } else { // Restore the last bounds.
            chrome.app.window.current().restore();
        }
    });

    this.minimize.on("click", function(e) {
        chrome.app.window.current().minimize();
    });

    this.cancelCloseButton.on("click", $.proxy(function(e) { this.closeDisplayer.attr("class", "hidden"); }, this)); // Cancels the closure.
    this.quitCloseButton.on("click", $.proxy(function(e) { this.quitCloseWindow(); }, this)); // Quit directly.
    this.saveAndQuitCloseButton.on("click", $.proxy(function(e) { this.saveQuitCloseWindow(); }, this)); // Saves the file and closes it.

    /* Initialization */
    this.init();
}

Window.prototype = {
    constructor: Window,

    /* Close the window if the document is saved or display the closeDisplayer. */
    closeWindow: function() {
        if (this.app.isDocumentSaved()) { // Document saved.
            this.setNewBounds(function() { chrome.app.window.current().close(); });
        } else {
            this.closeDisplayer.attr("class", "visible");
        }
    },

    /* Set the window depending on the operating system. */
    init: function() {
        var operatingSystem;
        var frameStylesheetLink = document.createElement("link");

        frameStylesheetLink.setAttribute("rel", "stylesheet");
        frameStylesheetLink.setAttribute("type", "text/css");

        if (navigator.appVersion.indexOf("Mac") > -1) { // If the user is on a Mac, redirect to the Mac window frame styles.
            operatingSystem = "mac";
        } else if (navigator.appVersion.indexOf("Win") > -1) { // If the user is on a Windows PC, redirect to the Windows window frame styles.
            operatingSystem = "windows";
        } else if (navigator.appVersion.indexOf("Linux") > -1) { // If the user is on a Linux computer, redirect to the Linux Ubuntu window frame styles.
            operatingSystem = "linux";
        } else { // If the user is on another type of computer, redirect to the generic window frame styles (which are primarily Chrome OS's styles).
            operatingSystem = "chromeos";
        }

        frameStylesheetLink.setAttribute("href", "css/window-frame-" + operatingSystem + ".css"); // Set the correct window frame CSS file.
        this.close.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-close"); // Set the correct close button.
        this.maximize.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-maximize"); // Set the correct maximize button.
        this.minimize.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-minimize"); // Set the correct minimize button.

        this.head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
    },

    /* Set the bounds and close the window. */
    quitCloseWindow: function() {
        this.setNewBounds(function() { chrome.app.window.current().close(); });
    },

    /* Save the document and close the window. */
    saveQuitCloseWindow: function() {
        this.setNewBounds($.proxy(function() {
            if (this.app.isEntrySaved()) { // Document is a known entry, we save it.
                this.app.save(function() { chrome.app.window.current().close(); });
            } else { // The document is not named so we save it as a new document.
                this.app.saveAs(function() { chrome.app.window.current().close(); });
            }
        }, this));

    },

    /* Set the bounds and apply the callback function. */
    setNewBounds: function(callback) {
        chrome.runtime.getBackgroundPage($.proxy(function(backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
            backgroundPage.newBounds(chrome.app.window.current().outerBounds);
            callback();
        }, this));
    }
};
