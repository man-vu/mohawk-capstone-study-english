import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserEssayAnswerModel from '../../../models/user/UserEssayAnswerModel.ts';

describe('UserEssayAnswerModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userEssayAnswer.create', async () => {
    const data: any = { UserAnswerId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userEssayAnswer').value(fake);
    const result = await UserEssayAnswerModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.userEssayAnswer.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ UserAnswerId: 1 }) } as any;
    sinon.stub(prisma, 'userEssayAnswer').value(fake);
    const result = await UserEssayAnswerModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { UserAnswerId: 1 } })).to.be.true;
    expect(result).to.eql({ UserAnswerId: 1 });
  });
});
