import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface QuestionEssay {
  QuestionId: number;
  WordLimit: number;
  SuggestedTimeMinutes: number;
  ModelAnswer: string;
}

export class QuestionEssayModel {
  static create(data: Prisma.QuestionEssayCreateInput) {
    return prisma.questionEssay.create({ data });
  }

  static findById(QuestionId: number) {
    return prisma.questionEssay.findUnique({ where: { QuestionId } });
  }

  static update(QuestionId: number, data: Prisma.QuestionEssayUpdateInput) {
    return prisma.questionEssay.update({ where: { QuestionId }, data });
  }

  static delete(QuestionId: number) {
    return prisma.questionEssay.delete({ where: { QuestionId } });
  }

  static findAll() {
    return prisma.questionEssay.findMany();
  }
}
export default QuestionEssayModel;
