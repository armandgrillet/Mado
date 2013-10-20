/* The JS on background */
chrome.app.runtime.onLaunched.addListener(function(parameters) { // Open mado.html in a new window when button pressed.
	/* If you want to try opening a Markdown file with Mado on Windows, open the command line and try that : 
	"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app-id=YourAppId "C:\Path\To\document.md"
	*/
	if (parameters.items != undefined) // If you're opening a Markdown file.
		chrome.storage.local.set(
			{ 
				"tempFileEntry" : chrome.fileSystem.retainEntry(parameters.items[0].entry)
			}, 
			function() {
				chrome.app.window.create("mado.html", {
				    bounds: {
				      	width: Math.round(screen.width * 0.85),
				      	height: Math.round(screen.height * 0.85)
				    }, 
				    minWidth: 683, 
				    minHeight: 240
	  			});			
			}
		);		
	else // New file.
	  	chrome.app.window.create("mado.html", {
		    bounds: {
		      	width: Math.round(screen.width * 0.85),
		      	height: Math.round(screen.height * 0.85)
		    }, 
		    minWidth: 683, 
		    minHeight: 240
	  	});
});