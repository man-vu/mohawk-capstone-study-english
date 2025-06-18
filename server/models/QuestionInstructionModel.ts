import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface QuestionInstruction {
  InstructionId: number;
  Instruction: string;
}

export class QuestionInstructionModel {
  static create(data: Prisma.QuestionInstructionCreateInput) {
    return prisma.questionInstruction.create({ data });
  }

  static findByInstruction(Instruction: string) {
    return prisma.questionInstruction.findFirst({ where: { Instruction } });
  }

  static findById(InstructionId: number) {
    return prisma.questionInstruction.findUnique({ where: { InstructionId } });
  }

  static update(InstructionId: number, data: Prisma.QuestionInstructionUpdateInput) {
    return prisma.questionInstruction.update({ where: { InstructionId }, data });
  }

  static delete(InstructionId: number) {
    return prisma.questionInstruction.delete({ where: { InstructionId } });
  }

  static findAll() {
    return prisma.questionInstruction.findMany();
  }
}
export default QuestionInstructionModel;
