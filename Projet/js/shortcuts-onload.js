window.onload = function() {
	/* If the user is on a Mac */
	if (navigator.appVersion.indexOf("Mac") != -1)
		$(".ctrl-cmd-key").html("&#8984;"); /* Insert the "Cmd" symbol */
	else
		$(".ctrl-cmd-key").html("Ctrl"); /* Insert the "Ctrl" string */
}