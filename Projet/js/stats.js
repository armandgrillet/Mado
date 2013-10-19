var service;
var tracker;

function initStats () {
    // Initialize the Analytics service object with the name of your app.
    service = analytics.getService("Mado");
    service.getConfig().addCallback(setTrackingPermission);

    // Get a Tracker using your Google Analytics app Tracking ID.
    tracker = service.getTracker('UA-XXXXX-X'); // Need to change for the real ID.

    // Record an "appView" each time the user launches your app or goes to a new
    // screen within the app.
    tracker.sendAppView('MainView');
}

function setTrackingPermission (config) {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != undefined) 
			config.setTrackingPermitted(mado["analytics"]);
		else {
			chrome.storage.local.set({ "analytics" : true });
			config.setTrackingPermitted(true);
		}
	});
}

