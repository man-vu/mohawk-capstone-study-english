const database = new (require("../config/database"))();

class GapFillingOptionModel {
  constructor() {
    this.db = database;
  }

  async findMany(questionId) {
    return await this.db.executeQuery(`SELECT qgf.sequence_id, qgf.correct_answer
    FROM question q 
    JOIN question_gap_filling qgf ON q.question_id = qgf.question_id
    WHERE q.question_id = ${questionId}
    ORDER BY sequence_id`)
  }

  async addMany(items, questionId) {
    let query = `INSERT INTO question_gap_filling (question_id, sequence_id, correct_answer) VALUES `;

    for (let i = 0; i < items.length; i++) {
      query = query.concat(
        `(${questionId}, ${items[i].sequence_id}, '${items[i].correct_answer}'), `
      );
    }

    let formattedQuery = query.substring(0, query.length - 2);

    return await this.db.executeQuery(formattedQuery)
  }

  async saveMany(items, questionId) {
    let query = ''
    for (const { sequence_id, correct_answer} of items) {
      query += `UPDATE question_gap_filling SET correct_answer = '${correct_answer}' WHERE sequence_id = ${sequence_id} AND question_id = ${questionId};`;
    }
    
    return await this.db.executeQuery(query)
  }
}

module.exports = GapFillingOptionModel;
