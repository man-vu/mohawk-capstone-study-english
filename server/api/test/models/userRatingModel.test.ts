import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserRatingModel from '../../../models/user/UserRatingModel.ts';

describe('UserRatingModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userRating.create', async () => {
    const data: any = { RatingGiven: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userRating').value(fake);
    const result = await UserRatingModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.userRating.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ UserId: 1, QuizId: 2 }) } as any;
    sinon.stub(prisma, 'userRating').value(fake);
    const result = await UserRatingModel.findById(1, 2);
    expect(fake.findUnique.calledOnceWithExactly({ where: { UserId_QuizId: { UserId: 1, QuizId: 2 } } })).to.be.true;
    expect(result).to.eql({ UserId: 1, QuizId: 2 });
  });

  it('update should call prisma.userRating.update', async () => {
    const fake = { update: sinon.stub().resolves({ UserId: 1, QuizId: 2 }) } as any;
    sinon.stub(prisma, 'userRating').value(fake);
    const result = await UserRatingModel.update(1, 2, { RatingGiven: 2 } as any);
    expect(fake.update.calledOnceWithExactly({ where: { UserId_QuizId: { UserId: 1, QuizId: 2 } }, data: { RatingGiven: 2 } })).to.be.true;
    expect(result).to.eql({ UserId: 1, QuizId: 2 });
  });

  it('delete should call prisma.userRating.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ UserId: 1, QuizId: 2 }) } as any;
    sinon.stub(prisma, 'userRating').value(fake);
    const result = await UserRatingModel.delete(1, 2);
    expect(fake.delete.calledOnceWithExactly({ where: { UserId_QuizId: { UserId: 1, QuizId: 2 } } })).to.be.true;
    expect(result).to.eql({ UserId: 1, QuizId: 2 });
  });

  it('findAll should call prisma.userRating.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ UserId: 1 }]) } as any;
    sinon.stub(prisma, 'userRating').value(fake);
    const result = await UserRatingModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ UserId: 1 }]);
  });

  it('deleteManyByQuiz should call prisma.userRating.deleteMany', async () => {
    const fake = { deleteMany: sinon.stub().resolves({ count: 1 }) } as any;
    sinon.stub(prisma, 'userRating').value(fake);
    const result = await UserRatingModel.deleteManyByQuiz(2);
    expect(fake.deleteMany.calledOnceWithExactly({ where: { QuizId: 2 } })).to.be.true;
    expect(result).to.eql({ count: 1 });
  });
});
