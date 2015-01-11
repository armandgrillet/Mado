function ShortcutsManager() {
    /* Outlets */
    this.shortcutUnavailableOnMac = $("#help-shortcut");
    this.ctrlOrCmdKey = $(".ctrl-cmd-key"); // The div displaying Ctrl or Cmd.

    /* Initialization */
    this.init();
}

ShortcutsManager.prototype = {
    constructor: ShortcutsManager,

    /* To do only when the window is initialized. */
    init: function() {
        if (navigator.appVersion.indexOf("Mac") > -1) {// If the user is on a Mac.
            this.ctrlOrCmdKey.html("&#8984;"); // Insert the "Cmd" symbol.
            this.shortcutUnavailableOnMac.css("display", "none"); // Hide the help's shortcut.
        } else {
            this.ctrlOrCmdKey.html("Ctrl"); // Insert the "Ctrl" string.
        }
    }
};
