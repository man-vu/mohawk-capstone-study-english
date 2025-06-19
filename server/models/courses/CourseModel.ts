import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface Course {
  CourseId: number;
  Title: string;
  Description?: string | null;
  Level?: string | null;
  Category?: string | null;
  Duration?: string | null;
  Skills?: string | null;
  Features?: string | null;
  PriceCurrent?: number | null;
  PriceOriginal?: number | null;
  InstructorName?: string | null;
  InstructorAvatar?: string | null;
  InstructorRating?: number | null;
  InstructorExperience?: string | null;
  Students?: number | null;
  Rating?: number | null;
  ReviewCount?: number | null;
  Thumbnail?: string | null;
  IsPopular: boolean;
  IsBestseller: boolean;
  CreatedAt: Date;
}

export class CourseModel {
  static create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({ data });
  }

  static findById(CourseId: number) {
    return prisma.course.findUnique({ where: { CourseId } });
  }

  static update(CourseId: number, data: Prisma.CourseUpdateInput) {
    return prisma.course.update({ where: { CourseId }, data });
  }

  static delete(CourseId: number) {
    return prisma.course.delete({ where: { CourseId } });
  }

  static findAll() {
    return prisma.course.findMany();
  }
}
export default CourseModel;
