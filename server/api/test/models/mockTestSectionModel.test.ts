import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MockTestSectionModel from '../../../models/mockTests/MockTestSectionModel.ts';

describe('MockTestSectionModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.mockTestSection.create', async () => {
    const data: any = { Duration: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'mockTestSection').value(fake);
    const result = await MockTestSectionModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findByMockTest should call prisma.mockTestSection.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ SectionId: 1 }]) } as any;
    sinon.stub(prisma, 'mockTestSection').value(fake);
    const result = await MockTestSectionModel.findByMockTest(1);
    expect(fake.findMany.calledOnceWithExactly({ where: { MockTestId: 1 } })).to.be.true;
    expect(result).to.eql([{ SectionId: 1 }]);
  });
});
