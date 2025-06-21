import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/auth.ts';
import controller from '../../controllers/auth.ts';

describe('Auth routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('POST /register should invoke controller', async () => {
    sinon.stub(controller, 'register').resolves({ statusCode: 200, error: null, response: { id: 1 } });
    const app = express();
    app.use(express.json());
    app.use('/api/auth', router);
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.id).to.equal(1);
  });

  it('POST /login should invoke controller', async () => {
    sinon.stub(controller, 'login').resolves({ statusCode: 200, error: null, response: { token: 't' } });
    const app = express();
    app.use(express.json());
    app.use('/api/auth', router);
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.token).to.equal('t');
  });

  it('GET / should require auth', async () => {
    const token = jwt.sign({ id: 1, isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });
    sinon.stub(controller, 'verify').resolves({ statusCode: 200, error: null, response: { ok: true } });
    const app = express();
    app.use('/api/auth', router);
    const res = await request(app).get('/api/auth').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.ok).to.be.true;
  });
});
