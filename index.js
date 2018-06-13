const fs = require('fs');
const protobuf = require('protobufjs');

//aemomkdncapdnfajjbbcbdebjljbpmpj

src1 = ["https://www.example.com:8081", "http://www.example.org"]
dst1 = "\n\x1c\x81www.example\xae\x02\x89com:8081\x80org\x81"

src2 = ["https://www.example.org", "http://www.google.com"]
dst2 = "\n\x1e\x81www\xae\x02\x8bgoogle.com\x81example.org\x80"

protobuf.load('media_engagement_preload.proto').then((root) => {
  const PreloadedDataMessage = root.lookup('chrome_browser_media.PreloadedData');

  fs.readFile('./test1.dafsa', (error, payload) => {
    const invalidPayload = PreloadedDataMessage.verify(payload);
    if (invalidPayload) throw invalidPayload;

    const message = PreloadedDataMessage.decode(payload);

    const object = PreloadedDataMessage.toObject(message, {
      enums: String,
      longs: String,
      bytes: String
    });

    const { dafsa } = object;

    const decoded = Buffer.from(dafsa, 'base64');

    fs.writeFile('./mooooo.dafsa', decoded, (error) => {
      if (error) throw error;
    });
  });
});
