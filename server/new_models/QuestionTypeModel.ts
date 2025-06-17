import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface QuestionType {
  TypeId: number;
  TypeName: string;
}

export class QuestionTypeModel {
  static create(data: Prisma.QuestionTypeCreateInput) {
    return prisma.questionType.create({ data });
  }

  static findById(TypeId: number) {
    return prisma.questionType.findUnique({ where: { TypeId } });
  }

  static update(TypeId: number, data: Prisma.QuestionTypeUpdateInput) {
    return prisma.questionType.update({ where: { TypeId }, data });
  }

  static delete(TypeId: number) {
    return prisma.questionType.delete({ where: { TypeId } });
  }

  static findAll() {
    return prisma.questionType.findMany();
  }
}
export default QuestionTypeModel;
