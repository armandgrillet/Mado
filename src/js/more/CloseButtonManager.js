function CloseButtonManager() {
    /* Outlets */
    this.head = $("head")[0]; // The "head" section of the main app.
    this.close = $("#window-close");

    /* Events */
    this.close.on("click", function(e) { chrome.app.window.current().close(); });

    /* Initialization */
    this.init();
}

CloseButtonManager.prototype = {
    constructor: CloseButtonManager,

    init: function() {
        var operatingSystem;

        var frameStylesheetLink = document.createElement("link"); // Create a link that will be the correct CSS file for the more-frame.
        frameStylesheetLink.setAttribute("rel", "stylesheet");
        frameStylesheetLink.setAttribute("type", "text/css");

        if (navigator.appVersion.indexOf("Mac") > -1) { // If the user is on a Mac, redirect to the Mac window frame styles.
            operatingSystem = "mac";
        } else if (navigator.appVersion.indexOf("Win") > -1) { // If the user is on a Windows PC, redirect to the Windows window frame styles.
            operatingSystem = "windows";
        } else { // If the user is on another type of computer, redirect to the generic window frame styles (which are primarily Chrome OS's styles).
            operatingSystem = "chromeos";
        }

        frameStylesheetLink.setAttribute("href", "../../css/more/more-frame-" + operatingSystem + ".css");
        this.close.attr("class", "cta little-icon-" + operatingSystem.substring(0,3) + "-close"); // Set the correct close icon.

        this.head.appendChild(frameStylesheetLink); // Append the link node to the "head" section.
    }
};
