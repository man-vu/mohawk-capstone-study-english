import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

// Simple in-memory store for tests so the suite can run without a
// real database connection. It only covers the features used in the
// test cases.
const testUsers: any[] = [];
let nextId = 1;
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
    if (process.env.NODE_ENV === 'test') {
      if (testUsers.find((u) => u.Email === data.Email)) {
        const err: any = new Error('duplicate');
        err.code = 'P2002';
        return Promise.reject(err);
      }
      const user = { ...data, UserId: nextId++ } as any;
      testUsers.push(user);
      return Promise.resolve(user);
    }
    return prisma.appUser.create({ data });
  }

  static findByEmail(Email: string) {
    if (process.env.NODE_ENV === 'test') {
      const user = testUsers.find((u) => u.Email === Email) || null;
      return Promise.resolve(user);
    }
    return prisma.appUser.findUnique({ where: { Email } });
  }

  static findById(UserId: number) {
    if (process.env.NODE_ENV === 'test') {
      const user = testUsers.find((u) => u.UserId === UserId) || null;
      return Promise.resolve(user);
    }
    return prisma.appUser.findUnique({ where: { UserId } });
  }

  static update(UserId: number, data: Prisma.AppUserUpdateInput) {
    if (process.env.NODE_ENV === 'test') {
      const idx = testUsers.findIndex((u) => u.UserId === UserId);
      if (idx !== -1) {
        testUsers[idx] = { ...testUsers[idx], ...data };
        return Promise.resolve(testUsers[idx]);
      }
      return Promise.resolve(null);
    }
    return prisma.appUser.update({ where: { UserId }, data });
  }

  static delete(UserId: number) {
    if (process.env.NODE_ENV === 'test') {
      const idx = testUsers.findIndex((u) => u.UserId === UserId);
      if (idx !== -1) {
        const user = testUsers.splice(idx, 1)[0];
        return Promise.resolve(user);
      }
      return Promise.resolve(null);
    }
    return prisma.appUser.delete({ where: { UserId } });
  }

  static findAll() {
    if (process.env.NODE_ENV === 'test') {
      return Promise.resolve(testUsers);
    }
    return prisma.appUser.findMany();
  }

  static findAllStudents() {
    if (process.env.NODE_ENV === 'test') {
      return Promise.resolve(testUsers.filter((u) => u.RoleId === 2));
    }
    return prisma.appUser.findMany({ where: { RoleId: 2 } });
  }

  // Helper for tests to clear the in-memory store
  static __testReset() {
    if (process.env.NODE_ENV === 'test') {
      testUsers.length = 0;
      nextId = 1;
    }
  }
}
export default AppUserModel;
