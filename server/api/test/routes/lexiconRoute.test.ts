import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/lexicon.ts';
import controller from '../../controllers/lexicon.ts';

describe('GET /api/lexicon/words', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should respond with word list', async () => {
    sinon.stub(controller, 'getWords').resolves({ statusCode: 200, error: null, response: [] });
    const app = express();
    app.use('/api/lexicon', router);
    const res = await request(app).get('/api/lexicon/words');
    expect(res.statusCode).to.equal(200);
  });
});

describe('GET /api/lexicon/progress', () => {
  afterEach(() => {
    sinon.restore();
  });

  const token = jwt.sign({ id: 1, isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });

  it('should call controller with auth', async () => {
    sinon.stub(controller, 'getUserProgress').resolves({ statusCode: 200, error: null, response: [] });
    const app = express();
    app.use('/api/lexicon', router);
    const res = await request(app).get('/api/lexicon/progress').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.response).to.eql([]);
  });
});
