import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface IdiomGroupMap {
  IdiomId: number;
  GroupId: number;
}

export class IdiomGroupMapModel {
  static create(data: Prisma.IdiomGroupMapCreateInput) {
    return prisma.idiomGroupMap.create({ data });
  }

  static findAll() {
    return prisma.idiomGroupMap.findMany();
  }
}
export default IdiomGroupMapModel;
