import prisma from '../../prismaClient';
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

  static findIncompleteAttemptsByQuizId(QuizId: number | string) {
    const qId = Number(QuizId);
    return prisma.userAttempt.findMany({
      where: { QuizId: qId, EndTime: null },
      select: { AttemptId: true, UserId: true },
    });
  }

  static findLatest(QuizId: number | string, UserId: number | string) {
    const qId = Number(QuizId);
    const uId = Number(UserId);
    return prisma.userAttempt.findFirst({
      where: { QuizId: qId, UserId: uId },
      orderBy: { AttemptId: 'desc' },
    });
  }

  static findIncompleteAttempt(
    QuizId: number | string,
    UserId: number | string,
    AttemptId: number | string
  ) {
    const qId = Number(QuizId);
    const uId = Number(UserId);
    const aId = Number(AttemptId);
    return prisma.userAttempt.findFirst({
      where: { QuizId: qId, UserId: uId, AttemptId: aId, EndTime: null },
      include: { Quiz: { select: { TimeAllowed: true } } },
    });
  }

  static async findAllIncompleteAttempts() {
    const attempts = await prisma.userAttempt.findMany({
      where: { EndTime: null },
      include: { Quiz: { select: { TimeAllowed: true } } },
      orderBy: { StartTime: 'asc' },
    });

    return attempts.map((a) => ({
      attempt_id: a.AttemptId,
      user_id: a.UserId,
      quiz_id: a.QuizId,
      start_time: a.StartTime,
      time_allowed: a.Quiz.TimeAllowed,
    }));
  }

  static findOne(
    QuizId: number | string,
    UserId: number | string,
    AttemptId: number | string
  ) {
    const qId = Number(QuizId);
    const uId = Number(UserId);
    const aId = Number(AttemptId);
    return prisma.userAttempt.findFirst({ where: { QuizId: qId, UserId: uId, AttemptId: aId } });
  }

  static closeOne(AttemptId: number, data: Prisma.UserAttemptUpdateInput) {
    return prisma.userAttempt.update({ where: { AttemptId }, data });
  }

  static async findManyIncompleteAttempts(UserId: number | string) {
    const uId = Number(UserId);
    const attempts = await prisma.userAttempt.findMany({
      where: { UserId: uId, EndTime: null },
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
