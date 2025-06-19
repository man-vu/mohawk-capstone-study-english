import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface VocabularyWord {
  WordId: number;
  Word: string;
  Definition: string;
  Example?: string | null;
  PartOfSpeech?: string | null;
  Level?: string | null;
  Category?: string | null;
  Difficulty?: string | null;
}

export class VocabularyWordModel {
  static create(data: Prisma.VocabularyWordCreateInput) {
    return prisma.vocabularyWord.create({ data });
  }

  static findById(WordId: number) {
    return prisma.vocabularyWord.findUnique({ where: { WordId } });
  }

  static update(WordId: number, data: Prisma.VocabularyWordUpdateInput) {
    return prisma.vocabularyWord.update({ where: { WordId }, data });
  }

  static delete(WordId: number) {
    return prisma.vocabularyWord.delete({ where: { WordId } });
  }

  static findAll() {
    return prisma.vocabularyWord.findMany();
  }
}
export default VocabularyWordModel;
