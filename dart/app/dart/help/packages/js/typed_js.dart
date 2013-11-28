library js.typed_js;

import 'dart:js' as js;

typedef Object JsFactory(JsObject o);

registerJsFactory() {

}

class JsObject {
  final js.JsObject o;

  JsObject(this.o);
}