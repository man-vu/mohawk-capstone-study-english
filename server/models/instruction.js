const database = new (require("../config/database"))();

class InstructionModel {
  constructor() {
    this.db = database;
  }

  async addOne(instruction) {
    return await this.db.executeQuery(`INSERT IGNORE INTO question_instruction(instruction) VALUES ('${instruction}')`)
  }

  async findOne(instruction) {
    return await this.db.executeQuery(`SELECT instruction_id FROM question_instruction WHERE instruction = '${instruction}'`)
  }
}

module.exports = InstructionModel;