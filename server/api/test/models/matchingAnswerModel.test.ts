import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MatchingAnswerModel from '../../../models/question/MatchingAnswerModel.ts';

describe('MatchingAnswerModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.matchingAnswer.create', async () => {
    const data: any = { PromptId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'matchingAnswer').value(fake);
    const result = await MatchingAnswerModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('delete should call prisma.matchingAnswer.delete', async () => {
    const fake = { delete: sinon.stub().resolves({}) } as any;
    sinon.stub(prisma, 'matchingAnswer').value(fake);
    const result = await MatchingAnswerModel.delete(1, 2);
    expect(fake.delete.calledOnceWithExactly({ where: { PromptId_ChoiceId: { PromptId: 1, ChoiceId: 2 } } })).to.be.true;
    expect(result).to.eql({});
  });

  it('findManyByQuestion should include relations', async () => {
    const fake = { findMany: sinon.stub().resolves([{ id: 1 }]) } as any;
    sinon.stub(prisma, 'matchingAnswer').value(fake);
    const result = await MatchingAnswerModel.findManyByQuestion(3);
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ id: 1 }]);
  });
});
