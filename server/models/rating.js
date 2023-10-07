const database = new (require("../config/database"))();

class RatingModel {
  constructor() {
    this.db = database;
  }

  async findOne(quizId, userId) {
    return await this.db.executeQuery(`SELECT rating_given FROM user_rating
    WHERE user_rating.user_id = ${userId} AND user_rating.quiz_id = ${quizId}`)  
  }

  async findOneByQuizId(quizId, userId) {
    return await this.db.executeQuery(`SELECT COALESCE((SELECT COUNT(ur.rating_given) FROM user_rating ur JOIN quiz q ON ur.quiz_id = q.quiz_id WHERE q.quiz_id = ${quizId}), 0) AS rating_count,
    COALESCE((SELECT AVG(ur.rating_given) FROM user_rating ur JOIN quiz q ON ur.quiz_id = q.quiz_id WHERE q.quiz_id = ${quizId} GROUP BY q.quiz_id), 0.0) AS average_rating,
    COALESCE((SELECT ur.rating_given FROM user_rating ur JOIN quiz q ON ur.quiz_id = q.quiz_id WHERE q.quiz_id = ${quizId}  AND ur.user_id = ${userId}), 0) as rating_given`)  
  }

  async findAll() {
    return await this.db.executeQuery(`SELECT quiz_id, AVG(user_rating.rating_given) as average_rating, COUNT(user_rating.rating_given) as rating_count FROM user_rating GROUP BY quiz_id`);
  }

  async addOne({quizId, userId, ratingGiven}) {
    return await this.db.executeQuery(`INSERT INTO user_rating (user_id, quiz_id, rating_given) VALUES ('${userId}', '${quizId}', '${ratingGiven}')`)
  }

  async saveOne({quizId, userId, ratingGiven}) {
    return await this.db.executeQuery(`UPDATE user_rating 
    SET rating_given = '${ratingGiven}'
    WHERE user_rating.user_id = ${userId} AND user_rating.quiz_id = ${quizId}`)
  }

  async deleteOne(quizId, userId) {
    return await this.db.executeQuery(`DELETE FROM user_rating 
    WHERE user_rating.user_id = ${userId} AND user_rating.quiz_id = ${quizId}`)
  }

  async deleteAll(quizId) {
    return await this.db.executeQuery(`DELETE FROM user_rating 
    WHERE user_rating.quiz_id = ${quizId}`)
  }
}

module.exports = RatingModel;