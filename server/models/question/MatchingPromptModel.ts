import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface MatchingPrompt {
  PromptId: number;
  QuestionId: number;
  LeftText: string;
  PromptOrder: number;
}

export class MatchingPromptModel {
  static create(data: Prisma.MatchingPromptCreateInput) {
    return prisma.matchingPrompt.create({ data });
  }

  static createMany(data: Prisma.MatchingPromptCreateManyInput[]) {
    return prisma.matchingPrompt.createMany({ data });
  }

  static findById(PromptId: number) {
    return prisma.matchingPrompt.findUnique({ where: { PromptId } });
  }

  static update(PromptId: number, data: Prisma.MatchingPromptUpdateInput) {
    return prisma.matchingPrompt.update({ where: { PromptId }, data });
  }

  static delete(PromptId: number) {
    return prisma.matchingPrompt.delete({ where: { PromptId } });
  }

  static findAll() {
    return prisma.matchingPrompt.findMany();
  }

  static findManyByQuestion(QuestionId: number) {
    return prisma.matchingPrompt.findMany({
      where: { QuestionId },
      orderBy: { PromptOrder: 'asc' },
    });
  }

  static async updateMany(
    QuestionId: number,
    items: { prompt_order: number; left_text: string }[]
  ) {
    const queries = items.map((i) =>
      prisma.matchingPrompt.updateMany({
        where: { QuestionId, PromptOrder: i.prompt_order },
        data: { LeftText: i.left_text },
      })
    );
    return prisma.$transaction(queries);
  }
}
export default MatchingPromptModel;
