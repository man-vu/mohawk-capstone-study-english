import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface UserAnswer {
  UserAnswerId: number;
  AttemptId: number;
  QuestionId: number;
  AnswerText: string;
  IsCorrect: boolean;
}

export class UserAnswerModel {
  static create(data: Prisma.UserAnswerCreateInput) {
    return prisma.userAnswer.create({ data });
  }

  static findById(UserAnswerId: number) {
    return prisma.userAnswer.findUnique({ where: { UserAnswerId } });
  }

  static update(UserAnswerId: number, data: Prisma.UserAnswerUpdateInput) {
    return prisma.userAnswer.update({ where: { UserAnswerId }, data });
  }

  static delete(UserAnswerId: number) {
    return prisma.userAnswer.delete({ where: { UserAnswerId } });
  }

  static findAll() {
    return prisma.userAnswer.findMany();
  }
}
export default UserAnswerModel;
