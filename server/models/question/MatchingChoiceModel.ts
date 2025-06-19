import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface MatchingChoice {
  ChoiceId: number;
  QuestionId: number;
  RightText: string;
  ChoiceOrder: number;
}

export class MatchingChoiceModel {
  static create(data: Prisma.MatchingChoiceCreateInput) {
    return prisma.matchingChoice.create({ data });
  }

  static createMany(data: Prisma.MatchingChoiceCreateManyInput[]) {
    return prisma.matchingChoice.createMany({ data });
  }

  static findById(ChoiceId: number) {
    return prisma.matchingChoice.findUnique({ where: { ChoiceId } });
  }

  static update(ChoiceId: number, data: Prisma.MatchingChoiceUpdateInput) {
    return prisma.matchingChoice.update({ where: { ChoiceId }, data });
  }

  static delete(ChoiceId: number) {
    return prisma.matchingChoice.delete({ where: { ChoiceId } });
  }

  static findAll() {
    return prisma.matchingChoice.findMany();
  }

  static findManyByQuestion(QuestionId: number) {
    return prisma.matchingChoice.findMany({
      where: { QuestionId },
      orderBy: { ChoiceOrder: 'asc' },
    });
  }

  static async updateMany(
    QuestionId: number,
    items: { choice_order: number; right_text: string }[]
  ) {
    const queries = items.map((i) =>
      prisma.matchingChoice.updateMany({
        where: { QuestionId, ChoiceOrder: i.choice_order },
        data: { RightText: i.right_text },
      })
    );
    return prisma.$transaction(queries);
  }
}
export default MatchingChoiceModel;
