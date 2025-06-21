import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserFavoriteModel from '../../../models/user/UserFavoriteModel.ts';

describe('UserFavoriteModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userFavorite.create', async () => {
    const data: any = { UserId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userFavorite').value(fake);
    const result = await UserFavoriteModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.userFavorite.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ UserId: 1, QuizId: 2 }) } as any;
    sinon.stub(prisma, 'userFavorite').value(fake);
    const result = await UserFavoriteModel.findById(1, 2);
    expect(fake.findUnique.calledOnceWithExactly({ where: { UserId_QuizId: { UserId: 1, QuizId: 2 } } })).to.be.true;
    expect(result).to.eql({ UserId: 1, QuizId: 2 });
  });

  it('update should call prisma.userFavorite.update', async () => {
    const fake = { update: sinon.stub().resolves({ UserId: 1, QuizId: 2 }) } as any;
    sinon.stub(prisma, 'userFavorite').value(fake);
    const result = await UserFavoriteModel.update(1, 2, { } as any);
    expect(fake.update.calledOnceWithExactly({ where: { UserId_QuizId: { UserId: 1, QuizId: 2 } }, data: {} })).to.be.true;
    expect(result).to.eql({ UserId: 1, QuizId: 2 });
  });

  it('delete should call prisma.userFavorite.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ UserId: 1, QuizId: 2 }) } as any;
    sinon.stub(prisma, 'userFavorite').value(fake);
    const result = await UserFavoriteModel.delete(1, 2);
    expect(fake.delete.calledOnceWithExactly({ where: { UserId_QuizId: { UserId: 1, QuizId: 2 } } })).to.be.true;
    expect(result).to.eql({ UserId: 1, QuizId: 2 });
  });

  it('findAll should call prisma.userFavorite.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ UserId: 1 }]) } as any;
    sinon.stub(prisma, 'userFavorite').value(fake);
    const result = await UserFavoriteModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ UserId: 1 }]);
  });
});
