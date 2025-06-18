import prisma from '../prismaClient';

export class CorrectAnswerModel {
  static findMultipleChoice(quizId: number) {
    const query = `SELECT q.QuestionId as question_id,
      qmc.ChoiceOrder as choice_id,
      qmc.IsCorrect as is_correct_choice
      FROM Question q
      JOIN QuizQuestion qq ON qq.QuestionId = q.QuestionId
      JOIN QuestionMultipleChoice qmc ON q.QuestionId = qmc.QuestionId
      WHERE qq.QuizId = ${quizId} AND q.IsActive = 1 AND q.TypeId = 1
      ORDER BY q.QuestionId, qmc.ChoiceOrder`;
    return prisma.$queryRawUnsafe(query);
  }

  static findGapFilling(quizId: number) {
    const query = `SELECT q.QuestionId as question_id,
      qgf.SequenceId as sequence_id,
      qgf.CorrectAnswer as correct_answer
      FROM Question q
      JOIN QuizQuestion qq ON qq.QuestionId = q.QuestionId
      JOIN QuestionGapFilling qgf ON q.QuestionId = qgf.QuestionId
      WHERE qq.QuizId = ${quizId} AND q.IsActive = 1 AND q.TypeId = 2
      ORDER BY q.QuestionId, qgf.SequenceId`;
    return prisma.$queryRawUnsafe(query);
  }

  static findMatchingPairs(quizId: number) {
    const query = `SELECT q.QuestionId as question_id,
      mp.PromptOrder as prompt_order,
      mc.ChoiceOrder as choice_order
      FROM Question q
      JOIN QuizQuestion qq ON qq.QuestionId = q.QuestionId
      JOIN MatchingPrompt mp ON q.QuestionId = mp.QuestionId
      JOIN MatchingAnswer ma ON mp.PromptId = ma.PromptId
      JOIN MatchingChoice mc ON ma.ChoiceId = mc.ChoiceId
      WHERE qq.QuizId = ${quizId} AND q.IsActive = 1 AND q.TypeId = 3
      ORDER BY q.QuestionId, mp.PromptOrder, mc.ChoiceOrder`;
    return prisma.$queryRawUnsafe(query);
  }
}
export default CorrectAnswerModel;
