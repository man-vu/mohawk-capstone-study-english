import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface AppLog {
  LogId: number;
  LogLevel: string;
  LogMessage: string;
  UserId: number;
  CreatedAt: Date;
  Source: string;
}

export class AppLogModel {
  static create(data: Prisma.AppLogCreateInput) {
    return prisma.appLog.create({ data });
  }

  static findById(LogId: number) {
    return prisma.appLog.findUnique({ where: { LogId } });
  }

  static update(LogId: number, data: Prisma.AppLogUpdateInput) {
    return prisma.appLog.update({ where: { LogId }, data });
  }

  static delete(LogId: number) {
    return prisma.appLog.delete({ where: { LogId } });
  }

  static findAll() {
    return prisma.appLog.findMany();
  }
}
export default AppLogModel;
