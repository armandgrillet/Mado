function Localizer() {
    /* Outlets */
    this.localizedPlaceholders = $(".localized-placeholder"); // Placeholders to translate.
    this.localizedText = $(".localized"); // Text to translate.

    /* Initialization */
    this.init();
}

Localizer.prototype = {
    constructor: Localizer,
    /* Set the window depending on the operating system. */
    init: function() {
        this.localizedPlaceholders.each(function() {
            $(this).attr("placeholder", chrome.i18n.getMessage($(this).attr("placeholder")));
        });

        this.localizedText.each(function() {
            $(this).html(chrome.i18n.getMessage(this.innerHTML));
        });
    }
};
