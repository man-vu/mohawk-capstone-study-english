const database = new (require("../config/database"))();

class FavoriteModel {
  constructor() {
    this.db = database;
  }

  async getHomeSummary(userId) {
    return await this.db
      .executeQuery(`SELECT quiz.*, quiz_skill.skill_description, 
    (SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id) as attempts,
    (SELECT COUNT(*) FROM quiz_question WHERE quiz.quiz_id = quiz_question.quiz_id) AS 'number_of_questions',
    COALESCE((SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0.0) as average_rating,
    COALESCE((SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0) as rating_count,
    COALESCE((SELECT user_rating.rating_given FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id AND user_rating.user_id = ${userId}), 0) as rating_given,
    COALESCE((SELECT COUNT(*) FROM user_favorite WHERE user_favorite.quiz_id = quiz.quiz_id AND user_favorite.user_id = ${userId}), 0) as favorite
    FROM quiz JOIN quiz_skill ON quiz.skill_id = quiz_skill.skill_id
    WHERE quiz.is_active = 1`);
  }

  async getHomeSummaryForGuest() {
    return await this.db
      .executeQuery(`SELECT quiz.*, quiz_skill.skill_description, 
    (SELECT COUNT(*) FROM user_attempt WHERE user_attempt.quiz_id = quiz.quiz_id) as attempts,
    (SELECT COUNT(*) FROM quiz_question WHERE quiz.quiz_id = quiz_question.quiz_id) AS 'number_of_questions',
    COALESCE((SELECT AVG(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0.0) as average_rating,
    COALESCE((SELECT COUNT(user_rating.rating_given) FROM user_rating WHERE user_rating.quiz_id = quiz.quiz_id GROUP BY quiz_id), 0) as rating_count
    FROM quiz JOIN quiz_skill ON quiz.skill_id = quiz_skill.skill_id
    WHERE quiz.is_active = 1`);
  }
}

module.exports = FavoriteModel;
