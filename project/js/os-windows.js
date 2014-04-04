var isMaximizing;
var boundsBeforeMaximized; // This is the variable who stores the bounds when the window is maximised.
var stopBounds;

function functionsForWindows () {
	chrome.app.window.current().onMaximized.addListener(function () {
		console.log("Maximisation");
		if (! isMaximizedOnWindows) {		
			console.log("a");	
			chrome.app.window.current().restore();
		}
		else {
			console.log("b");
			restoreBoundsBeforeMaximizedOnWindows();
		}
	});

	chrome.app.window.current().onRestored.addListener(function () {
		console.log("c");
		boundsBeforeMaximized = chrome.app.window.current().getBounds();
		isMaximizing = true;
		chrome.app.window.current().setBounds({ left: 0, top: 0, width: screen.availWidth, height: screen.availHeight });
	});

	chrome.app.window.current().onBoundsChanged.addListener(function () {
		console.log("d");
        if (! isMaximizing &&
        	chrome.app.window.current().getBounds().left == 0 &&
        	chrome.app.window.current().getBounds().top == 0 &&
        	chrome.app.window.current().getBounds().width >= screen.availWidth &&
        	chrome.app.window.current().getBounds().height >= screen.availHeight) {
        	if (boundsBeforeMaximized != undefined) {
				chrome.app.window.current().setBounds({ width: boundsBeforeMaximized.width, height: boundsBeforeMaximized.height });
        	}
			else 
				chrome.app.window.current().setBounds({ width: screen.width * 0.85, height: screen.height * 0.85 });
		}
		else
			isMaximizing = false;
    });
}

function restoreBoundsBeforeMaximizedOnWindows () {
	console.log("e");
	if (boundsBeforeMaximized != undefined)
		chrome.app.window.current().setBounds(boundsBeforeMaximized);
	else 
		chrome.app.window.current().setBounds({ 
			left: ((screen.availWidth - Math.round(screen.width * 0.85)) / 2), 
			top: ((screen.availHeight - Math.round(screen.height * 0.85)) / 2), 
			width: Math.round(screen.width * 0.85), 
			height: Math.round(screen.height * 0.85) 
		});
}