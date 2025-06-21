import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import AuditTrailModel from '../../../models/logs/AuditTrailModel.ts';

describe('AuditTrailModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.auditTrail.create', async () => {
    const data: any = { TableName: 't' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'auditTrail').value(fake);
    const result = await AuditTrailModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.auditTrail.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ AuditId: 1 }) } as any;
    sinon.stub(prisma, 'auditTrail').value(fake);
    const result = await AuditTrailModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { AuditId: 1 } })).to.be.true;
    expect(result).to.eql({ AuditId: 1 });
  });

  it('update should call prisma.auditTrail.update', async () => {
    const fake = { update: sinon.stub().resolves({ AuditId: 1 }) } as any;
    sinon.stub(prisma, 'auditTrail').value(fake);
    const result = await AuditTrailModel.update(1, { TableName: 'n' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { AuditId: 1 }, data: { TableName: 'n' } })).to.be.true;
    expect(result).to.eql({ AuditId: 1 });
  });

  it('delete should call prisma.auditTrail.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ AuditId: 1 }) } as any;
    sinon.stub(prisma, 'auditTrail').value(fake);
    const result = await AuditTrailModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { AuditId: 1 } })).to.be.true;
    expect(result).to.eql({ AuditId: 1 });
  });

  it('findAll should call prisma.auditTrail.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ AuditId: 1 }]) } as any;
    sinon.stub(prisma, 'auditTrail').value(fake);
    const result = await AuditTrailModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ AuditId: 1 }]);
  });
});
