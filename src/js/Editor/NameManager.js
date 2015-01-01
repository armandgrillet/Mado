function NameManager() {
    /* Outlets */
    this.windowName = $("#doc-name");
    this.headTitle = $("title")[0];

    /* Variables */
    this.name;
}

NameManager.prototype = {
    constructor: NameManager,
    getName: function() {
        return this.name;
    },
    isNamed: function() {
        if (this.name != undefined) {
            return true;
        } else {
            return false;
        }
    },
    set: function(newName) {
        this.name = newName;
        this.windowName.html(newName + "&nbsp;-");
        this.headTitle.innerHTML = newName + " - Mado";
    }
}
