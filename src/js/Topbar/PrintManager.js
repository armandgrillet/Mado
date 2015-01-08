function PrintManager() {
    /* Outlets */
    this.printButton = $("#print");

    /* Events */
    this.printButton.on("click", function () { window.print(); });
    Mousetrap.bind(["command+p", "ctrl+p"], function(e) { window.print(); return false; }); // We only need to call window.print() to do it well, everything is in CSS.
}

PrintManager.prototype = {
    constructor: PrintManager
}
