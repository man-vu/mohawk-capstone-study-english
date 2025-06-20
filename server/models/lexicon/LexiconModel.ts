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
      where: type ? { LexiconType: { TypeName: { equals: type } } } : {},
    });
  }

  static async findRandom(limit: number, type?: string) {
    const typeFilter = type ? `WHERE lt.TypeName = '${type}'` : '';
    const query = `SELECT TOP (${limit}) l.*, lt.TypeName
      FROM Lexicon l
      JOIN LexiconType lt ON l.TypeId = lt.TypeId
      ${typeFilter}
      ORDER BY NEWID()`;
    const rows: any[] = await prisma.$queryRawUnsafe(query);
    return rows.map((r) => ({
      ...r,
      LexiconType: { TypeId: r.TypeId, TypeName: r.TypeName },
    }));
  }

  static async findRandomWithSynAnt(limit: number) {
    const query = `SELECT TOP (${limit}) l.*, lt.TypeName
      FROM Lexicon l
      JOIN LexiconType lt ON l.TypeId = lt.TypeId
      WHERE (l.Synonyms IS NOT NULL AND LTRIM(RTRIM(l.Synonyms)) <> '')
        AND (l.Antonyms IS NOT NULL AND LTRIM(RTRIM(l.Antonyms)) <> '')
      ORDER BY NEWID()`;
    const rows: any[] = await prisma.$queryRawUnsafe(query);
    return rows.map((r) => ({
      ...r,
      LexiconType: { TypeId: r.TypeId, TypeName: r.TypeName },
    }));
  }
}
export default LexiconModel;
