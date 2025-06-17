import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface QuizQuestion {
  QuizId: number;
  QuestionId: number;
  SortOrder: number;
}

export class QuizQuestionModel {
  static create(data: Prisma.QuizQuestionCreateInput) {
    return prisma.quizQuestion.create({ data });
  }

  static findById(QuizId: number, QuestionId: number) {
    return prisma.quizQuestion.findUnique({ where: { QuizId_QuestionId: { QuizId, QuestionId } } });
  }

  static update(QuizId: number, QuestionId: number, data: Prisma.QuizQuestionUpdateInput) {
    return prisma.quizQuestion.update({ where: { QuizId_QuestionId: { QuizId, QuestionId } }, data });
  }

  static delete(QuizId: number, QuestionId: number) {
    return prisma.quizQuestion.delete({ where: { QuizId_QuestionId: { QuizId, QuestionId } } });
  }

  static findAll() {
    return prisma.quizQuestion.findMany();
  }
}
export default QuizQuestionModel;
