window.onload = function() {
    var editor = new Editor(); // The editor.
    var app = new App(editor);
    var localizer = new Localizer();
    var appWindow = new Window(app);
};
