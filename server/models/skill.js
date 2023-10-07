const database = new (require("../config/database"))();

class SkillModel {
  constructor() {
    this.db = database;
  }

  async findAll() {
    return await this.db.executeQuery(`SELECT * FROM quiz_skill`);
  }
}

module.exports = SkillModel;