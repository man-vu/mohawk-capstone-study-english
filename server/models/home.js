const { DataTypes, literal } = require('sequelize');
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

Quiz.belongsTo(QuizSkill, { foreignKey: 'skill_id' });

class FavoriteModel {
  constructor() {
    this.Quiz = Quiz;
  }

  async getHomeSummary(userId) {
    try {
      const quizzes = await this.Quiz.findAll({
        where: { is_active: 1 },
        include: [{ model: QuizSkill, attributes: ['skill_description'] }],
        attributes: {
          include: [
            [literal('(SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id)'), 'attempts'],
            [literal('(SELECT COUNT(*) FROM quiz_question WHERE quiz_question.quiz_id = quiz.quiz_id)'), 'number_of_questions'],
            [literal('COALESCE((SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0.0)'), 'average_rating'],
            [literal('COALESCE((SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0)'), 'rating_count'],
            [literal(`COALESCE((SELECT user_rating.rating_given FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id AND user_rating.user_id = ${sequelize.escape(userId)}), 0)`), 'rating_given'],
            [literal(`COALESCE((SELECT COUNT(*) FROM user_favorite WHERE user_favorite.quiz_id = quiz.quiz_id AND user_favorite.user_id = ${sequelize.escape(userId)}), 0)`), 'favorite']
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

  async getHomeSummaryForGuest() {
    try {
      const quizzes = await this.Quiz.findAll({
        where: { is_active: 1 },
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
}

module.exports = FavoriteModel;
