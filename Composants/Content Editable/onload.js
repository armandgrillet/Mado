window.onload = function() {
	var contenu = document.getElementById("contenu");
	var transformButton = document.getElementById("betweenBrackets");

	$(transformButton).on("click", function () { // We have to find the selection and add brackets between it.
		console.log("Debut de la selection " + getSelected().extentOffset + " et fin " + getSelected().baseOffset);
	});
}

function getSelected () {
	if (window.getSelection) {
	    return window.getSelection();
	}
	else if (document.getSelection) {
	    return document.getSelection();
	}
	else {
	    var selection = document.selection && document.selection.createRange();
	    if (selection.text) {
	        return selection.text;
	    }
	    return false;
	}
	return false;
}