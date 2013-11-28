part of bot_html;

class AudioLoader extends ResourceLoader<AudioBuffer> {
  final AudioContext context;

  AudioLoader(this.context, Iterable<String> urlList) :
    super(urlList);

  @override
  Future<AudioBuffer> _doLoad(String blobUrl) {
    return HttpRequest.request(blobUrl, responseType: 'arraybuffer')
        .then((HttpRequest request) {
          return context.decodeAudioData(request.response);
        });
  }
}
