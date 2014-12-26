/* The JS to send data to Analytics. */

/* 
* Variables (in alphabetical order). 
*/

var service;
var tracker;
var markdownInputs = 0;
var launchDate = new Date();

/*
* Functions (in alphabetical order).
*
* Resume:
	* initStats (): create a new service for Analytics.
	* newInputForStats (): send a message when the user has put 50 things in the textarea.
	* sendClosing (): calculate how long the user used this window.
	* sendEvent (): send an event to analytics.
	* setTrackingPermission (analyticsService): set the tracking permission.
*/


function initStats () {
    service = analytics.getService("Mado"); // Initialize the Analytics service object with the name of your app.

    setTrackingPermission();

    /* Get a Tracker using your Google Analytics app Tracking ID. */
    tracker = service.getTracker("UA-45134408-1"); // Need to change for the real ID.

    /* Record an "appView" each time the user launches your app or goes to a new screen within the app. */
    tracker.sendAppView("mainWindow");
}

function newInputForStats () {
	markdownInputs++;
	if (markdownInputs % 50 == 0) {
		sendEvent("50 inputs in the textarea");
	}
}

function sendClosing () {
	if (service != undefined && tracker != undefined && navigator.onLine) {
		chrome.storage.local.get("analytics",  function(mado) {
			if (mado["analytics"] != false) {
				tracker.sendEvent("Window lifetime", "Window has been closed", (parseInt(((new Date()).getTime() - launchDate.getTime()) / 1000 / 60) + ":" + parseInt(((new Date()).getTime() - launchDate.getTime()) / 1000 % 60)).toString());
			}
		});
	}
}

function sendEvent (eventName) {
	if (service != undefined && tracker != undefined && navigator.onLine) {
		chrome.storage.local.get("analytics",  function(mado) {
			if (mado["analytics"] != false) {
				tracker.sendEvent(eventName);
			}
		});
	}	
}

function setTrackingPermission () {
	chrome.storage.local.get("analytics",  function(mado) {
		if (mado["analytics"] != undefined) {
			service.t.setTrackingPermitted(mado["analytics"]);
		} else {
			chrome.storage.local.set({ "analytics" : true });
			service.t.setTrackingPermitted(true);
		}
	});
}