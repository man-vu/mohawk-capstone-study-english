const { QueryTypes } = require('sequelize');
const sequelize = require('../config/orm');

class CorrectAnswerModel {
  constructor() {}

  async findAll(quizId) {
    try {
      const res = await sequelize.query(
        `SELECT q.question_id, qmc.choice_text, qmc.choice_id, qmc.is_correct_choice,
                qgf.sequence_id, qgf.correct_answer, qm.correct_answers, q.type_id
         FROM question q
         JOIN quiz_question qq ON qq.question_id = q.question_id
         JOIN question_instruction qi ON q.instruction_id = qi.instruction_id
         LEFT JOIN question_multiple_choice qmc ON q.question_id = qmc.question_id
         LEFT JOIN question_gap_filling qgf ON q.question_id = qgf.question_id
         LEFT JOIN question_matching qm ON q.question_id = qm.question_id
         WHERE qq.quiz_id = :quizId AND q.is_active = 1
         ORDER BY q.question_id, qmc.choice_id, qgf.sequence_id`,
        { replacements: { quizId }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = CorrectAnswerModel;
