function inversion() {
	if(document.getElementById('markdown').className != 'inversed') {
		document.getElementById('markdown').setAttribute("class", "inversed");
		document.getElementById('html').setAttribute("class", "inversed");
	}
	else {
		document.getElementById('markdown').setAttribute("class", '');
		document.getElementById('html').setAttribute("class", '');
	}
}