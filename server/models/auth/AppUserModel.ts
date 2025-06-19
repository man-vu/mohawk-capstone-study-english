import prisma from '../../prismaClient';
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

  static findByEmail(Email: string) {
    return prisma.appUser.findUnique({ where: { Email } });
  }

  static findById(UserId: number) {
    return prisma.appUser.findUnique({ where: { UserId } });
  }

  static update(UserId: number, data: Prisma.AppUserUpdateInput) {
    return prisma.appUser.update({ where: { UserId }, data });
  }

  static delete(UserId: number) {
    return prisma.appUser.delete({ where: { UserId } });
  }

  static findAll() {
    return prisma.appUser.findMany();
  }

  static findAllStudents() {
    return prisma.appUser.findMany({ where: { RoleId: 2 } });
  }
}
export default AppUserModel;
