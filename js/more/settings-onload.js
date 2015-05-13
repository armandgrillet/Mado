/* All the things to do when settings.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
	var closeButtonManager = new CloseButtonManager();
	var localizer = new Localizer();
	var settingsManager = new SettingsManager();
};
