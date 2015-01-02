function RecentFilesManager(app) {
    /* Outlets */
    this.recentButton = $("#recent-button");
    this.recentFilesDisplayer = $("#recent-files-displayer");
    this.recentFilesContainer = $("#recent-files-container");

    /* Variables */
    this.app = app;
    this.recentFiles = [];

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#recent-button").length && this.recentFilesDisplayer.hasClass("hidden")) {
            this.displayRecentFiles();
            this.recentFilesDisplayer.toggleClass("hidden");
        } else if (!this.recentFilesDisplayer.hasClass("hidden") && !$(e.target).closest("#recent-files-container").length) {
            this.recentFilesDisplayer.addClass("hidden"); // This is not a cancellation.
        }
    }, this));

    chrome.storage.onChanged.addListener($.proxy(function(changes, namespace) {
        for (key in changes) {
            switch (key) {
            case "recentFiles":
                this.init();
                break;
            case "newFile":
                this.update();
                break;
            }
        }
    }, this));

    /* Initialization */
    this.init();
}

RecentFilesManager.prototype = {
    constructor: RecentFilesManager,
    checkRecentFile: function(fileToCheck) {
        if (fileToCheck < this.recentFiles.length) {
            var t = this;
            chrome.fileSystem.isRestorable(t.recentFiles[fileToCheck]["id"], function(isRestorable) { // We check if it's still restorable.
                if (!isRestorable) { // If it's not restorable.
                    t.recentFiles.splice(fileToCheck, 1);
                    t.checkRecentFile(fileToCheck);
                } else {
                    chrome.fileSystem.restoreEntry(t.recentFiles[fileToCheck]["id"], function (fileToOpen) {
                        if (!fileToOpen) { // The file is empty or deleted.
                            t.recentFiles.splice(fileToCheck, 1);
                            t.checkRecentFile(fileToCheck);
                        } else {
                            t.checkRecentFile(fileToCheck + 1);
                        }
                    });
                }
            });
        } else {
            chrome.storage.local.set({ "recentFiles": this.recentFiles });
        }
    },
    displayRecentFiles: function() {
        var t = this;
        this.recentFilesContainer.html(""); // Reset.

        for (var i = this.recentFiles.length - 1; i >= 0;  i--) {
            this.recentFilesContainer.html(this.recentFilesContainer.html() + "<li class=\"recent-file\" id=\"recent-" + i + "\"><div class=\"recent-file-wrapped\"><p>" + this.recentFiles[i]["path"].substring(this.recentFiles[i]["path"].lastIndexOf('/') + 1) + "</p><div class=\"delete-recent-button little-icon-delete\" id=\"delete-button-" + i + "\"></div></div></li>");
        }

        $(".recent-file").on("click", function(e) { // The user clicks on a recent file.
            if (!$(e.target).closest("#delete-button-" + this.id.charAt(this.id.length-1)).length) {
                var file = t.recentFiles[this.id.charAt(this.id.length-1)]["id"];
                chrome.fileSystem.restoreEntry(file, function (fileToOpen) {
                    t.app.openFile(fileToOpen); // We open the file.
                    t.recentFilesDisplayer.attr("class", "hidden");
                });
            }
        });
        $(".delete-recent-button").on("click", function() { t.removeFile(this.id.charAt(this.id.length-1)); }); // Add the event listeners for the remove buttons.

        /* Footer */
        var footerHelp = document.createElement("li");
        footerHelp.setAttribute("id", "recent-files-info");
        if (this.recentFilesContainer.html() != "") { // Something in the div for recent files.
            footerHelp.setAttribute("class", "clear-all");
            $(footerHelp).html("<div class=\"icon-recent-clear\"></div><span class=\"clear-all-text\">Clear all</span>");
        } else {
            $(footerHelp).attr("class", " "); // Nothing in the div for recent files.
            $(footerHelp).html("No recent document.");
        }

        this.recentFilesContainer[0].appendChild(footerHelp); // Add the footer to the container.
        $(".clear-all").on("click", function(e) { t.removeAllFiles(e); });
    },
    init: function() {
        chrome.storage.local.get("recentFiles", $.proxy(function(mado) {
            if (mado["recentFiles"] != undefined) {
                this.recentFiles = mado["recentFiles"];
            }
            this.checkRecentFile(0);
        }, this));
    },
    removeAllFiles: function(event) {
        event.stopPropagation();
        var oldRecentFiles = this.recentFiles;
        chrome.storage.local.set({ "recentFiles": []}, function() {
            for (var i = oldRecentFiles.length - 1; i >= 0;  i--) {
                $("#recent-" + i).remove();
                $("#recent-files-info").attr("class", " ");
                $("#recent-files-info").html("No recent document.");
            }
        });
    },
    removeFile: function(file) {
        var t = this;
        $("#recent-" + file).attr("class", "recent-file deleted"); // Change the class to do the visual effect.

        this.recentFiles.splice(file, 1);
        chrome.storage.local.set({ "recentFiles": this.recentFiles });

        setTimeout(function() { // After the visual effect.
            $("#recent-" + file).remove();
            if ($("#recent-files-displayer .recent-file").length == 0) { // Change the footer.
                $("#recent-files-info").attr("class", " ");
                $("#recent-files-info").html("No recent document.");
            }
        }, 100);
    },
    update: function() {
        chrome.storage.local.get(["newFile", "newFilePath"], $.proxy(function(mado) {
            this.recentFiles.push({"path": mado["newFilePath"], "id": mado["newFile"]}); // Put the new one at the end of the recentFiles.
            console.log("path = " + mado["newFilePath"]);
            for (var i = 0; i < this.recentFiles.length - 1; i++) {
                console.log("path = " + this.recentFiles[i]["path"]);
                if (this.recentFiles[i]["path"] == mado["newFilePath"]) {
                    this.recentFiles.splice(i, 1);
                    i--;
                }
            }

            while (this.recentFiles.length > 7) {
                this.recentFiles.shift();
            }

            chrome.storage.local.set({ "recentFiles": this.recentFiles });
        }, this));
    }
}
