import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserAnswerModel from '../../../models/user/UserAnswerModel.ts';

describe('UserAnswerModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userAnswer.create', async () => {
    const data: any = { AnswerText: 'a' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userAnswer').value(fake);
    const result = await UserAnswerModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('createMany should call prisma.userAnswer.createMany', async () => {
    const fake = { createMany: sinon.stub().resolves({ count: 1 }) } as any;
    sinon.stub(prisma, 'userAnswer').value(fake);
    const result = await UserAnswerModel.createMany([{ a: 1 }] as any);
    expect(fake.createMany.calledOnceWithExactly({ data: [{ a: 1 }] })).to.be.true;
    expect(result).to.eql({ count: 1 });
  });

  it('findById should call prisma.userAnswer.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ UserAnswerId: 1 }) } as any;
    sinon.stub(prisma, 'userAnswer').value(fake);
    const result = await UserAnswerModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { UserAnswerId: 1 } })).to.be.true;
    expect(result).to.eql({ UserAnswerId: 1 });
  });

  it('update should call prisma.userAnswer.update', async () => {
    const fake = { update: sinon.stub().resolves({ UserAnswerId: 1 }) } as any;
    sinon.stub(prisma, 'userAnswer').value(fake);
    const result = await UserAnswerModel.update(1, { AnswerText: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { UserAnswerId: 1 }, data: { AnswerText: 'x' } })).to.be.true;
    expect(result).to.eql({ UserAnswerId: 1 });
  });

  it('delete should call prisma.userAnswer.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ UserAnswerId: 1 }) } as any;
    sinon.stub(prisma, 'userAnswer').value(fake);
    const result = await UserAnswerModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { UserAnswerId: 1 } })).to.be.true;
    expect(result).to.eql({ UserAnswerId: 1 });
  });
});
