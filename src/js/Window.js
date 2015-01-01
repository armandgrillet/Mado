function Window(app) {
    /* Outlets */
    this.cancelCloseButton = $("#cancel");
    this.closeDisplayer = $("#close-alert-displayer"); // The div that contains all the close divs.
    this.head = $("head")[0]; // The "head" section of the main app.
    this.quitCloseButton = $("#quit");
    this.saveAndQuitCloseButton = $("#save-quit");
    this.saveState = $("#save-state");
    this.closeContainer = $("#window-close");
    this.close = $("#window-close-button");
    this.maximize = $("#window-maximize");
    this.minimize = $("#window-minimize");

    /* Variables */
    this.app = app;

    /* Events */
    this.quitCloseButton.on("click", $.proxy(function(e) { this.quitCloseWindow(); }, this));
    this.saveAndQuitCloseButton.on("click", $.proxy(function(e) { this.saveQuitCloseWindow(); }, this));

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

    /* Initialization */
    this.init();
}

Window.prototype = {
    constructor: Window,

    closeWindow: function() {
        chrome.runtime.getBackgroundPage( function(backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
            backgroundPage.newBounds(chrome.app.window.current().getBounds());
        });
        if (this.app.isSaved()) { // Save not made.
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
        sendClosing(); // stats.js
        chrome.runtime.getBackgroundPage(function(backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
            backgroundPage.newBounds(chrome.app.window.current().getBounds());
        });
        chrome.app.window.current().close();
    },

    saveAndQuit: function() {
        fileEntry.createWriter(function(fileWriter) {
            truncated = false;
            fileWriter.onwriteend = function(e) {
                if (!truncated) {
                    truncated = true;
                    this.truncate(this.position);
                    return;
                }
                newRecentFile(fileEntry, "quit");
            };
            fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
        }, errorHandler);
    },

    saveAsAndQuit: function() {
        chrome.fileSystem.chooseEntry(
        {
            type: "saveFile",
            suggestedName: "document.md"
        },
        function(savedFile) {
            if (savedFile) {
                savedFile.createWriter(function(fileWriter) {
                    truncated = false;
                    fileWriter.onwriteend = function(e) {
                        if (!truncated) {
                            truncated = true;
                            this.truncate(this.position);
                            return;
                        }
                        newRecentFile(savedFile, "quit"); // Update the local storage, the file opened is now on top.
                    };
                    fileWriter.write(new Blob([markdown.value], {type: 'plain/text'}));
                }, errorHandler);
            }
        });
    },

    saveQuitCloseWindow: function() {
        if (fileEntry == undefined || nameDiv.innerHTML.substring(nameDiv.innerHTML.length - 9) != "md&nbsp;-") { // Not saved pr the document is not in Markdown.
            this.saveAsAndQuit();
        } else {
            this.saveAndQuit();
        }
    }
}
