import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../server.ts';
import authController from '../../controllers/auth.ts';

describe('Auth routes', () => {
  before(() => {
    sinon.stub(authController, 'login').resolves({
      statusCode: 200,
      error: null,
      response: { token: 'abc' }
    });
  });

  after(() => {
    authController.login.restore();
  });

  it('POST /api/auth/login returns token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a', password: 'b' });
    expect(res.status).to.equal(200);
    expect(res.body.response).to.have.property('token');
  });
});
