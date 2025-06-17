import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface UserActivity {
  ActivityId: number;
  UserId: number;
  ActivityType: string;
  TargetId?: number;
  ActivityTime: Date;
  Details: string;
}

export class UserActivityModel {
  static create(data: Prisma.UserActivityCreateInput) {
    return prisma.userActivity.create({ data });
  }

  static findById(ActivityId: number) {
    return prisma.userActivity.findUnique({ where: { ActivityId } });
  }

  static update(ActivityId: number, data: Prisma.UserActivityUpdateInput) {
    return prisma.userActivity.update({ where: { ActivityId }, data });
  }

  static delete(ActivityId: number) {
    return prisma.userActivity.delete({ where: { ActivityId } });
  }

  static findAll() {
    return prisma.userActivity.findMany();
  }
}
export default UserActivityModel;
