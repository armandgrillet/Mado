function UrlManager(divWithUrls) {
    /* Outlets */
    this.linkUrlSpan = $("#link-url");

    divWithUrls.on("mouseenter", "a", $.proxy(function(e) {
        if (e.currentTarget.href.indexOf("chrome-extension://") == -1) {
            this.linkUrlSpan.html(e.currentTarget.href);
        } else {
            this.linkUrlSpan.html(e.currentTarget.hash);
        }
        this.linkUrlSpan.addClass("show");
    }, this));

    divWithUrls.on("mouseleave", "a", $.proxy(function() {
        this.linkUrlSpan.removeClass("show");
    }, this));
}

UrlManager.prototype = {
    constructor: UrlManager
}
