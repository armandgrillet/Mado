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
    this.editor = editor;
    this.startSelection;
    this.firstEndSelection;
    this.endSelection;
    this.initialSelection;
    this.imageLoaded; // The path of the image selected.

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#image-button").length) {
            if(this.imageDisplayer.hasClass("hidden")) {
                this.reset();
                this.display();
            } else {
                this.imageDisplayer.toggleClass("hidden"); // This is not a cancellation.
            }
        } else if (!this.imageDisplayer.hasClass("hidden") && !$(e.target).closest("#image-insertion-displayer").length) {
            this.imageDisplayer.toggleClass("hidden");
        }
    }, this));

    this.insertImageButton.on("click", $.proxy(function(e){ this.apply(); }, this));
    this.imageBrowser.on("click", $.proxy(function(e){ this.chooseImage(); }, this));
    this.galleriesButton.on("click", $.proxy(function(e){ this.setGalleries(); }, this));
    this.cancelImageButton.on("click", $.proxy(function(e){ this.cancel(); }, this));

    this.altInput.keyup($.proxy(function(e) {
        switch (e.keyCode) {
        case 13: // The user press enter.
            this.apply();
            break;
        case 27: // The user press echap.
            this.cancel();
            break;
        default:
            this.update();
        }
    }, this));
}

ImageManager.prototype = {
    constructor: ImageManager,
    apply: function() {
        if (this.altInput.val() == "") { // An alternative input is mandatory
            this.altInput.attr("class", "flash");
            this.altInput.focus();
            this.altInput.attr("class", "");
        }

        if (this.imageLoaded != undefined) {
            this.imageDisplayer.attr("class", "tool-displayer hidden");
            this.editor.focus();
            this.editor.setSelection(this.endSelection, this.endSelection); // The caret is at the end of the link.
        }
    },

    cancel: function() {
        this.imageDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },

    chooseImage: function() {
        var t = this;
        chrome.fileSystem.chooseEntry({
            type: "openFile",
            accepts:[{ mimeTypes: ["image/*"] }]
        }, function(entry) {
            if (entry) {
                chrome.fileSystem.getDisplayPath(entry, function(path) {
                    var imageName = path.substring(path.replace(/\\/g, "/").lastIndexOf('/') + 1);
                    t.setImageBrowser(imageName);
                    t.imageLoaded = path.replace(/\\/g, "/");
                    t.update();
                    t.altInput.focus();
                });
            }
        });
    },

    display: function() {
        this.imageDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection();
        this.initialSelection = selection.text;
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;

        if (/!\[.*\]\(.*\)/.test(selection.text) && selection.text[0] == '!' && selection.text.slice(-1) == ')') {
            if (/!\[.*\]\(.*\s+".*"\)/.test(selection.text)) { // Optional title is here.
                this.imageLoaded = selection.text.match(/\(.*\)/)[0].substring(2, selection.text.match(/\(.*\s+"/)[0].length - 2).replace(/\\/g, "/");
            } else {
                this.imageLoaded = selection.text.match(/\(.*\)/)[0].substring(2, selection.text.match(/\(.*\)/)[0].length - 1).replace(/\\/g, "/");
            }
            this.setImageBrowser(this.imageLoaded.substring(this.imageLoaded.replace(/\\/g, "/").lastIndexOf('/') + 1));
            this.altInput.val(selection.text.match(/!\[.+\]/)[0].substring(2, selection.text.match(/!\[.+\]/)[0].length - 1));
        } else {
            this.altInput.val(selection.text);
        }
        this.altInput.focus();
    },

    reset: function() {
        this.imageBrowser.html("Choose an image");
        this.altInput.val("");
        this.initialSelection = this.editor.getMarkdown();
        this.imageLoaded = undefined;
    },

    setGalleries: function() {
        chrome.mediaGalleries.getMediaFileSystems({ interactive : 'yes' }, $.proxy(function(e){ this.editor.update(); }, this)); // Let the user chooses his folders.
    },

    setImageBrowser: function(imageName) {
        if (imageName.length > 15) { // Too long to be beautiful.
            this.imageBrowser.html(imageName.substring(0, 6) + "(…)" + imageName.substring(imageName.length - 6));
        } else {
            this.imageBrowser.html(imageName);
        }
    },
    
    update: function() {
        var image;
        if (this.imageLoaded == undefined) {
            image = "![" + this.altInput.val() + "]()";
        } else {
            image = "![" + this.altInput.val() + "](" + this.imageLoaded + ')';
        }

        this.editor.setMarkdown(image, this.startSelection, this.endSelection);
        this.endSelection = this.startSelection + image.length;
    }
}
