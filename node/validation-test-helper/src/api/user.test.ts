import { describe, it, before, after } from 'mocha';
import chai, { expect, Assertion } from 'chai';
import supertest, { Test } from 'supertest';
import app, { appConfigPromise } from '../app';
import { supertestValidators } from '../helpers/testHelpers';
import { userService } from '../service/user';
import sinon from 'sinon';
import sionChai from 'sinon-chai';

chai.use(sionChai);

import { mailService } from '../service/mail';

const userTest = { mail: 'test@domail.com', phone: '9999-9999' };

enum Author {
  user = 'user',
  bot = 'bot'
};

Assertion.addProperty('guid', function () {
  this.assert(
    /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(this._obj),
    'expected #{this} to be a guid',
    'expected #{this} to not be a guid',
    undefined);
});

describe('Test /users', () => {
  before(async () => {
    await appConfigPromise;
  });

  it('Should guid work', () => {
    const model = { g: '12345678-1234-1234-1234-123456123456' };

    expect(model).to.have.property('g').that.is.guid;
  });

  it('Should get own props enum', () => {
    const values = Object.getOwnPropertyNames(Author);

    expect(values).to.have.members(['user', 'bot']);
  });

  it('Should post', async () => {
    await supertestValidators(app, '/api/users', 'post', undefined, [{
      mail: ['', 'O e-mail é obrigatório.'],
      phone: ['', 'O telefone é obrigatório.']
    }, {
      mail: ['abc', 'Escreva um e-mail válido.'],
      phone: ['abc', 'Escreva um telefone válido.']
    }, {
      mail: ['john.doe@domail.com', 'O e-mail já está sendo usado.'],
      phone: ['1234-5678', 'O telefone já está sendo usado.']
    }]);

    sinon.replace(mailService, 'sendUserCreated', () => console.log('replaced'));
    const sendUserCreatedSpy = sinon.spy(mailService, 'sendUserCreated');

    const res = await supertest(app)
      .post('/api/users')
      .send(userTest)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.success).to.be.true;
    expect(res.body.user).to.be.an('object');
    expect(res.body.user.id).to.be.a('number');
    expect(res.body.user.mail).to.equal(userTest.mail);
    expect(res.body.user.phone).to.equal(userTest.phone);
    expect(sendUserCreatedSpy).to.have.been.calledOnce;

    sinon.restore();

    await supertest(app)
      .post('/api/users')
      .send({ mail: 'any@mail.com', phone: '9988-7766' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(sendUserCreatedSpy).to.have.been.calledOnce;
  });

  it('Should req extension work', async () => {
    const res = await supertest(app)
      .get('/api/users/test-req-extension')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.userId).to.equal(10);
  });

  it('Should req extension work', async () => {
    const res = await supertest(app)
      .get('/api/users/test-req-extension')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.userId).to.equal(10);
  });

  it('Should test one of', async () => {
    await supertestValidators(app, '/api/users/test-one-of', 'post', undefined, [{
      a: ['', 'no'],
      b: [undefined, 'no']
    }]);

    const res = await supertest(app)
      .post('/api/users/test-one-of')
      .send({ a: 'abcd', b: 15 });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success').that.is.true;
  });

  /*
  it('Should use supertest extension', async () => {
    const res = await supertest(app)
      .post('/api/users')
      .set('Cookie', '')
      .send(userTest)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect2();

    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.nested.property('user.id').that.is.a('number');
    expect(res.body).to.have.nested.property('user.mail').that.equals(userTest.mail);
    expect(res.body).to.have.nested.property('user.phone').that.equals(userTest.phone);
  });
  */

  after(async () => {
    userService.deleteUser(userTest.mail);
  });
});