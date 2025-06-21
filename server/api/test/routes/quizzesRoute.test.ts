import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/quizzes.ts';
import controller from '../../controllers/quizzes.ts';

describe('Quizzes routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  const token = jwt.sign({ id: 1, isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });

  it('POST /start/:id should validate id', async () => {
    const app = express();
    app.use('/api/quizzes', router);
    const res = await request(app).post('/api/quizzes/start/abc').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(400);
  });

  it('GET /:id should validate id', async () => {
    const app = express();
    app.use('/api/quizzes', router);
    const res = await request(app).get('/api/quizzes/abc').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(400);
  });

  it('POST /start/:id should respond with controller result', async () => {
    sinon.stub(controller, 'startQuiz').resolves({ statusCode: 200, error: null, response: { ok: true } });
    const app = express();
    app.use('/api/quizzes', router);
    const res = await request(app).post('/api/quizzes/start/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.ok).to.be.true;
  });
});
