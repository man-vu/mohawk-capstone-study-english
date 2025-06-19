import prisma from '../../prismaClient';
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

  static createMany(data: Prisma.QuestionMultipleChoiceCreateManyInput[]) {
    return prisma.questionMultipleChoice.createMany({ data });
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

  static findManyByQuestion(QuestionId: number) {
    return prisma.questionMultipleChoice.findMany({
      where: { QuestionId },
      orderBy: { ChoiceOrder: 'asc' },
    });
  }

  static async updateMany(
    QuestionId: number,
    items: { choice_id: number; choice_text: string; is_correct_choice: number }[]
  ) {
    const queries = items.map((i) =>
      prisma.questionMultipleChoice.updateMany({
        where: { QuestionId, ChoiceOrder: i.choice_id },
        data: { ChoiceText: i.choice_text, IsCorrect: !!i.is_correct_choice },
      })
    );
    return prisma.$transaction(queries);
  }
}
export default QuestionMultipleChoiceModel;
