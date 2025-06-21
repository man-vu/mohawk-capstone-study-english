import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuestionTypeModel from '../../../models/question/QuestionTypeModel.ts';

describe('QuestionTypeModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.questionType.create', async () => {
    const data: any = { TypeName: 't' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'questionType').value(fake);
    const result = await QuestionTypeModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.questionType.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ TypeId: 1 }) } as any;
    sinon.stub(prisma, 'questionType').value(fake);
    const result = await QuestionTypeModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { TypeId: 1 } })).to.be.true;
    expect(result).to.eql({ TypeId: 1 });
  });

  it('update should call prisma.questionType.update', async () => {
    const fake = { update: sinon.stub().resolves({ TypeId: 1 }) } as any;
    sinon.stub(prisma, 'questionType').value(fake);
    const result = await QuestionTypeModel.update(1, { TypeName: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { TypeId: 1 }, data: { TypeName: 'x' } })).to.be.true;
    expect(result).to.eql({ TypeId: 1 });
  });

  it('delete should call prisma.questionType.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ TypeId: 1 }) } as any;
    sinon.stub(prisma, 'questionType').value(fake);
    const result = await QuestionTypeModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { TypeId: 1 } })).to.be.true;
    expect(result).to.eql({ TypeId: 1 });
  });

  it('findAll should call prisma.questionType.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ TypeId: 1 }]) } as any;
    sinon.stub(prisma, 'questionType').value(fake);
    const result = await QuestionTypeModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ TypeId: 1 }]);
  });
});
