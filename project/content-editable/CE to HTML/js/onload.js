window.onload = function() {
	markdownTA = document.getElementById("markdown-ta");
	htmlTA = document.getElementById("html-conversion-ta");

	markdownCE = document.getElementById("markdown-ce");
	htmlCE = document.getElementById("html-conversion-ce");

	$(markdownTA).on("input propertychange", oldConversion);
	$(markdownCE).on("input propertychange", conversion);

	$(markdownCE).focus();
}