chrome.app.runtime.onLaunched.addListener(function() {
  	chrome.app.window.create('mado.html', {
	    bounds: {
	      	width: screen.width*0.8,
	      	height: screen.height*0.8
	    }, minWidth:320, minHeight: 240
  	});
});

chrome.commands.onCommand.addListener(function(command) {
   if (command == "cmdNew") {
     	chrome.app.window.create('mado.html', {
	       	frame: 'chrome', bounds: { 
	       		width: screen.width*0.8, 
	       		height: screen.height*0.8
	       	}, minWidth:320, minHeight: 240
     	});
   }
   /*if (command == "cmdNew") {
     	chrome.app.window.create('mado.html', {
	       	frame: 'chrome', bounds: { 
	       		width: screen.width*0.8, 
	       		height: screen.height*0.8
	       	}, minWidth:320, minHeight: 240
     	});
   }*/
});
