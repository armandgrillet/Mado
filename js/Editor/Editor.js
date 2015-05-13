/* Editor is the hub of every objects working to improve the writing experience. */
function Editor() {
    /* Outlets */
    this.markdown = $("#markdown"); // The div where is the markdown textarea.
    this.conversionDiv = $("#html-conversion");

    /* Variables */
    this.counter = new Counter(this.markdown[0]); // Counter of words/characters.
    this.displayManager = new DisplayManager(this); // Convert the markdown in HTML.
    this.helpManager = new HelpManager(); // Manage the help
    this.imageManager = new ImageManager(this); // Manage the button to add offline images.
    this.linkManager = new LinkManager(this); // Manage the button to add links.
    this.nameManager = new NameManager(this); // Manage the name of the file written.
    this.saveStateManager = new SaveStateManager(this); // Manage the save state of the file.
    this.scrollManager = new ScrollManager(this.markdown, this.conversionDiv); // Object allowing a synchronized scroll between the convertedDiv and the conversionDiv.
    this.webImageManager = new WebImageManager(this); // Manage the button to add online images.

    /* Events */
    this.markdown.on("input propertychange", $.proxy(function () { this.convert(); }, this)); // Conversion when there is a change in the markdown textarea.

    /* Initialization */
    this.init();
}

Editor.prototype = {
    constructor: Editor,

    /* Automatic scroll depending on the height of the two zones. */
    checkHeight: function() {
        this.scrollManager.checkZonesHeight();
    },

    /* Update the objects that have to change when the markdown area is changed. */
    convert: function() {
        this.displayManager.update();
        this.saveStateManager.update();
        this.counter.update();
    },

    /* Focus in the textarea. */
    focus: function() {
        this.markdown.focus();
    },

    /* Return the length of the textarea. */
    getLength: function() {
        return this.markdown.val().length;
    },

    /* Return the text of the textarea. */
    getMarkdown: function() {
        return this.markdown.val();
    },

    /* Return the name of the file. */
    getName: function() {
        return this.nameManager.getName();
    },

    /* Return the content of the selection */
    getSelection: function() {
        return this.markdown.getSelection();
    },

    init: function() {
        var t = this; // Shortcut.
        chrome.storage.local.get("editorInitFileEntry", function(mado) {
            if (mado.editorInitFileEntry) { // We are loading a file at start.
                chrome.fileSystem.restoreEntry( // We get the entry.
                    mado.editorInitFileEntry,
                    function (entry) {
                        fileEntry = entry; // Shortcut.
                        chrome.storage.local.remove("editorInitFileEntry"); // We remove the file that has been used.

                        fileEntry.file( // We open the file.
                            function(file) {
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    chrome.storage.local.set({ "newFile": chrome.fileSystem.retainEntry(fileEntry), "newFilePath": fileEntry.fullPath }, function() { // We set two local variables for RecentFilesManager.
                                        t.setMarkdown(e.target.result); // We set the textarea's text.
                                        t.saveWithName(fileEntry.fullPath.substring(fileEntry.fullPath.lastIndexOf('/') + 1)); // We set the name and the save state of the window.
                                    });
                                };
                                reader.readAsText(file); // We read the file as text.
                            },
                            function(error) { console.log(error); }
                        );
                    }
                );
            } else { // No file loaded, we check if it is the first launch.
                chrome.storage.local.get("firstLaunch", function(mado) {
                    if (mado.firstLaunch === undefined) { // It is the first launch, the variable does not exist yet.
                        t.setMarkdown(chrome.i18n.getMessage("msgFirstLaunch")); // We set the textarea's text.
                        chrome.storage.local.set({ "firstLaunch" : false }); // We set the variable so that the message won't be displayed again.
                    }
                });
            }
        });
    },

    /* Return if we're editing a named file. */
    isNamed: function() {
        return this.nameManager.isNamed();
    },

    /* Return if we're editing a samed file. */
    isSaved: function() {
        return this.saveStateManager.isSaved();
    },

    /* Replace some text in the textarea.
     * newSelectedText: the new text.
     * start: start of the text modified.
     * end: end of the text modifierd.
     */
    replaceSelection: function(newSelectedText, start, end) {
        this.markdown.setSelection(start, end);
        this.markdown.replaceSelectedText(newSelectedText, "select");
    },

    /* Set that the document is saved, it is not for real (the real save is made in App). */
    save: function() {
        this.saveStateManager.save();
    },

    /* Set that the document is saved and give it a name, it is not for real (the real save is made in App).
     * newName: new name of the window.
    */
    saveWithName: function(newName) {
        this.nameManager.set(newName);
        this.saveStateManager.save();
    },

    /* Open a window to chose the galleries that Mado can read. */
    setGalleries: function() {
        this.imageManager.setGalleries();
    },

    /* Insert and optionally replace some text in the textarea.
     * newMarkdown: the new text.
     * start: start of the text modified.
     * end: end of the text modifierd.
     */
    setMarkdown: function(newMarkdown, start, end) {
        this.markdown.val(this.markdown.val().substring(0, start) + newMarkdown + this.markdown.val().substring(end, this.markdown.val().length));
        this.convert();
    },

    /* Set the selection in the textarea.
     * start: start of the selection.
     * end: end of the selection.
     */
    setSelection: function(start, end) {
        this.markdown.setSelection(start, end);
    }
};
