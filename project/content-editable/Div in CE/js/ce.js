// HTML shortcuts
var markdownTA;
var htmlTA;
var markdownCE;
var htmlCE;

var tempMarkdown;
var optiMarkdown;
var openDiv;
var closeDiv;

function conversion () {
	marked(markdownCE.innerText, function (err, content) {
		htmlCE.innerHTML = content;
	});
}

function saveSelection() {
	
    if (window.getSelection) {    	
        selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
        	console.log(selection.getRangeAt(0));
            return selection.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
    	console.log("Caret");
        return document.selection.createRange();
    }
    return null;
}


function couleur () {
	console.log("hey");
}

function changeTheCE (ce) {
	tempMarkdown = ce;
	return tempMarkdown;
}