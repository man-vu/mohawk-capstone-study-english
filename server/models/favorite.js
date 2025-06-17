const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const UserFavorite = sequelize.define('user_favorite', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true },
  quiz_id: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'user_favorite', timestamps: false });

class FavoriteModel {
  constructor() {
    this.UserFavorite = UserFavorite;
  }

  async findOne(quizId, userId) {
    try {
      const count = await this.UserFavorite.count({ where: { quiz_id: quizId, user_id: userId } });
      return { error: null, response: [{ favorite: count }] };
    } catch (error) {
      return { error };
    }
  }

  async addOne(quizId, userId) {
    try {
      const res = await this.UserFavorite.create({ user_id: userId, quiz_id: quizId });
      return { error: null, response: { affectedRows: res ? 1 : 0 } };
    } catch (error) {
      return { error };
    }
  }

  async deleteOne(quizId, userId) {
    try {
      const rows = await this.UserFavorite.destroy({ where: { user_id: userId, quiz_id: quizId } });
      return { error: null, response: { affectedRows: rows } };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = FavoriteModel;