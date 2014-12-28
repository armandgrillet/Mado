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
    this.currentGallery; // Used when the code is searching an image to know where it is.
    this.galleriesList = []; // List who contains the galleries.
    this.startSelection;
    this.firstEndSelection;
    this.endSelection;
    this.initialSelection;
    this.image; // The content who is added.
    this.imageLoaded; // The path of the image selected.
    this.imagePath; // The path of the image.
    this.imagePosition = 0; // Used to don't keep on the same part of the document.
    this.imagesArray = []; // All the images on the file.
    this.imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
    this.rightFile; // If false the JS is looking for an image.
    this.researching; // If we're searching an image.
    this.tempConversion;
    this.imagePathsArray = [];
    this.imagePositionInArray = 0;

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#image-button").length && this.imageDisplayer.attr("class", "tool-displayer hidden")) {
            this.reset();
            this.display();
        } else if (!$(e.target).closest("#image-insertion-box").length && this.imageDisplayer.attr("class", "tool-displayer")) {// The user doesn't click on the image insertion box.
            this.imageDisplayer.attr("class", "tool-displayer hidden");
        }
    }, this));

    this.insertImageButton.on("click", $.proxy(function(e){ this.apply(); }, this));
    this.imageBrowser.on("click", $.proxy(function(e){ this.chooseImage(); }, this));
    this.galleriesButton.on("click", $.proxy(function(e){ this.chooseGalleries(); }, this));
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
        this.linkDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },
    chooseGalleries: function() {
        chrome.mediaGalleries.getMediaFileSystems({ interactive : 'yes' }, $.proxy(function(e){ this.editor.update(); }, this)); // Let the user chooses his folders.
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
        var initialSelection = selection.text; // Shortcut
        this.initialSelection = selection.text;
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;
        if (/!\[.*\]\(.*\)/.test(initialSelection) && initialSelection[0] == '!' && initialSelection.slice(-1) == ')') {
            if (/!\[.*\]\(.*\s+".*"\)/.test(initialSelection)) { // Optional title is here.
                this.imageLoaded = initialSelection.match(/\(.*\)/)[0].substring(2, initialSelection.match(/\(.*\s+"/)[0].length - 2).replace(/\\/g, "/");
            } else {
                this.imageLoaded = initialSelection.match(/\(.*\)/)[0].substring(2, initialSelection.match(/\(.*\)/)[0].length - 1).replace(/\\/g, "/");
            }
            this.setImageBrowserText(this.imageLoaded.substring(this.imageLoaded.replace(/\\/g, "/").lastIndexOf('/') + 1));
            this.altInput.val(initialSelection.match(/!\[.+\]/)[0].substring(2, initialSelection.match(/!\[.+\]/)[0].length - 1));
        } else {
            this.altInput.val(initialSelection);
        }
    },
    reset: function() {
        this.imageBrowser.html("Choose an image");
        this.altInput.val("");
        this.initialSelection = this.editor.getMarkdown();
        this.imageLoaded = undefined;
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
