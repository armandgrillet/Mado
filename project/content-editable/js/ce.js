// HTML shortcuts
var markdownTA;
var htmlTA;
var markdownCE;
var htmlCE;

var tempMarkdown;
var optiMarkdown;
var openDiv;
var closeDiv;

function oldConversion () {
	marked(markdownTA.value, function (err, content) {
		htmlTA.innerHTML = content;
	});
}

function conversion () {
	marked(changeTheCE(markdownCE.innerHTML), function (err, content) {
		htmlCE.innerHTML = content;
	});
}

function changeTheCE (ce) {
	tempMarkdown = ce;
	tempMarkdown = tempMarkdown.replace(/&lt;/g, '<'); // <
	tempMarkdown = tempMarkdown.replace(/&gt;/g, '>'); // >
	tempMarkdown = tempMarkdown.replace(/&nbsp;/g, ' '); // Space.
	tempMarkdown = tempMarkdown.replace(/< *div/g, "<div"); // <div
	tempMarkdown = tempMarkdown.replace(/<div *>/g, "<div>"); // <div>
	tempMarkdown = tempMarkdown.replace(/< *\/ *div *>/g, "</div>"); // </div>

	
	while (tempMarkdown.indexOf("<div>") != -1) { // Remove the useless divs.
		optiMarkdown = checkDiv(0, tempMarkdown, tempMarkdown.indexOf("<div>"));
		if (optiMarkdown[0] != -1) {
			tempMarkdown = optiMarkdown[1];
		}
		else
			break;
	}
	return tempMarkdown;
}

function checkDiv (divCount, content, pos) {
	openDiv = content.indexOf("<div", pos);
	closeDiv = content.indexOf("</div>", pos);

	if (closeDiv != -1) { // If we find a "<div>" or a "</div>".
		if (openDiv != -1 && openDiv < closeDiv) // If <div is here first.
			return (checkDiv(divCount + 1, content, openDiv + 5)); // Recursivity.
		else { // If </div> is here first.
			if (divCount == 1) // If we have the same ammount of "<div>" and "</div>".
				return [0, content.substring(0, content.indexOf("<div>")) + content.substring(content.indexOf("<div>") + 5, closeDiv) + content.substring(closeDiv + 6)]; // Return the text without the useless "<div>" and "</div".
			else
				return(checkDiv(divCount - 1, content, closeDiv + 6)); // Recursivity.
		}
	}
	else
		return [-1]; // Don't remove the brackets.
}