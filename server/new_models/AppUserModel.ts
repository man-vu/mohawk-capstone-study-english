import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface AppUser {
  UserId: number;
  Email: string;
  PasswordHash: string;
  PasswordSalt: string;
  Gender: string;
  RoleId: number;
  ProfilePictureId?: number;
  CreatedAt: Date;
  FirstName: string;
  LastName: string;
  PasswordResetHash: string;
  PasswordResetSalt: string;
  PasswordResetExpiry: Date;
}

export class AppUserModel {
  static create(data: Prisma.AppUserCreateInput) {
    return prisma.appUser.create({ data });
  }

  static addOne(
    Email: string,
    PasswordHash: string,
    PasswordSalt: string,
    Gender: string,
    RoleId: number,
    ProfilePictureId: number,
    FirstName: string,
    LastName: string
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

  static findByEmail(Email: string) {
    return prisma.appUser.findUnique({ where: { Email } });
  }

  static findById(UserId: number) {
    return prisma.appUser.findUnique({ where: { UserId } });
  }

  static update(UserId: number, data: Prisma.AppUserUpdateInput) {
    return prisma.appUser.update({ where: { UserId }, data });
  }

  static updatePasswordReset(
    UserId: number,
    PasswordResetHash: string | null,
    PasswordResetSalt: string | null,
    PasswordResetExpiry: Date | null,
  ) {
    return prisma.appUser.update({
      where: { UserId },
      data: { PasswordResetHash, PasswordResetSalt, PasswordResetExpiry },
    });
  }

  static delete(UserId: number) {
    return prisma.appUser.delete({ where: { UserId } });
  }

  static findAll() {
    return prisma.appUser.findMany();
  }
}
export default AppUserModel;
