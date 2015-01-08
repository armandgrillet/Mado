function WebImageManager(editor) {
    /* Outlets */
    this.cancelWebImageButton = $("#cancel-webimage");
    this.insertWebImageButton = $("#insert-webimage");
    this.webImageButton = $("#webimage-button");
    this.webImageUrlInput = $("#webimage-url");
    this.webImageAltInput = $("#webimage-alt-input");
    this.webImageDisplayer = $("#webimage-insertion-displayer");
    this.webImageBox = $("#webimage-insertion-box");

    /* Variables */
    this.editor = editor; // The editor that we will modify.
    this.startSelection; // The beginning of the selection in the editor when we are writing the link.
    this.firstEndSelection; // The beginning of the selection in the editor when we apply the LinkManager.
    this.endSelection; // The end of the selection in the editor when we are writing the link.
    this.initialSelection;  // The text selected in the editor when we apply the LinkManager.

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#webimage-button").length) {
            if (this.webImageDisplayer.hasClass("hidden")) {
                this.reset();
                this.display();
            } else {
                this.webImageDisplayer.addClass("hidden"); // This is not a cancellation.
            }
        } else if (!this.webImageDisplayer.hasClass("hidden") && !$(e.target).closest("#webimage-insertion-box").length) {
            this.webImageDisplayer.toggleClass("hidden");
        }
    }, this));

    this.insertWebImageButton.on("click", $.proxy(function(e){ this.apply(); }, this)); // Display the manager when clicking the button.
    this.cancelWebImageButton.on("click", $.proxy(function(e){ this.cancel(); }, this)); // Cancels the image (put the old selection).

    this.webImageAltInput.add(this.webImageUrlInput).keyup($.proxy(function(e) {
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

    this.webImageAltInput.keydown($.proxy(function(e){
        if (e.keyCode == 9) { // The user press tab, we put the focus in the image's URL input.
            e.preventDefault();
            this.onlineImageUrlInput.select();
        }
    }, this));
}

WebImageManager.prototype = {
    constructor: WebImageManager,

    /* Applies the new image and closes the manager. */
    apply: function() {
        if (this.webImageAltInput.val() == "") { // An alternative text is mandatory
            this.webImageAltInput.attr("class", "flash"); // We focus the cursor on the input to add an alternative text.
            this.webImageAltInput.focus();
            setTimeout($.proxy(function() {
                this.altInput.removeClass("flash");
            }, this), 800); // The "flash" class is deleted after 0.8 seconds (the flash animation's duration).
        } else if (this.webImageUrlInput.val() == "") {
            this.webImageUrlInput.attr("class", "flash");
            this.webImageUrlInput.focus();
            this.webImageUrlInput.attr("class", "");
        } else { // Everything looks good, we close the manager.
            this.webImageDisplayer.addClass("hidden");
            this.editor.focus();
            this.editor.setSelection(this.endSelection, this.endSelection); // The caret is at the end of the image.
        }
    },

    /* Cancels the manager. */
    cancel: function() {
        this.webImageDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },

    /* Displays the manager, if a selection is made we use the text to fill inputs. */
    display: function() {
        this.webImageDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection(); // Use of rangyinputs.js
        this.initialSelection = selection.text;
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;

        if (/!\[.*\]\(.*\)/.test(selection.text) && selection.text[0] == '!' && selection.text.slice(-1)  == ')') { // An online image in markdown syntax has been selected.
            this.webImageAltInput.val(selection.text.match(/!\[.*\]/)[0].substring(2, selection.text.match(/!\[.*\]/)[0].length - 1));
            this.webImageUrlInput.val(selection.text.match(/\(.*\)/)[0].substring(1, selection.text.match(/\(.*\)/)[0].length - 1));
        } else {
            this.webImageAltInput.val(selection.text); // We put all the selection as the alternative value.
        }
        this.webImageUrlInput.focus();
    },

    /* Reset the manager. */
    reset: function() {
        this.webImageAltInput.val("");
        this.webImageUrlInput.val("");
        this.initialSelection = this.editor.getMarkdown();
    },

    /* Input in the manager, we update the markdown */
    update: function() {
        var webImage = "![" + this.webImageAltInput.val() + "](" + this.webImageUrlInput.val() + ')';

        this.editor.setMarkdown(webImage, this.startSelection, this.endSelection); // Sets the markdown value.
        this.endSelection = this.startSelection + webImage.length; // Modifies the selection for the next update.
    }
}
