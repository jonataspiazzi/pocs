import { Readable } from 'stream';

export interface Blocks extends Array<string> {
  totalLength: number;
}

class Base64BlockReader {
  constructor(
    private stream: Readable,
    private blockSize: number) {

    if (!stream.readable) throw new Error('stream need to be readable.');
    if (blockSize % 3 !== 0) throw new Error('blockSize need to be multiple of 3.');
  }

  private _formatBase64Url(block: Buffer) {
    return block.toString('base64')
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  read() {
    let block = this.stream.read(this.blockSize);

    if (!block) {
      block = this.stream.read();

      if (!block) return null;
    }

    if (Buffer.isBuffer(block)) {
      return this._formatBase64Url(block);
    }

    return this._formatBase64Url(Buffer.from(block, 'utf-8'));
  }

  readAll() {
    const blocks = <Blocks>[];
    blocks.totalLength = 0;

    let block;
    while (block = this.read()) {
      blocks.push(block);
      blocks.totalLength += block.length;
    }

    return blocks;
  }

  get readableLength() {
    return this.stream.readableLength;
  }
}

/**
 * Create a reader that can return blocks in base64url format.
 * @param stream {Readable} a stream to read blocks
 * @param blockSize {number} the aproximate size of the block (will be converted for the closest multiple of 3).
 */
export async function createBase64BlockReader(stream: Readable, blockSize: number): Promise<Base64BlockReader> {
  return new Promise((resolve, reject) => {
    stream.on('readable', () => {
      resolve(new Base64BlockReader(stream, Math.round(blockSize / 3) * 3));
    });

    stream.on('error', err => {
      reject(err);
    });
  });
}