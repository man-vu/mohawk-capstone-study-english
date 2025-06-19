import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface WritingAssessment {
  AssessmentId: number;
  UserEssayAnswerId: number;
  TaskResponseScore?: number | null;
  CoherenceCohesionScore?: number | null;
  LexicalResourcesScore?: number | null;
  GrammaticalAccuracyScore?: number | null;
  OverallBand?: number | null;
  EstimatedIELTSScore?: number | null;
  CreatedAt: Date;
}

export class WritingAssessmentModel {
  static create(data: Prisma.WritingAssessmentCreateInput) {
    return prisma.writingAssessment.create({ data });
  }

  static findById(AssessmentId: number) {
    return prisma.writingAssessment.findUnique({ where: { AssessmentId } });
  }
}
export default WritingAssessmentModel;
