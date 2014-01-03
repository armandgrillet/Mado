window.onload = function() {

	addDiv = document.getElementById("add-div");
	markdownCE = document.getElementById("markdown-ce");
	htmlCE = document.getElementById("html-conversion-ce");

	$(addDiv).on("mousedown", function() {
		saveContent();
		changeContent();
		addMeuh();
	});

	$(markdownCE).on("input propertychange", conversion);

	$(markdownCE).focus();
}