import prisma from "../../prismaClient";
import type { Prisma } from "@prisma/client";

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

  static async findAllWithWords(type?: string, limit?: number) {
    // Fetch groups first with the total count of words in each group
    const groups = await prisma.lexiconGroup.findMany({
      take: limit,
      include: {
        _count: {
          select: { LexiconGroupMap: true },
        },
      },
    });

    // For each group, fetch a subset of lexicons and their mappings
    const groupsWithWords = await Promise.all(
      groups.map(async (g) => {
        const maps = await prisma.lexiconGroupMap.findMany({
          take: 100,
          where: {
            GroupId: g.GroupId,
            ...(type
              ? { Lexicon: { LexiconType: { TypeName: { equals: type } } } }
              : {}),
          },
          include: {
            Lexicon: { include: { LexiconType: true } },
          },
        });
        return { ...g, LexiconGroupMap: maps };
      })
    );

    return groupsWithWords;
  }
}
export default LexiconGroupModel;
