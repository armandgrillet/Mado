chrome.app.runtime.onLaunched.addListener(function() { // Open mado.html in a new window when button pressed.
  	chrome.app.window.create('image.html', {
	    bounds: {
	      	width: Math.round(screen.width*0.8),
	      	height: Math.round(screen.height*0.8)
	    }, minWidth:320, minHeight: 240
  	});
});
