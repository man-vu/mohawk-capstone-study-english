import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/writing.ts';
import controller from '../../controllers/writing.ts';

describe('POST /api/writing/assess', () => {
  afterEach(() => {
    sinon.restore();
  });

  const token = jwt.sign({ id: 1, isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });

  it('should return 400 for invalid id', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/writing', router);
    const res = await request(app)
      .post('/api/writing/assess')
      .set('Authorization', `Bearer ${token}`)
      .send({ userEssayAnswerId: 'abc' });
    expect(res.statusCode).to.equal(400);
  });

  it('should respond with controller result', async () => {
    sinon.stub(controller, 'createAssessment').resolves({ statusCode: 200, error: null, response: { ok: true } });
    const app = express();
    app.use(express.json());
    app.use('/api/writing', router);
    const res = await request(app)
      .post('/api/writing/assess')
      .set('Authorization', `Bearer ${token}`)
      .send({ userEssayAnswerId: 1 });
    expect(res.statusCode).to.equal(200);
    expect(res.body.response).to.eql({ ok: true });
  });
});
