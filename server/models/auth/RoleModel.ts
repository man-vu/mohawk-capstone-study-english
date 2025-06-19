import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface Role {
  RoleId: number;
  RoleName: string;
}

export class RoleModel {
  static create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({ data });
  }

  static findById(RoleId: number) {
    return prisma.role.findUnique({ where: { RoleId } });
  }

  static update(RoleId: number, data: Prisma.RoleUpdateInput) {
    return prisma.role.update({ where: { RoleId }, data });
  }

  static delete(RoleId: number) {
    return prisma.role.delete({ where: { RoleId } });
  }

  static findAll() {
    return prisma.role.findMany();
  }
}
export default RoleModel;
