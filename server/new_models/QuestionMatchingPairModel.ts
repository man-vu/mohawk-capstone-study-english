import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
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
}
export default QuestionMatchingPairModel;
