function Editor() {
    /* Outlets */
    this.centerLine = $("#center-line-container");
    this.conversionDiv = $("#html-conversion");
    this.markdown = $("#markdown");

    /* Variables */
    this.counter = new Counter(this.markdown[0]);
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
        this.counter.update();
    },

    focus: function() {
        this.markdown.focus();
    },

    getMarkdown: function() {
        return this.markdown.val();
    },

    getSelection: function() {
        return this.markdown.getSelection();
    },

    replaceSelection: function(newSelectedText, start, end) {
        this.markdown.setSelection(start, end);
        console.log(newSelectedText);
        this.markdown.replaceSelectedText(newSelectedText, "select");
    },

    setMarkdown: function(newMarkdown, start, end) {
        this.markdown.val(this.markdown.val().substring(0, start) + newMarkdown + this.markdown.val().substring(end, this.markdown.val().length));
        this.convert();
    },

    setSelection: function(start, end) {
        this.markdown.setSelection(start, end);
    }
}
