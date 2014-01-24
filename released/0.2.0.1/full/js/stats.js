/* The JS to send data to Analytics. */

/* 
* Variables (in alphabetical order). 
*/

var service;
var tracker;

/*
* Functions (in alphabetical order).
*
* Resume:
	* initStats (): create a new service for Analytics.
	* setTrackingPermission (analyticsService): set the tracking permission.
*/


function initStats () {
    // Initialize the Analytics service object with the name of your app.
    service = analytics.getService("Mado");

    setTrackingPermission();

    // Get a Tracker using your Google Analytics app Tracking ID.
    tracker = service.getTracker("UA-45134408-1"); // Need to change for the real ID.

    // Record an "appView" each time the user launches your app or goes to a new
    // screen within the app.
    tracker.sendAppView("mainWindow");
}

function setTrackingPermission () {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != undefined) 
			service.n.setTrackingPermitted(mado["analytics"]);
		else {
			chrome.storage.local.set({ "analytics" : true });
			service.n.setTrackingPermitted(true);
		}
	});
}

