import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface PhrasalVerbGroup {
  GroupId: number;
  Theme: string;
  Description?: string | null;
}

export class PhrasalVerbGroupModel {
  static findAllWithVerbs() {
    return prisma.phrasalVerbGroup.findMany({
      include: {
        PhrasalVerbGroupMap: { include: { PhrasalVerb: true } },
      },
    });
  }
}
export default PhrasalVerbGroupModel;
