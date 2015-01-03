function DisplayManager(editor) {
    /* Outlets */
    this.convertedDiv = $("#markdown");
    this.conversionDiv = $("#html-conversion");

    /* Variables */
    this.currentGallery; // Gallery currently visited by getImages();
    this.editor = editor;
    this.galleries = []; // Galleries where we can read images.
    this.imagesDisplayed = new ImageArray(); // Object containing opened images.
    this.imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images' type.
    this.loadedImagePath; // Path of the image found.
    this.imagePosition = 0; // Help us to find all the images in a file.
    this.scrollManager = new ScrollManager(this.convertedDiv, this.conversionDiv); // Object allowing a synchronized scroll between the convertedDiv and the conversionDiv.
    this.styleManager = new StyleManager(); // Object to manage the styles of the conversionDiv.
    this.tempConversion; // Temporary conversion before it is displayed in the conversionDiv.
    this.urlManager = new UrlManager(this.conversionDiv); // Managing what to do when user clicks a link.

    /* Events */
    chrome.storage.onChanged.addListener($.proxy(function (changes, namespace) {
        for (key in changes) {
            switch (key) {
            case "gfm":
                this.setSyntax(); // Set the syntax if it has been changed in the Settings window.
                break;
            }
        }
    }, this));

    /* Initialization */
    this.setSyntax(); // Set the syntax .
}

DisplayManager.prototype = {
    constructor : DisplayManager,

    /* Finds images in the document and convert it because Chrome cannot directly access images. */
    displayImages: function() {
        if (this.tempConversion.indexOf("<img src=\"", this.imagePosition) > -1) {
            this.imagePosition = this.tempConversion.indexOf("<img src=\"", this.imagePosition) + "<img src=\"".length;
            this.loadedImagePath = this.tempConversion.substring(this.imagePosition, this.tempConversion.indexOf("\"", this.imagePosition));
            if (this.imgFormats.indexOf(this.loadedImagePath.substr(this.loadedImagePath.lastIndexOf('.') + 1).toLowerCase()) > -1) {
                if (this.imagesDisplayed.hasPath(this.loadedImagePath)) { // Image is already stored.
                    var image = this.imagesDisplayed.getImage(this.loadedImagePath);
                    this.tempConversion = this.tempConversion.substring(0, this.imagePosition) + image + this.tempConversion.substring(this.imagePosition + this.loadedImagePath.length); // Replace the path.
                    this.displayImages(); // Recursivity.
                } else if (this.loadedImagePath.substring(0, 7) == "http://" || this.loadedImagePath.substring(0, 8) == "https://") {
                    if (navigator.onLine) { // Online images
                        this.getOnlineImage();
                    } else {
                        tempConversion = tempConversion.substring(0, this.imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + chrome.i18n.getMessage("msgNoInternet") + "</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nointernet.png 1x, img/nointernet@2x.png 2x" + tempConversion.substring(this.imagePosition + this.loadedImagePath.length);
                    }
                } else {
                    this.getOfflineImage();
                }
            } else if (this.loadedImagePath.substring(0, 5) != "data:" && this.loadedImagePath.substring(0, 5) != "blob:") {
                this.tempConversion = this.tempConversion.substring(0, this.imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + chrome.i18n.getMessage("msgNotAnImage") + "</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/notimage.png 1x, img/notimage@2x.png 2x" + this.tempConversion.substring(this.imagePosition + this.loadedImagePath.length);;
                this.displayImages();
            }
        } else {
            this.imagesDisplayed.clean();
            this.imagePosition = 0;
            this.finishDisplaying();
        }
    },

    /* Called at the end of the conversion, add some events. */
    finishDisplaying: function() {
        this.conversionDiv.html(this.tempConversion); /* Apply the new conversion. */

        $("#html-conversion a").each(function() { // Add target="_blank" to external links.
            if ($(this).attr("href").substring(0,1) != '#' && $(this).attr("href").substring(0,4) != "http") { // External link with no correct syntax.
                $(this).attr("href", "http://" + $(this).attr("href")); // Add the HTTP protocol to create correct links.
            }
            $(this).attr("target", "_blank");
        });

        $("#html-conversion .nofile-visual").on("click", $.proxy(function(e){ this.editor.setGalleries(); }, this)); // If an image isn't loaded, a default image appeared and if the user clicks the galleries choice appear.
    },

    /* Analyze of a gallery to find an offline image. */
    galleryAnalysis: function(index) {
        var t = this;
        if (index < this.galleries.length) {
            this.currentGallery = index;
            this.galleries.forEach(function(item, indx, arr) { // For each gallery.
                if (indx == index) { // If it is the correct gallery.
                    item.root.createReader().readEntries(function(entries) {
                        t.getImages(entries, 0); // We try to found the image.
                    });
                }
            });
        }
    },

    /* Check if the image is in the entries
     * entries: directory containing other directories and images.
     * i: prosition in the directory.
     */
    getImages: function(entries, i) {
        if (i < entries.length) {
            if (entries[i].isDirectory && this.loadedImagePath.indexOf(entries[i].fullPath.replace(/\'/g, "&#39;")) != -1) { // If the file is a directory and the right directory.
                entries[i].createReader().readEntries($.proxy(function(directory) {
                    this.getImages(directory, 0);
                }, this)); // Recursivity.
            } else if (this.loadedImagePath.indexOf(entries[i].fullPath.replace(/\'/g, "&#39;")) != -1) { // It is the correct image.
                var t = this;
                entries[i].file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        t.imagesDisplayed.addImage(t.loadedImagePath, e.target.result); // Add a new line.
                        t.tempConversion = t.tempConversion.substring(0, t.imagePosition) + e.target.result + t.tempConversion.substring(t.imagePosition + t.loadedImagePath.length); // Replace the path by the image's data.
                        t.displayImages();
                    };
                    reader.readAsDataURL(file);
                });
            }  else { // It is not the correct image, we look for the next element in the directory.
                this.getImages(entries, i + 1);
            }
        } else { // End of the directory.
            if (this.currentGallery < (this.galleries.length - 1)) { // We still have galleries to search.
                this.galleryAnalysis(this.currentGallery + 1); // We start the analysis of the next gallery.
            } else {
                this.tempConversion = this.tempConversion.substring(0, this.imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + this.loadedImagePath.replace(/\\/g, "/").substring(this.loadedImagePath.lastIndexOf('/') + 1) + ' ' + chrome.i18n.getMessage("msgNotFound") + "</span>&nbsp;</span><img class='nofile' srcset='img/nofile.png 1x, img/nofile@2x.png 2x'" + this.tempConversion.substring(this.imagePosition + this.loadedImagePath.length);
                this.displayImages();
            }
        }
    },

    /* Reset image's search and launch it. */
    getOfflineImage: function() {
        chrome.mediaGalleries.getMediaFileSystems({ interactive : "no" }, $.proxy(function(galleries) {
            this.galleries = galleries;
            this.galleryAnalysis(0); // Start the search.
        }, this));
    },

    /* Obtain the online image and create a webview to display it. */
    getOnlineImage: function() {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = $.proxy(function() {
            var webImage = window.URL.createObjectURL(xhr.response);
            this.imagesDisplayed.addImage(this.loadedImagePath, webImage); // Add a new line.
            this.tempConversion = this.tempConversion.substring(0, this.imagePosition) + webImage + this.tempConversion.substring(this.imagePosition + this.loadedImagePath.length); // Replace the path.
            this.displayImages();
        }, this);
        xhr.open("GET", this.loadedImagePath, true);
        xhr.send(this.loadedImagePath);
    },

    /* Set the syntax of marked depending on the data saved on chrome.storage.local, gfm or normal. */
    setSyntax: function() {
        chrome.storage.local.get("gfm", $.proxy(function(mado) {
            if (mado["gfm"] != undefined) {
                marked.setOptions({ gfm : mado["gfm"] });
            } else {
                chrome.storage.local.set({ "gfm" : true });
                marked.setOptions({ gfm : true });
            }
            this.update(); // Do a conversion.
        }, this));
    },

    /* Transform the markdown in HTML. */
    update: function() {
        if (this.editor.getLength() > 0) { // There is Markdown in the textarea.
            this.tempConversion = marked(this.editor.getMarkdown()); // Get the new conversion.
            this.scrollManager.checkZonesHeight(); // Check the scroll.
            this.displayImages(); // We will finish displaying it after displaying every images correctly.
        } else { // No Markdown here.
            this.conversionDiv.html(chrome.i18n.getMessage("msgNoTextInEditor")); // Display the message when there is no text.
        }
    }
}
