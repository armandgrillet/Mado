function addTopbarLabels () {
	$(exportButton).attr("title", "Export");
	$(newButton).attr("title", "New");
    $(openButton).attr("title", "Open");
    $(printButton).attr("title", "Print");
    $(recentButton).attr("title", "Recent");
    $(saveButton).attr("title", "Save");
    $(saveAsButton).attr("title", "Save as");
}

function removeTopbarLabels () {
	$(exportButton).removeAttr("title");
	$(newButton).removeAttr("title");
	$(openButton).attr("title");
    $(printButton).attr("title");
    $(recentButton).attr("title");
    $(saveButton).attr("title");
    $(saveAsButton).attr("title");
}