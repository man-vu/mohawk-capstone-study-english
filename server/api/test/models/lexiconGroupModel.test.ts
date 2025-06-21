import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import LexiconGroupModel from '../../../models/lexicon/LexiconGroupModel.ts';

describe('LexiconGroupModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.lexiconGroup.create', async () => {
    const data: any = { Theme: 't' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'lexiconGroup').value(fake);
    const result = await LexiconGroupModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.lexiconGroup.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ GroupId: 1 }) } as any;
    sinon.stub(prisma, 'lexiconGroup').value(fake);
    const result = await LexiconGroupModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { GroupId: 1 } })).to.be.true;
    expect(result).to.eql({ GroupId: 1 });
  });

  it('findAllWithWords should fetch groups and maps', async () => {
    const groups = [{ GroupId: 1, _count: { LexiconGroupMap: 2 } }];
    const maps = [{}, {}];
    const groupFake = {
      findMany: sinon.stub().resolves(groups)
    } as any;
    const mapFake = { findMany: sinon.stub().resolves(maps) } as any;
    sinon.stub(prisma, 'lexiconGroup').value(groupFake);
    sinon.stub(prisma, 'lexiconGroupMap').value(mapFake);
    const result = await LexiconGroupModel.findAllWithWords();
    expect(groupFake.findMany.calledOnce).to.be.true;
    expect(mapFake.findMany.calledOnce).to.be.true;
    expect(result[0].LexiconGroupMap).to.eql(maps);
  });
});
