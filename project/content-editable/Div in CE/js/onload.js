window.onload = function() {

	addDiv = document.getElementById("add-div");
	markdownCE = document.getElementById("markdown-ce");
	htmlCE = document.getElementById("html-conversion-ce");

	$(addDiv).on("click", couleur);
	$(markdownCE).on("input propertychange", conversion);
	$(markdownCE).on('selectstart', function () {
        $(document).one('mouseup', saveSelection);
    });

	$(markdownCE).focus();
}