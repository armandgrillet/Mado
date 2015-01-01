function PrintManager() {
    /* Outlets */
    this.printButton = $("#print");

    /* Events */
    this.printButton.on("click", function () { window.print(); });
    Mousetrap.bind(["command+p", "ctrl+p"], function(e) { window.print(); return false; });
}

PrintManager.prototype = {
    constructor: PrintManager
}
