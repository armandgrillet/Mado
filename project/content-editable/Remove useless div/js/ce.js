// HTML shortcuts
var markdownCE;

var tempMarkdown;
var optiMarkdown;
var openDiv;
var closeDiv;

function changeCE () {
	tempMarkdown = markdownCE.innerHTML;
	console.log(tempMarkdown);
	tempMarkdown = tempMarkdown.replace(/&lt;/g, '<'); // <
	tempMarkdown = tempMarkdown.replace(/&gt;/g, '>'); // >
	tempMarkdown = tempMarkdown.replace(/&nbsp;/g, ' '); // Space.
	tempMarkdown = tempMarkdown.replace(/< *div/g, "<div"); // <div
	tempMarkdown = tempMarkdown.replace(/<div *>/g, "<div>"); // <div>
	tempMarkdown = tempMarkdown.replace(/< *\/ *div *>/g, "</div>"); // </div>

	if (tempMarkdown.indexOf("<div id=\"mado-link\">") != -1) { // Remove the useless divs.
		optiMarkdown = checkDiv(0, tempMarkdown, tempMarkdown.indexOf("<div id=\"mado-link\">"));
		if (optiMarkdown[0] != -1) {
			tempMarkdown = optiMarkdown[1];
		}
	}
	console.log(tempMarkdown);
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
				return [0, content.substring(0, content.indexOf("<div id=\"mado-link\">")) + content.substring(content.indexOf("<div id=\"mado-link\">") + 20, closeDiv) + content.substring(closeDiv + 6)]; // Return the text without the useless "<div>" and "</div".
			else
				return(checkDiv(divCount - 1, content, closeDiv + 6)); // Recursivity.
		}
	}
	else
		return [-1]; // Don't remove the brackets.
}