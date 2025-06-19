import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface PhrasalVerbGroupMap {
  VerbId: number;
  GroupId: number;
}

export class PhrasalVerbGroupMapModel {
  static create(data: Prisma.PhrasalVerbGroupMapCreateInput) {
    return prisma.phrasalVerbGroupMap.create({ data });
  }

  static findAll() {
    return prisma.phrasalVerbGroupMap.findMany();
  }
}
export default PhrasalVerbGroupMapModel;
