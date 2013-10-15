/* All the things to do when settings.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
	/* Shortcuts. */
	markdownSyntax = document.getElementById("markdown-radio");
	gfmSyntax = document.getElementById("gfm-radio");

	smaDisplaySize = document.getElementById("small-display-radio");
	medDisplaySize = document.getElementById("medium-display-radio");
	bigDisplaySize = document.getElementById("big-display-radio");

	viewOnResize = document.getElementById("global-view-checkbox");

	analytics = document.getElementById("analytics-checkbox");

	getSyntax();
	getResizing();

	$(markdownSyntax).on("click", function() { setSyntax(false); });
	$(gfmSyntax).on("click", function() { setSyntax(true); });

	$(viewOnResize).on("click", setResizing);
}
