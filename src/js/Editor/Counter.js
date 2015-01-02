function Counter(countedDiv) {
    /* Outlets */
    this.charsDiv = $("#character-nb");
    this.countedDiv = countedDiv;
    this.linkUrlSpan = $("#link-url");
    this.nameDiv = $("#doc-name");
    this.wordsDiv = $("#word-nb");

    /* Events */
    this.charsDiv.add(this.wordsDiv).on("click", $.proxy(function () {
        this.changeInformationsDisplayed();
    }, this));

    /* Initialization */
    this.charsDiv.css("display", "none"); // On launch we display the number of words.
    this.update();
}

Counter.prototype = {
    constructor: Counter,
    changeInformationsDisplayed: function() {
        if (this.charsDiv.css("display") == "none") {
            this.charsDiv.css("display", "inline");
            this.wordsDiv.css("display", "none");
        } else {
            this.charsDiv.css("display", "none");
            this.wordsDiv.css("display", "inline");
        }
    },

    display: function(counter) {
        this.charsDiv.html("&nbsp;" + counter.characters + " characters&nbsp;");
        this.wordsDiv.html("&nbsp;" + counter.words + " words&nbsp;");
        if (counter.characters == 1) {
            this.charsDiv.html("&nbsp;" + counter.characters + " character&nbsp;");
        }
        if (counter.words == 1) {
            this.wordsDiv.html("&nbsp;" + counter.words + " word&nbsp;");
        }
    },

    update: function() {
        Countable.count(this.countedDiv, $.proxy(function(counter) { this.display(counter); }, this), { stripTags: true }); // Count the words in the conversionDiv without HTML tags.
    }
}
