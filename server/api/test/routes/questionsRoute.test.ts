import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/questions.ts';
import controller from '../../controllers/questions.ts';

describe('Questions routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  const token = jwt.sign({ id: 1, isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });

  it('POST / should validate quiz id', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/questions', router);
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({ quizId: 'a' });
    expect(res.statusCode).to.equal(400);
  });

  it('PUT /answer/:id should validate ids', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/questions', router);
    const res = await request(app)
      .put('/api/questions/answer/abc')
      .set('Authorization', `Bearer ${token}`)
      .send({ attemptId: 'a', quizId: 'b' });
    expect(res.statusCode).to.equal(400);
  });

  it('POST / should respond with controller result', async () => {
    sinon.stub(controller, 'createQuestion').resolves({ statusCode: 200, error: null, response: { ok: true } });
    const app = express();
    app.use(express.json());
    app.use('/api/questions', router);
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({ quizId: 1, instruction: 'i', typeId: 1, question: 'q', items: [], isActive: true });
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.ok).to.be.true;
  });
});
