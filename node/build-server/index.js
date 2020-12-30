"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var result = crypto_1.createHash('sha256')
    .update('Man oh man do I love node!')
    .digest('hex');
console.log(result);
