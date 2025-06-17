const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuizQuestion = sequelize.define('quiz_question', {
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true },
  question_id: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'quiz_question', timestamps: false });

class QuizQuestionModel {
  constructor() {
    this.QuizQuestion = QuizQuestion;
  }

  async addOne(quizId, questionId) {
    try {
      const res = await this.QuizQuestion.create({ quiz_id: quizId, question_id: questionId });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async findOne(quizId, questionId) {
    try {
      const res = await this.QuizQuestion.findOne({ where: { quiz_id: quizId, question_id: questionId } });
      return { error: null, response: res ? [res.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = QuizQuestionModel;
