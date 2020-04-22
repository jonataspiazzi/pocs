import { Send } from 'express-serve-static-core';

declare global {
  namespace Express {
    export interface Request {
      userId: number;
    }
  }
}