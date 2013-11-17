import 'dart:html';
import 'dart:js';

int boundsChange = 100;

void main() {
  	querySelector("#image-button").onClick.listen(resizeWindow);
}

void resizeWindow(MouseEvent event) {
  	JsObject appWindow = context['chrome']['app']['window'].callMethod('current', []);
  	JsObject bounds = appWindow.callMethod('getBounds', []);
  
  	bounds['width'] += boundsChange;
  	bounds['left'] -= boundsChange ~/ 2;
  
  	appWindow.callMethod('setBounds', [bounds]);
  
  	boundsChange *= -1;
}
