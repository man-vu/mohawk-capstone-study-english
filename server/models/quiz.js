const { DataTypes, literal, fn, col, Op } = require('sequelize');
const sequelize = require('../config/orm');

const Quiz = sequelize.define('quiz', {
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true },
  course_name: DataTypes.STRING,
  skill_id: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  is_active: DataTypes.BOOLEAN,
  time_allowed: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, { tableName: 'quiz', timestamps: false });

const QuizSkill = sequelize.define('quiz_skill', {
  skill_id: { type: DataTypes.INTEGER, primaryKey: true },
  skill_description: DataTypes.STRING
}, { tableName: 'quiz_skill', timestamps: false });

const UserAttempt = sequelize.define('user_attempt', {
  user_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER,
  attempt_id: DataTypes.INTEGER,
  start_time: DataTypes.DATE,
  end_time: DataTypes.DATE,
  remaining_time: DataTypes.INTEGER,
  grade: DataTypes.DECIMAL(5,2)
}, { tableName: 'user_attempt', timestamps: false });

const QuizQuestion = sequelize.define('quiz_question', {
  quiz_id: DataTypes.INTEGER,
  question_id: DataTypes.INTEGER
}, { tableName: 'quiz_question', timestamps: false });

const UserAnswerQuestion = sequelize.define('user_answer_question', {
  quiz_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  attempt_id: DataTypes.INTEGER,
  question_id: DataTypes.INTEGER
}, { tableName: 'user_answer_question', timestamps: false });

const UserFavorite = sequelize.define('user_favorite', {
  user_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER
}, { tableName: 'user_favorite', timestamps: false });

const UserRating = sequelize.define('user_rating', {
  user_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER,
  rating_given: DataTypes.INTEGER
}, { tableName: 'user_rating', timestamps: false });

Quiz.belongsTo(QuizSkill, { foreignKey: 'skill_id' });

class QuizModel {
  constructor() {
    this.Quiz = Quiz;
  }

  async findAllForTeacher() {
    try {
      const quizzes = await Quiz.findAll({
        include: [{ model: QuizSkill, attributes: ['skill_description'] }],
        attributes: {
          include: [
            [literal('(SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id)'), 'attempts'],
            [literal('(SELECT COUNT(*) FROM quiz_question WHERE quiz_question.quiz_id = quiz.quiz_id)'), 'number_of_questions'],
            [literal('COALESCE((SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0.0)'), 'average_rating'],
            [literal('COALESCE((SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0)'), 'rating_count']
          ]
        }
      });
      const res = quizzes.map(q => {
        const obj = q.toJSON();
        obj.skill_description = obj.quiz_skill.skill_description;
        delete obj.quiz_skill;
        return obj;
      });
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findAll() {
    try {
      const res = await Quiz.findAll();
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findLatestAttemptsForAllQuizzes(userId) {
    try {
      const latest = await UserAttempt.findAll({
        where: { user_id: userId },
        attributes: ['quiz_id', [fn('MAX', col('attempt_id')), 'latest_attempt_id']],
        group: ['quiz_id'],
        raw: true
      });
      const attempts = await Promise.all(latest.map(l =>
        UserAttempt.findOne({ where: { user_id: userId, quiz_id: l.quiz_id, attempt_id: l.latest_attempt_id } })
      ));
      return { error: null, response: attempts.filter(a => a).map(a => a.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async findDetailed(quizId) {
    try {
      const quiz = await Quiz.findOne({
        where: { quiz_id: quizId },
        include: [{ model: QuizSkill, attributes: ['skill_description'] }],
        attributes: {
          include: [
            [literal('(SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id)'), 'attempts'],
            [literal('(SELECT COUNT(*) FROM quiz_question WHERE quiz_question.quiz_id = quiz.quiz_id)'), 'number_of_questions'],
            [literal('(SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id)'), 'average_rating'],
            [literal('(SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id)'), 'rating_count']
          ]
        }
      });
      return { error: null, response: quiz ? [quiz.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findOne(id) {
    try {
      const quiz = await Quiz.findByPk(id);
      return { error: null, response: quiz ? [quiz.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async addOne({ courseName, description, isActive, timeAllowed, skillId, userId }) {
    try {
      const res = await Quiz.create({
        course_name: courseName,
        description,
        is_active: isActive,
        time_allowed: timeAllowed,
        skill_id: skillId,
        created_by: userId
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async saveOne({ quizId, courseName, description, isActive, timeAllowed, skillId, userId }) {
    try {
      const [rows] = await Quiz.update({
        course_name: courseName,
        description,
        is_active: isActive,
        time_allowed: timeAllowed,
        skill_id: skillId,
        created_by: userId
      }, { where: { quiz_id: quizId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(quizId) {
    try {
      await sequelize.transaction(async t => {
        await UserAnswerQuestion.destroy({ where: { quiz_id: quizId }, transaction: t });
        await UserAttempt.destroy({ where: { quiz_id: quizId }, transaction: t });
        await UserFavorite.destroy({ where: { quiz_id: quizId }, transaction: t });
        await UserRating.destroy({ where: { quiz_id: quizId }, transaction: t });
        await QuizQuestion.destroy({ where: { quiz_id: quizId }, transaction: t });
        await Quiz.destroy({ where: { quiz_id: quizId }, transaction: t });
      });
      return { error: null, response: { affectedRows: 1 } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = QuizModel;
