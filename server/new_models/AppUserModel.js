const prisma = require('../prismaClient');
class AppUserModel {
  static create(data) {
    return prisma.appUser.create({ data });
  }

  static addOne(
    Email,
    PasswordHash,
    PasswordSalt,
    Gender,
    RoleId,
    ProfilePictureId,
    FirstName,
    LastName
  ) {
    return prisma.appUser.create({
      data: {
        Email,
        PasswordHash,
        PasswordSalt,
        Gender,
        RoleId,
        ProfilePictureId,
        FirstName,
        LastName,
      },
    });
  }

  static findByEmail(Email) {
    return prisma.appUser.findUnique({ where: { Email } });
  }

  static findById(UserId) {
    return prisma.appUser.findUnique({ where: { UserId } });
  }

  static update(UserId, data) {
    return prisma.appUser.update({ where: { UserId }, data });
  }

  static updatePasswordReset(UserId, PasswordResetHash, PasswordResetSalt, PasswordResetExpiry) {
    return prisma.appUser.update({
      where: { UserId },
      data: { PasswordResetHash, PasswordResetSalt, PasswordResetExpiry },
    });
  }

  static delete(UserId) {
    return prisma.appUser.delete({ where: { UserId } });
  }

  static findAll() {
    return prisma.appUser.findMany();
  }
}
module.exports = AppUserModel;
