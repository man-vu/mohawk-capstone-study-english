import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MatchingPromptModel from '../../../models/question/MatchingPromptModel.ts';

describe('MatchingPromptModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.matchingPrompt.create', async () => {
    const data: any = { PromptId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'matchingPrompt').value(fake);
    const result = await MatchingPromptModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('delete should call prisma.matchingPrompt.delete', async () => {
    const fake = { delete: sinon.stub().resolves({}) } as any;
    sinon.stub(prisma, 'matchingPrompt').value(fake);
    const result = await MatchingPromptModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { PromptId: 1 } })).to.be.true;
    expect(result).to.eql({});
  });

  it('updateMany should transact updates', async () => {
    const txStub = sinon.stub().resolves([]);
    sinon.stub(prisma, '$transaction').value(txStub);
    sinon.stub(prisma, 'matchingPrompt').value({ updateMany: sinon.stub() } as any);
    await MatchingPromptModel.updateMany(1, [{ prompt_order: 1, left_text: 'a' }]);
    expect(txStub.calledOnce).to.be.true;
  });
});
