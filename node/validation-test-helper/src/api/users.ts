import express, { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { sendErrorForInvalid } from '../helpers/sendErrorForInvalid';
import { userService } from '../service/user';
const router = express.Router();

const checkMail = check('mail')
  .not().isEmpty().withMessage('O e-mail é obrigatório.')
  .isEmail().withMessage('Escreva um e-mail válido.')
  .custom((value) => {
    if (userService.isMailUsed(value)) return true;
    throw 'O e-mail já está sendo usado.';
  });

const checkPhone = check('phone')
  .not().isEmpty().withMessage('O telefone é obrigatório.')
  .matches(/^[0-9]{4}-[0-9]{4}$/).withMessage('Escreva um telefone válido.')
  .custom((value) => {
    if (userService.isPhoneUsed(value)) return true;
    throw 'O telefone já está sendo usado.';
  });

router.get('/', (req: Request, res: Response) => {
  return res.json(userService.getUsers());
});

router.post('/', [checkMail, checkPhone], sendErrorForInvalid, (req: Request, res: Response) => {
  const user = userService.createUser(req.body);

  return res.json({ success: true, user });
});

Object.defineProperty(express.request, 'userId', {
  configurable: true,
  enumerable: true,
  get: function () { return 10; }
});

router.get('/test-req-extension', (req, res) => {
  return res.json({ userId: req.userId });
});

interface IDictionary<T> {
  [key: string]: T;
}

interface IChecker {
  (value: any): boolean;
}

interface ICheckerChain {
  checker: IChecker;
  message: string;
}

interface IPatchValidator {
  (req: Request, res: Response, next: NextFunction): any;
  validate(prop: string): this;
  check(checker: IChecker, message: string): this;
}

function patchValidatorMiddleware() {
  let currentProp: string;
  let validations: IDictionary<ICheckerChain[]> = {};

  const patchValidator: IPatchValidator = function (req: Request, res: Response, next: NextFunction): any {
    const errors: IDictionary<string> = {};
    let hasError = false;
    let anyField = false;

    for (var prop of Object.getOwnPropertyNames(validations)) {
      const chain = validations[prop];

      if (req.body[prop] === undefined) continue;
      anyField = true;

      for (const item of chain) {
        if (item.checker(req.body[prop])) continue;

        errors[prop] = item.message;
        hasError = true;
        break;
      }
    }

    if (!anyField) return res.status(400).json({ success: false });
    if (hasError) return res.status(422).json({ success: false, errors });

    next();
  } as any;

  patchValidator.validate = (prop: string) => {
    currentProp = prop;
    return patchValidator;
  };

  patchValidator.check = (checker: IChecker, message: string) => {
    const validation = validations[currentProp] || (validations[currentProp] = []);
    validation.push({ checker, message });
    return patchValidator;
  }

  return patchValidator;
}

const patchValidator = patchValidatorMiddleware()
  .validate('a')
  .check(a => typeof a === 'string', 'A precisa ser um texto.')
  .check(a => a, 'A é obrigatório.')
  .check(a => 4 <= a.length && a.length <= 6, 'O campo A precisa ter entre 4 e 6 caracteres.')
  .validate('b')
  .check(b => typeof b === 'number', 'B precisa ser um número')
  .check(b => 10 <= b && b <= 20, 'B precisa estar entre 10 e 20.');

router.post('/test-one-of', patchValidator, (req, res) => {
  return res.json({ success: true });
});

export default router;
