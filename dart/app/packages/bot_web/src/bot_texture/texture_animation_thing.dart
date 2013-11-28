part of bot_texture;

class TextureAnimationThing extends Thing {
  final TextureData _textureData;
  final List<TextureAnimationRequest> _requests = new List<TextureAnimationRequest>();

  TextureAnimationThing(num width, num height, this._textureData) :
    super(width, height);

  void add(TextureAnimationRequest request) {
    assert(request != null);
    assert(request.fresh);
    _requests.add(request);
    invalidateDraw();
  }

  void update() {

    _requests.removeWhere((r) {
      r.update();
      assert(!r.fresh);
      return r.done;
    });

    if(_requests.length > 0) {
      invalidateDraw();
    }
  }

  void drawOverride(CanvasRenderingContext2D ctx) {
    for(final r in _requests) {
      final data = r._getFrameDetails();
      final offset = data.item1;
      final frameName = data.item2;

      ctx.save();
      ctx.translate(offset.x, offset.y);
      _textureData.drawTextureKeyAt(ctx, frameName);
      ctx.restore();
    }
  }
}
