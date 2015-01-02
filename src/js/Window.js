function Window(app) {
    /* Outlets */
    this.cancelCloseButton = $("#cancel");
    this.closeDisplayer = $("#close-alert-displayer"); // The div that contains all the close divs.
    this.head = $("head")[0]; // The "head" section of the main app.
    this.quitCloseButton = $("#quit");
    this.saveAndQuitCloseButton = $("#save-quit");
    this.closeContainer = $("#window-close");
    this.close = $("#window-close-button");
    this.maximize = $("#window-maximize");
    this.minimize = $("#window-minimize");

    /* Variables */
    this.app = app;

    /* Events */
    this.close.on("click", $.proxy(function(e) { this.closeWindow(); }, this));
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

    this.cancelCloseButton.on("click", $.proxy(function(e) { this.closeDisplayer.attr("class", "hidden"); }, this));
    this.quitCloseButton.on("click", $.proxy(function(e) { this.quitCloseWindow(); }, this));
    this.saveAndQuitCloseButton.on("click", $.proxy(function(e) { this.saveQuitCloseWindow(); }, this));

    /* Initialization */
    this.init();
}

Window.prototype = {
    constructor: Window,

    closeWindow: function() {
        if (this.app.isDocumentSaved()) { // Document saved.
            this.setNewBounds();
            chrome.app.window.current().close();
        } else {
            this.closeDisplayer.attr("class", "visible");
        }
    },

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

        frameStylesheetLink.setAttribute("href", "css/window-frame-" + operatingSystem + ".css");
        this.close.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-close");
        this.maximize.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-maximize");
        this.minimize.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-minimize");

        this.head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
    },

    quitCloseWindow: function() {
        this.setNewBounds();
        chrome.app.window.current().close();
    },

    saveQuitCloseWindow: function() {
        this.setNewBounds();
        if (this.app.isEntrySaved()) { // Document saved.
            this.app.save(function(e) { chrome.app.window.current().close(); });
        } else {
            this.app.saveAs(function(e) { chrome.app.window.current().close(); });
        }
    },

    setNewBounds: function() {
        chrome.runtime.getBackgroundPage( function(backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
            backgroundPage.newBounds(chrome.app.window.current().getBounds());
        });
    }
}
