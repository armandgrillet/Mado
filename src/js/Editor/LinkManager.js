function LinkManager(editor) {
    /* Outlets */
    this.cancelLinkButton = $("#cancel-link");
    this.insertLink = $("#insert-link")
    this.linkButton = $("#link-button");
    this.linkDisplayer = $("#link-insertion-displayer");
    this.urlInput = $("#url-input");
    this.hypertextInput = $("#hypertext-input");

    /* Variables */
    this.editor = editor; // The editor that we will modify.
    this.startSelection; // The beginning of the selection in the editor when we are writing the link.
    this.firstEndSelection; // The beginning of the selection in the editor when we apply the LinkManager.
    this.endSelection; // The end of the selection in the editor when we are writing the link.
    this.initialSelection;  // The text selected in the editor when we apply the LinkManager.

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#link-button").length) { // Click on the button.
            if(this.linkDisplayer.hasClass("hidden")) { // If hidden we reset and display the manager.
                this.reset();
                this.display();
            } else { // This is not a cancellation.
                this.linkDisplayer.addClass("hidden");
            }
        } else if (!this.linkDisplayer.hasClass("hidden") && !$(e.target).closest("#link-insertion-displayer").length) { // Click elsewhere.
            this.linkDisplayer.toggleClass("hidden");
        }
    }, this));

    this.insertLink.on("click", $.proxy(function(e){ this.apply(); }, this)); // Display the manager when clicking the button.
    this.cancelLinkButton.on("click", $.proxy(function(e){ this.cancel(); }, this)); // Cancel the link (put the old selection).

    Mousetrap.bind(["command+k", "ctrl+k"], $.proxy(function(e) { // Ctrl+k = link.
        this.linkButton.click();
        return false;
    }, this));

    this.urlInput.keyup($.proxy(function(e){
        switch (e.keyCode) {
        case 13: // The user press enter, we apply.
            this.apply();
            break;
        case 27: // The user press echap, we cancel.
            this.cancel();
            break;
        default: // THe user type something in an input, we update.
            this.update();
        }
    }, this));

    this.hypertextInput.keydown($.proxy(function(e){
        if (e.keyCode == 9)  { // The user press tab, we put the focus in the URL input.
            e.preventDefault();
            this.urlInput.select();
        }
    }, this));

    this.hypertextInput.keyup($.proxy(function(e){
        switch (e.keyCode) {
        case 13: // The user press enter, we apply.
            this.apply();
            break;
        case 27: // The user press echap, we cancel.
            this.cancel();
            break;
        default: // THe user type something in an input, we update.
            this.update();
        }
    }, this));
}

LinkManager.prototype = {
    constructor: LinkManager,

    /* Applies the new link and closes the manager. */
    apply: function() {
        if (this.urlInput.val() == "") {
            this.urlInput.addClass("flash"); // If the URL input is empty, a flash is triggered on it so that the user knows he has to fill it.
            this.urlInput.focus();
            setTimeout($.proxy(function() {
                this.urlInput.removeClass("flash");
            }, this), 800); // The "flash" class is deleted after 0.8 seconds (the flash animation's duration).
        } else {
            this.linkDisplayer.addClass("hidden");
            this.editor.focus();
            this.editor.setSelection(this.endSelection, this.endSelection); // The caret is at the end of the link.
        }
    },

    /* Cancels the manager. */
    cancel: function() {
        this.linkDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },

    /* Display the manager, if a selection is made we use the text to fill inputs. */
    display: function() {
        this.linkDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection(); // Use of rangyinputs.js
        var initialSelection = selection.text; // Shortcut
        this.initialSelection = initialSelection;
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;

        if (/\[.*\]\(.*\)/.test(initialSelection) && initialSelection[0] == '[' && initialSelection.slice(-1) == ')') { // A link in markdown syntax has been selected.
            this.hypertextInput.val(initialSelection.match(/\[.*\]/)[0].substring(1, initialSelection.match(/\[.*\]/)[0].length - 1)); // Set the hypertext.
            this.urlInput.val(initialSelection.match(/\(.*\)/)[0].substring(1, initialSelection.match(/\(.*\)/)[0].length - 1)); // Set the link.
        } else {
            this.hypertextInput.val(initialSelection); // We put all the selection as the hypertext value.
        }
        this.urlInput.focus();
    },

    /* Reset the manager */
    reset: function() {
        this.urlInput.val("");
        this.hypertextInput.val("");
    },

    /* Input in the manager, we update the markdown */
    update: function() {
        var link;
        if (this.hypertextInput.val() == "") { // Hypertext not given.
            link = '[' + this.urlInput.val() + "](" + this.urlInput.val() + ')'; // Only displays the url twice.
        } else {
            link = '[' + this.hypertextInput.val() + "](" + this.urlInput.val() + ')'; // Displays the hypertext and the URL.
        }
        this.editor.setMarkdown(link, this.startSelection, this.endSelection); // Sets the markdown value.
        this.endSelection = this.startSelection + link.length; // Modifies the selection for the next update.
    }
}
