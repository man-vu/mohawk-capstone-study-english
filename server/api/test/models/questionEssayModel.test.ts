import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuestionEssayModel from '../../../models/question/QuestionEssayModel.ts';

describe('QuestionEssayModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.questionEssay.create', async () => {
    const data: any = { QuestionId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'questionEssay').value(fake);
    const result = await QuestionEssayModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('delete should call prisma.questionEssay.delete', async () => {
    const fake = { delete: sinon.stub().resolves({}) } as any;
    sinon.stub(prisma, 'questionEssay').value(fake);
    const result = await QuestionEssayModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { QuestionId: 1 } })).to.be.true;
    expect(result).to.eql({});
  });
});
