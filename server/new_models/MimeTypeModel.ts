import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface MimeType {
  MimeId: number;
  ImageUrl: string;
  ImageAlt: string;
}

export class MimeTypeModel {
  static create(data: Prisma.MimeTypeCreateInput) {
    return prisma.mimeType.create({ data });
  }

  static findById(MimeId: number) {
    return prisma.mimeType.findUnique({ where: { MimeId } });
  }

  static update(MimeId: number, data: Prisma.MimeTypeUpdateInput) {
    return prisma.mimeType.update({ where: { MimeId }, data });
  }

  static delete(MimeId: number) {
    return prisma.mimeType.delete({ where: { MimeId } });
  }

  static findAll() {
    return prisma.mimeType.findMany();
  }
}
export default MimeTypeModel;
