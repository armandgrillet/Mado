function ImageArray() {
    this.images = []; // This array has 3 columns: Path | Data | Used during last conversion.
}

ImageArray.prototype = {
    constructor: ImageArray,
    addImage: function(imagePath, imageData) {
        this.images.push([imagePath, imageData, true]);
    },
    clean: function() {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i][2] == false) {
                images.splice(i, 1);
                i--;
            }
        }
    },
    /*
    * Pre: imagePath is an existing path.
    */
    getImage: function(imagePath) {
        for (var i = 0; i < this.images.length; i++) { // Put all the names
            if (this.images[i][0] == imagePath) {
                return images[i];
            } else if (i == this.images.length -1) {
                throw "Image's path not available in image array.";
            }
        }
    },
    hasPath: function(path) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i][0] == path) {
                return true;
            }
        }
        return false;
    },
    setUsed: function(path) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i][0] == path) {
                this.images[i][2] = true;
                break;
            }
        }
    }
}
