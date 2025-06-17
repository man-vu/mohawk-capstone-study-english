const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuizSkill = sequelize.define('quiz_skill', {
  skill_id: { type: DataTypes.INTEGER, primaryKey: true },
  skill_description: DataTypes.STRING
}, { tableName: 'quiz_skill', timestamps: false });

class SkillModel {
  constructor() {
    this.QuizSkill = QuizSkill;
  }

  async findAll() {
    try {
      const skills = await this.QuizSkill.findAll();
      return { error: null, response: skills.map(s => s.toJSON()) };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = SkillModel;