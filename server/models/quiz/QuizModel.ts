import prisma from '../../prismaClient';
import type { Prisma } from '@prisma/client';
export interface Quiz {
  QuizId: number;
  Title: string;
  SkillId?: number;
  Description?: string;
  IsActive: boolean;
  TimeAllowed: number;
  CreatedBy: number;
  CreatedAt: Date;
}

export class QuizModel {
  static create(data: Prisma.QuizCreateInput) {
    return prisma.quiz.create({ data });
  }

  static findById(QuizId: number) {
    return prisma.quiz.findUnique({ where: { QuizId } });
  }

  static update(QuizId: number, data: Prisma.QuizUpdateInput) {
    return prisma.quiz.update({ where: { QuizId }, data });
  }

  static delete(QuizId: number) {
    return prisma.quiz.delete({ where: { QuizId } });
  }

  static findAll() {
    return prisma.quiz.findMany();
  }

  static async findAllForTeacher() {
    const quizzes = await prisma.quiz.findMany({
      include: { QuizSkill: true },
      orderBy: { QuizId: 'asc' },
    });

    const result = [] as any[];
    for (const q of quizzes) {
      const attempts = await prisma.userAttempt.count({ where: { QuizId: q.QuizId } });
      const numberOfQuestions = await prisma.quizQuestion.count({ where: { QuizId: q.QuizId } });
      const ratingAgg = await prisma.userRating.aggregate({
        where: { QuizId: q.QuizId },
        _avg: { RatingGiven: true },
        _count: { RatingGiven: true },
      });

      result.push({
        quiz_id: q.QuizId,
        title: q.Title,
        skill_id: q.SkillId,
        description: q.Description,
        is_active: q.IsActive,
        time_allowed: q.TimeAllowed,
        created_by: q.CreatedBy,
        created_at: q.CreatedAt,
        skill_description: q.QuizSkill?.SkillDescription,
        attempts,
        number_of_questions: numberOfQuestions,
        average_rating: ratingAgg._avg.RatingGiven ?? 0,
        rating_count: ratingAgg._count.RatingGiven ?? 0,
      });
    }
    return result;
  }

  static async findDetailed(QuizId: number) {
    const q = await prisma.quiz.findUnique({
      where: { QuizId },
      include: { QuizSkill: true },
    });
    if (!q) return null;
    const attempts = await prisma.userAttempt.count({ where: { QuizId } });
    const numberOfQuestions = await prisma.quizQuestion.count({ where: { QuizId } });
    const ratingAgg = await prisma.userRating.aggregate({
      where: { QuizId },
      _avg: { RatingGiven: true },
      _count: { RatingGiven: true },
    });
    return {
      quiz_id: q.QuizId,
      title: q.Title,
      skill_id: q.SkillId,
      description: q.Description,
      is_active: q.IsActive,
      time_allowed: q.TimeAllowed,
      created_by: q.CreatedBy,
      created_at: q.CreatedAt,
      skill_description: q.QuizSkill?.SkillDescription,
      attempts,
      number_of_questions: numberOfQuestions,
      average_rating: ratingAgg._avg.RatingGiven ?? 0,
      rating_count: ratingAgg._count.RatingGiven ?? 0,
    };
  }

  static async getHomeSummary(userId?: number) {
    const quizzes = await prisma.quiz.findMany({
      where: { IsActive: true },
      include: { QuizSkill: true },
      orderBy: { QuizId: 'asc' },
    });

    const result = [] as any[];

    for (const q of quizzes) {
      const attempts = await prisma.userAttempt.count({ where: { QuizId: q.QuizId } });
      const numberOfQuestions = await prisma.quizQuestion.count({ where: { QuizId: q.QuizId } });

      const ratingAgg = await prisma.userRating.aggregate({
        where: { QuizId: q.QuizId },
        _avg: { RatingGiven: true },
        _count: { RatingGiven: true },
      });

      let rating_given = 0;
      let favorite = 0;

      if (userId) {
        const userRating = await prisma.userRating.findUnique({
          where: { UserId_QuizId: { UserId: userId, QuizId: q.QuizId } },
        });
        rating_given = userRating?.RatingGiven ?? 0;
        favorite = await prisma.userFavorite.count({ where: { UserId: userId, QuizId: q.QuizId } });
      }

      result.push({
        quiz_id: q.QuizId,
        title: q.Title,
        skill_id: q.SkillId,
        description: q.Description,
        is_active: q.IsActive,
        time_allowed: q.TimeAllowed,
        created_by: q.CreatedBy,
        created_at: q.CreatedAt,
        skill_description: q.QuizSkill?.SkillDescription,
        attempts,
        number_of_questions: numberOfQuestions,
        average_rating: ratingAgg._avg.RatingGiven ?? 0,
        rating_count: ratingAgg._count.RatingGiven ?? 0,
        rating_given,
        favorite,
      });
    }

    return result;
  }
}
export default QuizModel;
