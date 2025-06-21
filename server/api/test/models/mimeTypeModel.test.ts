import { expect } from 'chai';
import sinon from 'sinon';
import prisma from '../../../prismaClient';
import MimeTypeModel from '../../../models/media/MimeTypeModel.ts';

describe('MimeTypeModel', () => {
  afterEach(() => sinon.restore());

  it('create should call prisma.mimeType.create', async () => {
    const data: any = { ImageUrl: 'u' };
    const fake = { create: sinon.stub().resolves(data) } as any;
    sinon.stub(prisma, 'mimeType').value(fake);
    const result = await MimeTypeModel.create(data as any);
    expect(fake.create.calledOnceWithExactly({ data })).to.be.true;
    expect(result).to.equal(data);
  });

  it('findById should call prisma.mimeType.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ MimeId: 1 }) } as any;
    sinon.stub(prisma, 'mimeType').value(fake);
    const result = await MimeTypeModel.findById(1);
    expect(fake.findUnique.calledOnceWithExactly({ where: { MimeId: 1 } })).to.be.true;
    expect(result).to.eql({ MimeId: 1 });
  });

  it('findOne should call prisma.mimeType.findUnique', async () => {
    const fake = { findUnique: sinon.stub().resolves({ ImageUrl: 'u' }) } as any;
    sinon.stub(prisma, 'mimeType').value(fake);
    const result = await MimeTypeModel.findOne(1);
    expect(fake.findUnique.calledOnceWithExactly({
      where: { MimeId: 1 },
      select: { ImageUrl: true, ImageAlt: true },
    })).to.be.true;
    expect(result).to.eql({ ImageUrl: 'u' });
  });

  it('update should call prisma.mimeType.update', async () => {
    const fake = { update: sinon.stub().resolves({ MimeId: 1 }) } as any;
    sinon.stub(prisma, 'mimeType').value(fake);
    const result = await MimeTypeModel.update(1, { ImageUrl: 'x' } as any);
    expect(fake.update.calledOnceWithExactly({ where: { MimeId: 1 }, data: { ImageUrl: 'x' } })).to.be.true;
    expect(result).to.eql({ MimeId: 1 });
  });

  it('delete should call prisma.mimeType.delete', async () => {
    const fake = { delete: sinon.stub().resolves({ MimeId: 1 }) } as any;
    sinon.stub(prisma, 'mimeType').value(fake);
    const result = await MimeTypeModel.delete(1);
    expect(fake.delete.calledOnceWithExactly({ where: { MimeId: 1 } })).to.be.true;
    expect(result).to.eql({ MimeId: 1 });
  });

  it('findAll should call prisma.mimeType.findMany', async () => {
    const fake = { findMany: sinon.stub().resolves([{ MimeId: 1 }]) } as any;
    sinon.stub(prisma, 'mimeType').value(fake);
    const result = await MimeTypeModel.findAll();
    expect(fake.findMany.calledOnce).to.be.true;
    expect(result).to.eql([{ MimeId: 1 }]);
  });
});
