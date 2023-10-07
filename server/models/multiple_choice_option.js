const database = new (require("../config/database"))();

class MultipleChoiceOptionModel {
  constructor() {
    this.db = database;
  }

  async findMany(questionId) {
    return await this.db.executeQuery(`SELECT qmc.choice_id, qmc.choice_text, qmc.is_correct_choice
    FROM question q 
    JOIN question_multiple_choice qmc ON q.question_id = qmc.question_id
    WHERE q.question_id = ${questionId}
    ORDER BY choice_id`)
  }

  async addMany(items, questionId) {
    let query = `INSERT INTO question_multiple_choice (question_id, choice_id, choice_text, is_correct_choice) VALUES `;

    for (let i = 0; i < items.length; i++) {
      query = query.concat(
        `(${questionId}, ${items[i].choice_id}, '${items[i].choice_text}', '${items[i].is_correct_choice}'), `
      );
    }

    let formattedQuery = query.substring(0, query.length - 2);

    return await this.db.executeQuery(formattedQuery)
  }

  async saveMany(items, questionId) {
    let query = ''
    for (const { choice_id, choice_text, is_correct_choice} of items) {
      query += `UPDATE question_multiple_choice SET choice_text = '${choice_text}', is_correct_choice = ${is_correct_choice} WHERE choice_id = ${choice_id} AND question_id = ${questionId};`;
    }
    
    return await this.db.executeQuery(query)
  }
}

module.exports = MultipleChoiceOptionModel;