chrome.app.runtime.onLaunched.addListener(function() { // Open mado.html in a new window when button pressed.
  	chrome.app.window.create('editable.html', {
	    bounds: {
	      	width: Math.round(screen.width * 0.85),
	      	height: Math.round(screen.height * 0.85)
	    }, minWidth:320, minHeight: 240
  	});
});