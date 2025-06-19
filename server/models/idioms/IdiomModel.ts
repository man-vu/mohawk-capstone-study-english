import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface Idiom {
  IdiomId: number;
  Expression: string;
  Meaning: string;
  Example?: string | null;
  Difficulty?: string | null;
}

export class IdiomModel {
  static create(data: Prisma.IdiomCreateInput) {
    return prisma.idiom.create({ data });
  }

  static findAll() {
    return prisma.idiom.findMany();
  }
}
export default IdiomModel;
