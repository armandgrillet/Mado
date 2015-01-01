function PrintManager() {
    /* Outlets */
    this.printButton = $("#print");

    /* Events */
    this.printButton.on("click", function () { window.print(); });
}

PrintManager.prototype = {
    constructor: PrintManager
}
