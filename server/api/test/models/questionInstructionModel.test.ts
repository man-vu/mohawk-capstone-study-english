import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuestionInstructionModel from '../../../models/question/QuestionInstructionModel.ts';

describe('QuestionInstructionModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.questionInstruction.create', async () => {
    const data: any = { Instruction: 'inst' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'questionInstruction').value(fake);
    const result = await QuestionInstructionModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findByInstruction should search by instruction text', async () => {
    const fake = { findFirst: sinon.stub().resolves({ InstructionId: 1 }) } as any;
    sinon.stub(prisma, 'questionInstruction').value(fake);
    const result = await QuestionInstructionModel.findByInstruction('i');
    expect(fake.findFirst.calledOnceWithExactly({ where: { Instruction: 'i' } })).to.be.true;
    expect(result).to.eql({ InstructionId: 1 });
  });
});
