function HelpManager() {
    /* Outlets */
    this.help = $("#help-input"); // The input where the user writes what he wants.
    this.helpButton = $("#help-button"); // The help button.
    this.helpDisplayer = $("#help-input-displayer"); // The div that contains all the help divs.
    this.resultsContainer = $("#help-results-container"); // Will contain the HTML results container.

    /* Variables */
    this.helpSubjects = [ // Subjects concerned by the help, check messages.json in _locales to get the localized values.
        "Headers",
        "Bold",
        "Italic",
        "BoldItalic",
        "OrderedLists",
        "UnorderedLists",
        "InlineStyleLinks",
        "ReferenceStyleLinks",
        "InlineStyleImages",
        "ReferenceStyleImages",
        "Code",
        "Blockquotes",
        "InlineHTML",
        "HorizontalRules",
        "LineBreaks",
        "Tables",
        "Question"
    ];

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#help-button").length && this.helpDisplayer.hasClass("hidden")) { // Click on the help button with the help input hidden.
            this.reset();
            this.helpDisplayer.removeClass("hidden"); // Show the help input.
            this.help.focus(); // Focus in the help input.
        } else if (!this.helpDisplayer.hasClass("hidden") && !$(e.target).closest("#help-input-displayer").length) { // The user doesn't click on the help input nor help results (with help displayed).
            this.resultsContainer.addClass("hidden"); // Hide the results container
            this.helpDisplayer.addClass("hidden"); // Hide the help input.
        }
    }, this));

    Mousetrap.bind(["ctrl+h"], $.proxy(function(e) { // Ctrl+h = display the help.
        this.helpButton.click();
        return false;
    }, this));

    this.help.keyup($.proxy(function(e){ // The user press echap, we quit the help.
        if (e.keyCode == 27) {
            this.helpButton.click();
        }
    }, this));
    this.help.on("input propertychange", $.proxy(function(e) { this.searchAnswers(); }, this)); // Launch the help when something is typed on the input.

    $("#result-switch-1, #result-switch-2, #result-switch-3").on("click", $.proxy(function(e) { // Makes a switch when the user clicks it.
        this.switch(e.target.id.substr(e.target.id.length - 1));
    }, this));
}

HelpManager.prototype = {
    constructor: HelpManager,

    /* Return the minimum length in the user language. */
    localizedMinLength: function() {
        switch (chrome.i18n.getUILanguage()) {
            case "zh-CN":
                return 2;
            default:
                return 3;
        }
    },

    /* Reset the help. */
    reset: function() {
        this.help.val(""); /* Empty the input with help */
        this.resetAnswerDivs(1); /* Doesn't show answers because there is nothing to search */
    },

    /* Reset the answers div startign at the parameter begin.
     * Begin: the first div to empty.
     */
    resetAnswerDivs: function(begin) {
        for (var i = begin; i <= 3; i++) { // i <= 3 because we only have 3 divs with help.
            if ($("#answer-" + i).html() === "") { // If the help div is empty.
                i = 3; // End of the loop.
            } else {
                /* Reset the div. */
                $("#answer-" + i).html("");
                $("#result-" + i).attr("class", "result");
                $("#example-" + i).html("");
            }
        }
    },

    /* Looks for help the user wants. */
    searchAnswers: function () {
        if (this.help.val().length === 0) { // Nothing in the input.
            this.resultsContainer.attr("class", "hidden"); // Hide the results container, there is nothing in it if there is nothing written in the help input.
            this.resetAnswerDivs(3);
        }
        else {
            if (this.help.val().length < this.localizedMinLength()) { // Less than three characters in the input, we're not showing help.
                this.resultsContainer.attr("class", "one-result no-result"); // We only show one div to encourage the user.
                this.resetAnswerDivs(2); // We reset the two other divs.
                switch (this.localizedMinLength() - this.help.val().length) {
                case 2:
                    $("#answer-1").html(chrome.i18n.getMessage("msgTwoMoreCharacters")); // Only one character, user has to give two more characters.
                    break;
                case 1:
                    $("#answer-1").html(chrome.i18n.getMessage("msgOneMoreCharacter")); // Only two characters, user has to give one more character.
                    break;
                }
            } else {
                var maxAnswers = 0; // Reset the number of answers that can be diplayed (max: 3)
                var loc = chrome.i18n; // Shortcut for the localized strings.
                var arr = this.helpSubjects; // Shortcut for the array of subjects.
                for (var i = 0; i < arr.length && maxAnswers < 3; i++) { // A line = a syntax, this loop runs through each line.
                    var j = 0;
                    var wordSearched = "help" + arr[i]; // Get the subhect of help.
                    while (loc.getMessage(wordSearched + j) !== "") { // A subject can have different words describing it, we are checking each of them.
                        if (loc.getMessage(wordSearched + j).toLowerCase().indexOf(this.help.val().toLowerCase()) > -1) { // Everything in lower case to help the condition.
                            var term = loc.getMessage(wordSearched + j); // What is searched.
                            var result = loc.getMessage(wordSearched + "Result"); // The result of the search.
                            var example = loc.getMessage(wordSearched + "Example"); // The example of the search.
                            var wordPos = loc.getMessage(wordSearched + j).toLowerCase().indexOf(this.help.val().toLowerCase());
                            $("#answer-" + (maxAnswers + 1)).html("<h1 class=\"help-title\">" + term.substring(0, wordPos) + "<span class=\"match\">" + term.substr(wordPos, this.help.val().length) + "</span>" + term.substring(wordPos + this.help.val().length) + "</h1>" + result); // Put the answer in the appropriate div.
                            document.getElementById("example-" + (maxAnswers + 1)).innerHTML = example; // Put the answer in the appropriate div.
                            maxAnswers++; // We display 3 answers, e.g. if the user types "bol" we display the results for "bold" and "bold italic".
                            break;
                        }
                        j++; // We don't want to display many times the same thing if a subject has different words describing it.
                    }
                }
                switch (maxAnswers) {
                case 0: // Nothing found.
                    $("#answer-1").html(chrome.i18n.getMessage("msgNoHelpFound")); // Show that we have not find an answer.
                    this.resultsContainer.attr("class", "one-result no-result"); // We only show one resuult.
                    this.resetAnswerDivs(2); // We hide the two other divs.
                    break;
                case 1: // One answer found.
                    this.resultsContainer.attr("class", "one-result");
                    this.resetAnswerDivs(2);
                    break;
                case 2: // Two answers found.
                    this.resultsContainer.attr("class", "two-results");
                    this.resetAnswerDivs(3);
                    break;
                case 3: // Three answers found, maximum number possible at the same time.
                    this.resultsContainer.attr("class", "three-results");
                    break;
                }
            }
        }
        this.setResultsHeight(); // Depending on the answer, the size of each div will change.
    },

    /* Change the height of each answer div depending on the content. */
    setResultsHeight: function() {
        var totalHeight = 0;
        for (var i = 1; i <= 3; i++) {// Check all the results, depending on the number of results
            if ($("#answer-" + i).html() !== "") {
                $("#result-" + i).css("display", "block");
                if ($("#answer-" + i).outerHeight() >= $("#example-" + i).outerHeight())  { // The eight of the answer is bigger than the example.
                    $("#result-" + i).css("height", $("#answer-" + i).outerHeight() + "px"); // Set the div's height as the answer's height.
                } else {
                    $("#result-" + i).css("height", $("#example-" + i).outerHeight() + "px");
                }
                totalHeight += $("#result-" + i).outerHeight(); // Add the height of the current result to the total height
            }
            else {
                $("#result-" + i).css("height", 0);
                $("#result-" + i).css("display", "none");
            }
        }
        this.resultsContainer.css("height", totalHeight + "px"); // Set the resultContainer's height to be the total height.
    },

    /* Switch between example and result */
    switch: function(resultNumber) {
        $("#result-" + resultNumber).toggleClass("switched");
        this.help.focus();
    }
};
