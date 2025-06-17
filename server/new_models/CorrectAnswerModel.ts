import prisma from '../prismaClient';

export class CorrectAnswerModel {
  static findAll(quizId: number) {
    const query = `SELECT q.QuestionId, qmc.ChoiceText, qmc.ChoiceOrder as choice_id, qmc.IsCorrect as is_correct_choice,
      qgf.SequenceId, qgf.CorrectAnswer, qmp.CorrectAnswers, q.TypeId
      FROM Question q
      JOIN QuizQuestion qq ON qq.QuestionId = q.QuestionId
      JOIN QuestionInstruction qi ON q.InstructionId = qi.InstructionId
      LEFT JOIN QuestionMultipleChoice qmc ON q.QuestionId = qmc.QuestionId
      LEFT JOIN QuestionGapFilling qgf ON q.QuestionId = qgf.QuestionId
      LEFT JOIN QuestionMatchingPair qmp ON q.QuestionId = qmp.QuestionId
      WHERE qq.QuizId = ${quizId} AND q.IsActive = 1
      ORDER BY q.QuestionId, qmc.ChoiceOrder, qgf.SequenceId`;
    return prisma.$queryRawUnsafe(query);
  }
}
export default CorrectAnswerModel;
