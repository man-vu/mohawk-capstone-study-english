import prisma from '../../prismaClient';
import AppUserModel from '../auth/AppUserModel';

class UserModel {
  async addOne(
    email: string,
    passwordHash: string,
    passwordSalt: string,
    gender: string,
    roleId: number,
    profilePictureId?: number,
    firstName?: string,
    lastName?: string
  ) {
    if (process.env.NODE_ENV === 'test') {
      await AppUserModel.create({
        Email: email,
        PasswordHash: passwordHash,
        PasswordSalt: passwordSalt,
        Gender: gender,
        RoleId: Number(roleId),
        ProfilePictureId: profilePictureId ? Number(profilePictureId) : null,
        FirstName: firstName,
        LastName: lastName,
      });
      return { error: null, response: { affectedRows: 1 } };
    }
    try {
      await prisma.appUser.create({
        data: {
          Email: email,
          PasswordHash: passwordHash,
          PasswordSalt: passwordSalt,
          Gender: gender,
          RoleId: Number(roleId),
          ProfilePictureId: profilePictureId ? Number(profilePictureId) : null,
          FirstName: firstName,
          LastName: lastName,
        },
      });
      return { error: null, response: { affectedRows: 1 } };
    } catch (error) {
      return { error };
    }
  }

  async findOneByEmail(email: string) {
    if (process.env.NODE_ENV === 'test') {
      const user = await AppUserModel.findByEmail(email);
      return { error: null, response: user ? [user] : [] };
    }
    try {
      const user = await prisma.appUser.findUnique({ where: { Email: email } });
      return { error: null, response: user ? [user] : [] };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(userId: number) {
    if (process.env.NODE_ENV === 'test') {
      const res = await AppUserModel.delete(Number(userId));
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    }
    try {
      const res = await prisma.appUser.delete({ where: { UserId: Number(userId) } });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }
}

export = UserModel;
