import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserActivityModel from '../../../models/user/UserActivityModel.ts';

describe('UserActivityModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userActivity.create', async () => {
    const data: any = { ActivityType: 't' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userActivity').value(fake);
    const result = await UserActivityModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.userActivity.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ ActivityId: 1 }) } as any;
    sinon.stub(prisma, 'userActivity').value(fake);
    const result = await UserActivityModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { ActivityId: 1 } })).to.be.true;
    expect(result).to.eql({ ActivityId: 1 });
  });

  it('update should call prisma.userActivity.update', async () => {
    const fake = { update: sinon.stub().resolves({ ActivityId: 1 }) } as any;
    sinon.stub(prisma, 'userActivity').value(fake);
    const result = await UserActivityModel.update(1, { ActivityType: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { ActivityId: 1 }, data: { ActivityType: 'x' } })).to.be.true;
    expect(result).to.eql({ ActivityId: 1 });
  });

  it('delete should call prisma.userActivity.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ ActivityId: 1 }) } as any;
    sinon.stub(prisma, 'userActivity').value(fake);
    const result = await UserActivityModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { ActivityId: 1 } })).to.be.true;
    expect(result).to.eql({ ActivityId: 1 });
  });

  it('findAll should call prisma.userActivity.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ ActivityId: 1 }]) } as any;
    sinon.stub(prisma, 'userActivity').value(fake);
    const result = await UserActivityModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ ActivityId: 1 }]);
  });
});
