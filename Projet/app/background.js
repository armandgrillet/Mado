chrome.app.runtime.onLaunched.addListener(function(items) { // Open mado.html in a new window when button pressed.
	console.log(items);
  	chrome.app.window.create('mado.html', {
	    bounds: {
	      	width: Math.round(screen.width * 0.85),
	      	height: Math.round(screen.height * 0.85)
	    }, 
	    minWidth: 683, 
	    minHeight: 240
  	});
});