const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuestionType = sequelize.define('question_type', {
  type_id: { type: DataTypes.INTEGER, primaryKey: true },
  type_name: DataTypes.STRING
}, { tableName: 'question_type', timestamps: false });

class QuestionTypeModel {
  constructor() {
    this.QuestionType = QuestionType;
  }

  async findAll() {
    try {
      const res = await this.QuestionType.findAll();
      return { error: null, response: res.map(r => r.toJSON()) };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = QuestionTypeModel;
