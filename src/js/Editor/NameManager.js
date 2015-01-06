function NameManager() {
    /* Outlets */
    this.windowName = $("#doc-name"); // The name at the top of the window.
    this.headTitle = $("title")[0]; // The tag in the head.

    /* Variables */
    this.name;
}

NameManager.prototype = {
    constructor: NameManager,
    /* Return the name of the file. */
    getName: function() {
        return this.name;
    },

    /* Return if the file edited has a name. */
    isNamed: function() {
        if (this.name) {
            return true;
        } else {
            return false;
        }
    },

    /* Set the name of the file.
     * newName: name of the file edited.
     */
    set: function(newName) {
        this.name = newName;
        this.windowName.html(newName + "&nbsp;-"); // We put a caret between file's name and Mado.
        this.headTitle.innerHTML = newName + " - Mado"; // We still display Mado in the title.
    }
}
