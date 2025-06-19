import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface Lexicon {
  LexiconId: number;
  Word: string;
  Definition: string;
  Example?: string | null;
  PartOfSpeech?: string | null;
  Level?: string | null;
  Category?: string | null;
  Difficulty?: string | null;
  TypeId: number;
  LexiconType: {
    TypeId: number;
    TypeName: string;
  };
}

export class LexiconModel {
  static create(data: Prisma.LexiconCreateInput) {
    return prisma.lexicon.create({ data });
  }

  static findById(LexiconId: number) {
    return prisma.lexicon.findUnique({ where: { LexiconId } });
  }

  static update(LexiconId: number, data: Prisma.LexiconUpdateInput) {
    return prisma.lexicon.update({ where: { LexiconId }, data });
  }

  static delete(LexiconId: number) {
    return prisma.lexicon.delete({ where: { LexiconId } });
  }

  static findAll(type?: string) {
    return prisma.lexicon.findMany({
      include: { LexiconType: true },
      where: type
        ? { LexiconType: { TypeName: { equals: type, mode: 'insensitive' } } }
        : {},
    });
  }
}
export default LexiconModel;
