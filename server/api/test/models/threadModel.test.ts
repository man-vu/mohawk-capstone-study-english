import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import ThreadModel from '../../../models/forum/ThreadModel.ts';

describe('ThreadModel', () => {
  afterEach(() => sinon.restore());

  it('findAll should call prisma.$queryRaw', async () => {
    const fake = sinon.stub().resolves([]);
    sinon.stub(prisma, '$queryRaw').value(fake);
    const result = await ThreadModel.findAll();
    expect(fake.calledOnce).to.be.true;
    expect(result).to.eql([]);
  });

  it('findMany should build query and call prisma.$queryRawUnsafe', async () => {
    const fake = sinon.stub().resolves([]);
    sinon.stub(prisma, '$queryRawUnsafe').value(fake);
    const result = await ThreadModel.findMany({ subject: 't', quizId: 1 });
    expect(fake.calledOnce).to.be.true;
    expect(result).to.eql([]);
  });
});
