import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface Permission {
  PermissionId: number;
  PermissionName: string;
}

export class PermissionModel {
  static create(data: Prisma.PermissionCreateInput) {
    return prisma.permission.create({ data });
  }

  static findById(PermissionId: number) {
    return prisma.permission.findUnique({ where: { PermissionId } });
  }

  static update(PermissionId: number, data: Prisma.PermissionUpdateInput) {
    return prisma.permission.update({ where: { PermissionId }, data });
  }

  static delete(PermissionId: number) {
    return prisma.permission.delete({ where: { PermissionId } });
  }

  static findAll() {
    return prisma.permission.findMany();
  }
}
export default PermissionModel;
