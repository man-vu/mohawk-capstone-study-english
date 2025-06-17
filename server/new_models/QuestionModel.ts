import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface Question {
  QuestionId: number;
  TypeId: number;
  InstructionId: number;
  IsActive: boolean;
  ParagraphTitle: string;
  QuestionText: string;
  CreatedAt: Date;
}

export class QuestionModel {
  static create(data: Prisma.QuestionCreateInput) {
    return prisma.question.create({ data });
  }

  static findById(QuestionId: number) {
    return prisma.question.findUnique({ where: { QuestionId } });
  }

  static update(QuestionId: number, data: Prisma.QuestionUpdateInput) {
    return prisma.question.update({ where: { QuestionId }, data });
  }

  static delete(QuestionId: number) {
    return prisma.question.delete({ where: { QuestionId } });
  }

  static findAll() {
    return prisma.question.findMany();
  }
}
export default QuestionModel;
