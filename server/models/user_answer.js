const database = new (require("../config/database"))();

class UserAnswerModel {
  constructor() {
    this.db = database;
  }

  async findAll({ quizId, userId, attemptId }) {
    return await this.db.executeQuery(`SELECT ua.*, q.type_id
    FROM user_answer_question ua JOIN question q ON q.question_id = ua.question_id
    WHERE ua.quiz_id = ${quizId} AND ua.user_id = ${userId} AND ua.attempt_id = ${attemptId} AND q.is_active = 1
    ORDER BY ua.question_id ASC`);
  }

  async findAllAssociatedWithLatestAttempts({ userId }) {
    return await this.db
      .executeQuery(`SELECT * FROM user_answer_question uaq INNER JOIN (SELECT quiz_id, MAX(attempt_id) as latest_attempt_id FROM user_attempt WHERE user_id = ${userId} GROUP BY quiz_id) ua
    ON uaq.quiz_id = ua.quiz_id AND uaq.attempt_id = ua.latest_attempt_id
	WHERE user_id = ${userId} `);
  }

  async closeOne({ quizId, userId, attemptId, grade }) {
    return await this.db.executeQuery(``);
  }

  async markOne(items) {
    let query = ""

    for ( const {quizId, userId, attemptId, questionId, markedResult} of items) {
      query += `UPDATE user_answer_question SET is_correct = ${markedResult} WHERE user_id = ${userId} AND quiz_id = ${quizId} AND attempt_id = ${attemptId} AND question_id = ${questionId};\n`
    }

    return await this.db.executeQuery(query);
  }

  async saveOne({ quizId, userId, attemptId, questionId, answerText }) {
    return await this.db.executeQuery(`UPDATE user_answer_question
    SET answer_text = '${answerText}'
    WHERE quiz_id = ${quizId} AND user_id = ${userId} AND attempt_id = ${attemptId} AND question_id = ${questionId}`);
  }
}

module.exports = UserAnswerModel;
