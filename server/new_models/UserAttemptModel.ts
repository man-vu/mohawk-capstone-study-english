import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface UserAttempt {
  AttemptId: number;
  UserId: number;
  QuizId: number;
  StartTime: Date;
  EndTime?: Date;
  RemainingTime?: number;
  Grade?: number;
}

export class UserAttemptModel {
  static create(data: Prisma.UserAttemptCreateInput) {
    return prisma.userAttempt.create({ data });
  }

  static findById(AttemptId: number) {
    return prisma.userAttempt.findUnique({ where: { AttemptId } });
  }

  static update(AttemptId: number, data: Prisma.UserAttemptUpdateInput) {
    return prisma.userAttempt.update({ where: { AttemptId }, data });
  }

  static delete(AttemptId: number) {
    return prisma.userAttempt.delete({ where: { AttemptId } });
  }

  static findAll() {
    return prisma.userAttempt.findMany();
  }

  static findIncompleteAttemptsByQuizId(QuizId: number) {
    return prisma.userAttempt.findMany({
      where: { QuizId, EndTime: null },
      select: { AttemptId: true, UserId: true },
    });
  }

  static findLatest(QuizId: number, UserId: number) {
    return prisma.userAttempt.findFirst({
      where: { QuizId, UserId },
      orderBy: { AttemptId: 'desc' },
    });
  }

  static findIncompleteAttempt(QuizId: number, UserId: number, AttemptId: number) {
    return prisma.userAttempt.findFirst({
      where: { QuizId, UserId, AttemptId, EndTime: null },
      include: { Quiz: { select: { TimeAllowed: true } } },
    });
  }

  static findOne(QuizId: number, UserId: number, AttemptId: number) {
    return prisma.userAttempt.findFirst({ where: { QuizId, UserId, AttemptId } });
  }

  static closeOne(AttemptId: number, data: Prisma.UserAttemptUpdateInput) {
    return prisma.userAttempt.update({ where: { AttemptId }, data });
  }

  static async findManyIncompleteAttempts(UserId: number) {
    const attempts = await prisma.userAttempt.findMany({
      where: { UserId, EndTime: null },
      include: {
        Quiz: { select: { TimeAllowed: true } },
        UserAnswer: true,
      },
      orderBy: [{ QuizId: 'asc' }, { AttemptId: 'asc' }],
    });

    return attempts.map((a) => {
      const total = a.UserAnswer.length;
      const unanswered = a.UserAnswer.filter((ans) => !ans.AnswerText).length;
      return {
        attempt_id: a.AttemptId,
        user_id: a.UserId,
        quiz_id: a.QuizId,
        start_time: a.StartTime,
        time_allowed: a.Quiz.TimeAllowed,
        total_questions: total,
        unanswered,
        answered: total - unanswered,
      };
    });
  }
}
export default UserAttemptModel;
