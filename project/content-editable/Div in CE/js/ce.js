// HTML shortcuts
var markdownTA;
var htmlTA;
var markdownCE;
var htmlCE;

var contentHighlighted;

function conversion () {
	marked(markdownCE.innerText, function (err, content) {
		htmlCE.innerHTML = content;
	});
}

function saveContent () {
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0; i < sel.rangeCount; ++i)
                container.appendChild(sel.getRangeAt(i).cloneContents());
            contentHighlighted = container.innerHTML;
        }
    } 
    else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            contentHighlighted = document.selection.createRange().htmlText;
        }
    }
}

function changeContent () {
    contentHighlighted = "<div id=\"mado-link\">" + contentHighlighted + "</div>";
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var div = document.createElement("div");
        div.innerHTML = contentHighlighted;
        var frag = document.createDocumentFragment(), child;
        while ( (child = div.firstChild) ) {
            frag.appendChild(child);
        }
        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        contentHighlighted = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(contentHighlighted);
    }
}

function addMeuh () {
    $(markdownCE).children('#mado-link')[0].innerText = $(markdownCE).children('#mado-link')[0].innerText + "meuh";
}

function changeTheCE (ce) {
	tempMarkdown = ce;
	return tempMarkdown;
}