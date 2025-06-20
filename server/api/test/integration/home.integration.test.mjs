import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import app from '../../../server.ts';
import homeController from '../../controllers/home.ts';

describe('Home routes', () => {
  before(() => {
    sinon.stub(homeController, 'getHomeSummary').resolves({
      statusCode: 200,
      error: null,
      response: [1, 2, 3]
    });
  });

  after(() => {
    homeController.getHomeSummary.restore();
  });

  it('GET /api/home returns home summary', async () => {
    const res = await request(app).get('/api/home');
    expect(res.status).to.equal(200);
    expect(res.body.statusCode).to.equal(200);
    expect(res.body.response).to.be.an('array');
  });
});
