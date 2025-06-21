import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../../../config/index.ts';
import router from '../../routes/teacher.ts';
import controller from '../../controllers/teacher.ts';

describe('Teacher routes', () => {
  const token = jwt.sign({ id: 1, isTeacher: true }, jwt_secret_key, { expiresIn: '1h' });

  afterEach(() => {
    sinon.restore();
  });

  it('GET / should call controller', async () => {
    sinon.stub(controller, 'getTeacherHome').resolves({ statusCode: 200, error: null, response: { ok: true } });
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).get('/api/teacher').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.ok).to.be.true;
  });

  it('GET /quizzes/:id should validate id', async () => {
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).get('/api/teacher/quizzes/abc').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(400);
  });

  it('GET /quizzes/:id should call controller', async () => {
    sinon.stub(controller, 'getQuizForEdit').resolves({ statusCode: 200, error: null, response: { id: 1 } });
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).get('/api/teacher/quizzes/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.id).to.equal(1);
  });

  it('DELETE /quizzes/:id should call controller', async () => {
    sinon.stub(controller, 'deleteQuiz').resolves({ statusCode: 202, error: null, response: null });
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).delete('/api/teacher/quizzes/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('DELETE /quizzes/rating/:id should call controller', async () => {
    sinon.stub(controller, 'resetRatings').resolves({ statusCode: 200, error: null, response: null });
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).delete('/api/teacher/quizzes/rating/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('DELETE /questions/:id should call controller', async () => {
    sinon.stub(controller, 'deleteQuestion').resolves({ statusCode: 202, error: null, response: null });
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).delete('/api/teacher/questions/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
  });

  it('GET /questions/:id should validate id', async () => {
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).get('/api/teacher/questions/a').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(400);
  });

  it('GET /questions/:id should call controller', async () => {
    sinon.stub(controller, 'getQuestionForEdit').resolves({ statusCode: 200, error: null, response: { id: 1 } });
    const app = express();
    app.use('/api/teacher', router);
    const res = await request(app).get('/api/teacher/questions/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.response.id).to.equal(1);
  });

  it('PUT /questions/:id should call controller', async () => {
    sinon.stub(controller, 'updateQuestion').resolves({ statusCode: 202, error: null, response: null });
    const app = express();
    app.use(express.json());
    app.use('/api/teacher', router);
    const res = await request(app)
      .put('/api/teacher/questions/1')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).to.equal(200);
  });
});
