import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface QuestionGapFilling {
  QGFId: number;
  QuestionId: number;
  SequenceId: number;
  CorrectAnswer: string;
}

export class QuestionGapFillingModel {
  static create(data: Prisma.QuestionGapFillingCreateInput) {
    return prisma.questionGapFilling.create({ data });
  }

  static createMany(data: Prisma.QuestionGapFillingCreateManyInput[]) {
    return prisma.questionGapFilling.createMany({ data });
  }

  static findById(QGFId: number) {
    return prisma.questionGapFilling.findUnique({ where: { QGFId } });
  }

  static update(QGFId: number, data: Prisma.QuestionGapFillingUpdateInput) {
    return prisma.questionGapFilling.update({ where: { QGFId }, data });
  }

  static delete(QGFId: number) {
    return prisma.questionGapFilling.delete({ where: { QGFId } });
  }

  static findAll() {
    return prisma.questionGapFilling.findMany();
  }

  static findManyByQuestion(QuestionId: number) {
    return prisma.questionGapFilling.findMany({
      where: { QuestionId },
      orderBy: { SequenceId: 'asc' },
    });
  }

  static async updateMany(
    QuestionId: number,
    items: { sequence_id: number; correct_answer: string }[]
  ) {
    const queries = items.map((i) =>
      prisma.questionGapFilling.updateMany({
        where: { QuestionId, SequenceId: i.sequence_id },
        data: { CorrectAnswer: i.correct_answer },
      })
    );
    return prisma.$transaction(queries);
  }
}
export default QuestionGapFillingModel;
