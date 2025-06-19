import prisma from '../../prismaClient';

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
    try {
      const user = await prisma.appUser.findUnique({ where: { Email: email } });
      return { error: null, response: user ? [user] : [] };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(userId: number) {
    try {
      const res = await prisma.appUser.delete({ where: { UserId: Number(userId) } });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }
}

export = UserModel;
