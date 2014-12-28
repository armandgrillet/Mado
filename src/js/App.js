function App() {
    this.moreButton = $("#more-button");
    this.moreDisplayer = $("#more-displayer");
    this.moreBox = $("#more-container");

    this.moreButton.on("click", $.proxy(function(e) { this.moreDisplayer.toggleClass("hidden"); }, this));
}

App.prototype = {
    constructor: App
}
