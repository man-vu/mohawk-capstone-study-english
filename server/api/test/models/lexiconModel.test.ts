import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import LexiconModel from '../../../models/lexicon/LexiconModel.ts';

describe('LexiconModel', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('create should call prisma.lexicon.create', async () => {
    const data: any = { Word: 'test' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'lexicon').value(fake);
    const result = await LexiconModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.lexicon.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ LexiconId: 1 }) } as any;
    sinon.stub(prisma, 'lexicon').value(fake);
    const result = await LexiconModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { LexiconId: 1 } })).to.be.true;
    expect(result).to.eql({ LexiconId: 1 });
  });

  it('update should call prisma.lexicon.update', async () => {
    const fake = { update: sinon.stub().resolves({ LexiconId: 1, Word: 'New' }) } as any;
    sinon.stub(prisma, 'lexicon').value(fake);
    const result = await LexiconModel.update(1, { Word: 'New' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { LexiconId: 1 }, data: { Word: 'New' } })).to.be.true;
    expect(result).to.eql({ LexiconId: 1, Word: 'New' });
  });

  it('delete should call prisma.lexicon.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ LexiconId: 1 }) } as any;
    sinon.stub(prisma, 'lexicon').value(fake);
    const result = await LexiconModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { LexiconId: 1 } })).to.be.true;
    expect(result).to.eql({ LexiconId: 1 });
  });

  it('findAll should call prisma.lexicon.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ LexiconId: 1 }]) } as any;
    sinon.stub(prisma, 'lexicon').value(fake);
    const result = await LexiconModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ LexiconId: 1 }]);
  });

  it('findRandom should query raw', async () => {
    const rows = [{ LexiconId: 1, TypeName: 't' }];
    const stub = sinon.stub(prisma, '$queryRawUnsafe').resolves(rows as any);
    const result = await LexiconModel.findRandom(1);
    expect(stub.calledOnce).to.be.true;
    expect(result[0].LexiconType.TypeName).to.equal('t');
  });

  it('findRandomWithSynAnt should query raw', async () => {
    const rows = [{ LexiconId: 1, TypeName: 't' }];
    const stub = sinon.stub(prisma, '$queryRawUnsafe').resolves(rows as any);
    const result = await LexiconModel.findRandomWithSynAnt(1);
    expect(stub.calledOnce).to.be.true;
    expect(result[0].LexiconType.TypeName).to.equal('t');
  });
});
