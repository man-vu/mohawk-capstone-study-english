import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuestionGapFillingModel from '../../../models/question/QuestionGapFillingModel.ts';

describe('QuestionGapFillingModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.questionGapFilling.create', async () => {
    const data: any = { SequenceId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'questionGapFilling').value(fake);
    const result = await QuestionGapFillingModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('updateMany should transact updates', async () => {
    const txStub = sinon.stub().resolves([]);
    sinon.stub(prisma, '$transaction').value(txStub);
    sinon.stub(prisma, 'questionGapFilling').value({ updateMany: sinon.stub() } as any);
    await QuestionGapFillingModel.updateMany(1, [{ sequence_id: 1, correct_answer: 'a' }]);
    expect(txStub.calledOnce).to.be.true;
  });
});
