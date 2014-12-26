function Editor() {
    /* Outlets */
    this.centerLine = $("#center-line-container");
    this.conversionDiv = $("#html-conversion");
    this.markdown = $("#markdown");

    /* Variables */
    this.counter = new Counter();
    this.linkManager = new LinkManager(this);
    this.ImageManager = new ImageManager(this);

    /* Events */
    this.markdown.on("input propertychange", $.proxy(function () {
        this.convert();
    }, this));

    /* Initialization */
    this.convert();
}

Editor.prototype = {
    constructor: Editor,
    convert: function() {
        if (this.markdown.val().length > 0) { // There is Markdown in the textarea.
            this.conversionDiv.html(marked(this.markdown.val()));
        } else { // No Markdown here.
            this.conversionDiv.html("See the result here");
        }
        this.counter.update(this.markdown[0]);
    },

    focus: function() {
        this.markdown.focus();
    },

    getMarkdown: function() {
        return this.markdown.val();
    },

    getSelection: function() {
        var selection = {"start": this.markdown.val().length, "end" : this.markdown.val().length};
        if ((this.markdown[0].selectionStart != this.markdown[0].selectionEnd) || this.markdown.is(":focus")) {
            selection["start"] = this.markdown[0].selectionStart;
            selection["end"] = this.markdown[0].selectionEnd;
        }
        return selection;
    },

    setMarkdown: function(newMarkdown) {
        this.markdown.val(newMarkdown);
        this.convert();
    },

    setRange: function(start, end) {
        if (start < 0 || start > end || end > this.markdown.val().length) {
            throw 'Incorrect range';
        }
        return this.markdown.each($.proxy(function(start, end) {
            if (this.markdown.setSelectionRange) {
                this.markdown.focus();
                this.markdown.setSelectionRange(start, end);
            } else if (this.markdown.createTextRange) {
                newRange = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        }, this));
    }
}
