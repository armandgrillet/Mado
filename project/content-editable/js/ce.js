// HTML shortcuts
var markdownTA;
var htmlTA;
var markdownCE;
var htmlCE;
var tempMarkdown = document.createElement("div");
var stringRelou = "<div>Meuh<div> la vache </div></div> <div> et toi </div>"

function oldConversion () {
	marked(markdownTA.value, function (err, content) {
		htmlTA.innerHTML = content;
	});
}

function conversion () {
	marked(changeTheCe(markdownCE.innerHTML), function (err, content) {
		htmlCE.innerHTML = content;
	});
}

function changeTheCe (ce) {
	tempMarkdown.innerHTML = ce;
	/*
	// Remove the useless <div>
	console.log($(tempMarkdown + "> div").length);
	// divRegExp = new RegExp(imagePath, "g");
	// while (tempMarkdown.search(divRegExp) != -1) { // Still useless <div>
	// 	tempMarkdown.substring(tempMarkdown.search(divRegExp)).$("div").length;
	// }
	// Remove the <br>
	tempMarkdown = tempMarkdown.replace(/<br\s*[\/]?>/gi, "\n");
	*/
	return tempMarkdown;
}

function remove () {
	
}