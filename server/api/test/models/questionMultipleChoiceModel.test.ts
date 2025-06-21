import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuestionMultipleChoiceModel from '../../../models/question/QuestionMultipleChoiceModel.ts';

describe('QuestionMultipleChoiceModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.questionMultipleChoice.create', async () => {
    const data: any = { QMCId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'questionMultipleChoice').value(fake);
    const result = await QuestionMultipleChoiceModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findManyByQuestion should order choices', async () => {
    const fake = { findMany: sinon.stub().resolves([{ QMCId: 1 }]) } as any;
    sinon.stub(prisma, 'questionMultipleChoice').value(fake);
    const result = await QuestionMultipleChoiceModel.findManyByQuestion(1);
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ QMCId: 1 }]);
  });
});
