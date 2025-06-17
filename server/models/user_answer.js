const { DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/orm');

const UserAnswerQuestion = sequelize.define('user_answer_question', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true },
  attempt_id: { type: DataTypes.INTEGER, primaryKey: true },
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  answer_text: DataTypes.STRING,
  is_correct: DataTypes.INTEGER
}, { tableName: 'user_answer_question', timestamps: false });


class UserAnswerModel {
  constructor() {
    this.UserAnswerQuestion = UserAnswerQuestion;
  }

  async findAll({ quizId, userId, attemptId }) {
    try {
      const res = await sequelize.query(
        `SELECT ua.*, q.type_id
         FROM user_answer_question ua JOIN question q ON q.question_id = ua.question_id
         WHERE ua.quiz_id = :quizId AND ua.user_id = :userId AND ua.attempt_id = :attemptId AND q.is_active = 1
         ORDER BY ua.question_id ASC`,
        { replacements: { quizId, userId, attemptId }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findAllAssociatedWithLatestAttempts({ userId }) {
    try {
      const res = await sequelize.query(
        `SELECT * FROM user_answer_question uaq INNER JOIN
          (SELECT quiz_id, MAX(attempt_id) as latest_attempt_id FROM user_attempt WHERE user_id = :userId GROUP BY quiz_id) ua
          ON uaq.quiz_id = ua.quiz_id AND uaq.attempt_id = ua.latest_attempt_id
        WHERE uaq.user_id = :userId`,
        { replacements: { userId }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async closeOne({ quizId, userId, attemptId, grade }) {
    try {
      const [rows] = await this.UserAnswerQuestion.update(
        { is_correct: grade },
        { where: { quiz_id: quizId, user_id: userId, attempt_id: attemptId } }
      );
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async markOne(items) {
    try {
      const promises = items.map(({ quizId, userId, attemptId, questionId, markedResult }) =>
        this.UserAnswerQuestion.update(
          { is_correct: markedResult },
          { where: { quiz_id: quizId, user_id: userId, attempt_id: attemptId, question_id: questionId } }
        )
      );
      const results = await Promise.all(promises);
      const affectedRows = results.reduce((sum, [rows]) => sum + rows, 0);
      return { error: null, response: { affectedRows } };
    } catch (error) {
      return { error };
    }
  }

  async saveOne({ quizId, userId, attemptId, questionId, answerText }) {
    try {
      const [rows] = await this.UserAnswerQuestion.update(
        { answer_text: answerText },
        { where: { quiz_id: quizId, user_id: userId, attempt_id: attemptId, question_id: questionId } }
      );
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = UserAnswerModel;
