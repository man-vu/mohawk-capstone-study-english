import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface QuizSkill {
  SkillId?: number;
  SkillDescription: string;
}

export class QuizSkillModel {
  static create(data: Prisma.QuizSkillCreateInput) {
    return prisma.quizSkill.create({ data });
  }

  static findById(SkillId: number) {
    return prisma.quizSkill.findUnique({ where: { SkillId } });
  }

  static update(SkillId: number, data: Prisma.QuizSkillUpdateInput) {
    return prisma.quizSkill.update({ where: { SkillId }, data });
  }

  static delete(SkillId: number) {
    return prisma.quizSkill.delete({ where: { SkillId } });
  }

  static findAll() {
    return prisma.quizSkill.findMany();
  }
}
export default QuizSkillModel;
