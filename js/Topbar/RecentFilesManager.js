function RecentFilesManager(app) {
    /* Outlets */
    this.recentButton = $("#recent-button");
    this.recentFilesDisplayer = $("#recent-files-displayer");
    this.recentFilesContainer = $("#recent-files-container");

    /* Variables */
    this.app = app;
    this.recentFiles = []; // The recent files are in this array has a mix of id | entry.

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#recent-button").length && this.recentFilesDisplayer.hasClass("hidden")) { // Click on the button with manager hidden thus we display it.
            this.displayRecentFiles();
            this.recentFilesDisplayer.toggleClass("hidden");
        } else if (!this.recentFilesDisplayer.hasClass("hidden") && !$(e.target).closest("#recent-files-container").length) { // Click elsewhere than the manager thus we hide it.
            this.recentFilesDisplayer.addClass("hidden"); // This is not a cancellation.
        }
    }, this));

    chrome.storage.onChanged.addListener($.proxy(function(changes, namespace) {
        for (var key in changes) {
            switch (key) {
            case "recentFiles":
                this.init(); // Get all the recent files again in chrome.storage.local and display them.
                break;
            case "newFile":
                this.update(); // Reorganize recentFiles.
                break;
            }
        }
    }, this));

    /* Initialization */
    this.init(); // Get all the recent files again in chrome.storage.local and display them.
}

RecentFilesManager.prototype = {
    constructor: RecentFilesManager,

    /* Check if a file can be restored by Mado or remove the mfrom the recent files.
     * fileToCheck: the number in the array recentFiles corresponding to the file we need to check.
     */
    checkRecentFile: function(fileToCheck) {
        if (fileToCheck < this.recentFiles.length) {
            if (this.recentFiles[fileToCheck] === undefined) {
                t.recentFiles.splice(fileToCheck, 1); // Remove the file from recentFile.
                t.checkRecentFile(fileToCheck); // Check the next file.
            } else {
                var t = this;
                chrome.fileSystem.isRestorable(t.recentFiles[fileToCheck].id, function(isRestorable) { // We check if it's still restorable.
                    if (!isRestorable) { // If it's not restorable.
                        t.recentFiles.splice(fileToCheck, 1); // Remove the file from recentFile.
                        t.checkRecentFile(fileToCheck); // Check the next file.
                    } else {
                        chrome.fileSystem.restoreEntry(t.recentFiles[fileToCheck].id, function (fileToOpen) {
                            if (!fileToOpen) { // The file is empty or deleted.
                                t.recentFiles.splice(fileToCheck, 1); // Remove the file from recentFile.
                                t.checkRecentFile(fileToCheck); // Check the next file.
                            } else {
                                t.checkRecentFile(fileToCheck + 1); // Check the next file.
                            }
                        });
                    }
                });
            }
        } else {
            chrome.storage.local.set({ "recentFiles": this.recentFiles }); // We checked all files, we sync recentFiels with chrome.storage.local.
        }
    },

    /* Display the recent files. */
    displayRecentFiles: function() {
        var t = this; // Shortcut.
        this.recentFilesContainer.html(""); // Reset.

        for (var i = this.recentFiles.length - 1; i >= 0;  i--) { // Add a line for each recent file.
            this.recentFilesContainer.html(this.recentFilesContainer.html() + "<li class=\"recent-file\" id=\"recent-" + i + "\"><div class=\"recent-file-wrapped\"><p>" + this.recentFiles[i].path.substring(this.recentFiles[i].path.lastIndexOf('/') + 1) + "</p><div class=\"delete-recent-button little-icon-delete\" id=\"delete-button-" + i + "\"></div></div></li>");
        }

        $(".recent-file").on("click", function(e) { // Even if on clicks a recent file.
            if (!$(e.target).closest("#delete-button-" + this.id.charAt(this.id.length-1)).length) { // It is not a click on on the delete button.
                var file = t.recentFiles[this.id.charAt(this.id.length-1)].id; // Get the file.
                chrome.fileSystem.restoreEntry(file, function (fileToOpen) { // We get the file.
                    t.app.openFile(fileToOpen); // We open the file.
                    t.recentFilesDisplayer.attr("class", "hidden"); // We hide the recent files manager.
                });
            }
        });
        $(".delete-recent-button").on("click", function() { t.removeFile(this.id.charAt(this.id.length-1)); }); // Add the event listeners for the remove buttons to really remove the file.

        /* Footer */
        var footerHelp = document.createElement("li");
        footerHelp.setAttribute("id", "recent-files-info");
        if (this.recentFilesContainer.html() !== "") { // Something in the div for recent files.
            footerHelp.setAttribute("class", "clear-all");
            $(footerHelp).html("<div class=\"icon-recent-clear\"></div><span class=\"clear-all-text\">" + chrome.i18n.getMessage("msgClearAll") + "</span>");
        } else {
            $(footerHelp).attr("class", " "); // Nothing in the div for recent files.
            $(footerHelp).html(chrome.i18n.getMessage("msgNoRecentDocument"));
        }

        this.recentFilesContainer[0].appendChild(footerHelp); // Add the footer to the container.
        $(".clear-all").on("click", function(e) { t.removeAllFiles(e); });
    },

    /* Initialization, we get the recent files from chrome.Storage.local and test if they are still available. */
    init: function() {
        chrome.storage.local.get("recentFiles", $.proxy(function(mado) {
            if (mado.recentFiles) {
                this.recentFiles = mado.recentFiles; // Set the lcoal variable recentFiles.
                this.checkRecentFile(0); // Check the availability of the files starting with the first one.
            }
        }, this));
    },

    /* Remove all the recent files. */
    removeAllFiles: function(event) {
        event.stopPropagation();
        var numberofRecentFiles = this.recentFiles.length;
        chrome.storage.local.set({ "recentFiles": []}, function() {
            for (var i = numberofRecentFiles - 1; i >= 0;  i--) {
                $("#recent-" + i).remove();
                $("#recent-files-info").attr("class", " ");
                $("#recent-files-info").html(chrome.i18n.getMessage("msgNoRecentDocument")); // Set the footer.
            }
        });
    },

    /* Remove a specific file from the recent files. */
    removeFile: function(file) {
        var t = this;
        $("#recent-" + file).attr("class", "recent-file deleted"); // Change the class to do a visual effect.

        this.recentFiles.splice(file, 1); // Remove the file from the array.
        chrome.storage.local.set({ "recentFiles": this.recentFiles }); // Set the new recentFiles in chrome.storage.local.

        setTimeout(function() { // After the visual effect.
            $("#recent-" + file).remove();
            if ($("#recent-files-displayer .recent-file").length === 0) { // Change the footer.
                $("#recent-files-info").attr("class", " ");
                $("#recent-files-info").html("No recent document.");
            }
        }, 100);
    },

    /* An update has been made on recentFiles, we update the manager. */
    update: function() {
        chrome.storage.local.get(["newFile", "newFilePath"], $.proxy(function(mado) {
            this.recentFiles.push({"path": mado.newFilePath, "id": mado.newFile}); // Put the new one at the end of the recentFiles.
            for (var i = 0; i < this.recentFiles.length - 1; i++) {
                if (this.recentFiles[i].path == mado.newFilePath) {
                    this.recentFiles.splice(i, 1);
                    i--;
                }
            }

            while (this.recentFiles.length > 7) { // recentFiles has a maximum size of 7.
                this.recentFiles.shift();
            }

            chrome.storage.local.set({ "recentFiles": this.recentFiles });
        }, this));
    }
};
