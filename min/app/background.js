/* Open Mado.
 * parameters: filepath if a file has to be open.
 */
function appLaunch(parameters) {
	if (parameters.items) { // User wants to open a Markdown file.
		chrome.storage.local.set({ "appInitFileEntry": chrome.fileSystem.retainEntry(parameters.items[0].entry), "editorInitFileEntry": chrome.fileSystem.retainEntry(parameters.items[0].entry) }, windowCreation);
	} else { // New file.
		windowCreation();
	}
}

/* Set new bounds for Mado
 * bounds: new bounds.
 */
function newBounds (bounds) {
	chrome.storage.local.set({"lastX" : bounds.left, "lastY" : bounds.top, "lastWidth" : bounds.width, "lastHeight" : bounds.height });
}

/* Create the window with a good size. */
function windowCreation () {
	var windowConfig = {
		outerBounds: {
	      	width: Math.round(screen.width * 0.85),
	      	height: Math.round(screen.height * 0.85),
			minWidth: 750,
			minHeight: 330
	    },
	    frame: "none"
	};

	chrome.storage.local.get(["lastX", "lastY", "lastWidth", "lastHeight"], function(mado) {
		if (!isNaN(mado.lastX) && mado.lastX >= 0 && !isNaN(mado.lastY) && mado.lastY >= 0 && !isNaN(mado.lastWidth)  && mado.lastWidth >= 330 && !isNaN(mado.lastHeight) && mado.lastHeight >= 750) {
			windowConfig.outerBounds.left = mado.lastX;
			windowConfig.outerBounds.top = mado.lastY;
			windowConfig.outerBounds.width = mado.lastWidth;
			windowConfig.outerBounds.height = mado.lastHeight;
		}

		chrome.app.window.create("mado.html", windowConfig);
	});
}

/*
* Chrome method.
*/

/* Open mado.html in a new window when button pressed. */
chrome.app.runtime.onLaunched.addListener(function(parameters) {
	var param = parameters;
	chrome.storage.local.get("mado3To4",  function(mado) {
		if (mado.mado3To4 !== true) { // First launch with 0.4, we reset everything because of some problems raised by users.
			chrome.storage.local.clear(function() {
				chrome.storage.local.set({ "mado3To4": true});
				appLaunch(param);
			});
		} else {
			appLaunch(param);
		}
		/* If you want to try opening a Markdown file with Mado on Windows, open the command line and try that :
		"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app-id=YourAppId "C:\Path\To\document.md"
		*/
	});
});
