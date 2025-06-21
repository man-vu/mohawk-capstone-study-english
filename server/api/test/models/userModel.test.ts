import { expect } from 'chai';
import sinon from 'sinon';
import UserModelClass from '../../../models/user/index.ts';
import AppUserModel from '../../../models/auth/AppUserModel.ts';

const UserModel = new UserModelClass();

describe('UserModel', () => {
  afterEach(() => sinon.restore());

  it('addOne should create user via AppUserModel', async () => {
    const stub = sinon.stub(AppUserModel, 'create').resolves({} as any);
    const res = await UserModel.addOne('e', 'h', 's', 'M', 2, 1, 'f', 'l');
    expect(stub.calledOnce).to.be.true;
    expect(res).to.eql({ error: null, response: { affectedRows: 1 } });
  });

  it('findOneByEmail should query AppUserModel', async () => {
    sinon.stub(AppUserModel, 'findByEmail').resolves({ Email: 'e' } as any);
    const res = await UserModel.findOneByEmail('e');
    expect(res).to.eql({ error: null, response: [{ Email: 'e' }] });
  });

  it('deleteOne should remove via AppUserModel', async () => {
    sinon.stub(AppUserModel, 'delete').resolves(true as any);
    const res = await UserModel.deleteOne(1);
    expect(res).to.eql({ error: null, response: { affectedRows: 1 } });
  });
});
