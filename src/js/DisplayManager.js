function DisplayManager(editor) {
    /* Outlets */
    this.conversionDiv = $("#html-conversion");

    /* Variables */
    this.currentGallery;
    this.editor = editor;
    this.galleries;
    this.imagesDisplayed = new ImageArray();
    this.imgFormats = ["png", "bmp", "jpeg", "jpg", "gif", "png", "svg", "xbm", "webp"]; // Authorized images.
    this.imageFound;
    this.loadedImagePath;
    this.imagePosition;
    this.tempConversion; // Temporary conversion before it is displayed in the conversionDiv.
}

DisplayManager.prototype = {
    constructor : DisplayManager,
    displayImages: function() {
        console.log("displayImages");
        if (this.tempConversion.indexOf("<img src=\"", this.imagePosition) > -1) {
            this.imagePosition = this.tempConversion.indexOf("<img src=\"", this.imagePosition) + 10;
            this.loadedImagePath = this.tempConversion.substring(this.imagePosition, this.tempConversion.indexOf("\"", this.imagePosition));

            if (this.imgFormats.indexOf(this.loadedImagePath.substr(this.loadedImagePath.lastIndexOf('.') + 1).toLowerCase()) > -1) {
                /*
                if (this.loadedImagePath.substring(0, 7) == "http://" || this.loadedImagePath.substring(0, 8) == "https://") {
                    if (navigator.onLine) { // Online images
                        if (imagePositionInArray > -1) { // Image is already stored.
                            tempConversion = tempConversion.substring(0, this.imagePosition) + imagesArray[imagePositionInArray][1] + tempConversion.substring(this.imagePosition + this.loadedImagePath.length); // Replace the path.
                            imagesArray[imagePositionInArray][2] = true; // The file has been used.
                        } else { // The array doesn't exist yet.
                            researching	= true;
                            updateOnline(this.loadedImagePath); // Get the ID of the file.
                        }
                    } else {
                        tempConversion = tempConversion.substring(0, this.imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">Internet not available</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nointernet.png 1x, img/nointernet@2x.png 2x" + tempConversion.substring(this.imagePosition + this.loadedImagePath.length);
                    }
                } else */
                if (this.loadedImagePath.substring(0, 5) != "data:" && this.loadedImagePath.substring(0, 5) != "blob:") { // Not already translated
                    if (this.imagesDisplayed.hasPath(this.loadedImagePath)) { // Image is already stored.
                        var image = this.imagesDisplayed.getImage(this.loadedImagePath);
                        tempConversion = tempConversion.substring(0, this.imagePosition) + image + tempConversion.substring(this.imagePosition + this.loadedImagePath.length); // Replace the path.
                        this.imagesDisplayed.setUsed(this.loadedImagePath);
                    } else { // The image is not in the array.
                        console.log("We're searching an offline image");
                        this.imageFound = false;
                        this.getOfflineImage();
                    }
                }
            }
            else if (this.loadedImagePath.substring(0, 5) != "data:" && this.loadedImagePath.substring(0, 5) != "blob:") {
                this.tempConversion = this.tempConversion.substring(0, this.imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">This is not an image</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/notimage.png 1x, img/notimage@2x.png 2x" + this.tempConversion.substring(this.imagePosition + this.loadedImagePath.length);;
                this.displayImages();
            }
        } else {
            this.finishDisplaying();
        }
    },
    finishDisplaying: function() {
        this.conversionDiv.html(this.tempConversion);
    },
    galleryAnalysis: function(index) {
        console.log("Gallery Analysis avec index " + index);
        var t = this;
        if (! this.imageFound) {
            if (index < this.galleries.length) {
                this.currentGallery = index;
                this.galleries.forEach(
                    function(item, indx, arr) { // For each gallery.
                        if (indx == index && t.loadedImagePath != undefined && t.imageFound == false) { // If we're looking for a file.
                            item.root.createReader().readEntries(function(entries) {
                                t.getImages(entries);
                            });
                        }
                    });
            } else {
                this.tempConversion = this.tempConversion.substring(0, this.imagePosition - 10) + "<span class=\"nofile-link\"> <span class=\"nofile-visual\">" + this.imagePath.replace(/\\/g, "/").substring(this.imagePath.lastIndexOf('/') + 1); +" not found</span>&nbsp;</span><img class=\"nofile\" srcset=\"img/nofile.png 1x, img/nofile@2x.png 2x" + this.tempConversion.substring(this.imagePosition + this.loadedImagePath.length);
                this.displayImages();
            }
        }
    },
    getImages: function(entries) {
        for (var i = 0; i < entries.length && this.imageFound == false; i++) { // All the files in the repository, the correct file is not found yet.
            console.log(entries[i].fullPath);
            if (entries[i].isDirectory && this.loadedImagePath.indexOf(entries[i].fullPath) != -1) { // If the file is a directory and the right directory.
                entries[i].createReader().readEntries($.proxy(function(entries) {
                    this.getImages(entries);
                }, this));
                break;
            } else if (this.loadedImagePath.indexOf(entries[i].fullPath) != -1) {// It's the correct image!
                var t = this;
                t.galleries[t.currentGallery].root.getFile(entries[i].fullPath, {create: false}, function(fileEntry) { // Time to get the ID of the file.
                    fileEntry.file(function(theFile) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) { // We have the file (.result).
                            t.imagesDisplayed.addImage(t.loadedImagePath, e.srcElement.result); // Add a new line.
                            t.tempConversion = t.tempConversion.substring(0, t.imagePosition) + e.srcElement.result + t.tempConversion.substring(t.imagePosition + t.loadedImagePath.length); // Replace the path.
                            t.imageFound = true;
                            t.displayImages();
                        };
                        reader.readAsDataURL(theFile);
                    });
                });
                break;
            } else if (i == (entries.length - 1)) { // End of the gallery.
                t.galleryAnalysis(t.currentGallery + 1); // We're searching the next gallery.
            }
        }
    },
    getOfflineImage: function() {
        chrome.mediaGalleries.getMediaFileSystems({ interactive : "no" }, $.proxy(function(galleries) {
            this.galleries = galleries;
            this.galleryAnalysis(0);
        }, this));
    },
    update: function() {
        if (this.editor.getLength() > 0) { // There is Markdown in the textarea.
            this.tempConversion = marked(this.editor.getMarkdown());
            this.displayImages(); // We will finish displaying it after displaying every images.
        } else { // No Markdown here.
            this.conversionDiv.html("See the result here");
        }
    }

}