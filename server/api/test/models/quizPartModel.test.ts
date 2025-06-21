import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuizPartModel from '../../../models/quiz/QuizPartModel.ts';

describe('QuizPartModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.quizPart.create', async () => {
    const data: any = { PartTitle: 'p' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'quizPart').value(fake);
    const result = await QuizPartModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.quizPart.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ PartId: 1 }) } as any;
    sinon.stub(prisma, 'quizPart').value(fake);
    const result = await QuizPartModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { PartId: 1 } })).to.be.true;
    expect(result).to.eql({ PartId: 1 });
  });

  it('update should call prisma.quizPart.update', async () => {
    const fake = { update: sinon.stub().resolves({ PartId: 1 }) } as any;
    sinon.stub(prisma, 'quizPart').value(fake);
    const result = await QuizPartModel.update(1, { PartTitle: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { PartId: 1 }, data: { PartTitle: 'x' } })).to.be.true;
    expect(result).to.eql({ PartId: 1 });
  });

  it('delete should call prisma.quizPart.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ PartId: 1 }) } as any;
    sinon.stub(prisma, 'quizPart').value(fake);
    const result = await QuizPartModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { PartId: 1 } })).to.be.true;
    expect(result).to.eql({ PartId: 1 });
  });

  it('findAllByQuiz should call prisma.quizPart.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ PartId: 1 }]) } as any;
    sinon.stub(prisma, 'quizPart').value(fake);
    const result = await QuizPartModel.findAllByQuiz(2);
    expect(fake.findMany.calledOnceWithExactly({ where: { QuizId: 2 }, orderBy: { SortOrder: 'asc' } })).to.be.true;
    expect(result).to.eql([{ PartId: 1 }]);
  });
});
