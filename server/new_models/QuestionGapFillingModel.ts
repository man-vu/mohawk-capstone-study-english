import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
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
}
export default QuestionGapFillingModel;
