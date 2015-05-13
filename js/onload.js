window.onload = function() {
    var editor = new Editor(); // The editor.
    var app = new App(editor);
    var appWindow = new Window(app);

    /* Localization */
    $(".localized-placeholder").each(function() {
        $(this).attr("placeholder", chrome.i18n.getMessage($(this).attr("placeholder"))); // Placeholders to translate.
    });

    $(".localized").each(function() { // Text to translate.
        $(this).html(chrome.i18n.getMessage(this.innerHTML));
    });
};
