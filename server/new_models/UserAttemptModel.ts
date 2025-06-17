import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface UserAttempt {
  AttemptId: number;
  UserId: number;
  QuizId: number;
  StartTime: Date;
  EndTime?: Date;
  RemainingTime?: number;
  Grade?: number;
}

export class UserAttemptModel {
  static create(data: Prisma.UserAttemptCreateInput) {
    return prisma.userAttempt.create({ data });
  }

  static findById(AttemptId: number) {
    return prisma.userAttempt.findUnique({ where: { AttemptId } });
  }

  static update(AttemptId: number, data: Prisma.UserAttemptUpdateInput) {
    return prisma.userAttempt.update({ where: { AttemptId }, data });
  }

  static delete(AttemptId: number) {
    return prisma.userAttempt.delete({ where: { AttemptId } });
  }

  static findAll() {
    return prisma.userAttempt.findMany();
  }
}
export default UserAttemptModel;
