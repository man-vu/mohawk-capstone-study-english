const { DataTypes } = require('sequelize');
const sequelize = require('../config/orm');

const QuestionInstruction = sequelize.define('question_instruction', {
  instruction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  instruction: DataTypes.STRING
}, { tableName: 'question_instruction', timestamps: false });

class InstructionModel {
  constructor() {
    this.QuestionInstruction = QuestionInstruction;
  }

  async addOne(instruction) {
    try {
      const [res] = await this.QuestionInstruction.findOrCreate({
        where: { instruction },
        defaults: { instruction }
      });
      return { error: null, response: { affectedRows: res ? 1 : 0, instruction_id: res.instruction_id } };
    } catch (error) {
      return { error };
    }
  }

  async findOne(instruction) {
    try {
      const res = await this.QuestionInstruction.findOne({
        where: { instruction },
        attributes: ['instruction_id']
      });
      return { error: null, response: res ? [res.toJSON()] : [] };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = InstructionModel;
