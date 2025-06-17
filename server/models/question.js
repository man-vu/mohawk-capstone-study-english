const { DataTypes, fn, col } = require('sequelize');
const sequelize = require('../config/orm');

const Question = sequelize.define('question', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  type_id: DataTypes.INTEGER,
  instruction_id: DataTypes.INTEGER,
  is_active: DataTypes.BOOLEAN,
  paragraph_title: DataTypes.STRING,
  question: DataTypes.TEXT
}, {
  tableName: 'question',
  timestamps: false
});

const QuestionMatching = sequelize.define('question_matching', {
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  correct_answers: DataTypes.STRING,
  shuffle_answers: DataTypes.BOOLEAN
}, { tableName: 'question_matching', timestamps: false });

const QuestionType = sequelize.define('question_type', {
  type_id: { type: DataTypes.INTEGER, primaryKey: true },
  type_name: DataTypes.STRING
}, { tableName: 'question_type', timestamps: false });

const QuestionInstruction = sequelize.define('question_instruction', {
  instruction_id: { type: DataTypes.INTEGER, primaryKey: true },
  instruction: DataTypes.STRING
}, { tableName: 'question_instruction', timestamps: false });

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

const QuestionMatchingSub = sequelize.define('question_matching_sub', {
  subquestion_id: { type: DataTypes.INTEGER, primaryKey: true },
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  text: DataTypes.STRING,
  letter: DataTypes.STRING,
  column_assigned: DataTypes.INTEGER
}, { tableName: 'question_matching_sub', timestamps: false });

const UserAnswerQuestion = sequelize.define('user_answer_question', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true },
  attempt_id: { type: DataTypes.INTEGER, primaryKey: true },
  question_id: { type: DataTypes.INTEGER, primaryKey: true },
  answer_text: DataTypes.STRING,
  is_correct: DataTypes.INTEGER
}, { tableName: 'user_answer_question', timestamps: false });

Question.belongsTo(QuestionType, { foreignKey: 'type_id' });
Question.belongsTo(QuestionInstruction, { foreignKey: 'instruction_id' });
Question.hasOne(QuestionMatching, { foreignKey: 'question_id' });

class QuestionModel {
  constructor() {
    this.Question = Question;
  }

  async findOne(id) {
    try {
      const q = await this.Question.findByPk(id);
      return { error: null, response: q ? [q.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findManyByQuestionId() {}

  async findOneForEdit(questionId) {
    try {
      const q = await this.Question.findOne({
        where: { question_id: questionId },
        include: [
          { model: QuestionMatching, attributes: ['correct_answers'], required: false },
          { model: QuestionType, attributes: ['type_name'] },
          { model: QuestionInstruction, attributes: ['instruction'] }
        ]
      });
      if (!q) return { error: null, response: [] };
      const obj = q.toJSON();
      obj.matching_question_correct_answers = obj.question_matching ? obj.question_matching.correct_answers : '';
      obj.type_name = obj.question_type.type_name;
      obj.instruction = obj.question_instruction.instruction;
      delete obj.question_matching;
      delete obj.question_type;
      delete obj.question_instruction;
      return { error: null, response: [obj] };
    } catch (error) {
      return { error };
    }
  }

  async loadContent(quizId) {
    try {
      const res = await this.Question.findAll({
        where: { is_active: 1 },
        include: [
          { model: QuizQuestion, where: { quiz_id: quizId }, attributes: [] },
          { model: QuestionMultipleChoice, attributes: ['choice_id', 'choice_text', 'is_correct_choice'], required: false },
          { model: QuestionGapFilling, attributes: ['sequence_id', 'correct_answer'], required: false },
          { model: QuestionMatchingSub, attributes: ['letter', 'subquestion_id', 'text', 'column_assigned'], required: false }
        ],
        attributes: ['question_id'],
        order: [
          ['question_id', 'ASC'],
          [QuestionMultipleChoice, 'choice_id', 'ASC'],
          [QuestionGapFilling, 'sequence_id', 'ASC'],
          [QuestionMatchingSub, 'subquestion_id', 'ASC']
        ]
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findManyByQuizIdForEdit(quizId) {
    try {
      const qs = await this.Question.findAll({
        include: [
          { model: QuizQuestion, where: { quiz_id: quizId }, attributes: [] },
          { model: QuestionInstruction, attributes: ['instruction'] },
          { model: QuestionType, attributes: ['type_name'] }
        ],
        order: [['question_id', 'ASC']]
      });
      const res = qs.map(q => {
        const obj = q.toJSON();
        obj.instruction = obj.question_instruction.instruction;
        obj.type_name = obj.question_type.type_name;
        delete obj.question_instruction;
        delete obj.question_type;
        return obj;
      });
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findManyByQuizId({quizId, userId, attemptId}) {
    try {
      const include = [
        { model: QuizQuestion, where: { quiz_id: quizId }, attributes: [] },
        { model: QuestionInstruction, attributes: ['instruction'] },
        { model: QuestionType, attributes: ['type_name'] }
      ];
      if (attemptId && userId) {
        include.push({
          model: UserAnswerQuestion,
          where: { quiz_id: quizId, user_id: userId, attempt_id: attemptId },
          required: false
        });
      }
      const qs = await this.Question.findAll({
        where: { is_active: 1 },
        include,
        order: [['question_id', 'ASC']]
      });
      const res = qs.map(q => {
        const obj = q.toJSON();
        obj.instruction = obj.question_instruction.instruction;
        obj.type_name = obj.question_type.type_name;
        delete obj.question_instruction;
        delete obj.question_type;
        return obj;
      });
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findNumberOfQuestions() {
    try {
      const res = await QuizQuestion.findAll({
        attributes: ['quiz_id', [sequelize.fn('COUNT', sequelize.col('question_id')), 'number_of_questions']],
        group: ['quiz_id']
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addOne({ typeId, instructionId, isActive, paragraphTitle, question }) {
    try {
      const res = await this.Question.create({
        type_id: typeId,
        instruction_id: instructionId,
        is_active: isActive,
        paragraph_title: paragraphTitle || null,
        question
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }
  
  async deleteOne(questionId) {
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS=0');
      await UserAnswerQuestion.destroy({ where: { question_id: questionId } });
      await QuizQuestion.destroy({ where: { question_id: questionId } });
      await QuestionMultipleChoice.destroy({ where: { question_id: questionId } });
      await QuestionGapFilling.destroy({ where: { question_id: questionId } });
      await QuestionMatchingSub.destroy({ where: { question_id: questionId } });
      await QuestionMatching.destroy({ where: { question_id: questionId } });
      const rows = await this.Question.destroy({ where: { question_id: questionId } });
      await sequelize.query('SET FOREIGN_KEY_CHECKS=1');
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async saveOne({ typeId, questionId, instructionId, isActive, paragraphTitle, question}) {
    try {
      let values;
      if (typeId == 2) {
        [values] = await this.Question.update({
          instruction_id: instructionId,
          is_active: isActive,
          paragraph_title: paragraphTitle
        }, { where: { question_id: questionId } });
      } else {
        [values] = await this.Question.update({
          instruction_id: instructionId,
          is_active: isActive,
          question
        }, { where: { question_id: questionId } });
      }
      return { error: null, response: { affectedRows: values } };
    } catch (error) {
      return { error };
    }

  }
}

module.exports = QuestionModel;
