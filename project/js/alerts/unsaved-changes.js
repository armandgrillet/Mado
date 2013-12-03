/* 
* Variables (in alphabetical order). 
*/

var cancel; // The "Cancel" button.
var quit; // The "No, don't save" button.
var safeQuit; // The "Save and exit" button.

function cancelClick () {
	chrome.app.window.current().close();
}