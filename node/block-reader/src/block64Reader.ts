import { Readable } from 'stream';

class Block64Reader {
  constructor(
    private stream: Readable,
    private blockSize: number) {

    if (!stream.readable) throw new Error('stream need to be readable.');
    if (blockSize % 3 !== 0) throw new Error('blockSize need to be multiple of 3.');
  }

  private formatBase64Url(block: Buffer) {
    return block.toString('base64')
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  getBlock() {
    let block = this.stream.read(this.blockSize);

    if (!block) {
      block = this.stream.read();

      if (!block) return null;
    }

    if (Buffer.isBuffer(block)) {
      return this.formatBase64Url(block);
    }

    return this.formatBase64Url(Buffer.from(block, 'utf-8'));
  }
}

/**
 * Create a reader that can return blocks in base64url format.
 * @param stream {Readable} a stream to read blocks
 * @param blockSize {number} the size of the block, should be a value multible of 3.
 */
export async function createBlock64Reader(stream: Readable, blockSize: number): Promise<Block64Reader> {
  return new Promise((resolve, reject) => {
    stream.on('readable', () => {
      resolve(new Block64Reader(stream, blockSize));
    });

    stream.on('error', err => {
      reject(err);
    });
  });
}

/*
.replace(/\-/g, "+")
        .replace(/_/g, "/");*/