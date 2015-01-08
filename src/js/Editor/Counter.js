function Counter(countedDiv) {
    /* Outlets */
    this.charsDiv = $("#character-nb"); // The div containing the number of characters.
    this.countedDiv = countedDiv; // The div that is counted.
    this.wordsDiv = $("#word-nb"); // The div containing the number of words.

    /* Events */
    this.charsDiv.add(this.wordsDiv).on("click", $.proxy(function () {
        this.toggleInformationsDisplayed(); // Toggle the number displayed on click.
    }, this));

    /* Initialization */
    this.charsDiv.css("display", "none"); // On launch we display the number of words.
    this.update();
}

Counter.prototype = {
    constructor: Counter,

    /* Displays the number of characters and words in the div counted. */
    display: function(counter) {
        this.charsDiv.html("&nbsp;" + counter.characters + " " + chrome.i18n.getMessage("msgCharacters") + "&nbsp;");
        this.wordsDiv.html("&nbsp;" + counter.words + " " + chrome.i18n.getMessage("msgWords") + "&nbsp;");
        if (counter.characters == 1) {
            this.charsDiv.html("&nbsp;" + " " + chrome.i18n.getMessage("msgCharacter") + "&nbsp;");
        }
        if (counter.words == 1) {
            this.wordsDiv.html("&nbsp;" + counter.words + " " + chrome.i18n.getMessage("msgWord") + "&nbsp;");
        }
    },

    /* Toggles the information displayed. */
    toggleInformationsDisplayed: function() {
        if (this.charsDiv.css("display") == "none") {
            this.charsDiv.css("display", "inline");
            this.wordsDiv.css("display", "none");
        } else {
            this.charsDiv.css("display", "none");
            this.wordsDiv.css("display", "inline");
        }
    },

    /* Update number of words and characters. */
    update: function() {
        Countable.count(this.countedDiv, $.proxy(function(counter) { this.display(counter); }, this), { stripTags: true }); // Without HTML tags.
    }
}
