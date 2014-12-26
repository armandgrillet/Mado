function Window() {
    this.cancelCloseButton = document.getElementById("cancel");
    this.closePopUp = document.getElementById("close-alert-displayer"); // The div that contains all the close divs.
    this.head = document.getElementsByTagName("head")[0]; // The "head" section of the main app.
    this.quitCloseButton = document.getElementById("quit");
    this.saveAndQuitCloseButton = document.getElementById("save-quit");
    this.saveState = document.getElementById("save-state");
    this.closeContainer = document.getElementById("window-close");
    this.close = document.getElementById("window-close-button");
    this.maximize = document.getElementById("window-maximize");
    this.minimize = document.getElementById("window-minimize");

    chrome.app.window.current().onBoundsChanged.addListener(function () {
        if (chrome.app.window.current().getBounds().width < 1160 && switchToBoth.className == "switch-button activated") {
            switchToMD.click(); // Markdown is set as default view.
        } else if (chrome.app.window.current().getBounds().width >= 1160 && lastBounds.width < 1160) {
            switchToBoth.click(); // viewswitch.js
        }

        if (chrome.app.window.current().getBounds().width < 1600 && lastBounds.width >= 1600) {
            addTopbarLabels();
        } else if (chrome.app.window.current().getBounds().width >= 1600 && lastBounds.width < 1600) {
            removeTopbarLabels();
        }
        lastBounds = chrome.app.window.current().getBounds();
    });
}

Window.prototype = {
    constructor: Window,
    checkSaveState: function() {
        if (markdown.value != "") {
            if (markdownSaved == undefined || markdown.value != markdownSaved) {
                saveState.innerHTML = "<span class=\"little-icon-unsaved\"></span>";
            } else {
                saveState.innerHTML = "";
            }
        } else {
            if (markdownSaved != undefined) {
                saveState.innerHTML = "<span class=\"little-icon-unsaved\"></span>";
            } else {
                saveState.innerHTML = "";
            }
        }
    },

    closeWindow: function() {
        chrome.runtime.getBackgroundPage(function(backgroundPage) { // Set the bounds for the Mado's window size on relaunch.
            backgroundPage.newBounds(chrome.app.window.current().getBounds());
        });
        if (saveState.innerHTML == "<span class=\"little-icon-unsaved\"></span>") { // Save not made.
            closeDisplayer.className = "visible";
        } else {
            sendClosing(); // stats.js
            chrome.app.window.current().close();
        }
    },

    determineFrame: function() {
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
        windowClose.setAttribute("class", "cta little-icon-" + operatingSystem .substring(0,3) + "-close");
        windowMax.setAttribute("class", "cta little-icon-" + operatingSystem .substring(0,3) + "-maximize");
        windowMin.setAttribute("class", "cta little-icon-" + operatingSystem .substring(0,3) + "-minimize");

        head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
    },

    maximizeWindow: function() {
        if (! chrome.app.window.current().isMaximized()) {
            chrome.app.window.current().maximize();
        } else { // Restore the last bounds.
            chrome.app.window.current().restore();
        }
    },

    minimizeWindow: function() {
        chrome.app.window.current().minimize();
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
