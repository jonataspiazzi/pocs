import { SHA256 } from 'crypto-js';

const inputs = [
  'a',
  'a',
  'a',
  'b',
  'c',
  'Man oh man do I love node!',
  'Man oh man do I love node'
];

console.log(inputs.map(i => SHA256(i).toString()));
