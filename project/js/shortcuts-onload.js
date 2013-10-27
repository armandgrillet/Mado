/* All the things to do when shortcuts.html is loaded. */

window.onload = function() {
	/*
	* Function.
	*/
	
	if (navigator.appVersion.indexOf("Mac") != -1) /* If the user is on a Mac */
		$(".ctrl-cmd-key").html("&#8984;"); /* Insert the "Cmd" symbol */
	else
		$(".ctrl-cmd-key").html("Ctrl"); /* Insert the "Ctrl" string */
}