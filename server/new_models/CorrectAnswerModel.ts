import prisma from '../prismaClient';

export class CorrectAnswerModel {
  static findAll(quizId: number) {
    const query = `SELECT q.QuestionId, qmc.ChoiceText, qmc.ChoiceOrder as choice_id,
      qmc.IsCorrect as is_correct_choice, qgf.SequenceId, qgf.CorrectAnswer,
      mp.PromptOrder as prompt_order, mc.ChoiceOrder as choice_order,
      CASE WHEN ma.ChoiceId IS NULL THEN 0 ELSE 1 END as is_correct,
      q.TypeId
      FROM Question q
      JOIN QuizQuestion qq ON qq.QuestionId = q.QuestionId
      LEFT JOIN QuestionMultipleChoice qmc ON q.QuestionId = qmc.QuestionId
      LEFT JOIN QuestionGapFilling qgf ON q.QuestionId = qgf.QuestionId
      LEFT JOIN MatchingPrompt mp ON q.QuestionId = mp.QuestionId
      LEFT JOIN MatchingAnswer ma ON mp.PromptId = ma.PromptId
      LEFT JOIN MatchingChoice mc ON ma.ChoiceId = mc.ChoiceId
      WHERE qq.QuizId = ${quizId} AND q.IsActive = 1
      ORDER BY q.QuestionId, qmc.ChoiceOrder, qgf.SequenceId, mp.PromptOrder, mc.ChoiceOrder`;
    return prisma.$queryRawUnsafe(query);
  }
}
export default CorrectAnswerModel;
