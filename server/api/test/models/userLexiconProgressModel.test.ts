import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import UserLexiconProgressModel from '../../../models/lexicon/UserLexiconProgressModel.ts';

describe('UserLexiconProgressModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.userLexiconProgress.create', async () => {
    const data: any = { UserId: 1 };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'userLexiconProgress').value(fake);
    const result = await UserLexiconProgressModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('upsert should call prisma.userLexiconProgress.upsert', async () => {
    const fake = { upsert: sinon.stub().resolves({ UserId: 1 }) } as any;
    sinon.stub(prisma, 'userLexiconProgress').value(fake);
    const result = await UserLexiconProgressModel.upsert(1, 2, { UserId: 1 } as any);
    expect(
      fake.upsert.calledOnceWithExactly({
        where: { UserId_LexiconId: { UserId: 1, LexiconId: 2 } },
        create: { UserId: 1 },
        update: { UserId: 1 },
      })
    ).to.be.true;
    expect(result).to.eql({ UserId: 1 });
  });

  it('findByUser should call prisma.userLexiconProgress.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ UserId: 1 }]) } as any;
    sinon.stub(prisma, 'userLexiconProgress').value(fake);
    const result = await UserLexiconProgressModel.findByUser(1);
    expect(fake.findMany.calledOnceWithExactly({ where: { UserId: 1 } })).to.be.true;
    expect(result).to.eql([{ UserId: 1 }]);
  });
});
