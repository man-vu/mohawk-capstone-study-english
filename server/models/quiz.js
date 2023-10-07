const database = new (require("../config/database"))();

class QuizModel {
  constructor() {
    this.db = database;
  }

  async findAllForTeacher() {
    return await this.db.executeQuery(`SELECT quiz.*, quiz_skill.skill_description, 
      (SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id) as attempts,
      (SELECT COUNT(*) FROM quiz_question WHERE quiz.quiz_id = quiz_question.quiz_id) AS 'number_of_questions',
      COALESCE((SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0.0) as average_rating,
      COALESCE((SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0) as rating_count
      FROM quiz JOIN quiz_skill ON quiz.skill_id = quiz_skill.skill_id`);
  }

  async findAll() {
    return await this.db.executeQuery("SELECT * FROM quiz");
  }

  async findLatestAttemptsForAllQuizzes(userId) {
    return await this.db.execute(`
    SELECT * FROM user_attempt ua1 INNER JOIN (SELECT quiz_id, MAX(attempt_id) as latest_attempt_id FROM user_attempt WHERE user_id = ${userId} GROUP BY quiz_id) ua2
    ON ua1.quiz_id = ua2.quiz_id AND ua1.attempt_id = ua2.latest_attempt_id
	WHERE user_id = ${userId} `);
  }

  async findDetailed(quizId) {
    return await this.db
      .executeQuery(`SELECT quiz.*, quiz_skill.skill_description, 
    (SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id) as attempts,
    (SELECT COUNT(*) FROM quiz_question WHERE quiz.quiz_id = quiz_question.quiz_id) AS 'number_of_questions',
    (SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id) as average_rating,
    (SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id) as rating_count
    FROM quiz JOIN quiz_skill ON quiz.skill_id = quiz_skill.skill_id
    WHERE quiz.quiz_id = ${quizId}`);
  }

  async findOne(id) {
    return await this.db.executeQuery(
      `SELECT (SELECT CONCAT(u.first_name, ' ', u.last_name)) as full_name, dp.created_at as posted_at, u.created_at as member_since, dp.content, 
      (SELECT COUNT(*) FROM discussion_thread dt1 WHERE dt1.user_id = u.user_id) as thread_count,
      (SELECT COUNT(*) FROM discussion_post dp1 WHERE dp1.user_id = u.user_id) as post_count
      FROM discussion_post dp JOIN user u ON dp.user_id = u.user_id
      WHERE dp.post_id = ${id}`
    );
  }

  async addOne({
    courseName,
    description,
    isActive,
    timeAllowed,
    skillId,
    userId,
  }) {
    return await this.db
      .executeQuery(`INSERT INTO quiz (course_name, description, is_active, time_allowed, skill_id, created_by) 
    VALUES ('${courseName}', '${description}', '${isActive}', '${timeAllowed}', '${skillId}', '${userId}')`);
  }

  async saveOne({
    quizId,
    courseName,
    description,
    isActive,
    timeAllowed,
    skillId,
    userId,
  }) {
    return await this.db.executeQuery(`UPDATE quiz 
    SET course_name = '${courseName}', 
        description = '${description}', 
        is_active = '${isActive}', 
        time_allowed = '${timeAllowed}', 
        skill_id = '${skillId}', 
        created_by = '${userId}'
    WHERE quiz_id = '${quizId}'`);
  }

  async deleteOne(quizId) {
    return await this.db.executeQuery(`SET FOREIGN_KEY_CHECKS=0;
    DELETE FROM user_answer_question WHERE quiz_id = ${quizId};
    DELETE FROM user_attempt WHERE quiz_id = ${quizId};
    DELETE FROM user_favorite WHERE quiz_id = ${quizId};
    DELETE FROM user_rating WHERE quiz_id = ${quizId};
    DELETE FROM quiz_question WHERE quiz_id = ${quizId};
    DELETE FROM quiz WHERE quiz_id = ${quizId};
    SET FOREIGN_KEY_CHECKS=1`);
  }
}

module.exports = QuizModel;
