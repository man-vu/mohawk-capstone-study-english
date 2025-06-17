const { DataTypes, QueryTypes } = require('sequelize');
const sequelize = require('../config/orm');

const UserRating = sequelize.define('user_rating', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true },
  rating_given: DataTypes.INTEGER
}, { tableName: 'user_rating', timestamps: false });

class RatingModel {
  constructor() {
    this.UserRating = UserRating;
  }

  async findOne(quizId, userId) {
    try {
      const rating = await this.UserRating.findOne({
        where: { quiz_id: quizId, user_id: userId },
        attributes: ['rating_given']
      });
      return { error: null, response: rating ? [rating.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }

  async findOneByQuizId(quizId, userId) {
    try {
      const res = await sequelize.query(
        `SELECT COALESCE((SELECT COUNT(ur.rating_given) FROM user_rating ur JOIN quiz q ON ur.quiz_id = q.quiz_id WHERE q.quiz_id = :quizId), 0) AS rating_count,
        COALESCE((SELECT AVG(ur.rating_given) FROM user_rating ur JOIN quiz q ON ur.quiz_id = q.quiz_id WHERE q.quiz_id = :quizId GROUP BY q.quiz_id), 0.0) AS average_rating,
        COALESCE((SELECT ur.rating_given FROM user_rating ur JOIN quiz q ON ur.quiz_id = q.quiz_id WHERE q.quiz_id = :quizId  AND ur.user_id = :userId), 0) as rating_given`,
        { replacements: { quizId, userId }, type: QueryTypes.SELECT }
      );
      return { error: null, response: res };
    } catch (error) {
      return { error };
    }
  }

  async findAll() {
    try {
      const res = await this.UserRating.findAll({
        attributes: [
          'quiz_id',
          [sequelize.fn('AVG', sequelize.col('rating_given')), 'average_rating'],
          [sequelize.fn('COUNT', sequelize.col('rating_given')), 'rating_count']
        ],
        group: ['quiz_id']
      });
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }

  async addOne({quizId, userId, ratingGiven}) {
    try {
      const res = await this.UserRating.create({
        user_id: userId,
        quiz_id: quizId,
        rating_given: ratingGiven
      });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async saveOne({quizId, userId, ratingGiven}) {
    try {
      const [rows] = await this.UserRating.update({ rating_given: ratingGiven }, { where: { user_id: userId, quiz_id: quizId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(quizId, userId) {
    try {
      const rows = await this.UserRating.destroy({ where: { user_id: userId, quiz_id: quizId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }

  async deleteAll(quizId) {
    try {
      const rows = await this.UserRating.destroy({ where: { quiz_id: quizId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = RatingModel;