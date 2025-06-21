import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import router from '../../routes/mockTests.ts';
import controller from '../../controllers/mockTests.ts';

describe('MockTests routes', () => {
  afterEach(() => sinon.restore());

  it('GET / should return tests', async () => {
    sinon.stub(controller, 'getTests').resolves({ statusCode: 200, error: null, response: [{ id: 1 }] });
    const app = express();
    app.use('/api/mock-tests', router);
    const res = await request(app).get('/api/mock-tests');
    expect(res.statusCode).to.equal(200);
    expect(res.body.response[0].id).to.equal(1);
  });

  it('GET /:id should validate id', async () => {
    const app = express();
    app.use('/api/mock-tests', router);
    const res = await request(app).get('/api/mock-tests/abc');
    expect(res.statusCode).to.equal(400);
  });

  it('GET /:id should return test', async () => {
    sinon.stub(controller, 'getTest').resolves({ statusCode: 200, error: null, response: { id: 2 } });
    const app = express();
    app.use('/api/mock-tests', router);
    const res = await request(app).get('/api/mock-tests/2');
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.id).to.equal(2);
  });
});
