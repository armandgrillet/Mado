function UrlManager(divWithUrls) {
    /* Outlets */
    this.linkUrlSpan = $("#link-url"); // Div displaying the url.

    /* Events */
    divWithUrls.on("mouseenter", "a", $.proxy(function(e) { // Mouse hover a link in the div with Urls.
        if (e.currentTarget.href.indexOf("chrome-extension://") == -1) { // It is not an internal link.
            this.linkUrlSpan.html(e.currentTarget.href); // innerHTML set to be the href.
        } else {
            this.linkUrlSpan.html(e.currentTarget.hash); // It is an internal link, innerHTML set to be the hash.
        }
        this.linkUrlSpan.addClass("show"); // Display the span.
    }, this));

    divWithUrls.on("mouseleave", "a", $.proxy(function() {
        this.linkUrlSpan.removeClass("show"); // Hide the span.
    }, this));

    divWithUrls.on("click", "a", function(e) { // Click on a link
        if (e.currentTarget.href.indexOf("chrome-extension://") != -1) { // Click on an inner link.
            e.preventDefault();
            if (e.currentTarget.hash != "" && $(e.currentTarget.hash).length != 0) {
                divWithUrls.scrollTop($(e.currentTarget.hash).position().top); // Scroll to the link pointed in the document.
            }
        }
    });
}

UrlManager.prototype = {
    constructor: UrlManager
}
