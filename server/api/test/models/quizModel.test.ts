import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuizModel from '../../../models/quiz/QuizModel.ts';

describe('QuizModel', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('create should call prisma.quiz.create', async () => {
    const data: any = { Title: 'Quiz' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'quiz').value(fake);
    const result = await QuizModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.quiz.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ QuizId: 1 }) } as any;
    sinon.stub(prisma, 'quiz').value(fake);
    const result = await QuizModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { QuizId: 1 } })).to.be.true;
    expect(result).to.eql({ QuizId: 1 });
  });

  it('update should call prisma.quiz.update', async () => {
    const fake = { update: sinon.stub().resolves({ QuizId: 1, Title: 'New' }) } as any;
    sinon.stub(prisma, 'quiz').value(fake);
    const result = await QuizModel.update(1, { Title: 'New' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { QuizId: 1 }, data: { Title: 'New' } })).to.be.true;
    expect(result).to.eql({ QuizId: 1, Title: 'New' });
  });

  it('delete should call prisma.quiz.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ QuizId: 1 }) } as any;
    sinon.stub(prisma, 'quiz').value(fake);
    const result = await QuizModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { QuizId: 1 } })).to.be.true;
    expect(result).to.eql({ QuizId: 1 });
  });

  it('findAll should call prisma.quiz.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ QuizId: 1 }]) } as any;
    sinon.stub(prisma, 'quiz').value(fake);
    const result = await QuizModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ QuizId: 1 }]);
  });
});
