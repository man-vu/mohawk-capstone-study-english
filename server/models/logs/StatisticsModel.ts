import prisma from '../../prismaClient';

export interface DateRange {
  quizId?: number;
  userId?: number;
  dateFrom: string;
  dateTo: string;
}

export class StatisticsModel {
  static async findQuizOne(userId: number) {
    const number_of_quizzes = await prisma.quiz.count();
    const incomplete = await prisma.userAttempt.count({ where: { UserId: userId, EndTime: null } });
    const attempted = await prisma.userAttempt.findMany({
      where: { UserId: userId },
      distinct: ['QuizId'],
      select: { QuizId: true },
    });
    const unattempted = number_of_quizzes - attempted.length;
    return { number_of_quizzes, incomplete, unattempted };
  }

  static async findAnswerOne(userId: number) {
    const correct = await prisma.userAnswer.count({
      where: { IsCorrect: true, UserAttempt: { UserId: userId } },
    });
    const incorrect = await prisma.userAnswer.count({
      where: { IsCorrect: false, UserAttempt: { UserId: userId } },
    });
    const unanswered = await prisma.userAnswer.count({
      where: { IsCorrect: null, UserAttempt: { UserId: userId } },
    });
    return { correct, partially_correct: 0, incorrect, unanswered };
  }

  static async findBoardStatisticsByQuiz({ quizId, dateFrom, dateTo }: DateRange) {
    const attempts = await prisma.userAttempt.findMany({
      where: {
        QuizId: quizId!,
        EndTime: { not: null, gte: new Date(dateFrom), lte: new Date(dateTo) },
      },
      include: { AppUser: { select: { FirstName: true, LastName: true } } },
      orderBy: { Grade: 'desc' },
    });

    return attempts.map((a) => ({
      end_time: a.EndTime!,
      grade: Number(a.Grade ?? 0),
      full_name: `${a.AppUser.FirstName ?? ''} ${a.AppUser.LastName ?? ''}`.trim(),
    }));
  }

  static async findBoardStatisticsByAnswerQuality({ userId, dateFrom, dateTo }: DateRange) {
    const correct = await prisma.userAnswer.count({
      where: {
        IsCorrect: true,
        UserAttempt: { UserId: userId!, EndTime: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
      },
    });
    const incorrect = await prisma.userAnswer.count({
      where: {
        IsCorrect: false,
        UserAttempt: { UserId: userId!, EndTime: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
      },
    });
    const unanswered = await prisma.userAnswer.count({
      where: {
        IsCorrect: null,
        UserAttempt: { UserId: userId!, EndTime: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
      },
    });
    return { correct, partially_correct: 0, incorrect, unanswered };
  }

  static async findBoardStatisticsByQuizCompleted({ userId, dateFrom, dateTo }: DateRange) {
    const number_of_quizzes = await prisma.quiz.count();
    const incomplete = await prisma.userAttempt.count({ where: { UserId: userId!, EndTime: null } });
    const attempted = await prisma.userAttempt.findMany({
      where: {
        UserId: userId!,
        EndTime: { gte: new Date(dateFrom), lte: new Date(dateTo) },
      },
      distinct: ['QuizId'],
      select: { QuizId: true },
    });
    const unattempted = number_of_quizzes - attempted.length;
    return { number_of_quizzes, incomplete, unattempted };
  }
}
export default StatisticsModel;
