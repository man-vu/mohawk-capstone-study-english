import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';

export interface MockTestSection {
  SectionId: number;
  MockTestId: number;
  QuizId?: number | null;
  SkillId: number;
  Duration: number;
  TotalQuestions: number;
  SortOrder: number;
}

export class MockTestSectionModel {
  static create(data: Prisma.MockTestSectionCreateInput) {
    return prisma.mockTestSection.create({ data });
  }

  static findByMockTest(MockTestId: number) {
    return prisma.mockTestSection.findMany({ where: { MockTestId } });
  }
}
export default MockTestSectionModel;
