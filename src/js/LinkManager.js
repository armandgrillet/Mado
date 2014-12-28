function LinkManager(editor) {
    /* Outlets */
    this.cancelLinkButton = $("#cancel-link");
    this.insertLink = $("#insert-link")
    this.linkButton = $("#link-button");
    this.linkDisplayer = $("#link-insertion-displayer");
    this.urlInput = $("#url-input");
    this.hypertextInput = $("#hypertext-input");

    /* Variables */
    this.editor = editor;
    this.initialSelection = "";
    this.startSelection = 0;
    this.firstEndSelection = 0;
    this.endSelection = 0;

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#link-button").length) {    
            if(this.linkDisplayer.attr("class") == "tool-displayer hidden") {
                this.reset();
                this.display();
            } else {
                this.linkDisplayer.toggleClass("hidden"); // This is not a cancellation.
            }
        } else if (this.linkDisplayer.attr("class") == "tool-displayer" && !$(e.target).closest("#link-insertion-displayer").length) {
            this.linkDisplayer.toggleClass("hidden"); // This is not a cancellation.
        }
    }, this));

    this.insertLink.on("click", $.proxy(function(e){ this.apply(); }, this));
    this.cancelLinkButton.on("click", $.proxy(function(e){ this.cancel(); }, this));

    Mousetrap.bind(["command+k", "ctrl+k"], $.proxy(function(e) { // Ctrl+k = link.
        this.linkButton.click();
        return false;
    }, this));

    this.urlInput.keyup($.proxy(function(e){
        switch (e.keyCode) {
        case 13: // The user press enter.
            this.apply();
            break;
        case 27: // The user press echap.
            this.cancel();
            break;
        default:
            this.update();
        }
    }, this));

    this.hypertextInput.keydown($.proxy(function(e){
        if (e.keyCode == 9)  {
            e.preventDefault();
            this.urlInput.select();
        }
    }, this));

    this.hypertextInput.keyup($.proxy(function(e){
        switch (e.keyCode) {
        case 13: // The user press enter.
            this.apply();
            break;
        case 27: // The user press echap.
            this.cancel();
            break;
        default:
            this.update();
        }
    }, this));
}

LinkManager.prototype = {
    constructor: LinkManager,
    apply: function() {
        if (this.urlInput.val() == "") {
            this.urlInput.addClass("flash"); // If the URL input is empty, a flash is triggered on it so that the user knows he has to fill it.
            this.urlInput.focus();
            setTimeout($.proxy(function() {
                this.urlInput.removeClass("flash");
            }, this), 800); // The "flash" class is deleted after 0.8 seconds (the flash animation's duration).
        } else {
            this.linkDisplayer.toggleClass("hidden");
            this.editor.focus();
            this.editor.setSelection(this.endSelection, this.endSelection); // The caret is at the end of the link.
        }
    },
    cancel: function() {
        this.linkDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },
    display: function() {
        this.linkDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection();
        var initialSelection = selection.text; // Shortcut
        this.initialSelection = initialSelection; // Save it for later.
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;

        if (/\[.*\]\(.*\)/.test(initialSelection) && initialSelection[0] == '[' && initialSelection.slice(-1) == ')') {
            this.hypertextInput.val(initialSelection.match(/\[.*\]/)[0].substring(1, initialSelection.match(/\[.*\]/)[0].length - 1));
            this.urlInput.val(initialSelection.match(/\(.*\)/)[0].substring(1, initialSelection.match(/\(.*\)/)[0].length - 1));
        } else {
            this.hypertextInput.val(initialSelection);
        }
        this.urlInput.focus();
    },
    reset: function() {
        this.urlInput.val("");
        this.hypertextInput.val("");
    },
    update: function() {
        var link;
        if (this.hypertextInput.val() == "") {
            link = '[' + this.urlInput.val() + "](" + this.urlInput.val() + ')';
        } else {
            link = '[' + this.hypertextInput.val() + "](" + this.urlInput.val() + ')';
        }
        this.editor.setMarkdown(link, this.startSelection, this.endSelection);
        this.endSelection = this.startSelection + link.length;
    }
}
