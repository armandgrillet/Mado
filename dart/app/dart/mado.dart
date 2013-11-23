import "dart:html";
// import "dart:js";

import "help/manager.dart";

HelpManager help = new HelpManager();
Element elementClicked;

void main() {
	document.onClick.listen(clickManagement);
}

void clickManagement(MouseEvent event) {
	// elementClicked = event.target;

	if (isInDiv(event.target, help.helpButton.id) && help.helpDisplayer.className == "tool-displayer hidden")
		help.show();
	else if (! isInDiv(event.target, help.helpDisplayer.id) && help.helpDisplayer.className != "tool-displayer hidden")
		help.hide();
}

bool isInDiv(Element element, String div) {
	if (element != null) {
		if (element.id == div)
			return true;
		else
			return isInDiv(element.parent, div); // Recursivity.
	}		
	else
		return false;
}

/*
void resizeWindow(MouseEvent event) {
	print(querySelector("#image-button"));
  	JsObject appWindow = context['chrome']['app']['window'].callMethod('current', []);
  	JsObject bounds = appWindow.callMethod('getBounds', []);
  
  	bounds['width'] += boundsChange;
  	bounds['left'] -= boundsChange ~/ 2;
  
  	appWindow.callMethod('setBounds', [bounds]);
  
  	boundsChange *= -1;
}
*/
