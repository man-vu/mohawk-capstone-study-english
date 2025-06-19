import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface MatchingUserAnswer {
  UserAnswerId: number;
  UserId: number;
  QuestionId: number;
  PromptId: number;
  SelectedChoiceId: number;
  AnsweredAt: Date;
}

export class MatchingUserAnswerModel {
  static create(data: Prisma.MatchingUserAnswerCreateInput) {
    return prisma.matchingUserAnswer.create({ data });
  }

  static createMany(data: Prisma.MatchingUserAnswerCreateManyInput[]) {
    return prisma.matchingUserAnswer.createMany({ data });
  }

  static findById(UserAnswerId: number) {
    return prisma.matchingUserAnswer.findUnique({ where: { UserAnswerId } });
  }

  static update(UserAnswerId: number, data: Prisma.MatchingUserAnswerUpdateInput) {
    return prisma.matchingUserAnswer.update({ where: { UserAnswerId }, data });
  }

  static delete(UserAnswerId: number) {
    return prisma.matchingUserAnswer.delete({ where: { UserAnswerId } });
  }

  static findAll() {
    return prisma.matchingUserAnswer.findMany();
  }

  static findManyByUserAndQuestion(UserId: number, QuestionId: number) {
    return prisma.matchingUserAnswer.findMany({ where: { UserId, QuestionId } });
  }
}
export default MatchingUserAnswerModel;
