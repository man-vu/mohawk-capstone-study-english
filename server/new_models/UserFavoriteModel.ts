import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface UserFavorite {
  UserId: number;
  QuizId: number;
}

export class UserFavoriteModel {
  static create(data: Prisma.UserFavoriteCreateInput) {
    return prisma.userFavorite.create({ data });
  }

  static findById(UserId: number, QuizId: number) {
    return prisma.userFavorite.findUnique({ where: { UserId_QuizId: { UserId, QuizId } } });
  }

  static update(UserId: number, QuizId: number, data: Prisma.UserFavoriteUpdateInput) {
    return prisma.userFavorite.update({ where: { UserId_QuizId: { UserId, QuizId } }, data });
  }

  static delete(UserId: number, QuizId: number) {
    return prisma.userFavorite.delete({ where: { UserId_QuizId: { UserId, QuizId } } });
  }

  static findAll() {
    return prisma.userFavorite.findMany();
  }
}
export default UserFavoriteModel;
