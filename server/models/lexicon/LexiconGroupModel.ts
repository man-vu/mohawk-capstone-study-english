import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface LexiconGroup {
  GroupId: number;
  Theme: string;
  Description?: string | null;
}

export class LexiconGroupModel {
  static create(data: Prisma.LexiconGroupCreateInput) {
    return prisma.lexiconGroup.create({ data });
  }

  static findById(GroupId: number) {
    return prisma.lexiconGroup.findUnique({ where: { GroupId } });
  }

  static update(GroupId: number, data: Prisma.LexiconGroupUpdateInput) {
    return prisma.lexiconGroup.update({ where: { GroupId }, data });
  }

  static delete(GroupId: number) {
    return prisma.lexiconGroup.delete({ where: { GroupId } });
  }

  static findAllWithWords(type?: string) {
    return prisma.lexiconGroup.findMany({
      include: {
        LexiconGroupMap: {
          include: { Lexicon: { include: { LexiconType: true } } },
          where: type
            ? { Lexicon: { LexiconType: { TypeName: { equals: type, mode: 'insensitive' } } } }
            : undefined,
        },
      },
    });
  }
}
export default LexiconGroupModel;
