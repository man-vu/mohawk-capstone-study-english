import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import WritingAssessmentModel from '../../../models/writing/WritingAssessmentModel.ts';

describe('WritingAssessmentModel', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('create should call prisma.writingAssessment.create', async () => {
    const data: any = { UserEssayAnswer: { connect: { UserAnswerId: 1 } } };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'writingAssessment').value(fake);
    const result = await WritingAssessmentModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.writingAssessment.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ AssessmentId: 1 }) } as any;
    sinon.stub(prisma, 'writingAssessment').value(fake);
    const result = await WritingAssessmentModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { AssessmentId: 1 } })).to.be.true;
    expect(result).to.eql({ AssessmentId: 1 });
  });
});
