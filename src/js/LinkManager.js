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
    this.initialText = "";
    this.startSelection = 0;
    this.initialEndSelection = 0;
    this.endSelection = 0;

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#link-button").length && this.linkDisplayer.attr("class") == "tool-displayer hidden") {
            this.reset();
            this.display();
        } else if (this.linkDisplayer.attr("class") == "tool-displayer" && (! $(e.target).closest("#link-insertion-displayer").length || $(e.target).closest("#insert-link").length)) {
            if ($(e.target).closest("#insert-link").length) {
                this.apply();
            } else {
                this.linkDisplayer.toggleClass("hidden");
            }
        }
    }, this));

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

    this.cancelLinkButton.on("click", $.proxy(function(e){ this.cancel(); }, this));
}

LinkManager.prototype = {
    constructor: LinkManager,
    apply: function() {
        if (this.urlInput.val() == "") {
            this.urlInput.attr("class", "tool-first-item flash");
            this.urlInput.focus();
            this.urlInput.attr("class", "tool-first-item");
        } else {
            this.linkDisplayer.toggleClass("hidden");
            this.editor.focus();
            this.editor.setRange(this.startSelection, this.endSelection);
        }
    },
    cancel: function() {
        var markdown = this.editor.getMarkdown();
        this.editor.setMarkdown(markdown.substring(0, this.startSelection) + this.initialText + markdown.substring(this.endSelection, markdown.length));
        this.linkDisplayer.toggleClass("hidden");
        this.editor.focus();
        console.log("On souhaite mettre le range de " + this.startSelection + " à " + this.initialEndSelection);
        this.editor.setRange(this.startSelection, this.initialEndSelection);
    },
    display: function() {
        this.linkDisplayer.toggleClass("hidden");
        var selection = this.editor.getSelection();
        var initialText = markdown.value.substring(selection["start"], selection["end"]); // Shortcut
        this.initialText = initialText; // Save it for later.
        this.startSelection = selection["start"];
        this.initialEndSelection = selection["end"];
        this.endSelection = selection["end"];

        if (/\[.*\]\(.*\)/.test(initialText) && initialText[0] == '[' && initialText[initialText.length - 1] == ')') {
            this.hypertextInput.val(initialText.match(/\[.*\]/)[0].substring(1, initialText.match(/\[.*\]/)[0].length - 1));
            this.urlInput.val(initialText.match(/\(.*\)/)[0].substring(1, initialText.match(/\(.*\)/)[0].length - 1));
        } else {
            this.hypertextInput.val(initialText);
        }
        this.editor.setRange(selection["start"], this.endSelection);

        this.urlInput.focus();
    },
    reset: function() {
        this.urlInput.val("");
        this.hypertextInput.val("");
        this.initialText = this.editor.getMarkdown();
    },
    update: function() {
        var link;
        if (this.hypertextInput.val() == "") {
            link = '[' + this.urlInput.val() + "](" + this.urlInput.val() + ')';
        } else {
            link = '[' + this.hypertextInput.val() + "](" + this.urlInput.val() + ')';
        }
        console.log("Lien : " + link);
        var markdown = this.editor.getMarkdown();
        console.log("Partie avant de Markdown : " + markdown.substring(0, this.startSelection));
        console.log("Partie arrière de Markdown : " + markdown.substring(this.endSelection, markdown.length));
        this.editor.setMarkdown(markdown.substring(0, this.startSelection) + link + markdown.substring(this.endSelection, markdown.length));
        this.endSelection = (markdown.substring(0, this.startSelection) + link).length;
        console.log("Nouvelle fin : " + this.endSelection);
    }
}
