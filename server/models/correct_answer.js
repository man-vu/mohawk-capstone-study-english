const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const Question = sequelize.define('question', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  type_id: DataTypes.INTEGER,
  instruction_id: DataTypes.INTEGER,
  is_active: DataTypes.BOOLEAN
}, { tableName: 'question', timestamps: false });

const QuizQuestion = sequelize.define('quiz_question', {
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true },
  question_id: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'quiz_question', timestamps: false });

const QuestionMultipleChoice = sequelize.define('question_multiple_choice', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  choice_id: { type: DataTypes.INTEGER, primaryKey: true },
  choice_text: DataTypes.STRING,
  is_correct_choice: DataTypes.BOOLEAN
}, { tableName: 'question_multiple_choice', timestamps: false });

const QuestionGapFilling = sequelize.define('question_gap_filling', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  sequence_id: { type: DataTypes.INTEGER, primaryKey: true },
  correct_answer: DataTypes.STRING
}, { tableName: 'question_gap_filling', timestamps: false });

const QuestionMatching = sequelize.define('question_matching', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  correct_answers: DataTypes.STRING
}, { tableName: 'question_matching', timestamps: false });

Question.hasMany(QuestionMultipleChoice, { foreignKey: 'question_id' });
Question.hasMany(QuestionGapFilling, { foreignKey: 'question_id' });
Question.hasOne(QuestionMatching, { foreignKey: 'question_id' });

class CorrectAnswerModel {
  constructor() {}

  async findAll(quizId) {
    try {
      const questions = await Question.findAll({
        where: { is_active: 1 },
        include: [
          { model: QuizQuestion, where: { quiz_id: quizId }, attributes: [] },
          { model: QuestionMultipleChoice, attributes: ['choice_text', 'choice_id', 'is_correct_choice'], required: false },
          { model: QuestionGapFilling, attributes: ['sequence_id', 'correct_answer'], required: false },
          { model: QuestionMatching, attributes: ['correct_answers'], required: false }
        ],
        attributes: ['question_id', 'type_id'],
        order: [
          ['question_id', 'ASC'],
          [QuestionMultipleChoice, 'choice_id', 'ASC'],
          [QuestionGapFilling, 'sequence_id', 'ASC']
        ]
      });

      const output = [];
      for (const q of questions) {
        const data = q.toJSON();
        const correctAnswers = data.question_matching ? data.question_matching.correct_answers : null;
        if (data.question_multiple_choices.length > 0) {
          data.question_multiple_choices.forEach(c => output.push({
            question_id: data.question_id,
            choice_text: c.choice_text,
            choice_id: c.choice_id,
            is_correct_choice: c.is_correct_choice,
            sequence_id: null,
            correct_answer: null,
            correct_answers: correctAnswers,
            type_id: data.type_id
          }));
        }
        if (data.question_gap_fillings.length > 0) {
          data.question_gap_fillings.forEach(g => output.push({
            question_id: data.question_id,
            choice_text: null,
            choice_id: null,
            is_correct_choice: null,
            sequence_id: g.sequence_id,
            correct_answer: g.correct_answer,
            correct_answers: correctAnswers,
            type_id: data.type_id
          }));
        }
        if (data.question_multiple_choices.length === 0 && data.question_gap_fillings.length === 0) {
          output.push({
            question_id: data.question_id,
            choice_text: null,
            choice_id: null,
            is_correct_choice: null,
            sequence_id: null,
            correct_answer: null,
            correct_answers: correctAnswers,
            type_id: data.type_id
          });
        }
      }
      return { error: null, response: output };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = CorrectAnswerModel;
