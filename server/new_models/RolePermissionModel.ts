import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface RolePermission {
  RoleId: number;
  PermissionId: number;
  Enabled: boolean;
}

export class RolePermissionModel {
  static create(data: Prisma.RolePermissionCreateInput) {
    return prisma.rolePermission.create({ data });
  }

  static findById(RoleId: number, PermissionId: number) {
    return prisma.rolePermission.findUnique({ where: { RoleId_PermissionId: { RoleId, PermissionId } } });
  }

  static update(RoleId: number, PermissionId: number, data: Prisma.RolePermissionUpdateInput) {
    return prisma.rolePermission.update({ where: { RoleId_PermissionId: { RoleId, PermissionId } }, data });
  }

  static delete(RoleId: number, PermissionId: number) {
    return prisma.rolePermission.delete({ where: { RoleId_PermissionId: { RoleId, PermissionId } } });
  }

  static findAll() {
    return prisma.rolePermission.findMany();
  }
}
export default RolePermissionModel;
