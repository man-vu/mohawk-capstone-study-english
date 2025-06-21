import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import PermissionModel from '../../../models/auth/PermissionModel.ts';

describe('PermissionModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.permission.create', async () => {
    const data: any = { PermissionName: 'p' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'permission').value(fake);
    const result = await PermissionModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.permission.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ PermissionId: 1 }) } as any;
    sinon.stub(prisma, 'permission').value(fake);
    const result = await PermissionModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { PermissionId: 1 } })).to.be.true;
    expect(result).to.eql({ PermissionId: 1 });
  });

  it('update should call prisma.permission.update', async () => {
    const fake = { update: sinon.stub().resolves({ PermissionId: 1 }) } as any;
    sinon.stub(prisma, 'permission').value(fake);
    const result = await PermissionModel.update(1, { PermissionName: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { PermissionId: 1 }, data: { PermissionName: 'x' } })).to.be.true;
    expect(result).to.eql({ PermissionId: 1 });
  });

  it('delete should call prisma.permission.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ PermissionId: 1 }) } as any;
    sinon.stub(prisma, 'permission').value(fake);
    const result = await PermissionModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { PermissionId: 1 } })).to.be.true;
    expect(result).to.eql({ PermissionId: 1 });
  });

  it('findAll should call prisma.permission.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ PermissionId: 1 }]) } as any;
    sinon.stub(prisma, 'permission').value(fake);
    const result = await PermissionModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ PermissionId: 1 }]);
  });
});
