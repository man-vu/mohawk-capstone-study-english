import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import AppLogModel from '../../../models/logs/AppLogModel.ts';

describe('AppLogModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.appLog.create', async () => {
    const data: any = { LogLevel: 'info' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'appLog').value(fake);
    const result = await AppLogModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.appLog.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ LogId: 1 }) } as any;
    sinon.stub(prisma, 'appLog').value(fake);
    const result = await AppLogModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { LogId: 1 } })).to.be.true;
    expect(result).to.eql({ LogId: 1 });
  });

  it('update should call prisma.appLog.update', async () => {
    const fake = { update: sinon.stub().resolves({ LogId: 1 }) } as any;
    sinon.stub(prisma, 'appLog').value(fake);
    const result = await AppLogModel.update(1, { LogLevel: 'warn' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { LogId: 1 }, data: { LogLevel: 'warn' } })).to.be.true;
    expect(result).to.eql({ LogId: 1 });
  });

  it('delete should call prisma.appLog.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ LogId: 1 }) } as any;
    sinon.stub(prisma, 'appLog').value(fake);
    const result = await AppLogModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { LogId: 1 } })).to.be.true;
    expect(result).to.eql({ LogId: 1 });
  });

  it('findAll should call prisma.appLog.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ LogId: 1 }]) } as any;
    sinon.stub(prisma, 'appLog').value(fake);
    const result = await AppLogModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ LogId: 1 }]);
  });
});
