import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuizQuestionModel from '../../../models/quiz/QuizQuestionModel.ts';

describe('QuizQuestionModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.quizQuestion.create', async () => {
    const data: any = { QuizId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'quizQuestion').value(fake);
    const result = await QuizQuestionModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.quizQuestion.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ QuizId: 1, QuestionId: 2 }) } as any;
    sinon.stub(prisma, 'quizQuestion').value(fake);
    const result = await QuizQuestionModel.findById(1, 2);
    expect(fake.findUnique.calledOnceWithExactly({ where: { QuizId_QuestionId: { QuizId: 1, QuestionId: 2 } } })).to.be.true;
    expect(result).to.eql({ QuizId: 1, QuestionId: 2 });
  });

  it('update should call prisma.quizQuestion.update', async () => {
    const fake = { update: sinon.stub().resolves({ QuizId: 1, QuestionId: 2 }) } as any;
    sinon.stub(prisma, 'quizQuestion').value(fake);
    const result = await QuizQuestionModel.update(1, 2, { SortOrder: 1 } as any);
    expect(fake.update.calledOnceWithExactly({ where: { QuizId_QuestionId: { QuizId: 1, QuestionId: 2 } }, data: { SortOrder: 1 } })).to.be.true;
    expect(result).to.eql({ QuizId: 1, QuestionId: 2 });
  });

  it('delete should call prisma.quizQuestion.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ QuizId: 1, QuestionId: 2 }) } as any;
    sinon.stub(prisma, 'quizQuestion').value(fake);
    const result = await QuizQuestionModel.delete(1, 2);
    expect(fake.delete.calledOnceWithExactly({ where: { QuizId_QuestionId: { QuizId: 1, QuestionId: 2 } } })).to.be.true;
    expect(result).to.eql({ QuizId: 1, QuestionId: 2 });
  });

  it('findAll should call prisma.quizQuestion.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ QuizId: 1 }]) } as any;
    sinon.stub(prisma, 'quizQuestion').value(fake);
    const result = await QuizQuestionModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ QuizId: 1 }]);
  });
});
