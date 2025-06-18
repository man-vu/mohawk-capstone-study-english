import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface QuestionMatchingPair {
  QMPairId: number;
  QuestionId: number;
  LeftText: string;
  RightText: string;
  PairOrder: number;
}

export class QuestionMatchingPairModel {
  static create(data: Prisma.QuestionMatchingPairCreateInput) {
    return prisma.questionMatchingPair.create({ data });
  }

  static createMany(data: Prisma.QuestionMatchingPairCreateManyInput[]) {
    return prisma.questionMatchingPair.createMany({ data });
  }

  static findById(QMPairId: number) {
    return prisma.questionMatchingPair.findUnique({ where: { QMPairId } });
  }

  static update(QMPairId: number, data: Prisma.QuestionMatchingPairUpdateInput) {
    return prisma.questionMatchingPair.update({ where: { QMPairId }, data });
  }

  static delete(QMPairId: number) {
    return prisma.questionMatchingPair.delete({ where: { QMPairId } });
  }

  static findAll() {
    return prisma.questionMatchingPair.findMany();
  }

  static findManyByQuestion(QuestionId: number) {
    return prisma.questionMatchingPair.findMany({
      where: { QuestionId },
      orderBy: { PairOrder: 'asc' },
    });
  }

  static async updateMany(
    QuestionId: number,
    items: { pair_order: number; left_text: string; right_text: string }[]
  ) {
    const queries = items.map((i) =>
      prisma.questionMatchingPair.updateMany({
        where: { QuestionId, PairOrder: i.pair_order },
        data: { LeftText: i.left_text, RightText: i.right_text },
      })
    );
    return prisma.$transaction(queries);
  }
}
export default QuestionMatchingPairModel;
