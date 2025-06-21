import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/users.ts';
import controller from '../../controllers/users.ts';

describe('Users routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  const token = jwt.sign({ id: 1, isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });
  const teacherToken = jwt.sign({ id: 1, isTeacher: true }, jwt_secret_key, { expiresIn: '1h' });

  it('GET / should validate user id', async () => {
    const badToken = jwt.sign({ id: 'abc', isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });
    const app = express();
    app.use('/api/users', router);
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${badToken}`);
    expect(res.statusCode).to.equal(400);
  });

  it('GET / should return controller result', async () => {
    sinon.stub(controller, 'getUser').resolves({ statusCode: 200, error: null, response: {} });
    const app = express();
    app.use('/api/users', router);
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('GET /all should require teacher', async () => {
    sinon.stub(controller, 'getUsers').resolves({ statusCode: 200, error: null, response: [] });
    const app = express();
    app.use('/api/users', router);
    const res = await request(app).get('/api/users/all').set('Authorization', `Bearer ${teacherToken}`);
    expect(res.statusCode).to.equal(200);
  });
});
