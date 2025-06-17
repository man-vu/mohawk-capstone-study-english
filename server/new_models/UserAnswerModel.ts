import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
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

  static createMany(data: Prisma.UserAnswerCreateManyInput[]) {
    return prisma.userAnswer.createMany({ data });
  }

  static findById(UserAnswerId: number) {
    return prisma.userAnswer.findUnique({ where: { UserAnswerId } });
  }

  static update(UserAnswerId: number, data: Prisma.UserAnswerUpdateInput) {
    return prisma.userAnswer.update({ where: { UserAnswerId }, data });
  }

  static updateByAttemptAndQuestion(
    AttemptId: number,
    QuestionId: number,
    data: Prisma.UserAnswerUpdateInput
  ) {
    return prisma.userAnswer.updateMany({ where: { AttemptId, QuestionId }, data });
  }

  static delete(UserAnswerId: number) {
    return prisma.userAnswer.delete({ where: { UserAnswerId } });
  }

  static findAll() {
    return prisma.userAnswer.findMany();
  }

  static findAllByAttempt(QuizId: number, UserId: number, AttemptId: number) {
    return prisma.userAnswer.findMany({
      where: { AttemptId, UserAttempt: { QuizId, UserId } },
      include: { Question: { select: { TypeId: true } } },
      orderBy: { QuestionId: 'asc' },
    });
  }

  static async markOne(items: { AttemptId: number; QuestionId: number; markedResult: number }[]) {
    const queries = items.map((i) =>
      prisma.userAnswer.updateMany({
        where: { AttemptId: i.AttemptId, QuestionId: i.QuestionId },
        data: { IsCorrect: i.markedResult },
      })
    );
    return prisma.$transaction(queries);
  }
}
export default UserAnswerModel;
