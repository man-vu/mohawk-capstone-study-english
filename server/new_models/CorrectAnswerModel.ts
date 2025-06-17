import prisma from '../prismaClient';

export class CorrectAnswerModel {
  static findAll(quizId: number) {
    const query = `SELECT q.question_id, qmc.choice_text, qmc.choice_order as choice_id, qmc.is_correct as is_correct_choice,
      qgf.sequence_id, qgf.correct_answer, qmp.correct_answers, q.type_id
      FROM question q
      JOIN quiz_question qq ON qq.question_id = q.question_id
      JOIN question_instruction qi ON q.instruction_id = qi.instruction_id
      LEFT JOIN question_multiple_choice qmc ON q.question_id =  qmc.question_id
      LEFT JOIN question_gap_filling qgf ON q.question_id = qgf.question_id
      LEFT JOIN question_matching qmp ON q.question_id = qmp.question_id
      WHERE qq.quiz_id = ${quizId} AND q.is_active = 1
      ORDER BY q.question_id, qmc.choice_order, qgf.sequence_id`;
    return prisma.$queryRawUnsafe(query);
  }
}
export default CorrectAnswerModel;
