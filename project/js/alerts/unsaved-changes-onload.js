/* All the things to do when unsaved-changes.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
	cancel = document.getElementById("cancel");
	quit = document.getElementById("quit");
	safeQuit = document.getElementById("quit");

	$(cancel).on("click", cancelClick);
}