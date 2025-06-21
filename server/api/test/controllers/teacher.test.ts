import { expect } from 'chai';
import sinon from 'sinon';
import teacherController from '../../controllers/teacher.ts';
import QuizModel from '../../../models/quiz/QuizModel.ts';
import QuizSkillModel from '../../../models/quiz/QuizSkillModel.ts';
import QuestionTypeModel from '../../../models/question/QuestionTypeModel.ts';
import UserRatingModel from '../../../models/user/UserRatingModel.ts';
import QuestionModel from '../../../models/question/QuestionModel.ts';
import MCModel from '../../../models/question/QuestionMultipleChoiceModel.ts';
import validator from '../../validators/validator.ts';
import STRINGS from '../../../config/strings.ts';

describe('TeacherController', () => {
  let consoleStub: sinon.SinonStub;
  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });
  afterEach(() => {
    sinon.restore();
    consoleStub.restore();
  });

  describe('getTeacherHome', () => {
    it('should load teacher home', async () => {
      sinon.stub(QuizModel, 'findAllForTeacher').resolves([] as any);
      sinon.stub(QuizSkillModel, 'findAll').resolves([] as any);
      sinon.stub(QuestionTypeModel, 'findAll').resolves([] as any);
      const res = await teacherController.getTeacherHome();
      expect(res.statusCode).to.equal(200);
      expect(res.response.quizzes).to.eql([]);
    });

    it('should handle failure', async () => {
      sinon.stub(QuizModel, 'findAllForTeacher').rejects(new Error('fail'));
      const res = await teacherController.getTeacherHome();
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.ERROR_LOADING_TEACHER_PAGE);
    });
  });

  describe('deleteQuiz', () => {
    it('should validate quiz id', async () => {
      sinon.stub(validator, 'validateQuizId').returns(false);
      const res = await teacherController.deleteQuiz('a' as any);
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.INVALID_QUIZ_ID);
    });

    it('should delete quiz', async () => {
      sinon.stub(validator, 'validateQuizId').returns(true);
      sinon.stub(QuizModel, 'delete').resolves();
      const res = await teacherController.deleteQuiz(1);
      expect(res.statusCode).to.equal(200);
      expect(res.response).to.equal(202);
    });
  });

  describe('getQuizForEdit', () => {
    it('should validate quiz id', async () => {
      sinon.stub(validator, 'validateQuizId').returns(false);
      const res = await teacherController.getQuizForEdit('a' as any);
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.INVALID_QUIZ_ID);
    });

    it('should load quiz questions', async () => {
      sinon.stub(validator, 'validateQuizId').returns(true);
      const q = [{ id: 1 }];
      sinon.stub(QuestionModel, 'findManyByQuizIdForEdit').resolves(q as any);
      const res = await teacherController.getQuizForEdit(1);
      expect(res.statusCode).to.equal(200);
      expect(res.response).to.eql(q);
    });
  });

  describe('getQuestionForEdit', () => {
    it('should validate id', async () => {
      const res = await teacherController.getQuestionForEdit(0);
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.INVALID_QUESTION_ID);
    });

    it('should handle not found', async () => {
      sinon.stub(QuestionModel, 'findOneForEdit').resolves(null as any);
      const res = await teacherController.getQuestionForEdit(1);
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.CANNOT_LOAD_QUESTION);
    });

    it('should load question data', async () => {
      sinon.stub(QuestionModel, 'findOneForEdit').resolves({ type_id: 1, is_active: 1 } as any);
      sinon.stub(MCModel, 'findManyByQuestion').resolves([{ id: 1 }] as any);
      const res = await teacherController.getQuestionForEdit(1);
      expect(res.statusCode).to.equal(200);
      expect(res.response.items).to.eql([{ id: 1 }]);
    });
  });

  describe('resetRatings', () => {
    it('should delete ratings', async () => {
      sinon.stub(UserRatingModel, 'deleteManyByQuiz').resolves();
      const res = await teacherController.resetRatings(1);
      expect(res.statusCode).to.equal(200);
    });

    it('should handle failure', async () => {
      sinon.stub(UserRatingModel, 'deleteManyByQuiz').rejects(new Error('fail'));
      const res = await teacherController.resetRatings(1);
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.ERROR_OCCURRED);
    });
  });

  describe('deleteQuestion', () => {
    it('should validate id', async () => {
      sinon.stub(validator, 'validateQuestionId').returns(false);
      const res = await teacherController.deleteQuestion(0 as any);
      expect(res.statusCode).to.equal(400);
      expect(res.error).to.equal(STRINGS.INVALID_QUESTION_ID);
    });

    it('should delete question', async () => {
      sinon.stub(validator, 'validateQuestionId').returns(true);
      sinon.stub(QuestionModel, 'delete').resolves();
      const res = await teacherController.deleteQuestion(1);
      expect(res.statusCode).to.equal(200);
      expect(res.response).to.equal(202);
    });
  });
});
