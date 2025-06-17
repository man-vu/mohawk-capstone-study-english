import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface QuestionMultipleChoice {
  QMCId: number;
  QuestionId: number;
  ChoiceText: string;
  ChoiceOrder: number;
  IsCorrect: boolean;
}

export class QuestionMultipleChoiceModel {
  static create(data: Prisma.QuestionMultipleChoiceCreateInput) {
    return prisma.questionMultipleChoice.create({ data });
  }

  static findById(QMCId: number) {
    return prisma.questionMultipleChoice.findUnique({ where: { QMCId } });
  }

  static update(QMCId: number, data: Prisma.QuestionMultipleChoiceUpdateInput) {
    return prisma.questionMultipleChoice.update({ where: { QMCId }, data });
  }

  static delete(QMCId: number) {
    return prisma.questionMultipleChoice.delete({ where: { QMCId } });
  }

  static findAll() {
    return prisma.questionMultipleChoice.findMany();
  }
}
export default QuestionMultipleChoiceModel;
