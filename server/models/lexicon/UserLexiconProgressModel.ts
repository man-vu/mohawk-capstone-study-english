import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';

export interface UserLexiconProgress {
  UserId: number;
  LexiconId: number;
  Mastery: number;
  LastReviewed?: Date | null;
  CorrectStreak: number;
  Attempts: number;
  Memorized: boolean;
}

export class UserLexiconProgressModel {
  static create(data: Prisma.UserLexiconProgressCreateInput) {
    return prisma.userLexiconProgress.create({ data });
  }

  static upsert(UserId: number, LexiconId: number, data: Prisma.UserLexiconProgressUpsertArgs['create']) {
    return prisma.userLexiconProgress.upsert({
      where: { UserId_LexiconId: { UserId, LexiconId } },
      create: data,
      update: data,
    });
  }

  static findByUser(UserId: number) {
    return prisma.userLexiconProgress.findMany({ where: { UserId } });
  }
}
export default UserLexiconProgressModel;
