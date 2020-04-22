import base64url from "base64url";
import fs from 'fs';
import path from 'path';
import { createBlock64Reader } from './block64Reader';
import { streamToBase64Blocks } from './streamToBase64UrlBlocks';

async function mainold() {
  const stream = fs.createReadStream(path.join(__dirname, '../source.txt'));
  const reader = await createBlock64Reader(stream, 81);

  let total = '';

  while (true) {
    const block = reader.getBlock();

    if (!block) break;

    total += block;
  }

  console.log(base64url.decode(total));
}

async function main() {
  const stream = fs.createReadStream(path.join(__dirname, '../source.txt'));
  const res = await streamToBase64Blocks(stream);

  console.log(res);
}

main().catch(console.error);