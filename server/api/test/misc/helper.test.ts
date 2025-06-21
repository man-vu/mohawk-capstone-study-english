import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { checkPassword, hashPasswordAsync, cleanObject, imageFilter, getAvatarUrl } from '../../../misc/helper.ts';

describe('helper utilities', () => {
  afterEach(() => sinon.restore());

  it('checkPassword should resolve comparison result', async () => {
    const stub = sinon.stub(bcrypt, 'compare').callsFake((r, h, cb) => cb(null, true));
    const res = await checkPassword('raw', 'hash');
    expect(stub.calledOnceWith('raw', 'hash')).to.be.true;
    expect(res).to.be.true;
  });

  it('hashPasswordAsync should return hash and salt', async () => {
    sinon.stub(bcrypt, 'genSalt').resolves('salt' as any);
    sinon.stub(bcrypt, 'hash').resolves('hash' as any);
    const res = await hashPasswordAsync('pass');
    expect(res).to.eql({ passwordHash: 'hash', passwordSalt: 'salt' });
  });

  it('cleanObject should remove nullish values', () => {
    const arr = [{ a: 1, b: null as any, c: undefined as any }];
    const res = cleanObject(arr);
    expect(res).to.eql([{ a: 1 }]);
  });

  it('imageFilter should reject invalid file', () => {
    const cb = sinon.stub();
    imageFilter({} as any, { originalname: 'a.txt' } as any, cb);
    expect(cb.calledOnce).to.be.true;
    expect((cb.firstCall.args[0] as Error).message).to.equal('Only image files are allowed!');
  });

  it('imageFilter should accept image file', () => {
    const cb = sinon.stub();
    imageFilter({} as any, { originalname: 'img.png' } as any, cb);
    expect(cb.calledOnceWithExactly(null, true)).to.be.true;
  });

  it('getAvatarUrl should return default avatar path', () => {
    const url = getAvatarUrl(' Alice ');
    expect(url).to.equal('default/A.svg');
  });
});
