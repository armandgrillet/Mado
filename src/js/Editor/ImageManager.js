function ImageManager(editor) {
    /* Outlets */
    this.altInput = $("#alt-input");
    this.cancelImageButton = $("#cancel-image");
    this.galleriesButton = $("#galleries-button");
    this.imageButton = $("#image-button");
    this.imageDisplayer = $("#image-insertion-displayer");
    this.imageBox = $("#image-insertion-box");
    this.imageBrowser = $("#browse-image");
    this.insertImageButton = $("#insert-image");

    /* Variables */
    this.editor = editor; // The editor that we will modify.
    this.startSelection = undefined; // The beginning of the selection in the editor when we are writing the link.
    this.firstEndSelection = undefined; // The beginning of the selection in the editor when we apply the ImageManager.
    this.endSelection = undefined; // The end of the selection in the editor when we are writing the link.
    this.initialSelection = undefined;  // The text selected in the editor when we apply the ImageManager.
    this.imageLoaded = undefined; // The path of the image selected.

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#image-button").length) { // Click on the button.
            if(this.imageDisplayer.hasClass("hidden")) { // If hidden we reset and display the manager.
                this.reset();
                this.display();
            } else { // Manager displayed, we hide it.
                this.imageDisplayer.toggleClass("hidden");
            }
        } else if (!this.imageDisplayer.hasClass("hidden") && !$(e.target).closest("#image-insertion-displayer").length) { // Click elsewhere.
            this.imageDisplayer.toggleClass("hidden");
        }
    }, this));

    this.insertImageButton.on("click", $.proxy(function(e){ this.apply(); }, this)); // Display the manager when clicking the button.
    this.imageBrowser.on("click", $.proxy(function(e){ this.chooseImage(); }, this)); // Open a standard window to choose an image.
    this.galleriesButton.on("click", $.proxy(function(e){ this.setGalleries(); }, this)); // Open a standard window to choose galleries.
    this.cancelImageButton.on("click", $.proxy(function(e){ this.cancel(); }, this)); // Cancels the link (put the old selection).

    this.altInput.keyup($.proxy(function(e) {
        switch (e.keyCode) {
        case 13: // The user press enter, we apply.
            this.apply();
            break;
        case 27: // The user press echap, we cancel.
            this.cancel();
            break;
        default: // THe user type something in an input, we update.
            this.update();
        }
    }, this));
}

ImageManager.prototype = {
    constructor: ImageManager,

    /* Applies the new image and closes the manager. */
    apply: function() {
        if (this.altInput.val() === "") { // An alternative text is mandatory.
            this.altInput.addClass("flash");
            this.altInput.focus(); // We focus the cursor on the input to add an alternative text.
            setTimeout($.proxy(function() {
                this.altInput.removeClass("flash");
            }, this), 800); // The "flash" class is deleted after 0.8 seconds (the flash animation's duration).
        } else if (this.imageLoaded !== undefined) { // Everything looks good, we close the manager.
            this.imageDisplayer.addClass("hidden");
            this.editor.focus();
            this.editor.setSelection(this.endSelection, this.endSelection); // The caret is at the end of the image.
        }
    },

    /* Cancels the manager. */
    cancel: function() {
        this.imageDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },

    /* Lets the user choose an image through a standard window. */
    chooseImage: function() {
        var t = this; // Shortcut.
        chrome.fileSystem.chooseEntry({
            type: "openFile",
            accepts:[{ mimeTypes: ["image/*"] }] // We only accept images.
        }, function(entry) {
            if (entry) { // The user did select one entry.
                chrome.fileSystem.getDisplayPath(entry, function(path) { // The path is the information displayed in the markdown area.
                    var imageName = path.substring(path.replace(/\\/g, "/").lastIndexOf('/') + 1); // We get the name of the file without all the path.
                    t.setImageBrowser(imageName);
                    t.imageLoaded = path.replace(/\\/g, "/"); // standardization.
                    t.update();
                    t.altInput.focus(); // An alternative text is mandatory so we encourage users to add it.
                });
            }
        });
    },

    /* Displays the manager, if a selection is made we use the text to fill inputs. */
    display: function() {
        this.imageDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection(); // Use of rangyinputs.js
        this.initialSelection = selection.text;
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;

        if (/!\[.*\]\(.*\)/.test(selection.text) && selection.text[0] == '!' && selection.text.slice(-1) == ')') { // An image in markdown syntax has been selected.
            if (/!\[.*\]\(.*\s+".*"\)/.test(selection.text)) { // Optional title is here.
                this.imageLoaded = selection.text.match(/\(.*\)/)[0].substring(2, selection.text.match(/\(.*\s+"/)[0].length - 2).replace(/\\/g, "/");
            } else {
                this.imageLoaded = selection.text.match(/\(.*\)/)[0].substring(2, selection.text.match(/\(.*\)/)[0].length - 1).replace(/\\/g, "/");
            }
            this.setImageBrowser(this.imageLoaded.substring(this.imageLoaded.replace(/\\/g, "/").lastIndexOf('/') + 1));
            this.altInput.val(selection.text.match(/!\[.+\]/)[0].substring(2, selection.text.match(/!\[.+\]/)[0].length - 1));
        } else {
            this.altInput.val(selection.text); // We put all the selection as the alternative value.
        }
        this.altInput.focus();
    },

    /* Reset the manager. */
    reset: function() {
        this.imageBrowser.html(chrome.i18n.getMessage("msgChooseAnImage"));
        this.altInput.val("");
        this.imageLoaded = undefined;
    },

    /* Lets the user choose the galleries. */
    setGalleries: function() {
        chrome.mediaGalleries.getMediaFileSystems({ interactive : "yes" }, $.proxy(function(objectProperties){ this.editor.convert(); }, this));
    },

    /* The length of the button is fixed so we do not want a strign that is too long. */
    setImageBrowser: function(imageName) {
        if (imageName.length > 15) { // Too long to be beautiful.
            this.imageBrowser.html(imageName.substring(0, 6) + "(…)" + imageName.substring(imageName.length - 6));
        } else {
            this.imageBrowser.html(imageName); // We keep the original string.
        }
    },

    /* Input in the manager, we update the markdown */
    update: function() {
        var image;
        if (this.imageLoaded) { // Image selected.
            image = "![" + this.altInput.val() + "](" + this.imageLoaded + ')';
        } else {
            image = "![" + this.altInput.val() + "]()"; // Displays the alternative text because we don't have an image.
        }

        this.editor.setMarkdown(image, this.startSelection, this.endSelection); // Sets the markdown value.
        this.endSelection = this.startSelection + image.length; // Modifies the selection for the next update.
    }
};
