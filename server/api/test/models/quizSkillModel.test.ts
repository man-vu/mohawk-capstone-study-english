import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import QuizSkillModel from '../../../models/quiz/QuizSkillModel.ts';

describe('QuizSkillModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.quizSkill.create', async () => {
    const data: any = { SkillDescription: 'd' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'quizSkill').value(fake);
    const result = await QuizSkillModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.quizSkill.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ SkillId: 1 }) } as any;
    sinon.stub(prisma, 'quizSkill').value(fake);
    const result = await QuizSkillModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { SkillId: 1 } })).to.be.true;
    expect(result).to.eql({ SkillId: 1 });
  });

  it('update should call prisma.quizSkill.update', async () => {
    const fake = { update: sinon.stub().resolves({ SkillId: 1 }) } as any;
    sinon.stub(prisma, 'quizSkill').value(fake);
    const result = await QuizSkillModel.update(1, { SkillDescription: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { SkillId: 1 }, data: { SkillDescription: 'x' } })).to.be.true;
    expect(result).to.eql({ SkillId: 1 });
  });

  it('delete should call prisma.quizSkill.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ SkillId: 1 }) } as any;
    sinon.stub(prisma, 'quizSkill').value(fake);
    const result = await QuizSkillModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { SkillId: 1 } })).to.be.true;
    expect(result).to.eql({ SkillId: 1 });
  });

  it('findAll should call prisma.quizSkill.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ SkillId: 1 }]) } as any;
    sinon.stub(prisma, 'quizSkill').value(fake);
    const result = await QuizSkillModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ SkillId: 1 }]);
  });
});
