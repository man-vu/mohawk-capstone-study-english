import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';

export interface QuizPart {
  PartId: number;
  QuizId: number;
  PartTitle: string;
  SortOrder: number;
}

export class QuizPartModel {
  static create(data: Prisma.QuizPartCreateInput) {
    return prisma.quizPart.create({ data });
  }

  static findById(PartId: number) {
    return prisma.quizPart.findUnique({ where: { PartId } });
  }

  static update(PartId: number, data: Prisma.QuizPartUpdateInput) {
    return prisma.quizPart.update({ where: { PartId }, data });
  }

  static delete(PartId: number) {
    return prisma.quizPart.delete({ where: { PartId } });
  }

  static findAllByQuiz(QuizId: number) {
    return prisma.quizPart.findMany({ where: { QuizId }, orderBy: { SortOrder: 'asc' } });
  }
}

export default QuizPartModel;
