const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuestionGapFilling = sequelize.define('question_gap_filling', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  sequence_id: { type: DataTypes.INTEGER, primaryKey: true },
  correct_answer: DataTypes.STRING
}, { tableName: 'question_gap_filling', timestamps: false });

class GapFillingOptionModel {
  constructor() {
    this.QuestionGapFilling = QuestionGapFilling;
  }

  async findMany(questionId) {
    try {
      const res = await this.QuestionGapFilling.findAll({
        where: { question_id: questionId },
        attributes: ['sequence_id', 'correct_answer'],
        order: [['sequence_id', 'ASC']]
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addMany(items, questionId) {
    const records = items.map(i => ({
      question_id: questionId,
      sequence_id: i.sequence_id,
      correct_answer: i.correct_answer
    }));
    try {
      const res = await this.QuestionGapFilling.bulkCreate(records);
      return { error: null, response: { affectedRows: res.length } };
    } catch (error) {
      return { error };
    }
  }

  async saveMany(items, questionId) {
    try {
      const promises = items.map(({ sequence_id, correct_answer }) =>
        this.QuestionGapFilling.update(
          { correct_answer },
          { where: { sequence_id, question_id: questionId } }
        )
      );
      const results = await Promise.all(promises);
      const affectedRows = results.reduce((a, [c]) => a + c, 0);
      return { error: null, response: { affectedRows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = GapFillingOptionModel;
