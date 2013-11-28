import "dart:html";
// import "dart:js";

// Mado libraries.
import "help/manager.dart";
import "md_to_html/translator.dart";

// Mado objects.
HelpManager help;
Translator htmlTranslator;

void main() { // What to do when the HTML is loaded.
	// Objects's creation.
	help = new HelpManager();
	htmlTranslator = new Translator();
	
	htmlTranslator.conversion(); // First text conversion.
	document.onClick.listen(clickManagement); // Click management.
	window.onKeyDown.listen(shortcutsManagement); // Shortcuts management.
}

void clickManagement(MouseEvent event) { // What to do when the user clicks (everywhere).
	// Help.
	if (isInDiv(event.target, help.helpButton.id) && help.helpDisplayer.className == "tool-displayer hidden")
		help.show();
	else if (! isInDiv(event.target, help.helpDisplayer.id) && help.helpDisplayer.className != "tool-displayer hidden")
		help.hide();
	// Images.
	else if (isInDiv(event.target, htmlTranslator.imageManager.imgHelp.imageButton.id) &&  htmlTranslator.imageManager.imgHelp.imageDisplayer.className == "tool-displayer hidden")
		htmlTranslator.imageManager.imgHelp.show();
	else if (! isInDiv(event.target, htmlTranslator.imageManager.imgHelp.imageDisplayer.id) &&  htmlTranslator.imageManager.imgHelp.imageDisplayer.className != "tool-displayer hidden")
		htmlTranslator.imageManager.imgHelp.hide();
}

void shortcutsManagement (KeyboardEvent event) {
	/*
	 * 27 : Esc
	 * 72 : H
	 */
	if(event.ctrlKey) { // All the keyboards combinations are a Ctrl + [] combination.
		if (event.keyCode == 72)
			help.show();
	}
	else if (event.keyCode == 27) { // Esc.
		help.hide();
	}
}
bool isInDiv(EventTarget element, String div) { // Where did the user clicks.
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
