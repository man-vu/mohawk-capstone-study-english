import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';

export interface VocabularyWordGroup {
  WordId: number;
  GroupId: number;
}

export class VocabularyWordGroupModel {
  static create(data: Prisma.VocabularyWordGroupCreateInput) {
    return prisma.vocabularyWordGroup.create({ data });
  }

  static delete(WordId: number, GroupId: number) {
    return prisma.vocabularyWordGroup.delete({ where: { WordId_GroupId: { WordId, GroupId } } });
  }

  static findAll() {
    return prisma.vocabularyWordGroup.findMany();
  }
}
export default VocabularyWordGroupModel;
