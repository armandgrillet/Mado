// function initialize() {

// }

function keyHandler(event) {
	alert("Mwahahah.") // TEST
	if (event.keyCode == 13) {
		event.preventDefault;
	}
}

function switchBody()
{
	document.getElementsByTagName('body')[0].className = "switch";
}

//document.body.onkeyup = "keyHandler(lol)";