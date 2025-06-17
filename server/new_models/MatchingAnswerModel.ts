import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface MatchingAnswer {
  PromptId: number;
  ChoiceId: number;
}

export class MatchingAnswerModel {
  static create(data: Prisma.MatchingAnswerCreateInput) {
    return prisma.matchingAnswer.create({ data });
  }

  static createMany(data: Prisma.MatchingAnswerCreateManyInput[]) {
    return prisma.matchingAnswer.createMany({ data });
  }

  static delete(PromptId: number, ChoiceId: number) {
    return prisma.matchingAnswer.delete({ where: { PromptId_ChoiceId: { PromptId, ChoiceId } } });
  }

  static findAll() {
    return prisma.matchingAnswer.findMany();
  }

  static findManyByQuestion(QuestionId: number) {
    return prisma.matchingAnswer.findMany({
      where: { MatchingPrompt: { QuestionId } },
      include: { MatchingPrompt: true, MatchingChoice: true },
    });
  }
}
export default MatchingAnswerModel;
