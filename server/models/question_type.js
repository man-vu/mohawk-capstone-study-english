const database = new (require("../config/database"))();

class QuestionTypeModel {
  constructor() {
    this.db = database;
  }

  async findAll() {
    return await this.db.executeQuery(`SELECT * FROM question_type`);
  }
}

module.exports = QuestionTypeModel;
