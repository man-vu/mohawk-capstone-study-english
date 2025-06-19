import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface PhrasalVerb {
  VerbId: number;
  Verb: string;
  Meaning: string;
  Example?: string | null;
  Difficulty?: string | null;
}

export class PhrasalVerbModel {
  static create(data: Prisma.PhrasalVerbCreateInput) {
    return prisma.phrasalVerb.create({ data });
  }

  static findAll() {
    return prisma.phrasalVerb.findMany();
  }
}
export default PhrasalVerbModel;
