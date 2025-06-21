import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/statistics.ts';
import controller from '../../controllers/statistics.ts';

describe('Statistics routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  const token = jwt.sign({ id: 1, isTeacher: true }, jwt_secret_key, { expiresIn: '1h' });

  it('GET / should validate user id', async () => {
    const badToken = jwt.sign({ id: 'abc', isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });
    const app = express();
    app.use('/api/statistics', router);
    const res = await request(app).get('/api/statistics').set('Authorization', `Bearer ${badToken}`);
    expect(res.statusCode).to.equal(400);
  });

  it('POST /board/quiz/:id should validate id', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/statistics', router);
    const res = await request(app)
      .post('/api/statistics/board/quiz/abc')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).to.equal(400);
  });

  it('POST /board/student/:id should validate id', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/statistics', router);
    const res = await request(app)
      .post('/api/statistics/board/student/abc')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).to.equal(400);
  });

  it('GET / should respond with controller result', async () => {
    sinon.stub(controller, 'getStatistics').resolves({ statusCode: 200, error: null, response: [] });
    const app = express();
    app.use('/api/statistics', router);
    const res = await request(app).get('/api/statistics').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });
});
