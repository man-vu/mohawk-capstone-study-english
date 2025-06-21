import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import CourseModel from '../../../models/courses/CourseModel.ts';

describe('CourseModel', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('create should call prisma.course.create', async () => {
    const data: any = { Title: 'Test' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'course').value(fake);
    const result = await CourseModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.course.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ CourseId: 1 }) } as any;
    sinon.stub(prisma, 'course').value(fake);
    const result = await CourseModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { CourseId: 1 } })).to.be.true;
    expect(result).to.eql({ CourseId: 1 });
  });

  it('update should call prisma.course.update', async () => {
    const fake = { update: sinon.stub().resolves({ CourseId: 1, Title: 'New' }) } as any;
    sinon.stub(prisma, 'course').value(fake);
    const result = await CourseModel.update(1, { Title: 'New' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { CourseId: 1 }, data: { Title: 'New' } })).to.be.true;
    expect(result).to.eql({ CourseId: 1, Title: 'New' });
  });

  it('delete should call prisma.course.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ CourseId: 1 }) } as any;
    sinon.stub(prisma, 'course').value(fake);
    const result = await CourseModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { CourseId: 1 } })).to.be.true;
    expect(result).to.eql({ CourseId: 1 });
  });

  it('findAll should call prisma.course.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ CourseId: 1 }]) } as any;
    sinon.stub(prisma, 'course').value(fake);
    const result = await CourseModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ CourseId: 1 }]);
  });
});
