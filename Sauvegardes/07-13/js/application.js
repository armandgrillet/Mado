//Generic functions made by Google
function errorHandler(e) {
  	console.error(e);
}

function readAsText(fileEntry, callback) {
  	fileEntry.file(function(file) {
	    var reader = new FileReader();

	    reader.onerror = errorHandler;
	    reader.onload = function(e) {
	      	callback(e.target.result);
	    };
	    reader.readAsText(file);
  	});
}

//Functions made for Mado
function theme() {
	var setTheme = chrome.storage.sync.get("theme", function(name) {
		var theme = document.createElement("link");
	    theme.setAttribute("rel", "stylesheet");
	    theme.setAttribute("type", "text/css");
	    if(name.theme == "simple" || name.theme == undefined)
	    	theme.setAttribute("href", "./css/themes/simple.css");
	    	if(name.theme == undefined)
	    		chrome.storage.sync.set({"theme" : "simple"}, function() {});
	    else if(name.theme == "modern" || name.theme == "medium")
			theme.setAttribute("href", "./css/themes/"+name.theme+".css");
	    document.getElementsByTagName("head").item(0).appendChild(theme);
	}); /* Find your theme */
  	
}
// Convert the Markdown textarea in a div with HTML 
function conversion() {
  	var converter = new Showdown.converter(); // Use showdown.js 

  	document.querySelector("#html-conversion").innerHTML = converter.makeHtml(document.querySelector("#markdown").value); /*The conversion of the HTML in a single line */
}

// Responsive effect if the screen is to small
function inverse() {
    var switchButton = document.getElementById("switch");

    if(switchButton.className == '') {
      	switchButton.setAttribute("class", "switched");
      	document.getElementById("markdown").setAttribute("class", "inversed");
      	document.getElementById("html-conversion").setAttribute("class", "inversed");
    }
    else if (switchButton.className == "switched") {
      	switchButton.setAttribute("class", "");
      	document.getElementById("markdown").setAttribute("class", '');
      	document.getElementById("html-conversion").setAttribute("class", '');
    }
}

//Chrome special features : 
function newWindow() {
    chrome.app.window.create("mado.html", {
        frame: "chrome", bounds: { 
        	width: screen.width*0.8, 
        	height: screen.height*0.8
        }, minWidth:320, minHeight: 240
    });
}

function editDoc() {
    chrome.fileSystem.chooseEntry({
	 	type: "openWritableFile", accepts:[{
	 		extensions: ["md"]
	 	}] 
	}, 
	function(fileEntry) {
	 	if (!fileEntry) {
			document.querySelector("#markdown").value = "User did not choose a file";
	 		return;
	 	}
	 	fileEntry.file(function(file) {
		 	var reader = new FileReader();
		 	reader.onload = function(e) {
		 		document.querySelector("#markdown").value = e.target.result;
	 		};
			reader.readAsText(file);
	 	});
	});
}

function saveDoc() {
	chrome.fileSystem.chooseEntry({type: "saveFile", 
		suggestedName: "document.md"}, 
	function(writableFileEntry) {
	 	writableFileEntry.createWriter(function(writer) {
	 		writer.write(new Blob([document.querySelector("#markdown").value],
			{type: "text/plain"})); 
	 	}, errorHandler);
	});
}

function exportInHTML() { //Export your markdown in a classic HTML file
	chrome.fileSystem.chooseEntry({type: "saveFile", 
		suggestedName: "document.html"}, 
	function(writableFileEntry) {
	 	writableFileEntry.createWriter(function(writer) {
	 		writer.write(new Blob([document.querySelector("#html-conversion").innerHTML],
			{type: "text/plain"})); 
	 	}, errorHandler);
	});
}

function optionsWindow() { // Open the options window to choose your theme and other things
	chrome.app.window.create("options.html", {
        frame: "chrome", bounds: { 
        	width: screen.width*0.4, 
        	height: screen.height*0.4
        }, minWidth:320, minHeight: 240
    });
}

function helpWindow() { // Open the help window with Markdown documentation
    chrome.app.window.create("help.html", {
        frame: "chrome", bounds: { 
        	width: screen.width*0.4, 
        	height: screen.height*0.7
        }, minWidth:320, minHeight: 240
    });
}

// Things to do when mado.html is fully loaded, the JS can't be in the HTML so we have many event listeners.
onload = function() {
	//Load the CSS theme
	theme();
  	//autosize.js for a beautiful textarea effect
    $(function(){
      	$("#markdown").autosize();
    });
    //The Markdown textarea is translate and put in the "html-conversion" div
    conversion();

    //Event listeners
    document.getElementById("new-doc").addEventListener("click", newWindow); // Open a new Mado window
    document.getElementById("edit-doc").addEventListener("click", editDoc); // Launch the explorer to find a .md file and write on it
    document.getElementById("save-doc").addEventListener("click", saveDoc); // Launch the explorer to find how to save the markdown
    
    document.getElementById("switch-button").addEventListener("click", inverse); // Set the switch button's class to "switched", or removes this class.

    document.getElementById("export-html").addEventListener("click", exportInHTML); // Launch the explorer to find how to export the HTML conversion
    document.getElementById("options").addEventListener("click", optionsWindow); // Open the options window
    document.getElementById("help").addEventListener("click", helpWindow); // Open the help window

    document.getElementById("markdown").addEventListener("keyup", conversion); // Translate  
}