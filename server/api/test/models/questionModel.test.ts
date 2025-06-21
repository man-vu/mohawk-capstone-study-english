import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuestionModel from '../../../models/question/QuestionModel.ts';

describe('QuestionModel', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('create should call prisma.question.create', async () => {
    const data: any = { QuestionText: 'q' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'question').value(fake);
    const result = await QuestionModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.question.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ QuestionId: 1 }) } as any;
    sinon.stub(prisma, 'question').value(fake);
    const result = await QuestionModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { QuestionId: 1 } })).to.be.true;
    expect(result).to.eql({ QuestionId: 1 });
  });

  it('update should call prisma.question.update', async () => {
    const fake = { update: sinon.stub().resolves({ QuestionId: 1, QuestionText: 'n' }) } as any;
    sinon.stub(prisma, 'question').value(fake);
    const result = await QuestionModel.update(1, { QuestionText: 'n' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { QuestionId: 1 }, data: { QuestionText: 'n' } })).to.be.true;
    expect(result).to.eql({ QuestionId: 1, QuestionText: 'n' });
  });

  it('delete should call prisma.question.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ QuestionId: 1 }) } as any;
    sinon.stub(prisma, 'question').value(fake);
    const result = await QuestionModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { QuestionId: 1 } })).to.be.true;
    expect(result).to.eql({ QuestionId: 1 });
  });

  it('findAll should call prisma.question.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ QuestionId: 1 }]) } as any;
    sinon.stub(prisma, 'question').value(fake);
    const result = await QuestionModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ QuestionId: 1 }]);
  });
});
