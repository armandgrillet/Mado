/* All the things to do when about.html is loaded. */

window.onload = function() {
	/*
    * Shortcut.
    */
    head = document.getElementsByTagName("head")[0]; // The "head" section of the option window.
    windowClose = document.getElementById("window-close");

    /*
    * Function.
    */
    // Determine the close button style
    determineCloseButton();
}