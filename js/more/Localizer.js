function Localizer() {
    /* Outlets */
    this.localizedText = $(".localized"); // Text to translate.

    /* Initialization */
    this.init();
}

Localizer.prototype = {
    constructor: Localizer,
    /* Set the window depending on the operating system. */
    init: function() {
        this.localizedText.each(function() {
            $(this).html(chrome.i18n.getMessage(this.innerHTML));
        });
    }
};
