function HelpManager() {
    /* Outlets */
    this.help = $("#help-input"); // The input where the user writes what he wants.
    this.helpButton = $("#help-button"); // The help button.
    this.helpDisplayer = $("#help-input-displayer"); // The div that contains all the help divs.
    this.resultsContainer = $("#help-results-container"); // Will contain the HTML results container.

    /* Variables */
    this.helpSubjects = [ // Check messages.json to get the localized values.
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
    this.maxAnswers = 0;

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#help-button").length && this.helpDisplayer.hasClass("hidden")) { // Click on the help button with the help input hidden.
            this.reset();
            this.helpDisplayer.removeClass("hidden");
            this.help.focus();
        } else if (!this.helpDisplayer.hasClass("hidden") && !$(e.target).closest("#help-input-displayer").length) { // The user doesn't click on the help input nor help results (with help displayed).
            this.reset();
            this.resultsContainer.addClass("hidden"); // Hide the results container
            this.helpDisplayer.addClass("hidden");
        }
    }, this));

    Mousetrap.bind(["command+h", "ctrl+h"], $.proxy(function(e) {
        this.helpButton.click();
        return false;
    }, this)); // Ctrl+h = display the help.

    this.help.keyup($.proxy(function(e){
        if (e.keyCode == 27) { // The user press echap
            this.helpButton.click();
        }
    }, this));
    this.help.on("input propertychange", $.proxy(function(e) { this.searchAnswers(); }, this)); // Launch the help when something is typed on the input.

    $("#result-switch-1, #result-switch-2, #result-switch-3").on("click", $.proxy(function(e) {
        this.switch(e.target.id.substr(e.target.id.length - 1));
    }, this));
}

HelpManager.prototype = {
    constructor: HelpManager,
    reset: function() {
        this.help.val("");
        this.resetAnswerDivs(1);
    },

    resetAnswerDivs: function(begin) {
        for (var i = begin; i <= 3; i++) {
            if ($("#answer-" + i).html() == "") {
                i = 3;
            } else {
                $("#answer-" + i).html("");
                $("#result-" + i).attr("class", "result");
                $("#example-" + i).html("");
            }
        }
    },

    searchAnswers: function () {
        for (var i = 1; i <= 3; i++) { // Reset the results' position.
            if ($("#result-" + i).attr("class") == "result switched") {
                $("#result-" + i).attr("class", "result");
            }
        }

        if (this.help.val().length == 0) {
            this.resultsContainer.attr("class", "hidden"); // Hide the results container, there is nothing in it if there is nothing written in the help input.
            this.resetAnswerDivs(3);
        }
        else {
            if (this.help.val().length < 3) {
                this.resultsContainer.attr("class", "one-result no-result");
                this.resetAnswerDivs(2);
                switch (this.help.val().length) { // The input has to have 3 characters minimum to launch the function.
                case 1:
                    $("#answer-1").html(chrome.i18n.getMessage("msgTwoMoreCharacters"));
                    break;
                case 2:
                    $("#answer-1").html(chrome.i18n.getMessage("msgOneMoreCharacter"));
                    break;
                }
            } else {
                var maxAnswers = 0; // Reset the number of answers that can be diplayed (max: 3)
                var loc = chrome.i18n;
                var arr = this.helpSubjects;
                for (var i = 0; i < arr.length && maxAnswers < 3; i++) { // A line = a syntax, this loop runs through each line.
                    var j = 0;
                    var wordSearched = "help" + arr[i];
                    while (loc.getMessage(wordSearched + j) != "") {
                        if (loc.getMessage(wordSearched + j).toLowerCase().indexOf(this.help.val().toLowerCase()) > -1) { // Everything in lower case to help the condition.
                            var term = loc.getMessage(wordSearched + j);
                            var result = loc.getMessage(wordSearched + "Result");
                            var example = loc.getMessage(wordSearched + "Example");
                            var wordPos = loc.getMessage(wordSearched + j).toLowerCase().indexOf(this.help.val().toLowerCase());
                            $("#answer-" + (maxAnswers + 1)).html("<h1 class=\"help-title\">" + term.substring(0, wordPos) + "<span class=\"match\">" + term.substr(wordPos, this.help.val().length) + "</span>" + term.substring(wordPos + this.help.val().length) + "</h1>" + result); // Put the answer in the appropriate div.
                            document.getElementById("example-" + (maxAnswers + 1)).innerHTML = example; // Put the answer in the appropriate div.
                            maxAnswers++; // You can't have more than 3 answers.
                            break;
                        }
                        j++;
                    }
                }
                switch (maxAnswers) {
                case 0: // Nothing found.
                    $("#answer-1").html(chrome.i18n.getMessage("msgNoHelpFound"));
                    this.resultsContainer.attr("class", "one-result no-result");
                    this.resetAnswerDivs(2); // This is 2 and not 1 to display the result "No help found."
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
        this.setResultsHeight();
    },

    setResultsHeight: function() {
        var totalHeight = 0;
        for (var i = 1; i <= 3; i++) {// Check all the results, depending on the number of results
            if ($("#answer-" + i).html() != "") {
                $("#result-" + i).css("display", "block");
                if ($("#answer-" + i).outerHeight() >= $("#example-" + i).outerHeight())  {
                    $("#result-" + i).css("height", $("#answer-" + i).outerHeight() + "px");
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
        this.resultsContainer.css("height", totalHeight + "px");
    },

    switch: function(resultNumber) {
        $("#result-" + resultNumber).toggleClass("switched");
        this.setResultsHeight();
        this.help.focus();
    }
}
