import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';

export interface UserVocabularyProgress {
  UserId: number;
  WordId: number;
  Mastery: number;
  LastReviewed?: Date | null;
  CorrectStreak: number;
  Attempts: number;
  Memorized: boolean;
}

export class UserVocabularyProgressModel {
  static create(data: Prisma.UserVocabularyProgressCreateInput) {
    return prisma.userVocabularyProgress.create({ data });
  }

  static upsert(UserId: number, WordId: number, data: Prisma.UserVocabularyProgressUpsertArgs['create']) {
    return prisma.userVocabularyProgress.upsert({
      where: { UserId_WordId: { UserId, WordId } },
      create: data,
      update: data,
    });
  }

  static findByUser(UserId: number) {
    return prisma.userVocabularyProgress.findMany({ where: { UserId } });
  }
}
export default UserVocabularyProgressModel;
