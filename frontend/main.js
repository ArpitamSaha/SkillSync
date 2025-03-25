import fs from 'fs';
import fetch from 'node-fetch';
import Groq, { toFile } from 'groq-sdk';

const client = new Groq();

// If you have access to Node `fs` we recommend using `fs.createReadStream()`:
await client.audio.transcriptions.create({
  model: 'whisper-large-v3',
  file: fs.createReadStream('/path/to/file'),
});

// Or if you have the web `File` API you can pass a `File` instance:
await client.audio.transcriptions.create({ model: 'whisper-large-v3', file: new File(['my bytes'], 'file') });

// You can also pass a `fetch` `Response`:
await client.audio.transcriptions.create({
  model: 'whisper-large-v3',
  file: await fetch('https://somesite/file'),
});

// Finally, if none of the above are convenient, you can use our `toFile` helper:
await client.audio.transcriptions.create({
  model: 'whisper-large-v3',
  file: await toFile(Buffer.from('my bytes'), 'file'),
});
await client.audio.transcriptions.create({
  model: 'whisper-large-v3',
  file: await toFile(new Uint8Array([0, 1, 2]), 'file'),
});