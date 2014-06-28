/* All the things to do when qanda.html is loaded. */

window.onload = function() {
	/*
    * Shortcut.
    */
    head = document.getElementsByTagName("head")[0]; // The "head" section of the option window.
    windowClose = document.getElementById("window-close");

    /*
    * Functions.
    */
    determineCloseButton(); // Determine the close button style.
    
    $(windowClose).on("click", function() {
        chrome.app.window.current().close();
    });
}