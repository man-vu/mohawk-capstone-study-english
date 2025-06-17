const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuestionMatching = sequelize.define('question_matching', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  correct_answers: DataTypes.STRING,
  shuffle_answers: DataTypes.BOOLEAN
}, { tableName: 'question_matching', timestamps: false });

const QuestionMatchingSub = sequelize.define('question_matching_sub', {
  subquestion_id: { type: DataTypes.INTEGER, primaryKey: true },
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  text: DataTypes.STRING,
  letter: DataTypes.STRING,
  column_assigned: DataTypes.INTEGER
}, { tableName: 'question_matching_sub', timestamps: false });

class AnswerModel {
  constructor() {
    this.QuestionMatching = QuestionMatching;
    this.QuestionMatchingSub = QuestionMatchingSub;
  }

  async findMany(questionId) {
    try {
      const res = await this.QuestionMatchingSub.findAll({
        where: { question_id: questionId },
        attributes: ['subquestion_id', 'letter', 'text', 'column_assigned'],
        order: [['subquestion_id', 'ASC']]
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addQuestion(questionId, correctAnswers, shuffleAnswers) {
    try {
      const res = await this.QuestionMatching.create({
        question_id: questionId,
        correct_answers: correctAnswers,
        shuffle_answers: shuffleAnswers
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async addMany(leftItems, rightItems, questionId) {
    const records = [];
    for (let i = 0; i < leftItems.length; i++) {
      records.push({
        subquestion_id: i + 1,
        question_id: questionId,
        text: leftItems[i].item,
        letter: leftItems[i].letter,
        column_assigned: 1
      });
    }
    for (let i = 0; i < rightItems.length; i++) {
      records.push({
        subquestion_id: i + 1,
        question_id: questionId,
        text: rightItems[i].item,
        letter: rightItems[i].letter,
        column_assigned: 2
      });
    }
    try {
      const res = await this.QuestionMatchingSub.bulkCreate(records);
      return { error: null, response: { affectedRows: res.length } };
    } catch (error) {
      return { error };
    }
  }

  async saveMany(items, questionId) {
    try {
      const promises = items.map(({ subquestion_id, text, item, letter, column_assigned }) =>
        this.QuestionMatchingSub.update(
          { letter, text: item ? item : text },
          { where: { subquestion_id, question_id: questionId, column_assigned } }
        )
      );
      const results = await Promise.all(promises);
      const affectedRows = results.reduce((a, [c]) => a + c, 0);
      return { error: null, response: { affectedRows } };
    } catch (error) {
      return { error };
    }
  }

  async saveMatchingQuestion(correctAnswers, questionId) {
    try {
      const [rows] = await this.QuestionMatching.update({ correct_answers: correctAnswers }, { where: { question_id: questionId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = AnswerModel;
