window.onload = function() {
	markdown = document.getElementById("markdown");
	html = document.getElementById("html-conversion");

	$(markdown).on("input propertychange", conversion);
}