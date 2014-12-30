function Editor() {
    /* Outlets */
    this.centerLine = $("#center-line-container");
    this.markdown = $("#markdown");

    /* Variables */
    this.counter = new Counter(this.markdown[0]);
    this.displayManager = new DisplayManager(this);
    this.linkManager = new LinkManager(this);
    this.imageManager = new ImageManager(this);
    this.webImageManager = new WebImageManager(this);

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
        this.displayManager.update();
        this.counter.update();
    },

    focus: function() {
        this.markdown.focus();
    },

    getLength: function() {
        return this.markdown.val().length;
    },

    getMarkdown: function() {
        return this.markdown.val();
    },

    getSelection: function() {
        return this.markdown.getSelection();
    },

    replaceSelection: function(newSelectedText, start, end) {
        this.markdown.setSelection(start, end);
        this.markdown.replaceSelectedText(newSelectedText, "select");
    },

    setGalleries: function() {
        this.imageManager.setGalleries();
    },

    setMarkdown: function(newMarkdown, start, end) {
        this.markdown.val(this.markdown.val().substring(0, start) + newMarkdown + this.markdown.val().substring(end, this.markdown.val().length));
        this.convert();
    },

    setSelection: function(start, end) {
        this.markdown.setSelection(start, end);
    }
}
