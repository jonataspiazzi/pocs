import { expect } from 'chai';
import chalk from 'chalk';
import { Express } from 'express';
import supertest from 'supertest';

export type HttpMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';
export interface TestCase {
  [key: string]: Array<any>;
}

export async function supertestValidators(app: Express, url: string, method: HttpMethod, cookie: string, cases: TestCase[]) {
  if (!cases) return;

  for (const c of cases) {
    const obj = <any>{};
    const errors = <any>{};

    for (let prop of Object.getOwnPropertyNames(c)) {
      obj[prop] = c[prop][0];

      if (c[prop][1]) errors[prop] = c[prop][1];
    }

    let test = supertest(app)[method](url);

    if (cookie) {
      test = test.set('Cookie', cookie);
    }

    const res = await test
      .send(obj)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.success).to.be.false;

    for (const prop of Object.getOwnPropertyNames(errors)) {
      const clk = (v: string) => chalk.magenta(`${v}`);
      const value = (prop: string) => {
        const v: any = obj[prop];
        if (typeof v === 'undefined') return clk('undefined');
        if (typeof v === 'object' && !v) return clk('null');
        if (typeof v === 'string') return clk(`'${v}'`);
        return clk(v);
      }

      const msg = chalk.red(`Error, expect prop ${clk(prop)} with value ${value(prop)} to fail on validation with message ${clk(errors[prop])}.`);

      expect(res.body.errors).to.have.property(prop, errors[prop], msg);
    }
  }
}