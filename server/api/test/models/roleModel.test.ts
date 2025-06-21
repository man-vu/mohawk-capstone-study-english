import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import RoleModel from '../../../models/auth/RoleModel.ts';

describe('RoleModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.role.create', async () => {
    const data: any = { RoleName: 'r' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'role').value(fake);
    const result = await RoleModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.role.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ RoleId: 1 }) } as any;
    sinon.stub(prisma, 'role').value(fake);
    const result = await RoleModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { RoleId: 1 } })).to.be.true;
    expect(result).to.eql({ RoleId: 1 });
  });

  it('update should call prisma.role.update', async () => {
    const fake = { update: sinon.stub().resolves({ RoleId: 1 }) } as any;
    sinon.stub(prisma, 'role').value(fake);
    const result = await RoleModel.update(1, { RoleName: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { RoleId: 1 }, data: { RoleName: 'x' } })).to.be.true;
    expect(result).to.eql({ RoleId: 1 });
  });

  it('delete should call prisma.role.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ RoleId: 1 }) } as any;
    sinon.stub(prisma, 'role').value(fake);
    const result = await RoleModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { RoleId: 1 } })).to.be.true;
    expect(result).to.eql({ RoleId: 1 });
  });

  it('findAll should call prisma.role.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ RoleId: 1 }]) } as any;
    sinon.stub(prisma, 'role').value(fake);
    const result = await RoleModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ RoleId: 1 }]);
  });
});
