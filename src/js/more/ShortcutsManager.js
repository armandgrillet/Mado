function ShortcutsManager() {
    /* Outlets */
    this.helpShortcut = $("#help-shortcut");
    this.ctrlOrCmdKey = $(".ctrl-cmd-key");

    /* Initialization */
    this.init();
}

ShortcutsManager.prototype = {
    constructor: ShortcutsManager,

    init: function() {
        if (navigator.appVersion.indexOf("Mac") > -1) {// If the user is on a Mac.
            this.ctrlOrCmdKey.html("&#8984;"); // Insert the "Cmd" symbol.
            this.helpShortcut.css("display", "none"); // Hide the help's shortcut.
        } else {
            this.ctrlOrCmdKey.html("Ctrl"); // Insert the "Ctrl" string.
        }
    }
}
