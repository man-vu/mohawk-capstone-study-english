import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/home.ts';
import controller from '../../controllers/home.ts';

describe('GET /api/home', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should allow guest access', async () => {
    sinon.stub(controller, 'getHomeSummary').resolves({ statusCode: 200, error: null, response: [] });
    const app = express();
    app.use('/api/home', router);
    const res = await request(app).get('/api/home');
    expect(res.statusCode).to.equal(200);
    expect(res.body.response).to.eql([]);
  });

  it('should validate user id', async () => {
    sinon.stub(controller, 'getHomeSummary').resolves({ statusCode: 200, error: null, response: [] });
    const token = jwt.sign({ id: 'abc', isTeacher: false }, jwt_secret_key, { expiresIn: '1h' });
    const app = express();
    app.use('/api/home', router);
    const res = await request(app).get('/api/home').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(400);
  });
});
