const database = new (require("../config/database"))();

class QuizQuestionModel {
  constructor() {
    this.db = database;
  }

  async addOne(quizId, questionId) {
    return await this.db.executeQuery(`
    INSERT INTO quiz_question (quiz_id, question_id)
    VALUES ('${quizId}', '${questionId}')
    `);
  }

  async findOne(quizId, questionId) {
    return await this.db.executeQuery(
      `SELECT quiz_id, question_id FROM quiz_question WHERE quiz_id = ${quizId} AND question_id = ${questionId}`
    );
  }
}

module.exports = QuizQuestionModel;
