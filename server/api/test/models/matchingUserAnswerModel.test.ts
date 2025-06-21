import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MatchingUserAnswerModel from '../../../models/question/MatchingUserAnswerModel.ts';

describe('MatchingUserAnswerModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.matchingUserAnswer.create', async () => {
    const data: any = { UserId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'matchingUserAnswer').value(fake);
    const result = await MatchingUserAnswerModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.matchingUserAnswer.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ UserAnswerId: 1 }) } as any;
    sinon.stub(prisma, 'matchingUserAnswer').value(fake);
    const result = await MatchingUserAnswerModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { UserAnswerId: 1 } })).to.be.true;
    expect(result).to.eql({ UserAnswerId: 1 });
  });

  it('findManyByUserAndQuestion should filter', async () => {
    const fake = { findMany: sinon.stub().resolves([{ id: 1 }]) } as any;
    sinon.stub(prisma, 'matchingUserAnswer').value(fake);
    const result = await MatchingUserAnswerModel.findManyByUserAndQuestion(1, 2);
    expect(fake.findMany.calledOnceWithExactly({ where: { UserId: 1, QuestionId: 2 } })).to.be.true;
    expect(result).to.eql([{ id: 1 }]);
  });
});
