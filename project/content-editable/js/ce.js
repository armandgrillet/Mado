var markdown;
var html;

function conversion () {
	marked(markdown.innerHTML, function (err, content) {
		html.innerHTML = content;
	});
}