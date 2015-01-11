function ImageArray() {
    this.images = []; // This array has 3 columns: Path | Data | Used during last conversion.
}

ImageArray.prototype = {
    constructor: ImageArray,

    /* Add an image to the array.
     * imagePath: path of the image added.
     * imageData: data of the image added.
     */
    addImage: function(imagePath, imageData) {
        this.images.push([imagePath, imageData, true]);
    },

    /* Remove the non-used images and set the use of used image to flase for the next iteration. */
    clean: function() {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i][2]) {
                this.images[i][2] = false; // Set the use to flase for the next iteration.
            } else {
                this.images.splice(i, 1); // Remove the row.
                i--;
            }
        }
    },

    /* Return the image's data with its path.
     * Pre: imagePath is an existing path.
     * imagePath: path of the image wanted.
     */
    getImage: function(imagePath) {
        for (var i = 0; i < this.images.length; i++) { // Put all the names
            if (this.images[i][0] == imagePath) {
                this.setUsed(imagePath);
                return this.images[i][1];
            } else if (i == this.images.length -1) {
                throw "Image's path not available in image array.";
            }
        }
    },

    /* Return if the path exist in the array.
     * path: path of the image that we want to check.
     */
    hasPath: function(path) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i][0] == path) { // The image already exists.
                return true;
            }
        }
        return false;
    },

    /* Set the image as used during. */
    setUsed: function(path) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i][0] == path) { // It is the image we searched.
                this.images[i][2] = true; // The image has been used.
                break;
            }
        }
    }
};
