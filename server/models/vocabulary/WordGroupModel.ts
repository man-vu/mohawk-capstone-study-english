import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface WordGroup {
  GroupId: number;
  Theme: string;
  Description?: string | null;
}

export class WordGroupModel {
  static create(data: Prisma.WordGroupCreateInput) {
    return prisma.wordGroup.create({ data });
  }

  static findById(GroupId: number) {
    return prisma.wordGroup.findUnique({ where: { GroupId } });
  }

  static update(GroupId: number, data: Prisma.WordGroupUpdateInput) {
    return prisma.wordGroup.update({ where: { GroupId }, data });
  }

  static delete(GroupId: number) {
    return prisma.wordGroup.delete({ where: { GroupId } });
  }

  static findAll() {
    return prisma.wordGroup.findMany();
  }

  static findAllWithWords() {
    return prisma.wordGroup.findMany({
      include: {
        VocabularyWordGroup: { include: { VocabularyWord: true } },
      },
    });
  }
}
export default WordGroupModel;
