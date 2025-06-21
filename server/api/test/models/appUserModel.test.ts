import { expect } from 'chai';
import AppUserModel from '../../../models/auth/AppUserModel.ts';

describe('AppUserModel', () => {
  beforeEach(() => {
    AppUserModel.__testReset();
  });

  it('should create and find user by email', async () => {
    const user = await AppUserModel.create({
      Email: 'a@a.com',
      PasswordHash: 'h',
      PasswordSalt: 's',
      Gender: 'M',
      RoleId: 1,
      FirstName: 'A',
      LastName: 'B',
    } as any);
    const found = await AppUserModel.findByEmail('a@a.com');
    expect(found).to.eql(user);
  });

  it('should reject duplicate email', async () => {
    await AppUserModel.create({
      Email: 'dup@a.com',
      PasswordHash: 'h',
      PasswordSalt: 's',
      Gender: 'M',
      RoleId: 1,
      FirstName: 'A',
      LastName: 'B',
    } as any);
    let err: any = null;
    try {
      await AppUserModel.create({
        Email: 'dup@a.com',
        PasswordHash: 'h',
        PasswordSalt: 's',
        Gender: 'M',
        RoleId: 1,
        FirstName: 'A',
        LastName: 'B',
      } as any);
    } catch (e) {
      err = e;
    }
    expect(err).to.not.be.null;
    expect(err.code).to.equal('P2002');
  });

  it('findAllStudents should filter', async () => {
    await AppUserModel.create({ Email: 's@a.com', PasswordHash: 'h', PasswordSalt: 's', Gender: 'M', RoleId: 2, FirstName: '', LastName: '' } as any);
    await AppUserModel.create({ Email: 't@a.com', PasswordHash: 'h', PasswordSalt: 's', Gender: 'M', RoleId: 1, FirstName: '', LastName: '' } as any);
    const students = await AppUserModel.findAllStudents();
    expect(students.length).to.equal(1);
    expect(students[0].Email).to.equal('s@a.com');
  });
});
