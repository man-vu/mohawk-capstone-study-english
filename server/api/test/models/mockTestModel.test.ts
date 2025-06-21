import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MockTestModel from '../../../models/mockTests/MockTestModel.ts';

describe('MockTestModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.mockTest.create', async () => {
    const data: any = { Title: 't' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'mockTest').value(fake);
    const result = await MockTestModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.mockTest.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ MockTestId: 1 }) } as any;
    sinon.stub(prisma, 'mockTest').value(fake);
    const result = await MockTestModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { MockTestId: 1 }, include: { MockTestSection: true } })).to.be.true;
    expect(result).to.eql({ MockTestId: 1 });
  });

  it('findAll should call prisma.mockTest.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ MockTestId: 1 }]) } as any;
    sinon.stub(prisma, 'mockTest').value(fake);
    const result = await MockTestModel.findAll();
    expect(fake.findMany.calledOnceWithExactly({ include: { MockTestSection: true } })).to.be.true;
    expect(result).to.eql([{ MockTestId: 1 }]);
  });
});
