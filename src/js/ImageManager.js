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
        chrome.mediaGalleries.getMediaFileSystems({ interactive : 'yes' }, $.proxy(function(e){ this.updateGalleries(); }, this)); // Let the user chooses his folders.
    },
    chooseImage: function() {
        var t = this;
        chrome.fileSystem.chooseEntry({
            type: "openFile",
            acceptsMultiple: false,
            accepts:[{ mimeTypes: ["image/*"] }]
        }, function(entry, entries) {
            if (entry) {
                chrome.fileSystem.getDisplayPath(entry[0], function(path) {
                    console.log(path);
                    t.setImageBrowser(path.substring(path.replace(/\\/g, "/").lastIndexOf('/') + 1));
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
        this.startSelection = selection["start"];
        this.firstEndSelection = selection["end"];
        this.endSelection = selection["end"];
        this.initialSelection = this.editor.getMarkdown().substring(this.startSelection, this.endSelection);
        var initialSelection = this.initialSelection;
        if (/!\[.*\]\(.*\)/.test(initialSelection) &&
            initialSelection[0] == '!' &&
            initialSelection[initialSelection.length - 1] == ')') {
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
        this.editor.setRange(this.startSelection, this.endSelection);
    },
    galleryAnalysis: function(index) {
        if (! this.rightFile) {
            if (index < this.galleriesList.length) {
                this.currentGallery = index;
                this.galleriesList.forEach(
                    function(item, indx, arr) { // For each gallery.
                        if (indx == index && this.imagePath != undefined && this.rightFile == false) // If we're looking for a file.
                            item.root.createReader().readEntries($.proxy(function(entriesPath) { getImages(entriesPath); }, this)); // Get the images of the folder.
                        }
                    )
                } else {
                    fileNotFound();
                }
            } else {
                imagesArray.length = 0;
                modifyImage();
            }
    },
    getImage: function(entryPath) {
        var t = this;
        galleriesList[currentGallery].root.getFile(entryPath, {create: false}, function(fileEntry) { // Time to get the ID of the file.
            fileEntry.file(function(theFile) {
                var reader = new FileReader();
                reader.onloadend = function(e) { // We have the file (.result).
                    t.imagesArray.push([imagePath, this.result, true]); // Add a new line.
                    t.tempConversion = t.tempConversion.substring(0, t.imagePosition) + this.result + t.tempConversion.substring(t.imagePosition + t.imagePath.length); // Replace the path.
                    t.rightFile = true;
                    if (t.tempConversion.indexOf("<img src=\"", t.imagePosition) != -1) {
                        t.displayImages();
                    } else { // The end.
                        t.endOfConversion();
                    }
                };
                reader.readAsDataURL(theFile);
            });
        });
    },
    getImages: function(entriesPath) {
        for (var i = 0; i < entriesPath.length && this.rightFile == false; i++) { // All the files in the repository, the correct file is not found yet.
            if (entriesPath[i].isDirectory && this.imagePath.indexOf(entriesPath[i].fullPath) != -1) {// If the file is a directory and the right directory.
                entriesPath[i].createReader().readEntries($.proxy(function(entriesPath) { getImages(entriesPath); }, this)); // Recursivity.
                break;
            } else if (imagePath.indexOf(entriesPath[i].fullPath) != -1) {// It's the correct image!
                this.getImage(entriesPath[i].fullPath);
                break;
            } else if (i == (entriesPath.length - 1)) { // End of the gallery.
                this.galleryAnalysis(currentGallery + 1);
            }
        }
    },
    fileNotFound: function() {
        tempConversion = tempConversion.substring(0, imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + this.imagePath.substring(this.imagePath.replace(/\\/g, "/").lastIndexOf('/') + 1) +" not found</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nofile.png 1x, img/nofile@2x.png 2x" + tempConversion.substring(imagePosition + imagePath.length);
        if (tempConversion.indexOf("<img src=\"", imagePosition) != -1) {
            displayImages();
        } else { // The end.
            endOfConversion();
        }
    },
    reset: function() {
        this.imageBrowser.html("Choose an image");
        this.altInput.val("");
        this.initialSelection = this.editor.getMarkdown();
        this.imageLoaded = undefined;
    },
    setImageBrowser: function(path) {
        if (path.length > 15) { // Too long to be beautiful.
            this.imageBrowser.html(path.substring(0, 6) + "(…)" + path.substring(path.length - 6));
        } else {
            this.imageBrowser.html(path);
        }
    },
    update: function() {
        this.image = "![" + this.altInput.val() + "](" + this.imageLoaded + ')';
        var markdown = this.editor.getMarkdown();

        if (this.imageDiv != undefined) {
            this.imageDiv.text(image);
        } else {
            this.editor.setMarkdown(markdown + this.image);
        }

        if (this.endSelection == undefined) {
            this.endSelection = this.firstEndSelection;
        }
        this.editor.setMarkdown(markdown.substring(0, this.startSelection) + this.image + markdown.substring(this.endSelection, markdown.length));
        this.endSelection = (markdown.substring(0, this.startSelection) + this.image).length;
    },
    updateGalleries: function() {
        chrome.mediaGalleries.getMediaFileSystems({ interactive : "no" }, $.proxy(function(results) {
            this.galleriesList = results;
            this.galleryAnalysis(0);
        }, this));
    }
}
