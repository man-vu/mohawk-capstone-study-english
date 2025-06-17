import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface Quiz {
  QuizId: number;
  Title: string;
  SkillId?: number;
  Description?: string;
  IsActive: boolean;
  TimeAllowed: number;
  CreatedBy: number;
  CreatedAt: Date;
}

export class QuizModel {
  static create(data: Prisma.QuizCreateInput) {
    return prisma.quiz.create({ data });
  }

  static findById(QuizId: number) {
    return prisma.quiz.findUnique({ where: { QuizId } });
  }

  static update(QuizId: number, data: Prisma.QuizUpdateInput) {
    return prisma.quiz.update({ where: { QuizId }, data });
  }

  static delete(QuizId: number) {
    return prisma.quiz.delete({ where: { QuizId } });
  }

  static findAll() {
    return prisma.quiz.findMany();
  }
}
export default QuizModel;
