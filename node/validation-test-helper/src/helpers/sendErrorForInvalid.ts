import { validationResult, ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express-serve-static-core';

export function sendErrorForInvalid(req: Request, res: Response, next: NextFunction): any {
  const errorList = validationResult(req);

  if (!errorList.isEmpty()) {
    const errors = errorList.array()
      .reverse()
      .reduce((ac, i) => { ac[i.param] = i.msg; return ac; }, <any>{});

    return res.json({ success: false, errors });
  }

  return next();
}