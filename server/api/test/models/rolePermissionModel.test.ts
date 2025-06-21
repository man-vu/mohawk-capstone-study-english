import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import RolePermissionModel from '../../../models/auth/RolePermissionModel.ts';

describe('RolePermissionModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.rolePermission.create', async () => {
    const data: any = { Enabled: true };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'rolePermission').value(fake);
    const result = await RolePermissionModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.rolePermission.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ RoleId: 1, PermissionId: 2 }) } as any;
    sinon.stub(prisma, 'rolePermission').value(fake);
    const result = await RolePermissionModel.findById(1, 2);
    expect(fake.findUnique.calledOnceWithExactly({ where: { RoleId_PermissionId: { RoleId: 1, PermissionId: 2 } } })).to.be.true;
    expect(result).to.eql({ RoleId: 1, PermissionId: 2 });
  });

  it('update should call prisma.rolePermission.update', async () => {
    const fake = { update: sinon.stub().resolves({ RoleId: 1, PermissionId: 2 }) } as any;
    sinon.stub(prisma, 'rolePermission').value(fake);
    const result = await RolePermissionModel.update(1, 2, { Enabled: false } as any);
    expect(fake.update.calledOnceWithExactly({ where: { RoleId_PermissionId: { RoleId: 1, PermissionId: 2 } }, data: { Enabled: false } })).to.be.true;
    expect(result).to.eql({ RoleId: 1, PermissionId: 2 });
  });

  it('delete should call prisma.rolePermission.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ RoleId: 1, PermissionId: 2 }) } as any;
    sinon.stub(prisma, 'rolePermission').value(fake);
    const result = await RolePermissionModel.delete(1, 2);
    expect(fake.delete.calledOnceWithExactly({ where: { RoleId_PermissionId: { RoleId: 1, PermissionId: 2 } } })).to.be.true;
    expect(result).to.eql({ RoleId: 1, PermissionId: 2 });
  });

  it('findAll should call prisma.rolePermission.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ RoleId: 1, PermissionId: 2 }]) } as any;
    sinon.stub(prisma, 'rolePermission').value(fake);
    const result = await RolePermissionModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ RoleId: 1, PermissionId: 2 }]);
  });
});
