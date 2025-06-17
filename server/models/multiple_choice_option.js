const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuestionMultipleChoice = sequelize.define('question_multiple_choice', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  choice_id: { type: DataTypes.INTEGER, primaryKey: true },
  choice_text: DataTypes.STRING,
  is_correct_choice: DataTypes.BOOLEAN
}, { tableName: 'question_multiple_choice', timestamps: false });

class MultipleChoiceOptionModel {
  constructor() {
    this.QuestionMultipleChoice = QuestionMultipleChoice;
  }

  async findMany(questionId) {
    try {
      const res = await this.QuestionMultipleChoice.findAll({
        where: { question_id: questionId },
        attributes: ['choice_id', 'choice_text', 'is_correct_choice'],
        order: [['choice_id', 'ASC']]
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addMany(items, questionId) {
    const records = items.map(i => ({
      question_id: questionId,
      choice_id: i.choice_id,
      choice_text: i.choice_text,
      is_correct_choice: i.is_correct_choice
    }));
    try {
      const res = await this.QuestionMultipleChoice.bulkCreate(records);
      return { error: null, response: { affectedRows: res.length } };
    } catch (error) {
      return { error };
    }
  }

  async saveMany(items, questionId) {
    try {
      const promises = items.map(({ choice_id, choice_text, is_correct_choice }) =>
        this.QuestionMultipleChoice.update(
          { choice_text, is_correct_choice },
          { where: { choice_id, question_id: questionId } }
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

module.exports = MultipleChoiceOptionModel;
