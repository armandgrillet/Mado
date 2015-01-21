/* The JS always in background */
/*
* Functions (in alphabetical order).
*
* Resume:
	* anotherWindow (x, y, width, height): create a new window with given parameters.
	* firstWindow (): create a window without information.
	* newBounds (BoundsObject): set in the storage the new bounds.
	* theMinWidth (): set the window's minWidth.
	* windowCreation (): choose which window to create (another window or a first window).
*/

/* Open mado.
 * parameters: contain the filepath if a file has to be open.
 */
function appLaunch(parameters) {
	if (parameters.items !== undefined) { // If you're opening a Markdown file.
		chrome.storage.local.set({ "appInitFileEntry": chrome.fileSystem.retainEntry(parameters.items[0].entry), "editorInitFileEntry": chrome.fileSystem.retainEntry(parameters.items[0].entry) }, windowCreation);
	} else { // New file.
		windowCreation();
	}
}

/* Create another window.
 * theX: position X of the window.
 * theY: position Y of the window.
 * theWidth: width of the window.
 * theHeight: height of the window.
 */
function anotherWindow (theX, theY, theWidth, theHeight) {
	chrome.app.window.create("mado.html", {
	    bounds: {
			left: theX,
	    	top: theY,
	      	width: theWidth,
	      	height: theHeight
	    },
    	frame: "none",
	    minWidth: theMinWidth(),
	    minHeight: 330
	});
}


/* Create a window without information. */
function firstWindow () {
	chrome.app.window.create("mado.html", {
	    bounds: {
	      	width: Math.round(screen.width * 0.85),
	      	height: Math.round(screen.height * 0.85)
	    },
	    frame: "none",
	    minWidth: theMinWidth(),
	    minHeight: 330
	});
}

/* Set new bounds for Mado
 * bounds: new bounds.
 */
function newBounds (bounds) {
	chrome.storage.local.set({"lastX" : bounds.left, "lastY" : bounds.top, "lastWidth" : bounds.width, "lastHeight" : bounds.height });
}

/* Return the min width of Mado. */
function theMinWidth () {
	return 750;
}

/* Create the window with a good size. */
function windowCreation () {
	chrome.storage.local.get(["lastX", "lastY", "lastWidth", "lastHeight"], function(mado) {
		if (mado.lastX && mado.lastY && mado.lastWidth && mado.lastHeight && ! isNaN(mado.lastX) && ! isNaN(mado.lastY) && ! isNaN(mado.lastWidth) && ! isNaN(mado.lastHeight) && mado.lastX >= 0 && mado.lastY >= 0 && mado.lastWidth >= 330 && mado.lastHeight >= 750)
			anotherWindow(mado.lastX, mado.lastY, mado.lastWidth, mado.lastHeight);
		else
			firstWindow();
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
