import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface UserEssayAnswer {
  UserAnswerId: number;
  EssayText?: string;
  Mark?: number;
  TeacherFeedback?: string;
}

export class UserEssayAnswerModel {
  static create(data: Prisma.UserEssayAnswerCreateInput) {
    return prisma.userEssayAnswer.create({ data });
  }

  static findById(UserAnswerId: number) {
    return prisma.userEssayAnswer.findUnique({ where: { UserAnswerId } });
  }

  static update(UserAnswerId: number, data: Prisma.UserEssayAnswerUpdateInput) {
    return prisma.userEssayAnswer.update({ where: { UserAnswerId }, data });
  }

  static delete(UserAnswerId: number) {
    return prisma.userEssayAnswer.delete({ where: { UserAnswerId } });
  }

  static findAll() {
    return prisma.userEssayAnswer.findMany();
  }
}
export default UserEssayAnswerModel;
