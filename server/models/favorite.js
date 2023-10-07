const database = new (require("../config/database"))();

class FavoriteModel {
  constructor() {
    this.db = database;
  }

  async findOne(quizId, userId) {
    return await this.db.executeQuery(`SELECT COUNT(*) as favorite FROM user_favorite 
    WHERE user_favorite.user_id = ${userId} AND user_favorite.quiz_id = ${quizId}`)  
  }

  async addOne(quizId, userId) {
    return await this.db.executeQuery(`
    INSERT INTO user_favorite (user_id, quiz_id) VALUES ('${userId}', '${quizId}')`)
  }

  async deleteOne(quizId, userId) {
    return await this.db.executeQuery(`DELETE FROM user_favorite 
    WHERE user_favorite.user_id = ${userId} AND user_favorite.quiz_id = ${quizId}`)
  }
}

module.exports = FavoriteModel;