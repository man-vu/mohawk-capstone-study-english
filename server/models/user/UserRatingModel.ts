import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface UserRating {
  UserId: number;
  QuizId: number;
  RatingGiven: number;
}

export class UserRatingModel {
  static create(data: Prisma.UserRatingCreateInput) {
    return prisma.userRating.create({ data });
  }

  static findById(UserId: number, QuizId: number) {
    return prisma.userRating.findUnique({ where: { UserId_QuizId: { UserId, QuizId } } });
  }

  static update(UserId: number, QuizId: number, data: Prisma.UserRatingUpdateInput) {
    return prisma.userRating.update({ where: { UserId_QuizId: { UserId, QuizId } }, data });
  }

  static delete(UserId: number, QuizId: number) {
    return prisma.userRating.delete({ where: { UserId_QuizId: { UserId, QuizId } } });
  }

  static findAll() {
    return prisma.userRating.findMany();
  }

  static deleteManyByQuiz(QuizId: number) {
    return prisma.userRating.deleteMany({ where: { QuizId } });
  }
}
export default UserRatingModel;
