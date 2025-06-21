import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MatchingChoiceModel from '../../../models/question/MatchingChoiceModel.ts';

describe('MatchingChoiceModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.matchingChoice.create', async () => {
    const data: any = { ChoiceId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'matchingChoice').value(fake);
    const result = await MatchingChoiceModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('update should call prisma.matchingChoice.update', async () => {
    const fake = { update: sinon.stub().resolves({ ChoiceId: 1 }) } as any;
    sinon.stub(prisma, 'matchingChoice').value(fake);
    const result = await MatchingChoiceModel.update(1, { RightText: 't' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { ChoiceId: 1 }, data: { RightText: 't' } })).to.be.true;
    expect(result).to.eql({ ChoiceId: 1 });
  });

  it('findManyByQuestion should order by ChoiceOrder', async () => {
    const fake = { findMany: sinon.stub().resolves([{ ChoiceId: 1 }]) } as any;
    sinon.stub(prisma, 'matchingChoice').value(fake);
    const result = await MatchingChoiceModel.findManyByQuestion(2);
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ ChoiceId: 1 }]);
  });
});
