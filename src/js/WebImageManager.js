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
    this.editor = editor;
    this.startSelection;
    this.firstEndSelection;
    this.endSelection;
    this.initialSelection;

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#webimage-button").length) {
            if(this.webImageDisplayer.attr("class") == "tool-displayer hidden") {
                this.reset();
                this.display();
            } else {
                this.webImageDisplayer.toggleClass("hidden"); // This is not a cancellation.
            }
        } else if (this.webImageDisplayer.attr("class") == "tool-displayer" && !$(e.target).closest("#webimage-insertion-box").length) {
            this.webImageDisplayer.toggleClass("hidden");
        }
    }, this));

    this.insertWebImageButton.on("click", $.proxy(function(e){ this.apply(); }, this));
    this.cancelWebImageButton.on("click", $.proxy(function(e){ this.cancel(); }, this));

    this.webImageAltInput.add(this.webImageAltInput).keyup($.proxy(function(e) {
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
        if (e.keyCode == 9) {
            e.preventDefault();
            this.onlineImageUrlInput.select();
        }
    }, this));
}

WebImageManager.prototype = {
    constructor: WebImageManager,
    apply: function() {
        if (this.webImageAltInput.val() == "") { // An alternative input is mandatory
            this.webImageAltInput.attr("class", "flash");
            this.webImageAltInput.focus();
            this.webImageAltInput.attr("class", "");
        } else if (this.webImageUrlInput.val() == "") {
            this.webImageUrlInput.attr("class", "flash");
            this.webImageUrlInput.focus();
            this.webImageUrlInput.attr("class", "");
        } else {
            this.webImageDisplayer.attr("class", "tool-displayer hidden");
            this.editor.focus();
            this.editor.setSelection(this.endSelection, this.endSelection); // The caret is at the end of the link.
        }
    },
    cancel: function() {
        this.webImageDisplayer.toggleClass("hidden");
        this.editor.replaceSelection(this.initialSelection, this.startSelection, this.endSelection, "select");
    },
    display: function() {
        this.webImageDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection();
        this.initialSelection = selection.text;
        this.startSelection = selection.start;
        this.firstEndSelection = selection.end;
        this.endSelection = selection.end;

        if (/!\[.*\]\(.*\)/.test(selection.text) && selection.text[0] == '!' && selection.text.slice(-1)  == ')') {
            this.webImageAltInput.val(selection.text.match(/!\[.*\]/)[0].substring(2, selection.text.match(/!\[.*\]/)[0].length - 1));
            this.webImageUrlInput.val(selection.text.match(/\(.*\)/)[0].substring(1, selection.text.match(/\(.*\)/)[0].length - 1));
        } else {
            this.webImageAltInput.val(selection.text);
        }
        this.webImageUrlInput.focus();
    },
    reset: function() {
        this.webImageAltInput.val("");
        this.webImageUrlInput.val("");
        this.initialSelection = this.editor.getMarkdown();
    },
    update: function() {
        var webImage = "![" + this.webImageAltInput.val() + "](" + this.webImageUrlInput.val() + ')';

        this.editor.setMarkdown(webImage, this.startSelection, this.endSelection);
        this.endSelection = this.startSelection + webImage.length;
    }
}
