import { Readable } from 'stream';

export interface Callback {
  (err: Error, data?: string): any;
}

export function streamToBase64Blocks(stream: Readable, callback?: Callback) {
  callback = callback || function () { };

  var str = '';

  return new Promise((resolve, reject) => {
    stream.on('data', (data: Buffer) => {
      console.log('calls');
      str += data.toString('utf-8');
    });

    stream.on('end', () => {
      resolve(str);
      callback(null, str);
    });

    stream.on('error', err => {
      reject(err);
      callback(err);
    });
  });
}