import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import router from '../../routes/courses.ts';
import controller from '../../controllers/courses.ts';

describe('GET /api/courses', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should respond with course list', async () => {
    const courses = [{ CourseId: 1, Title: 'Test' }];
    sinon.stub(controller, 'getCourses').resolves({ statusCode: 200, error: null, response: courses });
    const app = express();
    app.use('/api/courses', router);
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).to.equal(200);
    expect(res.body.response).to.eql(courses);
  });

  it('should handle controller failure', async () => {
    sinon.stub(controller, 'getCourses').resolves({ statusCode: 400, error: 'err', response: null });
    const app = express();
    app.use('/api/courses', router);
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).to.equal(200);
    expect(res.body.error).to.equal('err');
  });
});
