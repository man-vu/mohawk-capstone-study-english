import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface IdiomGroup {
  GroupId: number;
  Theme: string;
  Description?: string | null;
}

export class IdiomGroupModel {
  static findAllWithIdioms() {
    return prisma.idiomGroup.findMany({
      include: {
        IdiomGroupMap: { include: { Idiom: true } },
      },
    });
  }
}
export default IdiomGroupModel;
