function Editor() {
    /* Outlets */
    this.centerLine = $("#center-line-container");
    this.markdown = $("#markdown");

    /* Variables */
    this.counter = new Counter(this.markdown[0]);
    this.displayManager = new DisplayManager(this);
    this.imageManager = new ImageManager(this);
    this.linkManager = new LinkManager(this);
    this.nameManager = new NameManager(this);
    this.saveStateManager = new SaveStateManager(this);
    this.webImageManager = new WebImageManager(this);

    /* Events */
    this.markdown.on("input propertychange", $.proxy(function () { this.convert(); }, this));

    /* Initialization */
    this.init();
}

Editor.prototype = {
    constructor: Editor,
    convert: function() {
        this.displayManager.update();
        this.saveStateManager.update();
        this.counter.update();
    },

    focus: function() {
        this.markdown.focus();
    },

    getLength: function() {
        return this.markdown.val().length;
    },

    getMarkdown: function() {
        return this.markdown.val();
    },

    getName: function() {
        return this.nameManager.getName();
    },

    getSelection: function() {
        return this.markdown.getSelection();
    },

    init: function() {
        var t = this;
        chrome.storage.local.get("editorInitFileEntry", function(mado) {  // If a file is loading.
            if (mado["editorInitFileEntry"] != undefined) {
                chrome.fileSystem.restoreEntry(
                    mado["editorInitFileEntry"],
                    function (entry) {
                        fileEntry = entry;
                        chrome.storage.local.remove("editorInitFileEntry");

                        fileEntry.file(
                            function(file) {
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    chrome.storage.local.set({ "newFile": chrome.fileSystem.retainEntry(fileEntry), "newFilePath": fileEntry.fullPath }, function() {
                                        t.setMarkdown(e.target.result);
                                        t.saveWithName(fileEntry.fullPath.substring(fileEntry.fullPath.lastIndexOf('/') + 1));
                                    });
                                };
                                reader.readAsText(file);
                            },
                            function(error) { console.log(error); }
                        );
                    }
                );
            } else { // No file loaded, we check if it is the first launch.
                chrome.storage.local.get("firstLaunch", function(mado) { // Set text if it's the first launch.
                    if (mado["firstLaunch"] == undefined) {
                        t.setMarkdown(chrome.i18n.getMessage("msgFirstLaunch"));
                        chrome.storage.local.set({ "firstLaunch" : false });
                    }
                });
            }
        });
    },

    isNamed: function() {
        return this.nameManager.isNamed();
    },

    isSaved: function() {
        return this.saveStateManager.isSaved();
    },

    replaceSelection: function(newSelectedText, start, end) {
        this.markdown.setSelection(start, end);
        this.markdown.replaceSelectedText(newSelectedText, "select");
    },

    save: function() {
        this.saveStateManager.save();
    },

    saveWithName: function(newName) {
        this.nameManager.set(newName);
        this.saveStateManager.save();
    },

    setGalleries: function() {
        this.imageManager.setGalleries();
    },

    setMarkdown: function(newMarkdown, start, end) {
        this.markdown.val(this.markdown.val().substring(0, start) + newMarkdown + this.markdown.val().substring(end, this.markdown.val().length));
        this.convert();
    },

    setSelection: function(start, end) {
        this.markdown.setSelection(start, end);
    }
}
