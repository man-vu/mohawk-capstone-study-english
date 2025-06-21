import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserAttemptModel from '../../../models/user/UserAttemptModel.ts';

describe('UserAttemptModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userAttempt.create', async () => {
    const data: any = { QuizId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userAttempt').value(fake);
    const result = await UserAttemptModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.userAttempt.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ AttemptId: 1 }) } as any;
    sinon.stub(prisma, 'userAttempt').value(fake);
    const result = await UserAttemptModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { AttemptId: 1 } })).to.be.true;
    expect(result).to.eql({ AttemptId: 1 });
  });

  it('update should call prisma.userAttempt.update', async () => {
    const fake = { update: sinon.stub().resolves({ AttemptId: 1 }) } as any;
    sinon.stub(prisma, 'userAttempt').value(fake);
    const result = await UserAttemptModel.update(1, { Grade: 1 } as any);
    expect(fake.update.calledOnceWithExactly({ where: { AttemptId: 1 }, data: { Grade: 1 } })).to.be.true;
    expect(result).to.eql({ AttemptId: 1 });
  });

  it('delete should call prisma.userAttempt.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ AttemptId: 1 }) } as any;
    sinon.stub(prisma, 'userAttempt').value(fake);
    const result = await UserAttemptModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { AttemptId: 1 } })).to.be.true;
    expect(result).to.eql({ AttemptId: 1 });
  });

  it('findAll should call prisma.userAttempt.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ AttemptId: 1 }]) } as any;
    sinon.stub(prisma, 'userAttempt').value(fake);
    const result = await UserAttemptModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ AttemptId: 1 }]);
  });
});
